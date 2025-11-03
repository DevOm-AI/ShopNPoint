const express = require('express');
const router = express.Router();
const {
  loginAdmin,
  getAllUsers,
  getAllOrders
} = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/authMiddleware'); // A new middleware for admins

// Public Route for Admin Login
router.post('/login', loginAdmin);

// Protected Admin Routes
router.get('/users', protectAdmin, getAllUsers);
router.get('/orders', protectAdmin, getAllOrders);

module.exports = router;