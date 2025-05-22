import React, { useEffect, useState } from 'react';
import { fetchTickets } from '../services/TicketApi';
import { Ticket } from '../types';

const TicketManagement: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTickets = async () => {
            try {
                const data = await fetchTickets();
                setTickets(data);
            } catch (err) {
                console.error("Failed to load tickets:", err);
            } finally {
                setLoading(false);
            }
        };

        loadTickets();
    }, []);

    if (loading) {
        return <div>Loading tickets...</div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Ticket Management</h2>
            <table className="min-w-full bg-white shadow-md rounded">
                <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="px-4 py-2">ID</th>
                        <th className="px-4 py-2">Order ID</th>
                        <th className="px-4 py-2">Customer</th>
                        <th className="px-4 py-2">Message</th>
                        <th className="px-4 py-2">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.map((ticket) => (
                        <tr key={ticket.id} className="border-t">
                            <td className="px-4 py-2">{ticket.id}</td>
                            <td className="px-4 py-2">{ticket.orderId}</td>
                            <td className="px-4 py-2">{ticket.customerEmail}</td>
                            <td className="px-4 py-2">{ticket.message}</td>
                            <td className="px-4 py-2">{ticket.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TicketManagement;
