import React, { useState, useEffect, useMemo } from "react";
// Assuming CompletedRequestInfoModal is in a separate file
import CompletedRequestInfoModal from "./CompletedRequestInfo";
// Assuming DarkModeProvider is correctly implemented
import { useDarkMode } from "../../DarkModeProvider";
// Import icons for the new card style (copied from DocumentRequests)
import { Clock, FileText, CheckCircle, Package, Eye, Archive, Download } from 'lucide-react'; 

// --- MODAL PLACEHOLDERS ---
const BulkArchiveModal = ({ isOpen, onClose, onConfirm, selectedCount, archiving }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Confirm Bulk Archive</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">Archive <strong>{selectedCount}</strong> selected request{selectedCount !== 1 ? 's' : ''}?</p>
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} disabled={archiving} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-lg text-gray-800 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-500">Cancel</button>
                    <button onClick={onConfirm} disabled={archiving} className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">
                        {archiving ? 'Archiving...' : `Archive ${selectedCount}`}
                    </button>
                </div>
            </div>
        </div>
    );
};

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
                    You are about to export <strong>{recordCount}</strong> completed request{recordCount !== 1 ? 's' : ''} to PDF format.
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    The exported file will include student names, IDs, document types, dates, and other relevant information.
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

// --- MAIN COMPONENT ---
const API_BASE_URL = "http://localhost/SMS-GCA-3H/Registrar/backend/api/records";

const CompletedRequestHistory = () => {
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showBulkArchiveModal, setShowBulkArchiveModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [filters, setFilters] = useState({
    documentType: "all",
    gradeLevel: "all",
    dateRange: "all",
  });
  const [animate, setAnimate] = useState(false);

  const { isDarkMode } = useDarkMode();

  // --- Fetching Logic ---
  const fetchCompletedRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/get_completed_requests.php`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch completed requests: HTTP " + response.status);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setRequests(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching completed requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedRequests();
    setAnimate(true);
  }, []);

  // --- Filtering & Searching Logic (Memoized) ---
  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      const matchesSearch = !searchTerm || 
        (req.studentName && req.studentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (req.studentId && req.studentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (req.documentType && req.documentType.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (req.requestPurpose && req.requestPurpose.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesDocType = filters.documentType === 'all' || 
        (req.documentType && req.documentType === filters.documentType);
      
      const matchesGradeLevel = filters.gradeLevel === 'all' || 
        (req.gradeLevel && req.gradeLevel.toString() === filters.gradeLevel.toString());
      
      let matchesDateRange = true;
      if (filters.dateRange !== 'all' && req.requestDate) {
        const requestDate = new Date(req.requestDate);
        const now = new Date();
        
        switch(filters.dateRange) {
          case 'today':
            matchesDateRange = requestDate.toDateString() === now.toDateString();
            break;
          case 'this-week':
            const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
            startOfWeek.setHours(0, 0, 0, 0); 
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
  }, [requests, searchTerm, filters]);

  // --- PDF Generation Function ---
  const generatePDF = (data) => {
    // Create a new window for printing
    const printWindow = window.open('', '', 'width=800,height=600');
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Completed Requests Report</title>
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
          
          .status-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: bold;
            background-color: #86efac;
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
          <h1>Completed Document Requests Report</h1>
          <p>Generated on ${new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
        </div>
        
        <div class="meta-info">
          <div><strong>Total Records:</strong> ${data.length}</div>
          <div><strong>Report Type:</strong> Completed Requests</div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Student ID</th>
              <th>Grade Level</th>
              <th>Document Type</th>
              <th>Purpose</th>
              <th>Request Date</th>
              <th>Completed Date</th>
              <th>Pickup Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(req => `
              <tr>
                <td>${req.studentName || 'N/A'}</td>
                <td>${req.studentId || 'N/A'}</td>
                <td>${req.gradeLevel || 'N/A'}</td>
                <td>${req.documentType || 'N/A'}</td>
                <td>${req.requestPurpose || 'N/A'}</td>
                <td>${req.requestDate || 'N/A'}</td>
                <td>${req.completedDate || 'N/A'}</td>
                <td>${req.pickupDate || 'N/A'}</td>
                <td><span class="status-badge">${req.status || 'Completed'}</span></td>
              </tr>
            `).join('')}
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

  // --- Handlers ---
  const handleSelectAll = (e) => {
    const allFilteredIds = filteredRequests.map((r) => r.id);
    setSelectedRequests(e.target.checked ? allFilteredIds : []);
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

  const handleExportClick = () => {
    if (filteredRequests.length === 0) {
      alert("No data to export based on current filters."); 
      return;
    }
    setShowExportModal(true);
  };

  const handleExportConfirm = async () => {
    try {
      setExporting(true);
      
      await new Promise(resolve => setTimeout(resolve, 500));

      generatePDF(filteredRequests);

      setShowExportModal(false);
      setShowSuccessModal({ 
        message: `Successfully exported ${filteredRequests.length} completed request(s) to PDF!`,
        title: "Export Successful",
        icon: "📄"
      });
      
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("Error exporting data. Please try again.");
      setShowExportModal(false);
    } finally {
      setExporting(false);
    }
  };

  const handleBulkArchiveClick = () => {
    if (selectedRequests.length === 0) {
      alert("Please select at least one request to archive");
      return;
    }
    setShowBulkArchiveModal(true);
  };

  const handleBulkArchiveConfirm = async () => {
    try {
      setArchiving(true);
      setShowBulkArchiveModal(false);
      
      const response = await fetch(`${API_BASE_URL}/archive_multiple_requests.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestIds: selectedRequests
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setShowSuccessModal({ 
            message: `${selectedRequests.length} request(s) archived successfully!`, 
            title: "Archive Successful", 
            icon: "📦" 
        });
        setTimeout(() => {
          setShowSuccessModal(false);
          setSelectedRequests([]);
          fetchCompletedRequests();
        }, 2000);
      } else {
        throw new Error(data.error || "Failed to archive requests");
      }
    } catch (error) {
      console.error("Error archiving requests:", error);
      alert("Error: " + error.message); 
      setShowBulkArchiveModal(false);
    } finally {
      setArchiving(false);
    }
  };

  const handleRowClick = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleArchived = () => {
    fetchCompletedRequests();
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  // --- Statistics Calculation (Memoized) ---
  const stats = useMemo(() => {
    const now = new Date();
    return {
        total: filteredRequests.length,
        thisMonth: filteredRequests.filter(r => {
            if (!r.completedDate) return false;
            const completedDate = new Date(r.completedDate);
            return completedDate.getMonth() === now.getMonth() && 
                   completedDate.getFullYear() === now.getFullYear();
        }).length,
        form137: filteredRequests.filter(r => r.documentType && r.documentType.includes('Form 137')).length,
        certificates: filteredRequests.filter(r => r.documentType && r.documentType.includes('Certificate')).length,
    };
  }, [filteredRequests]);

  const statCardsData = [
    { 
        title: "Total Completed", 
        value: stats.total, 
        icon: CheckCircle, 
        textColor: 'text-green-600 dark:text-green-400', 
        bgLight: 'bg-green-100',
    },
    { 
        title: "Requests This Month", 
        value: stats.thisMonth, 
        icon: Clock,
        textColor: 'text-yellow-600 dark:text-yellow-400', 
        bgLight: 'bg-yellow-100',
    },
    { 
        title: "Form 137", 
        value: stats.form137, 
        icon: FileText, 
        textColor: 'text-blue-600 dark:text-blue-400', 
        bgLight: 'bg-blue-100',
    },
    { 
        title: "Certificates", 
        value: stats.certificates, 
        icon: Package,
        textColor: 'text-purple-600 dark:text-purple-400', 
        bgLight: 'bg-purple-100',
    },
  ];

  // --- Render Loading/Error States ---
  if (loading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 text-gray-500 dark:text-gray-400 animate-spin">⏳</div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">Loading completed requests...</p>
        </div>
      </div>
    );
  }

  if (error && !requests.length) { 
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-0 flex items-center justify-center">
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
  
  const totalFilteredRequests = filteredRequests.length;
  const isAllSelected = totalFilteredRequests > 0 && selectedRequests.length === totalFilteredRequests;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-0 sm:p-0 font-sans">
      
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
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Completed Request History
        </h1>

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
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-300 dark:border-slate-600 p-4 mb-6 transition-all duration-300">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            
            <div className="flex flex-wrap gap-4">
              <select
                value={filters.documentType}
                onChange={(e) => handleFilterChange("documentType", e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
              >
                <option value="all">All Document Types</option>
                <option value="Form 137">Form 137</option>
                <option value="Good Moral Certificate">Good Moral Certificate</option>
                <option value="Certificate of Enrollment">Certificate of Enrollment</option>
                <option value="Diploma">Diploma</option>
              </select>

              <select
                value={filters.gradeLevel}
                onChange={(e) => handleFilterChange("gradeLevel", e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
              >
                <option value="all">All Grades</option>
                {[1,2,3,4,5,6].map(grade => (
                  <option key={grade} value={grade.toString()}>Grade {grade}</option>
                ))}
              </select>

              <select
                value={filters.dateRange}
                onChange={(e) => handleFilterChange("dateRange", e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="this-week">This Week</option>
                <option value="this-month">This Month</option>
                <option value="last-month">Last Month</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search by name, ID, document type, or purpose..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleExportClick}
                disabled={totalFilteredRequests === 0}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" /> Export PDF
              </button>

              <button
                onClick={handleBulkArchiveClick}
                disabled={selectedRequests.length === 0}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Archive className="w-4 h-4" /> Archive ({selectedRequests.length})
              </button>
            </div>
          </div>
        </div>

        <div className={`mt-0 rounded-2xl shadow-md border border-gray-300 dark:border-slate-600 overflow-visible ${animate ? "slide-up" : ""}`}>
          
          <div className="flex justify-between items-center px-4 py-3 bg-white dark:bg-slate-800 rounded-t-2xl border-b border-gray-300 dark:border-slate-600">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {totalFilteredRequests > 0 ? (
                <>
                  Showing
                  <span className="font-bold text-gray-800 dark:text-white mx-1">
                    {totalFilteredRequests}
                  </span>
                  {` Completed Request${totalFilteredRequests > 1 ? 's' : ''}`}
                </>
              ) : (
                'No Completed Request Found'
              )}
            </span>
            <div className="h-6"></div> 
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[1200px] w-full border-collapse relative z-10">
              
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
                  <th className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white">Document Type</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white">Purpose</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white">Request Date</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white">Completed Date</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white">Pickup Date</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white text-center">Status</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {totalFilteredRequests > 0 ? (
                  filteredRequests.map((request, index) => (
                    <tr
                      key={request.id}
                      className={`transition-all duration-300
                        ${index !== totalFilteredRequests - 1 ? "border-b border-gray-400 dark:border-slate-600" : ""}
                        hover:bg-gray-50 dark:hover:bg-slate-700
                        ${selectedRequests.includes(request.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                      `}
                    >
                      <td className="px-4 py-3 w-10" onClick={(e) => e.stopPropagation()}>
                        <input
                            type="checkbox"
                            checked={selectedRequests.includes(request.id)}
                            onChange={() => handleSelectRequest(request.id)}
                            className="rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 w-4 h-4 cursor-pointer bg-white dark:bg-gray-700"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-white font-medium">
                        {request.studentName || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{request.studentId || "N/A"}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{request.documentType || "N/A"}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{request.requestPurpose || "N/A"}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{request.requestDate || "N/A"}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{request.completedDate || "N/A"}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{request.pickupDate || "N/A"}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-300 text-black">
                          {request.status || "Completed"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center relative" onClick={(e) => e.stopPropagation()}>
                        <div className="relative flex flex-col items-center group">
                          <button
                            className="inline-flex items-center gap-2 border border-gray-400 text-black dark:text-white px-3 py-1.5 rounded-md text-sm font-semibold bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 transition cursor-pointer"
                            onClick={() => handleRowClick(request)}
                          >
                            <Eye className="w-4 h-4" /> View
                          </button>
                          <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-medium rounded-md px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-[9999]">
                            View Details
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      No completed document requests found matching the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <CompletedRequestInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        request={selectedRequest}
        onArchived={handleArchived}
      />

      <BulkArchiveModal
        isOpen={showBulkArchiveModal}
        onClose={() => setShowBulkArchiveModal(false)}
        onConfirm={handleBulkArchiveConfirm}
        selectedCount={selectedRequests.length}
        archiving={archiving}
      />

      <ExportConfirmationModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onConfirm={handleExportConfirm}
        recordCount={totalFilteredRequests}
        exporting={exporting}
      />

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

export default CompletedRequestHistory;