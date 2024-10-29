import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    sessionId:{
        type: String,
        required: [true,'Session Id is required.']
    },
    orderNumber: {
        type: Number,
        required: [true,'Order number is required.']
    },
    orderStatus: {
        type: String,
        enum: ['processing', 'completed']
    },
    customerName: {
        type: String,
        required: [true, 'Customer name is required.']
    },
    userId: {
        type: Number,
        required: [true, 'User ID is required.'],
        index: true
    },
    memo: {
        type: String,
        default: ""
    },
    totalPrice: {
        type: Number,
        required: [true, 'Price is required.']
    },
    pointsRedeem: {
        type: Number
    },
    pointsGet: {
        type: Number
    },
    items:[
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

orderSchema.index({ userId: 1, createdAt: -1 });

const Order = mongoose.model("Order", orderSchema);
export default Order;