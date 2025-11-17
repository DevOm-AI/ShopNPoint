// src/pages/SearchPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import { ShoppingCart, Star, Sparkles, ArrowRight, Search } from 'lucide-react';

const SimpleProductCard = ({ product }) => {
  // ... (This component is correct, no changes needed)
  const mockProduct = {
    ...product,
    id: product.product_id,
    price: parseFloat(product.rate),
    originalPrice: parseFloat(product.rate) * 1.3,
    rating: 4, 
    reviews: Math.floor(Math.random() * 150) + 30,
    isNew: Math.random() > 0.7,
    icon: ShoppingCart
  };

  return (
    <Link to={`/product/${mockProduct.id}`} className="block group h-full">
      <div className="bg-white border-2 border-slate-100 rounded-2xl overflow-hidden 
                    transition-all duration-300 hover:shadow-md hover:-translate-y-1 
                    hover:border-blue-200 relative h-full flex flex-col">
        
        {mockProduct.isNew && (
          <div className="absolute top-4 left-4 z-10 bg-blue-600 
                        text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1
                        shadow-sm">
            <Sparkles className="w-3 h-3" />
            <span>New</span>
          </div>
        )}

        <div className="aspect-square bg-white flex items-center justify-center 
              relative overflow-hidden border-b">
          <img
            src={`http://localhost:5000${product.image_url}`}
            alt={product.name}
            className="w-full h-full object-contain p-4"
          />
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <h3 className="font-semibold text-slate-800 text-lg mb-3 line-clamp-2 
                       group-hover:text-blue-600 transition-colors duration-200 min-h-[3.5rem]">
            {mockProduct.name}
          </h3>

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

          <div className="flex items-baseline gap-2 mb-4">
            <p className="text-2xl font-semibold text-slate-900">
              ₹{mockProduct.price.toFixed(2)}
            </p>
            <p className="text-sm text-slate-400 line-through">
              ₹{mockProduct.originalPrice.toFixed(2)}
            </p>
          </div>
          
          <div className="flex-grow" />

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


const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  const [products, setProducts] = useState([]); // This is correct
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchSearchResults = async () => {
      if (!query) {
        setProducts([]);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError('');
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/search?q=${encodeURIComponent(query)}`);

        // --- THIS IS A DEFENSIVE FIX ---
        // We will make sure 'data' is an array before setting it
        setProducts(Array.isArray(data) ? data : []); 
      } catch (err) {
        setError('Failed to fetch search results. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        
        <div className="mb-12">
          <h1 className="text-3xl font-semibold text-slate-900 mb-4">
            Search Results for:
            <span className="text-blue-600 ml-2">
              "{query}"
            </span>
          </h1>
          <p className="text-lg text-slate-600">
            {isLoading ? 'Searching...' : `Found ${products.length} products.`}
          </p>
        </div>

        {isLoading && (
          // ... (Loading state is correct)
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-lg text-slate-600 font-medium">Loading results...</p>
          </div>
        )}

        {error && (
          // ... (Error state is correct)
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <p className="text-lg text-red-700 font-semibold">{error}</p>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {products.length > 0 ? (
              // --- THIS IS THE SECOND FIX ---
              // Removed the 'viewMode' variable which was causing a crash
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => ( // This is now safe
                  <SimpleProductCard key={product.product_id} product={product} />
                ))}
              </div>
            ) : (
              // "No Results" State (This will now show correctly)
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-12 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-2">No Results Found</h3>
                <p className="text-slate-600 mb-6">
                  We couldn't find any products matching "{query}". Try searching for something else!
                </p>
                <Link 
                  to="/landing"
                  className="inline-flex items-center gap-2 bg-blue-600 
                           text-white px-6 py-3 rounded-xl font-semibold hover:shadow-md 
                           hover:bg-blue-700 transition-all duration-300 group"
                >
                  <span>Back to Home</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default SearchPage;