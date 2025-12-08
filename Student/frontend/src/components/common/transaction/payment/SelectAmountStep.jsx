import React, { useState, useEffect } from 'react';
import { CreditCard, Calendar, Wallet, AlertCircle } from 'lucide-react';

const SelectAmountStep = ({ availableItems, dueDate, onProceed, onReturn, paymentDetails, setPaymentDetails, transactionData }) => {
  const [customAmount, setCustomAmount] = useState('');
  const [calculatedAmount, setCalculatedAmount] = useState(0);

  const totalBalance = paymentDetails.totalAmount || 0;

  // Get payment mode and grade level from transaction data
  const registeredPaymentMode = transactionData?.paymentMode || 'full';
  const gradeLevel = transactionData?.gradeLevel || 'Grade 1';
  const canUseCustom = registeredPaymentMode === 'full';

  // Fee structure based on grade level (from your payment table)
  const getFeeStructure = (grade) => {
    const feeTable = {
      'Nursery': { quarterly: 2500, monthly: 1000 },
      'Kinder 1': { quarterly: 2500, monthly: 1000 },
      'Kinder 2': { quarterly: 2500, monthly: 1000 },
      'Grade 1': { quarterly: 2400, monthly: 1200 },
      'Grade 2': { quarterly: 2400, monthly: 1200 },
      'Grade 3': { quarterly: 2400, monthly: 1200 },
      'Grade 4': { quarterly: 2600, monthly: 1300 },
      'Grade 5': { quarterly: 2600, monthly: 1300 },
      'Grade 6': { quarterly: 2600, monthly: 1300 }
    };

    return feeTable[grade] || feeTable['Grade 1'];
  };

  // Get the correct installment amount based on registered payment mode and grade
  const getInstallmentAmount = () => {
    const fees = getFeeStructure(gradeLevel);

    switch (registeredPaymentMode) {
      case 'quarterly':
        return fees.quarterly;
      case 'monthly':
        return fees.monthly;
      default:
        return 0;
    }
  };

  const installmentAmount = getInstallmentAmount();

  useEffect(() => {
    // Automatically set to registered payment mode on mount
    let amount = 0;

    if (registeredPaymentMode === 'quarterly' || registeredPaymentMode === 'monthly') {
      amount = installmentAmount;
    } else if (registeredPaymentMode === 'full') {
      amount = totalBalance;
    }

    setCalculatedAmount(amount);
    setPaymentDetails(prev => ({
      ...prev,
      paymentMode: registeredPaymentMode,
      amount: amount
    }));
  }, [registeredPaymentMode, installmentAmount, totalBalance]);

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setCustomAmount(value);
      const amount = parseFloat(value) || 0;
      setCalculatedAmount(amount);
      setPaymentDetails(prev => ({
        ...prev,
        paymentMode: 'custom',
        amount: amount
      }));
    }
  };

  const handleUseInstallmentAmount = () => {
    setCustomAmount('');
    setCalculatedAmount(installmentAmount);
    setPaymentDetails(prev => ({
      ...prev,
      paymentMode: registeredPaymentMode,
      amount: installmentAmount
    }));
  };

  const handleUseFullBalance = () => {
    setCustomAmount('');
    setCalculatedAmount(totalBalance);
    setPaymentDetails(prev => ({
      ...prev,
      paymentMode: 'full',
      amount: totalBalance
    }));
  };

  const isValidAmount = () => {
    return calculatedAmount > 0 && calculatedAmount <= totalBalance;
  };

  const getPaymentModeLabel = () => {
    switch (registeredPaymentMode) {
      case 'quarterly':
        return 'Quarterly Payment';
      case 'monthly':
        return 'Monthly Payment';
      case 'full':
        return 'Full Payment';
      default:
        return 'Payment';
    }
  };

  const getPaymentModeDescription = () => {
    switch (registeredPaymentMode) {
      case 'quarterly':
        return `Pay ₱${installmentAmount.toLocaleString('en-PH', { minimumFractionDigits: 2 })} per quarter (4 payments) for ${gradeLevel}`;
      case 'monthly':
        return `Pay ₱${installmentAmount.toLocaleString('en-PH', { minimumFractionDigits: 2 })} per month (8 payments) for ${gradeLevel}`;
      case 'full':
        return 'Pay the entire balance at once';
      default:
        return '';
    }
  };

  const handleProceed = () => {
    if (!calculatedAmount || calculatedAmount <= 0) {
      alert('Please enter a valid payment amount');
      return;
    }

    if (calculatedAmount > totalBalance) {
      alert(`Payment amount cannot exceed balance of ₱${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`);
      return;
    }

    // Update payment details with the selected amount
    setPaymentDetails(prev => ({
      ...prev,
      amount: calculatedAmount,
      paymentMode: registeredPaymentMode
    }));

    onProceed();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Select Payment Amount
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Your registered payment mode: <span className="font-semibold text-amber-600">{getPaymentModeLabel()}</span>
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Grade Level: <span className="font-medium">{gradeLevel}</span>
        </p>
      </div>

      {/* Balance Display */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-amber-900 dark:text-amber-100">
            Remaining Balance
          </span>
          <span className="text-xl font-bold text-amber-600 dark:text-amber-400">
            ₱{totalBalance.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Payment Options */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Payment Options
        </label>

        {/* Installment Payment - Only show for quarterly/monthly */}
        {(registeredPaymentMode === 'quarterly' || registeredPaymentMode === 'monthly') && (
          <button
            onClick={handleUseInstallmentAmount}
            className={`w-full p-4 border-2 rounded-lg text-left transition-all ${calculatedAmount === installmentAmount && customAmount === ''
                ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-700'
              }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <Calendar className={`w-5 h-5 mt-0.5 ${calculatedAmount === installmentAmount && customAmount === ''
                    ? 'text-amber-600'
                    : 'text-gray-400'
                  }`} />
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                    {getPaymentModeLabel()}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {getPaymentModeDescription()}
                  </p>
                </div>
              </div>
              <span className="font-bold text-amber-600 dark:text-amber-400">
                ₱{installmentAmount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </button>
        )}

        {/* Full Balance Payment */}
        <button
          onClick={handleUseFullBalance}
          className={`w-full p-4 border-2 rounded-lg text-left transition-all ${calculatedAmount === totalBalance && customAmount === ''
              ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-700'
            }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <Wallet className={`w-5 h-5 mt-0.5 ${calculatedAmount === totalBalance && customAmount === ''
                  ? 'text-amber-600'
                  : 'text-gray-400'
                }`} />
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">Pay Full Balance</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Pay the entire remaining balance now
                </p>
              </div>
            </div>
            <span className="font-bold text-amber-600 dark:text-amber-400">
              ₱{totalBalance.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </button>

        {/* Custom Amount - Only show for full payment mode */}
        {canUseCustom && (
          <div
            className={`w-full p-4 border-2 rounded-lg transition-all ${customAmount !== ''
                ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                : 'border-gray-200 dark:border-gray-700'
              }`}
          >
            <div className="flex items-start space-x-3">
              <AlertCircle className={`w-5 h-5 mt-0.5 ${customAmount !== '' ? 'text-amber-600' : 'text-gray-400'
                }`} />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">Custom Amount</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                  Enter any amount up to your balance
                </p>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">₱</span>
                  <input
                    type="text"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    placeholder="0.00"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Selected Amount Display */}
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Amount to Pay
          </span>
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            ₱{calculatedAmount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={onReturn}
          className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-semibold"
        >
          Cancel
        </button>
        <button
          onClick={handleProceed}
          disabled={!isValidAmount()}
          className="flex-1 px-6 py-3 bg-amber-400 hover:bg-amber-500 text-stone-900 rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default SelectAmountStep;
