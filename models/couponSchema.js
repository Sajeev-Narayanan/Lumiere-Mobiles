const mongoose = require('mongoose')
const validator = require("mongoose-unique-validator");
const couponSchema = new mongoose.Schema({
    couponCode:{
        type:String,
        required:true,
        trim: true
    },
    discount:{
        type:Number,
        required:true,
        trim: true
    },
    maxAmount:{
        type:Number,
        required:true,
        trim: true
    },
    expiryDate:{
        type: Date
 },
//  expireAt: { type: Date, expires: 3600 },
   },
 {timestamps: true})

   couponSchema.plugin(validator);
   const Coupon = mongoose.model('Coupon', couponSchema);
   module.exports = Coupon;