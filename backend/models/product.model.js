import mongoose from 'mongoose';

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
    customizations: [
        { customization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customization'}
        }
    ],
    getFree: {
        type: Array,
        required: true,
        default: [0,0] // Buy x get y free.
    } ,
    status: { // Shown for customers.
        type: String,
        required: true,
        default: "draft"
    }
},{
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;