import {stripe} from "../lib/stripe.js";
import dotenv from "dotenv";
import Order from "../models/order.model.js";
import Counter from "../models/counter.model.js";
import Points from "../models/points.model.js";
import User from "../models/user.model.js";
import moment from 'moment';

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
        const { cart,totalPrice,customerName,user,memo,pointsToRedeem, discount } = req.body;
        if(!Array.isArray(cart) || cart.length === 0){
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
                },
                quantity: 1,
            }
        });
        let couponId;
        if(discount > 0){
            const coupon = await stripe.coupons.create({
                amount_off : Math.round(discount * 100), //Covert to cents
                currency: 'CAD',
                duration: 'once',
                name:`Discount:${customerName}-${Date.now()}`
            });
            couponId = coupon.id;
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types:['card'],
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.FRONTEND_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url:`${process.env.FRONTEND_URL}/purchase-cancel`,
            discounts:discount > 0 ? [{coupon:couponId}]: [],
            metadata:{
                userId: user.userId,
                customerName,
                memo,
                pointsToRedeem,
                totalPrice: totalPrice,
                appliedDiscount: discount
            }
        });
        res.status(200).json({id: session.id, totalPrice, discount})
    }catch (e) {
        res.status(500).json({error: e.message})
        console.log(e);
    }
}
export const checkSuccess = async (req,res) => {
    try {
        const {sessionId , cart} = req.body;
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const existOrder = await Order.findOne({sessionId});
        if(session.payment_status === "paid" && !existOrder){
            // Get the next orderNumber in the sequence.
            const orderNumber = await getNextSequenceValue('orderNumber');
            const getPointsRatio = await Points.findOne({name:"get"});
            const newOrder = new Order({
                orderStatus: "processing",
                customerName: session.metadata.customerName,
                userId: session.metadata.userId,
                memo:session.metadata.memo,
                totalPrice: session.metadata.totalPrice,
                pointsRedeem: session.metadata.pointsRedeem,
                pointsGet: (session.metadata.totalPrice - session.metadata.appliedDiscount) * getPointsRatio.ratio,
                items:cart,
                orderNumber,
                sessionId
            });
            await newOrder.save();
            if(newOrder.userId !== 0){
                await User.findOneAndUpdate(
                    {userId: newOrder.userId},
                    {
                        $inc: {points: newOrder.pointsGet}
                    },
                    {new: true}
                )
            }
            res.status(200).json({
                success: true,
                message: "Payment successful, order created.",
                orderNumber: newOrder.orderNumber,
                customerName: newOrder.customerName
            })
        }else if(existOrder){
            res.status(201).json({
                message: "Order already exist.",
                orderNumber: existOrder.orderNumber,
                customerName: existOrder.customerName
            })
        }else{
            res.status(400).json({
                message: "Something wrong with the payment or order already exist."
            })
        }
    }catch (e) {
        res.status(500).json({message: "Something wrong with the server. Please try later.",error:e.message});
        console.log(e);
    }
}
export const getOrderHistory = async (req,res) => {
    try {
        const {role, userId} = req.body;
        if(role === "ROLE_SUPERADMIN" || role === "ROLE_ADMIN"){
            const orders = await Order.find({});
            res.status(200).json({orders, message: "All the orders are successfully returned to admin."})
        }else if(role === "ROLE_USER"){
            const orders = await Order.find({userId});
            res.status(200).json({orders, message: "All the orders of this user are returned."});
        }else{
            res.status(201).json({message: "Cannot trace order history of a guest."})
        }
    }catch (e){
        console.log(e);
        res.status(500).json({message: "Something wrong with the server."})
    }
}
export const changeOrderStatus = async (req,res) => {
    try{
        const {id, newStatus} = req.body;
        const thisOrder = await Order.findByIdAndUpdate({_id: id},{orderStatus: newStatus}, {new:true});
        if(!thisOrder){
            return res.status(404).json({message:'Order Not Found.'})
        }
        res.status(200).json({message: "Order status changed."})
    }catch (e) {
        console.log(e);
        res.status(500).json({message: "Something wrong with the server."})
    }
}
export const getOrderDataAnalysis = async (req,res) => {
    try{
        const today = moment().startOf('day');
        const now = moment().startOf('second');
        const sevenDaysAgo = moment().subtract(7, 'days').startOf('second');

        // 1. Recent 7 days' revenue
        const recentRevenue = await Order.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo.toDate(), $lte: now.toDate() } } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } },
            { $project: { _id: 0, total: 1 } }
        ]);
        const recent7DaysRevenue = recentRevenue[0]?.total || 0;

        // 2. Increase/decrease of 7 days' revenue from last 7 days
        const prev7DaysStart = moment().subtract(14, 'days').startOf('second');
        const prev7DaysRevenue = await Order.aggregate([
            { $match: { createdAt: { $gte: prev7DaysStart.toDate(), $lte: sevenDaysAgo.toDate() } } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } },
            { $project: { _id: 0, total: 1 } }
        ]);
        const prev7DaysRevenueTotal = prev7DaysRevenue[0]?.total || 0;
        const revenueChange = Number((recent7DaysRevenue - prev7DaysRevenueTotal).toFixed(2));

        // 3. Today's revenue
        const todayRevenue = await Order.aggregate([
            { $match: { createdAt: { $gte: today.toDate(), $lte: moment(today).endOf('day').toDate() } } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } },
            { $project: { _id: 0, total: 1 } }
        ]);
        const todaysRevenue = todayRevenue[0]?.total || 0;

        // 4. Increase/decrease from yesterday
        const yesterday = moment().subtract(1, 'day').startOf('day');
        const yesterdayRevenue = await Order.aggregate([
            { $match: { createdAt: { $gte: yesterday.toDate(), $lte: moment(yesterday).endOf('day').toDate() } } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } },
            { $project: { _id: 0, total: 1 } }
        ]);
        const yesterdaysRevenue = yesterdayRevenue[0]?.total || 0;
        const todayRevenueChange = Number((todaysRevenue - yesterdaysRevenue).toFixed(2));

        // 5. Today's orders
        const todaysOrders = await Order.countDocuments({ createdAt: { $gte: today.toDate(), $lte: moment(today).endOf('day').toDate() } });

        // 6. Increase/decrease from yesterday
        const yesterdaysOrders = await Order.countDocuments({ createdAt: { $gte: yesterday.toDate(), $lte: moment(yesterday).endOf('day').toDate() } });
        const orderChange = Number((todaysOrders - yesterdaysOrders));
        const data = {
            recent7DaysRevenue,
            revenueChange,
            todaysRevenue,
            todayRevenueChange,
            todaysOrders,
            orderChange
        };
        return res.status(200).json({message: "Order's data analysis.", data})
    }catch (e) {
        return res.status(500).json({ error: e.message });
    }
}
