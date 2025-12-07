import React, { useState, useEffect, useRef } from "react";
import { Eye } from "lucide-react";
import InboxView from "../inboxModal/inboxView";
import { HOST_IP } from "../../../../../../config";
import SuccessToast from "../../../../ui/SuccessToast";
// Import the reusable Pagination component
import Pagination from "../../../../ui/Pagination"; 

const InboxTable = ({ filtersState = {}, onProceedToScreening }) => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
    // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  // **FIXED VALUE**: Set the number of items per page to 10
  const itemsPerPage = 10; 
  // REMOVED: itemsPerPage state and setItemsPerPage handler

  // Toast state
  const [toast, setToast] = useState({ message: '', type: 'success', isVisible: false });

  const [animate, setAnimate] = useState(false);
  const prevDataRef = useRef(null);
  const [removingIds, setRemovingIds] = useState([]);


  const API_BASE = `http://${HOST_IP}/SMS-GCA-3H/Registrar/backend/api/applicants`;

  // Fetch applicants from backend
   const showToast = (message, type = 'success') => {
    setToast({ message, type, isVisible: true });
  };

  const closeToast = () => {
    setToast((t) => ({ ...t, isVisible: false }));
  };
  
  // Function to fetch applicant data (REAL API CALL)
  const fetchApplicants = async () => {
    try {
      const response = await fetch(`${API_BASE}/getApplicants.php`);
      if (!response.ok) throw new Error("Failed to fetch applicants");

      const result = await response.json();
      if (result.success) {
        const newData = result.data;
        if (JSON.stringify(prevDataRef.current) !== JSON.stringify(newData)) {
          setApplicants(newData);
          prevDataRef.current = newData;
                    setCurrentPage(1); 
        }
        setError(null);
      } else {
        throw new Error(result.message || "Failed to fetch applicants");
      }
    } catch (err) {
      setError(err.message);
      setApplicants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
     const interval = setInterval(fetchApplicants, 5000); 
    return () => clearInterval(interval); 
  }, []);

  useEffect(() => setAnimate(true), []);

  const handleProceedToScreening = async (applicant) => {
    try {
      setRemovingIds((prev) => [...prev, applicant.id]);

      const response = await fetch(`${API_BASE}/updateStage.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicantId: applicant.id }),
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.message || "Update failed");
      showToast(`Applicant ${applicant.StudentLastName} successfully moved to Screening.`, "success");
      setTimeout(() => {
        setApplicants((prev) => prev.filter((a) => a.id !== applicant.id));
        setRemovingIds((prev) => prev.filter((id) => id !== applicant.id));
      }, 300);

      if (onProceedToScreening) onProceedToScreening(applicant);
    } catch (err) {
setRemovingIds((prev) => prev.filter((id) => id !== applicant.id)); // Cancel animation on error
      showToast(`Error updating stage: ${err.message}`, "error"); 
    }
  };

  // --- Filtered applicants ---
   // Handle successful rejection from the modal
  const handleRejectSuccess = (applicant) => {
    setRemovingIds((prev) => [...prev, applicant.id]);

    // Note: Toast is already triggered inside InboxView for rejection

    // Remove the applicant from the list after animation delay
    setTimeout(() => {
      setApplicants((prev) => prev.filter((a) => a.id !== applicant.id));
      setRemovingIds((prev) => prev.filter((id) => id !== applicant.id));
    }, 300);
  };

  const filteredApplicants = applicants.filter((a) => {
    const studentTypeFilter = filtersState["Student Type"] || "All Types";
    const dateFilter = filtersState["Date Submitted"] || "All Dates";
    const gradeFilter = filtersState["Grade Level"] || "All Grades";

    let match = true;
    if (studentTypeFilter !== "All Types") match = match && a.studentType === studentTypeFilter;
    if (gradeFilter !== "All Grades") match = match && a.grade === gradeFilter;
    if (dateFilter !== "All Dates") {
      const applicantDate = new Date(a.created_at);
      const applicantMonthYear = `${applicantDate.toLocaleString('default', { month: 'long' })} ${applicantDate.getFullYear()}`;
      match = match && applicantMonthYear === dateFilter;
    }
    return match;
  });

  // --- PAGINATION CALCULATIONS ---
  const totalApplicants = filteredApplicants.length;
  // Calculation is now based on fixed itemsPerPage = 10
  const totalPages = Math.ceil(totalApplicants / itemsPerPage); 

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalApplicants);
  const currentApplicants = filteredApplicants.slice(startIndex, endIndex);

 // --- PAGINATION HANDLERS ---
  // 1. Handle page change from the Pagination component
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  // 2. Auto-adjust current page if the total data size shrinks (UNCHANGED)
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (currentPage > totalPages && totalPages === 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);


  // --- START: Render the main structure ---
  return (
    <div>
       {/* Success/Error Toast Notification (UNCHANGED) */}
      <SuccessToast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={closeToast}
      />

      {/* Custom style for slide-up animation (UNCHANGED) */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .slide-up { animation: slideUp 0.6s ease-out; }
      `}</style>

      {/* Conditional rendering for Loading and Error States (UNCHANGED) */}
      {loading && <p className="text-center mt-5">Loading applicants...</p>}
      {error && !loading && <p className="text-center mt-5 text-red-500">Error: {error}</p>}

      {/* Main Table Container */}
      {!loading && !error && (
        <div className={`mt-5 rounded-2xl shadow-md border border-gray-300 dark:border-slate-600 overflow-visible ${animate ? "slide-up" : ""}`}>
          
          {/* Display Counter and PAGINATION (Header Bar) */}
          <div className="flex justify-between items-center px-4 py-3 bg-white dark:bg-slate-800 rounded-t-2xl border-b border-gray-300 dark:border-slate-600">
            {/* Left Side: Display Counter (Showing X to Y of Z Applicants) */}
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {totalApplicants > 0 ? (
                <>
                  Showing
                  <span className="font-bold text-gray-800 dark:text-white mx-1">
                    {endIndex}
                  </span>
                  of
                  <span className="font-bold text-gray-800 dark:text-white mx-1">
                    {totalApplicants}
                  </span>
                  {` Applicant${totalApplicants > 1 ? 's' : ''}`}
                </>
              ) : (
                'No Applicant Found'
              )}
            </span>

            {/* Right Side: Pagination Controls */}
            {/* Uses totalPages, currentPage, and handlePageChange props */}
            <Pagination
              totalPages={totalPages} 
              currentPage={currentPage}
              handlePageChange={handlePageChange}
            />

          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[700px] w-full border-collapse relative z-10">
              <thead>
                {/* Column Headers (UNCHANGED) */}
                <tr className="bg-gray-100 dark:bg-slate-700 text-left border-b border-gray-400 dark:border-slate-500">
                  <th className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white">Applicant Name</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white">Student Type</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white">Grade Level</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white">Date Submitted</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white text-center">Status</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white text-center">Actions</th>
                </tr>
               </thead>

              {/* Table Body (Rows) */}
              <tbody>
                {currentApplicants.length > 0 ? (
                  currentApplicants.map((applicant, index) => (
                    <tr
                      key={applicant.id}
                      className={`transition-all duration-300
                        ${index !== currentApplicants.length - 1 ? "border-b border-gray-400 dark:border-slate-600" : ""}
                        ${removingIds.includes(applicant.id) ? "opacity-0" : "opacity-100"}
                        hover:bg-gray-50 dark:hover:bg-slate-700
                      `}
                    >
                      {/* ... (Table Data Cells - UNCHANGED) ... */}
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-white font-medium">
                        {applicant.StudentLastName} {applicant.StudentFirstName} {applicant.StudentMiddleName}.
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{applicant.EnrolleeType}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{applicant.grade}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{applicant.SubmissionDate}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-yellow-300 text-black">{applicant.ApplicationStatus}</span>
                      </td>
                      <td className="px-4 py-3 text-center relative">
                        <div className="relative flex flex-col items-center gap-2 group">
                          <button
                            className="inline-flex items-center gap-2 border border-gray-400 text-black dark:text-white px-3 py-1.5 rounded-md text-sm font-semibold bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 transition cursor-pointer"
                            onClick={() => setSelectedApplicant(applicant)}
                          >
                            <Eye className="w-4 h-4" /> View
                          </button>
                          <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-medium rounded-md px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-[9999]">
                            View applicant details
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      No applicants found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* REMOVED PAGINATION HERE IN THE FOOTER */}
        </div>
   )}
          {/* Inbox View Modal (UNCHANGED) */}
      {selectedApplicant && (
        <InboxView
          applicant={selectedApplicant}
          onClose={() => setSelectedApplicant(null)}
          onProceedToScreening={handleProceedToScreening}
          onRejectSuccess={handleRejectSuccess}
          onShowToast={showToast} 
        />
      )}
    </div>
  );
};

export default InboxTable;
