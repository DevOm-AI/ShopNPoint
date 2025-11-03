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

    if (loading) {
        return <div className="flex justify-center items-center h-screen bg-slate-50">Loading your rewards...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen bg-slate-50 text-red-500">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />
            <main className="max-w-screen-xl mx-auto p-4 sm:p-6 lg:p-8">
                <header className="mb-8">
                    <h1 className="text-4xl font-black text-gray-800">Tokens & Rewards</h1>
                    <p className="text-lg text-gray-500 mt-1">View your balance, promo code, and transaction history.</p>
                </header>

                {/* --- Two divs side-by-side as requested --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    {/* Total Tokens Card */}
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
                        <div className="flex items-center justify-center mb-4">
                            <Coins className="w-10 h-10 text-orange-500" />
                            <h2 className="ml-4 text-2xl font-bold text-gray-800">Your Token Balance</h2>
                        </div>
                        <p className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500">
                            {tokenData.totalTokens}
                        </p>
                    </div>

                    {/* Promo Code Card */}
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
                        <div className="flex items-center justify-center mb-4">
                            <Gift className="w-10 h-10 text-blue-600" />
                            <h2 className="ml-4 text-2xl font-bold text-gray-800">Your Promo Code</h2>
                        </div>
                        <div className="relative flex items-center justify-center p-3 border-2 border-dashed border-gray-300 rounded-lg">
                            <p className="text-3xl font-mono font-bold text-gray-700 tracking-widest">
                                {tokenData.promoCode}
                            </p>
                            <button 
                                onClick={handleCopy}
                                className={`absolute right-2 p-2 rounded-lg transition-colors duration-200 ${isCopied ? 'bg-green-100 text-green-600' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
                            >
                                {isCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- Transaction History div below them --- */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Transaction History</h2>
                    <div className="overflow-x-auto">
                        {tokenData.tokenHistory && tokenData.tokenHistory.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tokens Earned</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tokens Used</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {tokenData.tokenHistory.map((item, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{item.reference}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600 flex items-center">
                                                {item.earned ? <><TrendingUp className="w-4 h-4 mr-2" /> +{item.earned}</> : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600 flex items-center">
                                                {item.used ? <><TrendingDown className="w-4 h-4 mr-2" /> -{item.used}</> : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.action_time).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-center text-gray-500 py-4">You have no token transaction history yet.</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TokensPage;