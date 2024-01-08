const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const amenitiesSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

amenitiesSchema.plugin(toJSON);
amenitiesSchema.plugin(paginate);

/**
 * @typedef Amenities
 */
const Amenities = mongoose.model('Amenities', amenitiesSchema);

module.exports = Amenities;
