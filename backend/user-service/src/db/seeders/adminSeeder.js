import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import db from '../connection.js';
import { usersTable } from '../schema.js';

class AdminSeeder {
    static async run() {
        try {
            console.log('🌱 Starting admin seeder...');

            const existingUser = await db
                .select()
                .from(usersTable)
                .where(eq(usersTable.email, 'admin@example.com'))
                .limit(1);

            if (existingUser.length > 0) {
                console.log('⚠️  Admin user already exists. Skipping seeder.');
                return;
            }

            const hashedPassword = await bcrypt.hash('admin123', 10);

            const [result] = await db.insert(usersTable).values({
                first_name: 'Admin',
                last_name: 'User',
                email: 'admin@example.com',
                birth_date: '1990-01-01',
                gender: 'laki-laki',
                password: hashedPassword,
            });

            const [adminUser] = await db
                .select()
                .from(usersTable)
                .where(eq(usersTable.id, result.insertId));

            console.log('✅ Admin user created successfully:');
            console.log(`📧 Email: ${adminUser.email}`);
            console.log(`👤 Name: ${adminUser.first_name} ${adminUser.last_name}`);

        } catch (error) {
            console.error('❌ Error creating admin user:', error.message);
            throw error;
        }
    }

    static async rollback() {
        try {
            console.log('🔄 Rolling back Drizzle admin seeder...');

            const result = await db
                .delete(usersTable)
                .where(eq(usersTable.email, 'admin@example.com'));

            if (result.affectedRows > 0) {
                console.log('✅ Admin user deleted successfully');
            } else {
                console.log('⚠️  No admin user found to delete');
            }

        } catch (error) {
            console.error('❌ Error rolling back admin user:', error.message);
            throw error;
        }
    }
}

export default AdminSeeder;