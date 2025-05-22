// AuthContext.tsx
import {createContext, useContext, useState, ReactNode, useEffect} from 'react';

type AuthContextType = {
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;
    isAvailable: boolean;
    toggleAvailability: () => void;
    token: string | null;
    setToken: (value: string | null) => void;
    logout: () => void; // ✅ new

};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAvailable, setIsAvailable] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            setIsLoggedIn(true);
        }
    }, []);

    const logout = () => {
        setToken(null);
        setIsLoggedIn(false);
        localStorage.clear()
    };



    const toggleAvailability = async () => {
        try {
            const newAvailability = !isAvailable;
            setIsAvailable(newAvailability); // optimistic update

            const response = await fetch('http://localhost:8080/api/couriers/me/availability', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ isAvailable: newAvailability }),
            });

            if (!response.ok) {
                throw new Error('Failed to update availability');
            }

            // optionally confirm from response
            const data = await response.json();
            setIsAvailable(data.isAvailable); // sync with backend
        } catch (error) {
            console.error('Availability update failed:', error);
            // revert change if request failed
            setIsAvailable(prev => !prev);
        }
    };


    return (
        <AuthContext.Provider
            value={{ isLoggedIn, setIsLoggedIn, isAvailable, toggleAvailability, token, setToken,logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
