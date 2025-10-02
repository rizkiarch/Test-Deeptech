import pool from '../config/db.js';

class ProductModel {
    static async getAllProducts() {
        const query = `
            SELECT 
                p.*, 
                c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id
            ORDER BY p.created_at DESC
        `;
        const [rows] = await pool.execute(query);
        return rows;
    }

    static async getProductById(id) {
        const query = `
            SELECT 
                p.*, 
                c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            WHERE p.id = ?
        `;
        const [rows] = await pool.execute(query, [id]);
        return rows[0];
    }

    static async createProduct(productData) {
        const { name, description, image, categoryId, stock, price } = productData;
        const query = 'INSERT INTO products (name, description, image, category_id, stock, price) VALUES (?, ?, ?, ?, ?, ?)';
        const [result] = await pool.execute(query, [name, description, image, categoryId, stock || 0, price || 0]);
        return result.insertId;
    }

    static async updateProduct(id, productData) {
        const { name, description, image, categoryId, stock, price } = productData;

        const safeName = name !== undefined ? name : null;
        const safeDescription = description !== undefined ? description : null;
        const safeImage = image !== undefined ? image : null;
        const safeCategoryId = categoryId !== undefined ? categoryId : null;
        const safeStock = stock !== undefined ? stock : null;
        const safePrice = price !== undefined ? price : null;

        const query = 'UPDATE products SET name = ?, description = ?, image = ?, category_id = ?, stock = ?, price = ?, updated_at = NOW() WHERE id = ?';
        const [result] = await pool.execute(query, [safeName, safeDescription, safeImage, safeCategoryId, safeStock, safePrice, id]);
        return result.affectedRows > 0;
    }

    static async deleteProduct(id) {
        const query = 'DELETE FROM products WHERE id = ?';
        const [result] = await pool.execute(query, [id]);
        return result.affectedRows > 0;
    }

    static async updateStock(id, newStock) {
        const query = 'UPDATE products SET stock = ?, updated_at = NOW() WHERE id = ?';
        const [result] = await pool.execute(query, [newStock, id]);
        return result.affectedRows > 0;
    }

    static async getProductsByCategory(categoryId) {
        const query = `
            SELECT 
                p.*, 
                c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            WHERE p.category_id = ?
            ORDER BY p.created_at DESC
        `;
        const [rows] = await pool.execute(query, [categoryId]);
        return rows;
    }
}

export default ProductModel;