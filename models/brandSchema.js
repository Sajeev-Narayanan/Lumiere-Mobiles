const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const brandSchema = new Schema({
  brand: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});
brandSchema.plugin(validator);
const Brand = mongoose.model("Brand", brandSchema);
module.exports = Brand;
