const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_100/");
});
const opts = { toJSON: { virtuals: true } };
const productSchema = new Schema(
  {
    product_name: {
      type: String,
      unique: true,
      trim: true,
    },
    category_id: { type: ObjectId, trim: true },

    brand_id: { type: ObjectId, trim: true },
    ram: { type: Number, trim: true },
    memory: { type: Number, trim: true },
    battery: { type: Number, trim: true },
    price: { type: Number, trim: true },
    discount: { type: Number, trim: true },
    finalPrice:{type:Number,trim:true},
    deleted:{type:Boolean,trim:true},
    description: {
      type: String,

      trim: true,
    },

    image: [ImageSchema],
  },
  opts
);

productSchema.plugin(validator);
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
