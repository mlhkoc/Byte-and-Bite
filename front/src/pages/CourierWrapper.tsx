// src/CourierWrapper.tsx
import { DeliveryProvider } from "../context/DeliveryContext";
import Dashboard from "./Dashboard";
import { useAuth } from "../context/AuthContext";

export default function CourierWrapper() {
    const { userEmail } = useAuth();
    if (!userEmail) return <div>Error: Missing userEmail in route</div>;

    return (
        <DeliveryProvider courierEmail={userEmail}>
            <Dashboard />
        </DeliveryProvider>
    );
}