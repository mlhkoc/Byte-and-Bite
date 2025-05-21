import { useAuth } from "../context/AuthContext"
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type PrivateRouteProps = {
    children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const {isLoggedIn, authInitialized} = useAuth();

    if (!authInitialized) {
        // Return a spinning "loading disk"
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return isLoggedIn ? children : <Navigate to="/" />;
}

export default PrivateRoute 