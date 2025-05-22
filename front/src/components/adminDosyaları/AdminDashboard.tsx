import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

// Mock data for dashboard
const mockRegistrationRequests = [
    { id: 1, type: 'restaurant', name: 'Pasta Palace LLC', time: '5 minutes ago' },
    { id: 2, type: 'courier', name: 'Mike Johnson', time: '10 minutes ago' },
    { id: 3, type: 'restaurant', name: 'Sushi Express', status: 'approved', time: '1 hour ago' }
];

const mockBannedUsers = [
    { email: 'john.doe@email.com', time: '2 hours ago' },
    { email: 'sarah.smith@email.com', time: '1 day ago' },
    { email: 'mike.wilson@email.com', time: '2 days ago' }
];

const AdminDashboard: React.FC = () => {
    const [registrations, setRegistrations] = useState(mockRegistrationRequests);
    const [bannedUsers, setBannedUsers] = useState(mockBannedUsers);
    const [emailToBan, setEmailToBan] = useState('');

    const handleApprove = (id: number) => {
        setRegistrations(registrations.map(reg =>
            reg.id === id ? { ...reg, status: 'approved' } : reg
        ));
    };

    const handleReject = (id: number) => {
        setRegistrations(registrations.map(reg =>
            reg.id === id ? { ...reg, status: 'rejected' } : reg
        ));
    };

    const handleBanUser = () => {
        if (emailToBan.trim() === '') return;

        // In a real app, you would call an API to ban the user
        setBannedUsers([
            { email: emailToBan, time: 'just now' },
            ...bannedUsers
        ]);
        setEmailToBan('');
    };

    const handleUnban = (email: string) => {
        setBannedUsers(bannedUsers.filter(user => user.email !== email));
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Registration Requests */}
            <div className="bg-white p-5 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Recent Registration Requests</h2>

                <div className="space-y-4">
                    {registrations.map(registration => (
                        <div key={registration.id} className={`p-4 border rounded-lg flex items-center justify-between ${
                            registration.status === 'approved' ? 'bg-green-50 border-green-100' : 'bg-blue-50 border-blue-100'
                        }`}>
                            <div className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                    registration.type === 'restaurant' ? 'bg-blue-100' : 'bg-indigo-100'
                                }`}>
                                    {registration.type === 'restaurant' ? (
                                        <span className="text-blue-600">🍽️</span>
                                    ) : (
                                        <span className="text-indigo-600">🚚</span>
                                    )}
                                </div>

                                <div>
                                    <div className="font-medium">
                                        {registration.type === 'restaurant' ? 'Restaurant Registration' : 'Courier Registration'}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {registration.type === 'restaurant'
                                            ? `${registration.name} submitted registration`
                                            : `${registration.name} applied for courier position`}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">{registration.time}</div>
                                </div>
                            </div>

                            {registration.status ? (
                                <div className="text-green-600 font-medium">
                                    {registration.status === 'approved' ? 'Approved' : 'Rejected'}
                                </div>
                            ) : (
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleApprove(registration.id)}
                                        className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center"
                                    >
                                        <Check size={16} className="mr-1" />
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleReject(registration.id)}
                                        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center"
                                    >
                                        <X size={16} className="mr-1" />
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Ban User Section */}
            <div className="bg-white p-5 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Ban User</h2>

                <div className="flex mb-6">
                    <input
                        type="email"
                        value={emailToBan}
                        onChange={(e) => setEmailToBan(e.target.value)}
                        placeholder="Enter user email"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleBanUser}
                        className="px-4 py-2 bg-red-500 text-white rounded-r-md hover:bg-red-600 transition-colors"
                    >
                        Ban User
                    </button>
                </div>

                <h3 className="font-medium mb-3">Recently Banned Users</h3>

                <div className="space-y-3">
                    {bannedUsers.map((user, index) => (
                        <div key={index} className="p-3 border border-gray-200 rounded-lg flex justify-between items-center">
                            <div>
                                <div className="font-medium">{user.email}</div>
                                <div className="text-xs text-gray-500">Banned {user.time}</div>
                            </div>
                            <button
                                onClick={() => handleUnban(user.email)}
                                className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                            >
                                Unban
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;