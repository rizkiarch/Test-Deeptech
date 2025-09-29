import db from '../db/connection.js';
import { transactionsTable, productsTable, categoriesTable } from '../db/schema.js';
import { eq, desc, asc, and, gte, lte, inArray, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

class TransactionModel {
    static async findAll(params = {}) {
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
            } = params;

            const offset = (page - 1) * limit;
            let query = db
                .select({
                    id: transactionsTable.id,
                    productId: transactionsTable.productId,
                    productName: productsTable.name,
                    categoryName: categoriesTable.name,
                    type: transactionsTable.type,
                    quantity: transactionsTable.quantity,
                    notes: transactionsTable.notes,
                    batchId: transactionsTable.batchId,
                    createdAt: transactionsTable.createdAt,
                    updatedAt: transactionsTable.updatedAt
                })
                .from(transactionsTable)
                .leftJoin(productsTable, eq(transactionsTable.productId, productsTable.id))
                .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
                .limit(limit)
                .offset(offset);

            const conditions = [];

            if (type) {
                conditions.push(eq(transactionsTable.type, type));
            }

            if (productId) {
                conditions.push(eq(transactionsTable.productId, productId));
            }

            if (batchId) {
                conditions.push(eq(transactionsTable.batchId, batchId));
            }

            if (startDate) {
                conditions.push(gte(transactionsTable.createdAt, startDate));
            }

            if (endDate) {
                conditions.push(lte(transactionsTable.createdAt, endDate));
            }

            if (conditions.length > 0) {
                query = query.where(and(...conditions));
            }

            const orderColumn = transactionsTable[sortBy] || transactionsTable.id;
            query = query.orderBy(
                sortOrder === 'asc' ? asc(orderColumn) : desc(orderColumn)
            );

            const transactions = await query;

            let countQuery = db
                .select({ count: sql`count(*)` })
                .from(transactionsTable);

            if (conditions.length > 0) {
                countQuery = countQuery.where(and(...conditions));
            }

            const [{ count }] = await countQuery;
            const totalPages = Math.ceil(count / limit);

            return {
                transactions,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems: count,
                    itemsPerPage: limit,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            };
        } catch (error) {
            throw new Error(`Error fetching transactions: ${error.message}`);
        }
    }

    static async findById(id) {
        try {
            const [transaction] = await db
                .select({
                    id: transactionsTable.id,
                    productId: transactionsTable.productId,
                    productName: productsTable.name,
                    categoryName: categoriesTable.name,
                    type: transactionsTable.type,
                    quantity: transactionsTable.quantity,
                    notes: transactionsTable.notes,
                    batchId: transactionsTable.batchId,
                    createdAt: transactionsTable.createdAt,
                    updatedAt: transactionsTable.updatedAt
                })
                .from(transactionsTable)
                .leftJoin(productsTable, eq(transactionsTable.productId, productsTable.id))
                .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
                .where(eq(transactionsTable.id, id))
                .limit(1);

            return transaction || null;
        } catch (error) {
            throw new Error(`Error fetching transaction: ${error.message}`);
        }
    }

    static async create(transactionData) {
        try {
            const [result] = await db
                .insert(transactionsTable)
                .values({
                    productId: transactionData.productId,
                    type: transactionData.type,
                    quantity: transactionData.quantity,
                    notes: transactionData.notes || null,
                    batchId: transactionData.batchId || null
                });

            return await this.findById(result.insertId);
        } catch (error) {
            throw new Error(`Error creating transaction: ${error.message}`);
        }
    }

    static async createBulk(transactionsData) {
        try {
            const batchId = uuidv4();
            const transactionsWithBatch = transactionsData.map(transaction => ({
                ...transaction,
                batchId,
                notes: transaction.notes || null
            }));

            await db
                .insert(transactionsTable)
                .values(transactionsWithBatch);

            const batchTransactions = await db
                .select({
                    id: transactionsTable.id,
                    productId: transactionsTable.productId,
                    productName: productsTable.name,
                    categoryName: categoriesTable.name,
                    type: transactionsTable.type,
                    quantity: transactionsTable.quantity,
                    notes: transactionsTable.notes,
                    batchId: transactionsTable.batchId,
                    createdAt: transactionsTable.createdAt,
                    updatedAt: transactionsTable.updatedAt
                })
                .from(transactionsTable)
                .leftJoin(productsTable, eq(transactionsTable.productId, productsTable.id))
                .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
                .where(eq(transactionsTable.batchId, batchId))
                .orderBy(desc(transactionsTable.createdAt));

            return {
                batchId,
                transactions: batchTransactions,
                totalTransactions: batchTransactions.length
            };
        } catch (error) {
            throw new Error(`Error creating bulk transactions: ${error.message}`);
        }
    }

    static async findByProduct(productId, params = {}) {
        try {
            return await this.findAll({ ...params, productId });
        } catch (error) {
            throw new Error(`Error fetching product transactions: ${error.message}`);
        }
    }

    static async findByType(type, params = {}) {
        try {
            return await this.findAll({ ...params, type });
        } catch (error) {
            throw new Error(`Error fetching transactions by type: ${error.message}`);
        }
    }

    static async findByDateRange(startDate, endDate, params = {}) {
        try {
            return await this.findAll({ ...params, startDate, endDate });
        } catch (error) {
            throw new Error(`Error fetching transactions by date range: ${error.message}`);
        }
    }

    static async findByBatch(batchId) {
        try {
            const transactions = await db
                .select({
                    id: transactionsTable.id,
                    productId: transactionsTable.productId,
                    productName: productsTable.name,
                    categoryName: categoriesTable.name,
                    type: transactionsTable.type,
                    quantity: transactionsTable.quantity,
                    notes: transactionsTable.notes,
                    batchId: transactionsTable.batchId,
                    createdAt: transactionsTable.createdAt,
                    updatedAt: transactionsTable.updatedAt
                })
                .from(transactionsTable)
                .leftJoin(productsTable, eq(transactionsTable.productId, productsTable.id))
                .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
                .where(eq(transactionsTable.batchId, batchId))
                .orderBy(desc(transactionsTable.createdAt));

            return {
                batchId,
                transactions,
                totalTransactions: transactions.length
            };
        } catch (error) {
            throw new Error(`Error fetching batch transactions: ${error.message}`);
        }
    }

    static async getStockSummary(productId, startDate = null, endDate = null) {
        try {
            let query = db
                .select({
                    type: transactionsTable.type,
                    totalQuantity: sql`SUM(${transactionsTable.quantity})`
                })
                .from(transactionsTable)
                .where(eq(transactionsTable.productId, productId))
                .groupBy(transactionsTable.type);

            const conditions = [eq(transactionsTable.productId, productId)];

            if (startDate) {
                conditions.push(gte(transactionsTable.createdAt, startDate));
            }

            if (endDate) {
                conditions.push(lte(transactionsTable.createdAt, endDate));
            }

            if (conditions.length > 1) {
                query = query.where(and(...conditions));
            }

            const results = await query;

            let totalIn = 0;
            let totalOut = 0;

            results.forEach(result => {
                if (result.type === 'in') {
                    totalIn = parseInt(result.totalQuantity) || 0;
                } else if (result.type === 'out') {
                    totalOut = parseInt(result.totalQuantity) || 0;
                }
            });

            return {
                productId,
                totalIn,
                totalOut,
                netStock: totalIn - totalOut,
                period: {
                    startDate,
                    endDate
                }
            };
        } catch (error) {
            throw new Error(`Error getting stock summary: ${error.message}`);
        }
    }

    static async delete(id) {
        try {
            const transaction = await this.findById(id);
            if (!transaction) {
                return null;
            }

            await db
                .delete(transactionsTable)
                .where(eq(transactionsTable.id, id));

            return transaction;
        } catch (error) {
            throw new Error(`Error deleting transaction: ${error.message}`);
        }
    }
}

export default TransactionModel;