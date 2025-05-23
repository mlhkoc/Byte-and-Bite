// Admin.tsx
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout.tsx';
import AdminDashboard from '../components/AdminDashboard.tsx'; // Bu, pending approvals ve ban user'ı içeriyor
import UserManagement from '../components/UserManagement.tsx'; // YENİ COMPONENT
// import RestaurantManagement from '../components/RestaurantManagement.tsx'; // Bunlar UserManagement'a dahil edilebilir
// import CourierManagement from '../components/CourierManagement.tsx';    // veya ayrı kalabilir
import ReportsView from '../components/ReportsView.tsx';
import SettingsView from '../components/SettingsView.tsx';

// Bu type AdminLayout ile paylaşılabilir veya merkezi bir type dosyasında olabilir.
type AdminSection = 'dashboard' | 'users' | 'pending-registrations' | 'reports' | 'settings'; // 'restaurants' ve 'couriers' yerine 'users' geldi.

const Admin: React.FC = () => {
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');

    useEffect(() => {
        const checkAdminStatus = () => {
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('role');
            setIsAdmin(!!token && role === 'ADMIN');
        };
        checkAdminStatus();
    }, []);

    if (isAdmin === null) {
        return <div className="flex items-center justify-center min-h-screen">Loading admin status...</div>;
    }

    if (isAdmin === false) {
        return <Navigate to="/auth" replace />;
    }

    const renderActiveSection = () => {
        switch (activeSection) {
            case 'dashboard': // Bu, pending approvals ve ban user'ı gösterebilir
                return <AdminDashboard />;
            case 'users': // YENİ BÖLÜM
                return <UserManagement />;
            // case 'pending-registrations': // Eğer AdminDashboard'dan ayırmak isterseniz
            //     return <PendingRegistrationsComponent />; // Ayrı bir component
            // case 'restaurants': // Artık UserManagement altında
            //     return <RestaurantManagement />;
            // case 'couriers': // Artık UserManagement altında
            //     return <CourierManagement />;
            case 'reports':
                return <ReportsView />;
            case 'settings':
                return <SettingsView />;
            default:
                return <AdminDashboard />;
        }
    };

    return (
        <AdminLayout activeSection={activeSection} onSectionChange={(section) => setActiveSection(section as AdminSection)}>
            {renderActiveSection()}
        </AdminLayout>
    );
};

export default Admin;