import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion'; 
import Header from '../components/Header';
import { 
  Star, ShieldCheck, Truck, Zap, Plus, Minus, CheckCircle, Package, 
  MapPin, ShoppingBag, Shirt, Laptop, Gem, Home as HomeIcon, 
  Coins, ArrowRight, UserCircle, MessageSquare, 
  ShoppingCart, Lock, Sparkles 
} from 'lucide-react';
import Logo from '../components/Logo';

// Category Icon Mapping
const iconMap = {
  'Clothing': Shirt,
  'Electronics': Laptop,
  'Jewellery': Gem,
  'Home Appliances': HomeIcon,
  'Footwear': ShoppingBag
};

const ProductPage = () => {
  // --- STATE HOOKS ---
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]); // ML Logic State
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  // --- DATA FETCHING (ML + PRODUCT) ---
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchFullData = async () => {
      setIsLoading(true);
      setError('');
      
      // 1. Fetch Main Product (CRITICAL)
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${productId}`);
        setProduct(data);
      } catch (err) {
        setError('Failed to fetch product details.');
        console.error("Product Fetch Error:", err);
        setIsLoading(false);
        return; 
      }

      // 2. Fetch ML Recommendations (OPTIONAL)
      try {
        const { data: recs } = await axios.get(`http://localhost:5000/api/products/${productId}/recommendations`);
        setRecommendations(recs);
      } catch (err) {
        console.warn("ML Service is offline. Skipping recommendations.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFullData();
  }, [productId]);

  // --- CART LOGIC ---
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
      await axios.post(
        'http://localhost:5000/api/cart',
        { productId: product.product_id, quantity: quantity },
        config
      );
      alert(`${quantity} x "${product.name}" added to cart!`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add item to cart.');
    }
  };

  // --- UI HELPERS ---
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-blue-600 text-blue-600' : 'text-slate-300'}`} />
    ));
  };

  // --- LOADING & ERROR STATES ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-2 border-blue-200 border-t-blue-600 rounded-full mb-4"
        />
        <p className="text-slate-500 font-medium tracking-widest text-xs uppercase">Fetching Product Data...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white border border-red-200 rounded-3xl p-12 text-center shadow-sm max-w-md">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Error Loading Product</h3>
          <p className="text-slate-500 mb-6">{error}</p>
          <button onClick={() => navigate('/')} className="text-blue-600 font-bold hover:underline">Go Back Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* IMAGE SECTION */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 sticky top-28"
          >
            <div className="bg-white rounded-[2.5rem] border border-slate-200 flex items-center justify-center aspect-square overflow-hidden shadow-sm group">
              <img 
                src={`http://localhost:5000${product.image_url}`}
                alt={product.name}
                className="w-full h-full object-contain p-12 group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </motion.div>

          {/* PRODUCT DETAILS SECTION */}
          <div className="space-y-10">
            <div className="space-y-4">
              <span className="inline-block text-[10px] font-bold tracking-[0.2em] text-blue-700 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100 uppercase">
                {product.category}
              </span>
              <h1 className="text-5xl font-bold tracking-tight text-slate-900 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4">
                <div className="flex space-x-1">{renderStars(4)}</div>
                <span className="text-slate-500 text-xs font-bold tracking-widest uppercase">152 Verified Reviews</span>
              </div>
            </div>

            <div className="flex items-baseline space-x-4">
              <span className="text-5xl font-bold text-slate-900">
                ₹{parseFloat(product.rate).toFixed(2)}
              </span>
              <span className="text-xl text-slate-400 line-through">
                ₹{(parseFloat(product.rate) * 1.5).toFixed(2)}
              </span>
              <span className="text-sm font-bold text-orange-600 py-1 px-2 bg-orange-50 rounded-md uppercase">Flat 50% Off</span>
            </div>

            <p className="text-xl text-slate-600 leading-relaxed font-light">
              Premium {product.category.toLowerCase()} experience. Shop through **ShopNPoint** to earn exclusive tokens and unlock future rewards with every successful purchase.
            </p>
            
            {/* QUANTITY & ACTIONS */}
            <div className="space-y-8 pt-6">
                <div className="flex items-center space-x-6">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Quantity</label>
                    <div className="flex items-center bg-white border border-slate-200 rounded-full p-1 shadow-sm">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center hover:text-blue-600"><Minus size={14} /></button>
                        <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                        <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center hover:text-blue-600"><Plus size={14} /></button>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch space-y-4 sm:space-y-0 sm:space-x-4">
                  <button 
                    onClick={handleAddToCart} 
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3"
                  >
                    <ShoppingCart size={20} />
                    <span>Add to Cart</span>
                  </button>
                  <button className="flex-1 bg-slate-900 hover:bg-black text-white font-bold py-5 rounded-2xl transition-all flex items-center justify-center gap-3">
                    <span>Buy Now</span>
                    <ArrowRight size={20} />
                  </button>
                </div>
            </div>
          </div>
        </div>

        {/* --- REVIEWS & SELLER SECTION --- */}
        <div className="mt-32 grid grid-cols-1 lg:grid-cols-3 gap-12 border-t border-slate-200 pt-20">
          <div className="lg:col-span-2 space-y-12">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-10 tracking-tight">Community Feed</h2>
              <div className="space-y-10">
                <div className="border-b border-slate-100 pb-10">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mr-4 border border-slate-200">
                      <UserCircle className="text-slate-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Rahul Sharma</h4>
                      <div className="flex">{renderStars(5)}</div>
                    </div>
                  </div>
                  <p className="text-slate-600 leading-relaxed italic">"Superior quality. The token rewards manifested instantly in my wallet. Truly satisfied."</p>
                </div>
                <div className="pb-4">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mr-4 border border-slate-200">
                      <UserCircle className="text-slate-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Priya Singh</h4>
                      <div className="flex">{renderStars(4)}</div>
                    </div>
                  </div>
                  <p className="text-slate-600 leading-relaxed italic">"Design is top-tier. Shipping was ahead of schedule for my Pune address."</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 sticky top-28 space-y-8 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="text-blue-600" size={20} />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Delivery Target</span>
                </div>
                <p className="text-xl font-bold text-slate-900">Pune, Maharashtra</p>
                <div className="flex items-center gap-2 py-2 px-4 bg-green-50 border border-green-100 rounded-xl w-fit">
                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                   <span className="text-xs font-bold text-green-600 uppercase">Express Available</span>
                </div>
              </div>
              <div className="space-y-6 pt-4 border-t border-slate-100 text-slate-700">
                <div className="flex items-center gap-4">
                  <Package className="text-blue-600" size={24} />
                  <span className="text-sm font-semibold">10-Day Replacement</span>
                </div>
                <div className="flex items-center gap-4">
                  <ShieldCheck className="text-blue-600" size={24} />
                  <span className="text-sm font-semibold">1-Year Warranty</span>
                </div>
              </div>
              <div className="pt-6 border-t border-slate-100 flex items-center gap-2 text-slate-400">
                <Lock size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Encrypted Checkout</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- SMART RECOMMENDATIONS (Restored Light Style) --- */}
        {recommendations.length > 0 && (
          <section className="mt-32 border-t border-slate-200 pt-20">
            <div className="flex items-center gap-4 mb-12">
              <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
                <Sparkles className="text-white w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Smart Picks for You</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
              {recommendations.map((item, index) => (
                <motion.div
                  key={item.product_id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/product/${item.product_id}`} className="group block space-y-4">
                    <div className="aspect-square bg-white rounded-3xl border border-slate-200 overflow-hidden transition-all group-hover:border-blue-500 group-hover:shadow-xl">
                       <img 
                          src={`http://localhost:5000${item.image_url}`} 
                          alt={item.name}
                          className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-500" 
                        />
                    </div>
                    <div className="px-1">
                      <h3 className="text-sm font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">{item.name}</h3>
                      <p className="text-blue-600 font-extrabold mt-1">₹{parseFloat(item.rate).toFixed(2)}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default ProductPage;