import { Customer } from "../types";

// Fetch customer by email (public version)
export async function fetchCustomerByEmail(email: string): Promise<Customer> {
    const res = await fetch(`http://localhost:8080/api/customers/${email}`, {
        method: "GET",
        credentials: "include", // optional since it's now public
    });

    if (!res.ok) {
        throw new Error(`Fetch failed with status ${res.status}`);
    }

    return res.json();
}

// Update customer by email (public version)
export async function updateCustomer(email: string, customer: Customer): Promise<void> {
    const res = await fetch(`http://localhost:8080/api/customers/${email}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include", // optional since it's now public
        body: JSON.stringify(customer),
    });

    if (!res.ok) {
        throw new Error("Failed to update customer");
    }
}