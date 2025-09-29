import { migrate } from 'drizzle-orm/mysql2/migrator';
import db from './connection.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class MigrationRunner {
    static async run() {
        try {
            console.log('🚀 Starting Drizzle migration...');
            console.log('='.repeat(50));

            // Run migrations from drizzle folder
            await migrate(db, { migrationsFolder: path.join(__dirname, '../drizzle') });

            console.log('='.repeat(50));
            console.log('✅ Drizzle migration completed successfully!');

        } catch (error) {
            console.error('❌ Drizzle migration failed:', error.message);
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