import { execSync } from 'child_process';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DatabaseSetup {
    static async runAll() {
        try {
            console.log('🚀 Starting Data Service database setup...');
            console.log('='.repeat(60));

            // Step 1: Try generating migrations
            console.log('📝 Step 1: Checking and generating migration files...');
            try {
                // First try to install drizzle-kit if missing
                console.log('🔧 Ensuring drizzle-kit is properly installed...');
                execSync('npm install drizzle-kit', { stdio: 'inherit' });

                console.log('📝 Generating migrations...');
                execSync('npx drizzle-kit generate', { stdio: 'inherit' });
                console.log('✅ Migration files generated successfully!\n');
            } catch (generateError) {
                console.log('⚠️ Migration generation failed, checking existing migrations...');
                const migrationsDir = path.join(__dirname, 'migrations');
                if (fs.existsSync(migrationsDir) && fs.readdirSync(migrationsDir).length > 0) {
                    console.log('✅ Found existing migration files, continuing...\n');
                } else {
                    console.log('❌ No migration files found and generation failed');
                    throw generateError;
                }
            }

            // Step 2: Run migrations
            console.log('⚡ Step 2: Running migrations...');
            try {
                execSync('npm run drizzle:migrate', { stdio: 'inherit' });
                console.log('✅ Migrations completed successfully!\n');
            } catch (migrateError) {
                console.log('⚠️ Standard migration failed, trying manual migration...');
                await this.runManualMigration();
                console.log('✅ Manual migration completed!\n');
            }

            // Step 3: Run seeders
            console.log('🌱 Step 3: Running seeders...');
            try {
                execSync('npm run drizzle:seed', { stdio: 'inherit' });
                console.log('✅ Seeders completed successfully!\n');
            } catch (seedError) {
                console.log('⚠️ Seeder failed, trying manual seeding...');
                await this.runManualSeeding();
                console.log('✅ Manual seeding completed!\n');
            }

            console.log('='.repeat(60));
            console.log('🎉 Data Service database setup finished successfully!');

        } catch (error) {
            console.error('❌ Data Service database setup failed:', error.message);
            console.log('\n🔧 Troubleshooting tips:');
            console.log('1. Make sure MySQL is running and accessible');
            console.log('2. Check your .env file configuration');
            console.log('3. Ensure all npm dependencies are installed');
            console.log('4. Try running: npm install && npm run drizzle:setup');
            process.exit(1);
        }
    }

    static async runManualMigration() {
        try {
            console.log('🔧 Running manual migration for Data Service...');

            // Import database connection
            const connection = mysql.createConnection({
                host: process.env.DB_HOST || 'localhost',
                port: process.env.DB_PORT || 3306,
                user: process.env.DB_USER || 'deeptech_user',
                password: process.env.DB_PASSWORD || 'deeptech_password',
                database: process.env.DB_NAME || 'deeptech-db'
            });

            // Read and execute migration files
            const migrationsDir = path.join(__dirname, 'migrations');
            if (fs.existsSync(migrationsDir)) {
                const migrationFiles = fs.readdirSync(migrationsDir)
                    .filter(file => file.endsWith('.sql'))
                    .sort();

                for (const file of migrationFiles) {
                    console.log(`📝 Executing migration: ${file}`);
                    const migrationPath = path.join(migrationsDir, file);
                    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

                    // Split by semicolon and execute each statement
                    const statements = migrationSQL.split(';').filter(stmt => stmt.trim());
                    for (const statement of statements) {
                        if (statement.trim()) {
                            await connection.execute(statement);
                        }
                    }
                }
            }

            await connection.end();

        } catch (error) {
            console.error('❌ Manual migration failed:', error.message);
            throw error;
        }
    }

    static async runManualSeeding() {
        try {
            console.log('🌱 Running manual seeding for Data Service...');

            const connection = mysql.createConnection({
                host: process.env.DB_HOST || 'localhost',
                port: process.env.DB_PORT || 3306,
                user: process.env.DB_USER || 'deeptech_user',
                password: process.env.DB_PASSWORD || 'deeptech_password',
                database: process.env.DB_NAME || 'deeptech-db'
            });

            // Create sample categories if they don't exist
            const [existingCategories] = await connection.execute('SELECT id FROM categories LIMIT 1');

            if (existingCategories.length === 0) {
                console.log('📝 Creating sample categories...');

                const categories = [
                    ['Electronics', 'Electronic devices and accessories'],
                    ['Books', 'Books and educational materials'],
                    ['Clothing', 'Apparel and fashion items'],
                    ['Food', 'Food and beverages'],
                    ['Tools', 'Hardware and tools']
                ];

                for (const [name, description] of categories) {
                    await connection.execute(
                        `INSERT INTO categories (name, description, created_at, updated_at) 
                         VALUES (?, ?, NOW(), NOW())`,
                        [name, description]
                    );
                }

                console.log('✅ Sample categories created');
            } else {
                console.log('✅ Categories already exist');
            }

            // Create sample products
            const [existingProducts] = await connection.execute('SELECT id FROM products LIMIT 1');

            if (existingProducts.length === 0) {
                console.log('📝 Creating sample products...');

                // Get category IDs
                const [categories] = await connection.execute('SELECT id, name FROM categories');

                if (categories.length > 0) {
                    const products = [
                        ['Laptop', 'High performance laptop', categories[0].id, 100],
                        ['Programming Book', 'Learn programming fundamentals', categories[1].id, 50],
                        ['T-Shirt', 'Comfortable cotton t-shirt', categories[2].id, 200],
                        ['Coffee', 'Premium coffee beans', categories[3].id, 75],
                        ['Screwdriver Set', 'Professional screwdriver set', categories[4].id, 25]
                    ];

                    for (const [name, description, categoryId, stock] of products) {
                        await connection.execute(
                            `INSERT INTO products (name, description, category_id, stock, created_at, updated_at) 
                             VALUES (?, ?, ?, ?, NOW(), NOW())`,
                            [name, description, categoryId, stock]
                        );
                    }

                    console.log('✅ Sample products created');
                }
            } else {
                console.log('✅ Products already exist');
            }

            await connection.end();

        } catch (error) {
            console.error('❌ Manual seeding failed:', error.message);
            throw error;
        }
    }
}

DatabaseSetup.runAll();