import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import {useEffect} from "react";
import {fetchCartItems} from "./CartApi.tsx";


export function CartModal() {
    const username = localStorage.getItem("user");

    const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, total, setItems } = useCart();
    const navigate = useNavigate();
    useEffect(() => {
        fetchCartItems().then(fetchedItems => setItems(fetchedItems));
    }, []);


    if (!isCartOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
            <div className="bg-white w-full max-w-md h-full flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Your Cart</h2>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    {items.length === 0 ? (
                        <div className="text-center text-gray-500 mt-8">
                            Your cart is empty
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map(item => (
                                <div key={item.id} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-20 h-20 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-medium">{item.name}</h3>
                                        <p className="text-gray-600">${item.price.toFixed(4)}</p>
                                        <div className="flex items-center space-x-2 mt-2">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="p-1 hover:bg-gray-200 rounded"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-1 hover:bg-gray-200 rounded"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="p-1 hover:bg-red-100 text-red-500 rounded ml-2"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        ${(item.price * item.quantity).toFixed(4)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="border-t p-4">
                    <div className="flex justify-between items-center mb-4">
                        <span className="font-semibold">Total</span>
                        <span className="font-semibold">${total.toFixed(4)}</span>
                    </div>
                    <button
                        className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
                        onClick={() => {
                            setIsCartOpen(false);
                            navigate(`/checkout/${username}`);
                        }}
                    >
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    );
}