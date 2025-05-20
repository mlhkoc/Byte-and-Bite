import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { CustomerHeader } from "../components/Header";

interface Order {
    id: number;
    restaurant: string;
    date: string;
    status: "Completed" | "On the Way" | "Preparing";
    items: string[];
    total: number;
    deliveryInfo?: string;
}

const dummyOrders: Order[] = [
    {
        id: 12345,
        restaurant: "The Garden Kitchen",
        date: "March 15, 2024",
        status: "Completed",
        items: ["1x Grilled Salmon Bowl", "2x Fresh Garden Salad", "1x Lemon Cheesecake"],
        total: 45.9,
    },
    {
        id: 12346,
        restaurant: "Sushi Master",
        date: "March 14, 2024",
        status: "On the Way",
        items: ["1x Dragon Roll", "1x California Roll", "1x Miso Soup"],
        total: 32.5,
        deliveryInfo: "John D. will deliver your order in 15-20 minutes",
    },
    {
        id: 12347,
        restaurant: "Pizza Paradise",
        date: "March 14, 2024",
        status: "Preparing",
        items: ["1x Margherita Pizza", "1x Garlic Bread", "2x Coca Cola"],
        total: 28.75,
    },
];

export default function OrderHistory() {
    const { isLoggedIn } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        // Replace with API call when backend ready
        setOrders(dummyOrders);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6">
            <CustomerHeader />

            <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-semibold mb-6">Order History & Ratings</h2>

                <div className="flex gap-4 mb-4">
                    <select className="border p-2 rounded">
                        <option>All Time</option>
                    </select>
                    <select className="border p-2 rounded">
                        <option>All Status</option>
                    </select>
                </div>

                {orders.map(order => (
                    <div key={order.id} className="bg-white shadow p-4 rounded-lg mb-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold">{order.restaurant}</h3>
                                <p className="text-sm text-gray-500">Order #{order.id} • {order.date}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium
                  ${order.status === "Completed" ? "bg-green-100 text-green-700"
                                    : order.status === "On the Way" ? "bg-blue-100 text-blue-700"
                                        : "bg-orange-100 text-orange-700"}`}>
                                {order.status}
                            </span>
                            <p className="font-semibold">${order.total.toFixed(2)}</p>
                        </div>

                        <ul className="mt-2 text-gray-700 list-disc ml-5">
                            {order.items.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>

                        {order.status === "Completed" && (
                            <>
                                <div className="mt-4">
                                    <label className="block mb-1 font-medium">Rate your experience</label>
                                    <div className="flex space-x-1">
                                        {Array.from({ length: 5 }, (_, i) => (
                                            <Star key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" />
                                        ))}
                                    </div>
                                </div>
                                <textarea
                                    className="w-full mt-2 p-2 border rounded"
                                    placeholder="Share your experience..."
                                />
                                <div className="flex items-center gap-2 mt-2">
                                    <button className="border px-3 py-1 rounded">Add Photos</button>
                                    <button className="bg-black text-white px-4 py-1 rounded">Submit Review</button>
                                </div>
                            </>
                        )}

                        {order.status === "On the Way" && (
                            <div className="mt-3 bg-blue-50 text-blue-700 p-3 rounded text-sm">
                                🚚 Your order is on the way<br />
                                {order.deliveryInfo}
                            </div>
                        )}

                        {order.status === "Preparing" && (
                            <div className="mt-3 bg-orange-50 text-orange-700 p-3 rounded text-sm">
                                🍽 Your order is being prepared by the restaurant
                            </div>
                        )}
                    </div>
                ))}

            </div>
        </div>
    );
}