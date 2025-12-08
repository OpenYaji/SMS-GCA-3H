// C:\xampp\htdocs\SMS-GCA-3H\Registrar\frontend\src\components\common\records\CompletedRequest.jsx

import React, { useState, useEffect } from "react";
import CompletedRequestInfoModal from "./CompletedRequestInfo";
import { useDarkMode } from "../../DarkModeProvider";

const API_BASE_URL = "http://localhost/SMS-GCA-3H/Registrar/backend/api/records";

const CompletedRequestHistory = () => {
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    documentType: "all",
    gradeLevel: "all",
    dateRange: "all",
  });

  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    fetchCompletedRequests();
  }, []);

  const fetchCompletedRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/get_completed_requests.php`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch completed requests");
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setRequests(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching completed requests:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filtering logic
  const filteredRequests = requests.filter(req => {
    // Search term filter
    const matchesSearch = !searchTerm || 
      (req.studentName && req.studentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (req.studentId && req.studentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (req.documentType && req.documentType.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (req.requestPurpose && req.requestPurpose.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Document type filter
    const matchesDocType = filters.documentType === 'all' || 
      (req.documentType && req.documentType === filters.documentType);
    
    // Grade level filter
    const matchesGradeLevel = filters.gradeLevel === 'all' || 
      (req.gradeLevel && req.gradeLevel.toString() === filters.gradeLevel);
    
    // Date range filter
    let matchesDateRange = true;
    if (filters.dateRange !== 'all' && req.requestDate) {
      const requestDate = new Date(req.requestDate);
      const now = new Date();
      
      switch(filters.dateRange) {
        case 'today':
          matchesDateRange = requestDate.toDateString() === now.toDateString();
          break;
        case 'this-week':
          const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
          matchesDateRange = requestDate >= startOfWeek;
          break;
        case 'this-month':
          matchesDateRange = 
            requestDate.getMonth() === now.getMonth() && 
            requestDate.getFullYear() === now.getFullYear();
          break;
        case 'last-month':
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
          matchesDateRange = requestDate >= lastMonth && requestDate <= endOfLastMonth;
          break;
        default:
          matchesDateRange = true;
      }
    }
    
    return matchesSearch && matchesDocType && matchesGradeLevel && matchesDateRange;
  });

  const handleSelectAll = (e) => {
    setSelectedRequests(e.target.checked ? filteredRequests.map((r) => r.id) : []);
  };

  const handleSelectRequest = (requestId) => {
    setSelectedRequests((prev) =>
      prev.includes(requestId)
        ? prev.filter((id) => id !== requestId)
        : [...prev, requestId]
    );
  };

  const handleFilterChange = (filterName, value) => {
    setFilters({ ...filters, [filterName]: value });
  };

  const handleExportList = () => {
    console.log("Exporting completed requests list...");
    alert("Export feature - Generate CSV/Excel report");
  };

  const handleBulkArchive = () => {
    if (selectedRequests.length === 0) {
      alert("Please select at least one request");
      return;
    }
    if (window.confirm(`Archive ${selectedRequests.length} selected request(s)?`)) {
      console.log(`Archiving ${selectedRequests.length} request(s)`);
      alert("Selected requests archived successfully!");
      setSelectedRequests([]);
      fetchCompletedRequests(); // Refresh list
    }
  };

  const handleRowClick = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleArchived = () => {
    fetchCompletedRequests(); // Refresh list after archiving
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  // Calculate stats based on filtered requests
  const stats = {
    total: filteredRequests.length,
    thisMonth: filteredRequests.filter(r => {
      if (!r.requestDate) return false;
      const requestDate = new Date(r.requestDate);
      const now = new Date();
      return requestDate.getMonth() === now.getMonth() && 
             requestDate.getFullYear() === now.getFullYear();
    }).length,
    form137: filteredRequests.filter(r => r.documentType && r.documentType.includes('Form 137')).length,
    certificates: filteredRequests.filter(r => r.documentType && r.documentType.includes('Certificate')).length,
  };

  if (loading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 sm:p-8 font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">⏳</div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">Loading completed requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 sm:p-8 font-sans flex items-center justify-center">
        <div className="text-center bg-red-50 dark:bg-red-900/20 p-6 rounded-xl border-2 border-red-200 dark:border-red-800">
          <div className="text-5xl mb-4">⚠️</div>
          <h3 className="text-lg font-bold text-red-900 dark:text-red-300 mb-2">Error Loading Completed Requests</h3>
          <p className="text-red-700 dark:text-red-400">{error}</p>
          <button 
            onClick={fetchCompletedRequests}
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
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-6 mb-6 transition-all duration-300">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
            ✅ Completed Request History
          </h2>

          <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-stone-900 rounded-xl p-4 flex flex-wrap gap-4 items-center shadow-xl">
            <div className="flex items-center gap-2">
              <label className="text-white text-sm font-bold">Document Type:</label>
              <select
                value={filters.documentType}
                onChange={(e) => handleFilterChange("documentType", e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all hover:shadow-md cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="Form 137">Form 137</option>
                <option value="Good Moral Certificate">Good Moral Certificate</option>
                <option value="Certificate of Enrollment">Certificate of Enrollment</option>
                <option value="Diploma">Diploma</option>
                <option value="Transcript of Records">Transcript of Records</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-white text-sm font-bold">Grade Level:</label>
              <select
                value={filters.gradeLevel}
                onChange={(e) => handleFilterChange("gradeLevel", e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all hover:shadow-md cursor-pointer"
              >
                <option value="all">All Grades</option>
                {[1,2,3,4,5,6,7,8,9,10].map(grade => (
                  <option key={grade} value={grade}>Grade {grade}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-white text-sm font-bold">Date Range:</label>
              <select
                value={filters.dateRange}
                onChange={(e) => handleFilterChange("dateRange", e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all hover:shadow-md cursor-pointer"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="this-week">This Week</option>
                <option value="this-month">This Month</option>
                <option value="last-month">Last Month</option>
              </select>
            </div>

            <div className="ml-auto flex gap-2">
              <button
                onClick={handleExportList}
                className="flex items-center gap-2 px-5 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
              >
                <span className="text-lg">📄</span>
                <span className="text-sm font-bold">Export Report</span>
              </button>
              <button
                onClick={handleBulkArchive}
                className="flex items-center gap-2 px-5 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
              >
                <span className="text-lg">📦</span>
                <span className="text-sm font-bold">Archive Selected</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, ID, document type, or purpose..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              )}
            </div>
            {searchTerm && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Found {filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''} matching "{searchTerm}"
              </p>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 group cursor-pointer">
            <h3 className="text-gray-600 dark:text-gray-300 text-sm font-bold mb-2 tracking-wide uppercase">
              Total Completed
            </h3>
            <p className="text-5xl font-bold text-gray-900 dark:text-white mb-3 group-hover:scale-110 transition-transform">
              {stats.total}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Filtered Results</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 group cursor-pointer">
            <h3 className="text-gray-600 dark:text-gray-300 text-sm font-bold mb-2 tracking-wide uppercase">
              This Month
            </h3>
            <p className="text-5xl font-bold text-gray-900 dark:text-white mb-3 group-hover:scale-110 transition-transform">
              {stats.thisMonth}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Requests</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 group cursor-pointer">
            <h3 className="text-gray-600 dark:text-gray-300 text-sm font-bold mb-2 tracking-wide uppercase">
              Form 137
            </h3>
            <p className="text-5xl font-bold text-gray-900 dark:text-white mb-3 group-hover:scale-110 transition-transform">
              {stats.form137}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Requests</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 group cursor-pointer">
            <h3 className="text-gray-600 dark:text-gray-300 text-sm font-bold mb-2 tracking-wide uppercase">
              Certificates
            </h3>
            <p className="text-5xl font-bold text-gray-900 dark:text-white mb-3 group-hover:scale-110 transition-transform">
              {stats.certificates}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Requests</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-gray-200 dark:border-gray-700 overflow-x-auto hover:shadow-2xl transition-all duration-300">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b-2 border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={filteredRequests.length > 0 && 
                      filteredRequests.every(req => selectedRequests.includes(req.id))}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 w-4 h-4 cursor-pointer bg-white dark:bg-gray-700"
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white tracking-wide">
                  Student Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white tracking-wide">
                  Student ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white tracking-wide">
                  Document Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white tracking-wide">
                  Request Purpose
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white tracking-wide">
                  Request Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white tracking-wide">
                  Completed Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white tracking-wide">
                  Pickup Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white tracking-wide">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredRequests.map((request) => (
                <tr
                  key={request.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedRequests.includes(request.id)}
                      onChange={() => handleSelectRequest(request.id)}
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 w-4 h-4 cursor-pointer bg-white dark:bg-gray-700"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
                    {request.studentName || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                    {request.studentId || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 font-medium">
                    {request.documentType || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 font-medium">
                    {request.requestPurpose || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 font-medium">
                    {request.requestDate || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 font-medium">
                    {request.completedDate || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 font-medium">
                    {request.pickupDate || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full shadow-sm">
                      {request.status || "Completed"}
                    </span>
                  </td>
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleRowClick(request)}
                      className="px-3 py-1.5 text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-400 rounded-lg shadow-sm transition-all duration-300 hover:-translate-y-0.5"
                    >
                      👁️ View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-md mt-6">
            <div className="text-gray-400 text-5xl mb-4">
              {searchTerm || Object.values(filters).some(f => f !== 'all') ? "🔍" : "📋"}
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm || Object.values(filters).some(f => f !== 'all') 
                ? "No matching completed requests found" 
                : "No completed requests found"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || Object.values(filters).some(f => f !== 'all') 
                ? "Try adjusting your search or filters" 
                : "Completed document requests will appear here."}
            </p>
            {(searchTerm || Object.values(filters).some(f => f !== 'all')) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilters({
                    documentType: "all",
                    gradeLevel: "all",
                    dateRange: "all",
                  });
                }}
                className="mt-4 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>

      <CompletedRequestInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        request={selectedRequest}
        onArchived={handleArchived}
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

export default CompletedRequestHistory;