
export interface MenuItem {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    available: boolean;
    restaurantEmail: string;
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
    id: string;
    name: string;
    avatar: string;
}

// TODO: Will need to fix the statuses
export interface Order {
    id: number;
    items: OrderItem[];
    status: 'preparing' | 'ready' | 'Completed' | 'PENDING';
    restaurantId: number;
    total: number;
    restaurant?: Restaurant;
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
    status: 'pending' | 'accepted' | 'picked_up' | 'delivered' | 'completed';
    deliveryDate?: string;
    rating?: number;
}

export interface DailyPerformance {
    earnings: number;
    deliveries: number;
    rating: number;
}

export interface Restaurant {
    id: number;
    name: string;
    cuisine: string;
    rating: number;
    deliveryTime: string;
    minOrder: number;
    image: string;
}

export interface Customer {
    fullName: string;
    email: string;
    phone: string;
    address: string;
}