const asyncHandler = require('express-async-handler');
const { executeQuery } = require('../config/db');

// @desc    Fetch products by category
// @route   GET /api/products/category/:categoryName
// @access  Public
const getProductsByCategory = asyncHandler(async (req, res) => {
  const { categoryName } = req.params;

  if (!categoryName) {
    res.status(400);
    throw new Error('Category name is required.');
  }

  const products = await executeQuery('SELECT * FROM products WHERE category = ?', [categoryName]);

  if (products) {
    res.json(products);
  } else {
    res.status(404);
    throw new Error('No products found for this category.');
  }
});

// --- ADD THIS NEW FUNCTION ---
// @desc    Fetch a single product by its ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params; // Get the ID from the URL parameter

  const products = await executeQuery('SELECT * FROM products WHERE product_id = ?', [id]);

  if (products.length > 0) {
    res.json(products[0]); // Return the single product found
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// --- ADD THIS NEW FUNCTION ---
// @desc    Fetch featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = asyncHandler(async (req, res) => {
  // We'll fetch the first 6 products as "featured"
  const query = 'SELECT * FROM products LIMIT 6';
  
  console.log("Executing query for featured products:", query); // Debugging line
  
  const products = await executeQuery(query);

  console.log("Products found:", products); // Debugging line
  
  if (products && products.length > 0) {
    res.json(products);
  } else {
    // This part is likely being triggered
    console.log("No products found, returning 404.");
    res.status(404);
    throw new Error('No featured products found.');
  }
});

module.exports = {
  getProductsByCategory,
  getProductById,
  getFeaturedProducts,
};