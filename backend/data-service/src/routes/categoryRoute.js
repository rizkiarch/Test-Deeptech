import express from 'express';
import categoryController from '../controllers/categoryController.js';

const router = express.Router();

// GET /api/categories - Get all categories
router.get('/', categoryController.getAllCategories.bind(categoryController));

// GET /api/categories/:id - Get category by ID
router.get('/:id', categoryController.getCategoryById.bind(categoryController));

// POST /api/categories - Create new category
router.post('/', categoryController.createCategory.bind(categoryController));

// PUT /api/categories/:id - Update category
router.put('/:id', categoryController.updateCategory.bind(categoryController));

// DELETE /api/categories/:id - Delete category
router.delete('/:id', categoryController.deleteCategory.bind(categoryController));

export default router;