// C:\xampp\htdocs\SMS-GCA-3H\Registrar\frontend\src\components\common\records\DocumentRequests.jsx

import React, { useState, useEffect } from "react";
import ProcessRequestModal from "./ProcessRequestModal";
import { useDarkMode } from "../../DarkModeProvider";

const API_BASE_URL = "http://localhost/SMS-GCA-3H/Registrar/backend/api/records";

const DocumentRequests = () => {
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    documentType: "all",
    gradeLevel: "all",
    status: "all",
  });

  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    fetchRequests();
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

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStudents(students.map((s) => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (studentId) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters({
      ...filters,
      [filterName]: value,
    });
  };

  const handleExportList = () => {
    console.log("Exporting list...");
    alert("Export feature: Generate CSV/Excel report");
  };

  const handleProcessSelected = () => {
    if (selectedStudents.length === 0) {
      alert("Please select at least one request");
      return;
    }
    console.log(`Processing ${selectedStudents.length} request(s)`);
    alert(`Processing ${selectedStudents.length} document request(s)`);
  };

  const handleProcessRequest = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleRequestCompleted = () => {
    fetchRequests(); // Refresh the list
  };

  // Calculate statistics
  const stats = {
    pending: students.length,
    form137: students.filter(s => s.documentType === 'Form 137').length,
    certificates: students.filter(s => s.documentType.includes('Certificate')).length,
    other: students.filter(s => !s.documentType.includes('Form 137') && !s.documentType.includes('Certificate')).length
  };

  if (loading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 sm:p-8 font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">⏳</div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">Loading requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 sm:p-8 font-sans flex items-center justify-center">
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

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto animate-fadeIn">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-6 mb-6 transition-all duration-300">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
            📋 Document Requests
          </h2>

          
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          {[stats.pending, stats.form137, stats.certificates, stats.other].map((stat, index) => {
            const titles = ["Pending Requests", "Form 137 Requests", "Certificates", "Other Documents"];
            return (
              <div 
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 group cursor-pointer"
              >
                <h3 className="text-gray-600 dark:text-gray-300 text-sm font-bold mb-2 tracking-wide uppercase">
                  {titles[index]}
                </h3>
                <p className="text-5xl font-bold text-gray-900 dark:text-white mb-3 group-hover:scale-110 transition-transform">
                  {stat}
                </p>
              </div>
            );
          })}
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-gray-200 dark:border-gray-700 overflow-x-auto hover:shadow-2xl transition-all duration-300">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left w-12">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700"
                    checked={
                      students.length > 0 &&
                      selectedStudents.length === students.length
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-900 dark:text-white tracking-wide">
                  Student Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-900 dark:text-white tracking-wide">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-900 dark:text-white tracking-wide">
                  Document Type
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-900 dark:text-white tracking-wide">
                  Purpose
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-900 dark:text-white tracking-wide">
                  Request Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-900 dark:text-white tracking-wide">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-900 dark:text-white tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {students.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-[1.01]"
                >
                  <td className="px-6 py-4 w-12">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleSelectStudent(student.id)}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
                    {student.studentName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 font-medium">
                    {student.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 font-medium">
                    {student.documentType}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 font-medium">
                    {student.purpose}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 font-medium">
                    {student.date}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full shadow-sm">
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleProcessRequest(student)}
                      className="px-4 py-1.5 text-xs font-semibold bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors shadow-sm"
                    >
                      📝 Process
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {students.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-md mt-6">
            <div className="text-gray-400 text-5xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No document requests found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              No pending document requests at the moment.
            </p>
          </div>
        )}
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

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DocumentRequests;