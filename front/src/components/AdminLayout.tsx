// AdminLayout.tsx

import React from 'react';
import {
    LayoutDashboard,
    Users, // Bu zaten var, User Management için kullanılacak
    Utensils,
    Truck,
    BarChart,
    Settings,
    LogOut,
    ShieldAlert, // Örnek olarak Ticket Management için farklı bir ikon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext'; // Eğer logout için kullanılacaksa

// AdminSection tipine 'users' zaten ekliydi, eğer başka bölümler eklenecekse buraya da eklenir.
// type AdminSection = 'dashboard' | 'users' | 'restaurants' | 'couriers' | 'reports' | 'settings' | 'tickets';
// Yukarıdaki type Admin.tsx içinde tanımlı, burada tekrar tanımlamaya gerek yok.
// Props'taki AdminSection tipini Admin.tsx'ten import edebiliriz veya eşleştiğinden emin olabiliriz.
// Şimdilik Admin.tsx'teki type ile uyumlu olduğunu varsayıyorum.

interface AdminLayoutProps {
    children: React.ReactNode;
    activeSection: string; // Daha genel tutabiliriz veya Admin.tsx'teki type'ı import edebiliriz
    onSectionChange: (section: string) => void; // Aynı şekilde
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
                                                     children,
                                                     activeSection,
                                                     onSectionChange
                                                 }) => {
    const navigate = useNavigate();
    // const { logout } = useAuth(); // Eğer AuthContext'ten logout kullanılacaksa

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { id: 'users', label: 'User Management', icon: <Users size={20} /> }, // Bu öğe zaten var veya eklenmeli
        { id: 'pending-registrations', label: 'Pending Approvals', icon: <ShieldAlert size={20} /> }, // Dashboard yerine ayrı bir sayfa olabilir
        // Diğer mevcut öğeler...
        // { id: 'restaurants', label: 'Restaurants', icon: <Utensils size={20} /> }, // Eğer User Management'tan ayrı yönetilecekse
        // { id: 'couriers', label: 'Couriers', icon: <Truck size={20} /> }, // Eğer User Management'tan ayrı yönetilecekse
        { id: 'reports', label: 'Reports', icon: <BarChart size={20} /> },
        { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
    ];

    const handleLogout = () => {
        // logout(); // AuthContext'ten gelen logout
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        // localStorage.removeItem('adminUsername'); // Bu eski yöntemdi
        navigate('/auth');
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-md flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <h1 className="text-xl font-bold">Byte and Bite</h1>
                    <p className="text-sm text-gray-500">Admin Dashboard</p>
                </div>
                <nav className="mt-4 flex-grow">
                    <ul>
                        {navItems.map(item => (
                            <li key={item.id} className="mb-1">
                                <button
                                    onClick={() => onSectionChange(item.id)}
                                    className={`flex items-center px-4 py-3 w-full text-left hover:bg-gray-100 transition-colors ${
                                        activeSection === item.id ? 'bg-gray-100 text-black font-medium' : 'text-gray-700'
                                    }`}
                                >
                                    <span className="mr-3">{item.icon}</span>
                                    <span>{item.label}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
                {/* Logout Button */}
                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="flex items-center px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 transition-colors rounded-md"
                    >
                        <LogOut size={20} className="mr-3" />
                        <span>Log Out</span>
                    </button>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 overflow-auto">
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};

export default AdminLayout;