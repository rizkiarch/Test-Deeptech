import express from 'express';
import userController from '../controllers/user/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, userController.getAllUsers.bind(userController));
router.get('/:id', authMiddleware, userController.getUserById.bind(userController));
router.post('/', authMiddleware, userController.createUser.bind(userController));
router.put('/:id', authMiddleware, userController.updateUser.bind(userController));
router.delete('/:id', authMiddleware, userController.deleteUser.bind(userController));

export default router;