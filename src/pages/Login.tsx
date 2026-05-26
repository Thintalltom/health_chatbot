import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import loginImage from '../assets/png/LoginImage.png';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const DUMMY_EMAIL = 'admin@medaux.com';
    const DUMMY_PASSWORD = 'password123';

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate loading
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (email === DUMMY_EMAIL && password === DUMMY_PASSWORD) {
            // Store login state in localStorage
            localStorage.setItem('isLoggedIn', 'true');
            navigate('/');
        } else {
            setError('Invalid email or password. Please try again.');
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Left Side - Image */}
            <div className="flex-1 bg-[#F7FAFF] flex items-center justify-center p-6 lg:p-8">
                <div className="w-full max-w-[560px] text-center">
                    <div className="w-full h-[320px] sm:h-[380px] lg:h-[440px] overflow-hidden rounded-t-[28px] rounded-b-[84px] shadow-[0px_14px_35px_rgba(31,94,219,0.18)] border border-[#E5EEFF] bg-white">
                        <img
                            src={loginImage}
                            alt="MedAux login"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <h2 className="font-satoshi font-bold text-[32px] text-[#0C2D68] mt-8 mb-3 tracking-wide">
                        MEDAUX
                    </h2>
                    <p className="font-mulish text-[16px] text-[#38527A] leading-relaxed px-2">
                        MedAux is an AI assistant that supports doctors during consultations with real-time transcription, smart suggestions, and automated session summaries.
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 bg-white flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <h1 className="font-satoshi font-bold text-[32px] text-[#080E0D] mb-2">
                            MedAUX
                        </h1>
                        <h2 className="font-satoshi font-semibold text-[24px] text-[#418BF5] mb-2">
                            Welcome to MedAUX
                        </h2>
                        <p className="font-mulish text-[14px] text-[#7A7A7A]">
                            Please sign in to your account
                        </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label className="block font-mulish font-semibold text-[14px] text-[#080E0D] mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full p-4 border border-[#EDEDED] rounded-xl font-mulish text-[14px] text-[#080E0D] placeholder-[#BCBCBC] focus:outline-none focus:border-[#418BF5] focus:ring-1 focus:ring-[#418BF5] transition-all"
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block font-mulish font-semibold text-[14px] text-[#080E0D] mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full p-4 pr-12 border border-[#EDEDED] rounded-xl font-mulish text-[14px] text-[#080E0D] placeholder-[#BCBCBC] focus:outline-none focus:border-[#418BF5] focus:ring-1 focus:ring-[#418BF5] transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7A7A7A] hover:text-[#418BF5] transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" strokeWidth={2} />
                                    ) : (
                                        <Eye className="w-5 h-5" strokeWidth={2} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-lg p-3">
                                <p className="font-mulish text-[14px] text-[#DC2626]">
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Demo Credentials */}
                        <div className="bg-[#F0F9FF] border border-[#BAE6FD] rounded-lg p-3">
                            <p className="font-mulish text-[12px] text-[#0369A1] mb-1">
                                <strong>Demo Credentials:</strong>
                            </p>
                            <p className="font-mulish text-[12px] text-[#0369A1]">
                                Email: admin@medaux.com
                            </p>
                            <p className="font-mulish text-[12px] text-[#0369A1]">
                                Password: password123
                            </p>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-[#418BF5] via-[#418BF5] to-[#1F5EDB] hover:from-[#3A7BD5] hover:via-[#3A7BD5] hover:to-[#1A52C7] transition-all text-white h-[48px] font-satoshi font-bold text-[16px] px-6 py-3 rounded-xl shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Signing In...' : 'Login'}
                        </button>

                        {/* Forgot Password Link */}
                        <div className="text-center">
                            <button
                                type="button"
                                className="font-mulish text-[14px] text-[#418BF5] hover:text-[#3A7BD5] transition-colors"
                            >
                                Forgot your password?
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}