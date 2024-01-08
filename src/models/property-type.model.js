const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const propertyTypeSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

propertyTypeSchema.plugin(toJSON);
propertyTypeSchema.plugin(paginate);

/**
 * @typedef PropertyType
 */
const PropertyType = mongoose.model('PropertyType', propertyTypeSchema);

module.exports = PropertyType;
