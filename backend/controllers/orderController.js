const asyncHandler = require('express-async-handler');
const { executeQuery } = require('../config/db');

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    // The 'protect' middleware gives us the logged-in user's details on req.user
    const userId = req.user.user_id;

    // This query joins the 'orders' and 'products' tables to get product details for each order.
    // We are now explicitly NOT selecting a product image column.
    const query = `
        SELECT
            o.order_id,
            p.name AS product_name, -- Get the product name from the products table
            o.date_of_order,
            o.date_of_delivery,
            o.total_amount,
            o.tokens_used
        FROM orders AS o
        JOIN products AS p ON o.product_id = p.product_id
        WHERE o.user_id = ?
        ORDER BY o.date_of_order DESC
    `;

    const orders = await executeQuery(query, [userId]);

    res.status(200).json(orders);
});




// --- NEW FUNCTION: Create an order from the user's cart ---
// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
const createOrderFromCart = asyncHandler(async (req, res) => {
    const userId = req.user.user_id;
    let { tokensToSpend = 0, appliedPromoCode } = req.body;
    
    // 1. GET USER, CART, AND CART ITEMS
    const userResult = await executeQuery('SELECT * FROM users WHERE user_id = ?', [userId]);
    const currentUser = userResult[0];

    const cartResult = await executeQuery('SELECT * FROM carts WHERE user_id = ?', [userId]);
    if (cartResult.length === 0) {
        res.status(400); throw new Error('Cart not found.');
    }
    const cart = cartResult[0];

    const cartItems = await executeQuery('SELECT ci.*, p.rate FROM cart_items ci JOIN products p ON ci.product_id = p.product_id WHERE cart_id = ?', [cart.cart_id]);
    if (cartItems.length === 0) {
        res.status(400); throw new Error('Your cart is empty.');
    }

    const originalCartTotal = cart.total_amount;

    // 2. PROCESS TOKEN SPENDING
    const maxDiscountINR = originalCartTotal * 0.40;
    const maxTokensToSpend = maxDiscountINR * 5;

    // Determine the actual number of tokens to use
    let tokensUsed = Math.min(
        Math.max(0, Number(tokensToSpend) || 0), // <-- THIS IS THE FIX
        currentUser.total_tokens || 0,
        maxTokensToSpend
    );
    tokensUsed = Math.floor(tokensUsed); // Ensure we use whole tokens

    const discountINR = tokensUsed / 5;
    const finalAmount = originalCartTotal - discountINR;
    
    // 3. PROCESS PROMO CODE (AFFILIATE REWARD)
    let promoCodeOwnerId = null;
    let rewardTokens = 0;
    
    if (appliedPromoCode) {
        appliedPromoCode = appliedPromoCode.trim();
        if (appliedPromoCode === currentUser.promo_code) {
            res.status(400); throw new Error('You cannot use your own promo code.');
        }

        const promoOwnerResult = await executeQuery('SELECT user_id FROM users WHERE promo_code = ?', [appliedPromoCode]);
        if (promoOwnerResult.length === 0) {
            res.status(400); throw new Error('Invalid promo code.');
        }
        promoCodeOwnerId = promoOwnerResult[0].user_id;

        // Calculate 15% reward based on the original cart total
        rewardTokens = Math.floor(originalCartTotal * 0.15);
    }

    // 4. CREATE ORDER RECORDS
    // Note: Your 'orders' table schema supports one product per order.
    // We will create a separate order record for each item in the cart.
    for (const item of cartItems) {
        const itemTotal = item.quantity * item.rate;
        // Distribute the token usage proportionally across each created order item
        const itemTokensUsed = Math.floor((itemTotal / originalCartTotal) * tokensUsed);
        
        await executeQuery(
            'INSERT INTO orders (user_id, product_id, date_of_order, date_of_delivery, total_amount, tokens_used, applied_promo_code) VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), ?, ?, ?)',
            [userId, item.product_id, itemTotal, itemTokensUsed, appliedPromoCode || null]
        );
    }

    // 5. UPDATE TOKEN BALANCES
    // Deduct tokens from the buyer
    if (tokensUsed > 0) {
        await executeQuery('UPDATE users SET total_tokens = total_tokens - ? WHERE user_id = ?', [tokensUsed, userId]);
        await executeQuery('INSERT INTO tokens (user_id, used, reference) VALUES (?, ?, ?)', [userId, tokensUsed, 'Payment for purchase']);
    }

    // Award tokens to the promo code owner
    if (promoCodeOwnerId && rewardTokens > 0) {
        await executeQuery('UPDATE users SET total_tokens = total_tokens + ? WHERE user_id = ?', [rewardTokens, promoCodeOwnerId]);
        await executeQuery('INSERT INTO tokens (user_id, earned, reference) VALUES (?, ?, ?)', [promoCodeOwnerId, rewardTokens, `Affiliate bonus from ${currentUser.username}'s purchase`]);
    }

    // 6. CLEAR THE CART
    await executeQuery('DELETE FROM cart_items WHERE cart_id = ?', [cart.cart_id]);
    await executeQuery('UPDATE carts SET total_amount = 0 WHERE cart_id = ?', [cart.cart_id]);

    res.status(201).json({ message: 'Order created successfully!' });
});

// EXPORT THE NEW FUNCTION
module.exports = {
    getMyOrders,
    createOrderFromCart, // <-- Add this
};
