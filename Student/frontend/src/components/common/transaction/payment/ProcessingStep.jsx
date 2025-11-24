import React from 'react';
import { Loader2 } from 'lucide-react';
import StepIndicator from './StepIndicator'; // Import StepIndicator

const ProcessingStep = () => (
    // Wrap content for consistent height/alignment if needed
    <div className="min-h-[300px] flex flex-col justify-center">
        {/* Step indicator can be shown during processing too */}
         <StepIndicator currentStep={3} />
         <div className="flex flex-col items-center justify-center text-center flex-grow">
            <Loader2 size={48} className="text-green-500 animate-spin mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Processing Payment...</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Take a few seconds. Please wait.</p>
        </div>
    </div>
);

export default ProcessingStep;
