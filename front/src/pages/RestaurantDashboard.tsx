import { useEffect, useState } from 'react';
import { MenuManagement } from '../components/MenuManagement';
import { OrdersList } from '../components/OrdersList';
import { Sidebar } from '../components/Sidebar';
import { Stats } from '../components/Stats';
import { Reviews } from '../components/Reviews';
import {useNavigate} from "react-router-dom";
import RestaurantProfilePage from '../pages/RestaurantProfilePage';

interface Restaurant {
    id: number;
    name: string;
    cuisine: string;
    rating: number;
    deliveryTime: string;
    minOrder: number;
    image: string;
}

function Restaurant() {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [showReviews, setShowReviews] = useState(false);
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/restaurant`, {
                    credentials: 'include',
                    headers:{
                        Authorization: `Bearer ${token}`

                    }
                });
                if (res.status == 403) navigate("/not-authorized")
                const data = await res.json();
                setRestaurant(data);
            } catch (err) {
                console.error('Failed to fetch restaurant:', err);
            }
        };


        fetchRestaurant();

    }, []);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

            <main className="flex-1 p-8">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">{ restaurant?.name }</h1>
                </header>

                {activeSection === 'dashboard' && (
                    <>
                        <Stats />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                            <MenuManagement />
                            <OrdersList />
                        </div>
                        {showReviews && <Reviews onClose={() => setShowReviews(false)} />}
                    </>
                )}
            
                {activeSection === 'restaurantProfile' && (
                    <RestaurantProfilePage />
                )}
    </main>
        </div>
    );
}

export default Restaurant;