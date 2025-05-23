import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/bnb.jpg';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface FormDataInterface {
    fullName: string;
    email: string;
    password: string;
    phoneNumber: string;
    agreeToTerms: boolean;
    rememberMe: boolean;
    role: 'customer' | 'restaurant' | 'courier';
    restaurantName?: string;
    address?: string;        // YENİ: Restoran için
    cuisine?: string;        // YENİ: Restoran için
    image?: string;          // YENİ: Restoran için resim URL'si
}

function Auth() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showLogin, setShowLogin] = useState(true);
    const [animationClass, setAnimationClass] = useState('fade-in');
    const [searchParams] = useSearchParams();
    const { setIsLoggedIn, setToken } = useAuth();

    const initialFormData: FormDataInterface = {
        fullName: '',
        email: '',
        password: '',
        phoneNumber: '', // Başlangıçta boş
        agreeToTerms: false,
        rememberMe: false,
        role: 'customer',
        restaurantName: '',
        address: '',      // YENİ
        cuisine: '',      // YENİ
        image: ''         // YENİ
    };

    const [formData, setFormData] = useState<FormDataInterface>(initialFormData);

    const [passwordError, setPasswordError] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [phoneNumberError, setPhoneNumberError] = useState<string>('');

    // Sadece sayıları alıp, sonra formatlayan bir yaklaşım
    const formatPhoneNumberInput = (value: string): string => {
        const cleaned = value.replace(/\D/g, ''); // Sadece rakamları al
        const maxLength = 10; // Maksimum 10 rakam (alan kodu olmadan Türkiye için)
        const truncated = cleaned.slice(0, maxLength);

        let formatted = '';
        if (truncated.length > 0) {
            formatted += truncated.substring(0, 3);
        }
        if (truncated.length > 3) {
            formatted += ' ' + truncated.substring(3, 6);
        }
        if (truncated.length > 6) {
            formatted += ' ' + truncated.substring(6, 8);
        }
        if (truncated.length > 8) {
            formatted += ' ' + truncated.substring(8, 10);
        }
        return formatted;
    };

    // Telefon numarasının geçerli formatta olup olmadığını kontrol eder
    const isValidPhoneNumberFormat = (value: string): boolean => {
        const phoneRegex = /^\d{3} \d{3} \d{2} \d{2}$/;
        return phoneRegex.test(value);
    };

    useEffect(() => {
        const mode = searchParams.get('mode');
        if (mode === 'signup') {
            setShowLogin(false);
            setFormData(initialFormData);
        } else {
            setShowLogin(true);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        setEmailError('');
        setPhoneNumberError('');

        if (!showLogin) { // Signup işlemi
            // Temel validasyonlar
            const passwordRegex = /^(?=.*[A-Z])(?=.*\W).{8,}$/;
            if (!passwordRegex.test(formData.password)) {
                setPasswordError('Password: 8+ chars, 1 uppercase, 1 special.');
                return;
            }
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(formData.email)) {
                setEmailError('Invalid email format.');
                return;
            }
            if (!isValidPhoneNumberFormat(formData.phoneNumber)) { // isValidPhoneNumberFormat fonksiyonunuzun olduğunu varsayıyorum
                setPhoneNumberError('Phone format: XXX XXX XX XX');
                return;
            }
            if (!formData.agreeToTerms) {
                alert("You must agree to the terms and conditions.");
                return;
            }

            // Role özel validasyonlar
            if ((formData.role === 'customer' || formData.role === 'courier') && !formData.fullName.trim()) {
                alert("Full name is required for customer and courier roles.");
                return;
            }

            if (formData.role === 'restaurant') {
                if (!formData.restaurantName?.trim()) {
                    alert("Restaurant name is required.");
                    return;
                }
                if (!formData.address?.trim()) {
                    alert("Restaurant address is required.");
                    return;
                }
                if (!formData.cuisine?.trim()) {
                    alert("Restaurant cuisine type is required.");
                    return;
                }
                if (!formData.image?.trim()) {
                    alert("Restaurant image URL is required.");
                    return;
                }
                try {
                    new URL(formData.image); // Basit URL format kontrolü
                    if (!(formData.image.startsWith('http://') || formData.image.startsWith('https://'))) {
                        throw new Error("URL must start with http:// or https://");
                    }
                } catch (_) {
                    alert("Invalid image URL format. It must be a valid URL starting with http:// or https://.");
                    return;
                }
                // Restoran için fullName (iletişim kişisi) opsiyonel olabilir, bu yüzden burada zorunluluk kontrolü yok.
                // Eğer zorunluysa, yukarıdaki customer/courier kontrolüne benzer bir kontrol eklenebilir.
            }

            try {
                const payload: any = {
                    email: formData.email,
                    password: formData.password,
                    phoneNumber: formData.phoneNumber.replace(/\s/g, ''), // Boşlukları temizle
                    role: formData.role,
                    // fullName hem customer/courier için hem de restoran için 'contact person name' olarak gönderilebilir.
                    // Eğer restoran için fullName girilmediyse, backend null veya boş string alacak.
                    fullName: formData.fullName.trim() || null, // Boşsa null gönder
                };

                if (formData.role === 'restaurant') {
                    payload.restaurantName = formData.restaurantName;
                    payload.address = formData.address;
                    payload.cuisine = formData.cuisine;
                    payload.image = formData.image;
                }

                const response = await fetch('http://localhost:8080/api/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                const resultData = await response.json();

                if (response.ok) {
                    alert(resultData.message);
                    const emailForLogin = formData.email;
                    setShowLogin(true);
                    navigate('/auth'); // URL'i /auth'a resetle (mode=signup kalksın)
                    setAnimationClass('fade-in');
                    setFormData({ // Formu login için hazırla
                        ...initialFormData, // Önce tamamen sıfırla (address, cuisine, image de sıfırlanır)
                        email: emailForLogin, // Sadece e-postayı signup'tan al
                    });
                } else {
                    alert(resultData.message || `Signup failed with status: ${response.status}`);
                }
            } catch (error) {
                console.error("Signup error:", error);
                alert('An error occurred during signup. Please try again.');
            }
        } else { // Login işlemi
            if (!formData.email || !formData.password) {
                alert("Email and password are required for login.");
                return;
            }
            try {
                const response = await fetch('http://localhost:8080/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: formData.email, password: formData.password }),
                });

                if (!response.ok) {
                    const errorBody = await response.text();
                    alert(errorBody || `Login failed with status: ${response.status}`);
                    return;
                }

                const data = await response.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.role);
                localStorage.setItem('user', data.username);
                setToken(data.token); // AuthContext'i güncelle
                setIsLoggedIn(true);  // AuthContext'i güncelle

                if (data.role === "ADMIN") navigate('/admin');
                else if (data.role === "CUSTOMER") navigate('/');
                else if (data.role === "RESTAURANT") navigate(`/restaurant`);
                else if (data.role === "COURIER") navigate(`/courier`);
                else {
                    alert("Login successful, but role is unrecognized. Redirecting to home.");
                    navigate('/');
                }
            } catch (error: any) {
                console.error("Login error:", error);
                alert(error.message || "Login failed. Please check your credentials or network connection.");
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target as HTMLInputElement;
        let { name, value, type } = target; // value'yu let yaptık
        const checked = target.checked;

        if (name === 'phoneNumber') {
            value = formatPhoneNumberInput(value); // Gelen değeri formatla
            // Anlık validasyon SADECE signup sırasında ve değer varsa
            if (!showLogin && value) {
                if (!isValidPhoneNumberFormat(value) && value.replace(/\s/g, '').length === 10) {
                    // Eğer 10 rakam girilmişse ve format hala yanlışsa (bu pek olmamalı formatPhoneNumberInput ile)
                    // veya kullanıcı formatı bozacak bir şey yaparsa (örneğin araya harf sokmaya çalışırsa formatPhoneNumberInput temizler)
                    // Bu anlık hata mesajını daha dikkatli ayarlamak gerekebilir.
                    // Belki de anlık hata mesajını sadece tam 10 rakam girildiğinde ve format yanlışsa göstermek daha iyi.
                    // Şimdilik, submit sırasında ana validasyon var.
                    setPhoneNumberError(''); // Anlık hatayı şimdilik kaldırıyorum, submit'e bırakıyorum
                } else if (value.replace(/\s/g, '').length < 10) {
                    setPhoneNumberError(''); // Henüz tam değilse hata gösterme
                } else {
                    setPhoneNumberError(''); // Format doğruysa veya daha az karakter varsa hata yok
                }
            } else if (!showLogin && !value) {
                setPhoneNumberError(''); // Boşsa hata gösterme
            }
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

        // Diğer anlık validasyonlar (sadece signup'ta)
        if (!showLogin) {
            if (name === 'password') {
                const passwordRegex = /^(?=.*[A-Z])(?=.*\W).{8,}$/;
                setPasswordError(passwordRegex.test(value) ? '' : 'Password: 8+ chars, 1 uppercase, 1 special.');
            }
            if (name === 'email') {
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                setEmailError(emailRegex.test(value) ? '' : 'Invalid email format.');
            }
        }
    };

    const isFormValid = () => {
        if (showLogin) {
            return !!(formData.email && formData.password); // Login için sadece email ve şifre dolu mu diye bak
        }

        // Signup form validasyonu
        const passwordRegex = /^(?=.*[A-Z])(?=.*\W).{8,}$/;
        if (!passwordRegex.test(formData.password)) return false;

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(formData.email)) return false;

        if (!isValidPhoneNumberFormat(formData.phoneNumber)) return false; // isValidPhoneNumberFormat fonksiyonunuzun olduğunu varsayıyorum

        if (!formData.agreeToTerms) return false;

        if (formData.role === 'customer' || formData.role === 'courier') {
            if (!formData.fullName.trim()) return false;
        }

        if (formData.role === 'restaurant') {
            if (!formData.restaurantName?.trim()) return false;
            if (!formData.address?.trim()) return false;
            if (!formData.cuisine?.trim()) return false;
            if (!formData.image?.trim()) return false;
            try {
                new URL(formData.image); // Basit URL format kontrolü
                if (!(formData.image.startsWith('http://') || formData.image.startsWith('https://'))) {
                    return false; // URL http veya https ile başlamalı
                }
            } catch (_) {
                return false; // Geçersiz URL formatı
            }
            // Restoran için fullName (iletişim kişisi) opsiyonel ise, buraya onun için bir kontrol eklemeye gerek yok
            // Eğer zorunluysa: if (!formData.fullName?.trim()) return false;
        }
        return true; // Tüm kontrollerden geçerse form valid
    };

    const toggleView = () => {
        setAnimationClass('fade-out');
        setPasswordError('');
        setEmailError('');
        setPhoneNumberError('');
        setFormData(initialFormData);

        setTimeout(() => {
            const newShowLogin = !showLogin;
            setShowLogin(newShowLogin);
            if (newShowLogin) {
                navigate('/auth');
            } else {
                navigate('/auth?mode=signup');
            }
            setAnimationClass('fade-in');
        }, 300);
    };

    // JSX kısmı aynı kalacak (bir önceki cevaptaki gibi)
    return (
        <div className="min-h-screen flex items-center justify-center" style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }}>
            <div className="max-w-md w-full mx-4">
                <div className={`bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 ${animationClass}`}>
                    {showLogin ? (
                        // LOGIN FORM
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
                                            aria-label={showPassword ? "Hide password" : "Show password"}
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
                        // SIGNUP FORM
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
                                                aria-label={showPassword ? "Hide password" : "Show password"}
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
                                            value={formData.phoneNumber} // Formatlanmış değeri göster
                                            onChange={handleChange}
                                            className={`mt-1 block w-full px-3 py-2 border ${phoneNumberError ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                            maxLength={13} // "XXX XXX XX XX" için (10 rakam + 3 boşluk)
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
                                            <div>
                                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Restaurant Address</label>
                                                <input id="address" name="address" type="text" required value={formData.address} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                                            </div>
                                            <div>
                                                <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700">Cuisine Type</label>
                                                <input id="cuisine" name="cuisine" type="text" placeholder="e.g., Italian, Turkish" required value={formData.cuisine} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                                            </div>
                                            <div>
                                                <label htmlFor="image" className="block text-sm font-medium text-gray-700">Restaurant Image URL</label>
                                                <input id="image" name="image" type="url" placeholder="https://example.com/image.jpg" required value={formData.image} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                                            </div>
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