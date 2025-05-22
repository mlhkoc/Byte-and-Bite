import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Courier } from '../types';

interface AssignCourierModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAssign: (courier: Courier) => void;
    orderId: number; // Order ID prop'u
}

export function AssignCourierModal({
    isOpen,
    onClose,
    onAssign,
    orderId,
}: AssignCourierModalProps) {
    const [availableCouriers, setAvailableCouriers] = useState<Courier[]>([]);

    useEffect(() => {
        if (!isOpen) return;
        const token = localStorage.getItem("token");

        const fetchCouriers = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/courier/get', {
                    headers: {
                        Authorization: `Bearer ${token}`}
                });
                const data = await res.json();
                setAvailableCouriers(data);
            } catch (error) {
                console.error("Failed to fetch couriers:", error);
            }
        };

        fetchCouriers();
    }, [isOpen]);

    const handleAssignCourier = async (courier: Courier) => {
        const token = localStorage.getItem("token");
        try {
            console.log( JSON.stringify(orderId) )
            const res = await fetch(`http://localhost:8080/api/courier/id/${courier.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                credentials: 'include', // Eğer oturum için cookie gerekiyorsa
                body: JSON.stringify({ id: orderId }),
            });

            if (!res.ok) {
                throw new Error('Failed to assign courier');
            }

            onAssign(courier); // Gerekirse parent state güncelle
            onClose(); // Modalı kapat
        } catch (error) {
            console.error("Courier assignment failed:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Assign Courier</h2>
                    <button onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-4 max-h-60 overflow-y-auto">
                    {availableCouriers.length === 0 ? (
                        <p className="text-sm text-gray-600">No couriers available.</p>
                    ) : (
                        availableCouriers.map((courier) => (
                            <button
                                key={courier.id}
                                onClick={() => handleAssignCourier(courier)}
                                className="w-full flex items-center p-3 border rounded-lg hover:bg-gray-50 transition"
                            >
                                <img
                                    src={courier.avatar || '/default-avatar.png'}
                                    alt={courier.name}
                                    className="w-10 h-10 rounded-full"
                                />
                                <span className="ml-3">{courier.name}</span>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
