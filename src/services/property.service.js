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
      city: 1
    })
      .populate('city').exec()
  },
  getPropertyById: async (propertyId) => {
    return Property.findById(propertyId).populate('city').exec();
  },
  getPropertyByIdEditView: async (propertyId) => {
    return Property.findById(propertyId).exec();
  },
  getPropertiesNonAuth: async (filterData) => {
    const whereCond = {};
    if (filterData?.title) {
      whereCond['title'] = { $regex: '.*' + filterData.title + '.*' };
    }
    if (filterData?.space) {
      whereCond['space'] = filterData.space;
    }
    if (filterData?.cityId) {
      whereCond['city'] = filterData.cityId;
    }
    if (filterData?.minHeight) {
      whereCond['sizeHeight'] = { $gte: parseInt(filterData.minHeight, 10) };
      if (filterData.minHeight == '1000+') {
        whereCond['sizeHeight'] = { $gte: 1000 };
      }
    }
    if (filterData?.minWidth) {
      whereCond['sizeWidth'] = { $gte: parseInt(filterData.minWidth, 10) };
      if (filterData.minWidth == '1000+') {
        whereCond['sizeHeight'] = { $gte: 1000 };
      }
    }
    if (filterData?.priceRange) {
      whereCond['rentPrice'] = filterData.priceRange;
    }
    if (filterData?.includePrintInstall) {
      whereCond['includePrintInstall'] = filterData.includePrintInstall == 'YES' ? true : false;
    }
    return Property.find(whereCond).populate('city').exec();
  },
  getLatestProperties: async (propertyId) => {
    const whereCond = {};
    if (propertyId) {
      whereCond['_id'] = { $ne: propertyId }
    }
    return Property.find(whereCond).populate('city').exec();
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
