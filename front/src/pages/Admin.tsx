import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout.tsx';
import AdminDashboard from '../components/AdminDashboard.tsx';
import UserManagement from '../components/UserManagement.tsx'; // Assuming this exists
import RestaurantManagement from '../components/RestaurantManagement.tsx'; // Assuming this exists
import CourierManagement from '../components/CourierManagement.tsx'; // Assuming this exists
import ReportsView from '../components/ReportsView.tsx'; // Assuming this exists
import SettingsView from '../components/SettingsView.tsx';
import TicketManagement from "../components/UserManagement.tsx"; // Assuming this exists

type AdminSection = 'dashboard' | 'users' | 'restaurants' | 'couriers' | 'reports' | 'settings';

const Admin: React.FC = () => {
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
    // const { token, role } = useAuth(); // If admin logged in via main login and had a token/role

    useEffect(() => {
        // Check if user is admin
        const checkAdminStatus = () => {
            // Current simple check for "admin" hardcoded login
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('role');
            setIsAdmin(!!token && role === 'ADMIN');

            // Example of a more robust check if admin logged in via JWT:
            // const storedToken = localStorage.getItem('token');
            // const storedRole = localStorage.getItem('role');
            // setIsAdmin(!!storedToken && storedRole === 'ADMIN');
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
            case 'dashboard':
                return <AdminDashboard />;
            case 'users':
                return <TicketManagement />;
            case 'restaurants':
                return <RestaurantManagement />;
            case 'couriers':
                return <CourierManagement />;
            case 'reports':
                return <ReportsView />;
            case 'settings':
                return <SettingsView />;
            default:
                return <AdminDashboard />;
        }
    };

    return (
        <AdminLayout activeSection={activeSection} onSectionChange={setActiveSection}>
            {renderActiveSection()}
        </AdminLayout>
    );
};

export default Admin;