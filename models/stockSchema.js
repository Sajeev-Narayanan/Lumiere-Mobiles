const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const stockSchema = new Schema({
  productId: { type: ObjectId, trim: true },
  productName: { type: String, trim: true },
  stock: {
    type: Number,

    trim: true,
  },
});
stockSchema.plugin(validator);
const Stock = mongoose.model("Stock", stockSchema);
module.exports = Stock;
