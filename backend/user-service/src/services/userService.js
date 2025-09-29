import UserModel from "../models/userModel.js";

class UserService {
    static async getAllUsers() {
        const users = await UserModel.findAll();
        return { data: users, message: 'Users retrieved successfully', statusCode: 200 };
    }

    static async getUserById(id) {
        const user = await UserModel.findById(id);
        if (!user) {
            return {
                message: 'User not found',
                statusCode: 404
            };
        }
        return { data: user, message: 'User retrieved successfully', statusCode: 200 };
    }

    static async createUser(userData) {
        const requiredFields = ['first_name', 'last_name', 'email', 'birth_date', 'gender', 'password'];
        const missingFields = requiredFields.filter(field => !userData[field]);

        if (missingFields.length > 0) {
            return {
                message: `Missing required fields: ${missingFields.join(', ')}`,
                statusCode: 400
            };
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            return {
                message: 'Invalid email format',
                statusCode: 400
            };
        }

        if (!['laki-laki', 'perempuan'].includes(userData.gender)) {
            return {
                message: 'Gender must be either "laki-laki" or "perempuan"',
                statusCode: 400
            };
        }

        const existingUser = await UserModel.findByEmail(userData.email);
        if (existingUser) {
            return {
                message: 'Email already exists',
                statusCode: 409
            };
        }

        const newUser = await UserModel.create(userData);
        return { data: newUser, message: 'User created successfully', statusCode: 201 };
    }

    static async updateUser(id, userData) {
        const user = await UserModel.findById(id);
        if (!user) {
            return {
                message: 'User not found',
                statusCode: 404
            };
        }
        const updatedUser = await UserModel.update(id, userData);
        return { data: updatedUser, message: 'User updated successfully', statusCode: 200 };
    }

    static async deleteUser(id) {
        const user = await UserModel.findById(id);
        if (!user) {
            return {
                message: 'User not found',
                statusCode: 404
            };
        }
        await UserModel.delete(id);
        return { data: null, message: 'User deleted successfully', statusCode: 200 };
    }
}

export default UserService;