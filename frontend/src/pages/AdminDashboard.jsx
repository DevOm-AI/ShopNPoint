import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../components/Logo';

const AdminDashboard = () => {
    const [view, setView] = useState('users'); // 'users' or 'orders'
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('adminInfo');
        navigate('/admin/login');
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
                if (!adminInfo || !adminInfo.token) {
                    navigate('/admin/login');
                    return;
                }
                const config = {
                    headers: { Authorization: `Bearer ${adminInfo.token}` },
                };

                // Fetch both users and orders
                const { data: usersData } = await axios.get('http://localhost:5000/api/admin/users', config);
                const { data: ordersData } = await axios.get('http://localhost:5000/api/admin/orders', config);

                setUsers(usersData);
                setOrders(ordersData);
            } catch (err) {
                setError('Failed to fetch data. Your session may have expired.');
                handleLogout(); // Log out if token is invalid
            }
            setLoading(false);
        };
        fetchData();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
                    <div className="flex items-center space-x-4">
                        <Logo />
                        <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
                    </div>
                    <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
                        Logout
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="border-b border-gray-200 mb-4">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            <button onClick={() => setView('users')} className={`${view === 'users' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                                All Users ({users.length})
                            </button>
                            <button onClick={() => setView('orders')} className={`${view === 'orders' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                                All Orders ({orders.length})
                            </button>
                        </nav>
                    </div>

                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : (
                        <div className="overflow-x-auto bg-white rounded-lg shadow">
                            {view === 'users' && <UsersTable users={users} />}
                            {view === 'orders' && <OrdersTable orders={orders} />}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

const UsersTable = ({ users }) => (
    <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
            <tr>
                {['ID', 'Username', 'Mobile', 'City', 'State', 'Promo Code', 'Tokens'].map(header => (
                    <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
                ))}
            </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
            {users.map(user => (
                <tr key={user.user_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.user_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.mobile_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.city}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.state}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.promo_code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.total_tokens}</td>
                </tr>
            ))}
        </tbody>
    </table>
);

const OrdersTable = ({ orders }) => (
    <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
            <tr>
                {['Order ID', 'Username', 'Order Date', 'Delivery Date', 'Total Amount', 'Tokens Used'].map(header => (
                    <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
                ))}
            </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
            {orders.map(order => (
                <tr key={order.order_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.order_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.date_of_order).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.date_of_delivery).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{order.total_amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.tokens_used}</td>
                </tr>
            ))}
        </tbody>
    </table>
);

export default AdminDashboard;