import React, { useState, useEffect } from "react";
import ViewStudentInfoModal from "./ViewStudentInfoModal";
import { useDarkMode } from "../../DarkModeProvider";

const API_BASE_URL = "http://localhost/SMS-GCA-3H/Registrar/backend/api/records";

const ArchiveSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [archivedRecords, setArchivedRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    schoolYear: "all",
    exitType: "all",
  });
  const [selectedRecords, setSelectedRecords] = useState([]);

  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    fetchArchivedRecords();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filters, archivedRecords]);

  const fetchArchivedRecords = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/get_archive_search.php`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch archived records");
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setArchivedRecords(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching archived records:", err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...archivedRecords];

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(record =>
        record.studentName?.toLowerCase().includes(term) ||
        record.studentId?.toLowerCase().includes(term) ||
        record.lastGradeLevel?.toLowerCase().includes(term) ||
        record.exitType?.toLowerCase().includes(term)
      );
    }

    if (filters.schoolYear !== "all") {
      filtered = filtered.filter(record => {
        const recordYear = getSchoolYear(record.archiveDate || record.exitDate);
        return recordYear === filters.schoolYear;
      });
    }

    if (filters.exitType !== "all") {
      const exitTypeMap = {
        'transfer': 'Transfer Out',
        'graduation': 'Graduation',
        'dropped': 'Dropped'
      };
      
      const filterValue = exitTypeMap[filters.exitType] || filters.exitType;
      filtered = filtered.filter(record => 
        record.exitType?.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    setFilteredRecords(filtered);
  };

  const getSchoolYear = (dateString) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    
    if (month >= 6 && month <= 12) {
      return `${year}-${year + 1}`;
    } else {
      return `${year - 1}-${year}`;
    }
  };

  const handleSelectAll = (e) => {
    setSelectedRecords(
      e.target.checked ? filteredRecords.map((r) => r.id) : []
    );
  };

  const handleSelectRecord = (recordId) => {
    setSelectedRecords((prev) =>
      prev.includes(recordId)
        ? prev.filter((id) => id !== recordId)
        : [...prev, recordId]
    );
  };

  const handleExportResults = () => {
    if (selectedRecords.length === 0) {
      alert("Please select records to export");
      return;
    }

    // Get selected records data
    const recordsToExport = archivedRecords.filter(record => 
      selectedRecords.includes(record.id)
    );

    // Create CSV content
    const headers = [
      "Student Name",
      "Student ID",
      "Last Grade Level",
      "Exit Type",
      "Exit Date",
      "Archive Date"
    ];

    const csvContent = [
      headers.join(","),
      ...recordsToExport.map(record => [
        `"${record.studentName || ''}"`,
        `"${record.studentId || ''}"`,
        `"${record.lastGradeLevel || ''}"`,
        `"${record.exitType || ''}"`,
        `"${record.exitDate || ''}"`,
        `"${record.archiveDate || ''}"`
      ].join(","))
    ].join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `archived_records_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert(`Successfully exported ${selectedRecords.length} record(s)`);
  };

  const handleSearchArchive = () => {
    console.log("Searching archives with:", { searchTerm, filters });
  };

  const handleViewRecord = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const stats = {
    total: filteredRecords.length,
    graduated: filteredRecords.filter(r => r.exitType?.toLowerCase().includes('graduation')).length,
    transferred: filteredRecords.filter(r => r.exitType?.toLowerCase().includes('transfer')).length,
    dropped: filteredRecords.filter(r => r.exitType?.toLowerCase().includes('dropped')).length,
  };

  if (loading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-0 sm:p-0 font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">⏳</div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">Loading archived records...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-0 sm:p-0 font-sans flex items-center justify-center">
        <div className="text-center bg-red-50 dark:bg-red-900/20 p-6 rounded-xl border-2 border-red-200 dark:border-red-800">
          <div className="text-5xl mb-4">⚠️</div>
          <h3 className="text-lg font-bold text-red-900 dark:text-red-300 mb-2">Error Loading Archives</h3>
          <p className="text-red-700 dark:text-red-400">{error}</p>
          <button 
            onClick={fetchArchivedRecords}
            className="mt-4 px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-0 sm:p-0 font-sans">
      {/* Flush Left & Top - matching CompletedRequest layout */}
      <div className="max-w-full mx-auto px-0 py-0 animate-fadeIn">
        {/* Header with Title and Button - matching CompletedRequest flush layout */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-6 mb-6 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              📁 Student Records Archive Search
            </h2>
            <div className="flex gap-3">
              <button
                onClick={handleExportResults}
                disabled={selectedRecords.length === 0}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg ${
                  selectedRecords.length > 0
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                }`}
              >
                📤 Export Selected ({selectedRecords.length})
              </button>
            </div>
          </div>

          {/* Search Box - Original style, not gradient bar */}
          <div className="bg-gradient-to-br from-blue-50 dark:from-blue-900/20 via-white dark:via-gray-800 to-blue-50 dark:to-blue-900/20 p-6 rounded-xl border-2 border-blue-100 dark:border-blue-800/30">
            <label className="block text-sm font-bold text-gray-800 dark:text-gray-300 mb-3">
              Search Student Records
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Enter Student name, ID, or other details"
                  className="w-full px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
              <div className="flex gap-3">
                <select
                  value={filters.schoolYear}
                  onChange={(e) =>
                    setFilters({ ...filters, schoolYear: e.target.value })
                  }
                  className="px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="all">All School Years</option>
                  <option value="2023-2024">2023-2024</option>
                  <option value="2024-2025">2024-2025</option>
                  <option value="2025-2026">2025-2026</option>
                </select>
                <select
                  value={filters.exitType}
                  onChange={(e) =>
                    setFilters({ ...filters, exitType: e.target.value })
                  }
                  className="px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="all">All Exit Types</option>
                  <option value="graduation">Graduation</option>
                  <option value="transfer">Transfer Out</option>
                  <option value="dropped">Dropped</option>
                </select>
               
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          {[
            { title: "Total Records", value: stats.total, color: "blue" },
            { title: "Graduated", value: stats.graduated, color: "green" },
            { title: "Transferred", value: stats.transferred, color: "yellow" },
            { title: "Dropped", value: stats.dropped, color: "red" }
          ].map((stat, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 group cursor-pointer"
            >
              <h3 className="text-gray-600 dark:text-gray-300 text-sm font-bold mb-2 tracking-wide uppercase">
                {stat.title}
              </h3>
              <p className="text-5xl font-bold text-gray-900 dark:text-white mb-3 group-hover:scale-110 transition-transform">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-gray-200 dark:border-gray-700 overflow-x-auto hover:shadow-2xl transition-all duration-300">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b-2 border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 w-4 h-4 cursor-pointer bg-white dark:bg-gray-700"
                    checked={
                      filteredRecords.length > 0 &&
                      selectedRecords.length === filteredRecords.length
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                {[
                  "Student Name",
                  "Student ID",
                  "Last Grade Level",
                  "Exit Type",
                  "Exit Date",
                  "Archive Date",
                  "Actions",
                ].map((heading, i) => (
                  <th
                    key={i}
                    className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white tracking-wide"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredRecords.map((record) => (
                <tr
                  key={record.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 w-4 h-4 cursor-pointer bg-white dark:bg-gray-700"
                      checked={selectedRecords.includes(record.id)}
                      onChange={() => handleSelectRecord(record.id)}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
                    {record.studentName}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                    {record.studentId}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 font-medium">
                    {record.lastGradeLevel}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full shadow-sm ${
                      record.exitType?.toLowerCase().includes('graduation') 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                        : record.exitType?.toLowerCase().includes('transfer')
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                    }`}>
                      {record.exitType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 font-medium">
                    {record.exitDate}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 font-medium">
                    {record.archiveDate}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleViewRecord(record)}
                      className="px-4 py-2 text-sm font-semibold bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-400 rounded-lg shadow-sm transition-all duration-300 hover:-translate-y-0.5"
                    >
                      👁️ View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredRecords.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-md mt-6">
            <div className="text-gray-400 text-5xl mb-4">📁</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No archived records found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {archivedRecords.length === 0 
                ? "No records have been archived yet." 
                : "Try adjusting your search criteria or filters."}
            </p>
          </div>
        )}
      </div>

      {/* View Student Info Modal */}
      <ViewStudentInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        student={selectedStudent}
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

export default ArchiveSearch;