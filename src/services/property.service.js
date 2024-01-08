const httpStatus = require('http-status');
const { PropertyType, PropertyStatus, Property, Amenities, City } = require('../models');
const ApiError = require('../utils/ApiError');
const fs = require('fs');

module.exports = {
  getPropertyTypes: async () => {
    return PropertyType.find()
  },
  getPropertyStatus: async () => {
    return PropertyStatus.find()
  },
  getAmenities: async () => {
    return Amenities.find()
  },
  getCities: async () => {
    return City.find()
  },
  createProperty: async (propertyBody) => {
    return Property.create(propertyBody);
  },
  updatePropertyById: async (propertyId, updateBody) => {
    // const property = await Property.findById(propertyId);
    // Object.assign(property, updateBody);
    // await property.save();
    const property = await Property.findByIdAndUpdate(propertyId, updateBody, { useFindAndModify: false });
    return property;
  },
  getUserProperties: async (userId) => {
    return Property.find({
      userId: userId
    }, {
      title: 1,
      propertyType: 1,
      propertyStatus: 1,
      city: 1
    })
      .populate('propertyType')
      .populate('city')
      .populate({ path: "propertyStatus", model: "PropertyStatus" }).exec()
  },
  getPropertyById: async (propertyId) => {
    return Property.findById(propertyId).populate('propertyType')
      .populate('amenities')
      .populate('city')
      .populate({ path: "propertyStatus", model: "PropertyStatus" }).exec();
  },
  getPropertyByIdEditView: async (propertyId) => {
    return Property.findById(propertyId).exec();
  },
  getPropertiesNonAuth: async (filterData) => {
    const whereCond = {};
    if (filterData?.title) {
      whereCond['title'] = { $regex: '.*' + filterData.title + '.*' };
    }
    if (filterData?.typeId) {
      whereCond['propertyType'] = filterData.typeId;
    }
    if (filterData?.statusId) {
      whereCond['propertyStatus'] = filterData.statusId;
    }
    if (filterData?.cityId) {
      whereCond['city'] = filterData.cityId;
    }
    if (filterData?.bedrooms) {
      whereCond['bedrooms'] = parseInt(filterData.bedrooms, 10);;
      if (filterData.bedrooms == '4+') {
        whereCond['bedrooms'] = { $gt: 4 };
      }
    }
    if (filterData?.bathrooms) {
      whereCond['bathrooms'] = parseInt(filterData.bathrooms, 10);
      if (filterData.bathrooms == '4+') {
        whereCond['bathrooms'] = { $gt: 4 };
      }
    }
    console.log('filterData?.salePrice', filterData?.salePrice)
    if (filterData?.salePrice) {
      const saleWhereCond = {};
      if (filterData.salePrice.includes('-')) {
        const salePrices = filterData.salePrice.split('-');
        saleWhereCond['salePrice'] = { $gte: parseInt(salePrices[0], 10), $lte: parseInt(salePrices[1], 10) };
      } else if (filterData.salePrice == '1000+') {
        saleWhereCond['salePrice'] = { $gt: 1000 };
      }
      whereCond['$or'] = [
        { hideSalePrice: true },
        saleWhereCond
      ]
    }
    console.log(`whereCond['$or']`, whereCond['$or']);
    console.log(`whereCond['bathrooms']`, whereCond['bathrooms']);
    if (filterData?.landDAApproved) {
      whereCond['landDAApproved'] = false;
      if (filterData.landDAApproved == 'YES') {
        whereCond['landDAApproved'] = true;
      }
    }
    if (filterData?.amenities?.length) {
      whereCond['amenities'] = { $in: filterData.amenities };
    }
    return Property.find(whereCond)
      .populate('propertyType')
      .populate('amenities')
      .populate('city')
      .populate({ path: "propertyStatus", model: "PropertyStatus" }).exec();
  },
  getLatestProperties: async (propertyId) => {
    const whereCond = {};
    if (propertyId) {
      whereCond['_id'] = { $ne: propertyId }
    }
    return Property.find(whereCond)
      .populate('propertyType')
      .populate('amenities')
      .populate('city')
      .populate({ path: "propertyStatus", model: "PropertyStatus" }).exec();
  },
  deletePropertyById: async (propertyId) => {
    if (!propertyId) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Property ID not found');
    }
    const propertyDetail = await Property.findById(propertyId);
    if (!propertyDetail?._id) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Property not found');
    }
    if (propertyDetail.images?.length) {
      for (const imageValue of propertyDetail.images) {
        if (imageValue.path && fs.existsSync(`./${imageValue.path}`)) {
          fs.unlinkSync(`./${imageValue.path}`);
        }
      }
    }
    if (propertyDetail.floorPlans?.length) {
      for (const floorPlanValue of propertyDetail.floorPlans) {
        if (floorPlanValue.path && fs.existsSync(`./${floorPlanValue.path}`)) {
          fs.unlinkSync(`./${floorPlanValue.path}`);
        }
      }
    }
    return Property.deleteOne({ _id: propertyId });
  }
};
