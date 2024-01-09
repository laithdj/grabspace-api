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
    const propertyInsertData = {
      userId: req.user.id,
      title: propertyData.general.title,
      city: propertyData.general.city,
      address: propertyData.general.address,
      description: propertyData.general.description,
      spaceType: propertyData.details.spaceType,
      adShowPerTime: propertyData.details.adShowPerTime,
      space: propertyData.details.space,
      sizeHeight: propertyData.details.sizeHeight,
      sizeWidth: propertyData.details.sizeWidth,
      rentPrice: propertyData.details.rentPrice,
      includePrintInstall: propertyData.details.includePrintInstall,
      traffic: propertyData.details.traffic,
      viewersPerDay: propertyData.details.viewersPerDay,
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
      throw new ApiError(httpStatus.BAD_REQUEST, `Listing ID Not found.`);
    }
    const existingPropertyDetail = await propertyService.getPropertyById(req.params.propertyId);
    if (!existingPropertyDetail?._id) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Listing not found.`);
    }
    const existingImages = existingPropertyDetail.images;
    console.log('existingImages', existingImages);
    console.log('req.files.images', req.files.images);
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
    const propertyUpdateData = {
      userId: req.user.id,
      title: propertyData.general.title,
      city: propertyData.general.city,
      address: propertyData.general.address,
      description: propertyData.general.description,
      spaceType: propertyData.details.spaceType,
      adShowPerTime: propertyData.details.adShowPerTime,
      space: propertyData.details.space,
      sizeHeight: propertyData.details.sizeHeight,
      sizeWidth: propertyData.details.sizeWidth,
      rentPrice: propertyData.details.rentPrice,
      includePrintInstall: propertyData.details.includePrintInstall,
      traffic: propertyData.details.traffic,
      viewersPerDay: propertyData.details.viewersPerDay,
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
      throw new ApiError(httpStatus.BAD_REQUEST, `Listing ID Not found.`);
    }
    const existingPropertyDetail = await propertyService.getPropertyById(req.body.propertyId);
    if (!existingPropertyDetail?._id) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Listing not found.`);
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
      throw new ApiError(httpStatus.NOT_FOUND, 'Listing ID not found');
    }
    const propertyData = await propertyService.getPropertyById(req.params.propertyId);
    res.send(propertyData);
  }),
  getPropertyByIdEditView: catchAsync(async (req, res) => {
    if (!req.params.propertyId) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Listing ID not found');
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
