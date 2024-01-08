const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const citySchema = mongoose.Schema(
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

citySchema.plugin(toJSON);
citySchema.plugin(paginate);

/**
 * @typedef City
 */
const City = mongoose.model('City', citySchema);

module.exports = City;
