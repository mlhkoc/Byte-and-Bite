import { Ticket } from "../types";

export async function fetchTickets(): Promise<Ticket[]> {
    const token = localStorage.getItem('token');
    const response = await fetch("http://localhost:8080/api/tickets", {
        method: "GET",
        credentials: "include",
        headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch tickets");
    }

    return response.json();
}