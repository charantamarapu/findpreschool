
import bcrypt from 'bcryptjs';
import { AdminUser } from './models/index.js';
import sequelize from './config/database.js';

const resetAdmin = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        const email = 'admin@abc.com';
        const newPassword = 'admin123';
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const [updated] = await AdminUser.update(
            { password_hash: hashedPassword },
            { where: { email } }
        );

        if (updated) {
            console.log('✅ Admin password updated successfully.');
            console.log(`Email: ${email}`);
            console.log(`Password: ${newPassword}`);
        } else {
            console.log('⚠️ Admin user not found. Creating one...');
            await AdminUser.create({
                email,
                password_hash: hashedPassword,
                name: 'System Admin',
                role: 'admin',
                active: true
            });
            console.log('✅ Admin user created.');
            console.log(`Email: ${email}`);
            console.log(`Password: ${newPassword}`);
        }

    } catch (error) {
        console.error('Error resetting password:', error);
    } finally {
        await sequelize.close();
    }
};

resetAdmin();
