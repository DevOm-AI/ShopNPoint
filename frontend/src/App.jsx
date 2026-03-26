import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import RegistrationPage from './pages/Register';
import ProfileCompletionPage from './pages/ProfileCompletion';
import LandingPage from './pages/Landing';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/Cart';
import UserDashboard from './pages/UserDashboard'; 
import TokensPage from './pages/TokensPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import SettingsPage from './pages/SettingsPage';

import SearchPage from './pages/SearchPage';
import GamificationDashboard from './pages/GamificationDashboard';

import AdminLoginPage from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/profile" element={<ProfileCompletionPage />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/product/:productId" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/tokens" element={ <TokensPage /> }></Route>
        <Route path="/orders" element={<OrderHistoryPage />} /> 

        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/search" element={<SearchPage />} />

        <Route path='/gamification' element={<GamificationDashboard />} />

        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}

export default App;