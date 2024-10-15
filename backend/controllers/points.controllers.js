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
                ratio: 10
            });
            return res.status(201).json({newRatio,message:'Ratio initialized successfully.'})
        }
    }catch (e){
        return res.status(400).json({message: 'Something wrong with the server. Please try again later.'})
    }
}
// getRedeemPointsRation
// manageGetPointsRatio
// manageRedeemPointsRatio