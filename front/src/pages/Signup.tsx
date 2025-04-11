// src/pages/Signup.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/bnb.jpg';
import './Auth.css';

interface FormData {
    fullName: string;
    email: string;
    password: string;
    phoneNumber: string;
    agreeToTerms: boolean;
}

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        email: '',
        password: '',
        phoneNumber: '',
        agreeToTerms: false,
    });

    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');

    const formatPhoneNumber = (value: string) => {
        const cleaned = value.replace(/\D/g, '').slice(0, 10);
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{2})(\d{2})$/);
        return match ? `(${match[1]}) ${match[2]}-${match[3]}-${match[4]}` : value;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        let newValue: string | boolean = value;

        if (type === 'checkbox') {
            newValue = checked;
        } else if (name === 'phoneNumber') {
            newValue = formatPhoneNumber(value);
        }

        setFormData(prev => ({ ...prev, [name]: newValue }));
    };

    const validateForm = () => {
        let valid = true;
        setEmailError('');
        setPasswordError('');
        setPhoneNumberError('');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setEmailError('Please enter a valid email address.');
            valid = false;
        }

        if (formData.password.length < 6) {
            setPasswordError('Password must be at least 6 characters.');
            valid = false;
        }

        const numericPhone = formData.phoneNumber.replace(/\D/g, '');
        if (numericPhone.length !== 10) {
            setPhoneNumberError('Phone number must be exactly 10 digits.');
            valid = false;
        }

        return valid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        alert('Signed up successfully!');
        navigate('/');
    };

    return (
        <div className="signup-page" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <button className="back-button" onClick={() => navigate('/')}>← Back</button>
            <form className="signup-form" onSubmit={handleSubmit}>
                <h2>Sign Up</h2>

                <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />

                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                {emailError && <span className="error">{emailError}</span>}

                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                {passwordError && <span className="error">{passwordError}</span>}

                <input type="text" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} required />
                {phoneNumberError && <span className="error">{phoneNumberError}</span>}

                <label>
                    <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} required />
                    I agree to the Terms and Conditions
                </label>

                <button type="submit">Create Account</button>
            </form>
        </div>
    );
};

export default Signup;
