const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { propertyService } = require('../services');
const fs = require('fs');


module.exports = {
  getPropertyTypesList: catchAsync(async (req, res) => {
    const propertyTypes = await propertyService.getPropertyTypes();
    res.send(propertyTypes);
  }),
  getPropertyStatusList: catchAsync(async (req, res) => {
    const propertyStatus = await propertyService.getPropertyStatus();
    res.send(propertyStatus);
  }),
  getAmenitiesList: catchAsync(async (req, res) => {
    const amenities = await propertyService.getAmenities();
    res.send(amenities);
  }),
  getCityList: catchAsync(async (req, res) => {
    const cityList = await propertyService.getCities();
    res.send(cityList);
  }),
  createProperty: catchAsync(async (req, res) => {
    console.log('req.files', req.files.images);
    console.log('req.files.floorPlanImages', req.files.floorPlanImages);
    console.log('req.body', req.body.propertyData);
    const propertyData = JSON.parse(req.body.propertyData);
    const propertyImages = [];
    if (req.files.images?.length > 0) {
      req.files.images.forEach(imageValue => {
        propertyImages.push({
          imageName: imageValue.filename,
          path: `${imageValue.destination}/${imageValue.filename}`,
          originalName: imageValue.originalname,
          mimeType: imageValue.mimetype,
          size: imageValue.size
        })
      })
    }
    //propertyData.details.floorPlans
    const propertyFloorPlans = [];
    if (propertyData.details.floorPlans?.length > 0) {
      console.log('propertyData.details.floorPlans', propertyData.details.floorPlans);
      propertyData.details.floorPlans.forEach((floorPlanValue, floorPlanIndex) => {
        let imageValues = {};
        if (req.files.floorPlanImages?.length > 0 && req.files.floorPlanImages[floorPlanIndex] && req.files.floorPlanImages[floorPlanIndex].filename) {
          imageValues = req.files.floorPlanImages[floorPlanIndex];
        }
        propertyFloorPlans.push({
          title: floorPlanValue.title,
          imageName: imageValues?.filename || '',
          path: imageValues?.destination ? `${imageValues.destination}/${imageValues.filename}` : '',
          originalName: imageValues?.originalname || '',
          mimeType: imageValues?.mimetype || '',
          size: imageValues?.size || '',
        });
      });
    }
    const propertyInsertData = {
      userId: req.user.id,
      propertyType: propertyData.general.type,
      title: propertyData.general.title,
      areaName: propertyData.general.areaName,
      city: propertyData.general.city,
      address: propertyData.general.address,
      description: propertyData.general.description,
      propertyStatus: propertyData.general.propertyStatus,
      bedrooms: propertyData.details.bedrooms,
      bathrooms: propertyData.details.bathrooms,
      propertyAge: propertyData.details.propertyAge,
      landSize: propertyData.details.landSize,
      area: propertyData.details.area,
      salePrice: propertyData.details.salePrice,
      rentYield: propertyData.details.rentYield,
      weeklyCurrentRent: propertyData.details.weeklyCurrentRent,
      weeeklyRentalAppraisal: propertyData.details.weeeklyRentalAppraisal,
      propertyValueGrowth: propertyData.details.propertyValueGrowth,
      rentalMarketPrice: propertyData.details.rentalMarketPrice,
      vacancyRate: propertyData.details.vacancyRate,
      hideSalePrice: propertyData.details.hideSalePrice,
      parkingAvailable: propertyData.details.parkingAvailable,
      currentlyTenanted: propertyData.details.currentlyTenanted,
      fireZone: propertyData.details.fireZone,
      floodZone: propertyData.details.floodZone,
      landDAApproved: propertyData.details.landDAApproved,
      isBodyCorporate: propertyData.details.isBodyCorporate,
      bodyCorporateValue: propertyData.details.isBodyCorporate ? propertyData.details.bodyCorporateValue : '',
      amenities: propertyData.details.amenities.length > 0 ? propertyData.details.amenities : [],
      floorPlans: propertyFloorPlans,
      images: propertyImages,
      sellerName: propertyData.sellerDetails.sellerName,
      sellerEmail: propertyData.sellerDetails.sellerEmail,
      sellerNumber: propertyData.sellerDetails.sellerNumber,
      sellerAddress: propertyData.sellerDetails.sellerAddress,
    }
    const property = await propertyService.createProperty(propertyInsertData);
    console.log('property', property);
    res.status(httpStatus.CREATED).send(property);
  }),
  updateProperty: catchAsync(async (req, res) => {
    if (!req.params.propertyId) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Property ID Not found.`);
    }
    const existingPropertyDetail = await propertyService.getPropertyById(req.params.propertyId);
    if (!existingPropertyDetail?._id) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Property not found.`);
    }
    const existingImages = existingPropertyDetail.images;
    console.log('existingImages', existingImages);
    const existingFloorPlans = existingPropertyDetail.floorPlans;
    console.log('existingFloorPlans', existingFloorPlans);
    console.log('req.files.images', req.files.images);
    console.log('req.files.floorPlanImages', req.files.floorPlanImages);
    console.log('req.body', req.body.propertyData);
    const propertyData = JSON.parse(req.body.propertyData);
    console.log('propertyData.images', propertyData.images);
    const propertyImages = [];

    if (req.files.images?.length > 0) {
      req.files.images.forEach(imageValue => {
        propertyImages.push({
          imageName: imageValue.filename,
          path: `${imageValue.destination}/${imageValue.filename}`,
          originalName: imageValue.originalname,
          mimeType: imageValue.mimetype,
          size: imageValue.size
        })
      })
    }
    if (existingImages.length > 0) {
      for (const existingImage of existingImages) {
        const isNotTouched = propertyData.images.find(obj => obj._id == existingImage._id);
        console.log('isNotTouched', isNotTouched);
        if (!isNotTouched) {
          if (fs.existsSync(`./${existingImage.path}`)) {
            fs.unlinkSync(`./${existingImage.path}`);
          }
          continue;
        }
        propertyImages.push(existingImage);
      }
    }
    console.log('propertyImages', propertyImages);
    const propertyFloorPlans = [];
    console.log('req.files.floorPlanImages', req.files.floorPlanImages);
    console.log('propertyData.details.floorPlans', propertyData.details.floorPlans);
    if (existingFloorPlans.length > 0) {
      for (const existingFloorPlanValue of existingFloorPlans) {
        const isNotTouchedFloorValue = propertyData.details.floorPlans.find(obj => obj._id == existingFloorPlanValue._id);
        console.log('isNotTouchedFloorValue', isNotTouchedFloorValue);
        if (!isNotTouchedFloorValue) {
          if (fs.existsSync(`./${existingFloorPlanValue.path}`)) {
            fs.unlinkSync(`./${existingFloorPlanValue.path}`);
          }
          continue;
        }
      }
    }
    if (propertyData.details.floorPlans.length > 0) {
      for (const floorPlanValue of propertyData.details.floorPlans) {
        if (floorPlanValue.image?._id) {
          /* IMAGE IS CHANGED */
          if (!req.files.floorPlanImages?.length) {
            continue;
          };
          const fileInfo = req.files.floorPlanImages.find(obj =>
            obj.originalname == floorPlanValue.image.requestedFileName &&
            obj.size == floorPlanValue.image.requestedFileSize &&
            obj.mimetype == floorPlanValue.image.requestedFileType
          )
          if (!fileInfo) {
            continue;
          }
          propertyFloorPlans.push({
            title: floorPlanValue.title,
            imageName: fileInfo?.filename || '',
            path: fileInfo?.destination ? `${fileInfo.destination}/${fileInfo.filename}` : '',
            originalName: fileInfo?.originalname || '',
            mimeType: fileInfo?.mimetype || '',
            size: fileInfo?.size || '',
          });
          continue;
        }
        let existingItem = existingFloorPlans.find(obj => obj._id == floorPlanValue._id);
        propertyFloorPlans.push({
          title: floorPlanValue.title,
          imageName: existingItem?.imageName || '',
          path: existingItem?.path || '',
          originalName: existingItem?.originalName || '',
          mimeType: existingItem?.mimeType || '',
          size: existingItem?.size || '',
        });
      }
    }
    console.log('propertyFloorPlans', propertyFloorPlans);
    console.log('propertyData.details.bathrooms', propertyData.details.bathrooms);
    const propertyUpdateData = {
      userId: req.user.id,
      propertyType: propertyData.general.type,
      title: propertyData.general.title,
      areaName: propertyData.general.areaName,
      city: propertyData.general.city,
      address: propertyData.general.address,
      description: propertyData.general.description,
      propertyStatus: propertyData.general.propertyStatus,
      bedrooms: propertyData.details.bedrooms,
      bathrooms: propertyData.details.bathrooms,
      propertyAge: propertyData.details.propertyAge,
      landSize: propertyData.details.landSize,
      area: propertyData.details.area,
      salePrice: propertyData.details.salePrice,
      rentYield: propertyData.details.rentYield,
      weeklyCurrentRent: propertyData.details.weeklyCurrentRent,
      weeeklyRentalAppraisal: propertyData.details.weeeklyRentalAppraisal,
      propertyValueGrowth: propertyData.details.propertyValueGrowth,
      rentalMarketPrice: propertyData.details.rentalMarketPrice,
      vacancyRate: propertyData.details.vacancyRate,
      hideSalePrice: propertyData.details.hideSalePrice,
      parkingAvailable: propertyData.details.parkingAvailable,
      currentlyTenanted: propertyData.details.currentlyTenanted,
      fireZone: propertyData.details.fireZone,
      floodZone: propertyData.details.floodZone,
      landDAApproved: propertyData.details.landDAApproved,
      isBodyCorporate: propertyData.details.isBodyCorporate,
      bodyCorporateValue: propertyData.details.isBodyCorporate ? propertyData.details.bodyCorporateValue : '',
      amenities: propertyData.details.amenities.length > 0 ? propertyData.details.amenities : [],
      floorPlans: propertyFloorPlans,
      images: propertyImages,
      sellerName: propertyData.sellerDetails.sellerName,
      sellerEmail: propertyData.sellerDetails.sellerEmail,
      sellerNumber: propertyData.sellerDetails.sellerNumber,
      sellerAddress: propertyData.sellerDetails.sellerAddress,
    }
    const property = await propertyService.updatePropertyById(req.params.propertyId, propertyUpdateData);
    res.status(httpStatus.CREATED).send(property);
  }),
  updatePropertyCount: catchAsync(async (req, res) => {
    if (!req.body.propertyId) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Property ID Not found.`);
    }
    const existingPropertyDetail = await propertyService.getPropertyById(req.body.propertyId);
    if (!existingPropertyDetail?._id) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Property not found.`);
    }
    // const propertyUpdateData = {
    //   userView: existingPropertyDetail.userView + 1,
    // }
    existingPropertyDetail.userView += 1;
    const property = await propertyService.updatePropertyById(req.body.propertyId, existingPropertyDetail);
    res.status(httpStatus.CREATED).send(property);
  }),
  deleteProperty: catchAsync(async (req, res) => {
    if (!req.user?.id) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Loggedin User not found');
    }
    await propertyService.deletePropertyById(req.params.propertyId);
    res.status(httpStatus.NO_CONTENT).send();
  }),
  getUserProperties: catchAsync(async (req, res) => {
    console.log('req.user', req.user);
    if (!req.user?.id) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Loggedin User not found');
    }
    const propertiesList = await propertyService.getUserProperties(req.user.id);
    console.log('propertiesList', propertiesList);
    res.send(propertiesList);
  }),
  getPropertyById: catchAsync(async (req, res) => {
    if (!req.params.propertyId) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Property ID not found');
    }
    const propertyData = await propertyService.getPropertyById(req.params.propertyId);
    res.send(propertyData);
  }),
  getPropertyByIdEditView: catchAsync(async (req, res) => {
    if (!req.params.propertyId) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Property ID not found');
    }
    const propertyData = await propertyService.getPropertyByIdEditView(req.params.propertyId);
    res.send(propertyData);
  }),
  getProperties: catchAsync(async (req, res) => {
    const propertiesList = await propertyService.getPropertiesNonAuth(req.body);
    res.send(propertiesList);
  }),
  getLatestProperties: catchAsync(async (req, res) => {
    const propertiesList = await propertyService.getLatestProperties(req.query?.id);
    console.log('propertiesList', propertiesList);
    res.send(propertiesList);
  }),
};
