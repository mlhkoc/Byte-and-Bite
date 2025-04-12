import { Order, Courier } from '../types';
import { useState } from 'react';

import { AssignCourierModal } from './AssignCourierModal.tsx';

export function OrdersList() {
    const [orders, setOrders] = useState<Order[]>([
        {
            id: '2847',
            items: [
                {
                    menuItem: {
                        id: '1',
                        name: 'Margherita Pizza',
                        price: 14.99,
                        description: '',
                        image: '',
                    },
                    quantity: 1,
                },
                {
                    menuItem: {
                        id: '2',
                        name: 'Carbonara',
                        price: 16.99,
                        description: '',
                        image: '',
                    },
                    quantity: 2,
                },
            ],
            status: 'preparing',
        },
        {
            id: '2846',
            items: [
                {
                    menuItem: {
                        id: '3',
                        name: 'Tiramisu',
                        price: 8.99,
                        description: '',
                        image: '',
                    },
                    quantity: 2,
                },
                {
                    menuItem: {
                        id: '2',
                        name: 'Carbonara',
                        price: 16.99,
                        description: '',
                        image: '',
                    },
                    quantity: 1,
                },
            ],
            status: 'ready',
            courier: {
                id: '1',
                name: 'Mike',
                available: true,
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
            },
        },
    ]);

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

    const handleAssignCourier = (order: Order, courier: Courier) => {
        setOrders(
            orders.map((o) =>
                o.id === order.id ? { ...o, courier, status: 'ready' } : o
            )
        );
        setIsAssignModalOpen(false);
        setSelectedOrder(null);
    };

    const handleCompleteOrder = (orderId: string) => {
        setOrders(orders.filter((o) => o.id !== orderId));
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Active Orders</h2>
            <div className="space-y-4">
                {orders.map((order) => (
                    <div
                        key={order.id}
                        className="border rounded-lg p-4 space-y-3"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-sm text-gray-500">#{order.id}</span>
                                <div className="mt-2 space-y-1">
                                    {order.items.map((item) => (
                                        <div key={item.menuItem.id}>
                                            <span className="font-medium">{item.quantity}x</span>{' '}
                                            {item.menuItem.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <span
                                className={`px-2 py-1 text-sm rounded ${
                                    order.status === 'preparing'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-green-100 text-green-800'
                                }`}
                            >
                {order.status === 'preparing' ? 'Preparing' : 'Ready'}
              </span>
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t">
                            {order.courier ? (
                                <div className="flex items-center">
                                    <img
                                        src={order.courier.avatar}
                                        alt={order.courier.name}
                                        className="w-8 h-8 rounded-full"
                                    />
                                    <span className="ml-2 text-sm">{order.courier.name}</span>
                                </div>
                            ) : (
                                <button
                                    onClick={() => {
                                        setSelectedOrder(order);
                                        setIsAssignModalOpen(true);
                                    }}
                                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Assign Courier
                                </button>
                            )}
                            {order.courier && (
                                <button
                                    onClick={() => handleCompleteOrder(order.id)}
                                    className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    Complete Order
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <AssignCourierModal
                isOpen={isAssignModalOpen}
                onClose={() => {
                    setIsAssignModalOpen(false);
                    setSelectedOrder(null);
                }}
                onAssign={(courier) => {
                    if (selectedOrder) {
                        handleAssignCourier(selectedOrder, courier);
                    }
                }}
            />
        </div>
    );
}