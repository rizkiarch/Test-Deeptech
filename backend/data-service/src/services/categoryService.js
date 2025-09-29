import CategoryModel from "../models/categoryModel.js";

class CategoryService {
    static async getAllCategories() {
        const categories = await CategoryModel.getAllCategories();
        return { data: categories, message: 'Categories retrieved successfully', statusCode: 200 };
    }

    static async getCategoryById(id) {
        if (!id) {
            return { message: 'Category ID is required', statusCode: 400 };
        }

        const category = await CategoryModel.getCategoryById(id);
        if (!category) {
            return { message: 'Category not found', statusCode: 404 };
        }
        return { data: category, message: 'Category retrieved successfully', statusCode: 200 };
    }

    static async createCategory(categoryData) {
        const { name } = categoryData;

        if (!name) {
            return { message: 'Category name is required', statusCode: 400 };
        }

        const categoryId = await CategoryModel.createCategory(categoryData);
        const newCategory = await CategoryModel.getCategoryById(categoryId);
        
        return { 
            data: newCategory, 
            message: 'Category created successfully', 
            statusCode: 201 
        };
    }

    static async updateCategory(id, categoryData) {
        if (!id) {
            return { message: 'Category ID is required', statusCode: 400 };
        }

        const existingCategory = await CategoryModel.getCategoryById(id);
        if (!existingCategory) {
            return { message: 'Category not found', statusCode: 404 };
        }

        const { name } = categoryData;
        if (!name) {
            return { message: 'Category name is required', statusCode: 400 };
        }

        const updated = await CategoryModel.updateCategory(id, categoryData);
        if (!updated) {
            return { message: 'Failed to update category', statusCode: 500 };
        }

        const updatedCategory = await CategoryModel.getCategoryById(id);
        return { 
            data: updatedCategory, 
            message: 'Category updated successfully', 
            statusCode: 200 
        };
    }

    static async deleteCategory(id) {
        if (!id) {
            return { message: 'Category ID is required', statusCode: 400 };
        }

        const existingCategory = await CategoryModel.getCategoryById(id);
        if (!existingCategory) {
            return { message: 'Category not found', statusCode: 404 };
        }

        const deleted = await CategoryModel.deleteCategory(id);
        if (!deleted) {
            return { message: 'Failed to delete category', statusCode: 500 };
        }

        return { message: 'Category deleted successfully', statusCode: 200 };
    }
}

export default CategoryService;