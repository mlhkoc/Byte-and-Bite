import {useEffect, useState} from 'react';
import { Search, SlidersHorizontal, ShoppingCart, User, Pizza,LogOut, Menu, Fish, Drumstick, IceCream, Heart, Clock, DollarSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
// import logo from '../assets/logo.jpg';
import {fetchCartItems} from "../services/CartApi.tsx";
// import { DropdownMenu } from '../components/DropdownMenu.tsx';
import { CustomerHeader } from '../components/Header.tsx';

interface Restaurant {
    id: number;
    name: string;
    cuisine: string;
    // price: string; // DTO'da price yok, minOrder var. Bu alan gerekiyorsa DTO'ya eklenmeli.
    rating: number;
    deliveryTime: string;
    minOrder: number; // DTO'da double, burada string'di, number'a çevirdim.
    image: string | null; // Resim null olabilir
    isFavorite: boolean; // Bu frontend state'i, backend'den gelmiyor olabilir.
    address?: string; // Yeni eklendi, opsiyonel olabilir
}

function Home() {
    // const navigate = useNavigate();
    const { items, setItems} = useCart();
    // const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);






    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    useEffect(() => {
        fetch('http://localhost:8080/api/restaurants') // credentials: 'include' GET isteklerinde genellikle gereksiz
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then((data: Restaurant[]) => { // Gelen veriyi Restaurant[] olarak tipleyin
                // isFavorite alanını her restorana ekle (varsayılan false)
                const restaurantsWithFavorite = data.map(r => ({ ...r, isFavorite: false, minOrder: Number(r.minOrder) }));
                setRestaurants(restaurantsWithFavorite);
            })
            .catch((err) => console.error("Failed to fetch restaurants", err));
    }, []);




    const categories = [
        { name: "Pizza", icon: <Pizza className="w-6 h-6" />, cuisine: "Italian" },
        { name: "Burgers", icon: <Menu className="w-6 h-6" />, cuisine: "American" },
        { name: "Sushi", icon: <Fish className="w-6 h-6" />, cuisine: "Japanese" },
        { name: "Chicken", icon: <Drumstick className="w-6 h-6" />, cuisine: "Chicken" },
        { name: "Desserts", icon: <IceCream className="w-6 h-6" />, cuisine: "Desserts" },
        { name: "Döner", icon: <Drumstick className="w-6 h-6" />, cuisine: "Döner" },
        { name: "Kebap", icon: <Drumstick className="w-6 h-6" />, cuisine: "Kebap" },
        { name: "Thai", icon: <Fish className="w-6 h-6" />, cuisine: "Thai" }
    ];

    const { isLoggedIn } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const toggleFavorite = (restaurantId: number) => {
        setRestaurants(restaurants.map(restaurant =>
            restaurant.id === restaurantId
                ? { ...restaurant, isFavorite: !restaurant.isFavorite }
                : restaurant
        ));
    };
    useEffect(() => {
        if (isLoggedIn) {
            fetchCartItems().then(fetchedItems => setItems(fetchedItems));
        }
    }, [isLoggedIn]);
    useEffect(() => {
        console.log(localStorage.getItem("user"))
        fetch('http://localhost:8080/api/restaurants', {
            method: 'GET',
        })
            .then((res) => res.json())
            .then((data) => setRestaurants(data))
            .catch((err) => console.error("Failed to fetch restaurants", err));
    }, []);

    const favoriteRestaurants = restaurants.filter(r => r.isFavorite);

    const filteredRestaurants = restaurants.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory ? r.cuisine === selectedCategory : true)
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Header */}
            {/*<button*/}
            {/*    onClick={logout}*/}
            {/*    className="p-2 hover:bg-gray-100 rounded-full relative"*/}
            {/*>*/}
            {/*    <LogOut className="w-6 h-6"/>*/}


            {/*</button>*/}
            <CustomerHeader/>
            {/* Search Bar */}
            <div className="flex gap-2 mb-8">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                    <input
                        type="text"
                        placeholder="Search for restaurants or dishes"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                    <SlidersHorizontal className="w-5 h-5"/>
                </button>
            </div>


            {/* Categories */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Categories</h2>
                <div className="flex gap-4 overflow-x-auto pb-2">
                    {categories.map((category, index) => (
                        <button
                            key={index}
                            onClick={() =>
                                setSelectedCategory(prev =>
                                    prev === category.cuisine ? null : category.cuisine
                                )
                            }
                            className={`flex flex-col items-center p-4 min-w-[80px] rounded-full transition-colors ${
                                selectedCategory === category.cuisine
                                    ? 'bg-orange-300 text-white'
                                    : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                        >
                            {category.icon}
                            <span className="text-sm mt-1">{category.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Favorite Restaurants */}
            {favoriteRestaurants.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Favorite Restaurants</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {favoriteRestaurants.map(restaurant => (
                            <RestaurantCard
                                key={restaurant.id}
                                restaurant={restaurant}
                                onFavoriteToggle={toggleFavorite}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* All Restaurants */}
            <div>
                <h2 className="text-xl font-semibold mb-4">All Restaurants</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredRestaurants.length > 0 ? (
                        filteredRestaurants.map(restaurant => (
                            <RestaurantCard
                                key={restaurant.id}
                                restaurant={restaurant}
                                onFavoriteToggle={toggleFavorite}
                            />
                        ))
                    ) : (
                        <div className="text-gray-500">No matching restaurants found.</div>
                    )}
                </div>
            </div>


        </div>
    );
}

interface RestaurantCardProps {
    restaurant: Restaurant;
    onFavoriteToggle: (id: number) => void;
}

function RestaurantCard({restaurant, onFavoriteToggle}: RestaurantCardProps) {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(`/${restaurant.id}/menu`)}
            className="relative bg-white rounded-lg overflow-hidden shadow-md w-full text-left"
        >
            <img
                src={restaurant.image}
                alt={restaurant.name}
                className="w-full h-48 object-cover"
            />
            <div className="p-4 relative">
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        onFavoriteToggle(restaurant.id);
                    }}
                    className="absolute top-2 right-2 text-red-500 cursor-pointer"
                >
                    <Heart fill={restaurant.isFavorite ? 'red' : 'none'} />
                </div>
                <h3 className="text-lg font-semibold">{restaurant.name}</h3>
                <div className="text-sm text-gray-500 mb-2">{restaurant.cuisine}</div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {restaurant.deliveryTime}</span>
                    <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> {restaurant.minOrder}</span>
                </div>
            </div>
        </button>
    );
}

export default Home;
