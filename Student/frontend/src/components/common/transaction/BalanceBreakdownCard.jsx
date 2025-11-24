import React from 'react';
import { Link } from 'react-router-dom';
const BalanceBreakdownCard = ({ breakdownData }) => {
  const {
    breakdownItems = [],
    totalAmount = 0,
    paidAmount = 0,
    balanceAmount = 0
  } = breakdownData || {};

  const hasBalance = balanceAmount > 0;

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 shadow-md h-full flex flex-col">
      <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4">Balance Breakdown</h3>
      
      <div className="flex-grow space-y-3">
        {breakdownItems.length > 0 ? (
          <>
            {breakdownItems.map((item) => (
              <div key={item.description} className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">{item.description}</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  ₱ {parseFloat(item.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}

            <div className="pt-2">
                <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-gray-700 dark:text-gray-300">Total Due</span>
                    <span className="text-gray-900 dark:text-gray-100">
                        ₱ {parseFloat(totalAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                </div>
            </div>

            {paidAmount > 0 && (
                <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-green-600 dark:text-green-400">Downpayment</span>
                    <span className="text-green-600 dark:text-green-400">
                        - ₱ {parseFloat(paidAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                </div>
            )}
            
            <hr className="border-gray-200 dark:border-slate-600 !my-4" />

            <div className="flex justify-between items-center text-base font-bold">
              <span className="text-gray-800 dark:text-gray-100">Remaining Balance</span>
              <span className="text-red-500 dark:text-red-400">
                ₱ {parseFloat(balanceAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">No outstanding balance for the current school year.</p>
        )}
      </div>

      <div className="relative group mt-4">
      <Link to='payment-portal'>
        <button 
          className="w-full bg-[#F3D67D] text-stone-900 font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed" 
          disabled={!hasBalance}
        >
         Pay Now
        </button>
        </Link>
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs font-bold rounded-md px-2 py-1 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-in-out whitespace-nowrap z-10">
          Proceed to Payment Portal
        </span>
      </div>
    </div>
  );
};

export default BalanceBreakdownCard;