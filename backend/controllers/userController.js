const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const { executeQuery, executeTransaction } = require('../config/db'); // Ensure executeTransaction is imported
const { generateAccessToken } = require('../utils/generateToken');
const { encrypt, decrypt } = require('../models/aesEncrypt'); 

// @desc    Register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { username, password, mobile_number, address } = req.body;

  if (!username || !password || !mobile_number || !address) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }
  // (User exists check) 
  const userExistsResult = await executeQuery('SELECT * FROM users WHERE username = ?', [username]);
  if (userExistsResult.length > 0) {
    res.status(400);
    throw new Error('Username is already taken');
  }

  // --- 2. ENCRYPT SENSITIVE DATA ---
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);
  const encryptedMobile = encrypt(mobile_number);
  const encryptedAddress = encrypt(address);
  // ---------------------------------

  const insertQuery = 'INSERT INTO users (username, password_hash, mobile_number, address) VALUES (?, ?, ?, ?)';
  const insertResult = await executeQuery(insertQuery, [
    username, 
    password_hash, 
    encryptedMobile, // Save encrypted data
    encryptedAddress // Save encrypted data
  ]);

  const newUserId = insertResult.insertId;
  if (newUserId) {
    // ... (Promo code logic remains the same) ...
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
// ... (loginUser function remains the same, no changes needed) ...
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
const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user.user_id;
  const userResult = await executeQuery('SELECT * FROM users WHERE user_id = ?', [userId]);

  if (userResult.length > 0) {
    const user = userResult[0];
    delete user.password_hash; // Remove sensitive hash

    // --- 3. DECRYPT SENSITIVE DATA ---
    user.mobile_number = decrypt(user.mobile_number);
    user.address = decrypt(user.address);
    // ---------------------------------

    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user.user_id;
  const updates = req.body;
  const allowedUpdates = ['username', 'mobile_number', 'address', 'gender', 'age', 'city', 'pincode', 'state'];
  
  const setClauses = [];
  const params = [];

  // --- 4. ENCRYPT SENSITIVE FIELDS ON UPDATE ---
  allowedUpdates.forEach(field => {
    if (updates[field] !== undefined) {
      setClauses.push(`${field} = ?`);
      let valueToStore = updates[field]; // Get plaintext
      
      // Check if this field is one we need to encrypt
      if (field === 'mobile_number' || field === 'address') {
        valueToStore = encrypt(updates[field]); // Encrypt it
      }
      
      params.push(valueToStore); // Push encrypted (or plaintext) value
    }
  });
  // -----------------------------------------

  if (setClauses.length === 0) {
    res.status(400);
    throw new Error('No valid fields provided for update.');
  }

  // ... (Username check remains the same) ...
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

  // Fetch the fully updated user profile to send back
  const updatedUserResult = await executeQuery('SELECT * FROM users WHERE user_id = ?', [userId]);

  if (updatedUserResult.length > 0) {
    const user = updatedUserResult[0];
    delete user.password_hash;

    // --- 5. DECRYPT UPDATED DATA FOR RESPONSE ---
    user.mobile_number = decrypt(user.mobile_number);
    user.address = decrypt(user.address);
    // -------------------------------------------

    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error('User not found after update.');
  }
});

// @desc    Get user's promo code, token balance, and token history
// ... (getUserTokenDetails function remains the same, no changes needed) ...
const getUserTokenDetails = asyncHandler(async (req, res) => {
  // This function uses req.user, which (from authMiddleware)
  // already has encrypted mobile/address, but this function doesn't use them, so it's safe.
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


// @desc    Change user password
const changeUserPassword = asyncHandler(async (req, res) => {
  const userId = req.user.user_id;
  const { oldPassword, newPassword, confirmPassword } = req.body;

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

  const salt = await bcrypt.genSalt(10);
  const newPasswordHash = await bcrypt.hash(newPassword, salt);
  
  await executeQuery('UPDATE users SET password_hash = ? WHERE user_id = ?', [newPasswordHash, userId]);

  res.status(200).json({ message: 'Password changed successfully' });
});

// @desc    Delete user profile and all associated data
// ... (deleteUserAccount function remains the same) ...
const deleteUserAccount = asyncHandler(async (req, res) => {
  const userId = req.user.user_id;

  const cartResult = await executeQuery('SELECT cart_id FROM carts WHERE user_id = ?', [userId]);
  const cartId = cartResult.length > 0 ? cartResult[0].cart_id : null;

  const queries = [];
  queries.push({ query: 'DELETE FROM tokens WHERE user_id = ?', params: [userId] });
  queries.push({ query: 'DELETE FROM orders WHERE user_id = ?', params: [userId] });
  if (cartId) {
    queries.push({ query: 'DELETE FROM cart_items WHERE cart_id = ?', params: [cartId] });
  }
  queries.push({ query: 'DELETE FROM carts WHERE user_id = ?', params: [userId] });
  queries.push({ query: 'DELETE FROM users WHERE user_id = ?', params: [userId] });

  try {
    await executeTransaction(queries);
    res.status(200).json({ message: 'Account deleted successfully. All associated data has been removed.' });
  } catch (error) {
    res.status(500);
    throw new Error('Failed to delete account. The operation was rolled back. Error: ' + error.message);
  }
});


// Update module.exports
module.exports = { 
  registerUser, 
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUserTokenDetails,
  changeUserPassword,
  deleteUserAccount
};