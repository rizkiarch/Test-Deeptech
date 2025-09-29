import { execSync } from 'child_process';

class DatabaseSetup {
    static async runAll() {
        try {
            console.log('🚀 Starting complete database setup...');
            console.log('='.repeat(60));

            console.log('📝 Step 1: Generating migration files...');
            execSync('npm run drizzle:generate', { stdio: 'inherit' });
            console.log('✅ Migration files generated successfully!\n');

            console.log('⚡ Step 2: Running migrations...');
            execSync('npm run drizzle:migrate', { stdio: 'inherit' });
            console.log('✅ Migrations completed successfully!\n');

            console.log('🌱 Step 3: Running seeders...');
            execSync('npm run drizzle:seed', { stdio: 'inherit' });
            console.log('✅ Seeders completed successfully!\n');

            console.log('='.repeat(60));
            console.log('🎉 Complete database setup finished successfully!');

        } catch (error) {
            console.error('❌ Database setup failed:', error.message);
            process.exit(1);
        }
    }
}

DatabaseSetup.runAll();