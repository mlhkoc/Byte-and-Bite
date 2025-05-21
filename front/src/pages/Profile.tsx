import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, LogOut, Lock, MapPin, CreditCard, HelpCircle, RotateCcw } from 'lucide-react';
import { CustomerHeader } from '../components/Header';
import { fetchCustomerByEmail, updateCustomer } from '../services/CustomerApi';
import { Customer } from '../types';
import { useAuth } from '../context/AuthContext';

function ProfilePage() {
    const [user, setUser] = useState<Customer | null>(null);
    const [editMode, setEditMode] = useState(false);

    const {userEmail, setUserEmail} = useAuth();

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



    useEffect(() => {
        if (!userEmail) return;

        fetchCustomerByEmail(userEmail)
            .then(setUser)
            .catch(console.error);
    }, []);

    const handleSave = async () => {
        if (userEmail == null || user == null) return;

        try {
            await updateCustomer(userEmail, user);
            console.log( user );
            setUserEmail( user.email );
            localStorage.setItem( "userEmail", user.email );
            setEditMode(false);
        } catch (err) {
            console.error("Update failed:", err);
        }
    };

    return (
        <div className="p-4 md:p-8">
            <CustomerHeader />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">{user?.fullName}</h2>
                            <button
                                className="border px-3 py-1 rounded hover:bg-gray-100"
                                onClick={editMode ? handleSave : () => setEditMode(true)}
                            >
                                {editMode ? "Save" : "Edit Profile"}
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-500">Full Name</label>
                                <div className="border p-2 rounded flex justify-between items-center">
                                    {editMode ? (
                                        <input
                                            type="text"
                                            value={user?.fullName || ''}
                                            onChange={(e) => setUser(prev => prev ? { ...prev, fullName: e.target.value } : null)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                                            className="w-full outline-none"
                                        />
                                    ) : (
                                        <>
                                            {user?.fullName}
                                            <button onClick={() => setEditMode(true)}>
                                                <Pencil size={16} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="text-sm text-gray-500">Email Address</label>
                                <div className="border p-2 rounded flex justify-between items-center">
                                    {editMode ? (
                                        <input
                                            type="email"
                                            value={user?.email || ''}
                                            onChange={(e) => setUser(prev => prev ? { ...prev, email: e.target.value } : null)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                                            className="w-full outline-none"
                                        />
                                    ) : (
                                        <>
                                            {user?.email}
                                            <button onClick={() => setEditMode(true)}>
                                                <Pencil size={16} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="text-sm text-gray-500">Phone Number</label>
                                <div className="border p-2 rounded flex justify-between items-center">
                                    {editMode ? (
                                        <input
                                            type="tel"
                                            value={user?.phone || ''}
                                            onChange={(e) => setUser(prev => prev ? { ...prev, phone: e.target.value } : null)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                                            className="w-full outline-none"
                                        />
                                    ) : (
                                        <>
                                            {user?.phone}
                                            <button onClick={() => setEditMode(true)}>
                                                <Pencil size={16} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="text-sm text-gray-500">Default Address</label>
                                <div className="border p-2 rounded flex justify-between items-center">
                                    {editMode ? (
                                        <input
                                            type="text"
                                            value={user?.address || ''}
                                            onChange={(e) => setUser(prev => prev ? { ...prev, address: e.target.value } : null)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                                            className="w-full outline-none"
                                        />
                                    ) : (
                                        <>
                                            {user?.address}
                                            <button onClick={() => setEditMode(true)}>
                                                <Pencil size={16} />
                                            </button>
                                        </>
                                    )}
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