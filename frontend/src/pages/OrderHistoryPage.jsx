import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Package, Calendar, Tag, Coins } from 'lucide-react';

import Header from '../components/Header'; // Adjust path if necessary

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                if (!userInfo || !userInfo.token) {
                    navigate('/login');
                    return;
                }
                const config = {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                };
                const { data } = await axios.get('http://localhost:5000/api/orders/myorders', config);
                setOrders(data);
            } catch (err) {
                console.error("Failed to fetch order history", err);
                setError('Could not load your order history. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [navigate]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen bg-slate-50">Loading your order history...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen bg-slate-50 text-red-500">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />
            <main className="max-w-screen-xl mx-auto p-4 sm:p-6 lg:p-8">
                <header className="mb-8">
                    <h1 className="text-4xl font-black text-gray-800">Order History</h1>
                    <p className="text-lg text-gray-500 mt-1">Review your past and current orders.</p>
                </header>

                <div className="space-y-6">
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <div key={order.order_id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 flex items-center">
                                            <Package className="w-6 h-6 mr-3 text-blue-600" />
                                            {order.product_name}
                                        </h2>
                                        <p className="text-xs text-gray-500 mt-1">Order ID: #{order.order_id}</p>
                                    </div>
                                    <div className={`mt-3 sm:mt-0 text-sm font-bold px-3 py-1 rounded-full ${new Date(order.date_of_delivery) < new Date() ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {new Date(order.date_of_delivery) < new Date() ? 'Delivered' : 'In Transit'}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                    <div className="p-2">
                                        <p className="text-sm font-medium text-gray-500">Order Placed</p>
                                        <p className="text-base font-semibold text-gray-800 flex items-center justify-center mt-1">
                                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                            {new Date(order.date_of_order).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="p-2">
                                        <p className="text-sm font-medium text-gray-500">Estimated Delivery</p>
                                        <p className="text-base font-semibold text-gray-800 flex items-center justify-center mt-1">
                                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                            {new Date(order.date_of_delivery).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="p-2">
                                        <p className="text-sm font-medium text-gray-500">Total Amount</p>
                                        <p className="text-base font-bold text-blue-600 flex items-center justify-center mt-1">
                                            <Tag className="w-4 h-4 mr-2 text-gray-400" />
                                            ₹{order.total_amount}
                                        </p>
                                    </div>
                                    <div className="p-2">
                                        <p className="text-sm font-medium text-gray-500">Tokens Used</p>
                                        <p className="text-base font-bold text-orange-600 flex items-center justify-center mt-1">
                                            <Coins className="w-4 h-4 mr-2 text-gray-400" />
                                            {order.tokens_used || 0}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 bg-white rounded-2xl shadow-md">
                            <h3 className="text-xl font-semibold text-gray-800">No Orders Found</h3>
                            <p className="text-gray-500 mt-2">You haven't placed any orders yet. Start shopping!</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default OrderHistoryPage;