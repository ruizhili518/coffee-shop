import express from 'express';
import {refreshToken, signin, signout, signup} from "../controllers/auth.controllers.js";

const router = express.Router();

router.post('/sign-up', signup);
router.post('/sign-in', signin);
router.post('/sign-out', signout);
router.post('/refresh-token', refreshToken);
// router.get('/profile', protectRoute, getProfile)

export default router;