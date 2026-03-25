import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, ShoppingCart, Coins, User, Menu, X, ArrowRight,
  Shirt, Laptop, Gem, Home as HomeIcon, ShoppingBag, Star, TrendingUp,
  Zap, Gift, Heart, Phone, Mail, MapPin,
  Award, Shield, Truck, ChevronRight, Settings, Package, LogOut,
  Sparkles,
} from 'lucide-react';
import Logo from '../components/Logo';
import Header from '../components/Header';

const CategoryCard = ({ category }) => {
  const { name, icon: Icon, itemCount } = category;
  return (
    <Link to={`/category/${name}`} className="block group">
      <div className="bg-white border border-gray-200 rounded-xl p-6
                transition-all duration-300 hover:shadow-lg hover:-translate-y-1
                hover:border-blue-600">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 rounded-xl mb-4
                      group-hover:bg-blue-100 transition-colors">
          <Icon className="w-7 h-7 text-blue-600" />
        </div>
        <h3 className="font-medium text-base text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
          {name}
        </h3>
        <p className="text-sm text-gray-500">{itemCount} Products</p>
      </div>
    </Link>
  );
};

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`} className="block group h-full">
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden
                transition-all duration-300 hover:shadow-lg hover:-translate-y-1
                hover:border-blue-600 relative h-full flex flex-col">

        {product.isNew && (
          <div className="absolute top-3 left-3 z-10 bg-blue-600
                        text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1
                        shadow-sm">
            <Sparkles className="w-3 h-3" />
            <span>New</span>
          </div>
        )}

        <div className="aspect-square bg-gray-50 flex items-center justify-center
              relative overflow-hidden">
          <img
            src={`http://localhost:5000${product.image_url}`}
            alt={product.name}
            className="w-full h-full object-contain p-4
             transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <h3 className="font-medium text-gray-900 text-base mb-3 line-clamp-2
                       group-hover:text-blue-600 transition-colors duration-200 min-h-[3rem]">
            {product.name}
          </h3>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${i < product.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">({product.reviews})</span>
          </div>

          <div className="flex items-baseline gap-2 mb-4">
            <p className="text-xl font-semibold text-gray-900">
              ₹{product.price.toFixed(2)}
            </p>
            <p className="text-sm text-gray-400 line-through">
              ₹{product.originalPrice.toFixed(2)}
            </p>
          </div>

          <div className="flex-grow" />

          <div className="w-full bg-blue-600 group-hover:bg-blue-700 text-white
                          py-2.5 rounded-lg font-medium text-sm
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
    { id: 1, name: 'Clothing', icon: Shirt, itemCount: 245 },
    { id: 2, name: 'Electronics', icon: Laptop, itemCount: 189 },
    { id: 3, name: 'Jewellery', icon: Gem, itemCount: 156 },
    { id: 4, name: 'Home Appliances', icon: HomeIcon, itemCount: 203 },
    { id: 5, name: 'Footwear', icon: ShoppingBag, itemCount: 178 }
  ];

  const bannerSlides = [
    {
      title: "Festive Deals on Electronics",
      subtitle: "Save up to 40%",
      description: "Top-rated gadgets from trusted brands.",
      color: "from-blue-50 to-indigo-50",
      icon: Laptop,
      iconColor: "text-blue-600",
      align: "left"
    },
    {
      title: "New Season Fashion",
      subtitle: "Fresh Arrivals Under ₹999",
      description: "Trendy outfits with quality you can trust.",
      color: "from-indigo-50 to-blue-50",
      icon: Shirt,
      iconColor: "text-indigo-600",
      align: "right"
    },
    {
      title: "Home Essentials Week",
      subtitle: "Up to 35% OFF",
      description: "Reliable appliances and cozy decor picks.",
      color: "from-emerald-50 to-blue-50",
      icon: HomeIcon,
      iconColor: "text-emerald-600",
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

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50">

      <Header />

      <div
        className={`fixed inset-0 bg-black/40 z-50 transition-all duration-300 lg:hidden ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          className={`fixed top-0 right-0 h-full w-80 max-w-[85%]
                    bg-white shadow-2xl
                    transform transition-transform duration-300 ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-semibold text-blue-600 mb-8 mt-2">Menu</h2>
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50
                             px-4 py-3 rounded-lg transition-all"
                >
                  {link}
                </a>
              ))}
              <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                <a
                  href="#"
                  className="flex items-center space-x-3 text-base font-medium text-gray-700
                             hover:text-blue-600 hover:bg-gray-50 px-4 py-3 rounded-lg transition-all"
                >
                  <User className="w-5 h-5 text-gray-400" />
                  <span>{userName ? `Hi, ${userName}` : "My Account"}</span>
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-3 text-base font-medium text-gray-700
                             hover:text-blue-600 hover:bg-gray-50 px-4 py-3 rounded-lg transition-all"
                >
                  <Coins className="w-5 h-5 text-gray-400" />
                  <span>My Tokens</span>
                </a>
              </div>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
        <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-2xl shadow-sm mb-12">
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
                    className={`max-w-7xl mx-auto px-6 sm:px-8 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center ${
                      slide.align === "right" ? "md:grid-flow-col-dense" : ""
                    }`}
                  >
                    <div className={`space-y-4 md:space-y-6 transform transition-all duration-700 ease-out
                     ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>

                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight text-gray-900">
                        {slide.title}
                      </h2>
                      <p className="text-lg md:text-xl text-gray-700">{slide.subtitle}</p>
                      <p className={`text-base text-gray-600 max-w-md ${slide.align === "right" ? "md:ml-auto" : ""}`}>
                        {slide.description}
                      </p>

                      <button
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg
                                   text-sm font-medium hover:bg-blue-700
                                   transform hover:-translate-y-0.5 transition-all duration-300 shadow-sm
                                   inline-flex items-center gap-2"
                      >
                        Shop Now
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className={`relative hidden md:flex justify-center items-center h-64 w-full transform transition-all duration-700 ease-out ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                      <slide.icon
                        className={`absolute w-72 h-72 ${slide.iconColor} opacity-10 -rotate-12`}
                      />
                      <slide.icon
                        className={`relative w-56 h-56 ${slide.iconColor} opacity-80 rotate-6
                                    transition-transform duration-700 ease-out
                                    ${isActive ? 'translate-y-0' : 'translate-y-4'}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
            {bannerSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === currentSlide
                    ? "bg-blue-600 w-6"
                    : "bg-gray-400 hover:bg-gray-500"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        <section>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              <span>Explore Categories</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-3">
              Shop by <span className="text-blue-600">Category</span>
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Discover curated products from every category
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-xl p-6 md:p-8
                          transition-all duration-300 hover:shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-semibold mb-2 flex items-center gap-2 text-gray-900">
                <Zap className="w-7 h-7 text-blue-600" />
                <span>Today's Deals</span>
              </h3>
              <p className="text-base md:text-lg text-gray-600">Exclusive offers ending soon</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 px-4 md:px-5 py-3 rounded-lg text-center min-w-[70px]">
                <div className="text-2xl font-semibold text-gray-900">12</div>
                <div className="text-xs text-gray-500">Hours</div>
              </div>
              <div className="text-xl font-semibold text-gray-300">:</div>
              <div className="bg-gray-100 px-4 md:px-5 py-3 rounded-lg text-center min-w-[70px]">
                <div className="text-2xl font-semibold text-gray-900">34</div>
                <div className="text-xs text-gray-500">Mins</div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <TrendingUp className="w-4 h-4" />
              <span>Trending Now</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-3">
              Featured <span className="text-blue-600">Products</span>
            </h2>
          </div>

          <div
            className="flex overflow-x-auto gap-4 md:gap-6 pb-4 snap-x snap-mandatory hide-scrollbar"
            style={{
              scrollBehavior: "smooth",
              WebkitOverflowScrolling: "touch",
            }}
            onMouseEnter={(e) => (e.currentTarget.dataset.pause = "true")}
            onMouseLeave={(e) => (e.currentTarget.dataset.pause = "false")}
            ref={(el) => {
              if (!el) return;
              let scrollPos = 0;

              const autoScroll = () => {
                if (el.dataset.pause === "true") return;
                scrollPos += 0.5;
                el.scrollTo({ left: scrollPos });
                if (scrollPos >= el.scrollWidth - el.clientWidth) scrollPos = 0;
                requestAnimationFrame(autoScroll);
              };

              requestAnimationFrame(autoScroll);
            }}
          >
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="snap-start flex-shrink-0 w-64 md:w-72"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>

        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8
                          transition-all duration-300 hover:shadow-md hover:-translate-y-0.5
                          hover:border-blue-600">
            <Award className="w-10 h-10 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Assured</h3>
            <p className="text-gray-600">Only the best handpicked items for you</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8
                          transition-all duration-300 hover:shadow-md hover:-translate-y-0.5
                          hover:border-blue-600">
            <Shield className="w-10 h-10 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Payments</h3>
            <p className="text-gray-600">Your transactions are completely protected</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8
                          transition-all duration-300 hover:shadow-md hover:-translate-y-0.5
                          hover:border-blue-600 sm:col-span-2 lg:col-span-1">
            <Truck className="w-10 h-10 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Delivery</h3>
            <p className="text-gray-600">Quick and reliable shipping nationwide</p>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-gray-400 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <Logo />
              <p className="text-sm mt-4 text-gray-500">Your premium e-commerce destination</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Shop</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/category/Clothing" className="hover:text-blue-400 transition-colors">Clothing</Link></li>
                <li><Link to="/category/Electronics" className="hover:text-blue-400 transition-colors">Electronics</Link></li>
                <li><Link to="/category/Home Appliances" className="hover:text-blue-400 transition-colors">Home Appliances</Link></li>
                <li><Link to="/category/Jewellery" className="hover:text-blue-400 transition-colors">Jewellery</Link></li>
                <li><Link to="/category/Footwear" className="hover:text-blue-400 transition-colors">Footwear</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Account</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link></li>
                <li><Link to="/tokens" className="hover:text-blue-400 transition-colors">My Tokens</Link></li>
                <li><Link to="/orders" className="hover:text-blue-400 transition-colors">My Orders</Link></li>
                <li><Link to="/cart" className="hover:text-blue-400 transition-colors">Cart</Link></li>
                <li><Link to="/settings" className="hover:text-blue-400 transition-colors">Settings</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Contact</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>support@snp.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+91 123 456 7890</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
            © 2025 SnP E-Commerce. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
