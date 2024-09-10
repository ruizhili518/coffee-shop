
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