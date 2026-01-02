import sequelize from './config/database.js';
import AdminUser from './models/AdminUser.js';
import bcrypt from 'bcryptjs';

async function fixAdminPassword() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    // Update admin password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await AdminUser.update(
      { password_hash: hashedPassword },
      { where: { email: 'admin@findpreschool.com' } }
    );

    console.log('✅ Admin password updated successfully');
    console.log('Email: admin@findpreschool.com');
    console.log('Password: admin123');

    // Verify the update
    const admin = await AdminUser.findOne({
      where: { email: 'admin@findpreschool.com' }
    });

    if (admin) {
      const isValid = await bcrypt.compare('admin123', admin.password_hash);
      console.log('Password verification:', isValid);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

fixAdminPassword();