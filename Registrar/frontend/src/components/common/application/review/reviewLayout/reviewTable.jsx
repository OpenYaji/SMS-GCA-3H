import React, { useState, useEffect, useRef } from "react";
import SectionAssignmentModal from './table/sectionAssignmentModal';
import Pagination from "../../../../ui/Pagination";
import SuccessToast from "../../../../ui/SuccessToast";
import EnrollmentConfirmationModal from "./table/EnrollmentConfirmationModal";
import EnrollmentSuccessModal from "./table/EnrollmentSuccessModal";
import { HOST_IP } from "../../../../../../config";

const BASE_API = `http://${HOST_IP}/SMS-GCA-3H/Registrar/backend/api/applicants`;

const ReviewTable = ({ statusUpdates = {}, triggerSectionUpdate = () => {} }) => {
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const prevDataRef = useRef(null);
    const [animate, setAnimate] = useState(false);

    // Enrollment modal states
    const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [pendingEnrollment, setPendingEnrollment] = useState(null);
    const [enrollmentResult, setEnrollmentResult] = useState(null);
 
    // Toast state
    const [toast, setToast] = useState({
        isVisible: false,
        message: '',
        type: 'success',
    });

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
   
    // Section assignment modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [applicantToEdit, setApplicantToEdit] = useState(null);
    const [sectionOptions, setSectionOptions] = useState([]);
   
    // Open section assignment modal
    const handleAssignSectionClick = (applicant) => {
        setApplicantToEdit(applicant);
        setIsModalOpen(true);
    };
   
    // Fetch sections by grade level
    useEffect(() => {
        if (applicantToEdit?.grade) {
            fetch(`http://${HOST_IP}/SMS-GCA-3H/Registrar/backend/api/sections/getByGrade.php?grade=${applicantToEdit.grade}`)
                .then((res) => res.json())
                .then((data) => setSectionOptions(data))
                .catch((err) => console.error(err));
        } else {
            setSectionOptions([]);
        }
    }, [applicantToEdit]);

    // Close section assignment modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setApplicantToEdit(null);
    };

    // Fetch applicants
    const fetchApplicants = async () => {
        try {
            const response = await fetch(`${BASE_API}/getValidatedApplicants.php`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const result = await response.json();

            if (result.success) {
                const newData = result.data.map(app => ({ ...app }));
               
                if (JSON.stringify(prevDataRef.current) !== JSON.stringify(newData)) {
                    setApplicants(newData);
                    prevDataRef.current = newData;
                    setCurrentPage(1); 
                }
                setError(null);
            } else {
                throw new Error(result.message || "Failed to fetch validated applicants");
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
        const interval = setInterval(fetchApplicants, 3000);
        return () => clearInterval(interval);
    }, []);

    // Apply slide-up animation effect once on mount
    useEffect(() => setAnimate(true), []);

    // Pagination logic
    const totalPages = Math.ceil(applicants.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, applicants.length);
    const currentApplicants = applicants.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Auto-adjust current page if the total data size shrinks
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        } else if (currentPage > totalPages && totalPages === 0) {
            setCurrentPage(1);
        }
    }, [totalPages, currentPage]);


    // Single section assignment - Step 1: Show confirmation modal
    const handleSectionSave = (applicantId, sectionId) => {
        const applicant = applicants.find(a => a.id === applicantId);
       
        setPendingEnrollment({
            applicantId,
            sectionId,
            name: `${applicant.StudentFirstName} ${applicant.StudentLastName}`,
            section: sectionOptions.find(s => s.SectionID === sectionId)?.SectionName || 'Selected Section'
        });

        handleCloseModal();
        setIsEnrollmentModalOpen(true);
    };

    // Single section assignment - Step 2: Finalize enrollment
    const finalizeEnrollment = async () => {
        try {
            const response = await fetch(`${BASE_API}/assignSection.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    applicantId: pendingEnrollment.applicantId,
                    sectionId: pendingEnrollment.sectionId
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseText = await response.text();
            let result;

            try {
                result = JSON.parse(responseText);
            } catch (parseError) {
                console.error("Raw response:", responseText);
                throw new Error("Server returned invalid JSON. Check console for details.");
            }

            if (!result.success) {
                throw new Error(result.message || "Unknown error during enrollment.");
            }

            setEnrollmentResult(result.data);
            setIsEnrollmentModalOpen(false);
            setIsSuccessModalOpen(true);

            await fetchApplicants();
            triggerSectionUpdate();

        } catch (err) {
            console.error("Enrollment error:", err);
            setToast({
                isVisible: true,
                message: `❌ Failed to enroll: ${err.message}`,
                type: "error"
            });
            setIsEnrollmentModalOpen(false);
            setPendingEnrollment(null);
        }
    };

    // Handle success modal close
    const handleSuccessModalClose = () => {
        setIsSuccessModalOpen(false);
        setPendingEnrollment(null);
        setEnrollmentResult(null);
       
        setToast({
            isVisible: true,
            message: "✅ Student enrolled successfully!",
            type: "success"
        });
    };

    // Pagging display logic 
    const totalApplicants = applicants.length;
    const displayCountText = totalApplicants > 0 ? (
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
    );
           
    return (
        <>
            <SuccessToast
                isVisible={toast.isVisible}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, isVisible: false })}
            />

            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .slide-up { animation: slideUp 0.6s ease-out; }
            `}</style>

            {loading && <p className="text-center mt-5">Loading validated applicants...</p>}
            {error && !loading && <p className="text-center mt-5 text-red-500">Error: {error}</p>}
            
            {/* START: Main Table Container - Only hide if loading or error */}
            {!loading && !error && (
                <div className={`mt-5 rounded-2xl shadow-md border border-gray-300 dark:border-slate-600 overflow-visible ${animate ? "slide-up" : ""}`}>
                   
                    {/* Header Bar with Count and Pagination */}
                    <div className="flex justify-between items-center px-4 py-3 bg-white dark:bg-slate-800 rounded-t-2xl border-b border-gray-300 dark:border-slate-600">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {displayCountText}
                        </span>
                        <Pagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            handlePageChange={handlePageChange}
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-[800px] w-full border-collapse relative z-10">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-slate-700 text-left border-b border-gray-400 dark:border-slate-500">
                                    <th className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white">Applicant Name</th>
                                    <th className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white">Payment Method</th>
                                    <th className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white">Student Type</th>
                                    <th className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white">Grade Level</th>
                                    <th className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white text-center">Status</th> 
                                    <th className="px-4 py-3 text-sm font-semibold text-center text-gray-800 dark:text-white">Section Assignment</th>
                                </tr>
                            </thead>

                            <tbody>
                                {currentApplicants.length > 0 ? (
                                    currentApplicants.map((a, index) => ( 
                                        <tr
                                            key={a.id}
                                            className={`transition-colors duration-150
                                                ${index !== currentApplicants.length - 1 ? "border-b border-gray-400 dark:border-slate-600" : ""}
                                                hover:bg-gray-50 dark:hover:bg-slate-700`}
                                        >
                                            <td className="px-4 py-3 text-sm text-gray-800 dark:text-white font-medium">
                                                {a.StudentLastName}, {a.StudentFirstName} {a.StudentMiddleName || ""}
                                            </td>

                                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                                {a.paymentMethod || "—"}
                                            </td>

                                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                                {a.EnrolleeType || "—"}
                                            </td>
                                               
                                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                                {a.grade || "—"}
                                            </td>

                                            <td className="px-4 py-3 text-center">
                                                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-500 text-white dark:bg-blue-600">
                                                    {a.ApplicationStatus || "—"}
                                                </span>
                                            </td>

                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 text-center">
                                                {a.section ? (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <span className="font-semibold text-blue-700 dark:text-blue-300">
                                                            {a.section}
                                                        </span>
                                                        <button
                                                            onClick={() => handleAssignSectionClick(a)}
                                                            className="text-xs px-2 py-0.5 rounded-md border border-gray-400 text-gray-600 hover:bg-gray-100 transition dark:text-gray-300 dark:border-slate-600 dark:hover:bg-slate-600"
                                                        >
                                                            Change
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleAssignSectionClick(a)}
                                                        className="w-auto text-xs px-3 py-1 rounded-full bg-green-500 text-white hover:bg-green-600 transition shadow-md"
                                                    >
                                                        Assign Section
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    /* Show this row if applicants.length === 0 */
                                    <tr>
                                        <td colSpan="6" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                            No validated applicants found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {/* END: Main Table Container */}
           
            {/* Section Assignment Modal */}
            <SectionAssignmentModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                applicant={applicantToEdit}
                onSave={handleSectionSave}
                options={sectionOptions}
            />

            {/* Enrollment Confirmation Modal */}
            <EnrollmentConfirmationModal
                student={pendingEnrollment}
                isOpen={isEnrollmentModalOpen}
                onClose={() => {
                    setIsEnrollmentModalOpen(false);
                    setPendingEnrollment(null);
                }}
                onConfirm={finalizeEnrollment}
            />

            {/* Enrollment Success Modal */}
            <EnrollmentSuccessModal
                isOpen={isSuccessModalOpen}
                onClose={handleSuccessModalClose}
                enrollmentData={enrollmentResult}
            />

        </>
    );
};

export default ReviewTable;