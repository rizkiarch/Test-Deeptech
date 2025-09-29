import {
    mysqlTable,
    int,
    varchar,
    text,
    decimal,
    timestamp,
    mysqlEnum
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

export const categoriesTable = mysqlTable('categories', {
    id: int('id').primaryKey().autoincrement(),
    name: varchar('name', { length: 255 }).notNull().unique(),
    description: text('description'),
    createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
});

export const productsTable = mysqlTable('products', {
    id: int('id').primaryKey().autoincrement(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    image: varchar('image', { length: 500 }),
    categoryId: int('category_id').notNull().references(() => categoriesTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    stock: int('stock').notNull().default(0),
    price: decimal('price', { precision: 10, scale: 2 }).default('0.00'),
    createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
});

export const transactionsTable = mysqlTable('transactions', {
    id: int('id').primaryKey().autoincrement(),
    productId: int('product_id').notNull().references(() => productsTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    type: mysqlEnum('type', ['in', 'out']).notNull(),
    quantity: int('quantity').notNull(),
    notes: text('notes'),
    batchId: varchar('batch_id', { length: 100 }),
    createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
});