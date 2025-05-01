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