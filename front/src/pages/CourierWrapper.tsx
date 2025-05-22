// src/CourierWrapper.tsx
import { DeliveryProvider } from "../context/DeliveryContext";
import Dashboard from "./Dashboard";

export default function CourierWrapper() {

    return (
        <DeliveryProvider>
            <Dashboard />
        </DeliveryProvider>
    );
}