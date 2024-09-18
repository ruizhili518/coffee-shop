import mongoose from 'mongoose';
import customizationSchema from "./customization.model.js";

const productSchema = new mongoose.Schema({
    category: {
        type: String,
        required: [true, "Category is required"],
    },
    name: {
        type: String,
        required: [true, "Name is required"],
        unique: [true, 'Name is unique']
    },
    image: {
        type: String,
        required: [true, "Image is required"]
    },
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    baseprice: {
        type: Number,
        required: [true, "Price is required"]
    },
    customizations: [customizationSchema],
    buy: {
        type: Number,
        required: true,
        default: 0 // Buy x
    } ,
    getFree: {
        type: Number,
        required: true,
        default: 0 // and get y free.
    } ,
    status: { // Shown for customers.
        type: String,
        required: true,
        default: "Inactive"
    }
},{
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;