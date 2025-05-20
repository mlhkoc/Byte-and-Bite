// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth.tsx';
import Home from './pages/Home.tsx';
import MenuViewer from './pages/MenuViewer.tsx';    
import './index.css';
import { AuthProvider } from './context/AuthContext.tsx';
import Restaurant from './pages/Restaurant.tsx';
import { CartProvider } from './context/CartContext';
import { CartModal } from './components/CartModal';
import Checkout from './pages/Checkout.tsx';
import Dashboard from './pages/Dashboard.tsx';
import { UserProvider } from './context/UserContext.tsx';
import { DeliveryProvider } from './context/DeliveryContext.tsx';
import CourierWrapper from './pages/CourierWrapper.tsx';
import PrivateRoute from './components/PrivateRoute.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>

            <CartProvider>
            <BrowserRouter>
            <UserProvider>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/:restaurantId/menu" element={<MenuViewer />} />
                    <Route path="/restaurant/:restaurantMail" element={<PrivateRoute><Restaurant /></PrivateRoute>} />
                    <Route path="/checkout/:restaurantMail" element={<PrivateRoute><Checkout /></PrivateRoute>} />
                    <Route path="/courier/:courierMail" element={<PrivateRoute><CourierWrapper /></PrivateRoute>} />

                </Routes>
                <CartModal />
            </UserProvider>
            </BrowserRouter>
            </CartProvider>
        </AuthProvider>
    </StrictMode>
);
