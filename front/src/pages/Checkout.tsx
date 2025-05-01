import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useParams } from "react-router-dom";

interface DeliveryForm {
    streetAddress: string;
    apartment: string;
    city: string;
    instructions: string;
    saveAddress: boolean;
}

interface PaymentMethod {
    type: 'card' | 'cash';
    cardNumber?: string;
    expiration?: string;
    cvv?: string;
    nameOnCard?: string;
}

export default function Checkout() {
    const navigate = useNavigate();
    const { items, total, clearCartItems } = useCart();
    const [deliveryForm, setDeliveryForm] = useState<DeliveryForm>({
        streetAddress: '',
        apartment: '',
        city: '',
        instructions: '',
        saveAddress: false,
    });
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
        type: 'card',
    });

    const customerEmail = localStorage.getItem("user");
    const { restaurantMail } = useParams();

    const handleDeliveryFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setDeliveryForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPaymentMethod(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!restaurantMail) {
                alert("Missing restaurant information.");
                return;
            }

            // 1. Get restaurantId using restaurantMail (you must create this backend endpoint)
            const restaurantId = await fetch(`http://localhost:8080/api/restaurant-id/${restaurantMail}`, {
                credentials: "include"
            }).then(res => {
                if (!res.ok) throw new Error("Restaurant lookup failed");
                return res.json();
            });

            // 2. Prepare the correct payload
            const payload = {
                restaurantId,
                items: items.map(item => ({
                    foodId: item.id,
                    quantity: item.quantity
                }))
            };

            // 3. Send order
            const response = await fetch(`http://localhost:8080/api/orders/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert('Order placed successfully!');
                clearCartItems();
                navigate('/');
            } else {
                const errorText = await response.text();
                alert("Failed to place order.");
                console.error(errorText);
            }
        } catch (err) {
            console.error("Network error:", err);
            alert("Something went wrong.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left Column - Form */}
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold mb-6">Complete Your Order</h1>
                        <form onSubmit={handleSubmit}>
                            {/* Delivery Address Section */}
                            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                                <h2 className="text-lg font-semibold mb-4">Delivery Address</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Street Address
                                        </label>
                                        <input
                                            type="text"
                                            name="streetAddress"
                                            value={deliveryForm.streetAddress}
                                            onChange={handleDeliveryFormChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Apartment/Suite (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                name="apartment"
                                                value={deliveryForm.apartment}
                                                onChange={handleDeliveryFormChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={deliveryForm.city}
                                                onChange={handleDeliveryFormChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Delivery Instructions (Optional)
                                        </label>
                                        <textarea
                                            name="instructions"
                                            value={deliveryForm.instructions}
                                            onChange={handleDeliveryFormChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            rows={3}
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="saveAddress"
                                            checked={deliveryForm.saveAddress}
                                            onChange={handleDeliveryFormChange}
                                            className="h-4 w-4 text-blue-600 rounded"
                                        />
                                        <label className="ml-2 text-sm text-gray-600">
                                            Save this address for future orders
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method Section */}
                            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                                <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="type"
                                                value="card"
                                                checked={paymentMethod.type === 'card'}
                                                onChange={() => setPaymentMethod({ type: 'card' })}
                                                className="h-4 w-4 text-blue-600"
                                            />
                                            <span className="ml-2">Credit/Debit Card</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="type"
                                                value="cash"
                                                checked={paymentMethod.type === 'cash'}
                                                onChange={() => setPaymentMethod({ type: 'cash' })}
                                                className="h-4 w-4 text-blue-600"
                                            />
                                            <span className="ml-2">Cash on Delivery</span>
                                        </label>
                                    </div>

                                    {paymentMethod.type === 'card' && (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Card Number
                                                </label>
                                                <input
                                                    type="text"
                                                    name="cardNumber"
                                                    value={paymentMethod.cardNumber}
                                                    onChange={handlePaymentMethodChange}
                                                    placeholder="1234 5678 9012 3456"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                    required
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Expiration Date
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="expiration"
                                                        value={paymentMethod.expiration}
                                                        onChange={handlePaymentMethodChange}
                                                        placeholder="MM/YY"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        CVV
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="cvv"
                                                        value={paymentMethod.cvv}
                                                        onChange={handlePaymentMethodChange}
                                                        placeholder="123"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Name on Card
                                                </label>
                                                <input
                                                    type="text"
                                                    name="nameOnCard"
                                                    value={paymentMethod.nameOnCard}
                                                    onChange={handlePaymentMethodChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="md:w-96">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                            <div className="space-y-4">
                                {items.map(item => (
                                    <div key={item.id} className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-16 h-16 object-cover rounded-md"
                                            />
                                            <div className="ml-4">
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                                <div className="border-t pt-4">
                                    <div className="flex justify-between font-semibold text-lg">
                                        <span>Total</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Estimated Delivery: 30-45 minutes
                                    </p>
                                </div>
                                <button
                                    type="submit"
                                    onClick={handleSubmit}
                                    className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                    Complete Order
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}