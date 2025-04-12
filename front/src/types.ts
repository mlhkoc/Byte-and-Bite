export interface MenuItem {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
}

export interface Order {
    id: string;
    items: Array<{
        menuItem: MenuItem;
        quantity: number;
    }>;
    status: 'preparing' | 'ready';
    courier?: Courier;
}

export interface Courier {
    id: string;
    name: string;
    available: boolean;
    avatar: string;
}

export interface Review {
    id: string;
    author: string;
    rating: number;
    comment: string;
    date: string;
}