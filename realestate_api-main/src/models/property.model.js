const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');

const propertySchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      default: null,
      ref: 'User'
    },
    propertyType: {
      type: mongoose.Types.ObjectId,
      required: true,
      default: null,
      ref: 'PropertyType'
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    areaName: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: mongoose.Types.ObjectId,
      required: true,
      default: null,
      ref: 'City'
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    propertyStatus: {
      type: String,
      required: false,
      default: 'SALE'
    },
    bedrooms: {
      type: Number,
      required: true,
      default: 0
    },
    bathrooms: {
      type: Number,
      required: true,
      default: 0
    },
    propertyAge: {
      type: String,
      required: true,
      trim: true,
      default: null
    },
    landSize: {
      type: String,
      required: true,
      trim: true,
      default: null
    },
    area: {
      type: String,
      required: true,
      trim: true,
      default: null
    },
    salePrice: {
      type: Number,
      required: true,
      default: 0
    },
    rentYield: {
      type: String,
      trim: true,
      default: null
    },
    weeklyCurrentRent: {
      type: String,
      trim: true,
      default: null
    },
    weeeklyRentalAppraisal: {
      type: String,
      trim: true,
      default: null
    },
    propertyValueGrowth: {
      type: String,
      required: true,
      trim: true,
      default: null
    },
    rentalMarketPrice: {
      type: String,
      trim: true,
      default: null
    },
    vacancyRate: {
      type: String,
      trim: true,
      default: null
    },
    hideSalePrice: {
      type: Boolean,
      default: false
    },
    parkingAvailable: {
      type: Boolean,
      default: false
    },
    currentlyTenanted: {
      type: Boolean,
      default: false
    },
    fireZone: {
      type: Boolean,
      default: false
    },
    floodZone: {
      type: Boolean,
      default: false
    },
    landDAApproved: {
      type: Boolean,
      default: false
    },
    isBodyCorporate: {
      type: Boolean,
      default: false
    },
    bodyCorporateValue: {
      type: String,
      trim: true,
      default: null
    },
    amenities: [
      { type: mongoose.Types.ObjectId, default: null, ref: 'Amenities' }
    ],
    floorPlans: [
      {
        title: { type: String, trim: true, default: null },
        imageName: { type: String, trim: true, default: null },
        path: { type: String, trim: true, default: null },
        originalName: { type: String, trim: true, default: null },
        mimeType: { type: String, trim: true, default: null },
        size: { type: String, trim: true, default: null },
      }
    ],
    images: [
      {
        imageName: { type: String, trim: true, default: null },
        path: { type: String, trim: true, default: null },
        originalName: { type: String, trim: true, default: null },
        mimeType: { type: String, trim: true, default: null },
        size: { type: String, trim: true, default: null },
      }
    ],
    sellerName: {
      type: String,
      required: true,
      trim: true,
      default: null
    },
    sellerEmail: {
      type: String,
      required: true,
      trim: true,
      default: null
    },
    sellerNumber: {
      type: String,
      required: true,
      trim: true,
      default: null
    },
    sellerAddress: {
      type: String,
      trim: true,
      default: null
    },
    userView: {
      type: Number,
      required: true,
      default: 0
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
propertySchema.plugin(toJSON);
propertySchema.plugin(paginate);


/**
 * @typedef Property
 */
const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
