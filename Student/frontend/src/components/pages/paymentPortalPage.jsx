import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import CurrentBalanceDisplay from '../common/transaction/payment/CurrentBalanceDisplay';
import SelectAmountStep from '../common/transaction/payment/SelectAmountStep';
import ChooseMethodStep from '../common/transaction/payment/ChooseMethodStep';
import OtpVerificationStep from '../common/transaction/payment/OtpVerificationStep';
import QRCodeDisplayStep from '../common/transaction/payment/QRCodeDisplayStep';
import ReceiptUploadStep from '../common/transaction/payment/ReceiptUploadStep';
import ProcessingStep from '../common/transaction/payment/ProcessingStep';
import PaymentStatusStep from '../common/transaction/payment/PaymentStatusStep';

const PaymentPortalPage = () => {
  const [step, setStep] = useState(1);
  const [stepStage, setStepStage] = useState('getOtp');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactionData, setTransactionData] = useState(null);
  const [currentBalance, setCurrentBalance] = useState(0);
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
  const navigate = useNavigate();

  // Fetch payment data on component mount
  useEffect(() => {
    fetchPaymentData();
  }, []);

  const fetchPaymentData = async () => {
    try {
      setLoading(true);

      // Fetch current balance and payment data
      const [balanceResponse, paymentResponse] = await Promise.all([
        axios.get('/backend/api/transactions/getTransactionData.php', {
          withCredentials: true,
        }),
        axios.get('/backend/api/transactions/getPaymentData.php', {
          withCredentials: true,
        })
      ]);

      if (balanceResponse.data.success) {
        setCurrentBalance(balanceResponse.data.data.currentBalance);
      }

      if (paymentResponse.data.success) {
        const data = paymentResponse.data.data;
        setTransactionData(data);

        // Set payment details with full balance and all items
        setPaymentDetails(prev => ({
          ...prev,
          amount: parseFloat(data.balanceAmount),
          transactionId: data.transactionId,
          breakdownItems: data.availableItems || []
        }));
      } else {
        setError(paymentResponse.data.message || 'Failed to fetch payment data.');
      }
    } catch (err) {
      console.error('Error fetching payment data:', err);
      setError('An error occurred while fetching payment data.');
    } finally {
      setLoading(false);
    }
  };

  const handleStepAction = async (action, direction) => {
    if (action === 'close') {
      navigate('/student-dashboard/transaction');
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

      // Refresh payment data after successful submission
      if (response.data.success) {
        await fetchPaymentData();
      }

      setTimeout(() => {
        setStep(7);
      }, 2000);
    } catch (error) {
      console.error('Payment submission error:', error);
      setTimeout(() => {
        setStep(7);
      }, 2000);
    }
  };

  const renderStepContent = () => {
    if (loading && step === 1) {
      return (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading payment data...</p>
        </div>
      );
    }

    if (error && step === 1) {
      return (
        <div className="text-center py-8">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={() => navigate('/student-dashboard/transaction')}
            className="mt-4 px-6 py-2 bg-amber-400 text-stone-900 rounded-lg hover:bg-amber-500"
          >
            Back to Transaction
          </button>
        </div>
      );
    }

    switch (step) {
      case 1:
        return transactionData ? (
          <SelectAmountStep
            availableItems={transactionData.availableItems}
            dueDate={transactionData.dueDate}
            onProceed={() => handleStepAction('proceed', 'next')}
            onReturn={() => handleStepAction('close', null)}
            paymentDetails={paymentDetails}
          />
        ) : null;
      case 2:
        return (
          <ChooseMethodStep
            onConfirm={() => handleStepAction('confirm', 'next')}
            onBack={() => handleStepAction('back', 'back')}
            setPaymentDetails={setPaymentDetails}
            paymentDetails={paymentDetails}
          />
        );
      case 3:
        return (
          <OtpVerificationStep
            onConfirm={() => handleStepAction('confirm', 'next')}
            onBack={() => handleStepAction('back', 'back')}
            setPaymentDetails={setPaymentDetails}
            paymentDetails={paymentDetails}
            stepStage={stepStage}
            setStepStage={setStepStage}
            correctOtp={MOCK_OTP}
          />
        );
      case 4:
        return (
          <QRCodeDisplayStep
            onConfirm={() => handleStepAction('confirm', 'next')}
            onBack={() => handleStepAction('back', 'back')}
            paymentDetails={paymentDetails}
            txnRef={txnRef}
          />
        );
      case 5:
        return (
          <ReceiptUploadStep
            onConfirm={() => handleStepAction('confirm', 'next')}
            onBack={() => handleStepAction('back', 'back')}
            paymentDetails={paymentDetails}
            setPaymentDetails={setPaymentDetails}
          />
        );
      case 6:
        return <ProcessingStep />;
      case 7:
        return (
          <PaymentStatusStep
            onClose={() => navigate('/student-dashboard/transaction')}
            paymentDetails={paymentDetails}
            txnRef={txnRef}
          />
        );
      default:
        return <div>Invalid Step</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Payment Portal
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-1">
            <CurrentBalanceDisplay balance={currentBalance} />
          </div>
          <div className="md:col-span-2 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 md:p-8 shadow-md">
            {renderStepContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPortalPage;

