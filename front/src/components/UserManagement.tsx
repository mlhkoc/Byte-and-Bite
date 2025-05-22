import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

// Mock data for users
const mockUsers = [
    { id: 1, name: 'John Doe', email: 'john.doe@email.com', role: 'customer', joinDate: '2023-11-15', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@email.com', role: 'customer', joinDate: '2023-10-20', status: 'active' },
    { id: 3, name: 'Mike Wilson', email: 'mike.wilson@email.com', role: 'courier', joinDate: '2023-09-05', status: 'banned' },
    { id: 4, name: 'Sarah Johnson', email: 'sarah.j@email.com', role: 'restaurant', joinDate: '2023-08-12', status: 'active' },
    { id: 5, name: 'David Brown', email: 'david.b@email.com', role: 'customer', joinDate: '2023-07-30', status: 'active' },
    { id: 6, name: 'Emily Davis', email: 'emily.d@email.com', role: 'customer', joinDate: '2023-06-18', status: 'active' },
];

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState(mockUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());

        if (filter === 'all') return matchesSearch;
        if (filter === 'banned') return matchesSearch && user.status === 'banned';
        return matchesSearch && user.role === filter;
    });

    const handleBanUser = (id: number) => {
        setUsers(users.map(user =>
            user.id === id ? { ...user, status: user.status === 'banned' ? 'active' : 'banned' } : user
        ));
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'restaurant': return 'bg-blue-100 text-blue-800';
            case 'courier': return 'bg-indigo-100 text-indigo-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">User Management</h1>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Search and filters */}
                <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between gap-4">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search users..."
                            className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Users</option>
                            <option value="customer">Customers</option>
                            <option value="restaurant">Restaurants</option>
                            <option value="courier">Couriers</option>
                            <option value="banned">Banned Users</option>
                        </select>
                    </div>
                </div>

                {/* Users table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Join Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-gray-900">{user.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-gray-500">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        {new Date(user.joinDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status === 'active' ? 'Active' : 'Banned'}
                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => handleBanUser(user.id)}
                                            className={`px-3 py-1 text-sm rounded-md ${
                                                user.status === 'banned'
                                                    ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                                                    : 'bg-red-100 text-red-600 hover:bg-red-200'
                                            }`}
                                        >
                                            {user.status === 'banned' ? 'Unban' : 'Ban'}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                    No users found
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;