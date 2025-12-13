import React, { useState, useEffect, useMemo } from "react";
import { Archive, GraduationCap, ArrowRightLeft, XCircle, Eye, Download } from 'lucide-react'; 
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
  const [animate, setAnimate] = useState(false);

  const { isDarkMode } = useDarkMode();

  // --- Utility Functions (FIXED) ---
  const getSchoolYear = (dateString) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    
    // FIX: Add validation to prevent calling getFullYear/getMonth on 'Invalid Date' object
    if (isNaN(date)) {
        console.warn("Invalid date string encountered for School Year calculation:", dateString);
        return "Invalid Date"; // Return a non-crashing, distinct value
    }

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    
    // Assuming school year starts in June (6)
    if (month >= 6 && month <= 12) {
      return `${year}-${year + 1}`;
    } else {
      return `${year - 1}-${year}`;
    }
  };

  // --- Fetching Logic ---
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
      
      // Ensure data is an array (API robustness)
      setArchivedRecords(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching archived records:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchivedRecords();
    setAnimate(true); // Start animation
  }, []);

  // --- Filtering Logic (Memoized for performance and stability) ---
  const filteredData = useMemo(() => {
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
        // This call is now safe thanks to the fix in getSchoolYear
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

    return filtered;
  }, [searchTerm, filters, archivedRecords]);

  useEffect(() => {
    setFilteredRecords(filteredData);
  }, [filteredData]);


  // --- Handlers ---
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

  const handleFilterChange = (filterName, value) => {
    setFilters({ ...filters, [filterName]: value });
  };

  const handleExportResults = () => {
    if (selectedRecords.length === 0) {
      alert("Please select records to export");
      return;
    }

    const recordsToExport = archivedRecords.filter(record => 
      selectedRecords.includes(record.id)
    );

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
      ...recordsToExport.map(record => 
        headers.map(header => {
          // Map header to its corresponding data key (e.g., "Student ID" -> "studentId")
          const keyMap = {
            "Student Name": 'studentName', 
            "Student ID": 'studentId', 
            "Last Grade Level": 'lastGradeLevel',
            "Exit Type": 'exitType',
            "Exit Date": 'exitDate',
            "Archive Date": 'archiveDate'
          };
          const key = keyMap[header];
          const cell = record[key] || 'N/A';
          // CSV sanitation: surround with quotes and escape internal quotes
          return `"${cell.toString().replace(/"/g, '""')}"`;
        }).join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `archived_records_${new Date().toISOString().split('T')[0]}.csv`);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert(`Successfully exported ${selectedRecords.length} record(s)`);
    setSelectedRecords([]);
  };

  const handleViewRecord = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  // --- Statistics Calculation (Memoized) ---
  const stats = useMemo(() => {
    return {
      total: filteredRecords.length,
      graduated: filteredRecords.filter(r => r.exitType?.toLowerCase().includes('graduation')).length,
      transferred: filteredRecords.filter(r => r.exitType?.toLowerCase().includes('transfer')).length,
      dropped: filteredRecords.filter(r => r.exitType?.toLowerCase().includes('dropped')).length,
    };
  }, [filteredRecords]);

  const statCardsData = [
    { 
        title: "Total Archived Records", 
        value: stats.total, 
        icon: Archive, 
        textColor: 'text-blue-600 dark:text-blue-400', 
        bgLight: 'bg-blue-100',
    },
    { 
        title: "Graduation Exit", 
        value: stats.graduated, 
        icon: GraduationCap, 
        textColor: 'text-green-600 dark:text-green-400', 
        bgLight: 'bg-green-100',
    },
    { 
        title: "Transfer Out", 
        value: stats.transferred, 
        icon: ArrowRightLeft, 
        textColor: 'text-yellow-600 dark:text-yellow-400', 
        bgLight: 'bg-yellow-100',
    },
    { 
        title: "Dropped", 
        value: stats.dropped, 
        icon: XCircle, 
        textColor: 'text-red-600 dark:text-red-400', 
        bgLight: 'bg-red-100',
    },
  ];

  // --- Render Loading/Error States ---
  if (loading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 text-gray-500 dark:text-gray-400 animate-spin">⏳</div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">Loading archived records...</p>
        </div>
      </div>
    );
  }

  if (error && !archivedRecords.length) { 
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-0 flex items-center justify-center">
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
  
  const totalFilteredRecords = filteredRecords.length;
  const isAllSelected = totalFilteredRecords > 0 && selectedRecords.length === totalFilteredRecords;


  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-0 sm:p-0 font-sans">
      
      {/* Custom style for slide-up animation (Copied from DocumentRequests) */}
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
          Archived Student Records
        </h1>

        {/* Statistics Cards (COPIED STYLE) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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
        
        {/* Filter and Search Bar (Maintaining original filtering functionality) */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-300 dark:border-slate-600 p-4 mb-6 transition-all duration-300">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search by name, ID, or exit type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {/* School Year Filter */}
              <select
                value={filters.schoolYear}
                onChange={(e) => handleFilterChange("schoolYear", e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
              >
                <option value="all">All School Years</option>
                {/* Dynamically generate options based on unique years in data, if possible, or keep static */}
                <option value="2023-2024">2023-2024</option>
                <option value="2024-2025">2024-2025</option>
                <option value="2025-2026">2025-2026</option>
              </select>

              {/* Exit Type Filter */}
              <select
                value={filters.exitType}
                onChange={(e) => handleFilterChange("exitType", e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
              >
                <option value="all">All Exit Types</option>
                <option value="graduation">Graduation</option>
                <option value="transfer">Transfer Out</option>
                <option value="dropped">Dropped</option>
              </select>
              
              {/* Action: Export */}
              <button
                onClick={handleExportResults}
                disabled={selectedRecords.length === 0}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" /> Export ({selectedRecords.length})
              </button>
            </div>
          </div>
        </div>

        {/* Main Table Container (COPIED STYLE) */}
        <div className={`mt-0 rounded-2xl shadow-md border border-gray-300 dark:border-slate-600 overflow-visible ${animate ? "slide-up" : ""}`}>
          
          {/* Display Counter (Header Bar - COPIED STYLE) */}
          <div className="flex justify-between items-center px-4 py-3 bg-white dark:bg-slate-800 rounded-t-2xl border-b border-gray-300 dark:border-slate-600">
            {/* Left Side: Display Counter (Showing X Requests) */}
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {totalFilteredRecords > 0 ? (
                <>
                  Showing
                  <span className="font-bold text-gray-800 dark:text-white mx-1">
                    {totalFilteredRecords}
                  </span>
                  {` Record${totalFilteredRecords > 1 ? 's' : ''}`}
                </>
              ) : (
                'No Record Found'
              )}
            </span>

            {/* Right Side: Placeholder for Pagination (Empty) */}
            <div className="h-6"></div> 
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[1200px] w-full border-collapse relative z-10">
              
              {/* Table Header (COPIED STYLE) */}
              <thead className="bg-gray-100 dark:bg-slate-700 text-left border-b border-gray-400 dark:border-slate-500">
                <tr>
                  <th className="px-4 py-3 w-10">
                    <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 w-4 h-4 cursor-pointer bg-white dark:bg-gray-700"
                    />
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white">Student Name</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white">Student ID</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white">Last Grade Level</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white">Exit Type</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white">Exit Date</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white">Archive Date</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white text-center">Actions</th>
                </tr>
              </thead>

              {/* Table Body (Rows - COPIED STYLE) */}
              <tbody>
                {totalFilteredRecords > 0 ? (
                  filteredRecords.map((record, index) => (
                    <tr
                      key={record.id}
                      className={`transition-all duration-300
                        ${index !== totalFilteredRecords - 1 ? "border-b border-gray-400 dark:border-slate-600" : ""}
                        hover:bg-gray-50 dark:hover:bg-slate-700
                        ${selectedRecords.includes(record.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                      `}
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-3 w-10" onClick={(e) => e.stopPropagation()}>
                        <input
                            type="checkbox"
                            checked={selectedRecords.includes(record.id)}
                            onChange={() => handleSelectRecord(record.id)}
                            className="rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 w-4 h-4 cursor-pointer bg-white dark:bg-gray-700"
                        />
                      </td>
                      {/* Name */}
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-white font-medium">
                        {record.studentName || "N/A"}
                      </td>
                      {/* ID */}
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{record.studentId || "N/A"}</td>
                      {/* Last Grade Level */}
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{record.lastGradeLevel || "N/A"}</td>
                      {/* Exit Type (Badge Style - COPIED STYLE) */}
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          record.exitType?.toLowerCase().includes('graduation') 
                            ? 'bg-green-300 text-black'
                            : record.exitType?.toLowerCase().includes('transfer')
                            ? 'bg-yellow-300 text-black'
                            : 'bg-red-300 text-black'
                        }`}>
                          {record.exitType || "N/A"}
                        </span>
                      </td>
                      {/* Exit Date */}
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{record.exitDate || "N/A"}</td>
                      {/* Archive Date */}
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{record.archiveDate || "N/A"}</td>
                      {/* Actions (Button Style - COPIED STYLE) */}
                      <td className="px-4 py-3 text-center relative" onClick={(e) => e.stopPropagation()}>
                        <div className="relative flex flex-col items-center group">
                          <button
                            className="inline-flex items-center gap-2 border border-gray-400 text-black dark:text-white px-3 py-1.5 rounded-md text-sm font-semibold bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 transition cursor-pointer"
                            onClick={() => handleViewRecord(record)}
                          >
                            <Eye className="w-4 h-4" /> View
                          </button>
                          <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-medium rounded-md px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-[9999]">
                            View Full Record
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      No archived records found matching the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* View Student Info Modal */}
      <ViewStudentInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        student={selectedStudent}
      />
    </div>
  );
};

export default ArchiveSearch;