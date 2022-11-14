const mongoose = require('mongoose')

const checkoutSchema = new mongoose.Schema({
    email: {
        type: String,
        
    },
    cart_item: [
        {
            productId: {
                type:mongoose.Schema.Types.ObjectId,
                required: true
            },

            product_quantity: {
                type: Number,
                required: true
            }
        }
    ],

    address: {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true
        },
        mobile: {
            type: String,
            required: true,
            trim: true
        },
        address_line: {
            type: String,
            required: true,
            trim: true
    
    
        }
    },
    paymentStatus: {
        type: String,
        enum: ["cod","online"],
        required: true
    },
    bill: {
        type: Number,
        required: true
    },
    orderStatus: [{
        type: {
            type: String,
            enum: ["ordered","packed","shipped","delivered","cancelled"],
            default: "ordered"
        },
        date: {
            type: Date
        },  
    }],
    isCompleted: {
        type: Boolean,
        default: false
    } ,
    expectedDate: {
        type: Date,
        default: Date.now()+7*24*60*60*1000
    }
},{timestamps: true})


const Checkout =mongoose.model("Checkout",checkoutSchema)
module.exports = Checkout;