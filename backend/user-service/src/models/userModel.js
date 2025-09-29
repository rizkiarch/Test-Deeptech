import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

class UserModel {
    static async findAll() {
        const query = 'SELECT * FROM users';
        const [rows] = await pool.execute(query);
        return rows;
    }

    static async findById(id) {
        const query = 'SELECT * FROM users WHERE id = ?';
        const [rows] = await pool.execute(query, [id]);
        return rows[0];
    }

    static async create(user) {
        const { password, email, first_name, last_name, birth_date, gender } = user;
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (first_name, last_name, email, birth_date, gender, password, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())';
        const values = [first_name, last_name, email, birth_date, gender, hashedPassword];
        const [result] = await pool.execute(query, values);

        const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [result.insertId]);
        return rows[0];
    }

    static async update(id, user) {
        const { first_name, last_name, email, birth_date, gender } = user;
        const query = 'UPDATE users SET first_name = ?, last_name = ?, email = ?, birth_date = ?, gender = ? WHERE id = ?';
        const values = [first_name, last_name, email, birth_date, gender, id];
        await pool.execute(query, values);

        const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0];
    }

    static async delete(id) {
        const query = 'DELETE FROM users WHERE id = ?';
        await pool.execute(query, [id]);
        return;
    }

    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await pool.execute(query, [email]);
        return rows[0];
    }
}

export default UserModel;