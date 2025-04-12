import { X } from 'lucide-react';
import { Courier } from '../types';

interface AssignCourierModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAssign: (courier: Courier) => void;
}

export function AssignCourierModal({
                                       isOpen,
                                       onClose,
                                       onAssign,
                                   }: AssignCourierModalProps) {
    const availableCouriers: Courier[] = [
        {
            id: '1',
            name: 'Mike',
            available: true,
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
        },
        {
            id: '2',
            name: 'Sarah',
            available: true,
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        },
        {
            id: '3',
            name: 'John',
            available: true,
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
        },
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Assign Courier</h2>
                    <button onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-4">
                    {availableCouriers.map((courier) => (
                        <button
                            key={courier.id}
                            onClick={() => onAssign(courier)}
                            className="w-full flex items-center p-3 border rounded-lg hover:bg-gray-50"
                        >
                            <img
                                src={courier.avatar}
                                alt={courier.name}
                                className="w-10 h-10 rounded-full"
                            />
                            <span className="ml-3">{courier.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}