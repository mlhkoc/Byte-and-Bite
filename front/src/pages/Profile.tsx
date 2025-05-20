import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, LogOut, Lock, MapPin, CreditCard, HelpCircle, RotateCcw } from 'lucide-react';
import { CustomerHeader } from '../components/Header';

function ProfilePage() {
    const [user, setUser] = useState({
        fullName: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        phone: '+1 (555) 123-4567',
        address: '123 Main St, New York, NY 10001',
    });

    const orders = [
        {
            id: '#12345',
            restaurant: 'The Italian Kitchen',
            date: 'May 15, 2024',
            amount: '₺1,377.00',
            status: 'Delivered',
        },
        {
            id: '#12344',
            restaurant: 'Sushi Master',
            date: 'May 13, 2024',
            amount: '₺975.00',
            status: 'Delivered',
        },
    ];

    return (
        <div className="p-4 md:p-8">
            <CustomerHeader />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Sarah Johnson</h2>
                            <button className="border px-3 py-1 rounded hover:bg-gray-100">Edit Profile</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-500">Full Name</label>
                                <div className="border p-2 rounded flex justify-between items-center">
                                    {user.fullName} <Pencil size={16} />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">Email Address</label>
                                <div className="border p-2 rounded flex justify-between items-center">
                                    {user.email} <Pencil size={16} />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">Phone Number</label>
                                <div className="border p-2 rounded flex justify-between items-center">
                                    {user.phone} <Pencil size={16} />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">Default Address</label>
                                <div className="border p-2 rounded flex justify-between items-center">
                                    {user.address} <Pencil size={16} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Recent Orders</h3>
                            <Link to="/orders" className="text-blue-600 hover:underline text-sm">View All Orders</Link>
                        </div>
                        <div className="space-y-4">
                            {orders.map((order, index) => (
                                <div key={index} className="border rounded p-4 bg-gray-50">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="font-medium">{order.restaurant}</div>
                                            <div className="text-sm text-gray-500">Order {order.id} • {order.date}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium">{order.amount}</div>
                                            <div className="text-green-600 text-sm">{order.status}</div>
                                        </div>
                                    </div>
                                    <button className="flex items-center gap-2 text-sm mt-2 text-blue-600 hover:underline">
                                        <RotateCcw size={14} /> Reorder
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow p-6 space-y-4">
                    <h3 className="text-lg font-semibold">Quick Actions</h3>
                    <div className="space-y-2">
                        <Link to="/change-password" className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
                            <span className="flex items-center gap-2"><Lock size={16} /> Change Password</span>
                        </Link>
                        <Link to="/address-book" className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
                            <span className="flex items-center gap-2"><MapPin size={16} /> Address Book</span>
                        </Link>
                        <Link to="/payment-methods" className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
                            <span className="flex items-center gap-2"><CreditCard size={16} /> Payment Methods</span>
                        </Link>
                        <Link to="/support" className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
                            <span className="flex items-center gap-2"><HelpCircle size={16} /> Help & Support</span>
                        </Link>
                        <Link to="/logout" className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
                            <span className="flex items-center gap-2"><LogOut size={16} /> Log Out</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;