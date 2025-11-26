import React, { useState } from 'react';
import { Upload, X, Image, Loader2 } from 'lucide-react';
import StepIndicator from './StepIndicator';

const ReceiptUploadStep = ({ onConfirm, onBack, paymentDetails, setPaymentDetails }) => {
    const [receipt, setReceipt] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file (JPG, PNG, etc.)');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('File size must be less than 5MB');
            return;
        }

        setError('');
        setReceipt(file);
        setPaymentDetails(prev => ({ ...prev, receipt: file }));

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleRemove = () => {
        setReceipt(null);
        setPreview(null);
        setPaymentDetails(prev => ({ ...prev, receipt: null }));
    };

    const handleSubmit = async () => {
        if (!receipt) {
            setError('Please upload a payment receipt');
            return;
        }

        setUploading(true);
        setError('');

        try {
            // Simulate upload delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            onConfirm();
        } catch (err) {
            setError('Failed to upload receipt. Please try again.');
            setUploading(false);
        }
    };

    return (
        <div>
            <StepIndicator currentStep={4} />
            <h3 className="text-lg font-semibold text-center mb-2 text-gray-800 dark:text-gray-100">Upload Payment Receipt</h3>
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-6">
                Please upload a screenshot of your payment receipt
            </p>

            {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                    <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
                </div>
            )}

            {!preview ? (
                <label className="block mb-6 cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-8 text-center hover:border-amber-400 dark:hover:border-amber-500 transition-colors">
                        <Upload className="mx-auto mb-3 text-gray-400 dark:text-gray-500" size={40} />
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Click to upload receipt
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            JPG, PNG (max 5MB)
                        </p>
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </label>
            ) : (
                <div className="mb-6 relative">
                    <div className="border border-gray-300 dark:border-slate-600 rounded-lg overflow-hidden">
                        <img
                            src={preview}
                            alt="Receipt preview"
                            className="w-full h-64 object-contain bg-gray-100 dark:bg-slate-800"
                        />
                    </div>
                    <button
                        onClick={handleRemove}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    >
                        <X size={16} />
                    </button>
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Image size={16} />
                        <span className="truncate">{receipt.name}</span>
                    </div>
                </div>
            )}

            <div className="flex gap-4">
                <button
                    onClick={onBack}
                    disabled={uploading}
                    className="flex-1 py-3 text-sm font-semibold rounded-lg border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Back
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={!receipt || uploading}
                    className="flex-1 py-3 bg-amber-400 text-stone-900 text-sm font-bold rounded-lg hover:bg-amber-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {uploading ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            Uploading...
                        </>
                    ) : (
                        'Submit Receipt'
                    )}
                </button>
            </div>
        </div>
    );
};

export default ReceiptUploadStep;
