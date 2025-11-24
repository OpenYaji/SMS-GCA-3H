import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Logo from '../../assets/img/gymnazu.png';

const ForgotPasswordPage = () => {
    const [identifier, setIdentifier] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [debugLink, setDebugLink] = useState(''); // For testing

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setDebugLink('');
        setLoading(true);

        if (!identifier.trim()) {
            setError('Please enter your student number or email address');
            setLoading(false);
            return;
        }

        try {
            // Direct call to requestPasswordReset - no getCurrentUser.php involved
            const response = await axios.post(
                '/backend/api/auth/requestPasswordReset.php',
                { identifier },
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (response.data.success) {
                setMessage(response.data.message);
                setIdentifier('');

                // Show debug link if available (remove in production)
                if (response.data.debug_link) {
                    setDebugLink(response.data.debug_link);
                }
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('An error occurred. Please try again.');
            }
            console.error('Forgot password error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-800 to-stone-900 dark:from-gray-900 dark:to-black px-4 transition-colors duration-300">
            <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-stone-800/80 dark:bg-gray-900/80 border border-stone-700 dark:border-gray-600 backdrop-blur-sm">

                <div className="flex flex-col items-center mb-6">
                    <img
                        src={Logo}
                        alt="School Logo"
                        className="w-20 h-20 mb-4 object-contain"
                    />
                    <h2 className="text-2xl font-bold uppercase text-white tracking-wider">Forgot Password</h2>
                    <p className="text-sm text-gray-300 mt-2 text-center">
                        Enter your student number or email address and we'll send you a link to reset your password
                    </p>
                </div>

                {message && (
                    <div className="mb-4 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-200 text-sm">
                        {message}
                        {debugLink && (
                            <div className="mt-3 p-2 bg-gray-800 rounded">
                                <p className="text-xs text-gray-400 mb-1">Debug Link (For Testing):</p>
                                <a href={debugLink} className="text-xs text-blue-400 hover:text-blue-300 break-all">
                                    {debugLink}
                                </a>
                            </div>
                        )}
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
                            type="text"
                            placeholder="Student Number or Email"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            disabled={loading}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-amber-500 transition duration-300 placeholder-gray-500 dark:placeholder-gray-400 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-700 shadow-sm text-sm disabled:opacity-50"
                        />
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </span>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 text-gray-900 font-semibold rounded-full bg-amber-400 hover:bg-amber-300 transition duration-300 shadow-lg text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Sending...</span>
                            </>
                        ) : (
                            'Send Reset Link'
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

export default ForgotPasswordPage;
