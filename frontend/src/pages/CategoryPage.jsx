import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Logo from '../components/Logo';
import { ShoppingCart, Star, TrendingUp, Sparkles, ArrowRight, Filter, Grid, List } from 'lucide-react';
import Header from '../components/Header';

const SimpleProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product.product_id}`} className="block group">
      <div className="bg-white border-2 border-slate-100 rounded-2xl overflow-hidden 
                    transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 
                    hover:border-blue-200 relative">
        {/* New Badge */}
        {Math.random() > 0.7 && (
          <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-orange-500 to-pink-500 
                        text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1
                        shadow-lg">
            <TrendingUp className="w-3 h-3" />
            <span>Trending</span>
          </div>
        )}

        {/* Product Image Placeholder */}
        <div className="aspect-square bg-gradient-to-br from-slate-50 to-slate-100 
                      flex items-center justify-center relative overflow-hidden group-hover:from-blue-50 
                      group-hover:to-indigo-50 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <ShoppingCart className="w-20 h-20 text-slate-300 group-hover:text-blue-400 
                                 group-hover:scale-110 transition-all duration-300 relative z-10" />
        </div>

        {/* Product Info */}
        <div className="p-5">
          <h3 className="font-bold text-slate-800 text-lg mb-3 line-clamp-2 
                       group-hover:text-blue-600 transition-colors duration-200 min-h-[3.5rem]">
            {product.name}
          </h3>

          {/* Rating (Mock) */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${i < 4 ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} 
                />
              ))}
            </div>
            <span className="text-sm text-slate-600">(4.0)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4">
            <p className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 
                        bg-clip-text text-transparent">
              ₹{parseFloat(product.rate).toFixed(2)}
            </p>
            <p className="text-sm text-slate-400 line-through">
              ₹{(parseFloat(product.rate) * 1.3).toFixed(2)}
            </p>
          </div>

          {/* View Button */}
          <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 
                           hover:from-blue-700 hover:to-indigo-700 
                           text-white py-3 rounded-xl font-semibold 
                           transition-all duration-300 
                           flex items-center justify-center gap-2
                           shadow-lg hover:shadow-xl
                           group-hover:scale-[1.02]">
            <span>View Details</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
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
  }, [categoryName]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Browse Collection</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4">
            Shop{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {categoryName}
            </span>
          </h1>
          
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Discover our curated collection of premium {categoryName.toLowerCase()} products
          </p>
        </div>

        {/* Filters & View Toggle */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 
                      bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-700">
              {products.length} Products Found
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <select className="px-4 py-2 border-2 border-slate-200 rounded-xl text-sm font-medium 
                             text-slate-700 focus:outline-none focus:border-blue-500 
                             transition-colors bg-white">
              <option>Sort by: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest First</option>
            </select>

            {/* View Mode Toggle */}
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

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-lg text-slate-600 font-medium">Loading amazing products...</p>
          </div>
        )}

        {/* Error State */}
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
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-12 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">No Products Found</h3>
                <p className="text-slate-600 mb-6">
                  We couldn't find any products in this category at the moment.
                </p>
                <Link 
                  to="/landing"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 
                           text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg 
                           transition-all duration-300 group"
                >
                  <span>Browse Other Categories</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}
          </>
        )}

        {/* Back to Shopping Link */}
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