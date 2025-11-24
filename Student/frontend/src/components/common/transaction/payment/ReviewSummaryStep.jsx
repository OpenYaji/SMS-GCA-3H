import React from 'react';
import { QrCode, Camera } from 'lucide-react';
import StepIndicator from './StepIndicator';

const ReviewSummaryStep = ({ onConfirm, onBack, paymentDetails, fees, txnRef }) => {
    const isGCash = paymentDetails.method === 'GCash';

    // Generate GCash deep link for payment
    const generateGCashLink = () => {
        const amount = paymentDetails.amount;
        const merchantName = "Gymnazo Christian Academy";
        const reference = txnRef;
        // GCash deep link format (simplified - adjust based on actual GCash API)
        return `gcash://pay?amount=${amount}&merchant=${encodeURIComponent(merchantName)}&ref=${reference}`;
    };

    return (
        <div>
            <StepIndicator currentStep={3} />
            <h3 className="text-lg font-semibold text-center mb-6 text-gray-800 dark:text-gray-100">Review Summary</h3>

            <div className="p-4 border border-gray-200 dark:border-slate-600 rounded-lg mb-6 space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Payment Method</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">{paymentDetails.method}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Recipient</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">Gymnazo Christian Academy</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Reference No.</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">{txnRef}</span>
                </div>
                <hr className="border-gray-100 dark:border-slate-700" />
                <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">{paymentDetails.selectedFee || 'Tuition Fee'}</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">₱ {paymentDetails.amount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <hr className="border-gray-100 dark:border-slate-700" />
                <div className="flex justify-between font-bold text-lg">
                    <span className="text-gray-800 dark:text-gray-100">Total Paid</span>
                    <span className="text-gray-800 dark:text-gray-100">₱ {paymentDetails.amount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
            </div>

            {isGCash && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                    <div className="flex items-start gap-3 mb-4">
                        <QrCode className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" size={20} />
                        <div className="text-sm">
                            <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">GCash Payment Instructions:</p>
                            <ol className="list-decimal list-inside space-y-1 text-blue-800 dark:text-blue-200">
                                <li>Click "Pay Now" to open GCash app</li>
                                <li>Complete the payment in GCash</li>
                                <li>Take a screenshot of the payment receipt</li>
                                <li>Return here to upload the screenshot</li>
                            </ol>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 rounded-lg">
                        <Camera className="text-amber-700 dark:text-amber-400" size={18} />
                        <p className="text-xs font-medium text-amber-900 dark:text-amber-200">
                            <strong>Important:</strong> You'll need to upload your payment receipt in the next step
                        </p>
                    </div>
                </div>
            )}

            <div className="flex gap-4">
                <button onClick={onBack} className="flex-1 py-3 text-sm font-semibold rounded-lg border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">Cancel</button>
                <button
                    onClick={() => {
                        if (isGCash) {
                            // Open GCash app
                            window.location.href = generateGCashLink();
                            // Small delay before proceeding to upload step
                            setTimeout(() => onConfirm(), 1000);
                        } else {
                            onConfirm();
                        }
                    }}
                    className="flex-1 py-3 bg-amber-400 text-stone-900 text-sm font-bold rounded-lg hover:bg-amber-500 transition-colors"
                >
                    Pay Now
                </button>
            </div>
        </div>
    );
};

export default ReviewSummaryStep;
