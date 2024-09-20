import express from 'express';
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    updateProductById
} from "../controllers/product.controllers.js";
import { uploadImg } from "../middleware/uploadImage.js";

const router = express.Router();

router.get('/', getAllProducts);
router.post('/create',uploadImg.single('image'),createProduct);
router.delete('/:id', deleteProduct);
router.post('/:id',getProductById);
router.post('/update/:id',uploadImg.single('image'),updateProductById)

export default router;