import express from 'express';
import productController from '../controllers/productController.js';
import { uploadSingle, handleUploadError } from '../middlewares/upload.js';

const router = express.Router();

router.get('/', productController.getAllProducts.bind(productController));
router.get('/:id', productController.getProductById.bind(productController));
router.post('/', uploadSingle, handleUploadError, productController.createProduct.bind(productController));
router.put('/:id', uploadSingle, handleUploadError, productController.updateProduct.bind(productController));
router.delete('/:id', productController.deleteProduct.bind(productController));
router.get('/category/:categoryId', productController.getProductsByCategory.bind(productController));

export default router;