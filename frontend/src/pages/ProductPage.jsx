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
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  // --- (Fetch Product Logic is Unchanged) ---
  useEffect(() => {
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

  // --- Refactored Loading State ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 
                     flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 
                       rounded-full animate-spin mb-4"></div>
        <p className="text-lg text-slate-600 font-medium">Loading Product...</p>
      </div>
    );
  }

  // --- Refactored Error State ---
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 
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

  if (!product) return null; // Already handled by loading/error

  // Dynamically get the icon for the placeholder
  const ProductIcon = iconMap[product.category] || Zap;

  return (
    // Set base light gradient background
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Image Gallery Column */}
          <div className="space-y-4 sticky top-28">
            {/* Main Image Placeholder (Refactored) */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl aspect-square 
                          flex items-center justify-center relative overflow-hidden border-2 border-slate-100">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <ProductIcon className="w-48 h-48 text-slate-300 relative z-10" />
            </div>
            {/* Thumbnails (Refactored) */}
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`bg-white border-2 rounded-xl aspect-square 
                                       flex items-center justify-center cursor-pointer 
                                       transition-all ${i === 0 ? 'border-blue-500 shadow-md' : 'border-slate-100 hover:border-blue-300'}`}>
                  <ProductIcon className="w-12 h-12 text-slate-300" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details Column */}
          <div className="space-y-6">
            <div>
              <span className="text-sm font-semibold text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                {product.category}
              </span>
              {/* Refactored Title */}
              <h1 className="text-4xl md:text-5xl font-black mt-4 
                             bg-gradient-to-r from-blue-600 to-indigo-600 
                             bg-clip-text text-transparent py-2">
                {product.name}
              </h1>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center">{renderStars(4)}</div>
              <span className="text-slate-600 font-medium">(152 Reviews)</span>
              <span className="text-green-600 font-semibold">| In Stock</span>
            </div>

            {/* Refactored Price */}
            <div className="flex items-baseline space-x-3">
              <span className="text-5xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 
                               bg-clip-text text-transparent">
                ₹{parseFloat(product.rate).toFixed(2)}
              </span>
              <span className="text-2xl text-slate-400 line-through">
                ₹{(parseFloat(product.rate) * 1.5).toFixed(2)}
              </span>
              <span className="text-xl font-bold text-orange-500">(50% OFF)</span>
            </div>

            {/* Dummy Description */}
            <p className="text-lg text-slate-600 leading-relaxed">
              This is a premium quality product designed for modern users. It combines sleek aesthetics with powerful functionality, making it a perfect choice for your daily needs. Experience the best in class.
            </p>
            
            {/* Refactored Quantity Selector */}
            <div className="flex items-center space-x-4 pt-4">
                <label className="font-bold text-slate-700">Quantity:</label>
                <div className="flex items-center rounded-xl overflow-hidden">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 bg-slate-100 hover:bg-slate-200 transition-colors"><Minus size={16} /></button>
                    <span className="font-bold text-lg w-12 text-center bg-white border-y border-slate-100">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="p-3 bg-slate-100 hover:bg-slate-200 transition-colors"><Plus size={16} /></button>
                </div>
            </div>

            {/* Refactored Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
              {/* Primary Button */}
              <button 
                onClick={handleAddToCart} 
                className="flex-1 w-full bg-gradient-to-r from-blue-600 to-indigo-600 
                           hover:from-blue-700 hover:to-indigo-700 
                           text-white font-semibold py-4 px-6 rounded-xl 
                           shadow-lg hover:shadow-xl 
                           transform hover:-translate-y-0.5 transition-all duration-200 
                           flex items-center justify-center gap-2 group"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
              {/* Secondary Button */}
              <button 
                onClick={handleAddToCart} // Should ideally go to checkout, but fine for now
                className="flex-1 w-full bg-slate-800 
                           hover:bg-slate-900
                           text-white font-semibold py-4 px-6 rounded-xl 
                           shadow-lg hover:shadow-xl 
                           transform hover:-translate-y-0.5 transition-all duration-200 
                           flex items-center justify-center gap-2 group"
              >
                <span>Buy Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* --- NEW DUMMY DATA SECTION --- */}
        <div className="mt-16 lg:mt-24 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Details & Reviews */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* About this item Card */}
            {/* <div className="bg-white border-2 border-slate-100 rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">About this item</h2>
              <ul className="space-y-3 text-slate-600 text-lg">
                <li className="flex items-start gap-3"><CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" /><span>High-fidelity audio with deep bass and crisp highs.</span></li>
                <li className="flex items-start gap-3"><CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" /><span>Seamless Bluetooth 5.2 connectivity for stable pairing.</span></li>
                <li className="flex items-start gap-3"><CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" /><span>30-hour battery life with fast-charging case.</span></li>
                <li className="flex items-start gap-3"><CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" /><span>IPX7 waterproof rating, perfect for workouts.</span></li>
              </ul>
            </div> */}
            
            {/* Specifications Card */}
            {/* <div className="bg-white border-2 border-slate-100 rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Specifications</h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                <div className="py-2 border-b border-slate-100"><dt className="text-sm font-medium text-slate-500">Brand</dt><dd className="text-lg font-semibold text-slate-800">SnP Audio</dd></div>
                <div className="py-2 border-b border-slate-100"><dt className="text-sm font-medium text-slate-500">Model</dt><dd className="text-lg font-semibold text-slate-800">WaveBuds Pro</dd></div>
                <div className="py-2 border-b border-slate-100"><dt className="text-sm font-medium text-slate-500">Color</dt><dd className="text-lg font-semibold text-slate-800">Midnight Blue</dd></div>
                <div className="py-2 border-b border-slate-100"><dt className="text-sm font-medium text-slate-500">Form Factor</dt><dd className="text-lg font-semibold text-slate-800">In Ear</dd></div>
                <div className="py-2 border-b border-slate-100"><dt className="text-sm font-medium text-slate-500">Connector</dt><dd className="text-lg font-semibold text-slate-800">USB Type-C</dd></div>
                <div className="py-2 border-b border-slate-100"><dt className="text-sm font-medium text-slate-500">Warranty</dt><dd className="text-lg font-semibold text-slate-800">1 Year</dd></div>
              </dl>
            </div> */}

            {/* Customer Reviews Card */}
            <div className="bg-white border-2 border-slate-100 rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Customer Reviews</h2>
              {/* Dummy Review 1 */}
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
              {/* Dummy Review 2 */}
              <div className="border-b border-slate-100 pb-6 mb-6">
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

          {/* Right Column: Delivery & Seller (Sticky Glassmorphism) */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl 
                          shadow-2xl p-6 border border-white/20 sticky top-28">
              {/* Delivery */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-slate-600">Deliver to</span>
                  <span className="font-semibold text-slate-800">Mumbai - 400001</span>
                </div>
                <p className="font-bold text-green-600">Get it by Tomorrow, 9 PM</p>
                <p className="text-sm text-slate-500">Free Delivery</p>
              </div>
              
              <div className="border-t border-slate-200 pt-4 space-y-4">
                {/* Return Policy */}
                <div className="flex items-center gap-3">
                  <Package className="w-8 h-8 text-blue-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-800">10 Day Replacement</h4>
                    <p className="text-sm text-slate-600">Eligible for free replacement.</p>
                  </div>
                </div>
                {/* Warranty */}
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-8 h-8 text-blue-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-800">1 Year Warranty</h4>
                    <p className="text-sm text-slate-600">From the date of purchase.</p>
                  </div>
                </div>
                {/* Seller */}
                <div className="flex items-center gap-3">
                  <Logo />
                  <div>
                    <h4 className="font-semibold text-slate-800">Sold by SnP Retail</h4>
                    <p className="text-sm text-slate-600">Top-rated seller.</p>
                  </div>
                </div>
              </div>
              
              {/* Secure Transaction */}
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