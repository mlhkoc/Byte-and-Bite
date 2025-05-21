import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { CustomerHeader } from "../components/Header";
import { Order, Restaurant } from "../types";
import { fetchRestaurantById } from "../services/RestaurantApi";



export default function OrderHistory() {
    const [orders, setOrders] = useState<Order[]>([]);
    const {userEmail} = useAuth();

    useEffect(() => {
        const fetchOrdersWithRestaurants = async (email: string | null) => {
            if (!email) return;
            try {
                const res = await fetch(`http://localhost:8080/api/orders/customer/${email}`, {
                    method: "GET",
                    credentials: "include",
                });
                const orderData: Order[] = await res.json();

                console.log( orderData );

                // Fetch all unique restaurant IDs
                const uniqueIds = [...new Set(orderData.map(o => o.restaurantId))];

                // Fetch restaurant info in parallel
                const restaurantMap: { [key: number]: Restaurant } = {};
                await Promise.all(
                    uniqueIds.map(async (id) => {
                        try {
                            const restaurant = await fetchRestaurantById(id);
                            restaurantMap[id] = restaurant;
                        } catch (err) {
                            console.error(`Failed to fetch restaurant ${id}`);
                        }
                    })
                );

                // Inject restaurants into orders
                const enrichedOrders = orderData.map(order => ({
                    ...order,
                    restaurant: restaurantMap[order.restaurantId],
                }));

                setOrders(enrichedOrders);
            } catch (err) {
                console.error("Failed to fetch orders or restaurants", err);
            }
        };

        fetchOrdersWithRestaurants(userEmail);
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
                                <h3 className="font-semibold">{order.restaurant?.name}</h3>
                                <p className="text-sm text-gray-500">Order #{order.id} ● Date</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium
                                ${order.status === "Completed" ? "bg-green-100 text-green-700"
                                    : order.status === "preparing" ? "bg-blue-100 text-blue-700"
                                        : order.status === "PENDING" ? "bg-yellow-100 text-yellow-700"
                                            : order.status === "ready" ? "bg-orange-100 text-orange-700"
                                                : "bg-gray-100 text-gray-700"}`}>
                                {order.status.toUpperCase()}
                            </span>
                            <p className="font-semibold">${order.total.toFixed(2)}</p>
                        </div>

                        <ul className="mt-2 text-gray-700 list-disc ml-5">
                            {order.items.map((item, idx) => (
                                <li key={idx}>{item.quantity}x {item.foodName}</li>
                            ))}
                        </ul>

                        {order.status === "ready" && (
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

                        {order.status === "ready" && (
                            <div className="mt-3 bg-blue-50 text-blue-700 p-3 rounded text-sm">
                                🚚 Your order is on the way<br />
                                
                            </div>
                        )}

                        {order.status === "preparing" && (
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