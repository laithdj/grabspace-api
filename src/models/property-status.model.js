const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const propertyStatusSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      trim: true,
      default: 'SALE',
      enum: ['RENT', 'SALE']
    },
    status: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

propertyStatusSchema.plugin(toJSON);
propertyStatusSchema.plugin(paginate);

/**
 * @typedef PropertyStatus
 */
const PropertyStatus = mongoose.model('PropertyStatus', propertyStatusSchema);

module.exports = PropertyStatus;
