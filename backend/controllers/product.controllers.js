import Product from "../models/product.model.js";
import cloudinary from "../lib/cloudinary.js";
import { dataUri } from "../middleware/uploadImage.js";

export const getAllProducts = async (req, res) =>{
    try{
        const products = await Product.find({});
        res.status(200).json({products, message:"Get product list successfully."});
    }catch(err){
        console.log("Error in getAllProducts.", err.message);
        res.status(500).json({message: 'Server error', error: err.message});
    }
};

export const createProduct = async (req, res) =>{
    try{
        let { name, description, baseprice, customizations, buy, getFree , status, category } = req.body;

        let cloudinaryRes = null;
        if(req.file){
            const file = dataUri(req).content;
            cloudinaryRes = await cloudinary.uploader.upload(file,{folder:"products"});
        }

        baseprice = Number(baseprice);
        buy = parseInt(buy);
        getFree = parseInt(getFree);
        customizations = JSON.parse(customizations).map(cus => ({
            cusCategory: cus.cusCategory,
            cusName: cus.cusName,
            extraprice: Number(cus.extraprice)
        }));

        const product = await Product.create({
            category,
            name,
            image: cloudinaryRes?.secure_url ? cloudinaryRes?.secure_url : "",
            description,
            baseprice,
            customizations,
            buy,
            getFree,
            status
        })
        res.status(200).json({product,message:"Product created"});
    }catch(err){
        console.log("Error in createProduct.", err.message);
        res.status(500).json({message: 'Server error', error: err.message});
    }
};

export const deleteProduct = async (req, res)=>{
    try{
        const delProduct = await Product.findById(req.params.id);

        if(!delProduct){
            return res.status(403).json({message: 'Product not found.'});
        }

        if(delProduct.image){
            const publicId = delProduct.image.split(".").pop().split(".")[0] // Get id of the image in cloudinary
            try{
                await cloudinary.uploader.destroy(`products/${publicId}`);
                console.log("Image deleted from cloudinary.")
            }catch(err){
                console.log("Error in delete image.", err.message);
            }
        }
        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({message:"Product deleted successfully."});
    }catch(err){
        console.log("Error in deleteProduct.", err.message);
        res.status(500).json({message: 'Server error', error: err.message});
    }
};

export const getProductById = async (req, res) => {
    try {
        const productData = await Product.findById(req.params.id);
        if(productData){
        res.status(200).json({productData,message:"Get product successfully."})
        }else{
            res.status(403).json({message: "Product doesn't exist. Please try again."})
        }
    }catch (err){
        console.log("Error in getProductById.", err.message);
        res.status(500).json({message: 'Server error', error: err.message});
    }
}

export const updateProductById = async (req, res)=>{
    try{
        const productId = req.params.id;
        let { name, description, baseprice, customizations, buy, getFree , status, category, image } = req.body;
        baseprice = Number(baseprice);
        buy = parseInt(buy);
        getFree = parseInt(getFree);
        customizations = JSON.parse(customizations).map(cus => ({
            cusCategory: cus.cusCategory,
            cusName: cus.cusName,
            extraprice: Number(cus.extraprice)
        }));

        let cloudinaryRes = null;
        if(req.file){
            const file = dataUri(req).content;
            cloudinaryRes = await cloudinary.uploader.upload(file,{folder:"products"});
            image = cloudinaryRes.secure_url;
        }

        const newProduct = {
            name, description, baseprice, customizations, buy, getFree , status, category, image
        }

        const response = await Product.findByIdAndUpdate(productId,newProduct,{
            new: true,
            runValidators: true
        })

        if(!response){
            return res.status(404).json({message:'Product Not Found.'})
        }

        return res.status(200).json({response, message: 'Update product successfully.'})
    }catch (err) {
        console.error('Error updating product:', err);
        res.status(400).json({ message: err.message });
    }
}