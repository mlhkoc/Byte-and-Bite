// src/components/UserManagement.tsx

import React, { useState, useEffect, useCallback } from 'react';
import {
    Eye,
    UserX,
    Trash2,
    Search,
    UserCheck,
    UserMinus,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker"; // react-datepicker importu
import "react-datepicker/dist/react-datepicker.css"; // react-datepicker stilleri

// Backend'den gelecek UserManagementDTO'ya karşılık gelen interface
interface UserView {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    role: 'CUSTOMER' | 'RESTAURANT' | 'COURIER';
    approved: boolean;
    active: boolean;
    banned: boolean;
    banReason: string | null;
    submissionDate: string;
    deactivationEndDate?: string | null; // Backend DTO'suna uygun hale getirildi (Date string'i olabilir)
}

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<UserView[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Filtreleme ve arama state'leri
    const [roleFilter, setRoleFilter] = useState<string>('ALL');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [searchTerm, setSearchTerm] = useState<string>('');

    // Deaktivasyon modal state'leri
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
    const [selectedUserForDeactivation, setSelectedUserForDeactivation] = useState<UserView | null>(null);
    const [deactivationEndDate, setDeactivationEndDate] = useState<Date | null>(new Date()); // DatePicker için Date objesi
    const [deactivationReason, setDeactivationReason] = useState<string>("");

    const getAuthHeaders = useCallback((): HeadersInit | undefined => {
        const token = localStorage.getItem('token');
        if (!token) {
            // Hata yönetimi fetchUsers içinde yapılıyor, burada sadece undefined dön
            return undefined;
        }
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }, []);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        const headers = getAuthHeaders();
        if (!headers) {
            setIsLoading(false);
            if (!localStorage.getItem('token')) {
                navigate('/auth');
            }
            return;
        }

        const params = new URLSearchParams();
        if (roleFilter !== 'ALL') params.append('role', roleFilter);
        if (statusFilter !== 'ALL') params.append('status', statusFilter);
        if (searchTerm.trim() !== '') params.append('search', searchTerm.trim());
        const query = params.toString();

        try {
            const response = await fetch(`http://localhost:8080/api/admin/users?${query}`, { headers });

            if (response.status === 401 || response.status === 403) {
                setError("Unauthorized or Forbidden. Please log in again as admin.");
                navigate('/auth');
                return;
            }
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to fetch users');
            }
            const data: UserView[] = await response.json();
            setUsers(data);
        } catch (err: unknown) {
            console.error("Error fetching users:", err);
            if (err instanceof Error) {
                setError(err.message || 'An unknown error occurred while fetching users.');
            } else {
                setError('An unknown error occurred while fetching users.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [roleFilter, statusFilter, searchTerm, getAuthHeaders, navigate]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleViewDetails = (user: UserView) => {
        const details = `
            ID: ${user.id}
            Name: ${user.name}
            Email: ${user.email}
            Phone: ${user.phone || 'N/A'}
            Role: ${user.role}
            Approved: ${user.approved}
            Active: ${user.active}
            Banned: ${user.banned}
            Ban Reason: ${user.banReason || 'N/A'}
            Submitted: ${new Date(user.submissionDate).toLocaleString()}
            Deactivation End: ${user.deactivationEndDate ? new Date(user.deactivationEndDate).toLocaleString() : 'N/A'}
        `;
        alert(details);
    };

    // UserManagement.tsx - createApiRequestHandler fonksiyonu (Düzeltilmiş Hata Yönetimi)

    // UserManagement.tsx

    const createApiRequestHandler = async (url: string, method: string, body?: object): Promise<boolean> => {
        const headers = getAuthHeaders();
        if (!headers) {
            navigate('/auth'); // Token yoksa veya alınamadıysa login'e yönlendir
            return false;
        }

        try {
            const response = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });

            if (!response.ok) {
                let detailMessage = ""; // Backend'den gelen spesifik hata mesajı için
                try {
                    // Önce response'u text olarak almayı dene. Bu genellikle daha güvenilirdir.
                    const errorText = await response.text();
                    if (errorText) {
                        try {
                            // Alınan text'i JSON'a çevirmeyi dene
                            const jsonData = JSON.parse(errorText);
                            detailMessage = jsonData.message || jsonData.error || errorText; // JSON'dan mesajı al, yoksa text'i kullan
                        } catch (e) {
                            // JSON değilse, text'i olduğu gibi kullan
                            detailMessage = errorText;
                        }
                    }
                } catch (e) {
                    // Body okunamadıysa (çok nadir), logla
                    console.error("Could not read error response body", e);
                }

                // Genel hata mesajını oluştur
                const errorMessage = `API Error: ${response.status} ${response.statusText || 'Error'}${detailMessage ? ` - Details: ${detailMessage}` : ''}`;
                throw new Error(errorMessage);
            }

            // Başarılı yanıtlar için (opsiyonel mesaj gösterme)
            if (response.status !== 204 && response.headers.get("content-type")?.includes("application/json")) {
                try {
                    const responseData = await response.json();
                    if (responseData && responseData.message) {
                        // console.log("Success Message:", responseData.message);
                    }
                } catch (e) {
                    // console.log("Operation successful (no JSON message in success response).");
                }
            }
            return true;

        } catch (err: unknown) {
            if (err instanceof Error) {
                alert(`${err.message}`); // Artık daha detaylı hata mesajı alert'te görünecek
            } else {
                alert('An unknown error occurred during the API request.');
            }
            return false;
        }
    };

    const openDeactivateModal = (user: UserView) => {
        setSelectedUserForDeactivation(user);
        const oneWeekLater = new Date();
        oneWeekLater.setDate(oneWeekLater.getDate() + 7);
        setDeactivationEndDate(oneWeekLater);
        setDeactivationReason("");
        setShowDeactivateModal(true);
    };

    const handleConfirmDeactivate = async () => {
        if (!selectedUserForDeactivation || !deactivationEndDate) {
            alert("User or deactivation date is not set.");
            return;
        }
        if (deactivationEndDate < new Date()) {
            alert("Deactivation end date cannot be in the past.");
            return;
        }

        // Tarihi "yyyy-MM-ddTHH:mm" formatına çevir (backend'deki SimpleDateFormat ile uyumlu)
        const year = deactivationEndDate.getFullYear();
        const month = String(deactivationEndDate.getMonth() + 1).padStart(2, '0');
        const day = String(deactivationEndDate.getDate()).padStart(2, '0');
        const hours = String(deactivationEndDate.getHours()).padStart(2, '0');
        const minutes = String(deactivationEndDate.getMinutes()).padStart(2, '0');
        const formattedEndDate = `${year}-${month}-${day}T${hours}:${minutes}`;

        const success = await createApiRequestHandler(
            `http://localhost:8080/api/admin/users/${selectedUserForDeactivation.role.toLowerCase()}/${selectedUserForDeactivation.id}/deactivate`,
            'POST',
            { endDate: formattedEndDate, reason: deactivationReason }
        );

        if (success) {
            alert(`User ${selectedUserForDeactivation.name} will be deactivated until ${formattedEndDate}.`);
            setShowDeactivateModal(false);
            setSelectedUserForDeactivation(null);
            fetchUsers();
        }
    };

    const handleActivateUser = async (user: UserView) => {
        if (window.confirm(`Are you sure you want to activate ${user.name} immediately? This will remove any scheduled deactivation end date.`)) {
            const success = await createApiRequestHandler(
                `http://localhost:8080/api/admin/users/${user.role.toLowerCase()}/${user.id}/activate`,
                'POST'
            );
            if (success) {
                alert(`User ${user.name} activated successfully.`);
                fetchUsers();
            }
        }
    };

    const handleToggleBan = async (user: UserView) => {
        if (user.role === 'CUSTOMER') {
            // Müşteriler için banlama arayüzden engellendi, bu fonksiyon çağrılmamalı.
            // Güvenlik için bir kontrol olarak kalabilir.
            // alert("Customers cannot be banned.");
            return;
        }
        const newBanStatus = !user.banned;
        let banReasonInput: string | null = null;
        if (newBanStatus) {
            banReasonInput = prompt(`Enter reason for banning ${user.name} (Role: ${user.role}):`);
            if (banReasonInput === null) return;
        }

        if (window.confirm(`Are you sure you want to ${newBanStatus ? 'ban' : 'unban'} ${user.name}?`)) {
            const success = await createApiRequestHandler(
                `http://localhost:8080/api/admin/users/${user.role.toLowerCase()}/${user.id}/set-ban`,
                'POST',
                { banned: newBanStatus, banReason: newBanStatus ? banReasonInput : null }
            );
            if (success) {
                alert(`User ${user.name} ${newBanStatus ? 'banned' : 'unbanned'} successfully.`);
                fetchUsers();
            }
        }
    };

    const handleDeleteUser = async (user: UserView) => {
        if (window.confirm(`Are you sure you want to DELETE ${user.name} (ID: ${user.id}) permanently? This action cannot be undone.`)) {
            const success = await createApiRequestHandler(
                `http://localhost:8080/api/admin/users/${user.role.toLowerCase()}/${user.id}`,
                'DELETE'
            );
            if (success) {
                alert(`User ${user.name} deleted successfully.`);
                fetchUsers();
            }
        }
    };

    // Onay/Red için AdminDashboard'dan alınan fonksiyonlar (veya burada yeniden implemente edilebilir)
    // Bu fonksiyonlar AdminDashboard'da tanımlı ve oradan UserManagement'a props olarak geçirilebilir
    // veya context kullanılabilir. Şimdilik placeholder olarak bırakıyorum.
    const handleApproveRegistration = async (userId: number, userRole: string) => {
        const headers = getAuthHeaders();
        if (!headers) return;
        try {
            const response = await fetch(`http://localhost:8080/api/admin/approve-registration/${userRole.toLowerCase()}/${userId}`, {
                method: 'POST',
                headers: headers
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Failed to approve ${userRole} request`);
            }
            alert(`${userRole} with ID ${userId} approved successfully.`);
            fetchUsers(); // Kullanıcı listesini ve dolayısıyla pending listesini yenile
        } catch (err: any) {
            alert(`Error approving request: ${err.message}`);
        }
    };

    const handleRejectRegistration = async (userId: number, userRole: string) => {
        const headers = getAuthHeaders();
        if (!headers) return;
        try {
            const response = await fetch(`http://localhost:8080/api/admin/reject-registration/${userRole.toLowerCase()}/${userId}`, {
                method: 'POST',
                headers: headers
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Failed to reject ${userRole} request`);
            }
            alert(`${userRole} with ID ${userId} rejected successfully.`);
            fetchUsers();
        } catch (err: any) {
            alert(`Error rejecting request: ${err.message}`);
        }
    };


    if (isLoading) return <div className="p-4 text-center">Loading users...</div>;
    if (error) return <div className="p-4 text-red-500 text-center">Error: {error} <button onClick={fetchUsers} className="ml-2 text-blue-500 underline">Retry</button></div>;

    return (
        <div className="p-4 md:p-6">
            <h1 className="text-2xl font-semibold mb-6">User Management</h1>

            {/* Filtreler ve Arama */}
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg shadow">
                <div>
                    <label htmlFor="roleFilter" className="block text-sm font-medium text-gray-700 mb-1">Filter by Role</label>
                    <select
                        id="roleFilter"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="ALL">All Roles</option>
                        <option value="CUSTOMER">Customer</option>
                        <option value="RESTAURANT">Restaurant</option>
                        <option value="COURIER">Courier</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
                    <select
                        id="statusFilter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                        <option value="BANNED">Banned</option>
                        <option value="PENDING_APPROVAL">Pending Approval</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                    <div className="relative">
                        <input
                            id="searchTerm"
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by name, email, phone..."
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                        />
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    </div>
                </div>
            </div>

            {!isLoading && !error && users.length === 0 && (
                <div className="p-4 text-center text-gray-500">No users found matching your criteria.</div>
            )}

            {!isLoading && !error && users.length > 0 && (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name / ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={`${user.role}-${user.id}`} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                    <div className="text-xs text-gray-500">ID: {user.id}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        user.role === 'CUSTOMER' ? 'bg-green-100 text-green-800' :
                                            user.role === 'RESTAURANT' ? 'bg-blue-100 text-blue-800' :
                                                user.role === 'COURIER' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.phone || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {user.role === 'CUSTOMER' ? (
                                        user.active ? (
                                            <span className="px-2 py-1 text-xs font-medium bg-green-200 text-green-800 rounded-full">Active</span>
                                        ) : (
                                            <span className="px-2 py-1 text-xs font-medium bg-yellow-200 text-yellow-700 rounded-full" title={user.deactivationEndDate ? `Deactivated until ${new Date(user.deactivationEndDate).toLocaleDateString()}` : 'Deactivated'}>
                                                Deactivated {user.deactivationEndDate ? `(Until ${new Date(user.deactivationEndDate).toLocaleDateString()})` : ''}
                                            </span>
                                        )
                                    ) : ( // Restoran ve Kuryeler için
                                        !user.approved ? (
                                            <span className="px-2 py-1 text-xs font-medium bg-orange-200 text-orange-800 rounded-full">Pending Approval</span>
                                        ) : user.banned ? (
                                            <span className="px-2 py-1 text-xs font-medium bg-red-200 text-red-800 rounded-full" title={user.banReason || ''}>Banned</span>
                                        ) : !user.active && user.deactivationEndDate ? (
                                            <span className="px-2 py-1 text-xs font-medium bg-yellow-200 text-yellow-700 rounded-full" title={`Deactivated until ${new Date(user.deactivationEndDate).toLocaleString()}`}>
                                                Deactivated (Until {new Date(user.deactivationEndDate).toLocaleDateString()})
                                            </span>
                                        ): !user.active ? (
                                            <span className="px-2 py-1 text-xs font-medium bg-gray-200 text-gray-800 rounded-full">Inactive</span>
                                        ) : (
                                            <span className="px-2 py-1 text-xs font-medium bg-green-200 text-green-800 rounded-full">Active</span>
                                        )
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1">
                                    <button onClick={() => handleViewDetails(user)} className="p-1 text-gray-500 hover:text-blue-600" title="View Details">
                                        <Eye size={18} />
                                    </button>

                                    {(user.role === 'RESTAURANT' || user.role === 'COURIER') && !user.approved && (
                                        <>
                                            <button onClick={() => handleApproveRegistration(user.id, user.role)} className="p-1 text-green-500 hover:text-green-700" title="Approve Registration">
                                                <UserCheck size={18} />
                                            </button>
                                            <button onClick={() => handleRejectRegistration(user.id, user.role)} className="p-1 text-red-500 hover:text-red-700" title="Reject Registration">
                                                <UserX size={18} />
                                            </button>
                                        </>
                                    )}

                                    {user.approved && (
                                        <>
                                            {user.active ? (
                                                <button onClick={() => openDeactivateModal(user)} className="p-1 text-yellow-500 hover:text-yellow-700" title="Deactivate User Temporarily">
                                                    <UserMinus size={18} />
                                                </button>
                                            ) : (
                                                <button onClick={() => handleActivateUser(user)} className="p-1 text-green-500 hover:text-green-700" title="Activate User">
                                                    <UserCheck size={18} />
                                                </button>
                                            )}
                                            {(user.role === 'RESTAURANT' || user.role === 'COURIER') && (
                                                <button onClick={() => handleToggleBan(user)} className={`p-1 ${user.banned ? "text-green-500 hover:text-green-700" : "text-red-500 hover:text-red-700"}`} title={user.banned ? "Unban User" : "Ban User"}>
                                                    {user.banned ? <UserCheck size={18} /> : <UserX size={18} />}
                                                </button>
                                            )}
                                        </>
                                    )}
                                    <button onClick={() => handleDeleteUser(user)} className="p-1 text-red-600 hover:text-red-800" title="Delete User">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Deactivate User Modal */}
            {showDeactivateModal && selectedUserForDeactivation && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full flex justify-center items-center z-50 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                            Deactivate User: {selectedUserForDeactivation.name} ({selectedUserForDeactivation.role})
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="deactivationEndDate" className="block text-sm font-medium text-gray-700">
                                    Deactivate Until (Date and Time):
                                </label>
                                <DatePicker
                                    selected={deactivationEndDate}
                                    onChange={(date: Date | null) => setDeactivationEndDate(date)}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    dateFormat="yyyy-MM-dd HH:mm" // Daha standart bir format
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    minDate={new Date()} // Geçmiş tarih seçilemesin
                                    popperPlacement="top-start"
                                />
                            </div>
                            <div>
                                <label htmlFor="deactivationReason" className="block text-sm font-medium text-gray-700">
                                    Reason (Optional):
                                </label>
                                <textarea
                                    id="deactivationReason"
                                    rows={3}
                                    value={deactivationReason}
                                    onChange={(e) => setDeactivationReason(e.target.value)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                    placeholder="Enter reason for deactivation..."
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => { setShowDeactivateModal(false); setSelectedUserForDeactivation(null); }}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmDeactivate}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                disabled={!deactivationEndDate}
                            >
                                Deactivate User
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TicketManagement;