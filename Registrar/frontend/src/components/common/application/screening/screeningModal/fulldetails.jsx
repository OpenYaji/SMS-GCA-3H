// import React, { useState, useEffect, useCallback } from "react";

// // Adjusted Increase to ensure the Full Payment Price (after 5% discount) yields the required ₱500 profit margin over the original total fee.
// const GRADE_1_TARGET_BASE_FEE = 20000; // New base fee for Grade 1 (Tuition + Reg + Misc)
// const LATE_PAYMENT_INTEREST_RATE = 0.02;
// const FLEX_INTEREST_RATE = 0.07; // FIXED 7% Interest for Flex DP mode

// const ScreeningModal = ({ applicant, onClose, onValidate, isProcessing }) => {
//     const [closing, setClosing] = useState(false);
//     const [isVisible, setIsVisible] = useState(true);

//     // Payment states (UPDATED)
//     const [paymentMode, setPaymentMode] = useState("full_discount"); // Changed default to 'full_discount'
//     const [downPayment, setDownPayment] = useState(0);
//     const [feeStructure, setFeeStructure] = useState(null);
//     const [totalFeeWithInterest, setTotalFeeWithInterest] = useState(0); // Added
//     const [flexInterestRate, setFlexInterestRate] = useState(0); // Added

//     // Helper function to display field values or a dash if missing
//     const fieldValue = (value) => {
//         if (value === null || value === undefined) return "—";
//         // Round numbers to the nearest whole number for general display clarity
//         if (typeof value === "number") return Math.round(value).toLocaleString();
//         if (typeof value === "string" && value.trim() !== "") return value;
//         return "—";
//     };

//     // --- BUSINESS LOGIC FOR FEES & DISCOUNTS (UPDATED) ---
//     const getFeeStructure = useCallback((grade) => {
//         const feeTable = {
//             'Nursery': { registration: 1500, miscellaneous: 3000, tuition: 10000 },
//             'Kinder 1': { registration: 1500, miscellaneous: 3000, tuition: 10000 },
//             'Kinder 2': { registration: 1500, miscellaneous: 3000, tuition: 10000 },
//             'Grade 1': { registration: 2000, miscellaneous: 4500, tuition: 12000 },
//             'Grade 2': { registration: 2000, miscellaneous: 4500, tuition: 12000 },
//             'Grade 3': { registration: 2000, miscellaneous: 4500, tuition: 12000 },
//             'Grade 4': { registration: 2000, miscellaneous: 5000, tuition: 13000 },
//             'Grade 5': { registration: 2000, miscellaneous: 5000, tuition: 13000 },
//             'Grade 6': { registration: 2000, miscellaneous: 5000, tuition: 13000 }
//         };

//         const baseFees = feeTable[grade] || feeTable['Grade 1'];

//         // Minimum DP is Reg + Misc Fees
//         const minDownPayment = baseFees.registration + baseFees.miscellaneous;

//         const grade1OriginalTotal = feeTable['Grade 1'].registration + feeTable['Grade 1'].miscellaneous + feeTable['Grade 1'].tuition;
//         // Calculate the difference required to hit the target base fee for all grades
//         const requiredIncrease = GRADE_1_TARGET_BASE_FEE - grade1OriginalTotal;

//         // Apply the same proportional increase to the tuition for the current grade
//         const adjustedTuition = baseFees.tuition + requiredIncrease;
//         const adjustedTotalBaseFee = baseFees.registration + baseFees.miscellaneous + adjustedTuition;


//         // 1. FULL PAYMENT WITH DISCOUNT (5% off entire Base Fee)
//         const fullDiscount = adjustedTotalBaseFee * 0.05;
//         const fullTotalFee = adjustedTotalBaseFee - fullDiscount;

//         // 2. QUARTERLY PAYMENT WITH INTEREST (3% interest on ADJUSTED Tuition)
//         const quarterlyInterest = adjustedTuition * 0.03;
//         const quarterlyTotalFee = adjustedTotalBaseFee + quarterlyInterest;

//         // 3. MONTHLY PAYMENT WITH INTEREST (5% interest on ADJUSTED Tuition)
//         const monthlyInterest = adjustedTuition * 0.05;
//         const monthlyTotalFee = adjustedTotalBaseFee + monthlyInterest;

//         // 4. FLEXIBLE PAYMENT WITH INTEREST (7% fixed interest on ADJUSTED Tuition)
//         const flexInterest = adjustedTuition * FLEX_INTEREST_RATE;
//         const flexTotalFee = adjustedTotalBaseFee + flexInterest;

//         const downPayments = {
//             full_discount: fullTotalFee, // Full DP is the whole amount
//             quarterly: minDownPayment,
//             monthly: minDownPayment,
//             flex_dp: 0, // Flex DP starts at 0 for user input
//         };

//         return {
//             ...baseFees,
//             adjustedTuition: adjustedTuition, // Tuition fee used for interest calculation
//             adjustedTotalBaseFee: adjustedTotalBaseFee, // Total base fee before discount/interest
//             minDownPayment: minDownPayment,

//             full: fullTotalFee, // Final fee for full payment
//             fullDiscount: fullDiscount, // Discount amount
//             downPayments: downPayments, // Default down payments for each mode

//             quarterlyTotalFee: quarterlyTotalFee,
//             quarterlyInterest: quarterlyInterest,
//             monthlyTotalFee: monthlyTotalFee,
//             monthlyInterest: monthlyInterest,

//             flexTotalFee: flexTotalFee,
//             flexInterest: flexInterest,
//         };
//     }, []);

//     // Function to calculate the final total fee based on selected payment mode
//     const calculateFinalTotalFee = useCallback((fees, mode) => {
//         let percentage = 0;
//         let totalFee = 0;

//         if (mode === 'full_discount') {
//             totalFee = fees.full;
//             percentage = 5; // 5% Discount
//         } else if (mode === 'quarterly') {
//             totalFee = fees.quarterlyTotalFee;
//             percentage = 3;
//         } else if (mode === 'monthly') {
//             totalFee = fees.monthlyTotalFee;
//             percentage = 5;
//         } else if (mode === 'flex_dp') {
//             totalFee = fees.flexTotalFee;
//             percentage = FLEX_INTEREST_RATE * 100;
//         }

//         // Set the clean percentage rate for display (Interest or Discount %)
//         setFlexInterestRate(Math.round(percentage));

//         return Math.round(totalFee * 100) / 100; // Round to 2 decimals for consistency
//     }, []);

//     // Handles setting the down payment based on mode change
//     const handlePaymentModeChange = useCallback((newMode) => {
//         setPaymentMode(newMode);
//         if (feeStructure) {
//             if (newMode === 'full_discount') {
//                 setDownPayment(feeStructure.full);
//             } else if (newMode === 'quarterly' || newMode === 'monthly') {
//                 setDownPayment(feeStructure.minDownPayment); // Fixed DP: Reg + Misc
//             } else if (newMode === 'flex_dp') {
//                 setDownPayment(0); // Start at 0 for user input in Flex mode
//             }
//         }
//     }, [feeStructure]);

//     // Initial load and dependency update
//     useEffect(() => {
//         if (applicant?.grade) {
//             const fees = getFeeStructure(applicant.grade);
//             setFeeStructure(fees);

//             const defaultMode = 'full_discount';
//             setPaymentMode(defaultMode);

//             const initialTotalFee = calculateFinalTotalFee(fees, defaultMode);
//             setTotalFeeWithInterest(initialTotalFee);
//             setDownPayment(fees.downPayments[defaultMode]);
//         }
//     }, [applicant, getFeeStructure, calculateFinalTotalFee]);

//     // Effect to recalculate total fee and reset DP based on payment mode
//     useEffect(() => {
//         if (feeStructure) {
//             const newTotalFee = calculateFinalTotalFee(feeStructure, paymentMode);
//             setTotalFeeWithInterest(newTotalFee);

//             // Re-set DP based on mode if not flexible
//             if(paymentMode === 'full_discount') {
//                 setDownPayment(feeStructure.full);
//             } else if (paymentMode === 'quarterly' || paymentMode === 'monthly') {
//                 // Ensure DP is set to minDP when switching to fixed modes, even if user typed a value in flex mode previously
//                 setDownPayment(feeStructure.minDownPayment);
//             }
//         }
//     }, [paymentMode, feeStructure, calculateFinalTotalFee]);

//     // Handle DP change only when in Flex mode
//     const handleDownPaymentChange = (e) => {
//         setDownPayment(parseFloat(e.target.value) || 0);
//     };


//     // Function to determine required documents based on enrollee type (Original code, untouched)
//     const getRequiredDocuments = (type) => {
//         if (!type) return ["No required documents specified."];
//         const t = type.toLowerCase();

//         if (t === "new student" || t === "new") {
//             return ["Birth Certificate", "Report Card", "Good Moral Certificate", "Certificate of Completion", "Form 137"];
//         } else if (t === "old student" || t === "old") {
//             return ["Report Card"];
//         } else if (t === "transferee" || t === "transfer" || t === "transferree") {
//             return ["Good Moral Certificate", "Birth Certificate", "Certificate of Completion", "Form 137"];
//         } else if (t === "returnee" || t === "return") {
//             return ["Report Card"];
//         } else {
//             return ["No required documents specified."];
//         }
//     };

//     // Calculate outstanding balance using the dynamically calculated total fee
//     const outstandingBalance = totalFeeWithInterest - downPayment; 

//     // Render nothing if applicant is null, modal is not visible, or fee structure is not ready
//     if (!applicant || !isVisible || !feeStructure) return null; 

//     // Manual closing function (Original code, untouched)
//     const handleClose = () => {
//         if (isProcessing) return; 

//         setClosing(true);
//         setTimeout(() => {
//             setIsVisible(false);
//             onClose(); 
//             setClosing(false);
//         }, 250);
//     };

//     // MODAL TRIGGERS VALIDATION (UPDATED)
//     const handleValidateClick = async () => {
//         if (isProcessing) return;

//         // Validation based on payment mode logic
//         if (paymentMode !== 'full_discount' && downPayment < feeStructure.minDownPayment) {
//             alert(`Down Payment must be at least ₱ ${feeStructure.minDownPayment.toLocaleString()} for installment plans.`);
//             return;
//         }
        
//         // Flex mode allows 0 down payment, so it only needs to be non-negative.
//         if (paymentMode === 'flex_dp' && downPayment < 0) {
//              alert(`Down Payment cannot be negative.`);
//             return;
//         }

//         if (onValidate) {
//             onValidate({
//                 ...applicant,
//                 paymentMode,
//                 downPayment: parseFloat(downPayment), 
//                 totalFee: totalFeeWithInterest, // New: Pass the final calculated fee
//                 outstandingBalance: outstandingBalance, // New: Pass the outstanding balance
//             });
//         }
//     };

//     // Logic for Installment Calculation (ADDED)
//     let installmentPeriod = 'N/A';
//     let installmentAmount = 0;
//     let installmentNote = '';
//     let remainingPaymentsCount = 0;

//     // Determine installment details based on mode
//     if (outstandingBalance > 0) {
//         if (paymentMode === 'quarterly') {
//             remainingPaymentsCount = 3;
//             installmentPeriod = `Quarterly (${remainingPaymentsCount} remaining payments)`;
//             installmentAmount = outstandingBalance / remainingPaymentsCount;
//             installmentNote = `Balance split over ${remainingPaymentsCount} quarters. (Includes 3% interest on tuition)`;
//         } else if (paymentMode === 'monthly') {
//             remainingPaymentsCount = 7;
//             installmentPeriod = `Monthly (${remainingPaymentsCount} remaining payments)`;
//             installmentAmount = outstandingBalance / remainingPaymentsCount;
//             installmentNote = `Balance split over ${remainingPaymentsCount} months. (Includes 5% interest on tuition)`;
//         } else if (paymentMode === 'flex_dp') {
//             remainingPaymentsCount = 8; // Fixed 8-month term for Flex
//             installmentPeriod = `Flex Installment (${remainingPaymentsCount} months)`;
//             installmentAmount = outstandingBalance / remainingPaymentsCount;
//             installmentNote = `Outstanding balance (includes ${flexInterestRate}% fixed interest on tuition) split over ${remainingPaymentsCount} monthly payments.`;
//         }
//         // Round installment amount for display
//         installmentAmount = Math.round(installmentAmount * 100) / 100;
//     }

//     // DP is only editable when in Flex mode
//     const isDPInputDisabled = isProcessing || (paymentMode !== 'flex_dp');


//     return (
//         <div
//             // Modal backdrop with closing animation
//             className={`fixed inset-0 bg-black/40 flex justify-center items-start z-50 overflow-auto pt-10 transition-opacity ${closing ? "opacity-0" : "opacity-100"
//                 }`}
//         >
//             <div className="bg-white dark:bg-slate-800 max-w-[1200px] w-[90%] rounded-lg shadow-md border border-gray-200 dark:border-slate-600 flex flex-col max-h-[95vh] overflow-y-auto animate-fade-in">
//                 {/* HEADER */}
//                 <div className="flex justify-between items-center bg-yellow-400 text-black dark:text-white px-6 py-4">
//                     <h2 className="text-lg font-semibold">
//                         Screening – {fieldValue(applicant.StudentLastName)}, {fieldValue(applicant.StudentFirstName)} {fieldValue(applicant.StudentMiddleName)}.
//                     </h2>
//                     {/* Disable close button while processing */}
//                     <span className={`text-2xl cursor-pointer ${isProcessing ? 'text-gray-500 cursor-not-allowed' : 'hover:text-gray-700 dark:hover:text-gray-300'}`} onClick={handleClose}>
//                         &times;
//                     </span>
//                 </div>

//                 {/* BODY */}
//                 <div className="flex flex-col p-6 space-y-3 text-black dark:text-white">
//                     {/* Student Info Grid (Original grid restored) */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         {/* Left Column */}
//                         <div className="space-y-1">
//                             <div>
//                                 <label className="block font-semibold text-sm mb-1">Student Name</label>
//                                 <p className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-slate-700 text-sm">
//                                     {fieldValue(`${applicant.StudentLastName}, ${applicant.StudentFirstName} ${applicant.StudentMiddleName}.`)}
//                                 </p>
//                             </div>
//                             <div>
//                                 <label className="block font-semibold text-sm mb-1">Birthdate</label>
//                                 <p className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-slate-700 text-sm">
//                                     {fieldValue(applicant.DateOfBirth)}
//                                 </p>
//                             </div>
//                             <div>
//                                 <label className="block font-semibold text-sm mb-1">Mother Tongue</label>
//                                 <p className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-slate-700 text-sm">
//                                     {fieldValue(applicant.motherTongue)}
//                                 </p>
//                             </div>
//                         </div>

//                         {/* Right Column */}
//                         <div className="space-y-1">
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="block font-semibold text-sm mb-1">Student Type</label>
//                                     <p className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-slate-700 text-sm">
//                                         {fieldValue(applicant.EnrolleeType)}
//                                     </p>
//                                 </div>
//                                 <div>
//                                     <label className="block font-semibold text-sm mb-1">Grade Level</label>
//                                     <p className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-slate-700 text-sm">
//                                         {fieldValue(applicant.grade)}
//                                     </p>
//                                 </div>
//                             </div>

//                             <div className="grid grid-cols-3 gap-4">
//                                 <div>
//                                     <label className="block font-semibold text-sm mb-1">Age</label>
//                                     <p className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-slate-700 text-sm">
//                                         {fieldValue(applicant.age)}
//                                     </p>
//                                 </div>
//                                 <div>
//                                     <label className="block font-semibold text-sm mb-1">Gender</label>
//                                     <p className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-slate-700 text-sm">
//                                         {fieldValue(applicant.Gender)}
//                                     </p>
//                                 </div>
//                                 <div>
//                                     <label className="block font-semibold text-sm mb-1">Birth Place</label>
//                                     <p className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-slate-700 text-sm">
//                                         {fieldValue(applicant.birthPlace)}
//                                     </p>
//                                 </div>
//                             </div>

//                             <div className="grid grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="block font-semibold text-sm mb-1">Nationality</label>
//                                     <p className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-slate-700 text-sm">
//                                         {fieldValue(applicant.Nationality)}
//                                     </p>
//                                 </div>
//                                 <div>
//                                     <label className="block font-semibold text-sm mb-1">Religion</label>
//                                     <p className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-slate-700 text-sm">
//                                         {fieldValue(applicant.religion)}
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Full Address */}
//                     <div className="w-full mt-4">
//                         <label className="block font-semibold text-sm mb-1">Full Address</label>
//                         <p className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-slate-700 text-sm w-full">
//                             {fieldValue(applicant.Address)}
//                         </p>
//                     </div>

//                     {/* PARENT/GUARDIAN */}
//                     <div className="space-y-2">
//                         <h3 className="text-sm font-semibold">Parent / Guardian Information</h3>

//                         <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
//                             {[
//                                 { label: "Guardian Name", value: `${fieldValue(applicant.GuardianFirstName)} ${fieldValue(applicant.GuardianLastName)}` },
//                                 { label: "Relationship", value: fieldValue(applicant.GuardianRelationship) },
//                                 { label: "Contact Number", value: fieldValue(applicant.GuardianContact) },
//                                 { label: "Email", value: fieldValue(applicant.GuardianEmail) },
//                             ].map((item, idx) => (
//                                 <div key={idx}>
//                                     <label className="block font-semibold text-sm mb-1">{item.label}</label>
//                                     <p className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-slate-700 text-sm">{item.value}</p>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* PAYMENT SECTION - UPDATED LOGIC */}
//                     {feeStructure && (
//                         <div className="border-t pt-4 mt-4">
//                             <h3 className="text-sm font-semibold mb-3">Payment Information</h3>

//                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                                 {/* Fee Breakdown (Detailed) */}
//                                 <div className="space-y-2 bg-gray-50 dark:bg-slate-700 p-4 rounded col-span-1">
//                                     <h4 className="font-semibold text-sm">Fee Breakdown ({applicant.grade})</h4>
//                                     <div className="space-y-1 text-sm">
//                                         <div className="flex justify-between">
//                                             <span>Registration Fee:</span>
//                                             <span>₱ {fieldValue(feeStructure.registration)}</span>
//                                         </div>
//                                         <div className="flex justify-between">
//                                             <span>Miscellaneous Fee:</span>
//                                             <span>₱ {fieldValue(feeStructure.miscellaneous)}</span>
//                                         </div>
//                                         <div className="flex justify-between">
//                                             <span>Tuition Fee (Installment Base):</span>
//                                             <span>₱ {fieldValue(feeStructure.adjustedTuition)}</span>
//                                         </div>

//                                         {/* --- DYNAMIC INTEREST/DISCOUNT LINE --- */}
//                                         <div className="flex justify-between border-t border-dashed pt-1 mt-2">
//                                             <span className={`font-semibold ${paymentMode === 'full_discount' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
//                                                 {paymentMode === 'full_discount' ? '5% Discount:' :
//                                                 paymentMode === 'quarterly' ? '3% Quarterly Interest:' :
//                                                 paymentMode === 'monthly' ? '5% Monthly Interest:' :
//                                                 paymentMode === 'flex_dp' ? `${flexInterestRate}% Flex Interest:` : 'Adjustment:'}
//                                             </span>
//                                             <span className={`font-semibold ${paymentMode === 'full_discount' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
//                                                 {paymentMode === 'full_discount' ? `- ₱ ${fieldValue(feeStructure.fullDiscount)}` :
//                                                 paymentMode === 'quarterly' ? `+ ₱ ${fieldValue(feeStructure.quarterlyInterest)}` :
//                                                 paymentMode === 'monthly' ? `+ ₱ ${fieldValue(feeStructure.monthlyInterest)}` :
//                                                 paymentMode === 'flex_dp' ? `+ ₱ ${fieldValue(feeStructure.flexInterest)}` : `—`}
//                                             </span>
//                                         </div>

//                                         <div className="flex justify-between border-t pt-1 mt-1 font-bold text-base">
//                                             <span>Total Fee (Final):</span>
//                                             <span className="text-xl text-blue-600 dark:text-blue-400">₱ {fieldValue(totalFeeWithInterest)}</span>
//                                         </div>
//                                     </div>
//                                     <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
//                                          Base Tuition: ₱ {feeStructure.tuition.toLocaleString()}
//                                     </p>
//                                     <p className="text-xs text-gray-500 dark:text-gray-400">
//                                          * Uniforms and books NOT included
//                                     </p>
//                                 </div>

//                                 {/* Payment Mode Selection and Down Payment Input */}
//                                 <div className="space-y-3 col-span-1">
//                                     <div>
//                                         <label className="block font-semibold text-sm mb-2">Payment Mode</label>
//                                         <select
//                                             value={paymentMode}
//                                             onChange={(e) => handlePaymentModeChange(e.target.value)}
//                                             disabled={isProcessing}
//                                             className="w-full border border-gray-400 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-sm disabled:bg-gray-200 dark:disabled:bg-slate-600"
//                                         >
//                                             <option value="full_discount">Full Payment (5% Discount)</option>
//                                             <option value="quarterly">Quarterly Installment (3% Int.)</option>
//                                             <option value="monthly">Monthly Installment (5% Int.)</option>
//                                             <option value="flex_dp">Flexible Down Payment ({flexInterestRate}% Fixed Int.)</option>
//                                         </select>
//                                     </div>

//                                     <div>
//                                         <label className="block font-semibold text-sm mb-2">Down Payment</label>
//                                         <input
//                                             type="number"
//                                             value={downPayment}
//                                             onChange={handleDownPaymentChange}
//                                             min={paymentMode === 'flex_dp' ? 0 : feeStructure.minDownPayment}
//                                             max={totalFeeWithInterest}
//                                             disabled={isDPInputDisabled}
//                                             className={`w-full border rounded px-3 py-2 text-sm disabled:bg-gray-200 dark:disabled:bg-slate-600
//                                                 ${isDPInputDisabled ? 'bg-gray-200 dark:bg-slate-700 border-gray-300' : 'bg-white dark:bg-slate-700 border-yellow-500 ring-1 ring-yellow-500'}`}
//                                         />
//                                         <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                                             {paymentMode === 'full_discount' ?
//                                                 `Full Payment Mode: Down Payment is the full fee.` :
//                                                 paymentMode === 'flex_dp' ?
//                                                 `Flexible Mode: Enter desired DP (Minimum: ₱ 0).` :
//                                                 `Fixed Mode: Minimum DP is ₱ ${fieldValue(feeStructure.minDownPayment)} (Reg + Misc Fees).`
//                                             }
//                                             {(paymentMode !== 'full_discount' && paymentMode !== 'flex_dp' && downPayment < feeStructure.minDownPayment) && (
//                                                 <span className="text-yellow-700 dark:text-yellow-400 font-bold block">
//                                                     * Warning: DP is less than minimum required (Reg+Misc Fee).
//                                                 </span>
//                                             )}
//                                         </p>
//                                     </div>

//                                     <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded space-y-2">
//                                         <div className="flex justify-between text-sm mb-1">
//                                             <span>Down Payment Received:</span>
//                                             <span className="font-bold text-xl">₱ {fieldValue(downPayment)}</span>
//                                         </div>
//                                         <div className="flex justify-between text-sm font-bold border-t pt-2">
//                                             <span>Outstanding Balance:</span>
//                                             <span className="text-2xl text-red-600 dark:text-red-400">₱ {fieldValue(outstandingBalance)}</span>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Calculated Balances Display & Installment Info */}
//                                 <div className="space-y-3 col-span-1">
//                                     {outstandingBalance > 0 && (
//                                             <div className="text-center bg-yellow-100 dark:bg-yellow-900 p-3 rounded">
//                                                 <p className="font-bold text-sm text-black dark:text-white">Estimated Installment Details</p>
//                                                 <p className="text-xs text-black dark:text-white">
//                                                     Payment Term: **{installmentPeriod}**
//                                                 </p>
//                                                 <p className="text-xl font-bold text-black dark:text-white">
//                                                     **₱ {fieldValue(installmentAmount)}** / payment
//                                                 </p>
//                                                 <p className="text-xs italic text-black dark:text-white">
//                                                     ({installmentNote})
//                                                 </p>
//                                                 <div className="mt-2 text-left p-1 border-t border-dashed">
//                                                     <p className="font-semibold text-sm text-black dark:text-white mb-1">Total Payments Remaining:</p>
//                                                     <p className="text-lg font-bold text-black dark:text-white">{remainingPaymentsCount} payments</p>
//                                                     <p className="text-red-600 dark:text-red-400 text-xs mt-2 font-bold">
//                                                         * Note: An additional {LATE_PAYMENT_INTEREST_RATE * 100}% Late Payment Interest is applied if installment is delayed.
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                         )}
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {/* Screening Section */}
//                     <div className="flex flex-col md:flex-row justify-between gap-6 mt-6 items-start"> 
//                         {/* Required Documents */}
//                         <div className="w-full md:w-1/2"> 
//                             <h3 className="text-sm font-semibold mb-2">Required Documents</h3>
//                             <div className="flex flex-col gap-2">
//                                 {getRequiredDocuments(applicant.EnrolleeType).map((doc, i) => {
//                                     const received = applicant.documents?.includes(doc);
//                                     return (
//                                         <div
//                                             key={i}
//                                             className="flex justify-between items-center border border-gray-400 dark:border-gray-600 rounded px-2.5 py-1.5 bg-gray-50 dark:bg-slate-700"
//                                         >
//                                             <span className={`text-sm font-medium ${received ? "" : "italic text-gray-400 dark:text-gray-300"}`}>
//                                                 {doc}
//                                             </span>
//                                             <span
//                                                 className={`px-3 py-1 rounded text-xs font-semibold ${received ? "w-20 bg-green-500 text-black" : "bg-yellow-400 text-black"
//                                                     }`}
//                                             >
//                                                 {received ? "Received" : "Requested"}
//                                             </span>
//                                         </div>
//                                     );
//                                 })}
//                             </div>
//                         </div>

//                         {/* Action Buttons */}
//                         <div className="w-full md:w-1/2 flex flex-col mt-auto items-end">
//                             {/* Invisible heading for alignment consistency with the documents section */}
//                             <h3 className="text-sm font-semibold mb-2 invisible">Actions</h3> 
//                             <div className="flex flex-col gap-2">
//                                 <button
//                                     onClick={handleValidateClick}
//                                     disabled={isProcessing} // <-- THIS DISABLES THE BUTTON
//                                     className={`w-[190px] px-3.5 py-1.5 rounded text-black font-semibold transition 
//                                         ${isProcessing 
//                                             ? "bg-gray-400 cursor-not-allowed" // Loading state
//                                             : "bg-green-600 hover:bg-green-700" // Ready state
//                                         }`}
//                                 >
//                                     {isProcessing ? 'Processing...' : 'Confirm and Proceed'}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Animation (kept for fade-in effect) */}
//             <style>
//                 {`
//                     @keyframes fade-in {
//                         from { opacity: 0; transform: translateY(-15px); }
//                         to { opacity: 1; transform: translateY(0); }
//                     }
//                     .animate-fade-in {
//                         animation: fade-in 0.25s ease;
//                     }
//                 `}
//             </style>
//         </div>
//     );
// };
// export default ScreeningModal;