import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import ENV from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class MigrationRunner {
    static async run() {
        let connection;
        try {
            console.log('🚀 Starting migration...');
            console.log('='.repeat(50));

            connection = await mysql.createConnection({
                host: ENV.DB_HOST,
                port: ENV.DB_PORT,
                user: ENV.DB_USER,
                password: ENV.DB_PASSWORD,
                database: ENV.DB_NAME,
                multipleStatements: true
            });

            await connection.execute(`
                CREATE TABLE IF NOT EXISTS migrations (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    migration VARCHAR(255) NOT NULL UNIQUE,
                    batch INT NOT NULL DEFAULT 1,
                    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);

            const [batchResult] = await connection.execute(
                'SELECT COALESCE(MAX(batch), 0) + 1 as next_batch FROM migrations'
            );
            const nextBatch = batchResult[0].next_batch;

            const [executedMigrations] = await connection.execute(
                'SELECT migration FROM migrations'
            );
            const executedSet = new Set(
                executedMigrations.map(row => row.migration)
            );

            const migrationsDir = path.join(__dirname, 'migrations');
            const migrationFiles = fs.readdirSync(migrationsDir)
                .filter(file => file.endsWith('.sql'))
                .sort();

            console.log(`📝 Found ${migrationFiles.length} migration files`);
            console.log(`✅ Already executed: ${executedSet.size} migrations`);

            let newMigrations = 0;

            for (const file of migrationFiles) {
                if (executedSet.has(file)) {
                    console.log(`⏭️  Skipping (already executed): ${file}`);
                    continue;
                }

                console.log(`⚡ Executing migration: ${file}`);
                const migrationSQL = fs.readFileSync(
                    path.join(migrationsDir, file),
                    'utf8'
                );

                if (migrationSQL.trim()) {
                    const statements = migrationSQL
                        .split('--> statement-breakpoint')
                        .map(statement => statement.trim())
                        .filter(statement => statement.length > 0);

                    for (const statement of statements) {
                        if (statement.trim()) {
                            await connection.execute(statement);
                        }
                    }

                    await connection.execute(
                        'INSERT INTO migrations (migration, batch) VALUES (?, ?)',
                        [file, nextBatch]
                    );

                    console.log(`✅ Migration ${file} executed successfully`);
                    newMigrations++;
                }
            }

            console.log('='.repeat(50));
            if (newMigrations === 0) {
                console.log('ℹ️  No new migrations to run');
            } else {
                console.log(`✅ ${newMigrations} migration(s) completed successfully!`);
            }

        } catch (error) {
            console.error('❌ migration failed:', error.message);
            throw error;
        } finally {
            if (connection) {
                await connection.end();
            }
            process.exit(0);
        }
    }
}

const command = process.argv[2];
if (command === 'run' || !command) {
    MigrationRunner.run().catch(console.error);
}

export default MigrationRunner;