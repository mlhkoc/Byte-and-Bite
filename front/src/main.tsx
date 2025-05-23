// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth.tsx';
import Home from './pages/Home.tsx';
import MenuViewer from './pages/MenuViewer.tsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.tsx';
import Restaurant from './pages/RestaurantDashboard.tsx';
import { CartProvider } from './context/CartContext';
import { CartModal } from './components/CartModal';
import Checkout from './pages/Checkout.tsx';
// import Dashboard from './pages/Dashboard.tsx';
import { UserProvider } from './context/UserContext.tsx';
import { DeliveryProvider } from './context/DeliveryContext.tsx';
import ForbiddenPage from "./pages/403Forbidden.tsx";
import NotFoundPage from "./pages/404NotFound.tsx";
import CourierWrapper from './pages/CourierWrapper.tsx';
import ProfilePage from './pages/Profile.tsx';
import { LogoutPage } from './pages/LogoutPage.tsx';
import OrderHistory from './pages/OrderHistory.tsx';
import Admin from './pages/Admin.tsx';


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
                            <Route path="/restaurant" element={<Restaurant />} />
                            <Route path="/checkout/:restaurantMail" element={<Checkout />} />
                            <Route path="/courier" element={<CourierWrapper />} />
                            <Route path="/not-authorized" element={<ForbiddenPage />}/>
                            {/*<Route path="/restaurant" element={<PrivateRoute><RestaurantDashboard /></PrivateRoute>} />*/}
                            <Route path="/checkout/:restaurantMail" element={<Checkout />} />
                            <Route path="/courier" element={<CourierWrapper />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/logout" element={<LogoutPage />} />
                            <Route path="/orders" element={<OrderHistory />}/>
                            <Route path="/admin" element={<Admin />} />
                            <Route path="*" element={<NotFoundPage />}/>


                        </Routes>
                        <CartModal />
                    </UserProvider>
                </BrowserRouter>
            </CartProvider>
        </AuthProvider>
    </StrictMode>
);