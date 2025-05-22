import React, { useState, useEffect } from 'react';
import { Check, X, User as UserIcon, Utensils, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Opsiyonel: Token yoksa login'e yönlendirme için

interface RegistrationRequest {
    id: number;
    name: string;
    email: string;
    type: 'CUSTOMER' | 'RESTAURANT' | 'COURIER';
    submissionDate: string;
}

// Mock data for Banned Users section (Bu kısım backend'e bağlanmadıysa mock olarak kalabilir)
const mockBannedUsers = [
    { email: 'john.doe@email.com', time: '2 hours ago' },
    { email: 'sarah.smith@email.com', time: '1 day ago' },
    { email: 'mike.wilson@email.com', time: '2 days ago' }
];

const AdminDashboard: React.FC = () => {
    const [registrationRequests, setRegistrationRequests] = useState<RegistrationRequest[]>([]);
    const [bannedUsers, setBannedUsers] = useState(mockBannedUsers);
    const [emailToBan, setEmailToBan] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate(); // Opsiyonel

    const getAuthHeaders = (): HeadersInit | undefined => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError("Authentication token not found. Please log in.");
            // navigate('/auth'); // Opsiyonel: Kullanıcıyı login sayfasına yönlendir
            return undefined;
        }
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' // Genellikle POST/PUT/PATCH için gereklidir
        };
    };

    useEffect(() => {
        const fetchRequests = async () => {
            setIsLoading(true);
            setError(null);
            const headers = getAuthHeaders();
            if (!headers) {
                setIsLoading(false);
                return; // Token yoksa veya alınamadıysa isteği yapma
            }

            try {
                const response = await fetch('http://localhost:8080/api/admin/pending-registrations', { headers });

                if (response.status === 401 || response.status === 403) {
                    setError("Unauthorized or Forbidden. Please log in again as admin.");
                    // navigate('/auth'); // Opsiyonel
                    setIsLoading(false);
                    return;
                }
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || 'Failed to fetch registration requests');
                }
                const data: RegistrationRequest[] = await response.json();
                setRegistrationRequests(data);
            } catch (err: any) {
                console.error("Error fetching requests:", err);
                setError(err.message || 'An unknown error occurred.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchRequests();
    }, [navigate]); // navigate'i dependency array'e ekledik eğer kullanıyorsak

    const handleApprove = async (entityId: number, type: string) => {
        const headers = getAuthHeaders();
        if (!headers) return;

        try {
            const response = await fetch(`http://localhost:8080/api/admin/approve-registration/${type.toLowerCase()}/${entityId}`, {
                method: 'POST',
                headers: headers
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText ||`Failed to approve ${type} request`);
            }
            // Backend'den gelen mesajı gösterebiliriz veya direkt listeyi güncelleyebiliriz
            // const result = await response.json();
            // alert(result.message);
            setRegistrationRequests(prev => prev.filter(r => !(r.id === entityId && r.type.toUpperCase() === type.toUpperCase())));
        } catch (err: any) {
            console.error("Error approving request:", err);
            alert(err.message || 'Failed to approve request.');
        }
    };

    const handleReject = async (entityId: number, type: string) => {
        const headers = getAuthHeaders();
        if (!headers) return;

        try {
            const response = await fetch(`http://localhost:8080/api/admin/reject-registration/${type.toLowerCase()}/${entityId}`, {
                method: 'POST',
                headers: headers
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Failed to reject ${type} request`);
            }
            // const result = await response.json();
            // alert(result.message);
            setRegistrationRequests(prev => prev.filter(r => !(r.id === entityId && r.type.toUpperCase() === type.toUpperCase())));
        } catch (err: any) {
            console.error("Error rejecting request:", err);
            alert(err.message || 'Failed to reject request.');
        }
    };

    // Ban User section handlers (Bu kısım için backend entegrasyonu yapılmadıysa mock olarak kalır)
    const handleBanUser = () => {
        if (emailToBan.trim() === '') return;
        // TODO: Backend'e ban user isteği gönderilmeli (eğer backend'de bu endpoint varsa)
        // Örnek:
        // const headers = getAuthHeaders();
        // if (!headers) return;
        // fetch('http://localhost:8080/api/admin/ban', {
        //     method: 'POST',
        //     headers: headers,
        //     body: JSON.stringify({ email: emailToBan })
        // }).then(response => {
        //     if (response.ok) {
        //         setBannedUsers([{ email: emailToBan, time: 'just now' }, ...bannedUsers]);
        //         setEmailToBan('');
        //         alert('User banned successfully');
        //     } else {
        //         alert('Failed to ban user');
        //     }
        // }).catch(err => alert('Error banning user: ' + err.message));
        console.warn("Ban user functionality is not fully implemented with backend yet.");
        setBannedUsers([{ email: emailToBan, time: 'just now' }, ...bannedUsers]);
        setEmailToBan('');
    };

    const handleUnban = (email: string) => {
        // TODO: Backend'e unban user isteği gönderilmeli
        console.warn("Unban user functionality is not fully implemented with backend yet.");
        setBannedUsers(bannedUsers.filter(user => user.email !== email));
    };

    const getRequestTypeDetails = (type: 'CUSTOMER' | 'RESTAURANT' | 'COURIER') => {
        switch (type) {
            case 'RESTAURANT':
                return { icon: <Utensils size={18} className="text-blue-600" />, title: 'Restaurant Registration', color: 'bg-blue-50 border-blue-100', iconBg: 'bg-blue-100' };
            case 'COURIER':
                return { icon: <Truck size={18} className="text-indigo-600" />, title: 'Courier Application', color: 'bg-indigo-50 border-indigo-100', iconBg: 'bg-indigo-100' };
            case 'CUSTOMER':
                return { icon: <UserIcon size={18} className="text-green-600" />, title: 'Customer Registration', color: 'bg-green-50 border-green-100', iconBg: 'bg-green-100' };
            default:
                // Bu durum olmamalı ama bir fallback
                const exhaustiveCheck: never = type;
                return { icon: <UserIcon size={18} />, title: 'Registration Request', color: 'bg-gray-50 border-gray-100', iconBg: 'bg-gray-100' };
        }
    };


    if (error && (error.includes("Unauthorized") || error.includes("Forbidden") || error.includes("token not found")) ) {
        return (
            <div className="p-5 text-center">
                <p className="text-red-500 text-lg mb-4">{error}</p>
                <button
                    onClick={() => navigate('/auth')}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Go to Login
                </button>
            </div>
        );
    }


    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Registration Requests */}
            <div className="bg-white p-5 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Pending Registration Requests</h2>
                {isLoading && <p>Loading requests...</p>}
                {error && !isLoading && <p className="text-red-500">Error: {error}</p>}
                {!isLoading && !error && registrationRequests.length === 0 && <p>No pending registration requests.</p>}

                <div className="space-y-4">
                    {registrationRequests.map(request => {
                        const typeDetails = getRequestTypeDetails(request.type);
                        return (
                            <div key={`${request.type}-${request.id}`} className={`p-4 border rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between ${typeDetails.color} space-y-2 sm:space-y-0`}>
                                <div className="flex items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${typeDetails.iconBg} flex-shrink-0`}>
                                        {typeDetails.icon}
                                    </div>
                                    <div className="min-w-0"> {/* Yazıların taşmasını engellemek için */}
                                        <div className="font-medium truncate" title={typeDetails.title}>{typeDetails.title}</div>
                                        <div className="text-sm text-gray-600 truncate" title={`${request.name} (${request.email})`}>
                                            {request.name} ({request.email})
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            Submitted: {new Date(request.submissionDate).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex space-x-2 flex-shrink-0 self-end sm:self-center">
                                    <button
                                        onClick={() => handleApprove(request.id, request.type)}
                                        className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center text-xs sm:text-sm"
                                    >
                                        <Check size={16} className="mr-1" />
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleReject(request.id, request.type)}
                                        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center text-xs sm:text-sm"
                                    >
                                        <X size={16} className="mr-1" />
                                        Reject
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Ban User Section (Mock Data veya Backend'e bağlanacak) */}
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
                <h3 className="font-medium mb-3">Recently Banned Users (Mock Data)</h3>
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