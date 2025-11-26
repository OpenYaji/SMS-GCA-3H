import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Logo from '../../assets/img/gymnazu.png';

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (!token) {
            setError('Invalid reset link');
            setVerifying(false);
            return;
        }

        const verifyToken = async () => {
            try {
                const response = await axios.get(
                    `/backend/api/auth/verifyResetToken.php?token=${token}`
                );

                if (response.data.success) {
                    setTokenValid(true);
                } else {
                    setError(response.data.message || 'Invalid or expired reset link');
                }
            } catch (err) {
                setError('Invalid or expired reset link');
            } finally {
                setVerifying(false);
            }
        };

        verifyToken();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                '/backend/api/auth/resetPassword.php',
                { token, password },
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (response.data.success) {
                setMessage(response.data.message);
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('An error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (verifying) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-800 to-stone-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    if (!tokenValid) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-800 to-stone-900 px-4">
                <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-stone-800/80 border border-stone-700 backdrop-blur-sm text-center">
                    <div className="mb-6">
                        <svg className="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">Invalid Reset Link</h2>
                    <p className="text-gray-300 mb-6">{error}</p>
                    <Link to="/forgot-password" className="inline-block px-6 py-3 bg-amber-400 text-gray-900 font-semibold rounded-full hover:bg-amber-300 transition">
                        Request New Link
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-800 to-stone-900 dark:from-gray-900 dark:to-black px-4 transition-colors duration-300">
            <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-stone-800/80 dark:bg-gray-900/80 border border-stone-700 dark:border-gray-600 backdrop-blur-sm">

                <div className="flex flex-col items-center mb-6">
                    <img src={Logo} alt="School Logo" className="w-20 h-20 mb-4 object-contain" />
                    <h2 className="text-2xl font-bold uppercase text-white tracking-wider">Reset Password</h2>
                    <p className="text-sm text-gray-300 mt-2 text-center">
                        Enter your new password below
                    </p>
                </div>

                {message && (
                    <div className="mb-4 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-200 text-sm">
                        {message}
                        <p className="mt-2 text-xs">Redirecting to login...</p>
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-sm text-center">
                        {error}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading || !!message}
                            className="w-full pl-12 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-amber-500 transition duration-300 placeholder-gray-500 dark:placeholder-gray-400 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-700 shadow-sm text-sm disabled:opacity-50"
                        />
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                            </svg>
                        </span>
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                            disabled={loading || !!message}
                        >
                            {showPassword ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                </svg>
                            )}
                        </button>
                    </div>

                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={loading || !!message}
                            className="w-full pl-12 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-amber-500 transition duration-300 placeholder-gray-500 dark:placeholder-gray-400 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-700 shadow-sm text-sm disabled:opacity-50"
                        />
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                            </svg>
                        </span>
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                            disabled={loading || !!message}
                        >
                            {showConfirmPassword ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                </svg>
                            )}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !!message}
                        className="w-full py-3 text-gray-900 font-semibold rounded-full bg-amber-400 hover:bg-amber-300 transition duration-300 shadow-lg text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Resetting...</span>
                            </>
                        ) : (
                            'Reset Password'
                        )}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <Link to="/login" className="text-sm text-amber-400 hover:text-amber-300 transition duration-300">
                        ← Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
