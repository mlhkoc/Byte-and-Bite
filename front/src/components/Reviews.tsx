import { useEffect, useState } from "react";
import { fetchReviewsByRestaurant } from "../services/ReviewApi";

interface Review {
    id: number;
    rating: number;
    text: string;
    timestamp: string;
    customerName: string;
}

interface ReviewsProps {
    restaurantId: number;
}

export function Reviews({ restaurantId }: ReviewsProps) {
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        const loadReviews = async () => {
            try {
                const data = await fetchReviewsByRestaurant(restaurantId);
                setReviews(data);
            } catch (err) {
                console.error("Failed to load reviews:", err);
            }
        };

        loadReviews();
    }, [restaurantId]);

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
            {reviews.length === 0 ? (
                <p>No reviews yet.</p>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-white p-4 rounded shadow">
                            <p className="text-yellow-500">⭐ {review.rating} / 5</p>
                            <p className="mt-1 italic">"{review.text}"</p>
                            <p className="text-sm text-gray-500 mt-1">
                                by {review.customerName} on {new Date(review.timestamp).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}