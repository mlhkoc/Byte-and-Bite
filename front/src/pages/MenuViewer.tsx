import React, { useState } from 'react';
import { ShoppingCart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
}

const menuItems: MenuItem[] = [
    {
        id: 1,
        name: 'Classic Cheeseburger',
        description: 'Juicy beef patty with melted cheddar, fresh vegetables, and our special sauce',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 2,
        name: 'Grilled Chicken Salad',
        description: 'Fresh mixed greens with grilled chicken breast, avocado, and balsamic dressing',
        price: 14.99,
        image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 3,
        name: 'Margherita Pizza',
        description: 'Traditional Italian pizza with fresh mozzarella, tomatoes, and basil',
        price: 16.99,
        image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 4,
        name: 'Tuna Poke Bowl',
        description: 'Fresh tuna, rice, avocado, and seaweed with house-made poke sauce',
        price: 18.99,
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 5,
        name: 'Shrimp Pad Thai',
        description: 'Stir-fried rice noodles with shrimp, tofu, eggs, and traditional sauce',
        price: 15.99,
        image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 6,
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with molten center, served with vanilla ice cream',
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=800&q=80'
    }
];

function MenuViewer() {
    const [cartCount, setCartCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const { isLoggedIn } = useAuth();

    const filteredMenu = menuItems.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=50&h=50&q=80"
                            alt="Restaurant logo"
                            className="w-10 h-10 rounded-full object-cover" />
                        <h1 className="text-xl font-semibold text-gray-900">Downtown Delights Restaurant</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center text-yellow-400">
                            <Star className="w-5 h-5 fill-current" />
                            <span className="ml-1 text-gray-700">4.8</span>
                            <span className="text-gray-500 text-sm ml-1">(342 reviews)</span>
                        </div>
                        {isLoggedIn ? (
                            <>
                                <div className="relative">
                                    <ShoppingCart className="w-6 h-6 text-gray-700" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {cartCount}
                                        </span>
                                    )}
                                </div>
                            </>
                        ) : (<></>)}
                        
                    </div>
                </div>
            </header>

            {/* Search Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search for food..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Menu Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredMenu.map((item) => (
                        <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                                <p className="mt-1 text-gray-600 text-sm">{item.description}</p>
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-gray-900 font-medium">${item.price.toFixed(2)}</span>
                                    <button
                                        onClick={() => {
                                            if (isLoggedIn) {
                                                setCartCount(prev => prev + 1)
                                            }
                                            else {
                                                alert( 'Please sign in!' );
                                            }
                                        }}
                                        className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pagination */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center items-center space-x-2">
                <button className="p-2 rounded-md hover:bg-gray-100">
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="px-4 py-2 rounded-md bg-black text-white">1</button>
                <button className="px-4 py-2 rounded-md hover:bg-gray-100">2</button>
                <button className="px-4 py-2 rounded-md hover:bg-gray-100">3</button>
                <button className="p-2 rounded-md hover:bg-gray-100">
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}

export default MenuViewer;