import express from 'express';
import TransactionController from '../controllers/transactionController.js';

const router = express.Router();

router.get('/', TransactionController.getAllTransactions);
router.get('/:id', TransactionController.getTransactionById);
router.post('/single', TransactionController.createSingleTransaction);
router.post('/bulk', TransactionController.createBulkTransactions);
router.get('/product/:productId', TransactionController.getTransactionsByProduct);
router.get('/type/:type', TransactionController.getTransactionsByType);
router.get('/date-range', TransactionController.getTransactionsByDateRange);
router.get('/batch/:batchId', TransactionController.getTransactionsByBatch);
router.get('/stock-summary/:productId', TransactionController.getStockSummary);
router.delete('/:id', TransactionController.deleteTransaction);

export default router;