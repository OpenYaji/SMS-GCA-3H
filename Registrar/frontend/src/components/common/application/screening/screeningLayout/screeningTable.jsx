import React, { useState, useEffect, useMemo, useRef } from "react";
import { FileCheck } from "lucide-react";
import ScreeningModal from "../screeningModal/screeningModal";
import { HOST_IP } from "../../../../../../config";
import SuccessToast from "../../../../ui/SuccessToast";

const ScreeningTable = ({ filterOptions = {}, onValidated }) => {
    // --- UI STATE ---
    const [toast, setToast] = useState({ message: '', type: 'success', isVisible: false });
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [animate, setAnimate] = useState(false);
    // New state to manage API processing/loading state in the modal
    const [isProcessing, setIsProcessing] = useState(false);

    // --- DATA STATES ---
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const prevDataRef = useRef(null); // Ref for flicker fix

    // --- API CONFIG ---
    const API_BASE = `http://${HOST_IP}/SMS-GCA-3H/Registrar/backend/api/applicants`;

    // --- TOAST HANDLERS ---
    const showToast = (message, type = 'success') => {
        setToast({ message, type, isVisible: true });
    };

    const closeToast = () => {
        setToast((t) => ({ ...t, isVisible: false }));
    };

    // --- UTILITY FUNCTIONS ---
    // Kept getColorClass 
    const getColorClass = (color) => {
        const map = {
            green: "bg-green-400 text-black dark:text-white dark:bg-green-600",
            yellow: "bg-yellow-300 text-black dark:text-black dark:bg-yellow-400",
            red: "bg-red-500 text-white dark:bg-red-600",
            blue: "bg-blue-400 text-black dark:text-white dark:bg-blue-600",
            indigo: "bg-indigo-400 text-black dark:text-white dark:bg-indigo-600",
        };
        return map[color] || map.yellow;
    };

    // Kept getRequiredDocuments
    const getRequiredDocuments = (type) => {
        if (!type) return [];
        const t = type.toLowerCase();
        if (t.includes("new"))
            return [
                "Birth Certificate",
                "Report Card",
                "Good Moral Certificate",
                "Certificate of Completion",
                "Form 137",
            ];
        if (t.includes("old")) return ["Report Card"];
        if (t.includes("transf"))
            return [
                "Good Moral Certificate",
                "Birth Certificate",
                "Certificate of Completion",
                "Form 137",
            ];
        if (t.includes("return")) return ["Report Card"];
        return [];
    };

    // --- DATA FETCHING (Polling) ---
    const fetchApplicants = async () => {
        try {
            const res = await fetch(`${API_BASE}/getScreeningApplicants.php`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();

            if (data.success) {
                let newData = data.data;

                if (Array.isArray(newData)) {
                    // Sort data for consistent array order
                    newData.sort((a, b) => (a.id || 0) - (b.id || 0));
                }

                // Only update state if data has truly changed (Flicker Fix)
                if (JSON.stringify(prevDataRef.current) !== JSON.stringify(newData)) {
                    setApplicants(newData);
                    prevDataRef.current = newData;
                }
                setError(null);
            } else {
                setApplicants([]);
                setError(data.message || "No screening applicants found.");
            }
        } catch (err) {
            if (!prevDataRef.current) {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    // --- LIFECYCLE HOOKS ---
    useEffect(() => {
        fetchApplicants();
        // POLLING: Calls fetchApplicants every 4 seconds
        const interval = setInterval(fetchApplicants, 4000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => setAnimate(true), []);

    // --- VALIDATION HANDLER (Optimized for instant row removal) ---
    const handleValidateApplicant = async (applicantData) => {
        const applicantId = applicantData.id;

        // --- 1. SET PROCESSING STATE ---
        setIsProcessing(true);

        try {

            const res = await fetch(`${API_BASE}/validateApplicant.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    applicantId: applicantId,
                    paymentMode: applicantData.paymentMode,
                    downPayment: applicantData.downPayment,
                    notes: applicantData.notes
                }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Server returned status ${res.status}: ${errorText.substring(0, 100)}...`);
            }

            const result = await res.json();

            if (!result.success) {
                throw new Error(result.message || "Validation failed on server.");
            }

            // --- SUCCESS LOGIC FOR INSTANT REMOVAL START ---

            const toastMessage = result.message;

            // 2. DISMISS MODAL IMMEDIATELY
            setSelectedApplicant(null);
            showToast(toastMessage, 'success');

            // 3. ROW REMOVAL (INSTANT FILTER)
            setApplicants((prev) => prev.filter((a) => a.id !== applicantId));

            onValidated?.(result.data);

            // --- SUCCESS LOGIC END ---
        } catch (err) {
            // Error handling
            console.error("Error validating applicant:", err);
            showToast(`Error validating applicant: ${err.message}`, 'error');
        } finally {
            // --- 4. RESET PROCESSING STATE ---
            setIsProcessing(false);
        }
    };

    // --- FILTERING LOGIC ---
    const filteredApplicants = useMemo(() => {
        const { documentStatus, studentType } = filterOptions || {};
        return applicants.filter((a) => {
            const requiredDocs = getRequiredDocuments(a.EnrolleeType);
            const submittedDocs = a.documents || [];
            
            // Calculation needed to support the filter:
            const totalDocs = requiredDocs.length;
            const receivedCount = submittedDocs.filter((doc) =>
                requiredDocs.includes(doc)
            ).length;

            let docStatus = "";
            if (receivedCount === totalDocs && totalDocs > 0) docStatus = "All Received";
            else if (receivedCount === 0) docStatus = "Missing";
            else docStatus = `${totalDocs - receivedCount} Requested`;

            if (
                documentStatus &&
                documentStatus !== "All Status" &&
                docStatus !== documentStatus
            )
                return false;
            
            if (studentType && studentType !== "All Types" && a.EnrolleeType !== studentType)
                return false;
            
            return true;
        });
    }, [applicants, filterOptions]);

    // --- CONDITIONAL RENDERING ---
    if (loading) return <p className="text-center mt-5">Loading screening applicants...</p>;
    if (error && filteredApplicants.length === 0) return <p className="text-center mt-5 text-red-500">{error}</p>;

    const totalApplicants = filteredApplicants.length;

    // --- MAIN RENDER ---
    return (
        <>
            {/* Toast Notification */}
            <SuccessToast
                isVisible={toast.isVisible}
                message={toast.message}
                type={toast.type}
                onClose={closeToast}
            />

            {/* Custom style for slide-up animation */}
            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .slide-up { animation: slideUp 0.6s ease-out; }
            `}</style>

            {/* Main Table Container */}
            <div
                className={`mt-5 rounded-2xl shadow-md border border-gray-300 dark:border-slate-600 overflow-visible ${animate ? "slide-up" : ""}`}
            >

                {/* Header Bar */}
                <div className="flex justify-between items-center px-4 py-3 bg-white dark:bg-slate-800 rounded-t-2xl border-b border-gray-300 dark:border-slate-600">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        {totalApplicants > 0 ? (
                            <>
                                Total Applicants:
                                <span className="font-bold text-gray-800 dark:text-white mx-1">
                                    {totalApplicants}
                                </span>
                            </>
                        ) : (
                            'No Applicant Found'
                        )}
                    </span>
                </div>

                <div className="overflow-x-auto">
                    {/* TABLE STRUCTURE */}
                    <table className="min-w-[700px] w-full border-collapse relative z-10">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-slate-700 text-left border-b border-gray-400 dark:border-slate-500">
                                {[
                                    "Applicant Name",
                                    "Student Type",
                                    "Grade Level", // ADDED BACK
                                    "Required Documents",
                                    "Actions",
                                ].map((title) => (
                                    <th
                                        key={title}
                                        className={`px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white ${
                                            // Only Actions is centered
                                            title === "Actions" ? "text-center" : "text-left"
                                        } ${title === "Required Documents" ? "max-w-[200px] break-words" : ""}`}
                                    >
                                        {title}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {/* Conditional Rendering of Rows or "No Applicants" Message */}
                            {totalApplicants > 0 ? (
                                filteredApplicants.map((a, index) => {
                                    // Document Status Calculation (needed for the filter, but not displayed)
                                    const requiredDocs = getRequiredDocuments(a.EnrolleeType);
                                    
                                    return (
                                        <tr
                                            key={a.id}
                                            className={`
                                                ${index !== totalApplicants - 1 ? "border-b border-gray-400 dark:border-slate-600" : ""}
                                                hover:bg-gray-50 dark:hover:bg-slate-700
                                            `}
                                        >
                                            <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-white">
                                                {`${a.StudentLastName}, ${a.StudentFirstName} ${a.StudentMiddleName}`}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                                {a.EnrolleeType}
                                            </td>
                                            {/* Grade Level Column */}
                                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                                {a.grade || "N/A"}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 break-words max-w-[200px]">
                                                {requiredDocs.join(", ")}
                                            </td>
                                            <td className="px-4 py-3 text-center relative">
                                                <div className="relative flex flex-col items-center gap-2 group">
                                                    <button
                                                        onClick={() => setSelectedApplicant(a)}
                                                        // Disable the button if any row is currently processing
                                                        disabled={isProcessing}
                                                        className="inline-flex items-center gap-2 border border-gray-400 text-sm text-black dark:text-white px-3 py-1.5 rounded-md bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <FileCheck className="w-4 h-4" />
                                                        Screen
                                                    </button>
                                                    <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-medium rounded-md px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-[9999]">
                                                        Screen applicant details
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    {/* colSpan updated from 4 to 5 (4 original columns) */}
                                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                        No applicants found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedApplicant && (
                <ScreeningModal
                    key={selectedApplicant.id}
                    applicant={selectedApplicant}
                    onClose={() => setSelectedApplicant(null)}
                    onValidate={handleValidateApplicant}
                    isProcessing={isProcessing}
                />
            )}
        </>
    );
};

export default ScreeningTable;