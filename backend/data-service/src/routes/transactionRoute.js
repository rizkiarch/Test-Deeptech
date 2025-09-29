import express from 'express';
import TransactionController from '../controllers/transactionController.js';

const router = express.Router();

router.get('/', TransactionController.getAllTransactions);
router.get('/:id', TransactionController.getTransactionById);
router.post('/', TransactionController.createTransaction);
router.post('/bulk', TransactionController.createBulkTransactions);
router.put('/:id', TransactionController.updateTransaction);
router.put('/bulk', TransactionController.updateBulkTransactions);
router.delete('/:id', TransactionController.deleteTransaction);
router.get('/product/:productId', TransactionController.getTransactionsByProductId);

export default router;