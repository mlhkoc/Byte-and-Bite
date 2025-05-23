import { Customer } from "../types";
// Fetch customer by email (public version)
export async function fetchCustomerByEmail(email: string,token: string|null): Promise<Customer> {

    const res = await fetch(`http://localhost:8080/api/customers/${email}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`

        },
    });

    if (!res.ok) {
        throw new Error(`Fetch failed with status ${res.status}`);
    }

    return res.json();
}

// Update customer by email (public version)
export async function updateCustomer(email: string, customer: Customer,token: string|null): Promise<void> {
    const res = await fetch(`http://localhost:8080/api/customers/${email}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`

        },
        credentials: "include", // optional since it's now public
        body: JSON.stringify(customer),
    });
    if (!res.ok) {
        throw new Error("Failed to update customer");
    }
}