// backend/controllers/userController.js
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
// --- 1. Import executeTransaction ---
const { executeQuery, executeTransaction } = require('../config/db');
const { generateAccessToken } = require('../utils/generateToken');

// @desc    Register a new user
// ... (registerUser function - no changes)
const registerUser = asyncHandler(async (req, res) => {
  const { username, password, mobile_number, address } = req.body;

  if (!username || !password || !mobile_number || !address) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const userExistsResult = await executeQuery('SELECT * FROM users WHERE username = ?', [username]);
  if (userExistsResult.length > 0) {
    res.status(400);
    throw new Error('Username is already taken');
  }

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  const insertQuery = 'INSERT INTO users (username, password_hash, mobile_number, address) VALUES (?, ?, ?, ?)';
  const insertResult = await executeQuery(insertQuery, [username, password_hash, mobile_number, address]);

  const newUserId = insertResult.insertId;
  if (newUserId) {
    const promoCodeString = `${username.toUpperCase()}${Math.floor(100 + Math.random() * 900)}`;
    await executeQuery('UPDATE users SET promo_code = ? WHERE user_id = ?', [promoCodeString, newUserId]);
    
    const token = generateAccessToken(newUserId);

    res.status(201).json({
      user_id: newUserId,
      username: username,
      token: token,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data, failed to create user');
  }
});

// @desc    Authenticate user & get token (Login)
// ... (loginUser function - no changes)
const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const users = await executeQuery('SELECT * FROM users WHERE username = ?', [username]);

    if (users.length > 0) {
        const user = users[0];
        const passwordMatches = await bcrypt.compare(password, user.password_hash);

        if (passwordMatches) {
            const token = generateAccessToken(user.user_id);
            const profileCompleted = !!(user.age && user.gender && user.city);

            res.json({
                user_id: user.user_id,
                username: user.username,
                token: token,
                profileCompleted: profileCompleted 
            });
        } else {
            res.status(401);
            throw new Error('Invalid username or password');
        }
    } else {
        res.status(401);
        throw new Error('Invalid username or password');
    }
});

// @desc    Get user profile
// ... (getUserProfile function - no changes)
const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user.user_id;
  const userResult = await executeQuery('SELECT * FROM users WHERE user_id = ?', [userId]);

  if (userResult.length > 0) {
    const user = userResult[0];
    delete user.password_hash;
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// ... (updateUserProfile function - no changes)
const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user.user_id;
  const updates = req.body;
  const allowedUpdates = ['username', 'mobile_number', 'address', 'gender', 'age', 'city', 'pincode', 'state'];
  
  const setClauses = [];
  const params = [];

  allowedUpdates.forEach(field => {
    if (updates[field] !== undefined) {
      setClauses.push(`${field} = ?`);
      params.push(updates[field]);
    }
  });

  if (setClauses.length === 0) {
    res.status(400);
    throw new Error('No valid fields provided for update.');
  }

  if (updates.username) {
    const userExistsResult = await executeQuery('SELECT * FROM users WHERE username = ? AND user_id != ?', [updates.username, userId]);
    if (userExistsResult.length > 0) {
      res.status(400);
      throw new Error('Username is already taken by another user.');
    }
  }

  params.push(userId);
  const updateQuery = `UPDATE users SET ${setClauses.join(', ')} WHERE user_id = ?`;
  await executeQuery(updateQuery, params);
  const updatedUserResult = await executeQuery('SELECT * FROM users WHERE user_id = ?', [userId]);

  if (updatedUserResult.length > 0) {
    const user = updatedUserResult[0];
    delete user.password_hash;
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error('User not found after update.');
  }
});


// @desc    Get user's promo code, token balance, and token history
// ... (getUserTokenDetails function - no changes)
const getUserTokenDetails = asyncHandler(async (req, res) => {
  const userId = req.user.user_id;
  const promoCode = req.user.promo_code;
  const totalTokens = req.user.total_tokens;
  const historyQuery = `
    SELECT earned, used, reference, action_time 
    FROM tokens 
    WHERE user_id = ? 
    ORDER BY action_time DESC
  `;
  const tokenHistory = await executeQuery(historyQuery, [userId]);

  res.status(200).json({
    promoCode: promoCode || 'N/A',
    totalTokens: totalTokens || 0,
    tokenHistory: tokenHistory
  });
});

// --- 2. ADD NEW FUNCTION: Change Password ---
// @desc    Change user password
// @route   PUT /api/users/password
// @access  Private
const changeUserPassword = asyncHandler(async (req, res) => {
  const userId = req.user.user_id;
  const { oldPassword, newPassword, confirmPassword } = req.body;

  // 1. Validation
  if (!oldPassword || !newPassword || !confirmPassword) {
    res.status(400);
    throw new Error('Please provide old password, new password, and confirm password');
  }
  if (newPassword !== confirmPassword) {
    res.status(400);
    throw new Error('New passwords do not match');
  }
  if (newPassword.length < 6) {
    res.status(400);
    throw new Error('New password must be at least 6 characters long');
  }

  // 2. Verify Old Password
  const userResult = await executeQuery('SELECT password_hash FROM users WHERE user_id = ?', [userId]);
  if (userResult.length === 0) {
    res.status(404);
    throw new Error('User not found');
  }

  const passwordMatches = await bcrypt.compare(oldPassword, userResult[0].password_hash);
  if (!passwordMatches) {
    res.status(401);
    throw new Error('Invalid old password');
  }

  // 3. Hash and Update New Password
  const salt = await bcrypt.genSalt(10);
  const newPasswordHash = await bcrypt.hash(newPassword, salt);
  
  await executeQuery('UPDATE users SET password_hash = ? WHERE user_id = ?', [newPasswordHash, userId]);

  res.status(200).json({ message: 'Password changed successfully' });
});

// --- 3. ADD NEW FUNCTION: Delete Account (Transaction-Safe) ---
// @desc    Delete user profile and all associated data
// @route   DELETE /api/users/profile
// @access  Private
const deleteUserAccount = asyncHandler(async (req, res) => {
  const userId = req.user.user_id;

  // 1. Find the user's cart_id first
  const cartResult = await executeQuery('SELECT cart_id FROM carts WHERE user_id = ?', [userId]);
  const cartId = cartResult.length > 0 ? cartResult[0].cart_id : null;

  // 2. Define all queries to be run in the transaction
  const queries = [];
  
  // Delete from "child" tables first
  queries.push({ query: 'DELETE FROM tokens WHERE user_id = ?', params: [userId] });
  queries.push({ query: 'DELETE FROM orders WHERE user_id = ?', params: [userId] });
  
  if (cartId) {
    queries.push({ query: 'DELETE FROM cart_items WHERE cart_id = ?', params: [cartId] });
  }
  
  queries.push({ query: 'DELETE FROM carts WHERE user_id = ?', params: [userId] });
  
  // Finally, delete the user from the "parent" table
  queries.push({ query: 'DELETE FROM users WHERE user_id = ?', params: [userId] });

  // 3. Execute the transaction
  try {
    await executeTransaction(queries);
    
    // 4. Send success response
    res.status(200).json({ message: 'Account deleted successfully. All associated data has been removed.' });
  } catch (error) {
    // If executeTransaction fails, it will automatically roll back
    res.status(500);
    throw new Error('Failed to delete account. The operation was rolled back. Error: ' + error.message);
  }
});

// --- 4. UPDATE module.exports ---
module.exports = { 
  registerUser, 
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUserTokenDetails,
  changeUserPassword,
  deleteUserAccount
};