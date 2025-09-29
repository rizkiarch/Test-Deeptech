import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import UserModel from '../models/userModel.js';
import ENV from "../config/env.js";

class AuthService {
    static async login({ email, password }) {
        const user = await UserModel.findByEmail(email);
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!user) {
            return { message: 'User not found', statusCode: 404 };
        }

        if (!isPasswordValid) {
            return { message: 'Invalid password or Email', statusCode: 401 };
        }

        if (!user.id) {
            return {
                message: 'User ID is missing',
                statusCode: 500
            };
        }

        const token = jwt.sign({ id: user.id, email: user.email }, ENV.JWT_SECRET, { expiresIn: ENV.JWT_EXPIRES_IN });
        return {
            data: { token, user: { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name } },
            message: 'Login successful',
            statusCode: 200
        };
    }

    static async logout() {
        return {
            data: null,
            message: 'Logout successful',
            statusCode: 200
        };
    }
}

export default AuthService;