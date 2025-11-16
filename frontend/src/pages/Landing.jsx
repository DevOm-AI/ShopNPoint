import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Link is already imported
import {
  Search, ShoppingCart, Coins, User, Menu, X, ArrowRight,
  Shirt, Laptop, Gem, Home as HomeIcon, ShoppingBag, Star, TrendingUp,
  Zap, Gift, Heart, Phone, Mail, MapPin,
  Award, Shield, Truck, ChevronRight, Settings, Package, LogOut,
  Sparkles,
} from 'lucide-react';
import Logo from '../components/Logo';
import Header from '../components/Header'; 

// --- CategoryCard (Minimalist) ---
const CategoryCard = ({ category }) => {
  const { name, icon: Icon, itemCount } = category;
  return (
    <Link to={`/category/${name}`} className="block group">
      {/* Softer hover shadow */}
      <div className="bg-white border-2 border-slate-100 rounded-2xl p-6 
                    transition-all duration-300 hover:shadow-md hover:-translate-y-1 
                    hover:border-blue-200 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4
                      group-hover:bg-blue-100 transition-all">
          <Icon className="w-8 h-8 text-blue-600" />
        </div>
        {/* Lighter font-semibold */}
        <h3 className="font-semibold text-lg text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">
          {name}
        </h3>
        <p className="text-sm text-slate-500">{itemCount} Products</p>
      </div>
    </Link>
  );
};

// --- ProductCard (Minimalist) ---
const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`} className="block group h-full">
      <div className="bg-white border-2 border-slate-100 rounded-2xl overflow-hidden 
                    transition-all duration-300 hover:shadow-md hover:-translate-y-1 
                    hover:border-blue-200 relative h-full flex flex-col">
        
        {product.isNew && (
          <div className="absolute top-4 left-4 z-10 bg-blue-600 
                        text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1
                        shadow-sm">
            <Sparkles className="w-3 h-3" />
            <span>New</span>
          </div>
        )}

        <div className="aspect-square bg-slate-50
                      flex items-center justify-center relative overflow-hidden group-hover:from-blue-50 
                      transition-all duration-300">
          <product.icon className="w-20 h-20 text-slate-300 group-hover:text-blue-400 
                                 group-hover:scale-110 transition-all duration-300 relative z-10" />
        </div>

        <div className="p-5 flex flex-col flex-grow">
          {/* Lighter font-semibold */}
          <h3 className="font-semibold text-slate-800 text-lg mb-3 line-clamp-2 
                       group-hover:text-blue-600 transition-colors duration-200 min-h-[3.5rem]">
            {product.name}
          </h3>

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

          <div className="flex items-baseline gap-2 mb-4">
            {/* Smaller, lighter price */}
            <p className="text-2xl font-semibold text-slate-900">
              ₹{product.price.toFixed(2)}
            </p>
            <p className="text-sm text-slate-400 line-through">
              ₹{product.originalPrice.toFixed(2)}
            </p>
          </div>
          
          <div className="flex-grow" />

          {/* Button font is fine, it's a CTA */}
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
    { 
      title: "Festive Deals on Electronics", 
      subtitle: "Save up to 40%", 
      description: "Top-rated gadgets from trusted brands.", 
      color: "from-blue-100 to-indigo-100", // Kept light
      icon: Laptop, 
      iconColor: "text-blue-500", // Added
      align: "left" 
    },
    { 
      title: "New Season Fashion", 
      subtitle: "Fresh Arrivals Under ₹999", 
      description: "Trendy outfits with quality you can trust.", 
      color: "from-purple-100 to-pink-100", // Kept light
      icon: Shirt, 
      iconColor: "text-purple-500", // Added
      align: "right" 
    },
    { 
      title: "Home Essentials Week", 
      subtitle: "Up to 35% OFF", 
      description: "Reliable appliances and cozy decor picks.", 
      color: "from-green-100 to-teal-100", // Kept light
      icon: HomeIcon, 
      iconColor: "text-green-500", // Added
      align: "left" 
    }
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
  <div className="min-h-screen bg-slate-50 text-slate-900">
    
    <Header />

    {/* Mobile Menu (light fonts) */}
    <div
      className={`fixed inset-0 bg-black/50 z-50 transition-all duration-300 ${
        isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={() => setIsMobileMenuOpen(false)}
    >
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
          {/* Lighter font */}
          <h2 className="text-2xl font-semibold text-blue-600 mb-8 mt-2">Menu</h2>
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                // font-medium is good here, not too bold
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

    {/* --- Hero Banner (Refactored for "Interesting" Visuals) --- */}
    <div className="relative h-[500px] overflow-hidden rounded-3xl shadow-md mb-16 max-w-7xl mx-auto border-2 border-slate-100">
      {bannerSlides.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <div
              className={`h-full w-full bg-gradient-to-br ${slide.color} flex items-center justify-center overflow-hidden`}
            >
              <div
                className={`max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center ${
                  slide.align === "right" ? "md:grid-flow-col-dense" : ""
                }`}
              >
                {/* Text slides in from the left */}
                <div
                  className={`text-slate-900 space-y-5 transform transition-all duration-700 ease-out ${
                    slide.align === "right" ? "md:text-right" : "text-left"
                  } ${isActive ? 'opacity-100 translate-x-0 delay-200' : 'opacity-0 -translate-x-10'}`}
                >
                  <h2 className="text-4xl font-semibold leading-tight">
                    {slide.title}
                  </h2>
                  <p className="text-lg text-slate-700">{slide.subtitle}</p>
                  <p className={`text-base text-slate-600 max-w-md ${slide.align === "right" ? "ml-auto" : ""}`}>
                    {slide.description}
                  </p>
                  
                  <button 
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl 
                               text-sm font-semibold hover:bg-blue-700 
                               transform hover:-translate-y-0.5 transition-all duration-300 shadow-md"
                  >
                    Shop Now
                  </button>
                </div>
                
                {/* Icon visual slides in from the right */}
                <div className={`relative flex justify-center items-center h-64 w-full transform transition-all duration-700 ease-out ${isActive ? 'opacity-100 translate-x-0 delay-400' : 'opacity-0 translate-x-10'}`}>
                  
                  {/* --- NEW: Duotone Background Icon --- */}
                  <slide.icon 
                    className={`absolute w-72 h-72 ${slide.iconColor} opacity-20 -rotate-12 transform-gpu`} 
                    style={{ filter: 'blur(1px)' }}
                  />
                  {/* --- NEW: Main Icon (Larger) --- */}
                  <slide.icon 
                    className={`relative w-64 h-64 ${slide.iconColor} opacity-90 rotate-6 transform-gpu`} 
                  />

                </div>
              </div>
            </div>
          </div>
        );
      })}
      
      {/* Dots (Unchanged) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {bannerSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2.5 w-2.5 rounded-full transition-all ${
              index === currentSlide
                ? "bg-blue-600 scale-125"
                : "bg-slate-400 hover:bg-slate-500"
            }`}
          />
        ))}
      </div>
    </div>


    {/* Main (Minimalist) */}
    <main className="max-w-7xl mx-auto px-4 py-16 space-y-20 relative z-10">
      {/* Categories */}
      <section>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Top Picks</span>
          </div>
          {/* Smaller, lighter font */}
          <h2 className="text-3xl font-semibold text-slate-900 mb-4">
            Shop by{" "}
            <span className="text-blue-600">
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

      {/* "Today's Deals" (Minimalist) */}
      <section className="bg-white border-2 border-slate-100 rounded-2xl p-8
                        transition-all duration-300 hover:shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            {/* Smaller, lighter font */}
            <h3 className="text-2xl font-semibold mb-2 flex items-center space-x-2 text-slate-900">
              <Zap className="w-7 h-7 text-blue-600" />
              <span>Today's Deals</span>
            </h3>
            <p className="text-lg text-slate-600">Exclusive offers, ending soon!</p>
          </div>
          <div className="flex items-center space-x-3 mt-6 md:mt-0">
            <div className="bg-slate-100 px-5 py-3 rounded-xl text-center">
              {/* Smaller, lighter font */}
              <div className="text-2xl font-semibold text-slate-900">12</div>
              <div className="text-xs text-slate-500">Hours</div>
            </div>
            <div className="text-2xl font-semibold text-slate-300">:</div>
            <div className="bg-slate-100 px-5 py-3 rounded-xl text-center">
              {/* Smaller, lighter font */}
              <div className="text-2xl font-semibold text-slate-900">34</div>
              <div className="text-xs text-slate-500">Mins</div>
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
          {/* Smaller, lighter font */}
          <h2 className="text-3xl font-semibold text-slate-900 mb-4">
            Featured{" "}
            <span className="text-blue-600">
              Products
            </span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Highlights (Minimalist) */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="bg-white border-2 border-slate-100 rounded-2xl p-8 
                        transition-all duration-300 hover:shadow-md hover:-translate-y-1 
                        hover:border-blue-200">
          <Award className="w-8 h-8 text-blue-600 mb-4" />
          {/* Smaller, lighter font */}
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Quality Assured</h3>
          <p className="text-slate-600">Only the best handpicked items.</p>
        </div>
        <div className="bg-white border-2 border-slate-100 rounded-2xl p-8 
                        transition-all duration-300 hover:shadow-md hover:-translate-y-1 
                        hover:border-blue-200">
          <Shield className="w-8 h-8 text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Secure Payments</h3>
          <p className="text-slate-600">Your transactions are protected.</p>
        </div>
        <div className="bg-white border-2 border-slate-100 rounded-2xl p-8 
                        transition-all duration-300 hover:shadow-md hover:-translate-y-1 
                        hover:border-blue-200">
          <Truck className="w-8 h-8 text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Fast Delivery</h3>
          <p className="text-slate-600">Reliable and quick shipping.</p>
        </div>
      </section>
    </main>

    {/* --- Footer (MODIFIED) --- */}
    <footer className="bg-slate-900 text-slate-400 py-10 mt-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <Logo />
          <p className="text-sm mt-4">Your premium e-commerce destination.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm uppercase">Shop</h4>
          {/* --- MODIFIED: Replaced <a> with <Link> --- */}
          <ul className="space-y-2 text-sm">
            <li><Link to="/category/Clothing" className="hover:text-blue-400 transition-colors">Clothing</Link></li>
            <li><Link to="/category/Electronics" className="hover:text-blue-400 transition-colors">Electronics</Link></li>
            <li><Link to="/category/Home Appliances" className="hover:text-blue-400 transition-colors">Home Appliances</Link></li>
            <li><Link to="/category/Jewellery" className="hover:text-blue-400 transition-colors">Jewellery</Link></li>
            <li><Link to="/category/Footwear" className="hover:text-blue-400 transition-colors">Footwear</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm uppercase">Pages</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link></li>
            <li><Link to="/tokens" className="hover:text-blue-400 transition-colors">My Tokens</Link></li>
            <li><Link to="/orders" className="hover:text-blue-400 transition-colors">My Orders</Link></li>
            <li><Link to="/cart" className="hover:text-blue-400 transition-colors">Cart</Link></li>
            <li><Link to="/settings" className="hover:text-blue-400 transition-colors">Settings</Link></li>
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