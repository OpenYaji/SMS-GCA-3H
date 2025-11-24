import React from 'react';
import { Calendar, ChevronsUpDown, Banknote } from 'lucide-react';

const PaymentHistoryTable = ({ history }) => {
  const statusColors = {
    Verified: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    Paid: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', // Alias for Verified
    Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    Rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
      });
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 shadow-md">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h3 className="font-bold text-gray-800 dark:text-gray-100">Payment History</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400">
            <tr>
              <th className="p-3 font-medium">Purpose</th>
              <th className="p-3 font-medium">Method</th>
              <th className="p-3 font-medium">Date/Time</th>
              <th className="p-3 font-medium">Cost</th>
              <th className="p-3 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {history && history.length > 0 ? (
              history.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-slate-700/50">
                  <td className="p-3 font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-3">
                    <div className="bg-orange-100 dark:bg-orange-900/50 p-2 rounded-full">
                      <Banknote size={16} className="text-orange-500" />
                    </div>
                    {item.purpose || 'Payment'}
                  </td>
                  <td className="p-3 text-gray-600 dark:text-gray-400">{item.method}</td>
                  <td className="p-3 text-gray-600 dark:text-gray-400">{formatDate(item.dateTime)}</td>
                  <td className="p-3 text-gray-600 dark:text-gray-400">₱ {parseFloat(item.cost).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="p-3 text-right">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${statusColors[item.status] || 'bg-gray-100 text-gray-700'}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No payment history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistoryTable;
