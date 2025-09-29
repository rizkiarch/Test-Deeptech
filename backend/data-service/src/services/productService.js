import ProductModel from '../models/productModel.js';
import CategoryModel from '../models/categoryModel.js';
import fs from 'fs';
import path from 'path';

class ProductService {
    static async getAllProducts(queryParams) {
        try {
            const {
                page = 1,
                limit = 10,
                sortBy = 'id',
                sortOrder = 'desc',
                search = '',
                categoryId = null
            } = queryParams;

            const validatedPage = Math.max(1, parseInt(page));
            const validatedLimit = Math.min(100, Math.max(1, parseInt(limit)));

            const validSortFields = ['id', 'name', 'stock', 'price', 'createdAt', 'updatedAt'];
            const validatedSortBy = validSortFields.includes(sortBy) ? sortBy : 'id';
            const validatedSortOrder = ['asc', 'desc'].includes(sortOrder) ? sortOrder : 'desc';

            if (categoryId) {
                const categoryExists = await CategoryModel.exists(parseInt(categoryId));
                if (!categoryExists) {
                    throw new Error('Category not found');
                }
            }

            const params = {
                page: validatedPage,
                limit: validatedLimit,
                sortBy: validatedSortBy,
                sortOrder: validatedSortOrder,
                search: search.trim(),
                categoryId: categoryId ? parseInt(categoryId) : null
            };

            return await ProductModel.findAll(params);
        } catch (error) {
            throw new Error(`Service error: ${error.message}`);
        }
    }

    static async getProductById(id) {
        try {
            const productId = parseInt(id);
            if (!productId || productId <= 0) {
                throw new Error('Invalid product ID');
            }

            const product = await ProductModel.findById(productId);
            if (!product) {
                throw new Error('Product not found');
            }

            return product;
        } catch (error) {
            throw new Error(`Service error: ${error.message}`);
        }
    }

    static async createProduct(productData, imageFile = null) {
        try {
            const { name, categoryId } = productData;

            if (!name || !name.trim()) {
                throw new Error('Product name is required');
            }

            if (!categoryId) {
                throw new Error('Category ID is required');
            }

            const categoryExists = await CategoryModel.exists(parseInt(categoryId));
            if (!categoryExists) {
                throw new Error('Category not found');
            }

            const newProductData = {
                name: name.trim(),
                description: productData.description?.trim() || null,
                categoryId: parseInt(categoryId),
                stock: parseInt(productData.stock) || 0,
                price: parseFloat(productData.price) || 0.00,
                image: imageFile ? imageFile.filename : null
            };

            if (newProductData.price < 0) {
                throw new Error('Price must be non-negative');
            }

            if (newProductData.stock < 0) {
                throw new Error('Stock must be non-negative');
            }

            return await ProductModel.create(newProductData);
        } catch (error) {
            if (imageFile && imageFile.path) {
                try {
                    fs.unlinkSync(imageFile.path);
                } catch (unlinkError) {
                    console.error('Error removing uploaded file:', unlinkError.message);
                }
            }
            throw new Error(`Service error: ${error.message}`);
        }
    }

    static async updateProduct(id, productData, imageFile = null) {
        try {
            const productId = parseInt(id);
            if (!productId || productId <= 0) {
                throw new Error('Invalid product ID');
            }

            const existingProduct = await ProductModel.findById(productId);
            if (!existingProduct) {
                throw new Error('Product not found');
            }

            const updateData = {};

            if (productData.name !== undefined) {
                const trimmedName = productData.name.trim();
                if (!trimmedName) {
                    throw new Error('Product name cannot be empty');
                }
                updateData.name = trimmedName;
            }

            if (productData.description !== undefined) {
                updateData.description = productData.description?.trim() || null;
            }

            if (productData.categoryId !== undefined) {
                const categoryId = parseInt(productData.categoryId);
                const categoryExists = await CategoryModel.exists(categoryId);
                if (!categoryExists) {
                    throw new Error('Category not found');
                }
                updateData.categoryId = categoryId;
            }

            if (productData.stock !== undefined) {
                const stock = parseInt(productData.stock);
                if (stock < 0) {
                    throw new Error('Stock must be non-negative');
                }
                updateData.stock = stock;
            }

            if (productData.price !== undefined) {
                const price = parseFloat(productData.price);
                if (price < 0) {
                    throw new Error('Price must be non-negative');
                }
                updateData.price = price;
            }

            if (imageFile) {
                if (existingProduct.image) {
                    const oldImagePath = path.join(process.cwd(), 'uploads', existingProduct.image);
                    try {
                        if (fs.existsSync(oldImagePath)) {
                            fs.unlinkSync(oldImagePath);
                        }
                    } catch (error) {
                        console.error('Error removing old image:', error.message);
                    }
                }
                updateData.image = imageFile.filename;
            }

            if (Object.keys(updateData).length === 0) {
                throw new Error('No valid fields provided for update');
            }

            return await ProductModel.update(productId, updateData);
        } catch (error) {
            if (imageFile && imageFile.path) {
                try {
                    fs.unlinkSync(imageFile.path);
                } catch (unlinkError) {
                    console.error('Error removing uploaded file:', unlinkError.message);
                }
            }
            throw new Error(`Service error: ${error.message}`);
        }
    }

    static async deleteProduct(id) {
        try {
            const productId = parseInt(id);
            if (!productId || productId <= 0) {
                throw new Error('Invalid product ID');
            }

            const product = await ProductModel.findById(productId);
            if (!product) {
                throw new Error('Product not found');
            }

            if (product.image) {
                const imagePath = path.join(process.cwd(), 'uploads', product.image);
                try {
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                    }
                } catch (error) {
                    console.error('Error removing product image:', error.message);
                }
            }

            return await ProductModel.delete(productId);
        } catch (error) {
            throw new Error(`Service error: ${error.message}`);
        }
    }

    static async getProductsByCategory(categoryId, queryParams = {}) {
        try {
            const validatedCategoryId = parseInt(categoryId);
            if (!validatedCategoryId || validatedCategoryId <= 0) {
                throw new Error('Invalid category ID');
            }

            const categoryExists = await CategoryModel.exists(validatedCategoryId);
            if (!categoryExists) {
                throw new Error('Category not found');
            }

            return await ProductModel.findByCategory(validatedCategoryId, queryParams);
        } catch (error) {
            throw new Error(`Service error: ${error.message}`);
        }
    }

    static async updateProductStock(id, quantity, type = 'set') {
        try {
            const productId = parseInt(id);
            const stockQuantity = parseInt(quantity);

            if (!productId || productId <= 0) {
                throw new Error('Invalid product ID');
            }

            if (isNaN(stockQuantity) || stockQuantity < 0) {
                throw new Error('Invalid quantity');
            }

            if (!['set', 'add', 'subtract'].includes(type)) {
                throw new Error('Invalid stock update type');
            }

            return await ProductModel.updateStock(productId, stockQuantity, type);
        } catch (error) {
            throw new Error(`Service error: ${error.message}`);
        }
    }
}

export default ProductService;