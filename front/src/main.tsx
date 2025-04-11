// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth.tsx';
import Welcome from './Welcome.tsx';
import Home from './pages/Home.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/welcome" element={<Welcome />} />
                <Route path="/authentication" element={<Auth />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
);
