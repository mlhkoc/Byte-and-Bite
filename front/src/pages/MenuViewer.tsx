import {useEffect, useState} from 'react';
import { ShoppingCart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {useParams} from "react-router-dom";
import {fetchCartItems} from "../services/CartApi.tsx";
import ErrorPopup from "../components/ErrorPopup";

interface MenuItem {
    id: number;
    name: string;
    image: string;
    price: number;
    restaurantEmail: string;
    description: string;
}

function MenuViewer() {

    const { restaurantId } = useParams();
    const [foods, setFoods] = useState<MenuItem[]>([]);

    interface Restaurant {
        id: number;
        name: string;
        cuisine: string;
        rating: number;
        deliveryTime: string;
        minOrder: number;
        image: string;
    }

    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

    useEffect(() => {
        if (!restaurantId) return;

        fetch(`http://localhost:8080/api/restaurants/id/${restaurantId}`, {
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => setRestaurant(data))
            .catch(err => console.error("Failed to fetch restaurant info:", err));
    }, [restaurantId]);


    useEffect(() => {
        if (!restaurantId) return;

        fetch(`http://localhost:8080/api/${restaurantId}/menu`, {
            method: 'GET',
            credentials: 'include',
        })
            .then((res) => res.json())
            .then((data) => setFoods(data))
            .catch((err) => console.error("Failed to fetch menu:", err));
    }, [restaurantId]);

    const [searchQuery, setSearchQuery] = useState("");
    const { isLoggedIn } = useAuth();
    const { items, addToCart, setIsCartOpen , setItems} = useCart();

    useEffect(() => {
        fetchCartItems().then(fetchedItems => setItems(fetchedItems));
    }, []);


    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const filteredMenu = foods.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.image.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const [popupTitle, setPopupTitle] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showError, setShowError] = useState(false);

    function showErrorPopup(title: string, msg: string) {
        setPopupTitle(title);
        setErrorMessage(msg);
        setShowError(true);
    }


    // If we hold rating counts in the database in the future
    // <span className="text-gray-500 text-sm ml-1">(342 reviews)</span>
    // after the rating
    return (
        <>
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=50&h=50&q=80"
                             alt="Restaurant logo"
                             className="w-10 h-10 rounded-full object-cover" />
                        <h1 className="text-xl font-semibold text-gray-900">{restaurant ? restaurant.name : "Loading..."}</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center text-yellow-400">
                            <Star className="w-5 h-5 fill-current" />
                            <span className="ml-1 text-gray-700">{restaurant ? restaurant.rating : "Loading..."}</span>
                        </div>
                        {isLoggedIn && (
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="relative"
                            >
                                <ShoppingCart className="w-6 h-6 text-gray-700" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        )}
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
                                                addToCart({
                                                    id: item.id,
                                                    name: item.name,
                                                    price: item.price,
                                                    image: item.image,
                                                    restaurantMail: item.restaurantEmail
                                                });
                                            } else {
                                                showErrorPopup( 'Error', 'Please sign in!' );
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
        {showError && (
            <ErrorPopup
                title={popupTitle}
                message={errorMessage}
                onClose={() => setShowError(false)}
            />
        )}
        </>
    );
}

export default MenuViewer;