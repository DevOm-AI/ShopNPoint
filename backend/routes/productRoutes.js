const express = require('express');
const router = express.Router();
// --- THIS IS THE FIX ---
// We need to import the new getFeaturedProducts function from the controller.
const { 
  getProductsByCategory, 
  getProductById,
  getFeaturedProducts, // <-- This was missing
} = require('../controllers/productController');

// It's good practice to place more specific text-based routes
// before general routes that use parameters (like '/:id').
router.get('/featured', getFeaturedProducts);

router.get('/category/:categoryName', getProductsByCategory);
router.get('/:id', getProductById);

module.exports = router;