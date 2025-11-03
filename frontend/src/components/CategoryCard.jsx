import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const CategoryCard = ({ category }) => {
  return (
    // The Link component makes the whole card clickable and navigates to the correct category page
    <Link to={`/category/${category.name}`} className="block">
      <div className="relative bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-orange-400 hover:shadow-2xl transition-all duration-500 cursor-pointer group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-28 h-28 bg-gradient-to-br from-blue-100 to-orange-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-2xl">
            <category.icon className="w-14 h-14 text-blue-600 group-hover:text-orange-600 transition-colors duration-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors duration-300">
            {category.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3">{category.itemCount} products</p>
          <div className="flex items-center text-blue-600 group-hover:text-orange-600 font-semibold transition-colors duration-300">
            <span>Explore</span>
            <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-2 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;