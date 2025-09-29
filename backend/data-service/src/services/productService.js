import ProductModel from "../models/productModel.js";
import CategoryModel from "../models/categoryModel.js";
import { getFileUrl, deleteFile } from "../middlewares/upload.js";

class ProductService {
    static async getAllProducts(req) {
        const products = await ProductModel.getAllProducts();

        const productsWithUrls = products.map(product => ({
            ...product,
            image_url: product.image ? getFileUrl(req, product.image) : null
        }));

        return { data: productsWithUrls, message: 'Products retrieved successfully', statusCode: 200 };
    }

    static async getProductById(id, req) {
        if (!id) {
            return { message: 'Product ID is required', statusCode: 400 };
        }

        const product = await ProductModel.getProductById(id);
        if (!product) {
            return { message: 'Product not found', statusCode: 404 };
        }

        product.image_url = product.image ? getFileUrl(req, product.image) : null;

        return { data: product, message: 'Product retrieved successfully', statusCode: 200 };
    }

    static async createProduct(productData, req) {
        const { name, description, image, categoryId, category_id, stock } = productData;
        const finalCategoryId = categoryId || category_id;

        switch (true) {
            case !name:
                return { message: 'Name is required', statusCode: 400 };
            case !finalCategoryId:
                return { message: 'Category ID is required', statusCode: 400 };
        }

        const category = await CategoryModel.getCategoryById(finalCategoryId);
        if (!category) {
            return { message: 'Category not found', statusCode: 404 };
        }

        if (stock && (isNaN(stock) || stock < 0)) {
            return { message: 'Stock must be a non-negative number', statusCode: 400 };
        }

        const productId = await ProductModel.createProduct({
            ...productData,
            categoryId: finalCategoryId
        });
        const newProduct = await ProductModel.getProductById(productId);

        newProduct.image_url = newProduct.image ? getFileUrl(req, newProduct.image) : null;

        return {
            data: newProduct,
            message: 'Product created successfully',
            statusCode: 201
        };
    }

    static async updateProduct(id, productData, req) {
        if (!id) {
            return { message: 'Product ID is required', statusCode: 400 };
        }

        const existingProduct = await ProductModel.getProductById(id);
        if (!existingProduct) {
            return { message: 'Product not found', statusCode: 404 };
        }

        const { name, description, image, categoryId, category_id, stock } = productData;
        const finalCategoryId = categoryId || category_id;

        if (finalCategoryId) {
            const category = await CategoryModel.getCategoryById(finalCategoryId);
            if (!category) {
                return { message: 'Category not found', statusCode: 404 };
            }
        }

        if (stock !== undefined && (isNaN(stock) || stock < 0)) {
            return { message: 'Stock must be a non-negative number', statusCode: 400 };
        }

        if (image && existingProduct.image && existingProduct.image !== image) {
            deleteFile(existingProduct.image);
        }

        const updated = await ProductModel.updateProduct(id, {
            ...productData,
            categoryId: finalCategoryId
        });
        if (!updated) {
            return { message: 'Failed to update product', statusCode: 500 };
        }

        const updatedProduct = await ProductModel.getProductById(id);

        updatedProduct.image_url = updatedProduct.image ? getFileUrl(req, updatedProduct.image) : null;

        return {
            data: updatedProduct,
            message: 'Product updated successfully',
            statusCode: 200
        };
    }

    static async deleteProduct(id) {
        if (!id) {
            return { message: 'Product ID is required', statusCode: 400 };
        }

        const existingProduct = await ProductModel.getProductById(id);
        if (!existingProduct) {
            return { message: 'Product not found', statusCode: 404 };
        }

        if (existingProduct.image) {
            deleteFile(existingProduct.image);
        }

        const deleted = await ProductModel.deleteProduct(id);
        if (!deleted) {
            return { message: 'Failed to delete product', statusCode: 500 };
        }

        return { message: 'Product deleted successfully', statusCode: 200 };
    }

    static async getProductsByCategory(categoryId, req) {
        if (!categoryId) {
            return { message: 'Category ID is required', statusCode: 400 };
        }

        const category = await CategoryModel.getCategoryById(categoryId);
        if (!category) {
            return { message: 'Category not found', statusCode: 404 };
        }

        const products = await ProductModel.getProductsByCategory(categoryId);

        const productsWithUrls = products.map(product => ({
            ...product,
            image_url: product.image ? getFileUrl(req, product.image) : null
        }));

        return {
            data: productsWithUrls,
            message: 'Products retrieved successfully',
            statusCode: 200
        };
    }
}

export default ProductService;