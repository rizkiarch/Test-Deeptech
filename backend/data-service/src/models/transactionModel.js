import pool from '../config/db.js';

class TransactionModel {
    static async getAllTransactions() {
        const query = `
            SELECT t.*, p.name as product_name 
            FROM transactions t 
            LEFT JOIN products p ON t.product_id = p.id 
            ORDER BY t.created_at DESC
        `;
        const [rows] = await pool.execute(query);
        return rows;
    }

    static async getTransactionById(id) {
        const query = `
            SELECT t.*, p.name as product_name 
            FROM transactions t 
            LEFT JOIN products p ON t.product_id = p.id 
            WHERE t.id = ?
        `;
        const [rows] = await pool.execute(query, [id]);
        return rows[0];
    }

    static async createTransaction(transactionData) {
        const { type, product_id, quantity, notes } = transactionData;
        const query = 'INSERT INTO transactions (type, product_id, quantity, notes) VALUES (?, ?, ?, ?)';
        const [result] = await pool.execute(query, [type, product_id, quantity, notes]);
        return result.insertId;
    }

    static async updateTransaction(id, transactionData) {
        const { type, product_id, quantity, notes } = transactionData;
        const query = 'UPDATE transactions SET type = ?, product_id = ?, quantity = ?, notes = ?, updated_at = NOW() WHERE id = ?';
        const [result] = await pool.execute(query, [type, product_id, quantity, notes, id]);
        return result.affectedRows > 0;
    }

    static async deleteTransaction(id) {
        const query = 'DELETE FROM transactions WHERE id = ?';
        const [result] = await pool.execute(query, [id]);
        return result.affectedRows > 0;
    }

    static async createBulkTransactions(transactionsData) {
        if (!Array.isArray(transactionsData) || transactionsData.length === 0) {
            return [];
        }

        const values = transactionsData.map(transaction => [
            transaction.type,
            transaction.product_id,
            transaction.quantity,
            transaction.notes || null
        ]);

        const placeholders = transactionsData.map(() => '(?, ?, ?, ?)').join(', ');
        const query = `INSERT INTO transactions (type, product_id, quantity, notes) VALUES ${placeholders}`;
        const flatValues = values.flat();

        const [result] = await pool.execute(query, flatValues);
        return {
            insertId: result.insertId,
            affectedRows: result.affectedRows
        };
    }

    static async getTransactionsByProductId(productId) {
        const query = 'SELECT * FROM transactions WHERE product_id = ? ORDER BY created_at DESC';
        const [rows] = await pool.execute(query, [productId]);
        return rows;
    }
}

export default TransactionModel;