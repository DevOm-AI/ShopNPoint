import React, { useState, useEffect } from 'react';
import { 
  Coins, 
  Award, 
  TrendingUp, 
  Clock, 
  User, 
  Calendar, 
  ArrowRight, 
  RefreshCw, 
  Gift, 
  Star,
  Sparkles // Added for header
} from 'lucide-react';
import Header from '../components/Header'; // Added Header

// --- TokenCard Component (Refactored) ---
const TokenCard = ({ title, value, icon: Icon, color, trend, subtitle }) => {
  return (
    // Applied standard card styling from SimpleProductCard
    <div className="bg-white border-2 border-slate-100 rounded-2xl overflow-hidden 
                  transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 
                  hover:border-blue-200 relative p-6 group">
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          {/* Icon styling remains */}
          <div className={`p-3 rounded-xl ${color} shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {/* Trend styling remains */}
          {trend && (
            <div className="flex items-center text-green-600 text-sm font-semibold">
              <TrendingUp className="w-4 h-4 mr-1" />
              {trend}
            </div>
          )}
        </div>
        
        <div className="mb-2">
          {/* Text colors standardized to dark */}
          <h3 className="text-3xl font-black text-slate-900">{value}</h3>
          <p className="text-slate-600 font-medium mt-1">{title}</p>
          {subtitle && (
            <p className="text-slate-500 text-sm mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// --- UsageItem Component (Refactored) ---
const UsageItem = ({ icon: Icon, activity, tokens, time, type, details }) => {
  const isPurchase = type === 'purchase';
  const isReferral = type === 'referral';
  
  return (
    // Applied standard card styling, matching CartItem
    <div className="p-6 bg-white border-2 border-slate-100 rounded-2xl 
                  hover:shadow-xl hover:border-blue-200 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          {/* Icon container styling remains */}
          <div className={`p-3 rounded-lg transition-colors duration-300 ${
            isPurchase 
              ? 'bg-red-50 group-hover:bg-red-100' 
              : 'bg-green-50 group-hover:bg-green-100'
          }`}>
            <Icon className={`w-6 h-6 transition-colors duration-300 ${
              isPurchase 
                ? 'text-red-600' 
                : 'text-green-600'
            }`} />
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2">
              {/* Text colors standardized */}
              <p className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition-colors">
                {activity}
              </p>
              <div className="text-left sm:text-right mt-1 sm:mt-0">
                <p className={`font-bold text-xl ${isPurchase ? 'text-red-600' : 'text-green-600'}`}>
                  {isPurchase ? '-' : '+'}{tokens}
                </p>
                <p className="text-xs text-slate-500">tokens</p>
              </div>
            </div>
            
            {/* Details section styling is fine */}
            {isPurchase && details && (
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg mb-3">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <span className="text-slate-500">Order:</span>
                    <span className="font-semibold text-blue-600 ml-1">{details.orderNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Product:</span>
                    <span className="font-semibold text-slate-800 ml-1">{details.productName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Original Price:</span>
                    <span className="font-semibold text-slate-600 ml-1 line-through">₹{details.originalPrice}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Final Price:</span>
                    <span className="font-semibold text-green-600 ml-1">₹{details.finalPrice}</span>
                  </div>
                </div>
              </div>
            )}
            
            {isReferral && details && (
              <div className="bg-green-50 border border-green-200 p-3 rounded-lg mb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-slate-600">Referred User: </span>
                    <span className="font-bold text-blue-600">{details.referredUser}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-slate-500">{details.bonusType}</span>
                  </div>
                </div>
              </div>
            )}
            
            <p className="text-sm text-slate-500 flex items-center">
              <Clock className="w-4 h-4 mr-1.5" />
              {time}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- TokensPage Component (Refactored) ---
const TokensPage = () => {
  const [mounted, setMounted] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // --- (Sample data is Unchanged) ---
  const tokenStats = {
    totalTokens: 2500,
    usedTokens: 1200,
    earnedTokens: 350,
    remainingTokens: 1650
  };

  const recentUsage = [
    { icon: Gift, activity: 'Product Purchase', tokens: 150, time: '2 hours ago', type: 'purchase', details: { orderNumber: '#ORD-2024-001', productName: 'Wireless Headphones', originalPrice: 299, finalPrice: 149 } },
    { icon: Gift, activity: 'Product Purchase', tokens: 89, time: '5 hours ago', type: 'purchase', details: { orderNumber: '#ORD-2024-002', productName: 'Smart Watch', originalPrice: 199, finalPrice: 110 } },
    { icon: Award, activity: 'Referral Reward', tokens: 100, time: '1 day ago', type: 'referral', details: { referredUser: '@alex_kumar', bonusType: 'New User Signup' } },
    { icon: Gift, activity: 'Product Purchase', tokens: 200, time: '2 days ago', type: 'purchase', details: { orderNumber: '#ORD-2024-003', productName: 'Gaming Mouse & Keyboard Set', originalPrice: 459, finalPrice: 259 } },
    { icon: Award, activity: 'Referral Reward', tokens: 75, time: '3 days ago', type: 'referral', details: { referredUser: '@priya_sharma', bonusType: 'First Purchase Bonus' } },
  ];

  // --- (handleRefresh logic is Unchanged) ---
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  if (!mounted) return null; // Keep for smooth initial load

  return (
    // Set base light gradient background
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Floating Background Elements from CategoryPage */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* Header component */}
      <Header />
      
      {/* Main content wrapper from CategoryPage */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        
        {/* Page Header from CategoryPage */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Coins className="w-4 h-4" />
            <span>Your Token Wallet</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4">
            Token
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {" "}Dashboard
            </span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Track your earnings, review your spending, and redeem your rewards.
          </p>
        </div>

        {/* Token Stats Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 transition-all duration-700 ${
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <TokenCard
            title="Total Tokens"
            value={tokenStats.totalTokens.toLocaleString()}
            icon={Coins}
            color="bg-blue-500" // Kept original icon colors
            trend="+12%"
            subtitle="All time earned"
          />
          <TokenCard
            title="Used Tokens"
            value={tokenStats.usedTokens.toLocaleString()}
            icon={TrendingUp}
            color="bg-red-500"
            subtitle="Total spent"
          />
          <TokenCard
            title="Earned This Month"
            value={tokenStats.earnedTokens.toLocaleString()}
            icon={Award}
            color="bg-green-500"
            trend="+25%"
            subtitle="Recent earnings"
          />
          <TokenCard
            title="Available Balance"
            value={tokenStats.remainingTokens.toLocaleString()}
            icon={Star} // Changed from Gift to Star
            color="bg-orange-500"
            subtitle="Ready to use"
          />
        </div>

        {/* Usage History Section Header (Styled like CategoryPage filter bar) */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 
                      bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
            Token Usage History
          </h2>
          {/* Refresh Button (Styled as secondary button) */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 border-2 border-slate-200 rounded-xl text-sm font-medium
                       text-slate-700 focus:outline-none focus:border-blue-500
                       transition-colors bg-white hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* New Layout: Main Content + Sticky Summary */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Column 1: Usage List & Actions */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Usage List */}
            <div className="space-y-4">
              {recentUsage.map((item, index) => (
                <div 
                  key={index} 
                  className={`transform transition-all duration-500 ${
                    mounted ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <UsageItem
                    icon={item.icon}
                    activity={item.activity}
                    tokens={item.tokens}
                    time={item.time}
                    type={item.type}
                    details={item.details}
                  />
                </div>
              ))}
            </div>

            {/* Action Buttons (Primary Gradient Style) */}
            <div className="flex flex-col md:flex-row gap-4 pt-6">
              <button className="group flex-1 w-full bg-gradient-to-r from-blue-600 to-indigo-600 
                               hover:from-blue-700 hover:to-indigo-700 
                               text-white font-semibold py-4 px-6 rounded-xl 
                               shadow-lg hover:shadow-xl 
                               transform hover:-translate-y-0.5 transition-all duration-200 
                               flex items-center justify-center gap-2">
                <Gift className="w-5 h-5" />
                <span>Redeem Tokens</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="group flex-1 w-full bg-gradient-to-r from-blue-600 to-indigo-600 
                               hover:from-blue-700 hover:to-indigo-700 
                               text-white font-semibold py-4 px-6 rounded-xl 
                               shadow-lg hover:shadow-xl 
                               transform hover:-translate-y-0.5 transition-all duration-200 
                               flex items-center justify-center gap-2">
                <Coins className="w-5 h-5" />
                <span>Earn More Tokens</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Footer Links */}
            <div className="text-center pt-6 border-t border-slate-200 mt-8">
              <div className="flex justify-center space-x-6 text-sm text-slate-500">
                <button className="hover:text-blue-600 transition-colors duration-200">Token Terms</button>
                <span className="text-slate-300">•</span>
                <button className="hover:text-blue-600 transition-colors duration-200">Earning Guide</button>
                <span className="text-slate-300">•</span>
                <button className="hover:text-blue-600 transition-colors duration-200">Redeem Help</button>
              </div>
            </div>
          </div>

          {/* Column 2: Sticky Summary Card (Glassmorphism Style) */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl 
                          shadow-2xl p-8 border border-white/20 sticky top-6">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Monthly Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="text-slate-600">Earned:</span>
                  <span className="font-semibold text-green-600">
                    +{tokenStats.earnedTokens} tokens
                  </span>
                </div>
                <div className="flex justify-between items-center text-lg">
                  <span className="text-slate-600">Used:</span>
                  <span className="font-semibold text-red-600">
                    -{tokenStats.usedTokens} tokens
                  </span>
                </div>
                
                {/* Total with Gradient Text */}
                <div className="border-t border-slate-200 pt-4 flex 
                              justify-between items-center text-3xl font-bold mt-4">
                  <span className="text-slate-900">Balance:</span>
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 
                                 bg-clip-text text-transparent">
                    {tokenStats.remainingTokens.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default TokensPage;