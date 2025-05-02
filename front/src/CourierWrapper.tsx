// src/CourierWrapper.tsx
import { useParams } from "react-router-dom";
import { DeliveryProvider } from "./context/DeliveryContext";
import Dashboard from "./pages/Dashboard";

export default function CourierWrapper() {
    const { courierMail } = useParams();
    if (!courierMail) return <div>Error: Missing courierMail in route</div>;

    return (
        <DeliveryProvider courierEmail={courierMail}>
            <Dashboard />
        </DeliveryProvider>
    );
}