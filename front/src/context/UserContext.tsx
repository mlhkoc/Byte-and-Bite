import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  toggleAvailability: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  // Check local storage for saved user on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('courier_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('courier_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('courier_user');
  };

  const toggleAvailability = () => {
    if (user) {
      const updatedUser = { ...user, isAvailable: !user.isAvailable };
      setUser(updatedUser);
      localStorage.setItem('courier_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <UserContext.Provider 
      value={{ 
        user, 
        setUser, 
        isAuthenticated: !!user,
        login,
        logout,
        toggleAvailability
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};