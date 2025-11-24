import React from 'react';
import { Plus, CreditCard, Smartphone } from 'lucide-react';

const PaymentMethodsCard = () => {
  const methods = [
    { name: 'GCash', icon: <CreditCard size={20} className="text-blue-500" /> },
    { name: 'Paymaya', icon: <Smartphone size={20} className="text-green-500" /> },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 shadow-md h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-800 dark:text-gray-100">Payment Methods</h3>
        
        <div className="relative group">
          <button className="flex items-center gap-1 text-sm font-semibold bg-gray-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
            <Plus size={16} />
            Add
          </button>

          <span className="
            absolute bottom-full left-1/2 -translate-x-1/2 mb-2
            bg-gray-900 text-white text-xs font-bold 
            rounded-md px-2 py-1 
            opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 
            transition-all duration-300 ease-in-out
            whitespace-nowrap
            z-10
          ">
            Add new payment method
          </span>
        </div>

      </div>
      <div className="space-y-3">
        {methods.map((method) => (
          <div key={method.name} className="flex justify-between items-center bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg">
            <div className="flex items-center gap-3">
              {method.icon}
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{method.name}</span>
            </div>
            <span className="text-sm font-mono text-gray-500 dark:text-gray-400">----</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodsCard;