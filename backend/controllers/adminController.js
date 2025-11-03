
console.log('>>> adminController.js IS BEING LOADED <<<');

const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const { executeQuery } = require('../config/db');
const jwt = require('jsonwebtoken');

// Helper function to generate a JWT token
const generateAccessToken = (id, type) => {
    return jwt.sign({ id, type }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

// @desc    Authenticate admin & get token
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = asyncHandler(async (req, res) => {
    // --- START DEBUGGING ---
    console.log('\n--- New Admin Login Attempt ---');
    console.log('Timestamp:', new Date().toISOString());

    // 1. Log the incoming data from the frontend
    const { username, password } = req.body;
    console.log(`1. Received credentials - Username: "${username}", Password: "${password}"`);

    if (!username || !password) {
        console.log('Error: Username or password not provided.');
        res.status(400);
        throw new Error('Please provide username and password');
    }

    // 2. Log the database query
    const query = 'SELECT * FROM admin WHERE username = ?';
    console.log(`2. Executing SQL Query: ${query} with username: [${username}]`);
    const admins = await executeQuery(query, [username]);

    // 3. Log the result of the database query
    if (admins.length > 0) {
        const admin = admins[0];
        console.log('3. Found admin user in database:', admin);

        // 4. Log the values being compared
        console.log('4. Comparing provided password with stored hash...');
        console.log('   - Provided Password:', `"${password}"`);
        console.log('   - Stored Hash:', `"${admin.password_hash}"`);
        const passwordMatches = await bcrypt.compare(password, admin.password_hash);
        
        // 5. Log the result of the password comparison
        console.log('5. Password comparison result (passwordMatches):', passwordMatches);

        if (passwordMatches) {
            console.log('✅ Success: Passwords match. Generating token.');
            const token = generateAccessToken(admin.admin_id, 'admin');
            res.json({
                admin_id: admin.admin_id,
                username: admin.username,
                token: token,
            });
        } else {
            console.log('❌ Failure: Passwords DO NOT match.');
            res.status(401);
            throw new Error('Invalid username or password');
        }
    } else {
        console.log('❌ Failure: No admin user found with that username.');
        res.status(401);
        throw new Error('Invalid username or password');
    }
    // --- END DEBUGGING ---
});


// @desc    Get all users for admin panel
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
    if (!req.admin) {
        res.status(403);
        throw new Error('Not authorized to access user data.');
    }
    const users = await executeQuery('SELECT user_id, username, mobile_number, address, promo_code, total_tokens, gender, age, city, pincode, state FROM users');
    res.json(users);
});

// @desc    Get all orders for admin panel
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
    if (!req.admin) {
        res.status(403);
        throw new Error('Not authorized to access order data.');
    }
    const query = `
        SELECT 
            o.order_id,
            o.user_id,
            u.username,
            o.product_id,
            o.date_of_order,
            o.date_of_delivery,
            o.total_amount,
            o.tokens_used
        FROM orders AS o
        JOIN users AS u ON o.user_id = u.user_id
        ORDER BY o.date_of_order DESC
    `;
    const orders = await executeQuery(query);
    res.json(orders);
});

module.exports = { 
  loginAdmin,
  getAllUsers,
  getAllOrders
};