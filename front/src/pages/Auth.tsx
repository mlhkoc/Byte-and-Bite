import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Utensils, User } from 'lucide-react'; // Added User icon
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
    role: 'customer' | 'restaurant' | 'courier';
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

    const formatPhoneNumber = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        const limited = cleaned.slice(0, 10);
        const match = limited.match(/^(\d{3})(\d{3})(\d{2})(\d{2})$/);
        if (!match) return value; // Return original value if it doesn't match the full pattern yet, to allow typing

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
        setPasswordError('');
        setEmailError('');
        setPhoneNumberError('');

        // Check if it's admin login


        if (!showLogin) { // Signup
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
            if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber)) { // phoneNumber might be optional
                setPhoneNumberError('Please enter a valid phone number (e.g., 555 123 45 67).');
                return;
            }
            try {
                const response = await fetch('http://localhost:8080/api/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    const resultData = await response.json();
                    alert(resultData.message || 'Registration request submitted. Waiting for admin approval.');
                    setShowLogin(true); // Switch to login view
                    setAnimationClass('fade-in');
                    // Clear form data for signup specific fields, keep email for convenience
                    setFormData(prev => ({
                        ...prev,
                        fullName: '',
                        password: '',
                        phoneNumber: '',
                        agreeToTerms: false,
                        role: 'customer',
                        restaurantName: '',
                        // email: prev.email // Keep email
                    }));
                } else {
                    const errorData = await response.json();
                    alert(errorData.message || 'Signup failed.');
                }
            } catch (error) {
                console.error("Signup error:", error);
                alert('An error occurred during signup. Please try again.');
            }
        } else { // Login
            try {
                const response = await fetch('http://localhost:8080/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: formData.email, // API expects 'username'
                        password: formData.password
                    }),
                });

                if (!response.ok) {
                    const errorText = await response.text(); // Backend sends plain text error messages
                    throw new Error(errorText || 'Login failed');
                }

                const data = await response.json();

                localStorage.setItem('token', data.token);
                setIsLoggedIn(true);

                const role = data.role; // Should be "CUSTOMER", "RESTAURANT", "COURIER"
                const username = data.username; // This is the email
                localStorage.setItem('role' ,role);
                localStorage.setItem('user', username); // Storing email as user identifier

                if (role === "CUSTOMER") {
                    navigate('/');
                } else if (role === "RESTAURANT") {
                    navigate(`/restaurant`);
                } else if(role == "ADMIN") {
                    localStorage.setItem('user', username);
                    localStorage.setItem('role', role);
                    navigate('/admin');
                }

                else if (role === "COURIER") {
                    navigate(`/courier`);
                } else {
                    // Fallback or error if role is unexpected
                    alert("Login successful, but role is unrecognized. Redirecting to home.");
                    navigate('/');
                }
            } catch (error: any) {
                console.error("Login error:", error);
                alert(error.message || "Login failed. Please check your credentials.");
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target as HTMLInputElement; // Type assertion
        const { name, value, type } = target;
        const checked = target.checked; // Explicitly get checked for checkboxes

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox'
                ? checked
                : name === 'phoneNumber'
                    ? formatPhoneNumber(value)
                    : value,
        }));

        // Real-time validation (optional, can be kept or removed if submit validation is preferred)
        if (name === 'password' && !showLogin) {
            const passwordRegex = /^(?=.*[A-Z])(?=.*\W).{8,}$/;
            setPasswordError(passwordRegex.test(value) ? '' : 'Password: 8+ chars, 1 uppercase, 1 special.');
        }
        if (name === 'email' && !showLogin) {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            setEmailError(emailRegex.test(value) ? '' : 'Invalid email format.');
        }
        if (name === 'phoneNumber' && !showLogin) { // only validate on signup
            const phoneRegex = /^\d{3} \d{3} \d{2} \d{2}$/;
            // Only show error if user has typed something and it's not yet valid
            if (value && !phoneRegex.test(formatPhoneNumber(value))) {
                setPhoneNumberError('Phone format: XXX XXX XX XX');
            } else {
                setPhoneNumberError('');
            }
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
            formData.fullName &&
            passwordRegex.test(formData.password) &&
            emailRegex.test(formData.email) &&
            phoneRegex.test(formData.phoneNumber) && // Ensure phone number is also valid
            formData.agreeToTerms &&
            (formData.role === 'restaurant' ? !!formData.restaurantName : true) // restaurant name required if role is restaurant
        );
    };

    const toggleView = () => {
        setAnimationClass('fade-out');
        setPasswordError(''); // Clear errors on view toggle
        setEmailError('');
        setPhoneNumberError('');
        setTimeout(() => {
            setShowLogin(!showLogin);
            setAnimationClass('fade-in');
            // Clear form data when switching views
            setFormData({
                fullName: '',
                email: '',
                password: '',
                phoneNumber: '',
                agreeToTerms: false,
                rememberMe: false,
                role: 'customer',
                restaurantName: ''
            });
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email or Username</label>
                                    <input
                                        type="text"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        placeholder="Enter your email or username"
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
                                <div className="mt-2 text-gray-600">
                                    <span>For admin login use:</span><br />
                                    <span>Email: <strong>admin</strong></span><br />
                                    <span>Password: <strong>admin</strong></span>
                                </div>
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
                                        {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
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
                                        {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                                            Phone Number
                                        </label>
                                        <input
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            type="text"
                                            placeholder="e.g., 555 123 45 67"
                                            required
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            className={`mt-1 block w-full px-3 py-2 border ${phoneNumberError ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                        />
                                        {phoneNumberError && <p className="text-red-500 text-xs mt-1">{phoneNumberError}</p>}
                                    </div>

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
                                            <option value="courier">Courier</option>
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
                                                required={formData.role === 'restaurant'}
                                                value={formData.restaurantName}
                                                onChange={handleChange}
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <label className="inline-flex items-center">
                                            <input
                                                type="checkbox"
                                                name="agreeToTerms"
                                                checked={formData.agreeToTerms}
                                                onChange={handleChange}
                                                className="form-checkbox h-5 w-5 text-orange-500"
                                                required
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