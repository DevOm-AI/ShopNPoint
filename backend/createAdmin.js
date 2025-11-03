// createAdmin.js
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise'); // Using mysql2 for promise-based queries
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// --- CONFIGURE YOUR ADMIN CREDENTIALS HERE ---
// You can change these values if you want a different default admin.
const adminUsername = 'admin';
const adminPassword = 'admin123'; // <--- CHOOSE A STRONG PASSWORD HERE
// ---------------------------------------------

// Function to create or ensure the existence of the default admin user
const createAdminUser = async () => {
    let connection;
    try {
        // Establish database connection using your .env variables
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('Connected to the database.');

        // Check if the admin user already exists
        const [rows] = await connection.execute('SELECT * FROM admin WHERE username = ?', [adminUsername]);

        if (rows.length > 0) {
            console.log(`Admin user '${adminUsername}' already exists. No action taken.`);
            return; // Exit if user exists
        }

        // Hash the password if the user does not exist
        console.log(`Hashing password for new admin user '${adminUsername}'...`);
        const salt = await bcrypt.genSalt(10); // Generate salt with 10 rounds
        const password_hash = await bcrypt.hash(adminPassword, salt); // Hash the password
        console.log('Password hashed successfully.');

        // Insert the new admin user into the database
        const insertQuery = 'INSERT INTO admin (username, password_hash) VALUES (?, ?)';
        await connection.execute(insertQuery, [adminUsername, password_hash]);

        console.log(`\n✅ Success! Admin user '${adminUsername}' has been created.`);
        console.log(`You can now log in with username: "${adminUsername}" and password: "${adminPassword}".`);

    } catch (error) {
        console.error('❌ An error occurred:', error.message);
        // Provide more detailed error if possible, e.g., for database connection
        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('  Please check your DB_USER and DB_PASSWORD in the .env file.');
        } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
            console.error('  Could not connect to the database. Is DB_HOST correct? Is your MySQL server running?');
        }
    } finally {
        if (connection) {
            await connection.end();
            console.log('Database connection closed.');
        }
    }
};

// Execute the function
createAdminUser();