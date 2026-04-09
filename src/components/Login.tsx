import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useLoginMutation } from '../store/slices/apiSlice';
import { useAppDispatch } from '../store/hooks';
import { setCredentials, setLoading } from '../store/slices/authSlice';
// import loginImage from '../assets/svgs/image 5.svg';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    
    const [login, { isLoading }] = useLoginMutation();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        dispatch(setLoading(true));

        try {
            const result = await login({ email, password }).unwrap();
            
            // The API returns access_token and user directly
            if (result.access_token && result.user) {
                // Store credentials in Redux and localStorage
                dispatch(setCredentials({
                    user: result.user,
                    token: result.access_token
                }));
                
                // Navigate to dashboard
                navigate('/');
            } else {
                setError('Login failed. Please try again.');
            }
        } catch (err: any) {
            console.error('Login error:', err);
            
            // Handle different error types
            if (err.status === 401) {
                setError('Invalid email or password. Please check your credentials.');
            } else if (err.status === 400) {
                setError(err.data?.message || 'Please check your input and try again.');
            } else if (err.status >= 500) {
                setError('Server error. Please try again later.');
            } else {
                setError(err.data?.message || 'An error occurred. Please try again.');
            }
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Image */}
            <div className="flex-1 bg-gradient-to-br from-[#418BF5] to-[#1F5EDB] flex items-center justify-center p-8">
                <div className="max-w-md text-center">
                    {/* <img 
                        src={loginImage} 
                        alt="Medical Professional" 
                        className="w-full h-auto max-w-[400px] mx-auto mb-6"
                    /> */}
                    {/* <h2 className="font-satoshi font-bold text-[28px] text-white mb-4">
                        Healthcare Management Made Simple
                    </h2> */}
                    {/* <p className="font-mulish text-[16px] text-white/90 leading-relaxed">
                        Streamline your medical practice with our comprehensive patient management system
                    </p> */}
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 bg-white flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className=" mb-8">
                        <h1 className="font-satoshi font-bold text-[32px] text-[#080E0D] mb-6">
                            LOGO
                        </h1>
                        <h2 className="font-satoshi font-semibold text-[24px] text-[#080E0D]  mb-2">
                            Welcome to MedAUX
                        </h2>
                        <p className="font-mulish text-[14px] text-[#7A7A7A]">
                           Input your details to get started
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
                       

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-[#418BF5] via-[#418BF5] to-[#1F5EDB] hover:from-[#3A7BD5] hover:via-[#3A7BD5] hover:to-[#1A52C7] transition-all text-white h-[48px] font-satoshi font-bold text-[16px] px-6 py-3 rounded-xl shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Signing In...' : 'Login'}
                        </button>

                        {/* Forgot Password Link */}
                        {/* <div className="text-center">
                            <button
                                type="button"
                                className="font-mulish text-[14px] text-[#418BF5] hover:text-[#3A7BD5] transition-colors"
                            >
                                Forgot your password?
                            </button>
                        </div> */}
                    </form>
                </div>
            </div>
        </div>
    );
}