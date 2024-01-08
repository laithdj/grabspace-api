const Joi = require('joi');
const { password } = require('./custom.validation');

module.exports = {
  createProperty: {
    body: Joi.object({
      propertyData: Joi.object({
        general: Joi.object().keys({
          type: Joi.string().required(),
          title: Joi.string().required(),
          areaName: Joi.string().required(),
          city: Joi.string().required(),
          address: Joi.string().required(),
          description: Joi.string().required(),
          propertyStatus: Joi.string().optional(),
        }),
        details: Joi.object().keys({
          bedrooms: Joi.string().required(),
          bathrooms: Joi.string().optional(),
          propertyAge: Joi.string().required(),
          landSize: Joi.string().required(),
          area: Joi.string().required(),
          salePrice: Joi.string().required(),
          rentYield: Joi.string().optional().allow(null),
          weeklyCurrentRent: Joi.string().optional().allow(null),
          weeeklyRentalAppraisal: Joi.string().optional().allow(null),
          propertyValueGrowth: Joi.string().required(),
          rentalMarketPrice: Joi.string().optional().allow(null),
          vacancyRate: Joi.string().optional().allow(null),
          hideSalePrice: Joi.boolean().optional(),
          parkingAvailable: Joi.boolean().optional(),
          currentlyTenanted: Joi.boolean().optional(),
          fireZone: Joi.boolean().optional(),
          floodZone: Joi.boolean().optional(),
          landDAApproved: Joi.boolean().optional(),
          isBodyCorporate: Joi.boolean().optional(),
          bodyCorporateValue: Joi.string().optional().allow(null),
          amenities: Joi.array().optional(),
          floorPlans: Joi.array().optional(),
        }),
        images: Joi.array().optional(),
        sellerDetails: Joi.object().keys({
          sellerName: Joi.string().required(),
          sellerEmail: Joi.string().required(),
          sellerNumber: Joi.string().required(),
          sellerAddress: Joi.string().optional().allow('').allow(null),
        }),
      }),
    })
  },
  updateProperty: {
    body: Joi.object({
      propertyData: Joi.object({
        general: Joi.object().keys({
          type: Joi.string().required(),
          title: Joi.string().required(),
          areaName: Joi.string().required(),
          city: Joi.string().required(),
          address: Joi.string().required(),
          description: Joi.string().required(),
          propertyStatus: Joi.string().optional(),
        }),
        details: Joi.object().keys({
          bedrooms: Joi.string().required(),
          propertyAge: Joi.string().required(),
          landSize: Joi.string().required(),
          area: Joi.string().required(),
          salePrice: Joi.string().required(),
          rentYield: Joi.string().optional().allow(null),
          weeklyCurrentRent: Joi.string().optional().allow(null),
          weeeklyRentalAppraisal: Joi.string().optional().allow(null),
          propertyValueGrowth: Joi.string().required(),
          rentalMarketPrice: Joi.string().optional().allow(null),
          vacancyRate: Joi.string().optional().allow(null),
          parkingAvailable: Joi.boolean().optional(),
          currentlyTenanted: Joi.boolean().optional(),
          fireZone: Joi.boolean().optional(),
          floodZone: Joi.boolean().optional(),
          landDAApproved: Joi.boolean().optional(),
          isBodyCorporate: Joi.boolean().optional(),
          bodyCorporateValue: Joi.string().optional().allow(null),
          amenities: Joi.array().optional(),
          floorPlans: Joi.array().optional(),
        }),
        images: Joi.array().optional(),
        sellerDetails: Joi.object().keys({
          sellerName: Joi.string().required(),
          sellerEmail: Joi.string().required(),
          sellerNumber: Joi.string().required(),
          sellerAddress: Joi.string().optional().allow('').allow(null),
        }),
      }),
    })
  },
  deleteProperty: {
    params: Joi.object().keys({
      propertyId: Joi.string().required()
    })
  }
};
