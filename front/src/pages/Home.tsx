import { useState } from 'react';
import { Search, SlidersHorizontal, ShoppingCart, User, Pizza, Merge as Burger, Fish, Drumstick, IceCream, Heart, Clock, DollarSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.jpg';

interface Restaurant {
    id: number;
    name: string;
    cuisine: string;
    price: string;
    rating: number;
    deliveryTime: string;
    minOrder: string;
    image: string;
    isFavorite: boolean;
}

function Home() {
    const navigate = useNavigate();
    const { items, setIsCartOpen } = useCart();
    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const [restaurants, setRestaurants] = useState<Restaurant[]>([
        {
            id: 1,
            name: "Burger House",
            cuisine: "American",
            price: "$$",
            rating: 4.7,
            deliveryTime: "20-30 min",
            minOrder: "$20",
            image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800",
            isFavorite: true
        },
        {
            id: 2,
            name: "Thai Delight",
            cuisine: "Thai",
            price: "$$",
            rating: 4.6,
            deliveryTime: "25-35 min",
            minOrder: "$18",
            image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=800",
            isFavorite: true
        },
        {
            id: 3,
            name: "Pizza Palace",
            cuisine: "Italian",
            price: "$$",
            rating: 4.9,
            deliveryTime: "25-35 min",
            minOrder: "$15",
            image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
            isFavorite: false
        },
        {
            id: 4,
            name: "Sushi Master",
            cuisine: "Japanese",
            price: "$$$",
            rating: 4.9,
            deliveryTime: "30-40 min",
            minOrder: "$25",
            image: "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?auto=format&fit=crop&q=80&w=800",
            isFavorite: false
        },
        {
            id: 5,
            name: "Kral Döner",
            cuisine: "Döner",
            price: "$",
            rating: 4.5,
            deliveryTime: "20-25 min",
            minOrder: "$10",
            image: "https://images.deliveryhero.io/image/fd-tr/LH/lx5b-listing.jpg",
            isFavorite: false
        },
        {
            id: 6,
            name: "Ocakbaşı Kebap",
            cuisine: "Kebap",
            price: "$$",
            rating: 4.8,
            deliveryTime: "30-40 min",
            minOrder: "$22",
            image: "https://media.istockphoto.com/id/1408897449/tr/foto%C4%9Fraf/adana-kebab-served-in-a-wooden-cutting-board-isolated-on-wooden-background-side-view.jpg?s=612x612&w=0&k=20&c=cD4HT1eEb4BFfIbRTvaJ90QjAs6xnDB-Ih0dO_x4ngQ=",
            isFavorite: false
        }


    ]);

    const categories = [
        { name: "Pizza", icon: <Pizza className="w-6 h-6" />, cuisine: "Italian" },
        { name: "Burgers", icon: <Burger className="w-6 h-6" />, cuisine: "American" },
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

    const favoriteRestaurants = restaurants.filter(r => r.isFavorite);

    const filteredRestaurants = restaurants.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory ? r.cuisine === selectedCategory : true)
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <img src={logo} alt="Logo" className="h-10 w-auto" />
                <div className="flex gap-4">
                    {isLoggedIn ? (
                        <>
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="p-2 hover:bg-gray-100 rounded-full relative"
                            >
                                <ShoppingCart className="w-6 h-6" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-full">
                                <User className="w-6 h-6" />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/auth?mode=login">
                                <button className="p-2 px-4 hover:bg-gray-100 rounded-full font-semibold">Login</button>
                            </Link>
                            <Link to="/auth?mode=signup">
                                <button className="p-2 px-4 hover:bg-gray-100 rounded-full font-semibold">Signup</button>
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* Search Bar */}
            <div className="flex gap-2 mb-8">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search for restaurants or dishes"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                    <SlidersHorizontal className="w-5 h-5" />
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

            {/* Sign Up Buttons */}
            <div className="fixed bottom-4 left-4 flex gap-4">
                <button
                    onClick={() => navigate('/restaurant')}
                    className="px-3 py-1.5 bg-orange-300 text-white text-xs rounded-lg hover:bg-orange-400"
                >
                    Join as Restaurant
                </button>
                <button className="px-3 py-1.5 bg-orange-700 text-white text-xs rounded-lg hover:bg-orange-800">
                    Join as Courier
                </button>
            </div>
        </div>
    );
}

interface RestaurantCardProps {
    restaurant: Restaurant;
    onFavoriteToggle: (id: number) => void;
}

function RestaurantCard({ restaurant, onFavoriteToggle }: RestaurantCardProps) {
    return (
        <div className="bg-white shadow rounded-xl overflow-hidden">
            <img
                src={restaurant.image}
                alt={restaurant.name}
                className="w-full h-48 object-cover"
            />
            <div className="p-4 relative">
                <button
                    onClick={() => onFavoriteToggle(restaurant.id)}
                    className="absolute top-2 right-2 text-red-500"
                >
                    <Heart fill={restaurant.isFavorite ? 'red' : 'none'} />
                </button>
                <h3 className="text-lg font-semibold">{restaurant.name}</h3>
                <div className="text-sm text-gray-500 mb-2">{restaurant.cuisine}</div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {restaurant.deliveryTime}</span>
                    <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> {restaurant.minOrder}</span>
                </div>
                <div className="mt-2 text-sm text-gray-500">Rating: {restaurant.rating}</div>
            </div>
        </div>
    );
}

export default Home;
