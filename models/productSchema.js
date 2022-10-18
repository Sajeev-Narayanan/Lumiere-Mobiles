const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const productSchema = new Schema({
  product_name: {
    type: String,
    unique: true,
    trim: true,
  },
  category_id: { type: ObjectId, trim: true },

  brand_id: { type: ObjectId, trim: true },
  ram: { type: number, trim: true },
  memory: { type: number, trim: true },
  battery: { type: number, trim: true },
  price: { type: number, trim: true },
  discount: { type: number, trim: true },
  description: {
    type: String,

    trim: true,
  },

  image: [
    {
      url: String,
      filename: String,
    },
  ],
});

productSchema.plugin(validator);
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
