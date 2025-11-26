import React from 'react';
import { Clock, FileText, Printer } from 'lucide-react';
import StepIndicator from './StepIndicator';

const PaymentStatusStep = ({ onClose, paymentDetails, txnRef }) => {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div>
            <StepIndicator currentStep={5} />

            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-4">
                    <Clock className="text-amber-600 dark:text-amber-400" size={32} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    Payment Submitted Successfully!
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your payment is being reviewed by the registrar
                </p>
            </div>

            <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
                <div className="flex items-start gap-3 mb-3">
                    <FileText className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" size={18} />
                    <div className="text-sm">
                        <p className="font-semibold text-amber-900 dark:text-amber-100 mb-1">Status: Pending Verification</p>
                        <p className="text-amber-800 dark:text-amber-200 text-xs">
                            The registrar will verify your payment within 1-2 business days.
                            You'll be notified once the payment is confirmed.
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-4 border border-gray-200 dark:border-slate-600 rounded-lg mb-6 space-y-3 text-sm">
                <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">Payment Summary</h4>
                <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Reference No.</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">{txnRef}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Payment Method</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">{paymentDetails.method}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Date Submitted</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                        {new Date().toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}
                    </span>
                </div>

                {/* Show breakdown items */}
                {paymentDetails.breakdownItems && paymentDetails.breakdownItems.length > 0 && (
                    <>
                        <hr className="border-gray-100 dark:border-slate-700" />
                        <div className="space-y-2">
                            <p className="font-medium text-gray-700 dark:text-gray-300 text-xs">Payment Items:</p>
                            {paymentDetails.breakdownItems.map((item, index) => (
                                <div key={index} className="flex justify-between text-xs">
                                    <span className="text-gray-500 dark:text-gray-400">{item.description}</span>
                                    <span className="font-medium text-gray-800 dark:text-gray-200">
                                        ₱ {parseFloat(item.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                <hr className="border-gray-100 dark:border-slate-700" />
                <div className="flex justify-between font-bold text-lg">
                    <span className="text-gray-800 dark:text-gray-100">Total Amount</span>
                    <span className="text-gray-800 dark:text-gray-100">
                        ₱ {paymentDetails.amount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-500 dark:text-gray-400">Status</span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs font-medium">
                        <Clock size={12} />
                        Pending
                    </span>
                </div>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={handlePrint}
                    className="flex-1 py-3 text-sm font-semibold rounded-lg border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                >
                    <Printer size={16} />
                    Print Summary
                </button>
                <button
                    onClick={onClose}
                    className="flex-1 py-3 bg-amber-400 text-stone-900 text-sm font-bold rounded-lg hover:bg-amber-500 transition-colors"
                >
                    Done
                </button>
            </div>
        </div>
    );
};

export default PaymentStatusStep;
