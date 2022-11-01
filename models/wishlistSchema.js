const mongoose = require('mongoose');
const validator = require("mongoose-unique-validator");
const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
const wishlistSchema = mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
        trim:true,
    },
    wish_item:[ {productId:{
        type: ObjectId,
        required: true,
        trim:true,
    }
    }],
    
    
});
wishlistSchema.plugin(validator);
const Wishlist = mongoose.model('Wishlist', wishlistSchema);
module.exports = Wishlist;