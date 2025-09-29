import TransactionModel from '../models/transactionModel.js';
import ProductModel from '../models/productModel.js';

class TransactionService {
    static async getAllTransactions(queryParams) {
        try {
            const {
                page = 1,
                limit = 10,
                sortBy = 'id',
                sortOrder = 'desc',
                type = null,
                productId = null,
                startDate = null,
                endDate = null,
                batchId = null
            } = queryParams;

            const validatedPage = Math.max(1, parseInt(page));
            const validatedLimit = Math.min(100, Math.max(1, parseInt(limit)));

            const validSortFields = ['id', 'type', 'quantity', 'createdAt', 'updatedAt'];
            const validatedSortBy = validSortFields.includes(sortBy) ? sortBy : 'id';
            const validatedSortOrder = ['asc', 'desc'].includes(sortOrder) ? sortOrder : 'desc';

            if (type && !['in', 'out'].includes(type)) {
                throw new Error('Invalid transaction type. Must be "in" or "out"');
            }

            if (productId) {
                const productExists = await ProductModel.exists(parseInt(productId));
                if (!productExists) {
                    throw new Error('Product not found');
                }
            }

            if (startDate && endDate) {
                const start = new Date(startDate);
                const end = new Date(endDate);
                if (start > end) {
                    throw new Error('Start date must be before end date');
                }
            }

            const params = {
                page: validatedPage,
                limit: validatedLimit,
                sortBy: validatedSortBy,
                sortOrder: validatedSortOrder,
                type,
                productId: productId ? parseInt(productId) : null,
                startDate,
                endDate,
                batchId
            };

            return await TransactionModel.findAll(params);
        } catch (error) {
            throw new Error(`Service error: ${error.message}`);
        }
    }

    static async getTransactionById(id) {
        try {
            const transactionId = parseInt(id);
            if (!transactionId || transactionId <= 0) {
                throw new Error('Invalid transaction ID');
            }

            const transaction = await TransactionModel.findById(transactionId);
            if (!transaction) {
                throw new Error('Transaction not found');
            }

            return transaction;
        } catch (error) {
            throw new Error(`Service error: ${error.message}`);
        }
    }

    static async createSingleTransaction(transactionData) {
        try {
            const { productId, type, quantity, notes } = transactionData;

            if (!productId) {
                throw new Error('Product ID is required');
            }

            if (!type || !['in', 'out'].includes(type)) {
                throw new Error('Valid transaction type ("in" or "out") is required');
            }

            if (!quantity || quantity <= 0) {
                throw new Error('Quantity must be greater than 0');
            }

            const product = await ProductModel.findById(parseInt(productId));
            if (!product) {
                throw new Error('Product not found');
            }

            if (type === 'out' && product.stock < parseInt(quantity)) {
                throw new Error(`Insufficient stock. Available: ${product.stock}, Requested: ${quantity}`);
            }

            const newTransactionData = {
                productId: parseInt(productId),
                type,
                quantity: parseInt(quantity),
                notes: notes?.trim() || null
            };

            const transaction = await TransactionModel.create(newTransactionData);

            if (type === 'in') {
                await ProductModel.updateStock(parseInt(productId), parseInt(quantity), 'add');
            } else if (type === 'out') {
                await ProductModel.updateStock(parseInt(productId), parseInt(quantity), 'subtract');
            }

            return transaction;
        } catch (error) {
            throw new Error(`Service error: ${error.message}`);
        }
    }

    static async createBulkTransactions(transactionsData) {
        try {
            if (!Array.isArray(transactionsData) || transactionsData.length === 0) {
                throw new Error('Transactions data must be a non-empty array');
            }

            const validatedTransactions = [];
            const productStockChanges = new Map();

            for (let i = 0; i < transactionsData.length; i++) {
                const transaction = transactionsData[i];
                const { productId, type, quantity, notes } = transaction;

                if (!productId) {
                    throw new Error(`Transaction ${i + 1}: Product ID is required`);
                }

                if (!type || !['in', 'out'].includes(type)) {
                    throw new Error(`Transaction ${i + 1}: Valid transaction type ("in" or "out") is required`);
                }

                if (!quantity || quantity <= 0) {
                    throw new Error(`Transaction ${i + 1}: Quantity must be greater than 0`);
                }

                const product = await ProductModel.findById(parseInt(productId));
                if (!product) {
                    throw new Error(`Transaction ${i + 1}: Product not found`);
                }

                const prodId = parseInt(productId);
                if (!productStockChanges.has(prodId)) {
                    productStockChanges.set(prodId, {
                        currentStock: product.stock,
                        netChange: 0,
                        productName: product.name
                    });
                }

                const stockInfo = productStockChanges.get(prodId);
                const qty = parseInt(quantity);

                if (type === 'in') {
                    stockInfo.netChange += qty;
                } else if (type === 'out') {
                    stockInfo.netChange -= qty;
                }

                if (stockInfo.currentStock + stockInfo.netChange < 0) {
                    throw new Error(
                        `Transaction ${i + 1}: Insufficient stock for ${stockInfo.productName}. ` +
                        `Available: ${stockInfo.currentStock}, Total requested out: ${Math.abs(stockInfo.netChange)}`
                    );
                }

                validatedTransactions.push({
                    productId: prodId,
                    type,
                    quantity: qty,
                    notes: notes?.trim() || null
                });
            }

            const result = await TransactionModel.createBulk(validatedTransactions);

            for (const [productId, stockInfo] of productStockChanges) {
                if (stockInfo.netChange !== 0) {
                    const newStock = stockInfo.currentStock + stockInfo.netChange;
                    await ProductModel.updateStock(productId, newStock, 'set');
                }
            }

            return result;
        } catch (error) {
            throw new Error(`Service error: ${error.message}`);
        }
    }

    static async getTransactionsByProduct(productId, queryParams = {}) {
        try {
            const validatedProductId = parseInt(productId);
            if (!validatedProductId || validatedProductId <= 0) {
                throw new Error('Invalid product ID');
            }

            const productExists = await ProductModel.exists(validatedProductId);
            if (!productExists) {
                throw new Error('Product not found');
            }

            return await TransactionModel.findByProduct(validatedProductId, queryParams);
        } catch (error) {
            throw new Error(`Service error: ${error.message}`);
        }
    }

    static async getTransactionsByType(type, queryParams = {}) {
        try {
            if (!['in', 'out'].includes(type)) {
                throw new Error('Invalid transaction type. Must be "in" or "out"');
            }

            return await TransactionModel.findByType(type, queryParams);
        } catch (error) {
            throw new Error(`Service error: ${error.message}`);
        }
    }

    static async getTransactionsByDateRange(startDate, endDate, queryParams = {}) {
        try {
            if (!startDate || !endDate) {
                throw new Error('Both start date and end date are required');
            }

            const start = new Date(startDate);
            const end = new Date(endDate);

            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                throw new Error('Invalid date format');
            }

            if (start > end) {
                throw new Error('Start date must be before end date');
            }

            return await TransactionModel.findByDateRange(startDate, endDate, queryParams);
        } catch (error) {
            throw new Error(`Service error: ${error.message}`);
        }
    }

    static async getTransactionsByBatch(batchId) {
        try {
            if (!batchId || !batchId.trim()) {
                throw new Error('Batch ID is required');
            }

            return await TransactionModel.findByBatch(batchId.trim());
        } catch (error) {
            throw new Error(`Service error: ${error.message}`);
        }
    }

    static async getStockSummary(productId, startDate = null, endDate = null) {
        try {
            const validatedProductId = parseInt(productId);
            if (!validatedProductId || validatedProductId <= 0) {
                throw new Error('Invalid product ID');
            }

            const productExists = await ProductModel.exists(validatedProductId);
            if (!productExists) {
                throw new Error('Product not found');
            }

            if (startDate && endDate) {
                const start = new Date(startDate);
                const end = new Date(endDate);

                if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                    throw new Error('Invalid date format');
                }

                if (start > end) {
                    throw new Error('Start date must be before end date');
                }
            }

            return await TransactionModel.getStockSummary(validatedProductId, startDate, endDate);
        } catch (error) {
            throw new Error(`Service error: ${error.message}`);
        }
    }

    static async deleteTransaction(id) {
        try {
            const transactionId = parseInt(id);
            if (!transactionId || transactionId <= 0) {
                throw new Error('Invalid transaction ID');
            }

            const transaction = await TransactionModel.findById(transactionId);
            if (!transaction) {
                throw new Error('Transaction not found');
            }

            if (transaction.type === 'in') {
                await ProductModel.updateStock(transaction.productId, transaction.quantity, 'subtract');
            } else if (transaction.type === 'out') {
                await ProductModel.updateStock(transaction.productId, transaction.quantity, 'add');
            }

            return await TransactionModel.delete(transactionId);
        } catch (error) {
            throw new Error(`Service error: ${error.message}`);
        }
    }
}

export default TransactionService;