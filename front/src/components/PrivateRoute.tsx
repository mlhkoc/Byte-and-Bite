import { useAuth } from "../context/AuthContext"
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type PrivateRouteProps = {
    children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const {isLoggedIn} = useAuth();

    return isLoggedIn ? children : <Navigate to="/" />;
}

export default PrivateRoute 