import {
    LayoutDashboard,
    Menu,
    ShoppingBag,
    Star,
    Settings,
    MapPin,
    Clock,
    Store,
    LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
    activeSection: string;
    onSectionChange: (section: string) => void;
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'menu', label: 'Menu Management', icon: Menu },
        { id: 'orders', label: 'Orders', icon: ShoppingBag },
        { id: 'reviews', label: 'Reviews', icon: Star },
        { id: 'settings', label: 'Settings', icon: Settings },
        { id: 'delivery', label: 'Delivery Range', icon: MapPin },
        { id: 'hours', label: 'Business Hours', icon: Clock },
        { id: 'profile', label: 'Restaurant Profile', icon: Store },
    ];

    const navigate = useNavigate();

    return (
        <aside className="w-64 bg-white border-r border-gray-200 p-4">
            <nav className="space-y-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onSectionChange(item.id)}
                            className={`w-full flex items-center space-x-3 px-4 py-3 text-sm rounded-lg ${
                                activeSection === item.id
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            <button
                onClick={() => navigate("/logout")}
                className="mt-4 w-full flex items-center space-x-3 px-4 py-3 text-sm rounded-lg text-red-600 hover:bg-red-50"
            >
                <LogOut size={20} />
                <span>Logout</span>
            </button>
        </aside>
    );
}