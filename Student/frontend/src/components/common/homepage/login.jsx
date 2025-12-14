import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, UserCog, ClipboardList, BookOpen, Shield, ArrowRight } from 'lucide-react';
import Bg from '../../../assets/img/tryBG7.png';
import Logo from '../../../assets/img/gymnazu.png';
import SuccessModal from "../../modals/SuccessModal";

const ROLES = {
  STUDENT: {
    id: 'student',
    label: 'Student',
    icon: GraduationCap,

  },
  TEACHER: {
    id: 'teacher',
    label: 'Teacher',
    icon: BookOpen,
    url: 'http://localhost:5177/login'
  }
};

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState('');
  const [selectedRole, setSelectedRole] = useState(ROLES.STUDENT.id);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRoleChange = (roleId) => {
    if (roleId === selectedRole) return;

    setIsTransitioning(true);
    setError('');

    setTimeout(() => {
      setSelectedRole(roleId);
      setUsername('');
      setPassword('');
      setIsTransitioning(false);
    }, 200);
  };

  const handleStaffRedirect = (url) => {
    window.location.href = url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Input validation
    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const result = await login(username, password);

      if (result.success) {
        setLoggedInUser(result.user.fullName);
        setShowSuccessModal(true);

        console.log(`User Type: ${result.user.userType}`);
        console.log(`Redirecting to: ${result.redirectUrl}`);

        setTimeout(() => {
          const currentPort = window.location.port;
          const targetUrl = new URL(result.redirectUrl);

          if (targetUrl.port === currentPort) {
            navigate(targetUrl.pathname);
          } else {
            window.location.href = result.redirectUrl;
          }
        }, 2000);
      } else {
        // Handle unsuccessful login with custom message
        setError(result.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);

      // Handle network errors
      if (!err.response) {
        if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
          setError('Connection timeout. Please check your internet connection and try again.');
        } else if (err.message.includes('Network Error')) {
          setError('Network error. Please check your internet connection.');
        } else {
          setError('Unable to connect to server. Please try again later.');
        }
        return;
      }

      // Handle HTTP errors
      const status = err.response?.status;
      const errorMessage = err.response?.data?.message;

      switch (status) {
        case 400:
          setError(errorMessage || 'Invalid input. Please check your credentials.');
          break;
        case 401:
          setError('Invalid student number or password. Please try again.');
          break;
        case 403:
          setError('Access denied. Please contact the school office.');
          break;
        case 404:
          setError('Account not found. Please check your student number.');
          break;
        case 500:
          setError('Server error. Please try again later or contact support.');
          break;
        case 503:
          setError('Service temporarily unavailable. Please try again later.');
          break;
        default:
          setError(errorMessage || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  const isStudentRole = selectedRole === ROLES.STUDENT.id;
  const currentRole = Object.values(ROLES).find(role => role.id === selectedRole);
  const CurrentRoleIcon = currentRole?.icon;

  return (
    <>
      <SuccessModal
        isOpen={showSuccessModal}
        username={loggedInUser}
      />
      <div className="relative h-[85.4vh] w-full flex items-center justify-center pb-6">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${Bg})` }}
        >
          <div className="absolute inset-0 bg-stone-900/60 dark:bg-black/70 z-0 transition-colors duration-300"></div>
        </div>

        <div className="relative z-10 w-full max-w-sm mx-4 p-5 sm:p-6 rounded-2xl shadow-xl bg-stone-800/60 dark:bg-gray-900/70 border border-stone-700 dark:border-gray-600 backdrop-blur-sm transition-all duration-300">
          <div className="flex flex-col items-center mb-3 sm:mb-4">
            <img
              src={Logo}
              alt="School Logo"
              className="w-14 h-14 sm:w-16 sm:h-16 mb-2 object-contain"
            />
          </div>

          <div className="mb-3 sm:mb-4">
            <label className="block text-[10px] sm:text-xs text-gray-300 mb-1.5 font-medium tracking-wide">Login as:</label>
            <div className="grid grid-cols-5 gap-1.5 p-1 bg-stone-900/50 dark:bg-gray-800/50 rounded-xl border border-stone-600 dark:border-gray-700">
              {Object.values(ROLES).map((role) => {
                const IconComponent = role.icon;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleRoleChange(role.id)}
                    className={`
              relative flex flex-col items-center justify-center py-2 px-1 rounded-lg
              transition-all duration-300 ease-in-out
              ${selectedRole === role.id
                        ? 'bg-amber-400 text-gray-900 shadow-lg scale-105'
                        : 'text-gray-300 hover:bg-stone-700/50 dark:hover:bg-gray-700/50'
                      }
            `}
                    aria-label={`Login as ${role.label}`}
                  >
                    <IconComponent className="w-5 h-5 mb-0.5" strokeWidth={2.5} />
                    <span className="text-[9px] font-semibold leading-tight">{role.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="mb-3 p-2 sm:p-2.5 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-xs text-center">
              {error}
            </div>
          )}

          <div className={`
    transition-all duration-300 ease-in-out
    ${isStudentRole && !isTransitioning ? 'opacity-100 max-h-80' : 'opacity-0 max-h-0 overflow-hidden'}
  `}>
            <form className="space-y-2.5 sm:space-y-3" onSubmit={handleSubmit}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Student Email or ID"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2 sm:py-2.5 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-amber-500 transition duration-300 placeholder-gray-500 dark:placeholder-gray-400 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-700 shadow-sm text-sm disabled:opacity-50"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                </span>
              </div>

              <div>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-2 sm:py-2.5 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-amber-500 transition duration-300 placeholder-gray-500 dark:placeholder-gray-400 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-700 shadow-sm text-sm disabled:opacity-50"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10a3 3 0 106 0v-3a3 3 0 00-6 0v3z"></path></svg>
                  </span>
                </div>
                <div className="text-right mt-1">
                  <Link to="/forgot-password" className="text-xs text-gray-300 hover:text-amber-400 transition duration-300">Forgot Password?</Link>
                </div>
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 sm:py-2.5 text-gray-900 font-semibold rounded-full bg-amber-400 hover:bg-amber-300 transition duration-300 shadow-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Logging in...</span>
                    </>
                  ) : (
                    'Login'
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className={`
    transition-all duration-300 ease-in-out
    ${!isStudentRole && !isTransitioning ? 'opacity-100 max-h-80' : 'opacity-0 max-h-0 overflow-hidden'}
  `}>
            <div className="space-y-3 py-3 sm:py-4">
              <div className="text-center space-y-1">
                {CurrentRoleIcon && (
                  <div className="flex justify-center mb-2">
                    <CurrentRoleIcon className="w-12 h-12 sm:w-14 sm:h-14 text-amber-400" strokeWidth={2} />
                  </div>
                )}
                <h3 className="text-white text-base font-semibold">{currentRole?.label} Portal</h3>
                <p className="text-gray-300 text-xs">You will be redirected to the {currentRole?.label.toLowerCase()} portal</p>
              </div>

              <button
                onClick={() => handleStaffRedirect(currentRole?.url)}
                className="w-full py-2 sm:py-2.5 text-gray-900 font-semibold rounded-full bg-amber-400 hover:bg-amber-300 transition duration-300 shadow-lg text-sm flex items-center justify-center gap-2 group"
              >
                <span>Continue to Portal</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="text-center">
                <p className="text-xs text-gray-400">
                  Or{' '}
                  <button
                    onClick={() => handleRoleChange(ROLES.STUDENT.id)}
                    className="text-amber-400 hover:underline font-medium"
                  >
                    login as Student
                  </button>
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-3 sm:mt-4 text-xs text-gray-300">
            Need help? Contact the <Link to="/#contact-us" className="font-semibold text-amber-400 hover:underline">School Office</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;