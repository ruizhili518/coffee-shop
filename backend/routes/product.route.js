import express from 'express';
import {createProduct, deleteProduct, getAllProducts} from "../controllers/product.controllers.js";
import { superadminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get('/', getAllProducts);
router.post('/create', superadminRoute, createProduct);
router.delete('/:id', superadminRoute, deleteProduct)

//TODO
//router.post('/:id',protectRoute,superadminRoute, updateProduct)

export default router;