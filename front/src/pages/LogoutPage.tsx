import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function LogoutPage() {
    const { setIsLoggedIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoggedIn(false);
        navigate("/");
    }, []);

    return <p>Logging out...</p>;
}