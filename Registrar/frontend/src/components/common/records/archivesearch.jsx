// C:\xampp\htdocs\SMS-GCA-3H\Registrar\frontend\src\components\common\records\ArchiveSearch.jsx

import React, { useState, useEffect } from "react";
import ViewStudentInfoModal from "./ViewStudentInfoModal";
import { useDarkMode } from "../../DarkModeProvider";

const API_BASE_URL = "http://localhost/SMS-GCA-3H/Registrar/backend/api/records";

const ArchiveSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [archivedRecords, setArchivedRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    schoolYear: "all",
    exitType: "all",
  });
  const [selectedRecords, setSelectedRecords] = useState([]);

  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    const prev = document.body.style.fontFamily;
    document.body.style.fontFamily = "'Poppins', sans-serif";
    return () => {
      document.body.style.fontFamily = prev || "";
    };
  }, []);

  useEffect(() => {
    fetchArchivedRecords();
  }, []);

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

  const handleSelectAll = (e) => {
    setSelectedRecords(
      e.target.checked ? archivedRecords.map((r) => r.id) : []
    );
  };

  const handleSelectRecord = (recordId) => {
    setSelectedRecords((prev) =>
      prev.includes(recordId)
        ? prev.filter((id) => id !== recordId)
        : [...prev, recordId]
    );
  };

  const handleViewArchiveLog = () => alert("Opening archive log...");
  const handleExportResults = () => alert("Exporting search results...");
  const handleSearchArchive = () =>
    console.log("Searching archives...", { searchTerm, filters });

  const handleViewRecord = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  // Calculate statistics
  const stats = {
    total: archivedRecords.length,
    graduated: archivedRecords.filter(r => r.exitType === 'Graduation').length,
    transferred: archivedRecords.filter(r => r.exitType === 'Transfer Out').length,
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 p-8 font-sans min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">⏳</div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">Loading archived records...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-900 p-8 font-sans min-h-screen flex items-center justify-center">
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
    <div className="bg-white dark:bg-gray-900 p-8 font-sans">
      <div className="max-w-7xl mx-auto animate-fadeIn">
        {/* Header with Title and Buttons */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Student Records Archive Search
          </h2>
          <div className="flex gap-3">
            <button
              onClick={handleViewArchiveLog}
              className="px-5 py-2.5 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-600 text-sm font-semibold text-gray-700 dark:text-gray-300 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              📋 View Archive Log
            </button>
            <button
              onClick={handleExportResults}
              className="px-5 py-2.5 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
            >
              📊 Export Search Results
            </button>
          </div>
        </div>

        {/* Yellow Search Box */}
        <div className="bg-gradient-to-br from-yellow-100 dark:from-yellow-900/30 via-yellow-50 dark:via-yellow-900/20 to-yellow-100 dark:to-yellow-900/30 p-6 rounded-xl mb-6 shadow-sm">
          <label className="block text-sm font-bold text-gray-800 dark:text-gray-300 mb-3">
            Search Student Records
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter Student name, ID, or other details"
              className="flex-1 px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
            <select
              value={filters.schoolYear}
              onChange={(e) =>
                setFilters({ ...filters, schoolYear: e.target.value })
              }
              className="px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <option value="all">All Years</option>
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
              <option value="all">All Types</option>
              <option value="transfer">Transfer Out</option>
              <option value="graduation">Graduation</option>
              <option value="dropped">Dropped</option>
            </select>
            <button
              onClick={handleSearchArchive}
              className="px-6 py-2.5 bg-green-500 dark:bg-green-600 text-white rounded-lg hover:bg-green-600 dark:hover:bg-green-500 text-sm font-bold transition-all duration-300 shadow-md hover:shadow-lg"
            >
              🔍 Search Archive
            </button>
          </div>
        </div>
      

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left w-12">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 w-4 h-4 cursor-pointer bg-white dark:bg-gray-700"
                    checked={
                      archivedRecords.length > 0 &&
                      selectedRecords.length === archivedRecords.length
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
                    className="px-6 py-4 text-left text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wide"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
              {archivedRecords.map((record) => (
                <tr
                  key={record.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-150"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 w-4 h-4 cursor-pointer bg-white dark:bg-gray-700"
                      checked={selectedRecords.includes(record.id)}
                      onChange={() => handleSelectRecord(record.id)}
                    />
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {record.studentName}
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300 font-medium">
                    {record.studentId}
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    {record.lastGradeLevel}
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{record.exitType}</td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{record.exitDate}</td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    {record.archiveDate}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleViewRecord(record)}
                      className="px-4 py-2 text-sm font-semibold bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg shadow-sm transition-all duration-200"
                    >
                      👁️ View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {archivedRecords.length === 0 && (
          <div className="text-center py-12 animate-fadeIn">
            <div className="text-gray-400 text-5xl mb-4">📁</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No archived records found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your search criteria.</p>
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