export interface MenuItem {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    available: boolean;
}

export interface Review {
    id: string;
    author: string;
    rating: number;
    comment: string;
    date: string;
}

export interface OrderItem {
    foodId: number;
    foodName: string;
    quantity: number;
}

export interface Courier {
    name: string;
    avatar: string;
}

export interface Order {
    id: number;
    items: OrderItem[];
    status: 'preparing' | 'ready';
    courier?: Courier;
}

export interface User {
    id: string;
    name: string;
    isAvailable: boolean;
    role: 'courier' | 'customer' | 'restaurant';
}

export interface Delivery {
    id: string;
    restaurantName: string;
    address: string;
    distance: string;
    amount: number;
    status: 'pending' | 'accepted' | 'picked_up' | 'delivered' | 'completed';
    completedAt?: string;
    rating?: number;
}

export interface DailyPerformance {
    earnings: number;
    deliveries: number;
    rating: number;
}