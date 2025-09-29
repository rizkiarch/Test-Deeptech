import ProductService from '../services/productService.js';
import response from '../utils/response.js';

class ProductController {
    static async getAllProducts(req, res) {
        try {
            const result = await ProductService.getAllProducts(req.query);

            return response.success(res, {
                products: result.products,
                pagination: result.pagination
            }, 'Products retrieved successfully');
        } catch (error) {
            console.error('Get all products error:', error.message);
            return response.error(res, error.message, 500);
        }
    }

    static async getProductById(req, res) {
        try {
            const { id } = req.params;
            const product = await ProductService.getProductById(id);

            return response.success(res, product, 'Product retrieved successfully');
        } catch (error) {
            console.error('Get product by ID error:', error.message);
            const statusCode = error.message.includes('not found') ? 404 :
                error.message.includes('Invalid') ? 400 : 500;
            return response.error(res, error.message, statusCode);
        }
    }

    static async createProduct(req, res) {
        try {
            const productData = req.body;
            const imageFile = req.file;

            const product = await ProductService.createProduct(productData, imageFile);

            return response.success(res, product, 'Product created successfully', 201);
        } catch (error) {
            console.error('Create product error:', error.message);
            const statusCode = error.message.includes('not found') ? 404 :
                error.message.includes('required') ||
                    error.message.includes('Invalid') ||
                    error.message.includes('must be') ? 400 : 500;
            return response.error(res, error.message, statusCode);
        }
    }

    static async updateProduct(req, res) {
        try {
            const { id } = req.params;
            const productData = req.body;
            const imageFile = req.file;

            const product = await ProductService.updateProduct(id, productData, imageFile);

            return response.success(res, product, 'Product updated successfully');
        } catch (error) {
            console.error('Update product error:', error.message);
            const statusCode = error.message.includes('not found') ? 404 :
                error.message.includes('Invalid') ||
                    error.message.includes('cannot be empty') ||
                    error.message.includes('must be') ? 400 : 500;
            return response.error(res, error.message, statusCode);
        }
    }

    static async deleteProduct(req, res) {
        try {
            const { id } = req.params;
            const product = await ProductService.deleteProduct(id);

            return response.success(res, product, 'Product deleted successfully');
        } catch (error) {
            console.error('Delete product error:', error.message);
            const statusCode = error.message.includes('not found') ? 404 :
                error.message.includes('Invalid') ? 400 : 500;
            return response.error(res, error.message, statusCode);
        }
    }

    static async getProductsByCategory(req, res) {
        try {
            const { categoryId } = req.params;
            const result = await ProductService.getProductsByCategory(categoryId, req.query);

            return response.success(res, {
                products: result.products,
                pagination: result.pagination
            }, 'Products by category retrieved successfully');
        } catch (error) {
            console.error('Get products by category error:', error.message);
            const statusCode = error.message.includes('not found') ? 404 :
                error.message.includes('Invalid') ? 400 : 500;
            return response.error(res, error.message, statusCode);
        }
    }

    static async updateProductStock(req, res) {
        try {
            const { id } = req.params;
            const { quantity, type = 'set' } = req.body;

            const product = await ProductService.updateProductStock(id, quantity, type);

            return response.success(res, product, 'Product stock updated successfully');
        } catch (error) {
            console.error('Update product stock error:', error.message);
            const statusCode = error.message.includes('not found') ? 404 :
                error.message.includes('Invalid') ||
                    error.message.includes('Insufficient') ? 400 : 500;
            return response.error(res, error.message, statusCode);
        }
    }
}

export default ProductController;