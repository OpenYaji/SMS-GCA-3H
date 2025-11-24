import React, { useState, useEffect } from 'react';
import { KeyRound, ShieldCheck, Smartphone, LogOut, X } from 'lucide-react';
import axios from 'axios';
import Logo from '../../../assets/img/gymnazu.png';

const SecurityAction = ({ icon, title, description, buttonText, tooltipText, onClick }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 border-b border-gray-100 dark:border-slate-700">
    <div className="flex items-center gap-4 mb-3 sm:mb-0">
      {icon}
      <div>
        <h4 className="font-semibold text-gray-800 dark:text-gray-200">{title}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
    </div>
    <div className="relative group">
      <button
        onClick={onClick}
        className="bg-gray-100 dark:bg-slate-700 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors flex-shrink-0">
        {buttonText}
      </button>
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs font-bold rounded-md px-2 py-1 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-in-out whitespace-nowrap z-10">
        {tooltipText}
      </span>
    </div>
  </div>
);

const SuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100 animate-fade-in">

        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Password Changed!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            Your password has been <span className="font-semibold text-green-600 dark:text-green-400">successfully updated</span>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Please use your new password for future logins.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors mb-4"
        >
          Got it
        </button>

        <div className="flex justify-center">
          <img src={Logo} alt="Logo" className="w-12 h-12 opacity-50" />
        </div>

      </div>
    </div>
  );
};

const ChangePasswordModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validatePassword = (password) => {
    if (password.length < 8) return 'Password must be at least 8 characters long';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    const validationError = validatePassword(formData.newPassword);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.put(
        '/backend/api/security/changePassword.php',
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        onSuccess();
        onClose();
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Change Password</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            />
            <p className="text-xs text-gray-500 mt-1">
              Must be 8+ characters with uppercase, lowercase, and number
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-slate-600 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SecuritySettings = () => {
  const [lastPasswordChange, setLastPasswordChange] = useState('Loading...');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    fetchPasswordInfo();
  }, []);

  const fetchPasswordInfo = async () => {
    try {
      const response = await axios.get(
        '/backend/api/security/getPasswordInfo.php',
        { withCredentials: true }
      );

      if (response.data.success && response.data.lastChanged) {
        const date = new Date(response.data.lastChanged);
        setLastPasswordChange(date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }));
      }
    } catch (error) {
      console.error('Error fetching password info:', error);
      setLastPasswordChange('Unknown');
    }
  };

  const handlePasswordChangeSuccess = () => {
    setShowSuccessModal(true);
    fetchPasswordInfo();
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
        Security Settings
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Keep your account safe and secure.
      </p>

      <div className="space-y-2">
        <SecurityAction
          icon={<KeyRound className="text-amber-500" />}
          title="Change Password"
          description={`Last changed on ${lastPasswordChange}`}
          buttonText="Change"
          tooltipText="Update your password"
          onClick={() => setShowPasswordModal(true)}
        />
        <SecurityAction
          icon={<ShieldCheck className="text-green-500" />}
          title="Two-Factor Authentication"
          description="Your account is protected."
          buttonText="Manage"
          tooltipText="Manage your 2FA settings"
          onClick={() => alert('2FA management coming soon')}
        />
        <SecurityAction
          icon={<Smartphone className="text-blue-500" />}
          title="Login Activity"
          description="Last login from Quezon City, Philippines"
          buttonText="View History"
          tooltipText="See recent login locations"
          onClick={() => alert('Login history coming soon')}
        />
        <SecurityAction
          icon={<LogOut className="text-red-500" />}
          title="Active Sessions"
          description="Log out from all other devices."
          buttonText="Log Out All"
          tooltipText="Remotely log out everywhere"
          onClick={() => alert('Session management coming soon')}
        />
      </div>

      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={handlePasswordChangeSuccess}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
};

export default SecuritySettings;