const mongoose = require('mongoose');
const validator = require("mongoose-unique-validator");
const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
const bannerSchema = mongoose.Schema({

   
            name: {
                type: String,
                required: true
            },

            image: [{
                url: String,
                filename: String,

            }],




}, { timestamps: true })

const Banner = mongoose.model('banner', bannerSchema);
module.exports = Banner;