import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Shield, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import Logo from '../components/Logo';

const AdminLoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [focusedField, setFocusedField] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const { data } = await axios.post(
                'http://localhost:5000/api/admin/login',
                { username, password },
                config
            );
            localStorage.setItem('adminInfo', JSON.stringify(data));
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
            {/* Animated Background Elements - Darker theme */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-72 h-72 bg-blue-900 rounded-full mix-blend-lighten filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute top-40 right-20 w-72 h-72 bg-indigo-900 rounded-full mix-blend-lighten filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute -bottom-32 left-40 w-72 h-72 bg-purple-900 rounded-full mix-blend-lighten filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Left Side - Admin Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
                <div className="relative z-10 max-w-md">
                    {/* Shield Icon */}
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-8 shadow-2xl">
                        <Shield className="w-10 h-10 text-white" />
                    </div>
                    
                    <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
                        Admin
                        <br />
                        <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                            Control Center
                        </span>
                    </h1>
                    
                    <p className="text-lg text-slate-300 mb-12 leading-relaxed">
                        Secure administrative access to manage your e-commerce platform.
                    </p>

                    {/* Security Features */}
                    <div className="space-y-4">
                        {[
                            'Advanced security protocols',
                            'Full system control',
                            'Real-time monitoring'
                        ].map((feature, index) => (
                            <div 
                                key={index}
                                className="flex items-center gap-3"
                            >
                                <div className="flex-shrink-0 w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                                </div>
                                <span className="text-slate-300">{feature}</span>
                            </div>
                        ))}
                    </div>

                    {/* Warning Badge */}
                    <div className="mt-12 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-amber-300 mb-1">Authorized Access Only</p>
                                <p className="text-xs text-amber-400/80">Unauthorized access attempts are logged and monitored</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative z-10">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex justify-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-2xl">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    {/* Form Card */}
                    <div className="bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-10 border border-slate-700/50">
                        {/* Logo Section */}
                        <div className="flex justify-center mb-6">
                            <Logo />
                        </div>

                        <div className="mb-8 text-center">
                            <h2 className="text-3xl font-bold text-white mb-2">Admin Login</h2>
                            <p className="text-slate-400">Enter your credentials to access the dashboard</p>
                        </div>

                        {error && (
                            <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-start gap-2">
                                <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-xs">!</span>
                                </div>
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Username */}
                            <div className="group">
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Admin Username
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className={`w-5 h-5 transition-colors ${focusedField === 'username' ? 'text-blue-400' : 'text-slate-500'}`} />
                                    </div>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        onFocus={() => setFocusedField('username')}
                                        onBlur={() => setFocusedField('')}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Enter admin username"
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border-2 border-slate-700 rounded-xl text-white placeholder-slate-500 
                                                  focus:outline-none focus:border-blue-500 focus:bg-slate-900 transition-all duration-200"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="group">
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className={`w-5 h-5 transition-colors ${focusedField === 'password' ? 'text-blue-400' : 'text-slate-500'}`} />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField('')}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Enter admin password"
                                        className="w-full pl-12 pr-12 py-3.5 bg-slate-900/50 border-2 border-slate-700 rounded-xl text-white placeholder-slate-500 
                                                  focus:outline-none focus:border-blue-500 focus:bg-slate-900 transition-all duration-200"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
                                          text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl 
                                          transform hover:-translate-y-0.5 transition-all duration-200 
                                          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                                          flex items-center justify-center gap-2 group"
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Shield className="w-5 h-5" />
                                        <span>Access Dashboard</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Footer Link */}
                        <div className="mt-8 pt-6 border-t border-slate-700 text-center">
                            <p className="text-slate-400 text-sm">
                                Not an admin?{' '}
                                <Link 
                                    to="/login" 
                                    className="font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    User Login
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Security Badge */}
                    <div className="mt-6 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-full">
                            <Lock className="w-3 h-3 text-slate-400" />
                            <p className="text-xs text-slate-400">
                                Secured with end-to-end encryption
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;