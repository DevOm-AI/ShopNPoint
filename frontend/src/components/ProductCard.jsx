import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// --- THIS IS THE FIX ---
// The 'Heart' icon is now imported only once along with all other necessary icons.
import { Coins, Star, Shirt, Laptop, Gem, ShoppingBag, Home as HomeIcon, Heart } from 'lucide-react';

const ProductCard = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  const iconMap = {
    'Clothing': Shirt,
    'Electronics': Laptop,
    'Jewellery': Gem,
    'Home Appliances': HomeIcon,
    'Footwear': ShoppingBag,
  };
  const Icon = iconMap[product.category] || ShoppingBag;

  const handleAddToCart = async (e) => {
    e.stopPropagation(); 
    e.preventDefault();
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo || !userInfo.token) {
        navigate('/login');
        return;
      }
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
      await axios.post('http://localhost:5000/api/cart', { productId: product.id, quantity: 1 }, config);
      alert(`"${product.name}" added to cart!`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add item to cart.');
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-orange-400 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 cursor-pointer group">
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-orange-50 aspect-square">
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <Icon className="w-32 h-32 text-gray-300 group-hover:text-orange-500 transition-all duration-500 group-hover:scale-110" />
        </div>
        {product.discount && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">{product.discount}% OFF</div>
        )}
        {product.isNew && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">NEW</div>
        )}
        <button 
          onClick={(e) => { e.stopPropagation(); e.preventDefault(); setIsFavorite(!isFavorite); }}
          className="absolute top-20 right-4 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        >
          <Heart className={`w-5 h-5 transition-colors duration-300 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>
      </div>
      <div className="p-6">
        <div className="mb-3"><span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{product.category}</span></div>
        <h3 className="font-bold text-gray-900 mb-3 text-lg line-clamp-2 group-hover:text-orange-600 transition-colors duration-300">{product.name}</h3>
        <div className="flex items-center mb-3">
          <div className="flex items-center">{[...Array(5)].map((_, i) => (<Star key={i} className={`w-4 h-4 ${i < product.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />))}</div>
          <span className="text-sm text-gray-600 ml-2 font-medium">({product.reviews})</span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-gray-900">₹{product.price}</span>
            {product.originalPrice && (<span className="text-base text-gray-400 line-through">₹{product.originalPrice}</span>)}
          </div>
        </div>
        {product.tokens && (<div className="flex items-center justify-center text-orange-600 bg-orange-50 py-2 rounded-lg mb-4 font-semibold"><Coins className="w-5 h-5 mr-2" /><span>Earn {product.tokens} tokens</span></div>)}
        <button onClick={handleAddToCart} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-orange-500 hover:to-orange-600 text-white py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductCard;