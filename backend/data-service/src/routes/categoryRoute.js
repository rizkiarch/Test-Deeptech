import express from 'express';
import categoryController from '../controllers/categoryController.js';

const router = express.Router();

router.get('/', categoryController.getAllCategories.bind(categoryController));
router.get('/:id', categoryController.getCategoryById.bind(categoryController));
router.post('/', categoryController.createCategory.bind(categoryController));
router.put('/:id', categoryController.updateCategory.bind(categoryController));
router.delete('/:id', categoryController.deleteCategory.bind(categoryController));

export default router;