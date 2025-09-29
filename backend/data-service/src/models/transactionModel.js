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
        const [result] = await pool.execute(query, [type, product_id, quantity, notes || null]);
        return result.insertId;
    }

    static async updateTransaction(id, transactionData) {
        const updateFields = [];
        const values = [];

        if (transactionData.type !== undefined) {
            updateFields.push('type = ?');
            values.push(transactionData.type);
        }

        if (transactionData.product_id !== undefined) {
            updateFields.push('product_id = ?');
            values.push(transactionData.product_id);
        }

        if (transactionData.quantity !== undefined) {
            updateFields.push('quantity = ?');
            values.push(transactionData.quantity);
        }

        if (transactionData.notes !== undefined) {
            updateFields.push('notes = ?');
            values.push(transactionData.notes || null);
        }

        if (updateFields.length === 0) {
            return false;
        }

        updateFields.push('updated_at = NOW()');
        values.push(id);

        const query = `UPDATE transactions SET ${updateFields.join(', ')} WHERE id = ?`;
        const [result] = await pool.execute(query, values);
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