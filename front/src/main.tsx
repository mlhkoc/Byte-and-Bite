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
import { UserProvider } from './context/UserContext.tsx';
import CourierWrapper from './pages/CourierWrapper.tsx';
import PrivateRoute from './components/PrivateRoute.tsx';
import ProfilePage from './pages/Profile.tsx';
import { LogoutPage } from './pages/LogoutPage.tsx';
import OrderHistory from './pages/OrderHistory.tsx';

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
                    <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
                    <Route path="/logout" element={<PrivateRoute><LogoutPage /></PrivateRoute>} />
                    <Route path="/orders" element={<PrivateRoute><OrderHistory /></PrivateRoute>} />
                </Routes>
                <CartModal />
            </UserProvider>
            </BrowserRouter>
            </CartProvider>
        </AuthProvider>
    </StrictMode>
);
