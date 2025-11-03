const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { executeQuery } = require('../config/db');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // --- THIS IS THE FIX ---
      // We are hardcoding the same secret key here to match the one in generateToken.js
      // This bypasses the .env file issue for verification.
      const hardcodedSecret = 'ThisIsMyHardcodedSecretKeyPleaseWork12345';
      
      const decoded = jwt.verify(token, hardcodedSecret); 

      const query = `
                SELECT 
                    user_id, username, mobile_number, address, promo_code, 
                    total_tokens,  -- <--- THIS MUST BE PRESENT
                    gender, age, city, pincode, state 
                FROM users 
                WHERE user_id = ?
            `;
      const users = await executeQuery(query, [decoded.id]);
      
      if (users.length > 0) {
        req.user = users[0]; 
        next();
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// NEW: Protect middleware for Admin users
const protectAdmin = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Check if the token was generated for an admin
            if (decoded.type !== 'admin') {
                res.status(403); // Forbidden
                throw new new Error('Not authorized as an admin.');
            }

            // Fetch admin from the database and attach to request
            const admins = await executeQuery('SELECT admin_id, username FROM admin WHERE admin_id = ?', [decoded.id]);

            if (admins.length === 0) {
                res.status(401);
                throw new Error('Not authorized, admin not found');
            }
            req.admin = admins[0]; // Attach admin data to request
            next();
        } catch (error) {
            console.error('Admin Auth Error:', error);
            res.status(401);
            throw new Error('Not authorized, admin token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

module.exports = { protect, protectAdmin };