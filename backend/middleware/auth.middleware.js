import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req,res,next) => {
    try{
        const refreshToken = req.cookies.refresh_token;

        if(!refreshToken){
            return res.status(401).json({
                message:"Token not found",
            })
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_SECRET);
        const user = await User.findById(decoded.uniqueId).select('-password');
        if(!user){
            return res.status(401).json({message:"User not found."});
        }
        req.user = user;
        next();
    }catch(err){
        console.log("Error in protectRoute: ", err.message);
        return res.status(401).json({message:"Authentication Failed"});
    }
}

export const adminRoute = async (req,res,next) => {
    if(req.user && (req.user.role === 'ROLE_ADMIN' || req.user.role === 'ROLE_SUPERADMIN')){
        next()
    }else{
        return res.status(403).json({message:"Access denied - Admin only"});
    }
}

export const superadminRoute = async (req,res,next) => {
    if(req.user && req.user.role === 'ROLE_SUPERADMIN'){
        next()
    }else{
        return res.status(403).json({message:"Access denied - Superadmin only"});
    }
}