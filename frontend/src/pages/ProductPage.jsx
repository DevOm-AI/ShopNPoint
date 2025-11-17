import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import { 
  Star, ShieldCheck, Truck, Zap, Plus, Minus, CheckCircle, Package, 
  MapPin, ShoppingBag, Shirt, Laptop, Gem, Home as HomeIcon, 
  Coins, ArrowRight, UserCircle, MessageSquare, 
  ShoppingCart, 
  Lock 
} from 'lucide-react';
import Logo from '../components/Logo'; // Assuming you have this

// Helper map for icons (from Landing.jsx)
const iconMap = {
  'Clothing': Shirt,
  'Electronics': Laptop,
  'Jewellery': Gem,
  'Home Appliances': HomeIcon,
  'Footwear': ShoppingBag
};

const ProductPage = () => {
  // --- (All state and logic hooks are unchanged) ---
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  // --- (Fetch Product Logic is Unchanged) ---
  useEffect(() => {
    // --- SCROLL TO TOP FIX ---
    window.scrollTo(0, 0);
    // --- END FIX ---
    
    const fetchProduct = async () => {
      setIsLoading(true);
      setError('');
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${productId}`);
        setProduct(data);
      } catch (err) {
        setError('Failed to fetch product details.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  // --- (Add to Cart Logic is Unchanged) ---
  const handleAddToCart = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo || !userInfo.token) {
        navigate('/login');
        return;
      }
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.post(
        'http://localhost:5000/api/cart',
        { productId: product.product_id, quantity: quantity },
        config
      );
      alert(`${quantity} x "${product.name}" added to cart!`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add item to cart.');
      console.error(err);
    }
  };

  // --- (Star Rendering Logic is Unchanged) ---
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} className={`w-5 h-5 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
    ));
  };

  // --- (Loading/Error States are already minimalist) ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50
                     flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 
                       rounded-full animate-spin mb-4"></div>
        <p className="text-lg text-slate-600 font-medium">Loading Product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50
                     flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-12 text-center shadow-lg">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center 
                        justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h3 className="text-2xl font-bold text-red-900 mb-2">Product Not Found</h3>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const ProductIcon = iconMap[product.category] || Zap;

  return (
    // Set base minimalist background
    <div className="min-h-screen bg-slate-50">
      
      {/* Removed Floating Background Elements */}

      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Image Gallery Column (Minimalist) */}
          <div className="space-y-4 sticky top-28">
            <div className="bg-slate-100 rounded-2xl 
              flex items-center justify-center relative overflow-hidden border-2 border-slate-200">
              <img 
                src={product.image_url}
                alt={product.name}
                className="w-full h-auto object-contain p-4"
              />
            </div>
          </div>

          {/* Product Details Column (Minimalist) */}
          <div className="space-y-6">
            <div>
              <span className="text-sm font-semibold text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                {product.category}
              </span>
              {/* Refactored Title (No gradient, lighter font) */}
              <h1 className="text-3xl font-semibold mt-4 text-slate-900">
                {product.name}
              </h1>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center">{renderStars(4)}</div>
              <span className="text-slate-600 font-medium">(152 Reviews)</span>
              <span className="text-green-600 font-semibold">| In Stock</span>
            </div>

            {/* Refactored Price (No gradient, lighter font) */}
            <div className="flex items-baseline space-x-3">
              <span className="text-4xl font-semibold text-slate-900">
                ₹{parseFloat(product.rate).toFixed(2)}
              </span>
              <span className="text-xl text-slate-400 line-through">
                ₹{(parseFloat(product.rate) * 1.5).toFixed(2)}
              </span>
              {/* Softer color */}
              <span className="text-lg font-semibold text-orange-600">(50% OFF)</span>
            </div>

            {/* Description (Fine as is) */}
            <p className="text-lg text-slate-600 leading-relaxed">
              This is a premium quality product designed for modern users. It combines sleek aesthetics with powerful functionality, making it a perfect choice for your daily needs. Experience the best in class.
            </p>
            
            {/* Quantity Selector (Fine as is) */}
            <div className="flex items-center space-x-4 pt-4">
                <label className="font-semibold text-slate-700">Quantity:</label>
                <div className="flex items-center rounded-xl overflow-hidden border border-slate-200">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 bg-slate-100 hover:bg-slate-200 transition-colors"><Minus size={16} /></button>
                    <span className="font-semibold text-lg w-12 text-center bg-white">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="p-3 bg-slate-100 hover:bg-slate-200 transition-colors"><Plus size={16} /></button>
                </div>
            </div>

            {/* Refactored Buttons (No gradients, softer shadows) */}
            <div className="flex flex-col sm:flex-row items-stretch space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
              {/* Primary Button */}
              <button 
                onClick={handleAddToCart} 
                className="flex-1 w-full bg-blue-600 hover:bg-blue-700
                           text-white font-semibold py-4 px-6 rounded-xl 
                           shadow-md hover:shadow-lg
                           transform hover:-translate-y-0.5 transition-all duration-200 
                           flex items-center justify-center gap-2 group"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
              {/* Secondary Button */}
              <button 
                onClick={handleAddToCart} 
                className="flex-1 w-full bg-slate-800 
                           hover:bg-slate-900
                           text-white font-semibold py-4 px-6 rounded-xl 
                           shadow-md hover:shadow-lg
                           transform hover:-translate-y-0.5 transition-all duration-200 
                           flex items-center justify-center gap-2 group"
              >
                <span>Buy Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* --- NEW DUMMY DATA SECTION (Minimalist) --- */}
        <div className="mt-16 lg:mt-24 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            
            {/* (Commented sections remain unchanged) */}
            
            {/* Customer Reviews Card (Minimalist) */}
            {/* Softer shadow */}
            <div className="bg-white border-2 border-slate-100 rounded-2xl shadow-md p-8">
              {/* Lighter font */}
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Customer Reviews</h2>
              <div className="border-b border-slate-100 pb-6 mb-6">
                <div className="flex items-center mb-2">
                  <UserCircle className="w-10 h-10 text-slate-400 mr-3" />
                  <div>
                    <h4 className="font-semibold text-slate-800">Rahul Sharma</h4>
                    <div className="flex items-center">{renderStars(5)}</div>
                  </div>
                </div>
                <p className="text-slate-600">Amazing product! The sound quality is incredible for this price point. Battery life is also top-notch. Highly recommended.</p>
              </div>
              <div className="border-b-slate-100 pb-6 mb-6">
                <div className="flex items-center mb-2">
                  <UserCircle className="w-10 h-10 text-slate-400 mr-3" />
                  <div>
                    <h4 className="font-semibold text-slate-800">Priya Singh</h4>
                    <div className="flex items-center">{renderStars(4)}</div>
                  </div>
                </div>
                <p className="text-slate-600">Very comfortable and connects instantly. The only downside is the case is a bit bulky, but overall a great purchase.</p>
              </div>
            </div>

          </div>

          {/* Right Column: Delivery & Seller (Minimalist) */}
          <div className="lg:col-span-1">
            {/* Softer shadow, no blur */}
            <div className="bg-white rounded-2xl 
                          shadow-lg p-6 border border-slate-200 sticky top-28">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-slate-600">Deliver to</span>
                  <span className="font-semibold text-slate-800">Mumbai - 400001</span>
                </div>
                <p className="font-semibold text-green-600">Get it by Tomorrow, 9 PM</p>
                <p className="text-sm text-slate-500">Free Delivery</p>
              </div>
              
              <div className="border-t border-slate-200 pt-4 space-y-4">
                <div className="flex items-center gap-3">
                  <Package className="w-8 h-8 text-blue-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-800">10 Day Replacement</h4>
                    <p className="text-sm text-slate-600">Eligible for free replacement.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-8 h-8 text-blue-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-800">1Year Warranty</h4>
                    <p className="text-sm text-slate-600">From the date of purchase.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Logo />
                  <div>
                    <h4 className="font-semibold text-slate-800">Sold by SnP Retail</h4>
                    <p className="text-sm text-slate-600">Top-rated seller.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Lock className="w-4 h-4 text-slate-500" />
                  <span>Secure transaction</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductPage;