// backend/scripts/resetAdminPassword.js
require('dotenv').config({ path: '../.env' }); // Load .env from parent directory
const bcrypt = require('bcryptjs');
const { executeQuery } = require('../config/db'); // Assuming db.js is in config

const resetAdminPassword = async () => {
    const adminUsername = 'superadmin'; // The admin user you want to reset
    const newPassword = 'Admin@123';     // The password you WANT it to be

    try {
        console.log(`Attempting to reset password for admin: ${adminUsername}`);

        // 1. Hash the new password
        const salt = await bcrypt.genSalt(10);
        const newPasswordHash = await bcrypt.hash(newPassword, salt);

        // 2. Update the admin user in the database
        const updateQuery = 'UPDATE admin SET password_hash = ? WHERE username = ?';
        const result = await executeQuery(updateQuery, [newPasswordHash, adminUsername]);

        if (result.affectedRows > 0) {
            console.log(`✅ Password for ${adminUsername} successfully reset to: ${newPassword}`);
        } else {
            console.log(`⚠️ Admin user "${adminUsername}" not found. No password was reset.`);
        }
    } catch (error) {
        console.error('❌ Error resetting admin password:', error);
    } finally {
        // Ensure the database connection closes if necessary
        // (If your executeQuery doesn't handle connection closure, you might need to add it here)
        process.exit();
    }
};

resetAdminPassword();