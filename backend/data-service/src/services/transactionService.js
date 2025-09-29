import TransactionModel from "../models/transactionModel.js";
import ProductModel from "../models/productModel.js";

class TransactionService {
    static async getAllTransactions() {
        const transactions = await TransactionModel.getAllTransactions();
        return { data: transactions, message: 'Transactions retrieved successfully', statusCode: 200 };
    }

    static async getTransactionById(id) {
        const transaction = await TransactionModel.getTransactionById(id);
        if (!transaction) {
            return {
                message: 'Transaction not found',
                statusCode: 404
            };
        }
        return { data: transaction, message: 'Transaction retrieved successfully', statusCode: 200 };
    }

    static async createTransaction(transactionData) {
        if (!transactionData) {
            return {
                message: 'Transaction data is required',
                statusCode: 400
            };
        }

        const requiredFields = ['type', 'product_id', 'quantity'];
        const missingFields = requiredFields.filter(field => !transactionData[field] && transactionData[field] !== 0);
        if (missingFields.length > 0) {
            return {
                message: `Missing required fields: ${missingFields.join(', ')}`,
                statusCode: 400
            };
        }

        if (isNaN(transactionData.quantity) || transactionData.quantity <= 0) {
            return {
                message: 'Quantity must be a positive number',
                statusCode: 400
            };
        }

        const validTypes = ['stock_in', 'stock_out'];
        if (!validTypes.includes(transactionData.type)) {
            return {
                message: 'Type must be either stock_in or stock_out',
                statusCode: 400
            };
        }

        const product = await ProductModel.getProductById(transactionData.product_id);
        if (!product) {
            return {
                message: 'Product not found',
                statusCode: 404
            };
        }

        if (transactionData.type === 'stock_out' && product.stock < transactionData.quantity) {
            return {
                message: 'Insufficient stock',
                statusCode: 400
            };
        }

        const newTransactionId = await TransactionModel.createTransaction(transactionData);

        const newStock = transactionData.type === 'stock_in'
            ? product.stock + parseInt(transactionData.quantity)
            : product.stock - parseInt(transactionData.quantity);

        await ProductModel.updateStock(transactionData.product_id, newStock);

        return { data: { id: newTransactionId }, message: 'Transaction created successfully', statusCode: 201 };
    }

    static async updateTransaction(id, transactionData) {
        const transaction = await TransactionModel.getTransactionById(id);
        if (!transaction) {
            return {
                message: 'Transaction not found',
                statusCode: 404
            };
        }

        if (transactionData.type && !['stock_in', 'stock_out'].includes(transactionData.type)) {
            return {
                message: 'Type must be either stock_in or stock_out',
                statusCode: 400
            };
        }

        let newProduct = null;
        if (transactionData.product_id) {
            newProduct = await ProductModel.getProductById(transactionData.product_id);
            if (!newProduct) {
                return {
                    message: 'Product not found',
                    statusCode: 404
                };
            }
        }

        if (transactionData.quantity !== undefined) {
            if (isNaN(transactionData.quantity) || transactionData.quantity <= 0) {
                return {
                    message: 'Quantity must be a positive number',
                    statusCode: 400
                };
            }
        }

        const currentProduct = await ProductModel.getProductById(transaction.product_id);
        if (!currentProduct) {
            return {
                message: 'Current product not found',
                statusCode: 404
            };
        }

        const oldType = transaction.type;
        const oldQuantity = parseInt(transaction.quantity);
        const oldProductId = transaction.product_id;

        const newType = transactionData.type || oldType;
        const newQuantity = transactionData.quantity ? parseInt(transactionData.quantity) : oldQuantity;
        const newProductId = transactionData.product_id || oldProductId;

        let oldProductNewStock = currentProduct.stock;
        if (oldType === 'stock_in') {
            oldProductNewStock -= oldQuantity;
        } else {
            oldProductNewStock += oldQuantity;
        }

        if (newProductId === oldProductId) {
            if (newType === 'stock_in') {
                oldProductNewStock += newQuantity;
            } else {
                if (oldProductNewStock < newQuantity) {
                    return {
                        message: 'Insufficient stock after adjustment',
                        statusCode: 400
                    };
                }
                oldProductNewStock -= newQuantity;
            }

            await ProductModel.updateStock(oldProductId, oldProductNewStock);
        } else {
            await ProductModel.updateStock(oldProductId, oldProductNewStock);

            const targetProduct = newProduct || await ProductModel.getProductById(newProductId);
            let targetProductStock = targetProduct.stock;

            if (newType === 'stock_in') {
                targetProductStock += newQuantity;
            } else {
                if (targetProductStock < newQuantity) {
                    return {
                        message: 'Insufficient stock in target product',
                        statusCode: 400
                    };
                }
                targetProductStock -= newQuantity;
            }

            await ProductModel.updateStock(newProductId, targetProductStock);
        }

        const updatedTransaction = await TransactionModel.updateTransaction(id, transactionData);
        return { data: updatedTransaction, message: 'Transaction updated successfully', statusCode: 200 };
    }

    static async deleteTransaction(id) {
        const transaction = await TransactionModel.getTransactionById(id);
        if (!transaction) {
            return {
                message: 'Transaction not found',
                statusCode: 404
            };
        }

        const product = await ProductModel.getProductById(transaction.product_id);
        if (!product) {
            return {
                message: 'Product not found',
                statusCode: 404
            };
        }

        let newStock = product.stock;
        if (transaction.type === 'stock_in') {
            newStock -= parseInt(transaction.quantity);
            if (newStock < 0) {
                return {
                    message: 'Cannot delete transaction: would result in negative stock',
                    statusCode: 400
                };
            }
        } else {
            newStock += parseInt(transaction.quantity);
        }

        await ProductModel.updateStock(transaction.product_id, newStock);

        await TransactionModel.deleteTransaction(id);
        return { message: 'Transaction deleted successfully', statusCode: 200 };
    }

    static async createBulkTransactions(transactionsData) {
        if (!Array.isArray(transactionsData) || transactionsData.length === 0) {
            return {
                message: 'Transactions data must be a non-empty array',
                statusCode: 400
            };
        }

        const validTransactions = [];
        const errors = [];
        const productStockUpdates = new Map();

        for (let i = 0; i < transactionsData.length; i++) {
            const transactionData = transactionsData[i];

            const requiredFields = ['type', 'product_id', 'quantity'];
            const missingFields = requiredFields.filter(field => !transactionData[field] && transactionData[field] !== 0);
            if (missingFields.length > 0) {
                errors.push({
                    index: i,
                    message: `Missing required fields: ${missingFields.join(', ')}`
                });
                continue;
            }

            if (isNaN(transactionData.quantity) || transactionData.quantity <= 0) {
                errors.push({
                    index: i,
                    message: 'Quantity must be a positive number'
                });
                continue;
            }

            const validTypes = ['stock_in', 'stock_out'];
            if (!validTypes.includes(transactionData.type)) {
                errors.push({
                    index: i,
                    message: 'Type must be either stock_in or stock_out'
                });
                continue;
            }

            const product = await ProductModel.getProductById(transactionData.product_id);
            if (!product) {
                errors.push({
                    index: i,
                    message: 'Product not found'
                });
                continue;
            }

            let currentStock = productStockUpdates.get(transactionData.product_id) || product.stock;

            if (transactionData.type === 'stock_out' && currentStock < transactionData.quantity) {
                errors.push({
                    index: i,
                    message: 'Insufficient stock'
                });
                continue;
            }

            const newStock = transactionData.type === 'stock_in'
                ? currentStock + parseInt(transactionData.quantity)
                : currentStock - parseInt(transactionData.quantity);

            productStockUpdates.set(transactionData.product_id, newStock);

            validTransactions.push({
                index: i,
                ...transactionData
            });
        }

        if (validTransactions.length === 0) {
            return {
                message: 'All transactions failed validation',
                errors: errors,
                statusCode: 400
            };
        }

        try {
            const bulkResult = await TransactionModel.createBulkTransactions(validTransactions);

            for (const [productId, newStock] of productStockUpdates) {
                await ProductModel.updateStock(productId, newStock);
            }

            return {
                data: {
                    successful: validTransactions.map((t, idx) => ({
                        index: t.index,
                        id: bulkResult.insertId + idx,
                        product_id: t.product_id,
                        type: t.type,
                        quantity: t.quantity
                    })),
                    failed: errors,
                    totalProcessed: transactionsData.length,
                    successCount: validTransactions.length,
                    errorCount: errors.length
                },
                message: `Bulk transactions processed: ${validTransactions.length} successful, ${errors.length} failed`,
                statusCode: 201
            };
        } catch (error) {
            return {
                message: 'Failed to create bulk transactions',
                error: error.message,
                statusCode: 500
            };
        }
    }

    static async updateBulkTransactions(transactionsData) {
        if (!Array.isArray(transactionsData) || transactionsData.length === 0) {
            return {
                message: 'Transactions data must be a non-empty array',
                statusCode: 400
            };
        }

        const results = [];
        const errors = [];

        for (let i = 0; i < transactionsData.length; i++) {
            const { id, ...updateData } = transactionsData[i];

            if (!id) {
                errors.push({
                    index: i,
                    message: 'Transaction ID is required'
                });
                continue;
            }

            const transaction = await TransactionModel.getTransactionById(id);
            if (!transaction) {
                errors.push({
                    index: i,
                    message: 'Transaction not found'
                });
                continue;
            }

            if (updateData.type && !['stock_in', 'stock_out'].includes(updateData.type)) {
                errors.push({
                    index: i,
                    message: 'Type must be either stock_in or stock_out'
                });
                continue;
            }

            if (updateData.product_id) {
                const product = await ProductModel.getProductById(updateData.product_id);
                if (!product) {
                    errors.push({
                        index: i,
                        message: 'Product not found'
                    });
                    continue;
                }
            }

            try {
                const updated = await TransactionModel.updateTransaction(id, updateData);
                results.push({
                    index: i,
                    id: id,
                    updated: updated
                });
            } catch (error) {
                errors.push({
                    index: i,
                    message: error.message
                });
            }
        }

        if (errors.length > 0 && results.length === 0) {
            return {
                message: 'All transaction updates failed',
                errors: errors,
                statusCode: 400
            };
        }

        return {
            data: {
                successful: results,
                failed: errors,
                totalProcessed: transactionsData.length,
                successCount: results.length,
                errorCount: errors.length
            },
            message: `Bulk transaction updates processed: ${results.length} successful, ${errors.length} failed`,
            statusCode: results.length > 0 ? 200 : 400
        };
    }

    static async getTransactionsByProductId(productId) {
        const product = await ProductModel.getProductById(productId);
        if (!product) {
            return {
                message: 'Product not found',
                statusCode: 404
            };
        }

        const transactions = await TransactionModel.getTransactionsByProductId(productId);
        return { data: transactions, message: 'Product transactions retrieved successfully', statusCode: 200 };
    }
}

export default TransactionService;