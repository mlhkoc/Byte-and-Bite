// src/pages/Home.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <header className="top-bar">
                <div className="spacer" />
                <div className="auth-buttons">
                    <button onClick={() => navigate('/login')}>Login</button>
                    <button onClick={() => navigate('/signup')}>Sign Up</button>
                </div>
            </header>

            <div className="search-filter">
                <input type="text" placeholder="Search for restaurants or dishes" />
                <button className="filter-button">Filter</button>
            </div>

            <div className="category-section">
                <h2>Categories</h2>
                <div className="categories">
                    {['Pizza', 'Burgers', 'Sushi', 'Chicken', 'Desserts'].map((cat) => (
                        <div key={cat} className="category-button">{cat}</div>
                    ))}
                </div>
            </div>

            <section className="restaurant-section">
                <h2>Favorite Restaurants</h2>
                <div className="restaurant-grid">
                    {[1, 2].map((i) => (
                        <div key={i} className="restaurant-card placeholder" />
                    ))}
                </div>
            </section>

            <section className="restaurant-section">
                <h2>All Restaurants</h2>
                <div className="restaurant-grid">
                    {[1, 2].map((i) => (
                        <div key={i} className="restaurant-card placeholder" />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;