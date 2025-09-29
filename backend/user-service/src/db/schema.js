import { mysqlTable, int, varchar, date, timestamp, mysqlEnum } from "drizzle-orm/mysql-core";

export const usersTable = mysqlTable("users", {
    id: int("id").primaryKey().autoincrement(),
    first_name: varchar("first_name", { length: 255 }).notNull(),
    last_name: varchar("last_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    birth_date: date("birth_date").notNull(),
    gender: mysqlEnum("gender", ["laki-laki", "perempuan"]).notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    created_at: timestamp("created_at").defaultNow(),
});