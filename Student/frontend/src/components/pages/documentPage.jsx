import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const DocumentPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');
  const [requestHistory, setRequestHistory] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loadingModal, setLoadingModal] = useState(false);

  const [formData, setFormData] = useState({
    documentType: '',
    purpose: '',
    customPurpose: '',
    quantity: 1,
    deliveryMethod: 'pickup',
    additionalNotes: ''
  });

  const allDocumentTypes = [
    { value: 'form137', label: 'Form 137 (Permanent Record)', singleCopy: true },
    { value: 'grades', label: 'Certificate of Grades', singleCopy: false },
    { value: 'goodMoral', label: 'Certificate of Good Moral', singleCopy: true },
    { value: 'enrollment', label: 'Certificate of Enrollment', singleCopy: false },
    { value: 'completion', label: 'Certificate of Completion', singleCopy: false },
    { value: 'honorable', label: 'Honorable Dismissal', singleCopy: true }
  ];

  const purposes = [
    'Transfer to another school',
    'Scholarship application',
    'Other'
  ];

  // Document availability rules based on grade level/status
  const getAvailableDocuments = () => {
    if (!studentInfo) return [];

    const gradeLevel = studentInfo.gradeLevel?.toLowerCase();
    const status = studentInfo.status?.toLowerCase();

    const documentsByLevel = {
      'nursery': ['enrollment', 'grades'],
      'k1': ['enrollment', 'grades'],
      'k2': ['enrollment', 'grades'],
      'grade 1': ['enrollment', 'grades'],
      'grade 2': ['enrollment', 'grades'],
      'grade 3': ['enrollment', 'grades'],
      'grade 4': ['enrollment', 'grades'],
      'grade 5': ['enrollment', 'grades'],
      'grade 6': ['enrollment', 'grades', 'form137', 'goodMoral', 'completion'],
      'graduated': ['form137', 'grades', 'goodMoral', 'completion', 'honorable'],
      'withdrawn': ['form137', 'grades', 'goodMoral', 'honorable']
    };

    // Check status first
    if (status === 'graduated') {
      return documentsByLevel['graduated'];
    } else if (status === 'withdrawn') {
      return documentsByLevel['withdrawn'];
    } else if (documentsByLevel[gradeLevel]) {
      return documentsByLevel[gradeLevel];
    }

    return [];
  };

  // Filter document types based on available documents
  const availableDocuments = getAvailableDocuments();
  const documentTypes = allDocumentTypes.filter(doc =>
    availableDocuments.includes(doc.value)
  );

  // Check if selected document type is single copy only
  const isSingleCopyDocument = () => {
    const selectedDoc = documentTypes.find(doc => doc.value === formData.documentType);
    return selectedDoc?.singleCopy || false;
  };

  useEffect(() => {
    fetchRequestHistory();
  }, []);

  // Reset quantity to 1 when switching to single-copy document
  useEffect(() => {
    if (isSingleCopyDocument() && formData.quantity !== 1) {
      setFormData(prev => ({ ...prev, quantity: 1 }));
    }
  }, [formData.documentType]);

  const fetchRequestHistory = async () => {
    try {
      const response = await axios.get('http://localhost/SMS-GCA-3H/Student/backend/api/documents/getDocumentRequest.php', {
        withCredentials: true
      });
      if (response.data.success) {
        setRequestHistory(response.data.requests || []);
        if (response.data.studentInfo) {
          setStudentInfo(response.data.studentInfo);
        }
      }
    } catch (err) {
      console.error('Error fetching request history:', err);
    }
  };

  const fetchRequestDetails = async (requestID) => {
    setLoadingModal(true);
    try {
      const response = await axios.get(
        `http://localhost/SMS-GCA-3H/Student/backend/api/documents/getRequestDetails.php?requestID=${requestID}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        setSelectedRequest(response.data.request);
        setShowModal(true);
      } else {
        setError(response.data.message || 'Failed to load request details');
      }
    } catch (err) {
      console.error('Error fetching request details:', err);
      setError('Failed to load request details');
    } finally {
      setLoadingModal(false);
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

    if (!formData.documentType || !formData.purpose) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    // Validate custom purpose if "Other" is selected
    if (formData.purpose === 'Other' && !formData.customPurpose.trim()) {
      setError('Please specify the purpose for your request');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost/SMS-GCA-3H/Student/backend/api/documents/postDocumentRequest.php',
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      if (response.data.success) {
        setSubmitSuccess(true);
        setFormData({
          documentType: '',
          purpose: '',
          customPurpose: '',
          quantity: 1,
          deliveryMethod: 'pickup',
          additionalNotes: ''
        });
        fetchRequestHistory();
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        setError(response.data.message || 'Failed to submit request');
      }
    } catch (err) {
      console.error('Error submitting request:', err);
      setError(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500';
      case 'processing': return 'bg-blue-500/20 text-blue-300 border-blue-500';
      case 'ready': return 'bg-green-500/20 text-green-300 border-green-500';
      case 'completed': return 'bg-gray-500/20 text-gray-300 border-gray-500';
      case 'rejected': return 'bg-red-500/20 text-red-300 border-red-500';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500';
    }
  };

  const getDocumentLabel = (value) => {
    const doc = allDocumentTypes.find(d => d.value === value);
    return doc?.label || value;
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
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
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Document Request</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Request official school documents for elementary students
            {studentInfo && (
              <span className="ml-2 text-sm">
                (Grade Level: {studentInfo.gradeLevel} - Status: {studentInfo.status})
              </span>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Request Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-[#F4D77D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                New Request
              </h2>

              {submitSuccess && (
                <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-500 rounded-lg text-green-700 dark:text-green-200 text-sm">
                  Request submitted successfully! We'll process it within 1-3 business days.
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500 rounded-lg text-red-700 dark:text-red-200 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Document Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Document Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="documentType"
                    value={formData.documentType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-[#F4D77D] focus:border-[#F4D77D] transition"
                    required
                  >
                    <option value="">Select document type</option>
                    {documentTypes.map(doc => (
                      <option key={doc.value} value={doc.value}>
                        {doc.label}
                        {doc.singleCopy && ' (Original only)'}
                      </option>
                    ))}
                  </select>
                  {documentTypes.length === 0 && (
                    <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                      ⚠️ No documents available for your current grade level or status
                    </p>
                  )}
                  {isSingleCopyDocument() && (
                    <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                      ⚠️ This document type only allows 1 original copy
                    </p>
                  )}
                </div>

                {/* Purpose */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Purpose <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-[#F4D77D] focus:border-[#F4D77D] transition"
                    required
                  >
                    <option value="">Select purpose</option>
                    {purposes.map(purpose => (
                      <option key={purpose} value={purpose}>{purpose}</option>
                    ))}
                  </select>
                </div>

                {/* Custom Purpose (shown when "Other" is selected) */}
                {formData.purpose === 'Other' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Please specify purpose <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="customPurpose"
                      value={formData.customPurpose}
                      onChange={handleInputChange}
                      placeholder="Enter the purpose for your request"
                      className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-[#F4D77D] focus:border-[#F4D77D] transition"
                      required
                    />
                  </div>
                )}

                {/* Quantity and Delivery Method */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Quantity {!isSingleCopyDocument() && <span className="text-xs text-gray-500">(Max: 3)</span>}
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      min="1"
                      max={isSingleCopyDocument() ? "1" : "3"}
                      value={formData.quantity}
                      onChange={handleInputChange}
                      disabled={isSingleCopyDocument()}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-[#F4D77D] focus:border-[#F4D77D] transition disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Delivery Method
                    </label>
                    <select
                      name="deliveryMethod"
                      value={formData.deliveryMethod}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-[#F4D77D] focus:border-[#F4D77D] transition"
                    >
                      <option value="pickup">Pickup at School</option>
                      <option value="mail" disabled className="text-gray-400">
                        Mail Delivery (Not Available)
                      </option>
                    </select>
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
                    className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-[#F4D77D] focus:border-[#F4D77D] transition resize-none"
                    placeholder="Any special instructions or requirements..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || documentTypes.length === 0}
                  className="w-full py-3 px-6 bg-[#F4D77D] hover:bg-[#f0cd5e] text-gray-800 dark:text-gray-900 font-semibold rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Submit Request
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">

            {/* Important Notes */}
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#F4D77D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Important Notes
              </h3>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex gap-2">
                  <span className="text-amber-400 mt-0.5">•</span>
                  <span>Processing time: 1-3 business days</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-400 mt-0.5">•</span>
                  <span>Payment required upon claiming</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-400 mt-0.5">•</span>
                  <span>Bring valid ID when claiming</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-400 mt-0.5">•</span>
                  <span>Office hours: Mon-Fri, 8AM-5PM</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-400 mt-0.5">•</span>
                  <span>Mail delivery currently unavailable</span>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Need Help?</h3>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#F4D77D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>(123) 456-7890</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#F4D77D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>registrar@school.edu</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Request History */}
        <div className="mt-8 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-[#F4D77D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Request History
          </h2>

          {requestHistory.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p>No requests yet. Submit your first document request above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Request ID</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Document</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Purpose</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Qty</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {requestHistory.map((request) => (
                    <tr key={request.RequestID} className="border-b border-gray-100 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition">
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">#{request.RequestID}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{getDocumentLabel(request.DocumentType)}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{request.Purpose}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{request.Quantity}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{request.dateRequested}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => fetchRequestDetails(request.RequestID)}
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)} cursor-pointer hover:opacity-80 transition`}
                        >
                          {request.status}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Request Details Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                Request Details - #{selectedRequest.RequestID}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Status */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-slate-700">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</span>
                <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(selectedRequest.RequestStatus)}`}>
                  {selectedRequest.RequestStatus}
                </span>
              </div>

              {/* Document Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Document Type</p>
                  <p className="text-base font-medium text-gray-800 dark:text-white">
                    {getDocumentLabel(selectedRequest.DocumentType)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Quantity</p>
                  <p className="text-base font-medium text-gray-800 dark:text-white">
                    {selectedRequest.Quantity}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Purpose</p>
                <p className="text-base font-medium text-gray-800 dark:text-white">
                  {selectedRequest.Purpose}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Delivery Method</p>
                <p className="text-base font-medium text-gray-800 dark:text-white capitalize">
                  {selectedRequest.DeliveryMethod}
                </p>
              </div>

              {selectedRequest.AdditionalNotes && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Additional Notes</p>
                  <p className="text-base text-gray-800 dark:text-white">
                    {selectedRequest.AdditionalNotes}
                  </p>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Date Requested</p>
                  <p className="text-base font-medium text-gray-800 dark:text-white">
                    {selectedRequest.formattedDateRequested}
                  </p>
                </div>
                {selectedRequest.formattedDateCompleted && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date Completed</p>
                    <p className="text-base font-medium text-gray-800 dark:text-white">
                      {selectedRequest.formattedDateCompleted}
                    </p>
                  </div>
                )}
              </div>

              {/* Scheduled Pickup */}
              {selectedRequest.scheduledPickupDate && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Scheduled Pickup
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-blue-600 dark:text-blue-400">Date</p>
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        {selectedRequest.scheduledPickupDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-600 dark:text-blue-400">Time</p>
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        {selectedRequest.ScheduledPickupTime || 'Not specified'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Rejection Reason */}
              {selectedRequest.RejectionReason && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-2">Rejection Reason</h4>
                  <p className="text-sm text-red-700 dark:text-red-200">
                    {selectedRequest.RejectionReason}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-slate-700 flex justify-end">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentPage;