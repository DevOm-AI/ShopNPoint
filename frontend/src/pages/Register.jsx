import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Phone, Home, Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react';
import axios from 'axios';

const RegistrationPage = () => {
  // --- (All state and logic is unchanged) ---
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    mobile_number: '',
    address: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name] || errors.api) {
      setErrors(prev => ({ ...prev, [name]: '', api: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!/^\d{10}$/.test(formData.mobile_number)) newErrors.mobile_number = 'A valid 10-digit mobile number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsLoading(true);
      setErrors({});
      try {
        const { data } = await axios.post(
          'http://localhost:5000/api/users',
          {
            username: formData.username,
            password: formData.password,
            mobile_number: formData.mobile_number,
            address: formData.address,
          }
        );

        localStorage.setItem("userInfo", JSON.stringify(data));

        alert(`Registration successful! Welcome, ${data.username}! Please login to continue.`);
        navigate('/login');

      } catch (error) {
        const errorMessage = error.response?.data?.message || 'An unexpected error occurred.';
        setErrors({ api: errorMessage });
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!mounted) return null;

  return (
    // --- MODIFIED: Simplified background ---
    <div className="min-h-screen bg-slate-50 flex">
      
      {/* --- REMOVED: Animated Background Elements --- */}

      {/* Left Side - Branding (Minimalist) */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12 border-r border-slate-200">
        <div className="relative z-10 max-w-md">
          {/* --- MODIFIED: Solid icon background --- */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-8 shadow-md">
            <User className="w-8 h-8 text-white" />
          </div>
          
          {/* --- MODIFIED: Lighter, smaller font, no gradient --- */}
          <h1 className="text-3xl font-semibold text-slate-900 mb-6 leading-tight">
            Join Our<br />
            <span className="text-blue-600">
              Platform
            </span>
          </h1>
          
          <p className="text-lg text-slate-600 mb-12 leading-relaxed">
            Create your account and start exploring our premium e-commerce experience.
          </p>

          {/* Feature List (This style is already minimalist and good) */}
          <div className="space-y-4">
            {[
              'Secure & encrypted data',
              'Fast checkout process',
              'Premium support 24/7'
            ].map((feature, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 opacity-0 animate-[fadeIn_0.6s_ease-out_forwards]"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-slate-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile Logo (Minimalist) */}
          <div className="lg:hidden flex justify-center mb-8">
            {/* --- MODIFIED: Solid icon background --- */}
            <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-xl shadow-md">
              <User className="w-7 h-7 text-white" />
            </div>
          </div>

          {/* Form Card (Minimalist) */}
          {/* --- MODIFIED: Removed glassmorphism, added standard card style --- */}
          <div className="bg-white rounded-2xl shadow-md p-8 sm:p-10 border border-slate-200">
            <div className="mb-8">
              {/* --- MODIFIED: Lighter, smaller font --- */}
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">Create Account</h2>
              <p className="text-slate-600">Fill in your details to get started</p>
            </div>

            {/* --- (Error styles are fine) --- */}
            {errors.api && (
              <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs">!</span>
                </div>
                <span>{errors.api}</span>
              </div>
            )}

            <div className="space-y-5">
              {/* --- (Input fields are already in the minimalist style) --- */}
              <div className="group">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className={`w-5 h-5 transition-colors ${focusedField === 'username' ? 'text-blue-600' : 'text-slate-400'}`} />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('username')}
                    onBlur={() => setFocusedField('')}
                    placeholder="Choose a unique username"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 
                              focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
                  />
                </div>
                {errors.username && <p className="mt-2 text-sm text-red-600 flex items-center gap-1">{errors.username}</p>}
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className={`w-5 h-5 transition-colors ${focusedField === 'mobile_number' ? 'text-blue-600' : 'text-slate-400'}`} />
                  </div>
                  <input
                    type="tel"
                    name="mobile_number"
                    value={formData.mobile_number}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('mobile_number')}
                    onBlur={() => setFocusedField('')}
                    placeholder="Enter your 10-digit number"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 
                              focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
                  />
                </div>
                {errors.mobile_number && <p className="mt-2 text-sm text-red-600">{errors.mobile_number}</p>}
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Home className={`w-5 h-5 transition-colors ${focusedField === 'address' ? 'text-blue-600' : 'text-slate-400'}`} />
                  </div>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('address')}
                    onBlur={() => setFocusedField('')}
                    placeholder="Enter your full address"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 
                              focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
                  />
                </div>
                {errors.address && <p className="mt-2 text-sm text-red-600">{errors.address}</p>}
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className={`w-5 h-5 transition-colors ${focusedField === 'password' ? 'text-blue-600' : 'text-slate-400'}`} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    placeholder="Create a strong password"
                    className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 
                              focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="mt-2 text-xs text-slate-500">Minimum 6 characters</p>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>

              {/* Submit Button (Minimalist) */}
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                // --- MODIFIED: Removed gradient, softer shadow ---
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 
                          text-white font-semibold py-4 px-6 rounded-xl shadow-md hover:shadow-lg 
                          transform hover:-translate-y-0.5 transition-all duration-200 
                          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                          flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>

            {/* Footer (Already good) */}
            <div className="mt-8 pt-6 border-t border-slate-200 text-center">
              <p className="text-slate-600">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Protected by 256-bit SSL encryption
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default RegistrationPage;