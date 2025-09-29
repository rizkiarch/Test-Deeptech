import db from '../db/connection.js';
import { productsTable, categoriesTable } from '../db/schema.js';
import { eq, desc, asc, and, like, sql } from 'drizzle-orm';

class ProductModel {
    static async findAll(params = {}) {
        try {
            const {
                page = 1,
                limit = 10,
                sortBy = 'id',
                sortOrder = 'desc',
                search = '',
                categoryId = null
            } = params;

            const offset = (page - 1) * limit;
            let query = db
                .select({
                    id: productsTable.id,
                    name: productsTable.name,
                    description: productsTable.description,
                    image: productsTable.image,
                    categoryId: productsTable.categoryId,
                    categoryName: categoriesTable.name,
                    stock: productsTable.stock,
                    price: productsTable.price,
                    createdAt: productsTable.createdAt,
                    updatedAt: productsTable.updatedAt
                })
                .from(productsTable)
                .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
                .limit(limit)
                .offset(offset);

            if (search) {
                query = query.where(
                    like(productsTable.name, `%${search}%`)
                );
            }
            if (categoryId) {
                query = query.where(
                    eq(productsTable.categoryId, categoryId)
                );
            }

            const orderColumn = productsTable[sortBy] || productsTable.id;
            query = query.orderBy(
                sortOrder === 'asc' ? asc(orderColumn) : desc(orderColumn)
            );

            const products = await query;

            let countQuery = db
                .select({ count: sql`count(*)` })
                .from(productsTable);

            if (search) {
                countQuery = countQuery.where(
                    like(productsTable.name, `%${search}%`)
                );
            }

            if (categoryId) {
                countQuery = countQuery.where(
                    eq(productsTable.categoryId, categoryId)
                );
            }

            const [{ count }] = await countQuery;
            const totalPages = Math.ceil(count / limit);

            return {
                products,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems: count,
                    itemsPerPage: limit,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            };
        } catch (error) {
            throw new Error(`Error fetching products: ${error.message}`);
        }
    }

    static async findById(id) {
        try {
            const [product] = await db
                .select({
                    id: productsTable.id,
                    name: productsTable.name,
                    description: productsTable.description,
                    image: productsTable.image,
                    categoryId: productsTable.categoryId,
                    categoryName: categoriesTable.name,
                    stock: productsTable.stock,
                    price: productsTable.price,
                    createdAt: productsTable.createdAt,
                    updatedAt: productsTable.updatedAt
                })
                .from(productsTable)
                .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
                .where(eq(productsTable.id, id))
                .limit(1);

            return product || null;
        } catch (error) {
            throw new Error(`Error fetching product: ${error.message}`);
        }
    }

    static async create(productData) {
        try {
            const [result] = await db
                .insert(productsTable)
                .values({
                    name: productData.name,
                    description: productData.description,
                    image: productData.image || null,
                    categoryId: productData.categoryId,
                    stock: productData.stock || 0,
                    price: productData.price || '0.00'
                });

            return await this.findById(result.insertId);
        } catch (error) {
            throw new Error(`Error creating product: ${error.message}`);
        }
    }

    static async update(id, productData) {
        try {
            const updateData = {};

            if (productData.name !== undefined) updateData.name = productData.name;
            if (productData.description !== undefined) updateData.description = productData.description;
            if (productData.image !== undefined) updateData.image = productData.image;
            if (productData.categoryId !== undefined) updateData.categoryId = productData.categoryId;
            if (productData.stock !== undefined) updateData.stock = productData.stock;
            if (productData.price !== undefined) updateData.price = productData.price;

            if (Object.keys(updateData).length === 0) {
                throw new Error('No valid fields provided for update');
            }

            await db
                .update(productsTable)
                .set(updateData)
                .where(eq(productsTable.id, id));

            return await this.findById(id);
        } catch (error) {
            throw new Error(`Error updating product: ${error.message}`);
        }
    }

    static async delete(id) {
        try {
            const product = await this.findById(id);
            if (!product) {
                return null;
            }

            await db
                .delete(productsTable)
                .where(eq(productsTable.id, id));

            return product;
        } catch (error) {
            throw new Error(`Error deleting product: ${error.message}`);
        }
    }

    static async findByCategory(categoryId, params = {}) {
        try {
            return await this.findAll({ ...params, categoryId });
        } catch (error) {
            throw new Error(`Error fetching products by category: ${error.message}`);
        }
    }

    static async updateStock(id, quantity, type = 'set') {
        try {
            const product = await this.findById(id);
            if (!product) {
                throw new Error('Product not found');
            }

            let newStock;
            switch (type) {
                case 'add':
                    newStock = product.stock + quantity;
                    break;
                case 'subtract':
                    newStock = product.stock - quantity;
                    if (newStock < 0) {
                        throw new Error('Insufficient stock');
                    }
                    break;
                case 'set':
                default:
                    newStock = quantity;
                    break;
            }

            await db
                .update(productsTable)
                .set({ stock: newStock })
                .where(eq(productsTable.id, id));

            return await this.findById(id);
        } catch (error) {
            throw new Error(`Error updating stock: ${error.message}`);
        }
    }

    static async exists(id) {
        try {
            const [result] = await db
                .select({ id: productsTable.id })
                .from(productsTable)
                .where(eq(productsTable.id, id))
                .limit(1);

            return !!result;
        } catch (error) {
            throw new Error(`Error checking product existence: ${error.message}`);
        }
    }
}

export default ProductModel;