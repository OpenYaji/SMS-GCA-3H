import React from 'react';

// Function to format the number as Philippine Peso (PHP) currency
const formatPeso = (amount) => {
    // Ensure the amount is treated as a number
    const numericAmount = parseFloat(amount);
    
    if (isNaN(numericAmount)) {
        return '₱ 0.00'; // Return a default value if the data is not a valid number
    }

    // Use the Intl.NumberFormat object for standardized currency formatting
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2,
    }).format(numericAmount);
};

const SummaryCards = ({ stats }) => {
  // Destructure the stat object to clearly use the data
  const { 
      activeHolds, 
      midtermHolds, 
      totalTuitionCollected, // This is the new key from your PHP backend
      clearedThisQuarter 
  } = stats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      
      {/* Active Financial Holds Card */}
      <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
        <h3 className="text-gray-800 dark:text-white font-semibold">Active Financial Holds</h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeHolds}</p>
      </div>
      
      {/* Midterm Exam Holds Card */}
      <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
        <h3 className="text-gray-800 dark:text-white font-semibold">Midterm Exam Holds</h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{midtermHolds}</p>
      </div>
      
      {/* Total Tuition Collected Card (WITH PESO FORMATTING) */}
      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
        <h3 className="text-gray-800 dark:text-white font-semibold">Total Tuition Collected</h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {formatPeso(totalTuitionCollected)}
        </p>
      </div>
      
      {/* Cleared This Quarter Card */}
      <div className="bg-[#3C2F2F] dark:bg-slate-800 p-4 rounded-lg border border-[#3C2F2F] dark:border-slate-700">
        <h3 className="text-white dark:text-white font-semibold">Cleared This Quarter</h3>
        <p className="text-2xl font-bold text-white dark:text-white">{clearedThisQuarter}</p>
      </div>
    </div>
  );
};

export default SummaryCards;