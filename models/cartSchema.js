const mongoose = require('mongoose');
const validator = require("mongoose-unique-validator");
const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
const cartSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    cart_item: [
        {
            productId: {
                type: ObjectId,
                required: true
            },

            product_quantity: {
                type: Number,
                required: true,
                
            },
            
        }
    ]
});
cartSchema.plugin(validator);
const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;