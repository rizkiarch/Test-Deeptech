import TransactionService from '../services/transactionService.js';
import response from '../utils/response.js';

class TransactionController {
    static async getAllTransactions(req, res) {
        try {
            const result = await TransactionService.getAllTransactions(req.query);

            return response.success(res, {
                transactions: result.transactions,
                pagination: result.pagination
            }, 'Transactions retrieved successfully');
        } catch (error) {
            console.error('Get all transactions error:', error.message);
            const statusCode = error.message.includes('not found') ? 404 :
                error.message.includes('Invalid') ? 400 : 500;
            return response.error(res, error.message, statusCode);
        }
    }

    static async getTransactionById(req, res) {
        try {
            const { id } = req.params;
            const transaction = await TransactionService.getTransactionById(id);

            return response.success(res, transaction, 'Transaction retrieved successfully');
        } catch (error) {
            console.error('Get transaction by ID error:', error.message);
            const statusCode = error.message.includes('not found') ? 404 :
                error.message.includes('Invalid') ? 400 : 500;
            return response.error(res, error.message, statusCode);
        }
    }

    static async createSingleTransaction(req, res) {
        try {
            const transactionData = req.body;
            const transaction = await TransactionService.createSingleTransaction(transactionData);

            return response.success(res, transaction, 'Transaction created successfully', 201);
        } catch (error) {
            console.error('Create single transaction error:', error.message);
            const statusCode = error.message.includes('not found') ? 404 :
                error.message.includes('required') ||
                    error.message.includes('Invalid') ||
                    error.message.includes('must be') ||
                    error.message.includes('Insufficient') ? 400 : 500;
            return response.error(res, error.message, statusCode);
        }
    }

    static async createBulkTransactions(req, res) {
        try {
            const { transactions } = req.body;

            if (!transactions) {
                return response.error(res, 'Transactions array is required', 400);
            }

            const result = await TransactionService.createBulkTransactions(transactions);

            return response.success(res, result, 'Bulk transactions created successfully', 201);
        } catch (error) {
            console.error('Create bulk transactions error:', error.message);
            const statusCode = error.message.includes('not found') ? 404 :
                error.message.includes('required') ||
                    error.message.includes('Invalid') ||
                    error.message.includes('must be') ||
                    error.message.includes('Insufficient') ||
                    error.message.includes('array') ? 400 : 500;
            return response.error(res, error.message, statusCode);
        }
    }

    static async getTransactionsByProduct(req, res) {
        try {
            const { productId } = req.params;
            const result = await TransactionService.getTransactionsByProduct(productId, req.query);

            return response.success(res, {
                transactions: result.transactions,
                pagination: result.pagination
            }, 'Product transactions retrieved successfully');
        } catch (error) {
            console.error('Get transactions by product error:', error.message);
            const statusCode = error.message.includes('not found') ? 404 :
                error.message.includes('Invalid') ? 400 : 500;
            return response.error(res, error.message, statusCode);
        }
    }

    static async getTransactionsByType(req, res) {
        try {
            const { type } = req.params;
            const result = await TransactionService.getTransactionsByType(type, req.query);

            return response.success(res, {
                transactions: result.transactions,
                pagination: result.pagination
            }, `${type.toUpperCase()} transactions retrieved successfully`);
        } catch (error) {
            console.error('Get transactions by type error:', error.message);
            const statusCode = error.message.includes('Invalid') ? 400 : 500;
            return response.error(res, error.message, statusCode);
        }
    }

    static async getTransactionsByDateRange(req, res) {
        try {
            const { startDate, endDate } = req.query;

            if (!startDate || !endDate) {
                return response.error(res, 'Both startDate and endDate query parameters are required', 400);
            }

            const result = await TransactionService.getTransactionsByDateRange(startDate, endDate, req.query);

            return response.success(res, {
                transactions: result.transactions,
                pagination: result.pagination
            }, 'Transactions by date range retrieved successfully');
        } catch (error) {
            console.error('Get transactions by date range error:', error.message);
            const statusCode = error.message.includes('required') ||
                error.message.includes('Invalid') ||
                error.message.includes('must be') ? 400 : 500;
            return response.error(res, error.message, statusCode);
        }
    }

    static async getTransactionsByBatch(req, res) {
        try {
            const { batchId } = req.params;
            const result = await TransactionService.getTransactionsByBatch(batchId);

            return response.success(res, result, 'Batch transactions retrieved successfully');
        } catch (error) {
            console.error('Get transactions by batch error:', error.message);
            const statusCode = error.message.includes('required') ? 400 : 500;
            return response.error(res, error.message, statusCode);
        }
    }

    static async getStockSummary(req, res) {
        try {
            const { productId } = req.params;
            const { startDate, endDate } = req.query;

            const summary = await TransactionService.getStockSummary(productId, startDate, endDate);

            return response.success(res, summary, 'Stock summary retrieved successfully');
        } catch (error) {
            console.error('Get stock summary error:', error.message);
            const statusCode = error.message.includes('not found') ? 404 :
                error.message.includes('Invalid') ||
                    error.message.includes('must be') ? 400 : 500;
            return response.error(res, error.message, statusCode);
        }
    }

    static async deleteTransaction(req, res) {
        try {
            const { id } = req.params;
            const transaction = await TransactionService.deleteTransaction(id);

            return response.success(res, transaction, 'Transaction deleted successfully');
        } catch (error) {
            console.error('Delete transaction error:', error.message);
            const statusCode = error.message.includes('not found') ? 404 :
                error.message.includes('Invalid') ? 400 : 500;
            return response.error(res, error.message, statusCode);
        }
    }
}

export default TransactionController;