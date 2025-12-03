import React, { useState, useEffect } from 'react';
import { CreditCard, Calendar, Wallet, AlertCircle } from 'lucide-react';

const SelectAmountStep = ({ availableItems, dueDate, onProceed, onReturn, paymentDetails, setPaymentDetails }) => {
  const [selectedMode, setSelectedMode] = useState('full');
  const [customAmount, setCustomAmount] = useState('');
  const [calculatedAmount, setCalculatedAmount] = useState(0);

  const totalBalance = paymentDetails.totalAmount || 0;

  // Calculate amounts based on payment mode - FIXED LOGIC
  const calculatePaymentAmount = (mode) => {
    // Get individual fee components
    const registration = parseFloat(availableItems.find(item =>
      item.description.toLowerCase().includes('registration'))?.amount || 0);
    const miscellaneous = parseFloat(availableItems.find(item =>
      item.description.toLowerCase().includes('miscellaneous'))?.amount || 0);
    const tuition = parseFloat(availableItems.find(item =>
      item.description.toLowerCase().includes('tuition'))?.amount || 0);

    // One-time fees (always paid in full on first payment)
    const oneTimeFees = registration + miscellaneous;

    switch (mode) {
      case 'full':
        // Pay everything at once
        return oneTimeFees + tuition;

      case 'quarterly':
        // One-time fees + (Tuition divided by 4)
        return oneTimeFees + (tuition / 4);

      case 'monthly':
        // One-time fees + (Tuition divided by 8)
        return oneTimeFees + (tuition / 8);

      case 'custom':
        return parseFloat(customAmount) || 0;

      default:
        return 0;
    }
  };

  useEffect(() => {
    const amount = calculatePaymentAmount(selectedMode);
    setCalculatedAmount(amount);
    setPaymentDetails(prev => ({
      ...prev,
      paymentMode: selectedMode,
      amount: amount
    }));
  }, [selectedMode, customAmount, availableItems]);

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
    if (mode !== 'custom') {
      setCustomAmount('');
    }
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setCustomAmount(value);
    }
  };

  const isValidAmount = () => {
    if (selectedMode === 'custom') {
      const amount = parseFloat(customAmount);
      return amount > 0 && amount <= totalBalance;
    }
    return calculatedAmount > 0 && calculatedAmount <= totalBalance;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Select Payment Amount
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Choose your payment mode or enter a custom amount
        </p>
      </div>

      {/* Balance Display */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-amber-900 dark:text-amber-100">
            Total Balance Due
          </span>
          <span className="text-xl font-bold text-amber-600 dark:text-amber-400">
            ₱{totalBalance.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Payment Mode Options */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Payment Mode
        </label>

        {/* Full Payment */}
        <button
          onClick={() => handleModeSelect('full')}
          className={`w-full p-4 border-2 rounded-lg text-left transition-all ${selectedMode === 'full'
            ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
            : 'border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-700'
            }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <Wallet className={`w-5 h-5 mt-0.5 ${selectedMode === 'full' ? 'text-amber-600' : 'text-gray-400'}`} />
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">Full Payment</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Pay the entire balance at once
                </p>
              </div>
            </div>
            <span className="font-bold text-amber-600 dark:text-amber-400">
              ₱{calculatePaymentAmount('full').toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </button>

        {/* Quarterly Payment */}
        <button
          onClick={() => handleModeSelect('quarterly')}
          className={`w-full p-4 border-2 rounded-lg text-left transition-all ${selectedMode === 'quarterly'
            ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
            : 'border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-700'
            }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <Calendar className={`w-5 h-5 mt-0.5 ${selectedMode === 'quarterly' ? 'text-amber-600' : 'text-gray-400'}`} />
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">Quarterly Payment</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Registration + Miscellaneous + ¼ of Tuition (per quarter)
                </p>
              </div>
            </div>
            <span className="font-bold text-amber-600 dark:text-amber-400">
              ₱{calculatePaymentAmount('quarterly').toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </button>

        {/* Monthly Payment */}
        <button
          onClick={() => handleModeSelect('monthly')}
          className={`w-full p-4 border-2 rounded-lg text-left transition-all ${selectedMode === 'monthly'
            ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
            : 'border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-700'
            }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <CreditCard className={`w-5 h-5 mt-0.5 ${selectedMode === 'monthly' ? 'text-amber-600' : 'text-gray-400'}`} />
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">Monthly Payment</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Registration + Miscellaneous + ⅛ of Tuition (per month)
                </p>
              </div>
            </div>
            <span className="font-bold text-amber-600 dark:text-amber-400">
              ₱{calculatePaymentAmount('monthly').toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </button>

        {/* Custom Amount */}
        <button
          onClick={() => handleModeSelect('custom')}
          className={`w-full p-4 border-2 rounded-lg text-left transition-all ${selectedMode === 'custom'
            ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
            : 'border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-700'
            }`}
        >
          <div className="flex items-start space-x-3">
            <AlertCircle className={`w-5 h-5 mt-0.5 ${selectedMode === 'custom' ? 'text-amber-600' : 'text-gray-400'}`} />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">Custom Amount</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                Enter any amount up to your balance
              </p>
              {selectedMode === 'custom' && (
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
              )}
            </div>
          </div>
        </button>
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
          onClick={onProceed}
          disabled={!isValidAmount()}
          className="flex-1 px-6 py-3 bg-amber-400 hover:bg-amber-500 text-stone-900 rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Proceed to Payment
        </button>
      </div>
    </div >
  );
};

export default SelectAmountStep;
