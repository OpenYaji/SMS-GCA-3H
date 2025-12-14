import React, { useState, useEffect, useMemo } from "react";
import { Archive, GraduationCap, ArrowRightLeft, XCircle, Eye, Download } from 'lucide-react'; 
import ViewStudentInfoModal from "./ViewStudentInfoModal";
import { useDarkMode } from "../../DarkModeProvider";

const API_BASE_URL = "http://localhost/SMS-GCA-3H/Registrar/backend/api/records";

// --- EXPORT CONFIRMATION MODAL (UPDATED FOR PDF) ---
const ExportConfirmationModal = ({ isOpen, onClose, onConfirm, recordCount, exporting }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                        <Download className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Confirm Export</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                    You are about to export <strong>{recordCount}</strong> archived record{recordCount !== 1 ? 's' : ''} to PDF format.
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    The exported file will include student names, IDs, grade levels, exit types, and dates.
                </p>
                <div className="flex justify-end gap-3">
                    <button 
                        onClick={onClose} 
                        disabled={exporting} 
                        className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-lg text-gray-800 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onConfirm} 
                        disabled={exporting} 
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        {exporting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Exporting...
                            </>
                        ) : (
                            <>
                                <Download className="w-4 h-4" />
                                Export PDF
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- SUCCESS NOTIFICATION MODAL ---
const SuccessNotificationModal = ({ isOpen, onClose, title, message, icon = "✅" }) => {
    if (!isOpen) return null;
    useEffect(() => {
        const timer = setTimeout(onClose, 2000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-0 flex items-center justify-center z-[70] p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm p-8 text-center animate-bounce-in">
                <div className="mb-4 text-6xl">{icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{message}</p>
            </div>
        </div>
    );
};

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
  const [animate, setAnimate] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { isDarkMode } = useDarkMode();

  // --- Utility Functions ---
  const getSchoolYear = (dateString) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    
    if (isNaN(date)) {
        console.warn("Invalid date string encountered for School Year calculation:", dateString);
        return "Invalid Date";
    }

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    
    if (month >= 6 && month <= 12) {
      return `${year}-${year + 1}`;
    } else {
      return `${year - 1}-${year}`;
    }
  };

  // --- PDF Generation Function (Similar to CompletedRequest.jsx) ---
  const generatePDF = (data) => {
    // Create a new window for printing
    const printWindow = window.open('', '', 'width=800,height=600');
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Archived Student Records Report</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 20mm;
          }
          
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            font-size: 12px;
          }
          
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 15px;
          }
          
          .header h1 {
            margin: 0;
            color: #1e40af;
            font-size: 24px;
          }
          
          .header p {
            margin: 5px 0;
            color: #6b7280;
            font-size: 14px;
          }
          
          .meta-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            padding: 10px;
            background-color: #f3f4f6;
            border-radius: 5px;
          }
          
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-bottom: 20px;
          }
          
          .stat-card {
            padding: 10px;
            border-radius: 5px;
            text-align: center;
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
          }
          
          .stat-card .value {
            font-size: 20px;
            font-weight: bold;
            color: #1e40af;
          }
          
          .stat-card .label {
            font-size: 10px;
            color: #64748b;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          
          th {
            background-color: #2563eb;
            color: white;
            padding: 12px 8px;
            text-align: left;
            font-weight: bold;
            font-size: 11px;
          }
          
          td {
            padding: 10px 8px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 11px;
          }
          
          tr:nth-child(even) {
            background-color: #f9fafb;
          }
          
          tr:hover {
            background-color: #eff6ff;
          }
          
          .exit-type-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: bold;
          }
          
          .exit-graduation {
            background-color: #86efac;
            color: #000;
          }
          
          .exit-transfer {
            background-color: #fef08a;
            color: #000;
          }
          
          .exit-dropped {
            background-color: #fca5a5;
            color: #000;
          }
          
          .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 10px;
          }
          
          @media print {
            body {
              padding: 0;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Archived Student Records Report</h1>
          <p>Generated on ${new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
          <p>School Year Filter: ${filters.schoolYear === 'all' ? 'All Years' : filters.schoolYear} | 
             Exit Type Filter: ${filters.exitType === 'all' ? 'All Types' : filters.exitType}</p>
        </div>
        
        <div class="stats-grid">
          <div class="stat-card">
            <div class="value">${stats.total}</div>
            <div class="label">Total Archived</div>
          </div>
          <div class="stat-card">
            <div class="value">${stats.graduated}</div>
            <div class="label">Graduation Exit</div>
          </div>
          <div class="stat-card">
            <div class="value">${stats.transferred}</div>
            <div class="label">Transfer Out</div>
          </div>
          <div class="stat-card">
            <div class="value">${stats.dropped}</div>
            <div class="label">Dropped</div>
          </div>
        </div>
        
        <div class="meta-info">
          <div><strong>Total Records:</strong> ${data.length}</div>
          <div><strong>Report Type:</strong> Archived Student Records</div>
          <div><strong>Search Term:</strong> ${searchTerm || 'None'}</div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Student ID</th>
              <th>Last Grade Level</th>
              <th>Exit Type</th>
              <th>Exit Date</th>
              <th>Archive Date</th>
              <th>School Year</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(record => {
              const exitClass = record.exitType?.toLowerCase().includes('graduation') ? 'exit-graduation' :
                               record.exitType?.toLowerCase().includes('transfer') ? 'exit-transfer' : 'exit-dropped';
              const schoolYear = getSchoolYear(record.archiveDate || record.exitDate);
              return `
                <tr>
                  <td>${record.studentName || 'N/A'}</td>
                  <td>${record.studentId || 'N/A'}</td>
                  <td>${record.lastGradeLevel || 'N/A'}</td>
                  <td><span class="exit-type-badge ${exitClass}">${record.exitType || 'N/A'}</span></td>
                  <td>${record.exitDate || 'N/A'}</td>
                  <td>${record.archiveDate || 'N/A'}</td>
                  <td>${schoolYear}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
        
        <div class="footer">
          <p>This is a system-generated report from the Student Management System.</p>
          <p>© ${new Date().getFullYear()} - All Rights Reserved</p>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() {
              window.close();
            }, 500);
          };
        </script>
      </body>
      </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
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
    setAnimate(true);
  }, []);

  // --- Filtering Logic ---
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

  // --- Statistics Calculation ---
  const stats = useMemo(() => {
    return {
      total: filteredRecords.length,
      graduated: filteredRecords.filter(r => r.exitType?.toLowerCase().includes('graduation')).length,
      transferred: filteredRecords.filter(r => r.exitType?.toLowerCase().includes('transfer')).length,
      dropped: filteredRecords.filter(r => r.exitType?.toLowerCase().includes('dropped')).length,
    };
  }, [filteredRecords]);

  // --- Handlers ---
  const handleFilterChange = (filterName, value) => {
    setFilters({ ...filters, [filterName]: value });
  };

  const handleExportClick = () => {
    // Export all filtered records (similar to CompletedRequest.jsx)
    if (filteredRecords.length === 0) {
      alert("No data to export based on current filters.");
      return;
    }
    setShowExportModal(true);
  };

  const handleExportConfirm = async () => {
    try {
      setExporting(true);
      
      // Simulate a brief delay for UX
      await new Promise(resolve => setTimeout(resolve, 500));

      // Generate PDF with filtered records
      generatePDF(filteredRecords);

      setShowExportModal(false);
      
      
      
      
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("Error exporting data. Please try again.");
      setShowExportModal(false);
    } finally {
      setExporting(false);
    }
  };

  const handleViewRecord = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

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

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-0 sm:p-0 font-sans">
      
      {/* Custom style for animations */}
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
        
        @keyframes bounce-in {
          0% { opacity: 0; transform: scale(0.5); }
          50% { transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-bounce-in { animation: bounce-in 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
      `}</style>

      <div className="max-w-full mx-auto px-0 py-0 animate-fadeIn-no-y">
        
        {/* Header Section */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Archived Student Records
        </h1>

        {/* Statistics Cards */}
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
        
        {/* Filter and Search Bar (Updated Export Button) */}
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
              
              {/* Action: Export PDF (Updated to match CompletedRequest.jsx) */}
              <button
                onClick={handleExportClick}
                disabled={filteredRecords.length === 0}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" /> Export PDF
              </button>
            </div>
          </div>
        </div>

        {/* Main Table Container */}
        <div className={`mt-0 rounded-2xl shadow-md border border-gray-300 dark:border-slate-600 overflow-visible ${animate ? "slide-up" : ""}`}>
          
          {/* Display Counter */}
          <div className="flex justify-between items-center px-4 py-3 bg-white dark:bg-slate-800 rounded-t-2xl border-b border-gray-300 dark:border-slate-600">
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
            <div className="h-6"></div> 
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[1200px] w-full border-collapse relative z-10">
              
              {/* Table Header */}
              <thead className="bg-gray-100 dark:bg-slate-700 text-left border-b border-gray-400 dark:border-slate-500">
                <tr>
                  {/* Removed checkbox column */}
                  <th className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white">Student Name</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white">Student ID</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white">Last Grade Level</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white">Exit Type</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white">Exit Date</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white">Archive Date</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white text-center">Actions</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {totalFilteredRecords > 0 ? (
                  filteredRecords.map((record, index) => (
                    <tr
                      key={record.id}
                      className={`transition-all duration-300
                        ${index !== totalFilteredRecords - 1 ? "border-b border-gray-400 dark:border-slate-600" : ""}
                        hover:bg-gray-50 dark:hover:bg-slate-700
                      `}
                    >
                      {/* Removed checkbox cell */}
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-white font-medium">
                        {record.studentName || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{record.studentId || "N/A"}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{record.lastGradeLevel || "N/A"}</td>
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
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{record.exitDate || "N/A"}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{record.archiveDate || "N/A"}</td>
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
                    <td colSpan="7" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
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

      {/* Export Confirmation Modal (Now for PDF) */}
      <ExportConfirmationModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onConfirm={handleExportConfirm}
        recordCount={filteredRecords.length}
        exporting={exporting}
      />

      {/* Success Modal */}
      {showSuccessModal && (
        <SuccessNotificationModal
            isOpen={!!showSuccessModal}
            onClose={() => setShowSuccessModal(false)}
            title={showSuccessModal.title}
            message={showSuccessModal.message}
            icon={showSuccessModal.icon}
        />
      )}
    </div>
  );
};

export default ArchiveSearch;