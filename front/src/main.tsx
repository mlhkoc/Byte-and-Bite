// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth.tsx';
import Home from './pages/Home.tsx';
import MenuViewer from './pages/MenuViewer.tsx';    
import './index.css';
import { AuthProvider } from './context/AuthContext.tsx';
import Restaurant from './Restaurant.tsx';


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/menu" element={<MenuViewer />} />
                    <Route path="/restaurant" element={<Restaurant />} />

                </Routes>
            </BrowserRouter>
        </AuthProvider>
    </StrictMode>
);
