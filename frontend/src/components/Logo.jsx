// src/components/Logo.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Sparkles } from 'lucide-react';

const Logo = () => {
  return (
    <Link 
      to="/landing" 
      className="group flex items-center gap-3 relative"
    >
      {/* Icon Container with Gradient Background */}
      <div className="relative">
        <div className="w-11 h-11 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 
                      rounded-xl flex items-center justify-center 
                      shadow-lg group-hover:shadow-xl
                      transform group-hover:scale-110 group-hover:rotate-3
                      transition-all duration-300">
          <ShoppingBag className="w-6 h-6 text-white" />
        </div>
        
        {/* Sparkle Effect on Hover */}
        <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-amber-400 
                           opacity-0 group-hover:opacity-100 
                           transition-opacity duration-300
                           animate-pulse" />
      </div>

      {/* Text Logo */}
      <div className="flex flex-col">
        <span className="text-3xl font-black tracking-tighter leading-none
                       bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600
                       bg-clip-text text-transparent
                       group-hover:from-blue-700 group-hover:via-indigo-700 group-hover:to-purple-700
                       transition-all duration-300">
          SnP
        </span>
        <span className="text-[10px] font-semibold text-slate-500 tracking-wide uppercase">
          Store
        </span>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-indigo-400/0 to-purple-400/0 
                    group-hover:from-blue-400/10 group-hover:via-indigo-400/10 group-hover:to-purple-400/10
                    rounded-2xl blur-xl transition-all duration-300 -z-10" />
    </Link>
  );
};

export default Logo;