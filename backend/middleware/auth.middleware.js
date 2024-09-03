import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req,res,next) => {
    try{
        const accessToken = req.cookies.access_token;

        if(!accessToken){
            return res.status(401).json({
                message:"Access token not found",
            })
        }

        const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
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