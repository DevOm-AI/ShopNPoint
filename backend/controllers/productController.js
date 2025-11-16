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

// @desc    Fetch a single product by its ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params; 

  const products = await executeQuery('SELECT * FROM products WHERE product_id = ?', [id]);

  if (products.length > 0) {
    res.json(products[0]); 
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});


// --- THIS IS THE FINAL, CORRECTED FUNCTION ---
// @desc    Search for products
// @route   GET /api/products/search
// @access  Public
// --- REPLACE your old searchProducts function with this one ---

// @desc    Search for products
// @route   GET /api/products/search
// @access  Public
const searchProducts = asyncHandler(async (req, res) => {
  const query = req.query.q; 

  if (!query) {
    res.status(400);
    throw new Error('Search query is required.');
  }
  
  const sqlQuery = `SELECT * FROM products WHERE LOWER(name) LIKE '%${query.toLowerCase()}%'`;

  // We pass the raw query string directly, with no parameters.
  const products = await executeQuery(sqlQuery);

  if (products && Array.isArray(products)) {
    res.json(products);
  } else {
    res.json([]); // Always return an array
  }
});



// @desc    Fetch featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const query = 'SELECT * FROM products LIMIT 6';
  
  const products = await executeQuery(query);
  
  if (products && products.length > 0) {
    res.json(products);
  } else {
    res.status(404);
    throw new Error('No featured products found.');
  }
});

module.exports = {
  getProductsByCategory,
  getProductById,
  getFeaturedProducts,
  searchProducts,
};