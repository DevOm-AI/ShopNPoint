// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUserTokenDetails,
  changeUserPassword,  // <-- 1. Import new function
  deleteUserAccount,   // <-- 2. Import new function
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Public Routes
router.post('/', registerUser);
router.post('/login', loginUser);

// Profile Routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)
  .delete(protect, deleteUserAccount); // <-- 3. Add DELETE method

// Change Password Route
router.put('/password', protect, changeUserPassword); // <-- 4. Add new route

// Tokens and Promo Code Route
router.route('/tokens').get(protect, getUserTokenDetails);


module.exports = router;