import mongoose from "mongoose";
import {Product} from "../../frontend/lib/types.js";

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: Number,
        required: [true,'Order number is required.']
    },
    orderStatus: {
        type: String
    },
    customerName: {
        type: String,
        required: [true, 'Customer name is required.']
    },
    memo: {
        type: String,
        default: ""
    },
    totalPrice: {
        type: Number,
        required: [true, 'Price is required.']
    },
    item:[
        {
            time: {
                type: Number
            },
            size: {
                type: String
            },
            sizePrice: {
                type: Number
            },
            milk: {
                type: String
            },
            milkPrice: {
                type: Number
            },
            ice: {
                type: String
            },
            icePrice: {
                type: Number
            },
            amount: {
                type: Number
            },
            price: {
                type: Number
            },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            }
        }
    ]
},{
    timestamps: true
});

const Order = mongoose.model("Order", orderSchema);
export default Order;