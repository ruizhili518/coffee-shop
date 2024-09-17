import express from 'express';
import {createProduct, deleteProduct, getAllProducts} from "../controllers/product.controllers.js";
import { uploadImg } from "../middleware/uploadImage.js";

const router = express.Router();

router.get('/', getAllProducts);
router.post('/create',uploadImg.single('image'),createProduct);
router.delete('/:id', deleteProduct)

//TODO
//router.post('/:id',updateProduct)

export default router;