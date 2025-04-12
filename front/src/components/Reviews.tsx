import { X, Star } from 'lucide-react';
import { Review } from '../types';

interface ReviewsProps {
    onClose: () => void;
}

export function Reviews({ onClose }: ReviewsProps) {
    const reviews: Review[] = [
        {
            id: '1',
            author: 'Emily W.',
            rating: 5,
            comment: 'Amazing pizza! The crust was perfect and toppings were fresh.',
            date: '2024-03-15',
        },
        {
            id: '2',
            author: 'James R.',
            rating: 4,
            comment: 'Great food but delivery was a bit slow today',
            date: '2024-03-14',
        },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Recent Reviews</h2>
                    <button onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div key={review.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center">
                                        <span className="font-medium">{review.author}</span>
                                        <div className="flex ml-2">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={16}
                                                    className={i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="mt-2 text-gray-600">{review.comment}</p>
                                </div>
                                <span className="text-sm text-gray-500">
                  {new Date(review.date).toLocaleDateString()}
                </span>
                            </div>
                            <button
                                className="mt-3 text-sm text-blue-600 hover:text-blue-700"
                                onClick={() => {/* Handle reply */}}
                            >
                                Reply to review
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}