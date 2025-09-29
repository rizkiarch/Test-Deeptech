import { mysqlTable, int, varchar, text, timestamp, mysqlEnum, decimal } from "drizzle-orm/mysql-core";

export const categoriesTable = mysqlTable("categories", {
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const productsTable = mysqlTable("products", {
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    image: varchar("image", { length: 500 }),
    categoryId: int("category_id").notNull(),
    stock: int("stock").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const transactionBatchesTable = mysqlTable("transaction_batches", {
    id: int("id").primaryKey().autoincrement(),
    type: mysqlEnum("type", ["stock_in", "stock_out"]).notNull(),
    notes: text("notes"),
    totalItems: int("total_items").default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const transactionsTable = mysqlTable("transactions", {
    id: int("id").primaryKey().autoincrement(),
    batchId: int("batch_id").notNull(),
    productId: int("product_id").notNull(),
    quantity: int("quantity").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});