// import React, { useState, useEffect, useCallback } from "react";

// // Adjusted Increase to ensure the Full Payment Price (after 5% discount) yields the required ₱500 profit margin over the original total fee.
// const GRADE_1_TARGET_BASE_FEE = 20000;
// const LATE_PAYMENT_INTEREST_RATE = 0.02; 
// const FLEX_INTEREST_RATE = 0.07; // FIXED 7% Interest for Flex DP mode

// const ScreeningModal = ({ applicant, onClose, onValidate, isProcessing }) => {
//     const [closing, setClosing] = useState(false);
//     const [isVisible, setIsVisible] = useState(true);

//     // Payment states
//     const [paymentMode, setPaymentMode] = useState("full_discount");
//     const [downPayment, setDownPayment] = useState(0);
//     const [feeStructure, setFeeStructure] = useState(null);
//     const [totalFeeWithInterest, setTotalFeeWithInterest] = useState(0);
    
//     // flexInterestRate state now stores the clean percentage value (7)
//     const [flexInterestRate, setFlexInterestRate] = useState(0); 
    
//     // Helper function to display field values or a dash if missing
//     const fieldValue = (value) => {
//         if (value === null || value === undefined) return "—";
//         if (typeof value === "number") return value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }); 
//         if (typeof value === "string" && value.trim() !== "") return value;
//         return "—";
//     };


//     // --- BUSINESS LOGIC FOR FEES & DISCOUNTS ---
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
        
//         const minDownPayment = baseFees.registration + baseFees.miscellaneous;
        
//         const grade1OriginalTotal = feeTable['Grade 1'].registration + feeTable['Grade 1'].miscellaneous + feeTable['Grade 1'].tuition;
//         const requiredIncrease = GRADE_1_TARGET_BASE_FEE - grade1OriginalTotal;
        
//         const adjustedTuition = baseFees.tuition + requiredIncrease;
//         const adjustedTotalBaseFee = baseFees.registration + baseFees.miscellaneous + adjustedTuition;


//         // 1. FULL PAYMENT WITH DISCOUNT (5% off entire Base Fee)
//         const fullDiscount = adjustedTotalBaseFee * 0.05; 
//         const fullTotalFee = adjustedTotalBaseFee - fullDiscount; 

//         // 2. QUARTERLY PAYMENT WITH INTEREST (3% interest on ADJUSTED Tuition)
//         const quarterlyInterest = adjustedTuition * 0.03;
//         const quarterlyTotalFee = adjustedTotalBaseFee + quarterlyInterest;
//         const quarterlyTuitionPerInstallment = (adjustedTuition + quarterlyInterest) / 4;

//         // 3. MONTHLY PAYMENT WITH INTEREST (5% interest on ADJUSTED Tuition)
//         const monthlyInterest = adjustedTuition * 0.05;
//         const monthlyTotalFee = adjustedTotalBaseFee + monthlyInterest;
//         const monthlyTuitionPerInstallment = (adjustedTuition + monthlyInterest) / 8;
        
//         // 4. FLEXIBLE PAYMENT WITH INTEREST (7% fixed interest on ADJUSTED Tuition)
//         const flexInterest = adjustedTuition * FLEX_INTEREST_RATE; 
//         const flexTotalFee = adjustedTotalBaseFee + flexInterest;
//         const flexTuitionPerInstallment = (adjustedTuition + flexInterest) / 8; 

//         const downPayments = {
//             full_discount: fullTotalFee, 
//             quarterly: minDownPayment, // Set to min DP for fixed quarterly mode
//             monthly: minDownPayment, // Set to min DP for fixed monthly mode
//             flex_dp: 0, // Flex DP starts at 0 for user input
//         };

//         return {
//             ...baseFees,
//             adjustedTuition: adjustedTuition,
//             adjustedTotalBaseFee: adjustedTotalBaseFee, 
//             minDownPayment: minDownPayment, 

//             full: fullTotalFee,
//             fullDiscount: fullDiscount,
//             downPayments: downPayments,

//             quarterlyTotalFee: quarterlyTotalFee,
//             quarterlyInterest: quarterlyInterest,
//             quarterlyInstallment: quarterlyTuitionPerInstallment,

//             monthlyTotalFee: monthlyTotalFee,
//             monthlyInterest: monthlyInterest,
//             monthlyInstallment: monthlyTuitionPerInstallment,
            
//             flexTotalFee: flexTotalFee,
//             flexInterest: flexInterest,
//             flexInstallment: flexTuitionPerInstallment,
//         };
//     }, []);

//     // Function to calculate the final total fee based on selected payment mode (Simpler logic)
//     const calculateFinalTotalFee = useCallback((fees, mode) => {
//         let percentage = 0;
//         let totalFee = 0;
        
//         if (mode === 'full_discount') {
//             totalFee = fees.full;
//         } else if (mode === 'quarterly') {
//             totalFee = fees.quarterlyTotalFee;
//         } else if (mode === 'monthly') {
//             totalFee = fees.monthlyTotalFee;
//         } else if (mode === 'flex_dp') {
//             totalFee = fees.flexTotalFee;
//             percentage = FLEX_INTEREST_RATE * 100;
//         }

//         // Set the clean percentage rate for display
//         setFlexInterestRate(Math.round(percentage));

//         return Math.round(totalFee * 100) / 100; // Round to 2 decimals for accuracy
//     }, []);


//     // Handles setting the down payment based on mode change
//     const handlePaymentModeChange = useCallback((newMode) => {
//         setPaymentMode(newMode);
//         if (feeStructure) {
//             if (newMode === 'full_discount') {
//                 setDownPayment(feeStructure.full); // Full DP is the total fee
//             } else if (newMode === 'quarterly' || newMode === 'monthly') {
//                 setDownPayment(feeStructure.minDownPayment); // Fixed DP for standard installments
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
    
//     // Effect to recalculate total fee whenever paymentMode changes
//     useEffect(() => {
//         if (feeStructure) {
//             const newTotalFee = calculateFinalTotalFee(feeStructure, paymentMode);
//             setTotalFeeWithInterest(newTotalFee);
            
//             // Re-set DP based on mode
//             if(paymentMode === 'full_discount') {
//                 setDownPayment(feeStructure.full);
//             } else if (paymentMode === 'quarterly' || paymentMode === 'monthly') {
//                 setDownPayment(feeStructure.minDownPayment);
//             }
//             // If flex_dp, user's input DP is maintained, or 0 if it was reset by handlePaymentModeChange.
//         }
//     }, [paymentMode, feeStructure, calculateFinalTotalFee]);

//     // Handle DP change only when in Flex mode
//     const handleDownPaymentChange = (e) => {
//         if (paymentMode === 'flex_dp') {
//             setDownPayment(parseFloat(e.target.value) || 0);
//         }
//     };


//     const outstandingBalance = totalFeeWithInterest - downPayment;

//     // Render nothing if applicant is null or modal is not visible
//     if (!applicant || !isVisible || !feeStructure) return null;

//     // Manual closing function
//     const handleClose = () => { 
//         if (isProcessing) return; 
//         setClosing(true);
//         setTimeout(() => {
//             setIsVisible(false);
//             onClose(); 
//             setClosing(false);
//         }, 250);
//     }; 
    
//     // MODAL TRIGGERS VALIDATION
//     const handleValidateClick = async () => { 
//         if (isProcessing) return;
        
//         if (downPayment < 0) {
//              alert(`Down Payment cannot be negative.`);
//              return;
//         }
        
//         if (onValidate) {
//             onValidate({
//                 ...applicant,
//                 paymentMode,
//                 downPayment: parseFloat(downPayment), 
//                 totalFee: totalFeeWithInterest,
//                 outstandingBalance: outstandingBalance,
//             });
//         }
//     }; 
    
//     // Logic for Installment Calculation
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
//             installmentNote = `Balance split over ${remainingPaymentsCount} quarters.`;
//         } else if (paymentMode === 'monthly') {
//             remainingPaymentsCount = 7; 
//             installmentPeriod = `Monthly (${remainingPaymentsCount} remaining payments)`;
//             installmentAmount = outstandingBalance / remainingPaymentsCount;
//             installmentNote = `Balance split over ${remainingPaymentsCount} months.`;
//         } else if (paymentMode === 'flex_dp') {
//             remainingPaymentsCount = 8; // Fixed 8-month term for Flex
//             installmentPeriod = `Flex Installment (${remainingPaymentsCount} months)`;
//             installmentAmount = outstandingBalance / remainingPaymentsCount; 
//             installmentNote = `Outstanding balance (incl. ${flexInterestRate}% fixed interest) split over ${remainingPaymentsCount} monthly payments.`;
//         }
//     }
    
//     const isDPInputDisabled = isProcessing || (paymentMode !== 'flex_dp');


//     return (
//         <div
//             className={`fixed inset-0 bg-black/40 flex justify-center items-start z-50 overflow-auto pt-10 transition-opacity ${closing ? "opacity-0" : "opacity-100"
//                 }`}
//         >
//             <div className="bg-white dark:bg-slate-800 max-w-[1200px] w-[90%] rounded-lg shadow-md border border-gray-200 dark:border-slate-600 flex flex-col max-h-[95vh] overflow-y-auto animate-fade-in">
//                 {/* HEADER */}
//                 <div className="flex justify-between items-center bg-yellow-400 text-black dark:text-white px-6 py-4">
//                     <h2 className="text-lg font-semibold">
//                         Screening – {fieldValue(applicant.StudentLastName)}, {fieldValue(applicant.StudentFirstName)} {fieldValue(applicant.StudentMiddleName)}.
//                     </h2>
//                     <span className={`text-2xl cursor-pointer ${isProcessing ? 'text-gray-500 cursor-not-allowed' : 'hover:text-gray-700 dark:hover:text-gray-300'}`} onClick={handleClose}>
//                         &times;
//                     </span>
//                 </div>

//                 {/* BODY */}
//                 <div className="flex flex-col p-6 space-y-3 text-black dark:text-white">

//                     {/* PAYMENT SECTION - UPDATED LOGIC */}
//                     <div className="border-t pt-4 mt-4">
//                         <h3 className="text-sm font-semibold mb-3">Payment Information</h3>

//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                             {/* Fee Breakdown (Detailed) */}
//                             <div className="space-y-2 bg-gray-50 dark:bg-slate-700 p-4 rounded col-span-1">
//                                 <h4 className="font-semibold text-sm">Fee Breakdown ({applicant.grade})</h4>
//                                 <div className="space-y-1 text-sm">
//                                     <div className="flex justify-between">
//                                         <span>Registration Fee:</span>
//                                         <span>₱ {fieldValue(feeStructure.registration)}</span>
//                                     </div>
//                                     <div className="flex justify-between">
//                                         <span>Miscellaneous Fee:</span>
//                                         <span>₱ {fieldValue(feeStructure.miscellaneous)}</span>
//                                     </div>
//                                     <div className="flex justify-between">
//                                         <span>Tuition Fee (Installment Base):</span>
//                                         <span>₱ {fieldValue(feeStructure.adjustedTuition)}</span>
//                                     </div>
                                    
//                                     {/* --- DYNAMIC INTEREST LINE (Now displaying clean percentages) --- */}
//                                     <div className="flex justify-between border-t border-dashed pt-1 mt-2">
//                                         <span className={`font-semibold ${paymentMode === 'full_discount' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
//                                             {paymentMode === 'full_discount' ? '5% Discount:' :
//                                              paymentMode === 'quarterly' ? '3% Quarterly Interest:' :
//                                              paymentMode === 'monthly' ? '5% Monthly Interest:' : 
//                                              paymentMode === 'flex_dp' ? `${flexInterestRate}% Flex Interest:` : 'Adjustment:'}
//                                         </span>
//                                         <span className={`font-semibold ${paymentMode === 'full_discount' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
//                                             {paymentMode === 'full_discount' ? `- ₱ ${fieldValue(feeStructure.fullDiscount)}` :
//                                              paymentMode === 'quarterly' ? `+ ₱ ${fieldValue(feeStructure.quarterlyInterest)}` :
//                                              paymentMode === 'monthly' ? `+ ₱ ${fieldValue(feeStructure.monthlyInterest)}` : 
//                                              paymentMode === 'flex_dp' ? `+ ₱ ${fieldValue(feeStructure.flexInterest)}` : `—`}
//                                         </span>
//                                     </div>
                                    
//                                     <div className="flex justify-between border-t pt-1 mt-1 font-bold text-base">
//                                         <span>Total Fee (Final):</span>
//                                         <span className="text-xl text-blue-600 dark:text-blue-400">₱ {fieldValue(totalFeeWithInterest)}</span>
//                                     </div>
//                                 </div>
//                             </div>
                            
//                             {/* Payment Mode Selection and Down Payment Input */}
//                             <div className="space-y-3 col-span-1">
//                                 <div>
//                                     <label className="block font-semibold text-sm mb-2">Payment Mode</label>
//                                     <select
//                                         value={paymentMode}
//                                         onChange={(e) => handlePaymentModeChange(e.target.value)}
//                                         disabled={isProcessing} 
//                                         className="w-full border border-gray-400 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-sm disabled:bg-gray-200 dark:disabled:bg-slate-600"
//                                     >
//                                         <option value="full_discount">Full Payment (5% Discount)</option>
//                                         <option value="quarterly">Quarterly Installment (3% Int.)</option>
//                                         <option value="monthly">Monthly Installment (5% Int.)</option>
//                                         <option value="flex_dp">Flexible Down Payment ({flexInterestRate}% Fixed Int.)</option>
//                                     </select>
//                                 </div>

//                                 <div>
//                                     <label className="block font-semibold text-sm mb-2">Down Payment</label>
//                                     <input
//                                         type="number"
//                                         value={downPayment}
//                                         onChange={handleDownPaymentChange}
//                                         min={0}
//                                         max={feeStructure.adjustedTotalBaseFee}
//                                         disabled={isDPInputDisabled} 
//                                         className={`w-full border rounded px-3 py-2 text-sm disabled:bg-gray-200 dark:disabled:bg-slate-600 
//                                             ${isDPInputDisabled ? 'bg-gray-200 dark:bg-slate-700 border-gray-300' : 'bg-white dark:bg-slate-700 border-yellow-500 ring-1 ring-yellow-500'}`}
//                                     />
//                                     <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                                         {paymentMode === 'flex_dp' ? 
//                                             `Flexible Mode: Enter desired DP (No minimum required).` :
//                                             `Fixed Mode: Down Payment is set to ₱ ${fieldValue(feeStructure.minDownPayment)} (Reg + Misc Fees).`
//                                         }
//                                         {(paymentMode !== 'full_discount' && downPayment < feeStructure.minDownPayment) && (
//                                             <span className="text-yellow-700 dark:text-yellow-400 font-bold block">
//                                                 * Note: DP less than ₱ {fieldValue(feeStructure.minDownPayment)} (Reg+Misc Fee).
//                                             </span>
//                                         )}
//                                     </p>
//                                 </div>
                                
//                                 <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded space-y-2">
//                                     <div className="flex justify-between text-sm mb-1">
//                                         <span>Down Payment Received:</span>
//                                         <span className="font-bold text-2xl">₱ {fieldValue(downPayment)}</span>
//                                     </div>
//                                     <div className="flex justify-between text-sm font-bold border-t pt-2">
//                                         <span>Outstanding Balance:</span>
//                                         <span className="text-2xl text-red-600 dark:text-red-400">₱ {fieldValue(outstandingBalance)}</span>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Calculated Balances Display & Installment Info */}
//                             <div className="space-y-3 col-span-1">
//                                 {outstandingBalance > 0 && (
//                                         <div className="text-center bg-yellow-100 dark:bg-yellow-900 p-3 rounded">
//                                             <p className="font-bold text-sm text-black dark:text-white">Estimated Installment Details</p>
//                                             <p className="text-xs text-black dark:text-white">
//                                                 Payment Term: **{installmentPeriod}**
//                                             </p>
//                                             <p className="text-xl font-bold text-black dark:text-white">
//                                                 **₱ {fieldValue(installmentAmount)}** / payment
//                                             </p>
//                                             <p className="text-xs italic text-black dark:text-white">
//                                                 ({installmentNote})
//                                             </p>
//                                             <div className="mt-2 text-left p-1 border-t border-dashed">
//                                                 <p className="font-semibold text-sm text-black dark:text-white mb-1">Total Payments Remaining:</p>
//                                                 <p className="text-lg font-bold text-black dark:text-white">{remainingPaymentsCount} payments</p>
//                                                 <p className="text-red-600 dark:text-red-400 text-xs mt-2 font-bold">
//                                                     * Note: An additional {LATE_PAYMENT_INTEREST_RATE * 100}% Late Payment Interest is applied if installment is delayed.
//                                                 </p>
//                                             </div>
//                                         </div>
//                                     )}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Screening Section and Actions (omitted for brevity) */}
//                     <div className="flex flex-col md:flex-row justify-between gap-6 mt-6 items-start"> 
//                         <div className="w-full md:w-1/2">
                           
//                             {/* Document List (omitted for brevity) */}
//                         </div>
//                         <div className="w-full md:w-1/2 flex flex-col mt-auto items-end">
//                             <h3 className="text-sm font-semibold mb-2 invisible">Actions</h3> 
//                             <div className="flex flex-col gap-2">
//                                 <button
//                                     onClick={handleValidateClick}
//                                     disabled={isProcessing} 
//                                     className={`w-[190px] px-3.5 py-1.5 rounded text-black font-semibold transition 
//                                         ${isProcessing 
//                                             ? "bg-gray-400 cursor-not-allowed" 
//                                             : "bg-green-600 hover:bg-green-700" 
//                                         }`}
//                                 >
//                                     {isProcessing ? 'Processing...' : 'Confirm and Proceed'}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Styles (omitted for brevity) */}
//         </div>
//     );
// };
// export default ScreeningModal;