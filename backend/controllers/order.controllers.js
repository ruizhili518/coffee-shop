import {stripe} from "../lib/stripe.js";
import dotenv from "dotenv";
import Order from "../models/order.model.js";

dotenv.config();

// Get order sequence and update it by 1.
async function getNextSequenceValue(sequenceName){
    const sequenceDocument = await Counter.findOneAndUpdate(
        {_id: sequenceName},
        {$inc:{seq : 1}},
        {new: true, upsert:true}
    );
    return sequenceDocument.seq;
}

export const createCheckoutSession = async (req, res) => {
    try {
        const { cart,totalPrice,customerName,user,memo,pointsRedeem } = req.body;
        if(!Array.isArray(items) || items.length === 0){
            return res.status(400).json({error: "Empty cart."});
        }
        const lineItems = cart.map(item => {
            const amount = Math.round(item.price * 100) // Stripe need data in the format of cents.
            return {
                price_data:{
                    currency:"cad",
                    product_data: {
                        name: item.product.name,
                        images: [item.product.image]
                    },
                    unit_amount:amount
                }
            }
        });
        const session = await stripe.checkout.sessions.create({
            payment_method_types:['card'],
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.FRONTEND_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url:`${process.env.FRONTEND_URL}/purchase-cancel`,
            metadata:{
                userId: user.userId,
                customerName,
                memo,
                pointsRedeem,
                totalPrice,
                items:JSON.stringify(cart)
            }
        });
        res.status(200).json({id: session.id, totalPrice})
    }catch (e) {
        res.status(500).json({error: e.message})
        console.log(e);
    }
}

export const checkSuccess = async (req,res) => {
    try {
        const {sessionId} = req.body;
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if(session.payment_status === "paid"){
            const items = JSON.parse(session.metadata.items);
            // Get the next userId in the sequence.
            const orderNumber = await getNextSequenceValue('orderNumber');
            const getPointsRatio = Points.findOne({name:"get"});
            const newOrder = new Order({
                orderStatus: "process",
                customerName: session.metadata.customerName,
                userId: session.metadata.userId,
                memo:session.metadata.memo,
                totalPrice: session.metadata.totalPrice,
                pointsRedeem: session.metadata.pointsRedeem,
                pointsGet: session.metadata.totalPrice * getPointsRatio,
                items,
                orderNumber,
            })
            await newOrder.save();
            res.status(200).json({
                success: true,
                message: "Payment successful, order created.",
                orderNumber: newOrder.orderNumber
            })
        }
    }catch (e) {
        res.status(500).json({message: "Something wrong with the server. Please try later.",error:e.message})
    }
}