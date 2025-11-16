import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Coins, Gift, Copy, Check, TrendingUp, TrendingDown } from 'lucide-react';

import Header from '../components/Header'; // Adjust path if necessary

const TokensPage = () => {
    const [tokenData, setTokenData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTokenData = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                if (!userInfo || !userInfo.token) {
                    navigate('/login');
                    return;
                }
                const config = {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                };
                const { data } = await axios.get('http://localhost:5000/api/users/tokens', config);
                setTokenData(data);
            } catch (err) {
                console.error("Failed to fetch token data", err);
                setError('Could not load your token details. Please try logging in again.');
                localStorage.removeItem('userInfo');
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchTokenData();
    }, [navigate]);

    const handleCopy = () => {
        if (tokenData && tokenData.promoCode) {
            navigator.clipboard.writeText(tokenData.promoCode);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
        }
    };

    // Updated loading/error states to match theme
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-50">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 
                                rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen bg-slate-50 text-red-600">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />
            <main className="max-w-screen-xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* Header (Minimalist) */}
                <header className="mb-8">
                    <h1 className="text-3xl font-semibold text-slate-900">Tokens & Rewards</h1>
                    <p className="text-lg text-slate-600 mt-1">View your balance, promo code, and transaction history.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    {/* Total Tokens Card (Minimalist) */}
                    <div className="bg-white rounded-2xl p-8 shadow-md border border-slate-200 text-center">
                        <div className="flex items-center justify-center mb-4">
                            <Coins className="w-8 h-8 text-blue-600" />
                            {/* Lighter font */}
                            <h2 className="ml-4 text-xl font-semibold text-slate-900">Your Token Balance</h2>
                        </div>
                        {/* NO GRADIENT, Lighter font, Brand color */}
                        <p className="text-6xl font-semibold text-blue-600">
                            {tokenData.totalTokens}
                        </p>
                    </div>

                    {/* Promo Code Card (Minimalist) */}
                    <div className="bg-white rounded-2xl p-8 shadow-md border border-slate-200 text-center">
                        <div className="flex items-center justify-center mb-4">
                            <Gift className="w-8 h-8 text-blue-600" />
                            {/* Lighter font */}
                            <h2 className="ml-4 text-xl font-semibold text-slate-900">Your Promo Code</h2>
                        </div>
                        <div className="relative flex items-center justify-center p-3 border-2 border-dashed border-slate-300 rounded-lg">
                            {/* Smaller, lighter font */}
                            <p className="text-2xl font-mono font-semibold text-slate-700 tracking-widest">
                                {tokenData.promoCode}
                            </p>
                            <button 
                                onClick={handleCopy}
                                // Updated to slate palette
                                className={`absolute right-2 p-2 rounded-lg transition-colors duration-200 ${isCopied ? 'bg-green-100 text-green-600' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                            >
                                {isCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Transaction History (Minimalist) */}
                <div className="bg-white rounded-2xl p-8 shadow-md border border-slate-200">
                    {/* Lighter font */}
                    <h2 className="text-xl font-semibold text-slate-900 mb-6">Transaction History</h2>
                    <div className="overflow-x-auto">
                        {tokenData.tokenHistory && tokenData.tokenHistory.length > 0 ? (
                            <table className="min-w-full divide-y divide-slate-200">
                                {/* Updated to slate palette */}
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Reference</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tokens Earned</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tokens Used</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-200">
                                    {tokenData.tokenHistory.map((item, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">{item.reference}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600 flex items-center">
                                                {item.earned ? <><TrendingUp className="w-4 h-4 mr-2" /> +{item.earned}</> : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600 flex items-center">
                                                {item.used ? <><TrendingDown className="w-4 h-4 mr-2" /> -{item.used}</> : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(item.action_time).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-center text-slate-500 py-4">You have no token transaction history yet.</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TokensPage;