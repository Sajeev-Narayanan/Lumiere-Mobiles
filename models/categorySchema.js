const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  category: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});
categorySchema.plugin(validator);
const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
