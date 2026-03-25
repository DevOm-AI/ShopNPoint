const express = require('express');
const router = express.Router();
// We need to import the new getFeaturedProducts function from the controller.
const { 
  getProductsByCategory, 
  getProductById,
  getFeaturedProducts,
  searchProducts,
  getRecommendations
} = require('../controllers/productController');

// It's good practice to place more specific text-based routes
// before general routes that use parameters (like '/:id').
router.get('/featured', getFeaturedProducts);

router.get('/category/:categoryName', getProductsByCategory);


// This will handle requests like: /api/products/search?q=laptop
router.get('/search', searchProducts);

router.get('/:id', getProductById);

// --- THIS IS THE NEW ROUTE FOR RECOMMENDATIONS ---
// We will add a new route to get product recommendations based on a product ID.
// This route will call the getRecommendations function in the controller, which we will implement next.
router.get('/:id/recommendations', getRecommendations);

module.exports = router;