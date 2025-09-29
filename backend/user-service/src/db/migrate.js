import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import ENV from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class MigrationRunner {
    static async run() {
        try {
            console.log('🚀 Starting migration...');
            console.log('='.repeat(50));

            const connection = await mysql.createConnection({
                host: ENV.DB_HOST,
                port: ENV.DB_PORT,
                user: ENV.DB_USER,
                password: ENV.DB_PASSWORD,
                database: ENV.DB_NAME,
                multipleStatements: true
            });

            const migrationsDir = path.join(__dirname, 'migrations');
            const migrationFiles = fs.readdirSync(migrationsDir)
                .filter(file => file.endsWith('.sql'))
                .sort();

            console.log(`📝 Found ${migrationFiles.length} migration files`);

            for (const file of migrationFiles) {
                console.log(`⚡ Executing migration: ${file}`);
                const migrationSQL = fs.readFileSync(path.join(migrationsDir, file), 'utf8');

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
                    console.log(`✅ Migration ${file} executed successfully`);
                }
            }

            await connection.end();

            console.log('='.repeat(50));
            console.log('✅ migration completed successfully!');

        } catch (error) {
            console.error('❌ migration failed:', error.message);
            throw error;
        } finally {
            process.exit(0);
        }
    }
}

const command = process.argv[2];
if (command === 'run' || !command) {
    MigrationRunner.run().catch(console.error);
}

export default MigrationRunner;