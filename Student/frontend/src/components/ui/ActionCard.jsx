import React from 'react';

const ActionCard = ({ title, buttonText, onButtonClick }) => {
  const isDownload = buttonText.toLowerCase() === 'download';
  const buttonClasses = isDownload
    ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
    : 'bg-amber-400 hover:bg-amber-500 text-amber-900';

  return (
    <div className="flex flex-col items-center justify-center rounded-xl bg-white p-6 text-center shadow-md dark:bg-slate-800">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
        <svg className="h-6 w-6 text-slate-500 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h4 className="mb-4 font-semibold text-gray-800 dark:text-white">{title}</h4>
      <button
        onClick={onButtonClick}
        className={`w-full rounded-lg px-4 py-2 text-sm font-bold transition-colors ${buttonClasses}`}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default ActionCard;