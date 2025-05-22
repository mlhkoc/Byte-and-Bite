import React, { useState } from 'react';
import { Search, Check, X, Info } from 'lucide-react';

// Mock courier data
const mockCouriers = [
    { id: 1, name: 'Mike Johnson', email: 'mike.j@courier.com', status: 'pending', joinDate: '2023-11-22', phone: '+1 555-123-4567', vehicle: 'Motorcycle' },
    { id: 2, name: 'Sarah Williams', email: 'sarah.w@courier.com', status: 'approved', joinDate: '2023-10-10', phone: '+1 555-987-6543', vehicle: 'Car' },
    { id: 3, name: 'David Brown', email: 'david.b@courier.com', status: 'approved', joinDate: '2023-09-15', phone: '+1 555-456-7890', vehicle: 'Bicycle' },
    { id: 4, name: 'Emily Davis', email: 'emily.d@courier.com', status: 'pending', joinDate: '2023-11-25', phone: '+1 555-321-6547', vehicle: 'Car' },
    { id: 5, name: 'James Wilson', email: 'james.w@courier.com', status: 'rejected', joinDate: '2023-11-12', phone: '+1 555-789-0123', vehicle: 'Motorcycle' },
];

const CourierManagement: React.FC = () => {
    const [couriers, setCouriers] = useState(mockCouriers);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedCourier, setSelectedCourier] = useState<null | typeof mockCouriers[0]>(null);

    const filteredCouriers = couriers.filter(courier => {
        const matchesSearch =
            courier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            courier.email.toLowerCase().includes(searchTerm.toLowerCase());

        if (filterStatus === 'all') return matchesSearch;
        return matchesSearch && courier.status === filterStatus;
    });

    const handleApprove = (id: number) => {
        setCouriers(couriers.map(courier =>
            courier.id === id ? { ...courier, status: 'approved' } : courier
        ));
        if (selectedCourier?.id === id) {
            setSelectedCourier({ ...selectedCourier, status: 'approved' });
        }
    };

    const handleReject = (id: number) => {
        setCouriers(couriers.map(courier =>
            courier.id === id ? { ...courier, status: 'rejected' } : courier
        ));
        if (selectedCourier?.id === id) {
            setSelectedCourier({ ...selectedCourier, status: 'rejected' });
        }
    };

    const handleShowDetails = (courier: typeof mockCouriers[0]) => {
        setSelectedCourier(courier);
    };

    const closeDetails = () => {
        setSelectedCourier(null);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getVehicleIcon = (vehicle: string) => {
        switch (vehicle.toLowerCase()) {
            case 'car': return '🚗';
            case 'motorcycle': return '🏍️';
            case 'bicycle': return '🚲';
            default: return '🚚';
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Courier Management</h1>
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
                            placeholder="Search couriers..."
                            className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                        >
                            <option value="all">All Couriers</option>
                            <option value="approved">Approved</option>
                            <option value="pending">Pending</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>

                {/* Couriers table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Courier
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Vehicle
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
                        {filteredCouriers.length > 0 ? (
                            filteredCouriers.map((courier) => (
                                <tr key={courier.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-gray-900">{courier.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-gray-500">{courier.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <span className="mr-2">{getVehicleIcon(courier.vehicle)}</span>
                                            <span>{courier.vehicle}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(courier.status)}`}>
                        {courier.status.charAt(0).toUpperCase() + courier.status.slice(1)}
                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleShowDetails(courier)}
                                                className="p-1.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                                                title="View Details"
                                            >
                                                <Info size={16} />
                                            </button>

                                            {courier.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(courier.id)}
                                                        className="p-1.5 bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors"
                                                        title="Approve"
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(courier.id)}
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
                                    No couriers found
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Courier details modal */}
            {selectedCourier && (
                <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-md">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold">Courier Details</h3>
                                <button onClick={closeDetails} className="text-gray-400 hover:text-gray-600">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Name</h4>
                                    <p className="mt-1">{selectedCourier.name}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Email</h4>
                                    <p className="mt-1">{selectedCourier.email}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                                    <p className="mt-1">{selectedCourier.phone}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Vehicle</h4>
                                    <p className="mt-1">
                                        <span className="mr-2">{getVehicleIcon(selectedCourier.vehicle)}</span>
                                        {selectedCourier.vehicle}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Join Date</h4>
                                    <p className="mt-1">{new Date(selectedCourier.joinDate).toLocaleDateString()}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Status</h4>
                                    <span className={`mt-1 inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedCourier.status)}`}>
                    {selectedCourier.status.charAt(0).toUpperCase() + selectedCourier.status.slice(1)}
                  </span>
                                </div>
                            </div>

                            {selectedCourier.status === 'pending' && (
                                <div className="mt-6 flex space-x-3">
                                    <button
                                        onClick={() => handleApprove(selectedCourier.id)}
                                        className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleReject(selectedCourier.id)}
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

export default CourierManagement;