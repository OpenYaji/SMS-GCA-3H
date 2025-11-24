import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, UserPlus, CheckCircle, Clock, XCircle, User } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const TextSundoPage = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [escorts, setEscorts] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        fullName: '',
        relationship: '',
        contactNumber: '',
        address: '',
        additionalNotes: ''
    });

    const relationships = [
        'Mother',
        'Father',
        'Guardian',
        'Grandmother',
        'Grandfather',
        'Aunt',
        'Uncle',
        'Sibling',
        'Other'
    ];

    useEffect(() => {
        fetchEscorts();
    }, []);

    const fetchEscorts = async () => {
        try {
            const response = await axios.get('/backend/api/textsundo/getEscorts.php', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (response.data.success) {
                setEscorts(response.data.escorts || []);
            }
        } catch (err) {
            console.error('Error fetching escorts:', err);
            // Sample data for demonstration
            setEscorts([
                { id: 1, fullName: 'Maria Santos', relationship: 'Mother', contactNumber: '09123456789', status: 'approved', dateAdded: '2024-01-15' },
                { id: 2, fullName: 'Juan dela Cruz', relationship: 'Father', contactNumber: '09987654321', status: 'pending', dateAdded: '2024-01-20' }
            ]);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!formData.fullName || !formData.relationship || !formData.contactNumber) {
            setError('Please fill in all required fields');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                '/backend/api/textsundo/addEscort.php',
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (response.data.success) {
                setSubmitSuccess(true);
                setFormData({
                    fullName: '',
                    relationship: '',
                    contactNumber: '',
                    address: '',
                    additionalNotes: ''
                });
                setShowAddForm(false);
                fetchEscorts();
                setTimeout(() => setSubmitSuccess(false), 5000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit escort request');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-500">
                        <CheckCircle size={14} />
                        Approved
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-500">
                        <Clock size={14} />
                        Pending Approval
                    </span>
                );
            case 'rejected':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-500">
                        <XCircle size={14} />
                        Rejected
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
            <div className="max-w mx-auto">

                {/* Back Button and Header */}
                <div className="mb-6">
                    <Link
                        to="/student-dashboard"
                        className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-[#F4D77D] dark:hover:text-[#F4D77D] transition-colors mb-4"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-medium">Back to Dashboard</span>
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Text Sundo - Verified Escorts</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage authorized persons who can pick up your child from school
                    </p>
                </div>

                {/* Info Banner */}
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500 rounded-lg">
                    <div className="flex items-start gap-3">
                        <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-lg">
                            <svg className="w-5 h-5 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-1">About Text Sundo System</h3>
                            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                                The Guardside Text Sundo system enhances student dismissal safety using QR code scanning.
                                Only approved escorts can pick up students, with real-time SMS notifications sent to parents for every entry and exit.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Success Message */}
                {submitSuccess && (
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-500 rounded-lg text-green-700 dark:text-green-200 text-sm">
                        Escort request submitted successfully! Awaiting admin approval.
                    </div>
                )}

                {/* Add New Escort Button */}
                {!showAddForm && (
                    <div className="mb-6">
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="inline-flex items-center gap-2 px-4 py-3 bg-[#F4D77D] hover:bg-[#f0cd5e] text-gray-800 font-semibold rounded-lg transition duration-300"
                        >
                            <UserPlus size={20} />
                            Add New Escort
                        </button>
                    </div>
                )}

                {/* Add Escort Form */}
                {showAddForm && (
                    <div className="mb-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                                <UserPlus className="text-[#F4D77D]" size={24} />
                                Add New Authorized Escort
                            </h2>
                            <button
                                onClick={() => setShowAddForm(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                                <XCircle size={24} />
                            </button>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500 rounded-lg text-red-700 dark:text-red-200 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Full Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        placeholder="Enter full name"
                                        className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-[#F4D77D] focus:border-[#F4D77D] transition"
                                        required
                                    />
                                </div>

                                {/* Relationship */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Relationship <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="relationship"
                                        value={formData.relationship}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-[#F4D77D] focus:border-[#F4D77D] transition"
                                        required
                                    >
                                        <option value="">Select relationship</option>
                                        {relationships.map(rel => (
                                            <option key={rel} value={rel}>{rel}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Contact Number */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Contact Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="contactNumber"
                                        value={formData.contactNumber}
                                        onChange={handleInputChange}
                                        placeholder="09XXXXXXXXX"
                                        pattern="[0-9]{11}"
                                        className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-[#F4D77D] focus:border-[#F4D77D] transition"
                                        required
                                    />
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="Enter address"
                                        className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-[#F4D77D] focus:border-[#F4D77D] transition"
                                    />
                                </div>
                            </div>

                            {/* Additional Notes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Additional Notes (Optional)
                                </label>
                                <textarea
                                    name="additionalNotes"
                                    value={formData.additionalNotes}
                                    onChange={handleInputChange}
                                    rows="3"
                                    placeholder="Any additional information..."
                                    className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-[#F4D77D] focus:border-[#F4D77D] transition resize-none"
                                />
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="px-6 py-3 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-3 bg-[#F4D77D] hover:bg-[#f0cd5e] text-gray-800 font-semibold rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Submitting...</span>
                                        </>
                                    ) : (
                                        'Submit for Approval'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Escorts List */}
                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                        <User className="text-[#F4D77D]" size={24} />
                        Authorized Escorts
                    </h2>

                    {escorts.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            <User size={48} className="mx-auto mb-4 opacity-50" />
                            <p>No authorized escorts yet. Add your first escort above.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {escorts.map((escort) => (
                                <div
                                    key={escort.id}
                                    className="p-4 border border-gray-200 dark:border-slate-700 rounded-lg hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-[#F4D77D] rounded-full flex items-center justify-center">
                                                <User size={24} className="text-gray-800" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800 dark:text-white">{escort.fullName}</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{escort.relationship}</p>
                                            </div>
                                        </div>
                                        {getStatusBadge(escort.status)}
                                    </div>

                                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                        <p>📱 {escort.contactNumber}</p>
                                        {escort.address && <p>📍 {escort.address}</p>}
                                        <p className="text-xs">Added: {escort.dateAdded}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TextSundoPage;