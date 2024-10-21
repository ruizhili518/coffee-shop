import express from "express";
import {getGetPointsRatio, getRedeemPointsRatio, manageGetPointsRatio, manageRedeemPointsRatio} from "../controllers/points.controllers.js";

const router = express.Router();

router.get('/points-get',getGetPointsRatio);
router.get('/points-redeem',getRedeemPointsRatio);
router.post('/points-get',manageGetPointsRatio);
router.post('/points-redeem',manageRedeemPointsRatio);

export default router;