import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Logo from '../components/Logo';
import { ShoppingCart, Star, TrendingUp, Sparkles, ArrowRight, Filter, Grid, List } from 'lucide-react';
import Header from '../components/Header';

// --- SimpleProductCard (Refactored to match LandingPage's ProductCard) ---
const SimpleProductCard = ({ product }) => {
  // Mock data to match LandingPage's card structure
  const mockProduct = {
    ...product,
    id: product.product_id,
    price: parseFloat(product.rate),
    originalPrice: parseFloat(product.rate) * 1.3, // Keep original logic
    rating: 4, // Mocked
    reviews: Math.floor(Math.random() * 150) + 30, // Mocked
    isNew: Math.random() > 0.7,
    // Using ShoppingCart as the default icon for this category
    icon: ShoppingCart 
  };

  return (
    <Link to={`/product/${mockProduct.id}`} className="block group h-full">
      {/* Added h-full and flex/flex-col */}
      <div className="bg-white border-2 border-slate-100 rounded-2xl overflow-hidden 
                    transition-all duration-300 hover:shadow-md hover:-translate-y-1 
                    hover:border-blue-200 relative h-full flex flex-col">
        
        {/* Consistent "New" Badge */}
        {mockProduct.isNew && (
          <div className="absolute top-4 left-4 z-10 bg-blue-600 
                        text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1
                        shadow-sm">
            <Sparkles className="w-3 h-3" />
            <span>New</span>
          </div>
        )}

        {/* Product Image Placeholder */}
        <div className="aspect-square bg-slate-50
                      flex items-center justify-center relative overflow-hidden group-hover:from-blue-50 
                      transition-all duration-300">
          <mockProduct.icon className="w-20 h-20 text-slate-300 group-hover:text-blue-400 
                                 group-hover:scale-110 transition-all duration-300 relative z-10" />
        </div>

        {/* Product Info (with flex-grow) */}
        <div className="p-5 flex flex-col flex-grow">
          {/* Lighter font */}
          <h3 className="font-semibold text-slate-800 text-lg mb-3 line-clamp-2 
                       group-hover:text-blue-600 transition-colors duration-200 min-h-[3.5rem]">
            {mockProduct.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${i < mockProduct.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} 
                />
              ))}
            </div>
            <span className="text-sm text-slate-600">({mockProduct.reviews})</span>
          </div>

          {/* Price (Minimalist) */}
          <div className="flex items-baseline gap-2 mb-4">
            {/* Smaller, lighter font, no gradient */}
            <p className="text-2xl font-semibold text-slate-900">
              ₹{mockProduct.price.toFixed(2)}
            </p>
            <p className="text-sm text-slate-400 line-through">
              ₹{mockProduct.originalPrice.toFixed(2)}
            </p>
          </div>
          
          {/* Spacer div */}
          <div className="flex-grow" />

          {/* Consistent "Ghost Button" */}
          <div className="w-full bg-blue-100/60 group-hover:bg-blue-600 text-blue-700 group-hover:text-white
                          py-3 rounded-xl font-semibold 
                          transition-all duration-300 
                          flex items-center justify-center gap-2
                          mt-2">
            <span>View Details</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
};

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    // --- THIS IS THE FIX ---
    // Scroll to the top of the page on component mount or category change
    window.scrollTo(0, 0); 
    // --- END OF FIX ---

    const fetchProducts = async () => {
      setIsLoading(true);
      setError('');
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/category/${categoryName}`);
        setProducts(data);
      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName]); // This effect now correctly handles scroll reset

  return (
    // Simplified background
    <div className="min-h-screen bg-slate-50">
      
      {/* Removed Floating Background Elements */}

      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Page Header (Minimalist) */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Browse Collection</span>
          </div>
          
          {/* Lighter, smaller font, no gradient */}
          <h1 className="text-3xl font-semibold text-slate-900 mb-4">
            Shop{" "}
            <span className="text-blue-600">
              {categoryName}
            </span>
          </h1>
          
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Discover our curated collection of premium {categoryName.toLowerCase()} products
          </p>
        </div>

        {/* Filters (Already minimalist, looks good) */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 
                      bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-700">
              {products.length} Products Found
            </span>
          </div>

          <div className="flex items-center gap-3">
            <select className="px-4 py-2 border-2 border-slate-200 rounded-xl text-sm font-medium 
                             text-slate-700 focus:outline-none focus:border-blue-500 
                             transition-colors bg-white">
              <option>Sort by: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest First</option>
            </select>

            <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Loading State (Already minimalist) */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-lg text-slate-600 font-medium">Loading amazing products...</p>
          </div>
        )}

        {/* Error State (Already minimalist) */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <p className="text-lg text-red-700 font-semibold">{error}</p>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && !error && (
          <>
            {products.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {products.map((product) => (
                  <SimpleProductCard key={product.product_id} product={product} />
                ))}
              </div>
            ) : (
              // No Products State (Minimalist)
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-12 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-10 h-10 text-slate-400" />
                </div>
                {/* Lighter font */}
                <h3 className="text-2xl font-semibold text-slate-900 mb-2">No Products Found</h3>
                <p className="text-slate-600 mb-6">
                  We couldn't find any products in this category at the moment.
                </p>
                {/* Solid button */}
                <Link 
                  to="/landing"
                  className="inline-flex items-center gap-2 bg-blue-600 
                           text-white px-6 py-3 rounded-xl font-semibold hover:shadow-md 
                           hover:bg-blue-700 transition-all duration-300 group"
                >
                  <span>Browse Other Categories</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}
          </>
        )}

        {/* Back to Shopping Link (Already minimalist) */}
        {!isLoading && products.length > 0 && (
          <div className="mt-12 text-center">
            <Link 
              to="/landing"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 
                       font-semibold transition-colors group"
            >
              <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default CategoryPage;