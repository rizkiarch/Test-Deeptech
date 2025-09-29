import AdminSeeder from "./adminSeeder.js";

class DatabaseSeeder {
    static async run() {
        try {
            console.log('🚀 Starting database seeding...');
            console.log('='.repeat(50));

            await AdminSeeder.run();

            console.log('='.repeat(50));
            console.log('✅ Database seeding completed successfully!');

        } catch (error) {
            console.error('❌ Database seeding failed:', error.message);
            process.exit(1);
        } finally {
            process.exit(0);
        }
    }

    static async rollback() {
        try {
            console.log('🔄 Starting database seeding rollback...');
            console.log('='.repeat(50));

            await AdminSeeder.rollback();

            console.log('='.repeat(50));
            console.log('✅ Database seeding rollback completed successfully!');

        } catch (error) {
            console.error('❌ Database seeding rollback failed:', error.message);
            process.exit(1);
        } finally {
            process.exit(0);
        }
    }
}

const command = process.argv[2];

switch (command) {
    case 'rollback':
        DatabaseSeeder.rollback();
        break;
    case 'run':
    default:
        DatabaseSeeder.run();
        break;
}

export default DatabaseSeeder;