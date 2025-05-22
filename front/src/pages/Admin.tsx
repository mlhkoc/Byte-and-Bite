import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout.tsx';
import AdminDashboard from '../components/AdminDashboard.tsx';
import UserManagement from '../components/UserManagement.tsx';
import RestaurantManagement from '../components/RestaurantManagement.tsx';
import CourierManagement from '../components/CourierManagement.tsx';
import ReportsView from '../components/ReportsView.tsx';
import SettingsView from '../components/SettingsView.tsx';
import TicketManagement from '../components/TicketManagement.tsx';

type AdminSection = 'dashboard' | 'users' | 'restaurants' | 'couriers' | 'tickets'| 'reports' | 'settings' ;

const Admin: React.FC = () => {
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');

    useEffect(() => {
        // Check if user is admin
        const checkAdminStatus = async () => {
            try {
                // In a real app, you would verify with the backend
                // Here we're just checking local storage for a simple implementation
                const username = localStorage.getItem('adminUsername');
                setIsAdmin(username === 'admin');
            } catch (error) {
                console.error('Error checking admin status:', error);
                setIsAdmin(false);
            }
        };

        checkAdminStatus();
    }, []);

    if (isAdmin === null) {
        // Still loading
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (isAdmin === false) {
        // Not admin, redirect to auth
        return <Navigate to="/auth" replace />;
    }

    const renderActiveSection = () => {
        switch (activeSection) {
            case 'dashboard':
                return <AdminDashboard />;
            case 'users':
                return <UserManagement />;
            case 'restaurants':
                return <RestaurantManagement />;
            case 'couriers':
                return <CourierManagement />;
            case 'reports':
                return <ReportsView />;
            case 'settings':
                return <SettingsView />;
            case 'tickets':
                return <TicketManagement />;
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