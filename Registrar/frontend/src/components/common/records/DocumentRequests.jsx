import React, { useState, useEffect } from "react";
import ProcessRequestModal from "./ProcessRequestModal";
import { useDarkMode } from "../../DarkModeProvider";
// Import icons for the new card style
import { Clock, FileText, CheckCircle, Package, Eye } from 'lucide-react'; // Added Eye icon

const API_BASE_URL = "http://localhost/SMS-GCA-3H/Registrar/backend/api/records";

const DocumentRequests = () => {
  // Removed selectedStudents state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Removed unused filters state to simplify the example
  // const [filters, setFilters] = useState({ ... }); 

  // State for slide-up animation (copied from InboxTable)
  const [animate, setAnimate] = useState(false);

  // const { isDarkMode } = useDarkMode(); // Dark mode is handled by the utility classes

  useEffect(() => {
    fetchRequests();
    // Start the slide-up animation
    setAnimate(true);
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/get_requests.php`);

      if (!response.ok) {
        throw new Error("Failed to fetch requests");
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Filter only pending requests
      const pendingRequests = data.filter(req => req.status === 'Pending');
      setStudents(pendingRequests);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  // Removed handleSelectAll
  // Removed handleSelectStudent

  // Removed handleFilterChange

  // Removed handleExportList
  // Removed handleProcessSelected

  const handleProcessRequest = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleRequestCompleted = () => {
    fetchRequests(); // Refresh the list
  };

  // Calculate statistics (UNCHANGED)
  const stats = {
    pending: students.length,
    form137: students.filter(s => s.documentType === 'Form 137').length,
    certificates: students.filter(s => s.documentType.includes('Certificate')).length,
    other: students.filter(s => !s.documentType.includes('Form 137') && !s.documentType.includes('Certificate')).length
  };

  const statCardsData = [
    { 
        title: "Pending Requests", 
        value: stats.pending, 
        icon: Clock, 
        textColor: 'text-yellow-600', 
        bgLight: 'bg-yellow-100',
        bgColor: 'bg-yellow-500',
    },
    { 
        title: "Form 137 Requests", 
        value: stats.form137, 
        icon: FileText, 
        textColor: 'text-blue-600', 
        bgLight: 'bg-blue-100',
        bgColor: 'bg-blue-500',
    },
    { 
        title: "Certificates", 
        value: stats.certificates, 
        icon: CheckCircle, 
        textColor: 'text-green-600', 
        bgLight: 'bg-green-100',
        bgColor: 'bg-green-500',
    },
    { 
        title: "Other Documents", 
        value: stats.other, 
        icon: Package, 
        textColor: 'text-purple-600', 
        bgLight: 'bg-purple-100',
        bgColor: 'bg-purple-500',
    },
  ];

  if (loading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">⏳</div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">Loading requests...</p>
          </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-0 flex items-center justify-center">
        <div className="text-center bg-red-50 dark:bg-red-900/20 p-6 rounded-xl border-2 border-red-200 dark:border-red-800">
          <div className="text-5xl mb-4">⚠️</div>
          <h3 className="text-lg font-bold text-red-900 dark:text-red-300 mb-2">Error Loading Requests</h3>
          <p className="text-red-700 dark:text-red-400">{error}</p>
          <button 
            onClick={fetchRequests}
            className="mt-4 px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const totalRequests = students.length;

  return (
    <div className="">
       {/* Custom style for slide-up animation (Copied from InboxTable) */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .slide-up { animation: slideUp 0.6s ease-out; }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn-no-y { animation: fadeIn 0.6s ease-out; }
      `}</style>

      <div className="max-w-full mx-auto px-0 py-0 animate-fadeIn-no-y">
        {/* Header Section */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Requested Documents
        </h1>

        {/* Statistics Cards (UNCHANGED) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-0">
            {statCardsData.map((card, index) => {
                const Icon = card.icon;
                return (
                    <div
                        key={index}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center space-x-4 hover:shadow-lg transition-shadow"
                    >
                        <div className={`${card.bgLight} dark:bg-opacity-20 p-4 rounded-lg`}>
                            <Icon className={`${card.textColor} dark:text-white`} size={32} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{card.title}</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-white">{card.value || 0}</p>
                        </div>
                    </div>
                );
            })}
        </div>

        {/* Action Bar - Removed "Process Selected" and "Export List" */}
        <div className="h-6 mb-0">
          {/* This space is intentionally left blank for alignment, or can be removed if not needed */}
        </div>

        {/* Main Table Container (Applying InboxTable Style) */}
        <div className={`mt-0 rounded-2xl shadow-md border border-gray-300 dark:border-slate-600 overflow-visible ${animate ? "slide-up" : ""}`}>
          
          {/* Display Counter (Header Bar) */}
          <div className="flex justify-between items-center px-4 py-3 bg-white dark:bg-slate-800 rounded-t-2xl border-b border-gray-300 dark:border-slate-600">
            {/* Left Side: Display Counter (Showing X Requests) */}
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {totalRequests > 0 ? (
                <>
                  Showing
                  <span className="font-bold text-gray-800 dark:text-white mx-1">
                    {totalRequests}
                  </span>
                  {` Request${totalRequests > 1 ? 's' : ''}`}
                </>
              ) : (
                'No Request Found'
              )}
            </span>

            {/* Right Side: Placeholder for Pagination (Empty) */}
            <div className="h-6"></div> 
          </div>

          <div className="overflow-x-auto">
            {/* Table structure with min-width and relative z-index (Copied from InboxTable) */}
            <table className="min-w-[900px] w-full border-collapse relative z-10">
              {/* Table Header (Applying InboxTable Style, removed checkbox column) */}
              <thead className="bg-gray-100 dark:bg-slate-700 text-left border-b border-gray-400 dark:border-slate-500">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white">Student Name</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white">Email</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white">Document Type</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white">Purpose</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white">Request Date</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white text-center">Status</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white text-center">Actions</th>
                </tr>
              </thead>

              {/* Table Body (Rows) */}
              <tbody>
                {students.length > 0 ? (
                  students.map((student, index) => (
                    <tr
                      key={student.id}
                      // Applying InboxTable Row Styling
                      className={`transition-all duration-300
                        ${index !== totalRequests - 1 ? "border-b border-gray-400 dark:border-slate-600" : ""}
                        hover:bg-gray-50 dark:hover:bg-slate-700
                      `}
                    >
                      {/* Name (Font-weight copied) */}
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-white font-medium">
                        {student.studentName}
                      </td>
                      {/* Email (Font-color/weight copied) */}
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{student.email}</td>
                      {/* Document Type */}
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{student.documentType}</td>
                      {/* Purpose */}
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{student.purpose}</td>
                      {/* Request Date */}
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{student.date}</td>
                      {/* Status (Center alignment and InboxTable badge style) */}
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-yellow-300 text-black">
                          {student.status}
                        </span>
                      </td>
                      {/* Actions (Center alignment and InboxTable button style) */}
                      <td className="px-4 py-3 text-center relative">
                        <div className="relative flex flex-col items-center gap-2 group">
                          <button
                            className="inline-flex items-center gap-2 border border-gray-400 text-black dark:text-white px-3 py-1.5 rounded-md text-sm font-semibold bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 transition cursor-pointer"
                            onClick={() => handleProcessRequest(student)}
                          >
                            <Eye className="w-4 h-4" /> View
                          </button>
                          <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-medium rounded-md px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-[9999]">
                            Process/View Request
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      No pending document requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ProcessRequestModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
        onRequestCompleted={handleRequestCompleted}
      />
    </div>
  );
};

export default DocumentRequests;