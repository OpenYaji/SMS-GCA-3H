import React from 'react';
import StepIndicator from './StepIndicator';

const SelectAmountStep = ({ availableItems, dueDate, onProceed, onReturn, paymentDetails }) => {
  if (!availableItems || availableItems.length === 0) {
    return (
      <div>
        <StepIndicator currentStep={1} />
        <h3 className="text-lg font-semibold text-center mb-6 text-gray-800 dark:text-gray-100">Make a Payment</h3>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-4">No payment items available.</p>
        <button onClick={onReturn} className="w-full py-3 text-sm font-semibold rounded-lg border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
          Return
        </button>
      </div>
    );
  }

  return (
    <div>
      <StepIndicator currentStep={1} />
      <h3 className="text-lg font-semibold text-center mb-6 text-gray-800 dark:text-gray-100">Payment Summary</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Balance Breakdown
        </label>
        <div className="border border-gray-300 dark:border-slate-600 rounded-lg overflow-hidden">
          {availableItems.map((item, index) => (
            <div
              key={index}
              className={`flex justify-between items-center px-4 py-3 ${index !== availableItems.length - 1 ? 'border-b border-gray-200 dark:border-slate-700' : ''
                } bg-white dark:bg-slate-800`}
            >
              <span className="text-sm text-gray-700 dark:text-gray-300">{item.description}</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                ₱ {parseFloat(item.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between mb-4 text-sm">
        <span className="text-gray-500 dark:text-gray-400">Due Date</span>
        <span className="font-medium text-gray-800 dark:text-gray-200">
          {dueDate ? new Date(dueDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }) : 'N/A'}
        </span>
      </div>

      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg mb-6">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-amber-900 dark:text-amber-100">Total Amount to Pay</span>
          <span className="font-bold text-2xl text-amber-900 dark:text-amber-100">
            ₱ {paymentDetails.amount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onReturn}
          className="flex-1 py-3 text-sm font-semibold rounded-lg border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
        >
          Return
        </button>
        <button
          onClick={onProceed}
          className="flex-1 py-3 bg-amber-400 text-stone-900 text-sm font-bold rounded-lg hover:bg-amber-500 transition-colors"
        >
          Proceed
        </button>
      </div>
    </div>
  );
};

export default SelectAmountStep;
