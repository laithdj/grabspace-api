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
    title: {
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
    spaceType: { type: String, trim: true },
    adShowPerTime: { type: Number, default: 0 },
    space: { type: String, trim: true },
    sizeHeight: { type: Number, default: 0 },
    sizeWidth: { type: Number, default: 0 },
    rentPrice: { type: String, trim: true },
    includePrintInstall: { type: Boolean, default: false },
    traffic: { type: Boolean, default: false },
    viewersPerDay: { type: Number, default: 0 },
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
