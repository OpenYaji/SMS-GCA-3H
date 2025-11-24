import React from 'react';

const StepIndicator = ({ currentStep }) => {
  const steps = 5; // Updated to 5 steps
  return (
    <div className="flex items-center justify-center space-x-2 mb-6">
      {[...Array(steps)].map((_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber <= currentStep;
        return (
          <React.Fragment key={stepNumber}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isActive ? 'bg-amber-400 border-amber-400' : 'bg-gray-200 dark:bg-slate-600 border-gray-200 dark:border-slate-600'}`}>
              {isActive ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-stone-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span className="text-xs font-bold text-gray-400 dark:text-gray-300"></span>
              )}
            </div>
            {stepNumber < steps && (
              <div className={`flex-1 h-1 rounded transition-all duration-300 ${stepNumber < currentStep ? 'bg-amber-400' : 'bg-gray-200 dark:bg-slate-600'}`}></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepIndicator;
