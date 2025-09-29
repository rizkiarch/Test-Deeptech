import express from 'express';
import ProductController from '../controllers/productController.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.get('/', ProductController.getAllProducts);
router.get('/:id', ProductController.getProductById);
router.post('/', upload.single('image'), ProductController.createProduct);
router.put('/:id', upload.single('image'), ProductController.updateProduct);
router.delete('/:id', ProductController.deleteProduct);
router.get('/category/:categoryId', ProductController.getProductsByCategory);
router.patch('/:id/stock', ProductController.updateProductStock);

export default router;