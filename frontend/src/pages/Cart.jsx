import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Tag, 
  Coins, 
  CreditCard, 
  CheckCircle, 
  AlertCircle, 
  Gift, 
  X,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

// --- CartItem Component (Minimalist) ---
const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    // Softer shadow
    <div className="bg-white border-2 border-slate-100 rounded-2xl p-4 
                  transition-all duration-300 hover:shadow-md hover:border-blue-200 
                  group">
      <div className="flex items-start space-x-4">
        <div className="w-20 h-20 bg-gradient-to-br from-slate-50 to-slate-100 
                      rounded-xl flex items-center justify-center flex-shrink-0 
                      group-hover:from-blue-50 group-hover:to-indigo-50 
                      transition-all duration-300">
          {/* Using Gift icon as placeholder, this is fine */}
          <Gift className="w-8 h-8 text-blue-400 group-hover:text-blue-500 transition-colors" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            {/* Lighter font-semibold */}
            <h3 className="text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
              {item.name}
            </h3>
            <button 
              onClick={() => onRemove(item.id)} 
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 
                         rounded-lg transition-all duration-200"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))} 
                className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg 
                           flex items-center justify-center transition-colors duration-200 
                           text-slate-700"
              >
                <Minus className="w-4 h-4" />
              </button>
              {/* Lighter font-semibold */}
              <span className="w-8 text-center font-semibold text-lg text-slate-800">
                {item.quantity}
              </span>
              <button 
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} 
                className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg 
                           flex items-center justify-center transition-colors duration-200 
                           text-slate-700"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="text-right">
              {/* Smaller, lighter font. Fixed currency symbol. */}
              <p className="text-lg font-semibold text-slate-900">
                ₹{(item.price * item.quantity).toLocaleString()}
              </p>
              <p className="text-sm text-slate-500">
                ₹{item.price.toLocaleString()} each
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- CartPage Component (Minimalist) ---
const CartPage = () => {
  // --- (All state and logic hooks are unchanged) ---
  const [cart, setCart] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState('');
  const [tokensToSpend, setTokensToSpend] = useState('');
  const [tokenDiscount, setTokenDiscount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  // --- (All useEffect and handler functions are unchanged) ---
  useEffect(() => {
    const fetchCartAndTokens = async () => {
      setIsLoading(true);
      setError('');
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo || !userInfo.token) throw new Error('Please log in to view your cart.');
        
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        
        const [cartRes, tokensRes] = await Promise.all([
          axios.get('http://localhost:5000/api/cart', config),
          axios.get('http://localhost:5000/api/users/tokens', config)
        ]);
        
        setCart(cartRes.data);
        setTokenBalance(tokensRes.data.totalTokens || 0);
        setFinalTotal(cartRes.data?.totals?.total_amount || 0);
        
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch cart.';
        setError(errorMessage);
        if (err.response?.status === 401) navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCartAndTokens();
  }, [navigate]);

  useEffect(() => {
    const subtotal = cart?.totals?.total_amount || 0;
    const tokens = Math.floor(Number(tokensToSpend) || 0);
    const discount = tokens / 5;
    setTokenDiscount(discount);
    setFinalTotal(subtotal - discount);
  }, [tokensToSpend, cart]);

  const handleUpdateQuantity = async (id, newQuantity) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo) { navigate('/login'); return; }
      
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`http://localhost:5000/api/cart/${id}`, { quantity: newQuantity }, config);
      
      const { data } = await axios.get('http://localhost:5000/api/cart', config);
      setCart(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update quantity.');
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo) { navigate('/login'); return; }
      
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.delete(`http://localhost:5000/api/cart/${id}`, config);
      
      const { data } = await axios.get('http://localhost:5000/api/cart', config);
      setCart(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove item.');
    }
  };

  const handleTokenInputChange = (e) => {
    const value = e.target.value;
    if (value === '') {
      setTokensToSpend('');
      return;
    }
    let numValue = Math.floor(Number(value));
    if (numValue < 0) {
      numValue = 0;
    }
    const subtotal = cart?.totals?.total_amount || 0;
    const maxDiscountINR = subtotal * 0.40;
    const maxTokensForDiscount = Math.floor(maxDiscountINR * 5);
    const maxSpendable = Math.min(tokenBalance, maxTokensForDiscount);
    if (numValue > maxSpendable) {
      numValue = maxSpendable;
    }
    setTokensToSpend(String(numValue));
  };

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    setError('');
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo || !userInfo.token) {
        navigate('/login');
        return;
      }
      
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
      const finalTokensToSpend = Math.floor(Number(tokensToSpend) || 0);
      const payload = {
        tokensToSpend: finalTokensToSpend,
        appliedPromoCode: promoCode || null
      };

      await axios.post('http://localhost:5000/api/orders', payload, config);
      
      alert('Order placed successfully! Thank you for shopping with us.');
      navigate('/orders');

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to place order.';
      setError(errorMessage);
    } finally {
      setIsPlacingOrder(false);
    }
  };
  
  // --- (Loading spinner is fine) ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 
                     flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 
                       rounded-full animate-spin mb-4"></div>
        <p className="text-lg text-slate-600 font-medium">Loading your cart...</p>
      </div>
    );
  }

  // --- (Main Return JSX - Minimalist Refactor) ---
  return (
    <div className="min-h-screen bg-slate-50"> {/* Simplified background */}
      
      {/* Removed floating orbs for a cleaner look */}
      
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">

        {/* Page Header (Minimalist) */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 
                        text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <ShoppingCart className="w-4 h-4" />
            <span>Review Your Order</span>
          </div>
          
          {/* Smaller, lighter font. No gradient. */}
          <h1 className="text-3xl font-semibold text-slate-900 mb-4">
            Shopping{" "}
            <span className="text-blue-600">
              Cart
            </span>
          </h1>
          
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Review your items, apply discounts, and proceed to checkout.
          </p>
        </div>
          
        {/* Error State (Unchanged, already good) */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center max-w-3xl mx-auto">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center 
                          justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-red-900">Oops! Something went wrong.</h2>
            <p className="text-red-700 mt-2 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white font-semibold py-2 px-6 rounded-xl 
                         hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State (Minimalist) */}
        {!isLoading && !error && (!cart || cart.items.length === 0) && (
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-12 text-center max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center 
                          justify-center mx-auto mb-4">
              <ShoppingCart className="w-10 h-10 text-slate-400" />
            </div>
            {/* Lighter font */}
            <h3 className="text-2xl font-semibold text-slate-900 mb-2">Your cart is empty</h3>
            <p className="text-slate-600 mb-6">
              Looks like you haven't added anything yet.
            </p>
            {/* Solid button, softer shadow */}
            <Link 
              to="/landing"
              className="inline-flex items-center gap-2 bg-blue-600
                         text-white px-6 py-3 rounded-xl font-semibold 
                         hover:bg-blue-700 hover:shadow-md transition-all duration-300 group"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}

        {/* Main Content Grid */}
        {!isLoading && !error && cart && cart.items.length > 0 && (
          <div className="grid lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-6">
                  {/* Smaller, lighter font */}
                  <h2 className="text-2xl font-semibold text-slate-900">Your Items</h2>
                  <div className="bg-blue-100 text-blue-700 px-4 py-1.5 
                                rounded-full text-sm font-semibold">
                    {cart.items.length} {cart.items.length === 1 ? 'Item' : 'Items'}
                  </div>
                </div>
                <div className="space-y-6">
                  {cart.items.map((item) => (
                    <CartItem
                      key={item.cart_item_id}
                      item={{...item, price: item.rate, id: item.cart_item_id}}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemove={handleRemoveItem}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Column 2: Order Summary */}
            <div className="lg:col-span-1">
              {/* Softer shadow, cleaner bg */}
              <div className="bg-white rounded-3xl 
                            shadow-lg p-8 border border-slate-200 sticky top-6">
                {/* Smaller, lighter font */}
                <h2 className="text-2xl font-semibold text-slate-900 mb-6">Order Summary</h2>
                
                <div className="space-y-5">
                  
                  {/* Promo Code Input (Styling is fine, matches new theme) */}
                  <div className="group">
                    <label 
                      htmlFor="promo" 
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Apply Promo Code
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center 
                                    pointer-events-none">
                        <Gift className={`w-5 h-5 transition-colors ${
                          focusedField === 'promo' ? 'text-blue-600' : 'text-slate-400'
                        }`} />
                      </div>
                      <input
                        type="text"
                        id="promo"
                        placeholder="Enter code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        onFocus={() => setFocusedField('promo')}
                        onBlur={() => setFocusedField('')}
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 
                                   border-slate-200 rounded-xl text-slate-900 
                                   placeholder-slate-400 focus:outline-none 
                                   focus:border-blue-500 focus:bg-white 
                                   transition-all duration-200"
                      />
                    </div>
                  </div>
                  
                  {/* Token Spending Input (Styling is fine) */}
                  <div className="group">
                    <label 
                      htmlFor="tokens" 
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Spend Tokens
                    </label>
                    <p className="text-xs text-blue-600 font-medium mb-1">
                      You have: {tokenBalance.toLocaleString()} tokens
                    </p>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center 
                                    pointer-events-none">
                        <Coins className={`w-5 h-5 transition-colors ${
                          focusedField === 'tokens' ? 'text-blue-600' : 'text-slate-400'
                        }`} />
                      </div>
                      <input
                        type="number"
                        id="tokens"
                        placeholder="0"
                        value={tokensToSpend}
                        onChange={handleTokenInputChange} 
                        onFocus={() => setFocusedField('tokens')}
                        onBlur={() => setFocusedField('')}
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 
                                   border-slate-200 rounded-xl text-slate-900 
                                   placeholder-slate-400 focus:outline-none 
                                   focus:border-blue-500 focus:bg-white 
                                   transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-slate-200 pt-6 space-y-3 mt-6">
                  <div className="flex justify-between text-lg">
                    <span className="text-slate-600">Subtotal:</span>
                    {/* Fixed currency symbol */}
                    <span className="font-semibold text-slate-800">
                      ₹{parseFloat(cart.totals.total_amount).toLocaleString()}
                    </span>
                  </div>
                  
                  {tokenDiscount > 0 && (
                    <div className="flex justify-between text-lg">
                      <span className="text-green-600">Token Discount:</span>
                      {/* Fixed currency symbol */}
                      <span className="font-semibold text-green-600">
                        - ₹{tokenDiscount.toLocaleString(undefined, 
                           { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}
                  
                  {/* Total (Minimalist) */}
                  <div className="border-t border-slate-200 pt-4 flex 
                                justify-between text-2xl font-semibold"> {/* Reduced size */}
                    <span className="text-slate-900">Total:</span>
                    {/* NO GRADIENT, Fixed currency symbol */}
                    <span className="text-slate-900">
                      ₹{finalTotal.toLocaleString(undefined, 
                         { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
                
                {/* Primary Action Button (Minimalist) */}
                <button 
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder}
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700 
                             text-white font-semibold py-4 px-6 rounded-xl 
                             shadow-md hover:shadow-lg 
                             transform hover:-translate-y-0.5 transition-all duration-200 
                             disabled:opacity-50 disabled:cursor-not-allowed 
                             disabled:transform-none
                             flex items-center justify-center gap-2 group"
                >
                  {isPlacingOrder ? (
                    <div className="w-6 h-6 border-3 border-white 
                                  border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      <span>Place Order</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 
                                            transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CartPage;