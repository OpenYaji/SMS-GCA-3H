import React from 'react';
import { CheckCircle } from 'lucide-react';
import StepIndicator from './StepIndicator'; // Import StepIndicator

const SuccessStep = ({ onReturn, onViewSummary }) => (
    <div>
        {/* Show final step indicator */}
        <StepIndicator currentStep={3} />
        <div className="flex flex-col items-center justify-center text-center py-8 min-h-[200px]">
            <CheckCircle size={64} className="text-green-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Payment Successful</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs">Your payment has been processed. A confirmation receipt has been sent to your email.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={onReturn} className="flex-1 py-3 text-sm font-semibold rounded-lg border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">Return to Dashboard</button>
          <button onClick={onViewSummary} className="flex-1 py-3 bg-amber-400 text-stone-900 text-sm font-bold rounded-lg hover:bg-amber-500 transition-colors">Payment Summary</button>
        </div>
    </div>
);

export default SuccessStep;
