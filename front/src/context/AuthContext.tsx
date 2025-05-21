import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type AuthContextType = {
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;
    isAvailable: boolean;
    toggleAvailability: () => void;
    userEmail: string | null;
    setUserEmail: (email: string | null) => void;
    role: string | null;
    setRole: (role: string | null) => void;
    login: (email: string, role: string) => void;
    logout: () => void;
    authInitialized: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAvailable, setIsAvailable] = useState(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [authInitialized, setAuthInitialized] = useState(false);

    const toggleAvailability = async () => {
        try {
            const newAvailability = !isAvailable;
            setIsAvailable(newAvailability); // optimistic update

            const response = await fetch('http://localhost:8080/api/couriers/me/availability', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
                body: JSON.stringify({ isAvailable: newAvailability }),
            });

            if (!response.ok) {
                throw new Error('Failed to update availability');
            }

            const data = await response.json();
            setIsAvailable(data.isAvailable); // sync with backend
        } catch (error) {
            console.error('Availability update failed:', error);
            setIsAvailable(prev => !prev); // revert
        }
    };

    // Check local storage to see if logged in before (so we keep logged in after refreshing)
    useEffect(() => {
        setAuthInitialized(false);
        
        let stored = localStorage.getItem("isLoggedIn");
        if (stored === "true") {
            setIsLoggedIn(true);
            setUserEmail( localStorage.getItem( "userEmail" ) );
            setRole( localStorage.getItem( "role" ) );
        } 

        setAuthInitialized(true);
    }, []);

    const login = (email: string, role: string) => {
        
        setIsLoggedIn(true);
        setUserEmail(email);
        setRole(role);

        localStorage.setItem( "isLoggedIn", "true" );
        localStorage.setItem( "userEmail", email );
        localStorage.setItem( "role", role );
    }

    const logout = () => {
        setIsLoggedIn(false);
        setUserEmail(null);
        setRole(null);

        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('role');
    };

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                setIsLoggedIn,
                isAvailable,
                toggleAvailability,
                userEmail,
                setUserEmail,
                role,
                setRole,
                login,
                logout,
                authInitialized
            }}
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