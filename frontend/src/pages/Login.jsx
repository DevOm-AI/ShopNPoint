import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, ShoppingCart, LogIn, ArrowRight, Shield, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
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
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
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
          'http://localhost:5000/api/users/login',
          { username: formData.username, password: formData.password }
        );

        localStorage.setItem('userInfo', JSON.stringify(data));
        
        if (!data.profileCompleted) {
          alert(`Welcome, ${data.username}! Please complete your profile.`);
          navigate('/profile');
        } else {
          alert(`Login successful! Welcome back, ${data.username}!`);
          navigate('/landing');
        }

      } catch (error) {
        const errorMessage = error.response?.data?.message || 'An unexpected error occurred.';
        setErrors({ api: errorMessage });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="hidden lg:flex lg:w-1/2 bg-white border-r border-gray-200 items-center justify-center p-12">
        <div className="max-w-md w-full">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-xl mb-8 shadow-sm">
            <ShoppingCart className="w-7 h-7 text-white" strokeWidth={2} />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Welcome to <span className="text-blue-600">ShopNPoint</span>
          </h1>
          
          <p className="text-lg text-gray-600 mb-12 leading-relaxed">
            Sign in to access your account and continue shopping
          </p>

          <div className="space-y-4">
            {[
              { text: 'Secure authentication', icon: CheckCircle2 },
              { text: 'Personalized experience', icon: CheckCircle2 },
              { text: 'Track your orders', icon: CheckCircle2 }
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
                  <feature.icon className="w-3 h-3 text-emerald-600" strokeWidth={2.5} />
                </div>
                <span className="text-gray-700 text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex justify-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl shadow-sm">
              <ShoppingCart className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In</h2>
              <p className="text-gray-600 text-sm">Enter your credentials to access your account</p>
            </div>

            {errors.api && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-700 font-medium">{errors.api}</p>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className={`w-5 h-5 transition-colors duration-200 ${
                      focusedField === 'username' ? 'text-blue-600' : 'text-gray-400'
                    }`} strokeWidth={2} />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('username')}
                    onBlur={() => setFocusedField('')}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter your username"
                    className={`w-full pl-12 pr-4 py-3 bg-white border-2 rounded-xl text-gray-900 placeholder-gray-400 
                              focus:outline-none transition-all duration-200 ${
                                errors.username 
                                  ? 'border-red-300 focus:border-red-500' 
                                  : focusedField === 'username'
                                    ? 'border-blue-600'
                                    : 'border-gray-200 focus:border-blue-600'
                              }`}
                  />
                </div>
                {errors.username && (
                  <p className="mt-2 text-sm text-red-600 font-medium">{errors.username}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className={`w-5 h-5 transition-colors duration-200 ${
                      focusedField === 'password' ? 'text-blue-600' : 'text-gray-400'
                    }`} strokeWidth={2} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter your password"
                    className={`w-full pl-12 pr-12 py-3 bg-white border-2 rounded-xl text-gray-900 placeholder-gray-400 
                              focus:outline-none transition-all duration-200 ${
                                errors.password 
                                  ? 'border-red-300 focus:border-red-500' 
                                  : focusedField === 'password'
                                    ? 'border-blue-600'
                                    : 'border-gray-200 focus:border-blue-600'
                              }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" strokeWidth={2} />
                    ) : (
                      <Eye className="w-5 h-5" strokeWidth={2} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 font-medium">{errors.password}</p>
                )}
              </div>

              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-6 rounded-xl 
                          shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 
                          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:bg-blue-600
                          flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-5 h-5" strokeWidth={2} />
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" strokeWidth={2} />
                  </>
                )}
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center space-y-4">
                <p className="text-gray-600 text-sm">
                  Don't have an account?{' '}
                  <Link 
                    to="/register" 
                    className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200"
                  >
                    Create one
                  </Link>
                </p>
                <div className="flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4 text-gray-400" strokeWidth={2} />
                  <Link 
                    to="/admin/login" 
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
                  >
                    Admin Portal
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Protected by industry-standard encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
