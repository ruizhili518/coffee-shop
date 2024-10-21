import Points from "../models/points.model.js";

export const getGetPointsRatio = async (req,res) =>{
    try{
        const name = "get";
        const ratio = await Points.findOne({name});
        if(ratio) {
            return res.status(200).json({ratio, message: 'Get points ratio is successfully found.'});
        }else{
            const newRatio = await Points.create({
                name: name,
                ratio: 10.0
            });
            return res.status(201).json({newRatio,message:'Ratio initialized successfully.'})
        }
    }catch (e){
        return res.status(500).json({message: 'Something wrong with the server. Please try again later.'})
    }
}
export const getRedeemPointsRatio = async (req,res) => {
    try{
        const name = "redeem";
        const ratio = await Points.findOne({name});
        if(ratio) {
            return res.status(200).json({ratio, message: 'Redeem points ratio is successfully found.'});
        }else{
            const newRatio = await Points.create({
                name: name,
                ratio: 0.1
            });
            return res.status(201).json({newRatio,message:'Ratio initialized successfully.'})
        }
    }catch (e){
        return res.status(500).json({message: 'Something wrong with the server. Please try again later.'})
    }
}
export const manageGetPointsRatio = async (req,res) => {
    try{
        const name = 'get';
        const { getRatio } = req.body;
        const newRatio = {
            name,
            ratio: getRatio
        }
        const response = await Points.findOneAndUpdate({name},newRatio,{
            new: true,
            runValidators: true
        });
        return res.status(200).json({newRatio: response.ratio, message:'Manage get ratio successfully'});
    }catch (e) {
        console.log(e);
        return res.status(500).json({message: 'Something wrong with the server. Please try again later.'})
    }
}
export const manageRedeemPointsRatio= async (req,res) => {
    try{
        const name = 'redeem';
        const { redeemRatio } = req.body;
        const newRatio = {
            name,
            ratio: redeemRatio
        }
        const response = await Points.findOneAndUpdate({name},newRatio,{
            new: true,
            runValidators: true
        });
        return res.status(200).json({newRatio: response.ratio, message:'Manage get ratio successfully'});
    }catch (e) {
        console.log(e);
        return res.status(500).json({message: 'Something wrong with the server. Please try again later.'})
    }
}