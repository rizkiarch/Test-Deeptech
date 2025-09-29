import express from 'express';
import authController from '../controllers/auth/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', authController.login.bind(authController));
router.post('/logout', authMiddleware, authController.logout.bind(authController));

export default router;