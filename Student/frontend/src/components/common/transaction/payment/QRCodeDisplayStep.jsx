import React from 'react';
import { QrCode, Smartphone, AlertCircle } from 'lucide-react';
import StepIndicator from './StepIndicator';

const QRCodeDisplayStep = ({ onConfirm, onBack, paymentDetails, txnRef }) => {
    // Placeholder QR code image - replace with actual QR code later
    const qrCodePlaceholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23ffffff'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='monospace' font-size='14' fill='%23666666'%3EGCASH QR CODE%3C/text%3E%3C/svg%3E";

    return (
        <div>
            <StepIndicator currentStep={4} />
            <h3 className="text-lg font-semibold text-center mb-2 text-gray-800 dark:text-gray-100">
                Scan QR Code to Pay
            </h3>
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-6">
                Use your GCash app to scan and complete the payment
            </p>

            {/* Payment Details Summary */}
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-blue-800 dark:text-blue-200">Amount to Pay:</span>
                    <span className="text-lg font-bold text-blue-900 dark:text-blue-100">
                        ₱ {paymentDetails.amount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                    <span className="text-blue-700 dark:text-blue-300">Reference:</span>
                    <span className="font-mono text-blue-900 dark:text-blue-100">{txnRef}</span>
                </div>
            </div>

            {/* QR Code Display */}
            <div className="mb-6 flex justify-center">
                <div className="relative bg-white p-6 rounded-2xl shadow-lg border-4 border-blue-500">
                    <img
                        src={qrCodePlaceholder}
                        alt="GCash QR Code"
                        className="w-48 h-48 object-contain"
                    />
                    <div className="absolute -top-3 -right-3 bg-blue-500 text-white p-2 rounded-full">
                        <QrCode size={24} />
                    </div>
                </div>
            </div>

            {/* Instructions */}
            <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
                <div className="flex items-start gap-3">
                    <Smartphone className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" size={20} />
                    <div className="text-sm">
                        <p className="font-semibold text-amber-900 dark:text-amber-100 mb-2">How to Pay:</p>
                        <ol className="list-decimal list-inside space-y-1 text-amber-800 dark:text-amber-200">
                            <li>Open your GCash app</li>
                            <li>Tap "Scan QR" button</li>
                            <li>Scan the QR code above</li>
                            <li>Confirm the payment amount</li>
                            <li>Complete the transaction</li>
                        </ol>
                    </div>
                </div>
            </div>

            {/* Important Note */}
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                <div className="flex items-start gap-2">
                    <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={16} />
                    <p className="text-xs text-red-800 dark:text-red-200">
                        <strong>Important:</strong> After completing the payment, take a screenshot of your receipt.
                        You'll need to upload it in the next step for verification.
                    </p>
                </div>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={onBack}
                    className="flex-1 py-3 text-sm font-semibold rounded-lg border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                    Back
                </button>
                <button
                    onClick={onConfirm}
                    className="flex-1 py-3 bg-amber-400 text-stone-900 text-sm font-bold rounded-lg hover:bg-amber-500 transition-colors"
                >
                    I've Paid, Continue
                </button>
            </div>
        </div>
    );
};

export default QRCodeDisplayStep;
