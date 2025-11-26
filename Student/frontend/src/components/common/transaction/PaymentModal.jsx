import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';

import CurrentBalanceDisplay from './payment/CurrentBalanceDisplay';
import SelectAmountStep from './payment/SelectAmountStep';
import ChooseMethodStep from './payment/ChooseMethodStep';
import OtpVerificationStep from './payment/OtpVerificationStep';
import QRCodeDisplayStep from './payment/QRCodeDisplayStep';
import ReceiptUploadStep from './payment/ReceiptUploadStep';
import ProcessingStep from './payment/ProcessingStep';
import PaymentStatusStep from './payment/PaymentStatusStep';

const PaymentModal = ({ isOpen, onClose, currentBalance, refreshData }) => {
    const [step, setStep] = useState(1);
    const [stepStage, setStepStage] = useState('getOtp');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [transactionData, setTransactionData] = useState(null);
    const [paymentDetails, setPaymentDetails] = useState({
        amount: 0,
        method: 'GCash',
        phoneNumber: '',
        receipt: null,
        transactionId: null,
        breakdownItems: []
    });

    const txnRef = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const MOCK_OTP = '123456';

    // Fetch transaction data when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchTransactionData();
        }
    }, [isOpen]);

    const fetchTransactionData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/backend/api/transactions/getPaymentData.php', {
                withCredentials: true,
            });

            if (response.data.success) {
                const data = response.data.data;
                setTransactionData(data);

                // Set payment details with full balance and all items
                setPaymentDetails(prev => ({
                    ...prev,
                    amount: parseFloat(data.balanceAmount),
                    transactionId: data.transactionId,
                    breakdownItems: data.availableItems || []
                }));
            } else {
                setError(response.data.message || 'Failed to fetch payment data.');
            }
        } catch (err) {
            console.error('Error fetching payment data:', err);
            setError('An error occurred while fetching payment data.');
        } finally {
            setLoading(false);
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget && step < 6) {
            handleStepAction('close', null);
        }
    };

    const handleStepAction = async (action, direction) => {
        if (action === 'close') {
            // Reset modal state
            setStep(1);
            setStepStage('getOtp');
            setError(null);
            onClose();
            return;
        }

        if (direction === 'next') {
            if (step === 1) setStep(2);
            else if (step === 2 && paymentDetails.method === 'GCash') {
                setStep(3);
                setStepStage('getOtp');
            } else if (step === 2) {
                setStep(4);
            } else if (step === 3 && stepStage === 'enterOtp') {
                setStep(4); // Go to QR code display
            } else if (step === 4) {
                // After QR code, go to receipt upload
                setStep(5);
            } else if (step === 5) {
                // After receipt upload, process payment
                setStep(6);
                await processPayment();
            }
        } else if (direction === 'back') {
            if (step === 2) setStep(1);
            else if (step === 3) setStep(2);
            else if (step === 4 && paymentDetails.method === 'GCash') setStep(3);
            else if (step === 4) setStep(2);
            else if (step === 5) setStep(4);
        }
    };

    const processPayment = async () => {
        try {
            const formData = new FormData();
            formData.append('transactionId', paymentDetails.transactionId);
            formData.append('amount', paymentDetails.amount);
            formData.append('method', paymentDetails.method);
            formData.append('phoneNumber', paymentDetails.phoneNumber);
            formData.append('reference', txnRef);

            if (paymentDetails.receipt) {
                formData.append('receipt', paymentDetails.receipt);
            }

            const response = await axios.post('/backend/api/transactions/submitPayment.php', formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setTimeout(() => {
                setStep(7);
                if (refreshData) refreshData(); // Refresh parent data
            }, 2000);
        } catch (error) {
            console.error('Payment submission error:', error);
            setTimeout(() => {
                setStep(7);
            }, 2000);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={handleBackdropClick}
        >
            <div
                className={`relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 transition-transform ${isOpen ? 'scale-100' : 'scale-95'}`}
                onClick={(e) => e.stopPropagation()}
            >
                {step < 6 && (
                    <button
                        onClick={() => handleStepAction('close', null)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 z-10"
                    >
                        <X size={20} />
                    </button>
                )}

                <div className="p-6 max-h-[90vh] overflow-y-auto">
                    {loading && step === 1 ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto"></div>
                            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading payment data...</p>
                        </div>
                    ) : error && step === 1 ? (
                        <div className="text-center py-8">
                            <p className="text-red-600 dark:text-red-400">{error}</p>
                            <button
                                onClick={() => handleStepAction('close', null)}
                                className="mt-4 px-6 py-2 bg-amber-400 text-stone-900 rounded-lg hover:bg-amber-500"
                            >
                                Close
                            </button>
                        </div>
                    ) : (
                        <>
                            {step === 1 && transactionData && (
                                <>
                                    <CurrentBalanceDisplay balance={currentBalance} />
                                    <div className="mt-6">
                                        <SelectAmountStep
                                            availableItems={transactionData.availableItems}
                                            dueDate={transactionData.dueDate}
                                            onProceed={() => handleStepAction('proceed', 'next')}
                                            onReturn={() => handleStepAction('close', null)}
                                            setPaymentDetails={setPaymentDetails}
                                            paymentDetails={paymentDetails}
                                        />
                                    </div>
                                </>
                            )}
                            {step === 2 && (
                                <ChooseMethodStep
                                    onConfirm={() => handleStepAction('confirm', 'next')}
                                    onBack={() => handleStepAction('back', 'back')}
                                    setPaymentDetails={setPaymentDetails}
                                    paymentDetails={paymentDetails}
                                />
                            )}
                            {step === 3 && (
                                <OtpVerificationStep
                                    onConfirm={() => handleStepAction('confirm', 'next')}
                                    onBack={() => handleStepAction('back', 'back')}
                                    setPaymentDetails={setPaymentDetails}
                                    paymentDetails={paymentDetails}
                                    stepStage={stepStage}
                                    setStepStage={setStepStage}
                                    correctOtp={MOCK_OTP}
                                />
                            )}
                            {step === 4 && (
                                <QRCodeDisplayStep
                                    onConfirm={() => handleStepAction('confirm', 'next')}
                                    onBack={() => handleStepAction('back', 'back')}
                                    paymentDetails={paymentDetails}
                                    txnRef={txnRef}
                                />
                            )}
                            {step === 5 && (
                                <ReceiptUploadStep
                                    onConfirm={() => handleStepAction('confirm', 'next')}
                                    onBack={() => handleStepAction('back', 'back')}
                                    paymentDetails={paymentDetails}
                                    setPaymentDetails={setPaymentDetails}
                                />
                            )}
                            {step === 6 && <ProcessingStep />}
                            {step === 7 && (
                                <PaymentStatusStep
                                    onClose={() => handleStepAction('close', null)}
                                    paymentDetails={paymentDetails}
                                    txnRef={txnRef}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
