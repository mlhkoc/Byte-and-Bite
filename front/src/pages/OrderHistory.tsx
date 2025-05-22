import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { CustomerHeader } from "../components/Header";
import { Order, Restaurant } from "../types";
import { fetchRestaurantById } from "../services/RestaurantApi";
import { submitReview, fetchReview } from "../services/ReviewApi";

export default function OrderHistory() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [reviews, setReviews] = useState<{ [orderId: number]: { rating: number; text: string } }>({});
    const [showReviewBox, setShowReviewBox] = useState<{ [orderId: number]: boolean }>({});
    const [submitted, setSubmitted] = useState<{ [orderId: number]: boolean }>({});
    const [showTicketBox, setShowTicketBox] = useState<{ [orderId: number]: boolean }>({});
    const [tickets, setTickets] = useState<{ [orderId: number]: string }>({});
    const [ticketSubmitted, setTicketSubmitted] = useState<{ [orderId: number]: boolean }>({});

    useEffect(() => {
        const token = localStorage.getItem("token");

        const fetchOrdersWithRestaurants = async (email: string | null) => {
            if (!email) return;
            try {
                const res = await fetch(`http://localhost:8080/api/orders/customer/${email}`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                });

                const orderData: Order[] = await res.json();

                // Fetch restaurant data
                const uniqueIds = [...new Set(orderData.map(o => o.restaurantId))];
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

                // Inject restaurant data
                const enrichedOrders = orderData.map(order => ({
                    ...order,
                    restaurant: restaurantMap[order.restaurantId],
                }));

                // 🆕 Fetch reviews
                const initialSubmitted: { [key: number]: boolean } = {};
                const initialReviews: { [key: number]: { rating: number; text: string } } = {};

                await Promise.all(enrichedOrders.map(async (order) => {
                    try {
                        const review = await fetchReview(order.id);
                        if (review) {
                            initialSubmitted[order.id] = true;
                            initialReviews[order.id] = {
                                rating: review.rating,
                                text: review.text,
                            };
                        }
                    } catch (err) {
                        console.error("Failed to fetch review for order", order.id);
                    }
                }));

                setOrders(enrichedOrders);
                setSubmitted(initialSubmitted);
                setReviews(initialReviews);

                console.log("Submitted reviews:", initialSubmitted);
                console.log("Review data:", initialReviews);

            } catch (err) {
                console.error("Failed to fetch orders or restaurants", err);
            }
        };

        fetchOrdersWithRestaurants(localStorage.getItem("user"));
    }, []);
    

    const toggleReviewBox = (orderId: number) => {
        setShowReviewBox(prev => ({ ...prev, [orderId]: !prev[orderId] }));
    };

    const handleStarClick = (orderId: number, index: number) => {
        setReviews(prev => ({
            ...prev,
            [orderId]: {
                ...prev[orderId],
                rating: index + 1,
            }
        }));
    };

    const handleReviewTextChange = (orderId: number, value: string) => {
        setReviews(prev => ({
            ...prev,
            [orderId]: {
                ...prev[orderId],
                text: value,
            }
        }));
    };

    const handleSubmitReview = async (orderId: number) => {
        const review = reviews[orderId];
        const order = orders.find(o => o.id === orderId);
        if (!review || !review.rating || !review.text || !order) return;

        try {
            await submitReview(orderId, order.restaurantId, review.rating, review.text);
            setSubmitted(prev => ({ ...prev, [orderId]: true }));
            setShowReviewBox(prev => ({ ...prev, [orderId]: false }));
        } catch (err) {
            console.error("Error submitting review:", err);
        }
    };

    const toggleTicketBox = (orderId: number) => {
        setShowTicketBox(prev => ({ ...prev, [orderId]: !prev[orderId] }));
    };

    const handleTicketChange = (orderId: number, value: string) => {
        setTickets(prev => ({ ...prev, [orderId]: value }));
    };

    const handleSubmitTicket = async (orderId: number) => {
        const message = tickets[orderId];
        const token = localStorage.getItem("token");

        if (!message) return;

        try {
            const res = await fetch("http://localhost:8080/api/tickets", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`

                },
                credentials: "include",
                body: JSON.stringify({
                    orderId,
                    message
                })
            });

            if (res.ok) {
                setTicketSubmitted(prev => ({ ...prev, [orderId]: true }));
                setShowTicketBox(prev => ({ ...prev, [orderId]: false }));
            } else {
                throw new Error("Failed to submit support ticket");
            }
        } catch (err) {
            console.error("Error submitting ticket:", err);
        }
    };

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
                                <p className="text-sm text-gray-500">Order #{order.id} • March 15, 2024</p>
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

                        {order.status === "Completed" && (
                            <div className="mt-4 flex justify-end items-center gap-2">
                                {!submitted[order.id] && !showReviewBox[order.id] && (
                                    <button
                                        onClick={() => toggleReviewBox(order.id)}
                                        className="bg-gray-200 text-black px-4 py-1 rounded hover:bg-gray-400"
                                    >
                                        Review this order
                                    </button>
                                )}

                                {!ticketSubmitted[order.id] && !showTicketBox[order.id] && (
                                    <button
                                        onClick={() => toggleTicketBox(order.id)}
                                        className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                                    >
                                        Report
                                    </button>
                                )}
                            </div>
                        )}

                        {showReviewBox[order.id] && !submitted[order.id] && (
                            <>
                                <div className="mt-4">
                                    <label className="block mb-1 font-medium">Rate your experience</label>
                                    <div className="flex space-x-1">
                                        {Array.from({ length: 5 }, (_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-5 w-5 cursor-pointer ${reviews[order.id]?.rating > i ? "text-yellow-400" : "text-gray-300"}`}
                                                fill={reviews[order.id]?.rating > i ? "currentColor" : "none"}
                                                onClick={() => handleStarClick(order.id, i)}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <textarea
                                    className="w-full mt-2 p-2 border rounded"
                                    placeholder="Share your experience..."
                                    value={reviews[order.id]?.text || ""}
                                    onChange={(e) => handleReviewTextChange(order.id, e.target.value)}
                                />
                                <div className="flex items-center gap-2 mt-2">
                                    <button className="border px-3 py-1 rounded">Add Photos</button>
                                    <button
                                        className="bg-black text-white px-4 py-1 rounded"
                                        onClick={() => handleSubmitReview(order.id)}
                                    >
                                        Submit Review
                                    </button>
                                </div>
                            </>
                        )}

                        {showTicketBox[order.id] && !ticketSubmitted[order.id] && (
                            <div className="mt-4">
                                <label className="block mb-1 font-medium">Describe your issue</label>
                                <textarea
                                    className="w-full mt-1 p-2 border rounded"
                                    placeholder="e.g. My order arrived cold, or something was missing..."
                                    value={tickets[order.id] || ""}
                                    onChange={(e) => handleTicketChange(order.id, e.target.value)}
                                />
                                <button
                                    onClick={() => handleSubmitTicket(order.id)}
                                    className="mt-2 bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                                >
                                    Submit Ticket
                                </button>
                            </div>
                        )}

                        {ticketSubmitted[order.id] && (
                            <p className="text-sm text-red-600 mt-2">🎫 Your support ticket has been submitted.</p>
                        )}

                        {submitted[order.id] && reviews[order.id] && (
                            <div className="mt-3 bg-green-50 text-green-800 p-3 rounded text-sm">
                                <p className="font-semibold">✅ Review submitted</p>
                                <p className="mt-1">⭐ Rating: {reviews[order.id].rating} / 5</p>
                                <p className="italic mt-1">"{reviews[order.id].text}"</p>
                            </div>
                        )}

                        {order.status === "ready" && (
                            <div className="mt-3 bg-blue-50 text-blue-700 p-3 rounded text-sm">
                                🚚 Your order is on the way<br />
                                John D. will deliver your order in 15–20 minutes.
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
