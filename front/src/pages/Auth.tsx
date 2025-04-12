import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/bnb.jpg';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface FormData {
    fullName: string;
    email: string;
    password: string;
    phoneNumber: string;
    agreeToTerms: boolean;
    rememberMe: boolean;
    role: 'customer' | 'restaurant';
    restaurantName?: string;
}

function Auth() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showLogin, setShowLogin] = useState(true);
    const [animationClass, setAnimationClass] = useState('fade-in');
    const [searchParams] = useSearchParams();
    const { setIsLoggedIn } = useAuth();

    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        email: '',
        password: '',
        phoneNumber: '',
        agreeToTerms: false,
        rememberMe: false,
        role: 'customer',
        restaurantName: ''
    });

    const [passwordError, setPasswordError] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [phoneNumberError, setPhoneNumberError] = useState<string>('');

    const users = [
        { email: 'test@example.com', password: 'Test@123' }
    ];

    const formatPhoneNumber = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        const limited = cleaned.slice(0, 10);
        const match = limited.match(/^(\d{3})(\d{3})(\d{2})(\d{2})$/);
        if (!match) return value;

        let formatted = '';
        if (match[1]) formatted += match[1];
        if (match[2]) formatted += ' ' + match[2];
        if (match[3]) formatted += ' ' + match[3];
        if (match[4]) formatted += ' ' + match[4];

        return formatted.trim();
    };

    useEffect(() => {
        const mode = searchParams.get('mode');
        setShowLogin(mode !== 'signup');
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!showLogin) {
            const passwordRegex = /^(?=.*[A-Z])(?=.*\W).{8,}$/;
            if (!passwordRegex.test(formData.password)) {
                setPasswordError('Password must be at least 8 characters long, contain at least one uppercase letter and one special character.');
                return;
            }

            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(formData.email)) {
                setEmailError('Please enter a valid email address.');
                return;
            }

            const phoneRegex = /^\d{3} \d{3} \d{2} \d{2}$/;
            if (!phoneRegex.test(formData.phoneNumber)) {
                setPhoneNumberError('Please enter a valid phone number (e.g., 555 123 45 67).');
                return;
            }
        }

        if (showLogin) {
            const user = users.find(
                (user) => user.email === formData.email && user.password === formData.password
            );

            if (user) {
                setIsLoggedIn(true);
                navigate('/');
            } else {
                setEmailError('Invalid email or password.');
            }
        } else {
            console.log('Form submitted:', formData);
            setIsLoggedIn(true);
            if (formData.role === 'restaurant') {
                navigate('/restaurant', { state: { restaurantName: formData.restaurantName } });
            } else {
                navigate('/');
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target as HTMLInputElement;
        const { name, value, type, checked } = target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox'
                ? checked
                : name === 'phoneNumber'
                    ? formatPhoneNumber(value)
                    : value,
        }));


        if (name === 'password' && !showLogin) {
            const passwordRegex = /^(?=.*[A-Z])(?=.*\W).{8,}$/;
            setPasswordError(passwordRegex.test(value) ? '' : 'Password must be at least 8 characters long, contain at least one uppercase letter and one special character.');
        }

        if (name === 'email' && !showLogin) {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            setEmailError(emailRegex.test(value) ? '' : 'Please enter a valid email address.');
        }

        if (name === 'phoneNumber') {
            const phoneRegex = /^\d{3} \d{3} \d{2} \d{2}$/;
            setPhoneNumberError(phoneRegex.test(value) ? '' : 'Please enter a valid phone number (e.g., 555 123 45 67).');
        }
    };

    const isFormValid = () => {
        if (showLogin) {
            return formData.email && formData.password;
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\W).{8,}$/;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneRegex = /^\d{3} \d{3} \d{2} \d{2}$/;

        return (
            passwordRegex.test(formData.password) &&
            emailRegex.test(formData.email) &&
            phoneRegex.test(formData.phoneNumber) &&
            formData.agreeToTerms
        );
    };

    const toggleView = () => {
        setAnimationClass('fade-out');
        setTimeout(() => {
            setShowLogin(!showLogin);
            setAnimationClass('fade-in');
        }, 300);
    };

    return (
        <div className="min-h-screen flex items-center justify-center" style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }}>
            <div className="max-w-md w-full mx-4">
                <div className={`bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 ${animationClass}`}>
                    {showLogin ? (
                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-center mb-2">Welcome to Byte and Bite</h2>
                            <p className="text-gray-600 text-center text-sm mb-8">Your favorite meals are just a few clicks away</p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md pr-10"
                                            placeholder="Enter your password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="rememberMe"
                                            checked={formData.rememberMe}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                        />
                                        <span className="ml-2 text-sm text-gray-600">Remember me</span>
                                    </label>
                                    <a href="#" className="text-sm text-orange-600 hover:text-orange-500">Forgot password?</a>
                                </div>

                                <button type="submit" className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-900 transition-colors">
                                    Login
                                </button>
                            </form>

                            <div className="mt-6 text-center text-sm">
                                <span className="text-gray-600">New to Byte and Bite? </span>
                                <button onClick={toggleView} className="text-orange-600 hover:text-orange-500 font-medium">
                                    Create Account
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-8">
                            <div className="text-center">
                                <div className="flex justify-center">
                                    <Utensils className="h-12 w-12 text-orange-500" />
                                </div>
                                <h2 className="mt-4 text-3xl font-bold text-gray-900">Join Byte and Bite</h2>
                                <p className="mt-2 text-sm text-gray-600">Your Digital Food Journey Begins Here</p>
                            </div>

                            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                                            Full Name
                                        </label>
                                        <input
                                            id="fullName"
                                            name="fullName"
                                            type="text"
                                            required
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                            Email Address
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`mt-1 block w-full px-3 py-2 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                        />
                                        {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="password"
                                                name="password"
                                                type={showPassword ? "text" : "password"}
                                                required
                                                value={formData.password}
                                                onChange={handleChange}
                                                className={`mt-1 block w-full px-3 py-2 border ${passwordError ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                            >
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                        {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                                            Phone Number
                                        </label>
                                        <input
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            type="text"
                                            required
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            className={`mt-1 block w-full px-3 py-2 border ${phoneNumberError ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                        />
                                        {phoneNumberError && <p className="text-red-500 text-sm">{phoneNumberError}</p>}
                                    </div>

                                    {/* ROLE SELECTION START */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            What is your role?
                                        </label>
                                        <select
                                            name="role"
                                            value={formData.role}
                                            onChange={handleChange}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                        >
                                            <option value="customer">Customer</option>
                                            <option value="restaurant">Restaurant</option>
                                        </select>
                                    </div>

                                    {formData.role === 'restaurant' && (
                                        <div>
                                            <label htmlFor="restaurantName" className="block text-sm font-medium text-gray-700">
                                                Restaurant Name
                                            </label>
                                            <input
                                                id="restaurantName"
                                                name="restaurantName"
                                                type="text"
                                                required
                                                value={formData.restaurantName}
                                                onChange={handleChange}
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                            />
                                        </div>
                                    )}
                                    {/* ROLE SELECTION END */}

                                    <div>
                                        <label className="inline-flex items-center">
                                            <input
                                                type="checkbox"
                                                name="agreeToTerms"
                                                checked={formData.agreeToTerms}
                                                onChange={handleChange}
                                                className="form-checkbox h-5 w-5 text-orange-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-600">I agree to the terms and conditions</span>
                                        </label>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={!isFormValid()}
                                    className="w-full py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-black hover:bg-gray-900 disabled:opacity-50"
                                >
                                    Sign Up
                                </button>
                            </form>

                            <div className="mt-6 text-center text-sm">
                                <span className="text-gray-600">Already have an account? </span>
                                <button
                                    type="button"
                                    onClick={toggleView}
                                    className="text-orange-600 hover:text-orange-500 font-medium"
                                >
                                    Log In
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Auth;
