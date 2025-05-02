import { Order, Courier } from '../types';
import { useEffect, useState, useRef } from 'react';

import { AssignCourierModal } from './AssignCourierModal.tsx';

export function OrdersList() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

    const lastOrderId = useRef<number>(0);

    useEffect(() => {
        fetch("http://localhost:8080/api/orders/restaurant", {
            method: "GET",
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => setOrders(data))
            .catch((err) => console.error("Failed to fetch orders", err));
    }, []);

    const handleCompleteOrder = (orderId: number) => {
        setOrders(orders.filter((o) => o.id !== orderId));
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Active Orders</h2>
            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-sm text-gray-500">#{order.id}</span>
                                <div className="mt-2 space-y-1">
                                    {order.items.map((item) => (
                                        <div key={item.foodId}>
                                            <span className="font-medium">{item.quantity}x</span>{' '}
                                            {item.foodName}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <span
                                className={`px-2 py-1 text-sm rounded ${order.status === 'preparing'
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
                                        lastOrderId.current = order.id;
                                        console.log( lastOrderId )
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
                        setOrders(
                            orders.map((o) =>
                                o.id === selectedOrder.id
                                    ? { ...o, courier, status: 'ready' }
                                    : o
                            )
                        );
                        setIsAssignModalOpen(false);
                        setSelectedOrder(null);
                    }
                }}
                orderId={lastOrderId.current}
            />
        </div>
    );
}