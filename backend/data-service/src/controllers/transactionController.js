import TransactionService from '../services/transactionService.js';
import Response from '../utils/response.js';

class TransactionController {
    static async getAllTransactions(req, res) {
        try {
            const result = await TransactionService.getAllTransactions();
            res.status(result.statusCode).json(Response.success(result.data, result.message));
        } catch (error) {
            res.status(500).json(Response.error(error.message));
        }
    }

    static async getTransactionById(req, res) {
        try {
            const { id } = req.params;
            const result = await TransactionService.getTransactionById(id);
            if (result.statusCode === 404) {
                return res.status(404).json(Response.error(result.message));
            }
            res.status(result.statusCode).json(Response.success(result.data, result.message));
        } catch (error) {
            res.status(500).json(Response.error(error.message));
        }
    }

    static async createTransaction(req, res) {
        try {
            const result = await TransactionService.createTransaction(req.body);
            if (result.statusCode !== 201) {
                return res.status(result.statusCode).json(Response.error(result.message));
            }
            res.status(result.statusCode).json(Response.success(result.data, result.message));
        } catch (error) {
            res.status(500).json(Response.error(error.message));
        }
    }

    static async updateTransaction(req, res) {
        try {
            const { id } = req.params;
            const result = await TransactionService.updateTransaction(id, req.body);
            if (result.statusCode !== 200) {
                return res.status(result.statusCode).json(Response.error(result.message));
            }
            res.status(result.statusCode).json(Response.success(result.data, result.message));
        } catch (error) {
            res.status(500).json(Response.error(error.message));
        }
    }

    static async deleteTransaction(req, res) {
        try {
            const { id } = req.params;
            const result = await TransactionService.deleteTransaction(id);
            if (result.statusCode === 404) {
                return res.status(404).json(Response.error(result.message));
            }
            res.status(result.statusCode).json(Response.success(null, result.message));
        } catch (error) {
            res.status(500).json(Response.error(error.message));
        }
    }

    static async createBulkTransactions(req, res) {
        try {
            const result = await TransactionService.createBulkTransactions(req.body);
            if (result.statusCode === 400) {
                return res.status(400).json(Response.error(result.message, result.errors));
            }
            res.status(result.statusCode).json(Response.success(result.data, result.message));
        } catch (error) {
            res.status(500).json(Response.error(error.message));
        }
    }

    static async updateBulkTransactions(req, res) {
        try {
            const result = await TransactionService.updateBulkTransactions(req.body);
            if (result.statusCode === 400) {
                return res.status(400).json(Response.error(result.message, result.errors));
            }
            res.status(result.statusCode).json(Response.success(result.data, result.message));
        } catch (error) {
            res.status(500).json(Response.error(error.message));
        }
    }

    static async getTransactionsByProductId(req, res) {
        try {
            const { productId } = req.params;
            const result = await TransactionService.getTransactionsByProductId(productId);
            if (result.statusCode === 404) {
                return res.status(404).json(Response.error(result.message));
            }
            res.status(result.statusCode).json(Response.success(result.data, result.message));
        } catch (error) {
            res.status(500).json(Response.error(error.message));
        }
    }
}

export default TransactionController;