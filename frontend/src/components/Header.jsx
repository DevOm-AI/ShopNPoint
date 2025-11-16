// frontend/src/components/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Coins, User, Menu, X, Settings, Package, LogOut, ChevronDown, Sparkles } from 'lucide-react';
import axios from 'axios';
import Logo from './Logo';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUserName(null);
    setIsProfileDropdownOpen(false);
    navigate('/login');
  };

  useEffect(() => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo && userInfo.username) {
        setUserName(userInfo.username);
        
        if (userInfo.token) {
          const fetchCartCount = async () => {
            try {
              const config = {
                headers: {
                  Authorization: `Bearer ${userInfo.token}`,
                },
              };
              const { data } = await axios.get('http://localhost:5000/api/cart', config);
              setCartItemCount(data.items ? data.items.length : 0);
            } catch (err) {
              setCartItemCount(0);
            }
          };
          fetchCartCount();
        }
      }
    } catch (e) { 
      console.error("Could not parse user info."); 
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault(); 
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-lg shadow-md' 
          : 'bg-white/0 backdrop-blur-none shadow-none'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0">
              <Link to="/landing" className="block">
                <Logo />
              </Link>
            </div>

            <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
              <form className="relative w-full group" onSubmit={handleSearchSubmit}>
                <input 
                  type="text" 
                  placeholder="Search for products, brands and more..." 
                  className="w-full px-6 py-3.5 pl-12 rounded-full border-2 border-slate-200 bg-slate-50 
                           focus:border-blue-500 focus:bg-white focus:outline-none focus:shadow-md
                           transition-all duration-300 text-sm placeholder-slate-400
                           hover:border-slate-300 hover:shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 
                                 group-focus-within:text-blue-500 transition-colors duration-300" />
                <button type="submit" className="hidden">Search</button>
              </form>
            </div>

            <div className="flex items-center space-x-1 sm:space-x-2">
              <Link 
                to="/tokens" 
                className="group flex items-center gap-2 px-4 py-2.5 rounded-full
                         text-slate-600 font-medium hover:text-blue-600 hover:bg-blue-100
                         transition-all duration-200"
              >
                <div className="relative">
                  <Coins className="w-5 h-5 transition-transform" />
                  <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-sm hidden sm:block">Tokens</span>
              </Link>

              <Link 
                to="/cart" 
                className="relative group flex items-center gap-2 px-4 py-2.5 rounded-full
                         text-slate-600 font-medium hover:text-blue-600 hover:bg-blue-100
                         transition-all duration-200"
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5 transition-transform" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-600 
                                   text-white text-xs font-bold rounded-full w-5 h-5 
                                   flex items-center justify-center shadow-md
                                   transform transition-transform group-hover:scale-110">
                      {cartItemCount}
                    </span>
                  )}
                </div>
                <span className="text-sm hidden md:block">Cart</span>
              </Link>

              <div className="relative hidden sm:block" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full
                           text-slate-600 font-medium hover:text-blue-600 hover:bg-blue-100
                           transition-all duration-200 group"
                >
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full 
                                flex items-center justify-center 
                                group-hover:bg-blue-600 group-hover:text-white 
                                transition-all duration-200">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-sm hidden lg:block">
                    {userName ? `Hi, ${userName}` : 'Account'}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 hidden lg:block ${
                    isProfileDropdownOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {isProfileDropdownOpen && (
                  <div 
                    className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-lg
                             border border-slate-200 overflow-hidden animate-fade-in-up"
                  >
                    <div className="px-4 py-4 bg-blue-50 border-b border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-full 
                                      flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{userName || 'Guest'}</p>
                          <p className="text-xs text-slate-600">Manage your account</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      <Link 
                        to="/dashboard" 
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-blue-50 
                                 hover:text-blue-600 rounded-xl transition-all duration-200 group"
                      >
                        <div className="w-9 h-9 bg-slate-100 group-hover:bg-blue-100 rounded-lg 
                                      flex items-center justify-center transition-colors">
                          <User className="w-4 h-4 text-slate-600 group-hover:text-blue-600" />
                        </div>
                        <span className="font-medium text-sm">My Profile</span>
                      </Link>

                      <Link 
                        to="/orders" 
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-blue-50 
                                 hover:text-blue-600 rounded-xl transition-all duration-200 group"
                      >
                        <div className="w-9 h-9 bg-slate-100 group-hover:bg-blue-100 rounded-lg 
                                      flex items-center justify-center transition-colors">
                          <Package className="w-4 h-4 text-slate-600 group-hover:text-blue-600" />
                        </div>
                        <span className="font-medium text-sm">My Orders</span>
                      </Link>

                      <Link 
                        to="/settings" 
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-blue-50 
                                 hover:text-blue-600 rounded-xl transition-all duration-200 group"
                      >
                        <div className="w-9 h-9 bg-slate-100 group-hover:bg-blue-100 rounded-lg 
                                      flex items-center justify-center transition-colors">
                          <Settings className="w-4 h-4 text-slate-600 group-hover:text-blue-600" />
                        </div>
                        <span className="font-medium text-sm">Settings</span>
                      </Link>

                      <div className="border-t border-slate-200 my-2"></div>

                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 
                                 rounded-xl transition-all duration-200 group"
                      >
                        <div className="w-9 h-9 bg-red-50 group-hover:bg-red-100 rounded-lg 
                                      flex items-center justify-center transition-colors">
                          <LogOut className="w-4 h-4 text-red-600" />
                        </div>
                        <span className="font-medium text-sm">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2.5 rounded-xl text-slate-700 hover:text-blue-600 
                         hover:bg-blue-50 transition-all duration-200"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="lg:hidden pb-4">
            <form className="relative w-full group" onSubmit={handleSearchSubmit}>
              <input 
                type="text" 
                placeholder="Search products..." 
                className="w-full px-5 py-3 pl-11 rounded-xl border-2 border-slate-200 bg-slate-50 
                         focus:border-blue-500 focus:bg-white focus:outline-none 
                         transition-all duration-300 text-sm placeholder-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 
                               group-focus-within:text-blue-500 transition-colors duration-300" />
              <button type="submit" className="hidden">Search</button>
            </form>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-all duration-300 lg:hidden ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col h-full">
            <div className="bg-blue-600 px-6 py-8 relative overflow-hidden">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors p-2"
              >
                <X className="w-6 h-6" />
              </button>
              
              {userName ? (
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">Hi, {userName}!</p>
                    <p className="text-white/80 text-sm">Welcome back</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">Guest User</p>
                    <Link to="/login" className="text-white/80 text-sm hover:text-white">
                      Sign in to continue
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-2">
              <Link 
                to="/dashboard" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-4 px-4 py-3.5 text-slate-700 hover:bg-blue-50 
                         hover:text-blue-600 rounded-xl transition-all"
              >
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-slate-600" />
                </div>
                <span className="font-semibold">My Profile</span>
              </Link>

              <Link 
                to="/orders" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-4 px-4 py-3.5 text-slate-700 hover:bg-blue-50 
                         hover:text-blue-600 rounded-xl transition-all"
              >
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                  <Package className="w-5 h-5 text-slate-600" />
                </div>
                <span className="font-semibold">My Orders</span>
              </Link>

              {/* --- THIS IS THE FIX --- */}
              <Link 
                to="/tokens" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-4 px-4 py-3.5 text-slate-700 hover:bg-blue-50 
                         hover:text-blue-600 rounded-xl transition-all"
              >
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                  <Coins className="w-5 h-5 text-slate-600" />
                </div>
                <span className="font-semibold">My Tokens</span>
              </Link> 
              {/* --- The typo was </Warning> here --- */}

              <Link 
                to="/settings" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-4 px-4 py-3.5 text-slate-700 hover:bg-blue-50 
                         hover:text-blue-600 rounded-xl transition-all"
              >
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                  <Settings className="w-5 h-5 text-slate-600" />
                </div>
                <span className="font-semibold">Settings</span>
              </Link>

              <div className="border-t border-slate-200 my-4"></div>

              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-4 py-3.5 text-red-600 hover:bg-red-50 
                         rounded-xl transition-all"
              >
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-red-600" />
                </div>
                <span className="font-semibold">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.2s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default Header;