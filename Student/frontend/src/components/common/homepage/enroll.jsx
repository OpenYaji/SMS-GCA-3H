import React, { useState } from 'react';
import Bg from '../../../assets/img/bg.png';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost/SMS-GCA-3H/Student/backend/api/admission.php';

const PrivacyModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-stone-800/95 dark:bg-gray-900/95 text-white p-6 sm:p-8 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl backdrop-blur-sm border border-stone-700 dark:border-gray-600 transition-colors duration-300">
                <h2 className="text-xl sm:text-2xl font-bold text-[#F4D77D] dark:text-amber-400 border-b border-white/50 dark:border-gray-600 pb-2 mb-4 transition-colors duration-300">
                    Privacy Policy & Data Sharing Agreement
                </h2>

                <div className="text-sm space-y-3 max-h-64 overflow-y-auto pr-2">
                    <p>
                        **1. Data Collection:** By submitting this form, you consent to the Gymnazo Christian Academy (GCA) collecting and processing the personal and sensitive information provided herein (including student name, birthdate, contact details, academic history, and parent/guardian information).
                    </p>
                    <p>
                        **2. Purpose of Processing:** The data collected will be used solely for the purpose of student admission, enrollment, record-keeping, and communication necessary for the educational services provided by GCA, in compliance with the Data Privacy Act of 2012 (RA 10173).
                    </p>
                    <p>
                        **3. Data Sharing:** We may share necessary student data with government agencies such as the Department of Education (DepEd) and the Private Education Assistance Committee (PEAC) for mandatory reporting and program administration (e.g., ESC/voucher programs). Data will not be shared with unauthorized third parties.
                    </p>
                    <p>
                        **4. Security:** GCA implements reasonable security measures to protect your personal data against unauthorized access, disclosure, alteration, and destruction.
                    </p>
                    <p>
                        **5. Consent:** Your signature/confirmation acknowledges that you have read, understood, and agreed to the terms of this Privacy Policy and Consent Form.
                    </p>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-[#F4D77D] dark:bg-amber-500 hover:bg-amber-300 dark:hover:bg-amber-400 text-black font-bold py-2 px-6 rounded-lg shadow-md transition duration-200"
                    >
                        Close & Confirm Reading
                    </button>
                </div>
            </div>
        </div>
    );
};

const SuccessModal = ({ isOpen, trackingNumber, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-stone-800/95 dark:bg-gray-900/95 text-white p-6 sm:p-8 rounded-lg w-full max-w-md shadow-2xl backdrop-blur-sm border border-stone-700 dark:border-gray-600">
                <div className="text-center">
                    <div className="mb-4">
                        <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-[#F4D77D] mb-4">
                        Application Submitted Successfully!
                    </h2>
                    <p className="text-sm mb-4">
                        Your admission application has been received. Please save your tracking number for future reference.
                    </p>
                    <div className="bg-stone-900/50 p-4 rounded-lg mb-6">
                        <p className="text-xs text-gray-400 mb-1">Tracking Number</p>
                        <p className="text-2xl font-bold text-amber-400">{trackingNumber}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="bg-[#F4D77D] hover:bg-amber-300 text-black font-bold py-2 px-8 rounded-lg transition duration-200"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

const ConfirmBackModal = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-stone-800/95 dark:bg-gray-900/95 text-white p-6 sm:p-8 rounded-lg w-full max-w-md shadow-2xl backdrop-blur-sm border border-stone-700 dark:border-gray-600">
                <div className="text-center">
                    <div className="mb-4">
                        <svg className="w-16 h-16 text-yellow-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-[#F4D77D] mb-4">
                        Unsaved Changes
                    </h2>
                    <p className="text-sm mb-6">
                        You have filled in some information. Are you sure you want to go back? All unsaved data will be lost.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={onCancel}
                            className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
                        >
                            Go Back to Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TrackingModal = ({ isOpen, onClose }) => {
    const [trackingNumber, setTrackingNumber] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [applicationData, setApplicationData] = useState(null);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!trackingNumber.trim()) {
            setError('Please enter a tracking number');
            return;
        }

        setIsSearching(true);
        setError('');
        setApplicationData(null);

        try {
            const response = await fetch(`${API_URL}?action=check_status&tracking_number=${encodeURIComponent(trackingNumber.trim())}`);
            const result = await response.json();

            if (result.success) {
                setApplicationData(result.data);
            } else {
                setError(result.message || 'Application not found');
            }
        } catch (err) {
            setError('Failed to connect to the server. Please try again.');
            console.error('Tracking error:', err);
        } finally {
            setIsSearching(false);
        }
    };

    const handleClose = () => {
        setTrackingNumber('');
        setApplicationData(null);
        setError('');
        onClose();
    };

    const getStatusColor = (status) => {
        const colors = {
            'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
            'For Review': 'bg-blue-100 text-blue-800 border-blue-300',
            'Approved': 'bg-green-100 text-green-800 border-green-300',
            'Rejected': 'bg-red-100 text-red-800 border-red-300',
            'Waitlisted': 'bg-orange-100 text-orange-800 border-orange-300'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending':
                return '⏳';
            case 'For Review':
                return '📋';
            case 'Approved':
                return '✅';
            case 'Rejected':
                return '❌';
            case 'Waitlisted':
                return '⏸️';
            default:
                return '📄';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-stone-800/95 dark:bg-gray-900/95 text-white p-6 sm:p-8 rounded-lg w-full max-w-md shadow-2xl backdrop-blur-sm border border-stone-700 dark:border-gray-600 transition-colors duration-300">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#F4D77D] dark:text-amber-400">
                        Track Application Status
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSearch} className="space-y-4">
                    <div>
                        <label htmlFor="trackingNumber" className="block text-sm font-medium mb-2">
                            Enter Tracking Number
                        </label>
                        <input
                            type="text"
                            id="trackingNumber"
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                            placeholder="e.g., GCA-2025-12345"
                            className="w-full px-4 py-2 bg-white/90 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                            disabled={isSearching}
                        />
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    {applicationData && (
                        <div className="bg-white/10 border border-white/20 rounded-lg p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-300">Status:</span>
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(applicationData.application_status)}`}>
                                    {getStatusIcon(applicationData.application_status)} {applicationData.application_status}
                                </span>
                            </div>
                            <div className="border-t border-white/10 pt-3 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-300">Student Name:</span>
                                    <span className="text-sm font-semibold">{applicationData.student_name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-300">Grade Level:</span>
                                    <span className="text-sm font-semibold">{applicationData.grade_level}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-300">Submitted:</span>
                                    <span className="text-sm font-semibold">
                                        {new Date(applicationData.submitted_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                                {applicationData.updated_at && (
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-300">Last Updated:</span>
                                        <span className="text-sm font-semibold">
                                            {new Date(applicationData.updated_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                        >
                            Close
                        </button>
                        <button
                            type="submit"
                            disabled={isSearching}
                            className={`flex-1 bg-[#F4D77D] dark:bg-amber-500 hover:bg-amber-300 dark:hover:bg-amber-400 text-black font-bold py-2 px-4 rounded-lg transition duration-200 ${isSearching ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isSearching ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Enroll = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [trackingModalOpen, setTrackingModalOpen] = useState(false);
    const [hasAgreed, setHasAgreed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [confirmBackModalOpen, setConfirmBackModalOpen] = useState(false);
    const [trackingNumber, setTrackingNumber] = useState('');
    const [formData, setFormData] = useState({
        enrolleeType: '',
        studentFirstName: '',
        studentLastName: '',
        studentMiddleName: '',
        birthdate: '',
        gender: '',
        address: '',
        contactNumber: '',
        emailAddress: '',
        guardianFirstName: '',
        guardianLastName: '',
        relationship: '',
        guardianContact: '',
        guardianEmail: '',
        gradeLevel: '',
        previousSchool: ''
    });

    const gradeLevels = [
        "Nursery", "Kinder 1","Kinder 2","Grade 1", "Grade 2", "Grade 3",
        "Grade 4", "Grade 5", "Grade 6"
    ];

    const hasFormData = () => {
        return Object.values(formData).some(value => value !== '');
    };

    const handleBackClick = (e) => {
        e.preventDefault();
        if (hasFormData()) {
            setConfirmBackModalOpen(true);
        } else {
            navigate('/');
        }
    };

    const handleConfirmBack = () => {
        setConfirmBackModalOpen(false);
        navigate('/');
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

        if (!hasAgreed) {
            alert("Please read and agree to the Privacy Policy to submit the form.");
            return;
        }

        setIsSubmitting(true);

        try {
            const submitData = new FormData();

            Object.keys(formData).forEach(key => {
                submitData.append(key, formData[key]);
            });

            submitData.append('privacyAgreement', 'agreed');

            const response = await fetch(`${API_URL}?action=submit`, {
                method: 'POST',
                body: submitData,
            });

            const result = await response.json();

            if (!response.ok) {
                // Show the actual error message from the backend
                throw new Error(result.message || `HTTP error! status: ${response.status}`);
            }

            if (result.success) {
                setTrackingNumber(result.tracking_number);
                setSuccessModalOpen(true);

                // Reset form
                setFormData({
                    enrolleeType: '',
                    studentFirstName: '',
                    studentLastName: '',
                    studentMiddleName: '',
                    birthdate: '',
                    gender: '',
                    address: '',
                    contactNumber: '',
                    emailAddress: '',
                    guardianFirstName: '',
                    guardianLastName: '',
                    relationship: '',
                    guardianContact: '',
                    guardianEmail: '',
                    gradeLevel: '',
                    previousSchool: ''
                });
                setHasAgreed(false);
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert(`An error occurred while submitting the form: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative w-full min-h-screen flex flex-col items-center justify-center py-2 px-4 sm:px-6">
            <PrivacyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <SuccessModal
                isOpen={successModalOpen}
                trackingNumber={trackingNumber}
                onClose={() => setSuccessModalOpen(false)}
            />
            <ConfirmBackModal
                isOpen={confirmBackModalOpen}
                onConfirm={handleConfirmBack}
                onCancel={() => setConfirmBackModalOpen(false)}
            />
            <TrackingModal
                isOpen={trackingModalOpen}
                onClose={() => setTrackingModalOpen(false)}
            />

            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${Bg})` }}
            ></div>
            <div className="absolute inset-0 bg-stone-900/60 dark:bg-black/70 transition-colors duration-300"></div>

            <div className="relative z-10 w-full max-w-7xl">
                <div className='relative top-0 left-0 w-full mb-2 z-10 transition-all duration-300'>
                    <div className='w-full flex justify-between items-center'>
                        <button
                            onClick={handleBackClick}
                            className='flex items-center gap-2 text-white dark:text-amber-400 font-bold hover:text-white dark:hover:text-amber-300 transition duration-150 text-sm px-4 group'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span className='inline'>Back to Home</span>
                        </button>

                        <button
                            onClick={() => setTrackingModalOpen(true)}
                            className='flex items-center gap-2 text-white dark:text-amber-400 font-bold hover:text-white dark:hover:text-amber-300 transition duration-150 text-sm px-4 group'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <span className='inline'>Track Application</span>
                        </button>
                    </div>
                </div>

                <form className="relative" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-5 gap-4 auto-rows-fr">
                        <div className="col-span-5 lg:col-span-2 space-y-4 p-6 rounded-lg backdrop-blur-sm bg-stone-800/60 dark:bg-gray-900/70 shadow-xl border border-stone-700 dark:border-gray-600 transition-colors duration-300">
                            <h2 className="text-xl font-bold text-white border-b border-white/40 dark:border-gray-600 pb-2 mb-3 transition-colors duration-300">
                                Student Information
                            </h2>

                            <div className="space-y-1 relative">
                                <select
                                    id="enrolleeType"
                                    name="enrolleeType"
                                    value={formData.enrolleeType}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full h-12 pt-4 pb-1 px-3 bg-white/90 dark:bg-gray-700 dark:text-gray-100 text-gray-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-base transition-colors duration-300 peer"
                                >
                                    <option value=""></option>
                                    <option value="returnee">Returnee</option>
                                    <option value="new">New Enrollee</option>
                                    <option value="transferee">Transferee</option>
                                </select>
                                <label
                                    htmlFor="enrolleeType"
                                    className={`absolute left-3 transition-all duration-200 pointer-events-none ${formData.enrolleeType
                                        ? 'top-1 text-xs text-amber-400 dark:text-amber-400'
                                        : 'top-3 text-base text-gray-500 dark:text-gray-400'
                                        }`}
                                >
                                    Enrollee Type
                                </label>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <Input
                                    label="First Name"
                                    name="studentFirstName"
                                    type="text"
                                    value={formData.studentFirstName}
                                    onChange={handleInputChange}
                                    required
                                    className="col-span-1"
                                />
                                <Input
                                    label="Middle Name"
                                    name="studentMiddleName"
                                    type="text"
                                    value={formData.studentMiddleName}
                                    onChange={handleInputChange}
                                    className="col-span-1"
                                />
                                <Input
                                    label="Last Name"
                                    name="studentLastName"
                                    type="text"
                                    value={formData.studentLastName}
                                    onChange={handleInputChange}
                                    required
                                    className="col-span-1"
                                />
                            </div>

                            <div className="flex space-x-2">
                                <Input
                                    label="Birthdate"
                                    name="birthdate"
                                    type="date"
                                    value={formData.birthdate}
                                    onChange={handleInputChange}
                                    required
                                    className="flex-1"
                                />
                                <div className="flex-1 min-w-[120px]">
                                    <label className="block text-sm font-medium text-white mb-2">Gender</label>
                                    <div className="flex items-center space-x-3 h-10 text-base">
                                        <label className="flex items-center space-x-1.5 text-white">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="male"
                                                checked={formData.gender === 'male'}
                                                onChange={handleInputChange}
                                                required
                                                className="h-4 w-4 text-amber-400"
                                            />
                                            <span>Male</span>
                                        </label>
                                        <label className="flex items-center space-x-1.5 text-white">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="female"
                                                checked={formData.gender === 'female'}
                                                onChange={handleInputChange}
                                                required
                                                className="h-4 w-4 text-amber-400"
                                            />
                                            <span>Female</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <Input
                                label="Address"
                                name="address"
                                type="text"
                                value={formData.address}
                                onChange={handleInputChange}
                                required
                            />

                            <div className="flex space-x-2">
                                <Input
                                    label="Contact Number"
                                    name="contactNumber"
                                    type="tel"
                                    value={formData.contactNumber}
                                    onChange={handleInputChange}
                                    required
                                    className="flex-1"
                                />
                                <Input
                                    label="Email Address"
                                    name="emailAddress"
                                    type="email"
                                    value={formData.emailAddress}
                                    onChange={handleInputChange}
                                    className="flex-1"
                                />
                            </div>

                            <div className="pt-3 text-xs font-medium text-white leading-tight">
                                <p className="mb-1">
                                    <span className='font-bold text-amber-400'>For Old Students:</span> Report Card (No failing grades)
                                </p>
                                <p className="mb-1">
                                    <span className='font-bold text-amber-400'>For Transferees:</span>
                                </p>
                                <ul className="list-disc list-inside ml-2 space-y-0.5 text-[10px]">
                                    <li>Good Moral Certificate</li>
                                    <li>Birth Certificate (PSA)</li>
                                    <li>Certificate of Completion</li>
                                    <li>SF10 Form 137</li>
                                </ul>
                            </div>
                        </div>

                        <div className="col-span-5 lg:col-span-3 lg:col-start-3 space-y-4">
                            <div className="space-y-4 p-6 rounded-lg backdrop-blur-sm bg-stone-800/60 dark:bg-gray-900/70 shadow-xl border border-stone-700 dark:border-gray-600 transition-colors duration-300">
                                <h2 className="text-xl font-bold text-white border-b border-white/40 dark:border-gray-600 pb-2 mb-3 transition-colors duration-300">
                                    Parent/Guardian Information
                                </h2>

                                <div className="flex space-x-2">
                                    <Input
                                        label="Guardian First Name"
                                        name="guardianFirstName"
                                        type="text"
                                        value={formData.guardianFirstName}
                                        onChange={handleInputChange}
                                        required
                                        className="flex-1"
                                    />
                                    <Input
                                        label="Guardian Last Name"
                                        name="guardianLastName"
                                        type="text"
                                        value={formData.guardianLastName}
                                        onChange={handleInputChange}
                                        required
                                        className="flex-1"
                                    />
                                </div>

                                <div className="flex space-x-2">
                                    <Input
                                        label="Relationship"
                                        name="relationship"
                                        type="text"
                                        value={formData.relationship}
                                        onChange={handleInputChange}
                                        required
                                        className="flex-1"
                                    />
                                    <Input
                                        label="Contact Number"
                                        name="guardianContact"
                                        type="tel"
                                        value={formData.guardianContact}
                                        onChange={handleInputChange}
                                        required
                                        className="flex-1"
                                    />
                                </div>
                                <Input
                                    label="Email Address"
                                    name="guardianEmail"
                                    type="email"
                                    value={formData.guardianEmail}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="space-y-4 p-6 rounded-lg backdrop-blur-sm bg-stone-800/60 dark:bg-gray-900/70 shadow-xl border border-stone-700 dark:border-gray-600 transition-colors duration-300">
                                <h2 className="text-xl font-bold text-white border-b border-white/40 dark:border-gray-600 pb-2 mb-3 transition-colors duration-300">
                                    Academic Information
                                </h2>
                                <div className="flex space-x-2">
                                    <div className="flex-1 relative">
                                        <select
                                            id="gradeLevel"
                                            name="gradeLevel"
                                            value={formData.gradeLevel}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full h-12 pt-4 pb-1 px-3 bg-white/90 dark:bg-gray-700 dark:text-gray-100 text-gray-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-base transition-colors duration-300"
                                        >
                                            <option value=""></option>
                                            {gradeLevels.map(level => (
                                                <option key={level} value={level.toLowerCase().replace(' ', '')}>{level}</option>
                                            ))}
                                        </select>
                                        <label
                                            htmlFor="gradeLevel"
                                            className={`absolute left-3 transition-all duration-200 pointer-events-none ${formData.gradeLevel
                                                ? 'top-1 text-xs text-amber-400 dark:text-amber-400'
                                                : 'top-3 text-base text-gray-500 dark:text-gray-400'
                                                }`}
                                        >
                                            Grade Level Applying for
                                        </label>
                                    </div>
                                    <Input
                                        label="Previous School (if applicable)"
                                        name="previousSchool"
                                        type="text"
                                        value={formData.previousSchool}
                                        onChange={handleInputChange}
                                        className="flex-1"
                                    />
                                </div>
                            </div>

                            <div className="p-6 rounded-lg backdrop-blur-sm bg-stone-800/60 dark:bg-gray-900/70 shadow-xl border border-stone-700 dark:border-gray-600 text-sm text-white space-y-3 transition-colors duration-300">
                                <div className="flex items-start space-x-2">
                                    <input
                                        id="privacyAgreement"
                                        name="privacyAgreement"
                                        type="checkbox"
                                        checked={hasAgreed}
                                        onChange={(e) => setHasAgreed(e.target.checked)}
                                        required
                                        className="mt-1 h-4 w-4 text-amber-400 border-gray-300 rounded focus:ring-amber-400 bg-white"
                                    />
                                    <label htmlFor="privacyAgreement" className="text-base font-medium">
                                        I have read and agree to the
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(true)}
                                            className="text-[#F4D77D] dark:text-amber-400 hover:text-amber-300 dark:hover:text-amber-300 font-bold underline ml-1 transition-colors duration-300"
                                        >
                                            Privacy Policy & Data Sharing Agreement.
                                        </button>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center pt-1">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`bg-[#F4D77D] dark:bg-amber-500 hover:bg-amber-300 dark:hover:bg-amber-400 text-black font-extrabold py-2 px-8 border-1 border-[#5B3E31] dark:border-amber-600 rounded-lg shadow-3xl text-base transition duration-200 uppercase ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="absolute bottom-2 right-4 flex items-center space-x-2 z-10">
                <div className="h-6 w-6 bg-blue-700 dark:bg-blue-600 rounded-sm transition-colors duration-300"></div>
                <div className="h-6 w-6 bg-green-600 dark:bg-green-500 rounded-sm transition-colors duration-300"></div>
            </div>
        </div>
    );
};

const Input = ({ label, name, type, value, onChange, required = false, className = '' }) => {
    const isDate = type === 'date';
    const hasValue = value || isDate;

    return (
        <div className={`relative ${className}`}>
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                placeholder=" "
                className="w-full h-12 pt-4 pb-1 px-3 bg-white/90 dark:bg-gray-700 dark:text-gray-100 text-gray-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-base transition-colors duration-300 peer"
            />
            <label
                htmlFor={name}
                className={`absolute left-3 transition-all duration-200 pointer-events-none ${hasValue
                    ? 'top-1 text-xs text-amber-400 dark:text-amber-400'
                    : 'top-3 text-base text-gray-500 dark:text-gray-400 peer-focus:top-1 peer-focus:text-xs peer-focus:text-amber-400'
                    }`}
            >
                {label}
            </label>
        </div>
    );
};

export default Enroll;
