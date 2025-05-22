const API_URL = "http://localhost:8080/api/reviews";

export async function submitReview(orderId: number, restaurantId: number, rating: number, comment: string) {
    const token = localStorage.getItem("token");
    const res = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ orderId, restaurantId, rating, comment }),
    });

    if (!res.ok) {
        throw new Error("Failed to submit review");
    }
}

export async function fetchReview(orderId: number) {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/order/${orderId}`, {
        credentials: "include",
        headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) return null;

    return res.json(); // returns { rating, text, ... }
}

export async function fetchReviewsByRestaurant(restaurantId: number) {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/restaurant/${restaurantId}`, {
        credentials: "include",
        headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
        throw new Error("Failed to fetch reviews for restaurant");
    }

    return res.json(); // expected to be an array of reviews
}