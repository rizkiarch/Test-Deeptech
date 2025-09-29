import CategoryModel from "../models/categoryModel.js";

class CategoryService {
    static async getAllCategories() {
        const Category = await CategoryModel.getAllCategories();
        return { data: Category, message: 'Categories retrieved successfully', statusCode: 200 };
    }

    static async getCategoryById(id) {
        const Category = await CategoryModel.getCategoryById(id);
        if (!Category) {
            return {
                message: 'Category not found',
                statusCode: 404
            };
        }
        return { data: Category, message: 'Category retrieved successfully', statusCode: 200 };
    }

    static async createCategory(categoryData) {
        if (!categoryData) {
            return {
                message: 'Category data is required',
                statusCode: 400
            };
        }

        const requiredFields = ['name'];
        const missingFields = requiredFields.filter(field => !categoryData[field]);
        if (missingFields.length > 0) {
            return {
                message: `Missing required fields: ${missingFields.join(', ')}`,
                statusCode: 400
            };
        }
        const newCategory = await CategoryModel.createCategory(categoryData);
        return { data: newCategory, message: 'Category created successfully', statusCode: 201 };
    }

    static async updateCategory(id, categoryData) {
        const Category = await CategoryModel.getCategoryById(id);
        if (!Category) {
            return {
                message: 'Category not found',
                statusCode: 404
            };
        }
        const updatedCategory = await CategoryModel.updateCategory(id, categoryData);
        return { data: updatedCategory, message: 'Category updated successfully', statusCode: 200 };
    }

    static async deleteCategory(id) {
        const Category = await CategoryModel.getCategoryById(id);
        if (!Category) {
            return {
                message: 'Category not found',
                statusCode: 404
            };
        }
        await CategoryModel.deleteCategory(id);
        return { message: 'Category deleted successfully', statusCode: 200 };
    }
}

export default CategoryService;