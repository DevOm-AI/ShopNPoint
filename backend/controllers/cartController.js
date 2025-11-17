const asyncHandler = require('express-async-handler');
const { executeQuery } = require('../config/db');

// @desc    Get the user's cart
// @route   GET /api/cart
// @access  Private
const getUserCart = asyncHandler(async (req, res) => {
  const userId = req.user.user_id;

  // This query joins the cart items with the products table to get all details
  const query = `
    SELECT 
      ci.cart_item_id, 
      ci.quantity, 
      p.product_id, 
      p.name, 
      p.rate ,
      p.category,
      p.image_url
    FROM cart_items ci
    JOIN carts c ON ci.cart_id = c.cart_id
    JOIN products p ON ci.product_id = p.product_id
    WHERE c.user_id = ?
  `;
  
  const cartItems = await executeQuery(query, [userId]);
  
  // Also get the cart totals
  const cartTotalsResult = await executeQuery('SELECT total_amount, max_tokens_applicable FROM carts WHERE user_id = ?', [userId]);
  const cartTotals = cartTotalsResult.length > 0 ? cartTotalsResult[0] : { total_amount: 0, max_tokens_applicable: 0 };

  res.json({
    items: cartItems,
    totals: cartTotals
  });
});

// @desc    Add an item to the cart
// @route   POST /api/cart
// @access  Private
const addItemToCart = asyncHandler(async (req, res) => {
  const userId = req.user.user_id;
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    res.status(400);
    throw new Error('Product ID and quantity are required.');
  }

  // 1. Find the product to get its price
  const productResult = await executeQuery('SELECT rate FROM products WHERE product_id = ?', [productId]);
  if (productResult.length === 0) {
    res.status(404);
    throw new Error('Product not found.');
  }
  const price_at_addition = productResult[0].rate;

  // 2. Find or create a cart for the user
  let cartResult = await executeQuery('SELECT cart_id FROM carts WHERE user_id = ?', [userId]);
  let cartId;

  if (cartResult.length === 0) {
    // If no cart, create one
    const newCart = await executeQuery('INSERT INTO carts (user_id) VALUES (?)', [userId]);
    cartId = newCart.insertId;
  } else {
    cartId = cartResult[0].cart_id;
  }

  // 3. Check if the item is already in the cart
  const existingItem = await executeQuery(
    'SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?',
    [cartId, productId]
  );

  if (existingItem.length > 0) {
    // If it exists, update the quantity
    const newQuantity = existingItem[0].quantity + quantity;
    await executeQuery(
      'UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?',
      [newQuantity, existingItem[0].cart_item_id]
    );
  } else {
    // If it's a new item, insert it
    await executeQuery(
      'INSERT INTO cart_items (cart_id, product_id, quantity, price_at_addition) VALUES (?, ?, ?, ?)',
      [cartId, productId, quantity, price_at_addition]
    );
  }

  // 4. Recalculate cart total (this is a simplified calculation)
  // A more robust solution might use SQL aggregation.
  const itemsInCart = await executeQuery('SELECT quantity, price_at_addition FROM cart_items WHERE cart_id = ?', [cartId]);
  const totalAmount = itemsInCart.reduce((total, item) => total + (item.quantity * item.price_at_addition), 0);
  await executeQuery('UPDATE carts SET total_amount = ? WHERE cart_id = ?', [totalAmount, cartId]);

  res.status(201).json({ message: 'Item added to cart' });
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const userId = req.user.user_id;
  const { itemId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    res.status(400);
    throw new Error('Valid quantity is required.');
  }

  // First, verify the cart item belongs to the user
  const verifyQuery = `
    SELECT ci.cart_item_id, ci.cart_id 
    FROM cart_items ci
    JOIN carts c ON ci.cart_id = c.cart_id
    WHERE ci.cart_item_id = ? AND c.user_id = ?
  `;
  
  const verifyResult = await executeQuery(verifyQuery, [itemId, userId]);
  if (verifyResult.length === 0) {
    res.status(404);
    throw new Error('Cart item not found.');
  }

  // Update the quantity
  await executeQuery(
    'UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?',
    [quantity, itemId]
  );

  // Recalculate cart total
  const cartId = verifyResult[0].cart_id;
  const itemsInCart = await executeQuery('SELECT quantity, price_at_addition FROM cart_items WHERE cart_id = ?', [cartId]);
  const totalAmount = itemsInCart.reduce((total, item) => total + (item.quantity * item.price_at_addition), 0);
  await executeQuery('UPDATE carts SET total_amount = ? WHERE cart_id = ?', [totalAmount, cartId]);

  res.json({ message: 'Cart item updated successfully' });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
const removeCartItem = asyncHandler(async (req, res) => {
  const userId = req.user.user_id;
  const { itemId } = req.params;

  // First, verify the cart item belongs to the user and get cart_id
  const verifyQuery = `
    SELECT ci.cart_item_id, ci.cart_id 
    FROM cart_items ci
    JOIN carts c ON ci.cart_id = c.cart_id
    WHERE ci.cart_item_id = ? AND c.user_id = ?
  `;
  
  const verifyResult = await executeQuery(verifyQuery, [itemId, userId]);
  if (verifyResult.length === 0) {
    res.status(404);
    throw new Error('Cart item not found.');
  }

  const cartId = verifyResult[0].cart_id;

  // Remove the item
  await executeQuery('DELETE FROM cart_items WHERE cart_item_id = ?', [itemId]);

  // Recalculate cart total
  const itemsInCart = await executeQuery('SELECT quantity, price_at_addition FROM cart_items WHERE cart_id = ?', [cartId]);
  const totalAmount = itemsInCart.reduce((total, item) => total + (item.quantity * item.price_at_addition), 0);
  await executeQuery('UPDATE carts SET total_amount = ? WHERE cart_id = ?', [totalAmount, cartId]);

  res.json({ message: 'Item removed from cart successfully' });
});

module.exports = {
  getUserCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
};