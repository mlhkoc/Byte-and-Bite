import React, { createContext, useContext, useState, useEffect } from 'react';
import {clearCart, fetchCartItems, removeCartItem, updateCartQuantity} from "../components/CartApi.tsx";

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
    restaurantMail: string;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'>) => void;
    removeFromCart: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    clearCartItems: () => void;
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
    setItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
    total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const username = localStorage.getItem("user");

    useEffect(() => {
        fetchCartItems().then(fetchedItems => setItems(fetchedItems));
    }, []);


    const addToCart = (async (item: Omit<CartItem, 'quantity'>) => {
        const response = await fetch(`http://localhost:8080/api/cart/${username}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(item),
        });
        if (!response.ok) throw new Error('Failed to add item to cart');
        const updatedItems = await fetchCartItems();
        setItems(updatedItems);
    });

    const removeFromCart = async (id: number) => {
        await removeCartItem(id);
        const updatedItems = await fetchCartItems();
        setItems(updatedItems);
    };

    const updateQuantity = async (id: number, quantity: number) => {
        await updateCartQuantity(id, quantity);
        const updatedItems = await fetchCartItems();
        setItems(updatedItems);
    };

    const clearCartItems = async () => {
        try {
            await clearCart(); // Await for the API call result
            setItems([]);
        } catch (error) {
            console.error('Error clearing cart:', error);
        }
    };

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCartItems,
            isCartOpen,
            setIsCartOpen,
            setItems,
            total
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}