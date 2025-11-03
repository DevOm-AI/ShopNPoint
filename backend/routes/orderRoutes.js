const express = require('express');
const router = express.Router();
const { getMyOrders, createOrderFromCart } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');


// This route is protected, meaning a user must be logged in to access it.
// It will fetch the orders for the user whose token is provided.
router.route('/myorders').get(protect, getMyOrders);


// --- ADD NEW ROUTE ---
// Route to create a new order from the cart
router.route('/').post(protect, createOrderFromCart);

module.exports = router;