import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, ShoppingCart, Coins, User, Menu, X, ArrowRight,
  Shirt, Laptop, Gem, Home as HomeIcon, ShoppingBag, Star, TrendingUp,
  Zap, Gift, Heart, Phone, Mail, MapPin,
  Award, Shield, Truck, ChevronRight, Settings, Package, LogOut,
  Sparkles, // Added for headers
} from 'lucide-react';
import Logo from '../components/Logo';
import Header from '../components/Header'; 

// --- We will define these components locally ---
// import CategoryCard from '../components/CategoryCard';
// import ProductCard from '../components/ProductCard';


// --- NEW: CategoryCard Component (Styled to match design system) ---
const CategoryCard = ({ category }) => {
  const { name, icon: Icon, itemCount } = category;
  return (
    <Link to={`/category/${name}`} className="block group">
      <div className="bg-white border-2 border-slate-100 rounded-2xl p-6 
                    transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 
                    hover:border-blue-200 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br 
                      from-blue-100 to-indigo-100 rounded-2xl mb-4
                      group-hover:from-blue-100 group-hover:to-indigo-200 transition-all">
          <Icon className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="font-bold text-lg text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">
          {name}
        </h3>
        <p className="text-sm text-slate-500">{itemCount} Products</p>
      </div>
    </Link>
  );
};

// --- NEW: ProductCard Component (Styled like SimpleProductCard) ---
const ProductCard = ({ product }) => {
  return (
    <div className="block group">
      <div className="bg-white border-2 border-slate-100 rounded-2xl overflow-hidden 
                    transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 
                    hover:border-blue-200 relative">
        {/* Badge */}
        {product.isNew && (
          <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-blue-600 to-indigo-600 
                        text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1
                        shadow-lg">
            <Sparkles className="w-3 h-3" />
            <span>New</span>
          </div>
        )}

        {/* Product Image Placeholder */}
        <div className="aspect-square bg-gradient-to-br from-slate-50 to-slate-100 
                      flex items-center justify-center relative overflow-hidden group-hover:from-blue-50 
                      group-hover:to-indigo-50 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <product.icon className="w-20 h-20 text-slate-300 group-hover:text-blue-400 
                                 group-hover:scale-110 transition-all duration-300 relative z-10" />
        </div>

        {/* Product Info */}
        <div className="p-5">
          <h3 className="font-bold text-slate-800 text-lg mb-3 line-clamp-2 
                       group-hover:text-blue-600 transition-colors duration-200 min-h-[3.5rem]">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${i < product.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} 
                />
              ))}
            </div>
            <span className="text-sm text-slate-600">({product.reviews})</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4">
            <p className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 
                        bg-clip-text text-transparent">
              ₹{product.price.toFixed(2)}
            </p>
            <p className="text-sm text-slate-400 line-through">
              ₹{product.originalPrice.toFixed(2)}
            </p>
          </div>
          
          {/* Tokens */}
          <div className="px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg inline-flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold text-amber-700">Earn {product.tokens} Tokens</span>
          </div>
        </div>
      </div>
    </div>
  );
};


const LandingPage = () => {
  // --- (All State and Logic is Unchanged) ---
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [userName, setUserName] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const categories = [
    { id: 1, name: 'Clothing', icon: Shirt, itemCount: '5+' },
    { id: 2, name: 'Electronics', icon: Laptop, itemCount: '5+' },
    { id: 3, name: 'Jewellery', icon: Gem, itemCount: '5+' },
    { id: 4, name: 'Home Appliances', icon: HomeIcon, itemCount: '5+' },
    { id: 5, name: 'Footwear', icon: ShoppingBag, itemCount: '5+' }
  ];

  const bannerSlides = [
    { title: "Festive Deals on Electronics", subtitle: "Save up to 40%", description: "Top-rated gadgets from trusted brands.", color: "from-blue-600 to-indigo-700", icon: Laptop, align: "left" },
    { title: "New Season Fashion", subtitle: "Fresh Arrivals Under ₹999", description: "Trendy outfits with quality you can trust.", color: "from-purple-600 to-pink-600", icon: Shirt, align: "right" },
    { title: "Home Essentials Week", subtitle: "Up to 35% OFF", description: "Reliable appliances and cozy decor picks.", color: "from-green-600 to-teal-700", icon: HomeIcon, align: "left" }
  ];
  
  const navLinks = ["Home", "Shop", "Categories", "Deals", "Contact"];

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUserName(null);
    setIsProfileDropdownOpen(false);
    navigate('/login');
  };

  useEffect(() => {
    setMounted(true);
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo && userInfo.username) {
        setUserName(userInfo.username);
      }
    } catch (e) { console.error("Could not parse user info."); }
    
    const fetchFeaturedProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products/featured');
        const transformedProducts = data.map(product => {
            const iconMap = { 'Clothing': Shirt, 'Electronics': Laptop, 'Jewellery': Gem, 'Home Appliances': HomeIcon, 'Footwear': ShoppingBag };
            return {
                ...product,
                id: product.product_id,
                price: parseFloat(product.rate),
                originalPrice: parseFloat(product.rate) * 1.5,
                discount: 33,
                rating: 4 + Math.round(Math.random()),
                reviews: Math.floor(Math.random() * 200) + 50,
                icon: iconMap[product.category] || ShoppingBag,
                isNew: Math.random() > 0.6,
                tokens: Math.floor(parseFloat(product.rate) / 50)
            };
        });
        setFeaturedProducts(transformedProducts);
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      }
    };
    fetchFeaturedProducts();

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  // --- (End of Unchanged Logic) ---

  if (!mounted) return null;

  return (
  // Refactored Page Background
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 text-slate-900">
    {/* Floating Background Elements */}
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
    </div>
    
    {/* Header (Imported) - All logic in this file still works with it */}
    <Header />

    {/* Mobile Menu Overlay (Refactored) */}
    <div
      className={`fixed inset-0 bg-black/50 z-50 transition-all duration-300 ${
        isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={() => setIsMobileMenuOpen(false)}
    >
      {/* Glassmorphism Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-4/5 max-w-sm 
                  bg-white/90 backdrop-blur-xl shadow-2xl border-l border-white/20
                  transform transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold text-blue-600 mb-8 mt-2">Menu</h2>
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="text-base font-medium text-slate-700 hover:text-blue-600 
                           px-3 py-2 rounded-lg transition-all"
              >
                {link}
              </a>
            ))}
            <div className="border-t border-slate-200 pt-4 mt-4 space-y-2">
              <a
                href="#"
                className="flex items-center space-x-3 text-base font-medium text-slate-700 
                           hover:text-blue-600 px-3 py-2 rounded-lg"
              >
                <User className="w-5 h-5 text-slate-500" />
                <span>{userName ? `Hi, ${userName}` : "My Account"}</span>
              </a>
              <a
                href="#"
                className="flex items-center space-x-3 text-base font-medium text-slate-700 
                           hover:text-blue-600 px-3 py-2 rounded-lg"
              >
                <Coins className="w-5 h-5 text-slate-500" />
                <span>My Tokens</span>
              </a>
            </div>
          </nav>
        </div>
      </div>
    </div>

    {/* Hero Banner (Refactored) */}
    <div className="relative h-[550px] overflow-hidden rounded-3xl shadow-2xl mb-16 max-w-7xl mx-auto">
      {bannerSlides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <div
            className={`h-full w-full bg-gradient-to-br ${slide.color} flex items-center justify-center`}
          >
            <div
              className={`max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center ${
                slide.align === "right" ? "md:grid-flow-col-dense" : ""
              }`}
            >
              <div
                className={`text-white space-y-5 ${
                  slide.align === "right" ? "md:text-right" : "text-left"
                }`}
              >
                <h2 className="text-4xl md:text-5xl font-black leading-tight">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-xl opacity-90">{slide.subtitle}</p>
                <p className={`text-base opacity-80 max-w-md ${slide.align === "right" ? "ml-auto" : ""}`}>
                  {slide.description}
                </p>

                {/* Refactored Button */}
                <button 
                  className="bg-white text-slate-900 px-8 py-3 rounded-xl 
                             text-sm font-semibold hover:bg-slate-50 
                             transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg"
                >
                  Shop Now
                </button>
              </div>

              <div className="relative flex justify-center items-center">
                <div className="absolute w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
                <slide.icon className="w-40 h-40 text-white relative z-10" />
              </div>
            </div>
          </div>
        </div>
      ))}
      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {bannerSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2.5 w-2.5 rounded-full transition-all ${
              index === currentSlide
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>

    {/* Main (Refactored) */}
    <main className="max-w-7xl mx-auto px-4 py-16 space-y-20 relative z-10">
      {/* Categories */}
      <section>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Top Picks</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            Shop by{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Category
            </span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Explore curated products from every niche.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Flash Deals (Refactored) */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl 
                        p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-white/5"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center">
          <div>
            <h3 className="text-3xl font-bold mb-2 flex items-center space-x-2">
              <Zap className="w-8 h-8" />
              <span>Flash Deals</span>
            </h3>
            <p className="text-lg opacity-90">Exclusive offers, ending soon!</p>
          </div>
          <div className="flex items-center space-x-3 mt-6 md:mt-0">
            <div className="bg-white/10 px-5 py-3 rounded-xl text-center">
              <div className="text-3xl font-bold">12</div>
              <div className="text-xs opacity-80">Hours</div>
            </div>
            <div className="text-2xl font-bold opacity-50">:</div>
            <div className="bg-white/10 px-5 py-3 rounded-xl text-center">
              <div className="text-3xl font-bold">34</div>
              <div className="text-xs opacity-80">Mins</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="text-center mb-12">
           <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <TrendingUp className="w-4 h-4" />
            <span>Don't Miss Out</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            Featured{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Products
            </span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`} className="group">
              <ProductCard product={product} />
            </Link>
          ))}
        </div>
      </section>

      {/* Highlights (Refactored) */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="bg-white border-2 border-slate-100 rounded-2xl p-8 
                        transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 
                        hover:border-blue-200">
          <Award className="w-8 h-8 text-blue-600 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-1">Quality Assured</h3>
          <p className="text-slate-600">Only the best handpicked items.</p>
        </div>
        <div className="bg-white border-2 border-slate-100 rounded-2xl p-8 
                        transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 
                        hover:border-blue-200">
          <Shield className="w-8 h-8 text-blue-600 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-1">Secure Payments</h3>
          <p className="text-slate-600">Your transactions are protected.</p>
        </div>
        <div className="bg-white border-2 border-slate-100 rounded-2xl p-8 
                        transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 
                        hover:border-blue-200">
          <Truck className="w-8 h-8 text-blue-600 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-1">Fast Delivery</h3>
          <p className="text-slate-600">Reliable and quick shipping.</p>
        </div>
      </section>
    </main>

    {/* Footer (Refactored) */}
    <footer className="bg-slate-900 text-slate-400 py-10 mt-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <Logo /> {/* Assuming Logo component handles its own dark-mode styling */}
          <p className="text-sm mt-4">Your premium e-commerce destination.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm uppercase">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-blue-400 transition-colors">Clothing</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Electronics</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Home</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm uppercase">About</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Admin Portal</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm uppercase">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center"><Mail className="w-4 h-4 mr-2" /> support@snp.com</li>
            <li className="flex items-center"><Phone className="w-4 h-4 mr-2" /> +91 123 456 7890</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-700 mt-8 pt-6 text-center text-xs text-slate-500">
        © 2025 SnP E-Commerce. All rights reserved.
      </div>
    </footer>
  </div>
);

};

export default LandingPage;