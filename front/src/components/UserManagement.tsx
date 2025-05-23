import React, { useEffect, useState } from 'react';
import { X, Menu } from 'lucide-react';

interface Ticket {
    id: number;
    orderId: number;
    message: string;
    status: string;
    customerEmail: string;
}

const TicketManagement: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [activeTicketId, setActiveTicketId] = useState<number | null>(null);
    const token = localStorage.getItem("token")

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/tickets',{
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`

                    },
                });
                const data = await response.json();
                setTickets(data);
            } catch (error) {
                console.error('Error fetching tickets:', error);
            }
        };
        fetchTickets();
    }, []);

    const closeTicket = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:8080/api/tickets/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`

                },
                body: JSON.stringify({

                })
            });
            if (response.ok) {
                setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'closed' } : t));
            }
        } catch (error) {
            console.error('Error closing ticket:', error);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Ticket Management</h1>
            <div className="space-y-4">
                {tickets.map(ticket => (
                    <div key={ticket.id} className="bg-white rounded-lg shadow p-4 relative">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-lg font-semibold">{ticket.customerEmail}</h2>
                                <p className="text-sm text-gray-600">{ticket.message}</p>
                                <p className="text-xs text-gray-400 mt-1">Created: {new Date().toLocaleString()}</p>
                                <p className={`mt-2 text-sm font-medium ${ticket.status === 'open' ? 'text-green-600' : 'text-red-600'}`}>{ticket.status.toUpperCase()}</p>
                            </div>
                            <div className="flex gap-2 items-start">
                                <button
                                    onClick={() => setActiveTicketId(ticket.id)}
                                    className="text-gray-500 hover:text-gray-800"
                                >
                                    <Menu size={20} />
                                </button>
                                <button
                                    onClick={() => closeTicket(ticket.id)}
                                    className="bg-red-100 text-red-600 px-3 py-1 rounded-md hover:bg-red-200 text-sm"
                                    disabled={ticket.status === 'closed'}
                                >
                                    Close
                                </button>
                            </div>
                        </div>

                        {activeTicketId === ticket.id && (
                            <div className="absolute left-0 top-0 h-full w-64 bg-gray-50 border-r shadow-lg p-4 z-10">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">Admin Actions</h3>
                                    <button onClick={() => setActiveTicketId(null)}>
                                        <X size={20} className="text-gray-500 hover:text-gray-800" />
                                    </button>
                                </div>
                                <ul className="space-y-2 text-sm">
                                    <li><button className="text-blue-600 hover:underline">Refund</button></li>

                                </ul>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TicketManagement;
