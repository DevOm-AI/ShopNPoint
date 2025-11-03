const express = require('express');
const router = express.Router();
const { getUserCart, addItemToCart, updateCartItem, removeCartItem } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

// Both routes are protected; a user must be logged in to access their cart.
router.route('/')
  .get(protect, getUserCart)
  .post(protect, addItemToCart);

// Routes for updating and removing individual cart items
router.route('/:itemId')
  .put(protect, updateCartItem)
  .delete(protect, removeCartItem);

module.exports = router;