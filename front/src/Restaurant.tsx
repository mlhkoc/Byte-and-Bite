import { useState } from 'react';
import { MenuManagement } from './components/MenuManagement';
import { OrdersList } from './components/OrdersList';
import { Sidebar } from './components/Sidebar';
import { Stats } from './components/Stats';
import { Reviews } from './components/Reviews';

function Restaurant() {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [showReviews, setShowReviews] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

            <main className="flex-1 p-8">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">Italian Corner Restaurant</h1>
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
            </main>
        </div>
    );
}

export default Restaurant;