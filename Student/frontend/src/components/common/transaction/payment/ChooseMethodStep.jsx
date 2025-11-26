import React, { useState } from 'react';
import { Smartphone, CreditCard } from 'lucide-react';
import StepIndicator from './StepIndicator'; // Import StepIndicator

const ChooseMethodStep = ({ onConfirm, onBack, setPaymentDetails }) => {
    const [selectedMethod, setSelectedMethod] = useState('GCash'); // Default selection

    const handleSelect = (method) => {
        setSelectedMethod(method);
        setPaymentDetails(prev => ({ ...prev, method }));
    };

    return (
      <div>
        <StepIndicator currentStep={2} />
        <h3 className="text-lg font-semibold text-center mb-6 text-gray-800 dark:text-gray-100">Choose Payment Method</h3>

        <div className="space-y-3 mb-6">
            {['GCash', 'Paymaya', 'Credit cards'].map(method => (
                <button
                    key={method}
                    onClick={() => handleSelect(method)}
                    className={`w-full flex items-center justify-between p-3 border rounded-lg transition-all ${selectedMethod === method ? 'border-amber-500 ring-2 ring-amber-200 dark:ring-amber-600/50 bg-amber-50 dark:bg-slate-700' : 'border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700'}`}
                >
                    <div className="flex items-center gap-3">
                        {method === 'GCash' && <Smartphone size={20} className="text-blue-500" />}
                        {method === 'Paymaya' && <Smartphone size={20} className="text-green-500" />}
                        {method === 'Credit cards' && <CreditCard size={20} className="text-purple-500" />}
                        <span className="font-medium text-sm text-gray-800 dark:text-gray-200">{method}</span>
                    </div>
                    {/* Optionally add 'Recommended' tag */}
                </button>
            ))}
        </div>

        <div className="flex gap-4">
          <button onClick={onBack} className="flex-1 py-3 text-sm font-semibold rounded-lg border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">Back</button>
          <button onClick={onConfirm} className="flex-1 py-3 bg-amber-400 text-stone-900 text-sm font-bold rounded-lg hover:bg-amber-500 transition-colors">Confirm</button>
        </div>
      </div>
    );
};

export default ChooseMethodStep;
