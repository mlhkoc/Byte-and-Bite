import React, { useState } from 'react';
import { Search, Check, X, Info } from 'lucide-react';

// Mock restaurant data
const mockRestaurants = [
    { id: 1, name: 'Pasta Palace', email: 'info@pastapalace.com', status: 'pending', joinDate: '2023-11-20', address: '123 Main St, New York, NY' },
    { id: 2, name: 'Sushi Express', email: 'contact@sushiexpress.com', status: 'approved', joinDate: '2023-10-15', address: '456 Oak Ave, Los Angeles, CA' },
    { id: 3, name: 'Burger Heaven', email: 'hello@burgerheaven.com', status: 'approved', joinDate: '2023-09-25', address: '789 Pine St, Chicago, IL' },
    { id: 4, name: 'Taco Time', email: 'orders@tacotime.com', status: 'pending', joinDate: '2023-11-25', address: '321 Elm St, Miami, FL' },
    { id: 5, name: 'Pizza Paradise', email: 'info@pizzaparadise.com', status: 'rejected', joinDate: '2023-11-10', address: '654 Cedar Ln, Seattle, WA' },
];

const RestaurantManagement: React.FC = () => {
    const [restaurants, setRestaurants] = useState(mockRestaurants);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedRestaurant, setSelectedRestaurant] = useState<null | typeof mockRestaurants[0]>(null);

    const filteredRestaurants = restaurants.filter(restaurant => {
        const matchesSearch =
            restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            restaurant.email.toLowerCase().includes(searchTerm.toLowerCase());

        if (filterStatus === 'all') return matchesSearch;
        return matchesSearch && restaurant.status === filterStatus;
    });

    const handleApprove = (id: number) => {
        setRestaurants(restaurants.map(restaurant =>
            restaurant.id === id ? { ...restaurant, status: 'approved' } : restaurant
        ));
        if (selectedRestaurant?.id === id) {
            setSelectedRestaurant({ ...selectedRestaurant, status: 'approved' });
        }
    };

    const handleReject = (id: number) => {
        setRestaurants(restaurants.map(restaurant =>
            restaurant.id === id ? { ...restaurant, status: 'rejected' } : restaurant
        ));
        if (selectedRestaurant?.id === id) {
            setSelectedRestaurant({ ...selectedRestaurant, status: 'rejected' });
        }
    };

    const handleShowDetails = (restaurant: typeof mockRestaurants[0]) => {
        setSelectedRestaurant(restaurant);
    };

    const closeDetails = () => {
        setSelectedRestaurant(null);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Restaurant Management</h1>
            </div>

            <div className="bg-white rounded-lg shadow-sm">
                {/* Search and filters */}
                <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search restaurants..."
                            className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                        >
                            <option value="all">All Restaurants</option>
                            <option value="approved">Approved</option>
                            <option value="pending">Pending</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>

                {/* Restaurants table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Restaurant
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
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
                        {filteredRestaurants.length > 0 ? (
                            filteredRestaurants.map((restaurant) => (
                                <tr key={restaurant.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-gray-900">{restaurant.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-gray-500">{restaurant.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        {new Date(restaurant.joinDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(restaurant.status)}`}>
                        {restaurant.status.charAt(0).toUpperCase() + restaurant.status.slice(1)}
                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleShowDetails(restaurant)}
                                                className="p-1.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                                                title="View Details"
                                            >
                                                <Info size={16} />
                                            </button>

                                            {restaurant.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(restaurant.id)}
                                                        className="p-1.5 bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors"
                                                        title="Approve"
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(restaurant.id)}
                                                        className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                                                        title="Reject"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                    No restaurants found
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Restaurant details modal */}
            {selectedRestaurant && (
                <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-md">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold">Restaurant Details</h3>
                                <button onClick={closeDetails} className="text-gray-400 hover:text-gray-600">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Name</h4>
                                    <p className="mt-1">{selectedRestaurant.name}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Email</h4>
                                    <p className="mt-1">{selectedRestaurant.email}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Address</h4>
                                    <p className="mt-1">{selectedRestaurant.address}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Join Date</h4>
                                    <p className="mt-1">{new Date(selectedRestaurant.joinDate).toLocaleDateString()}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Status</h4>
                                    <span className={`mt-1 inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedRestaurant.status)}`}>
                    {selectedRestaurant.status.charAt(0).toUpperCase() + selectedRestaurant.status.slice(1)}
                  </span>
                                </div>
                            </div>

                            {selectedRestaurant.status === 'pending' && (
                                <div className="mt-6 flex space-x-3">
                                    <button
                                        onClick={() => handleApprove(selectedRestaurant.id)}
                                        className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleReject(selectedRestaurant.id)}
                                        className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RestaurantManagement;