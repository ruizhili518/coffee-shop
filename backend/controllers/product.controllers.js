import Product from "../models/product.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllProducts = async (req, res) =>{
    try{
        const products = Product.find({});
        // res.json({products});
        res.status(200).json({message:"Product list"});
    }catch(err){
        console.log("Error in getAllProducts.", err.message);
        res.status(500).json({message: 'Server error', error: err.message});
    }
}

export const createProduct = async (req, res) =>{
    try{
        const {category , name, image, description, baseprice, customization, getFree} = req.body;

        let cloudinaryRes = null;
        if(image){
            cloudinaryRes = await cloudinary.uploader.upload(image,{folder:"products"});
        }

        const product = await Product.create({
            category,
            name,
            image: cloudinaryRes?.secure_url ? cloudinaryRes?.secure_url : "",
            description,
            baseprice,
            customization,
            getFree
        })

        res.status(200).json({message:"Product created"});
    }catch(err){
        console.log("Error in createProduct.", err.message);
        res.status(500).json({message: 'Server error', error: err.message});
    }
}

export const deleteProduct = async (req, res)=>{
    try{
        const delProduct = await Product.findById(req.params.id);

        if(!delProduct){
            return res.status(403).json({message: 'Product not found.'});
        }

        if(product.image){
            const publicId = product.image.split(".").pop().split(".")[0] // Get id of the image in cloudinary
            try{
                await cloudinary.uploader.destroy(`products/${publicId}`);
                console.log("Image deleted from cloudinary.")
            }catch(err){
                console.log("Error in delete image.", err.message);
            }
        }

        await Product.findByIdAndDelete(req.params.id);

        res.json({message:"Product deleted successfully."});
    }catch(err){
        console.log("Error in deleteProduct.", err.message);
        res.status(500).json({message: 'Server error', error: err.message});
    }
}

//TODO : update product
// export const updateProduct = async (req, res)=>{
//     try{
//
//     }catch (err) {
//
//     }
// }