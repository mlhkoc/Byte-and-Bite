import { useState, useEffect } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import {Pencil, LogOut, Lock, MapPin, CreditCard, HelpCircle, RotateCcw, Trash2, EyeOff, Eye} from 'lucide-react';
import { CustomerHeader } from '../components/Header';
import { fetchCustomerByEmail, updateCustomer } from '../services/CustomerApi';
import { Customer } from '../types';

function ProfilePage() {
    const [user, setUser] = useState<Customer | null>(null);
    const [editMode, setEditMode] = useState(false);
    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("user");

    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState(false);

    // Password validation states
    const passwordsMatch = newPassword === confirmPassword;
    const passwordStrength = getPasswordStrength(newPassword);

    function getPasswordStrength(password: string): { score: number; message: string; color: string } {
        if (!password) {
            return { score: 0, message: '', color: 'bg-gray-200' };
        }

        // Simple password strength calculation
        let score = 0;
        if (password.length >= 8) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[a-z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;

        // Return appropriate message and color based on score
        switch (score) {
            case 0:
            case 1:
                return { score, message: 'Weak', color: 'bg-red-500' };
            case 2:
            case 3:
                return { score, message: 'Moderate', color: 'bg-yellow-500' };
            case 4:
            case 5:
                return { score, message: 'Strong', color: 'bg-green-500' };
            default:
                return { score: 0, message: '', color: 'bg-gray-200' };
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSavePassword = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate passwords
        if (!newPassword || !confirmPassword) {
            setFormError('Both password fields are required');
            return;
        }

        if (!passwordsMatch) {
            setFormError('Passwords do not match');
            return;
        }


        // Simulate successful password change
        setFormSuccess(true);
        setFormError('');

        // Navigate to logout after a brief delay to show success message
        setTimeout(() => {
            navigate('/logout');
        }, 1500);
    };



    const handleConfirmDelete = () => {
        // In a real app, we would call an API to delete the account
        console.log('Account deleted');
        navigate('/logout');
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirmation(false);
    };





    useEffect(() => {
        if (!userEmail) return;

        fetchCustomerByEmail(userEmail,token)
            .then(setUser)
            .catch(console.error);
    }, []);

    const handleSave = async () => {
        if (userEmail == null || user == null) return;

        try {

            await updateCustomer(userEmail, user,token);
            if(localStorage.getItem("user") != user.email) navigate("/logout");
            localStorage.setItem( "user", user.email );
            setEditMode(false);
            // navigate("/logout")

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
                                            onChange={(e) => setUser(prev => prev ? {
                                                ...prev,
                                                fullName: e.target.value
                                            } : null)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                                            className="w-full outline-none"
                                        />
                                    ) : (
                                        <>
                                            {user?.fullName}
                                            <button onClick={() => setEditMode(true)}>
                                                <Pencil size={16}/>
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
                                            onChange={(e) => setUser(prev => prev ? {
                                                ...prev,
                                                email: e.target.value
                                            } : null)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                                            className="w-full outline-none"
                                        />
                                    ) : (
                                        <>
                                            {user?.email}
                                            <button onClick={() => setEditMode(true)}>
                                                <Pencil size={16}/>
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
                                            onChange={(e) => setUser(prev => prev ? {
                                                ...prev,
                                                phone: e.target.value
                                            } : null)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                                            className="w-full outline-none"
                                        />
                                    ) : (
                                        <>
                                            {user?.phone}
                                            <button onClick={() => setEditMode(true)}>
                                                <Pencil size={16}/>
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
                                            onChange={(e) => setUser(prev => prev ? {
                                                ...prev,
                                                address: e.target.value
                                            } : null)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                                            className="w-full outline-none"
                                        />
                                    ) : (
                                        <>
                                            {user?.address}
                                            <button onClick={() => setEditMode(true)}>
                                                <Pencil size={16}/>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Account Security</h3>
                        </div>
                        <div className="space-y-4">
                            {/* New Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-4 py-2 rounded border border-gray-300"
                                        placeholder="Enter new password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                    >
                                        {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-2 rounded border border-gray-300"
                                    placeholder="Confirm your password"
                                />
                            </div>

                            {/* Save Button */}
                            <button
                                onClick={() => {
                                    if (newPassword === confirmPassword && newPassword) {
                                        navigate('/logout');
                                    }
                                }}
                                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                            >
                                Save Password
                            </button>

                            {/* Delete Account */}
                            <div className="pt-4 mt-4 border-t border-gray-200">
                                <button
                                    onClick={() => setShowDeleteConfirmation(true)}
                                    className="w-full border border-red-500 text-red-600 py-2 rounded hover:bg-red-50"
                                >
                                    <Trash2 size={16} className="inline mr-2"/>
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="bg-white rounded-2xl shadow p-6 space-y-4">
                    <h3 className="text-lg font-semibold">Quick Actions</h3>
                    <div className="space-y-2">
                        <Link to="/orders"
                              className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
                            <span className="flex items-center gap-2"><Lock size={16}/> Orders</span>
                        </Link>
                        <Link to="/address-book"
                              className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
                            <span className="flex items-center gap-2"><MapPin size={16}/> Address Book</span>
                        </Link>
                        <Link to="/payment-methods"
                              className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
                            <span className="flex items-center gap-2"><CreditCard size={16}/> Payment Methods</span>
                        </Link>
                        <Link to="/support"
                              className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
                            <span className="flex items-center gap-2"><HelpCircle size={16}/> Help & Support</span>
                        </Link>
                        <Link to="/logout"
                              className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
                            <span className="flex items-center gap-2"><LogOut size={16}/> Log Out</span>
                        </Link>
                    </div>
                </div>
            </div>
            {/* Delete confirmation modal */}
            {showDeleteConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div
                        className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl animate-[fadeIn_0.2s_ease-out]"
                        style={{ animation: 'fadeIn 0.2s ease-out' }}
                    >
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete your account?</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleCancelDelete}
                                className="flex-1 py-2.5 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="flex-1 py-2.5 px-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors duration-200"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfilePage;