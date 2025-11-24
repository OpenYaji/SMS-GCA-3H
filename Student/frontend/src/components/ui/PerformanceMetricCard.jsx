import React from 'react';

const PerformanceMetricCard = ({ title, value, description, valueColorClass }) => {
  return (
    <div className="flex h-full flex-col justify-center rounded-xl bg-white p-4 text-center shadow-md dark:bg-slate-800">
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <p className={`my-1 text-2xl font-bold ${valueColorClass}`}>{value}</p>
      <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
};

export default PerformanceMetricCard;