const Joi = require('joi');
const { password } = require('./custom.validation');

module.exports = {
  createProperty: {
    body: Joi.object({
      propertyData: Joi.object({
        general: Joi.object().keys({
          title: Joi.string().required(),
          city: Joi.string().required(),
          address: Joi.string().required(),
          description: Joi.string().required(),
        }),
        details: Joi.object().keys({
          spaceType: Joi.string().optional(),
          adShowPerTime: Joi.string().optional(),
          space: Joi.string().optional(),
          sizeHeight: Joi.string().optional(),
          sizeWidth: Joi.string().optional(),
          rentPrice: Joi.string().optional(),
          includePrintInstall: Joi.boolean().optional(),
          traffic: Joi.boolean().optional(),
          viewersPerDay: Joi.string().optional(),
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
          title: Joi.string().required(),
          city: Joi.string().required(),
          address: Joi.string().required(),
          description: Joi.string().required(),
        }),
        details: Joi.object().keys({
          spaceType: Joi.string().optional(),
          adShowPerTime: Joi.string().optional(),
          space: Joi.string().optional(),
          sizeHeight: Joi.string().optional(),
          sizeWidth: Joi.string().optional(),
          rentPrice: Joi.string().optional(),
          includePrintInstall: Joi.boolean().optional(),
          traffic: Joi.boolean().optional(),
          viewersPerDay: Joi.string().optional(),
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
