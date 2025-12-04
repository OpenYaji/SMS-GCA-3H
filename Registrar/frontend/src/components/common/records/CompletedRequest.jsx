import React, { useState } from "react";
import CompletedRequestInfoModal from "./CompletedRequestInfo";

const CompletedRequestHistory = () => {
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filters, setFilters] = useState({
    documentType: "all",
    gradeLevel: "all",
    dateRange: "all",
  });

  const requests = [
    {
      id: 1,
      name: "Abuel, Kristine M.",
      studentId: "GCA-2025-004",
      gradeLevel: "Grade 7",
      documentType: "Form 137",
      requestDate: "Oct 15, 2025",
      completedDate: "Oct 18, 2025",
      pickupDate: "Oct 20, 2025",
      pickupTime: "2:00 PM",
      email: "kristine.abuel@email.com",
      status: "Released",
      requestPurpose: "Transfer to another school",
    },
    {
      id: 2,
      name: "Almilla, John T.",
      studentId: "GCA-2025-006",
      gradeLevel: "Grade 9",
      documentType: "Certificate of Good Moral",
      requestDate: "Oct 16, 2025",
      completedDate: "Oct 19, 2025",
      pickupDate: "Oct 22, 2025",
      pickupTime: "10:00 AM",
      email: "john.almilla@email.com",
      status: "Released",
      requestPurpose: "Scholarship application",
    },
    {
      id: 3,
      name: "Bordallo, Angelo J.",
      studentId: "GCA-2025-011",
      gradeLevel: "Grade 4",
      documentType: "Form 137",
      requestDate: "Oct 10, 2025",
      completedDate: "Oct 13, 2025",
      pickupDate: "Oct 15, 2025",
      pickupTime: "3:30 PM",
      email: "angelo.bordallo@email.com",
      status: "Released",
      requestPurpose: "Transfer to another school",
    },
    {
      id: 4,
      name: "Cruz, Catherine S.",
      studentId: "GCA-2025-017",
      gradeLevel: "Grade 3",
      documentType: "Certificate of Enrollment",
      requestDate: "Oct 12, 2025",
      completedDate: "Oct 14, 2025",
      pickupDate: "Oct 17, 2025",
      pickupTime: "11:00 AM",
      email: "catherine.cruz@email.com",
      status: "Released",
      requestPurpose: "Travel visa application",
    },
  ];

  const handleSelectAll = (e) => {
    setSelectedRequests(e.target.checked ? requests.map((r) => r.id) : []);
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
    }
  };

  const handleRowClick = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status) => {
    const styles = {
      Released: "bg-green-100 text-green-800 border border-green-300",
      Archived: "bg-gray-100 text-gray-800 border border-gray-300",
    };
    return styles[status] || "bg-gray-100 text-gray-800 border border-gray-300";
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto animate-fadeIn">
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 mb-6 transition-all duration-300">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            ✅ Completed Request History
          </h2>

          <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-stone-900 rounded-xl p-4 flex flex-wrap gap-4 items-center shadow-xl">
            <div className="flex items-center gap-2">
              <label className="text-white text-sm font-bold">Document Type:</label>
              <select
                value={filters.documentType}
                onChange={(e) => handleFilterChange("documentType", e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all hover:shadow-md cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="form137">Form 137</option>
                <option value="goodmoral">Good Moral Certificate</option>
                <option value="enrollment">Certificate of Enrollment</option>
                <option value="diploma">Diploma</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-white text-sm font-bold">Grade Level:</label>
              <select
                value={filters.gradeLevel}
                onChange={(e) => handleFilterChange("gradeLevel", e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all hover:shadow-md cursor-pointer"
              >
                <option value="all">All Grades</option>
                <option value="1">Grade 1</option>
                <option value="2">Grade 2</option>
                <option value="3">Grade 3</option>
                <option value="4">Grade 4</option>
                <option value="5">Grade 5</option>
                <option value="6">Grade 6</option>
                <option value="7">Grade 7</option>
                <option value="8">Grade 8</option>
                <option value="9">Grade 9</option>
                <option value="10">Grade 10</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-white text-sm font-bold">Date Range:</label>
              <select
                value={filters.dateRange}
                onChange={(e) => handleFilterChange("dateRange", e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all hover:shadow-md cursor-pointer"
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
                className="flex items-center gap-2 px-5 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
              >
                <span className="text-lg">📄</span>
                <span className="text-sm font-bold">Export Report</span>
              </button>
              <button
                onClick={handleBulkArchive}
                className="flex items-center gap-2 px-5 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
              >
                <span className="text-lg">📦</span>
                <span className="text-sm font-bold">Archive Selected</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 group cursor-pointer">
            <h3 className="text-gray-600 text-sm font-bold mb-2 tracking-wide uppercase">
              Total Completed
            </h3>
            <p className="text-5xl font-bold text-gray-900 mb-3 group-hover:scale-110 transition-transform">
              {requests.length}
            </p>
            <p className="text-sm text-gray-600 font-medium">All Time</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 group cursor-pointer">
            <h3 className="text-gray-600 text-sm font-bold mb-2 tracking-wide uppercase">
              This Month
            </h3>
            <p className="text-5xl font-bold text-gray-900 mb-3 group-hover:scale-110 transition-transform">
              12
            </p>
            <p className="text-sm text-gray-600 font-medium">Requests</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 group cursor-pointer">
            <h3 className="text-gray-600 text-sm font-bold mb-2 tracking-wide uppercase">
              Avg. Processing Time
            </h3>
            <p className="text-5xl font-bold text-gray-900 mb-3 group-hover:scale-110 transition-transform">
              3
            </p>
            <p className="text-sm text-gray-600 font-medium">Days</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 group cursor-pointer">
            <h3 className="text-gray-600 text-sm font-bold mb-2 tracking-wide uppercase">
              Most Requested
            </h3>
            <p className="text-2xl font-bold text-gray-900 mb-3 group-hover:scale-110 transition-transform">
              Form 137
            </p>
            <p className="text-sm text-gray-600 font-medium">Document Type</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-x-auto hover:shadow-2xl transition-all duration-300">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={requests.length > 0 && selectedRequests.length === requests.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 tracking-wide">
                  Student Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 tracking-wide">
                  Student ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 tracking-wide">
                  Document Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 tracking-wide">
                  Request Purpose
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 tracking-wide">
                  Request Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 tracking-wide">
                  Completed Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 tracking-wide">
                  Pickup Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 tracking-wide">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((request) => (
                <tr
                  key={request.id}
                  className="hover:bg-gray-50 transition-all duration-200"
                >
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedRequests.includes(request.id)}
                      onChange={() => handleSelectRequest(request.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">
                    {request.name}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {request.studentId}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                    {request.documentType}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                    {request.requestPurpose}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                    {request.requestDate}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                    {request.completedDate}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                    {request.pickupDate}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600 font-medium">
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleRowClick(request)}
                      className="px-3 py-1.5 text-xs font-semibold bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg shadow-sm transition-all duration-300 hover:-translate-y-0.5"
                    >
                      👁️ View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {requests.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-md mt-6">
            <div className="text-gray-400 text-5xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No completed requests found
            </h3>
            <p className="text-gray-600">
              Completed document requests will appear here.
            </p>
          </div>
        )}
      </div>

      <CompletedRequestInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        request={selectedRequest}
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