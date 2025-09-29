import pool from '../config/db.js';

class CategoryModel {
    static async getAllCategories() {
        const query = 'SELECT * FROM categories ORDER BY created_at DESC';
        const [rows] = await pool.execute(query);
        return rows;
    }

    static async getCategoryById(id) {
        const query = 'SELECT * FROM categories WHERE id = ?';
        const [rows] = await pool.execute(query, [id]);
        return rows[0];
    }

    static async createCategory(categoryData) {
        const { name, description } = categoryData;
        const query = 'INSERT INTO categories (name, description) VALUES (?, ?)';
        const [result] = await pool.execute(query, [name, description]);
        return result.insertId;
    }

    static async updateCategory(id, categoryData) {
        const { name, description } = categoryData;
        const query = 'UPDATE categories SET name = ?, description = ?, updated_at = NOW() WHERE id = ?';
        const [result] = await pool.execute(query, [name, description, id]);
        return result.affectedRows > 0;
    }

    static async deleteCategory(id) {
        const query = 'DELETE FROM categories WHERE id = ?';
        const [result] = await pool.execute(query, [id]);
        return result.affectedRows > 0;
    }
}

export default CategoryModel;