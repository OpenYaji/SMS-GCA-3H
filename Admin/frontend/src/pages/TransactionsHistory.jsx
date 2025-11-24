import React, { useState, useEffect } from "react";
import TransactionsTable from "../components/transactionshistory/TransactionsTable";
import transactionService from "../services/transactionService";

const TransactionsHistory = ({ darkmode }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await transactionService.getTransactions();

        if (result.success) {
          const transformedData = result.data.map((transaction, index) => ({
            no: index + 1,
            id: `TXN-${transaction.TransactionID}`,
            type:
              transaction.Items.length > 0
                ? transaction.Items.map((item) => item.Type).join(", ")
                : "N/A",
            user: `${transaction.Student.FirstName} ${transaction.Student.LastName}`,
            date: new Date(transaction.IssueDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
            amount: transaction.TotalAmount,
            balance: transaction.BalanceAmount,
            avatar: String.fromCharCode(9312 + index),
          }));
          setTransactions(transformedData);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError("An unexpected error occurred while fetching transactions");
        console.error("Error in TransactionsHistory:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[whitesmoke] dark:bg-gray-900 pl-5 pr-6 pb-6 pt-4 font-kumbh">
        <div className="max-w-7xl mx-auto mt-0">
          <div className="rounded-3xl px-8 py-3 mb-6 shadow-md bg-gradient-to-r from-yellow-500 to-yellow-400 dark:from-gray-700 dark:to-gray-800">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="font-spartan text-[2.5em] font-extrabold text-white mb-[0px] [text-shadow:5px_1px_2px_rgba(0,0,0,0.3)]">
                  Transaction History
                </h1>
                <p className="text-white font-regular font-spartan text-[1.1em]">
                  View all payment transactions and history
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
            <div className="text-gray-600 dark:text-gray-400">
              Loading transactions...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[whitesmoke] dark:bg-gray-900 pl-5 pr-6 pb-6 pt-4 font-kumbh">
        <div className="max-w-7xl mx-auto mt-0">
          <div className="rounded-3xl px-8 py-3 mb-6 shadow-md bg-gradient-to-r from-yellow-500 to-yellow-400 dark:from-gray-700 dark:to-gray-800">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="font-spartan text-[2.5em] font-extrabold text-white mb-[0px] [text-shadow:5px_1px_2px_rgba(0,0,0,0.3)]">
                  Transaction History
                </h1>
                <p className="text-white font-regular font-spartan text-[1.1em]">
                  View all payment transactions and history
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
            <div className="text-red-600 dark:text-red-400 mb-4">
              Error: {error}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[whitesmoke] dark:bg-gray-900 pl-5 pr-6 pb-6 pt-4 font-kumbh">
      <div className="max-w-7xl mx-auto mt-0">
        {/* Banner */}
        <div className="rounded-3xl px-8 py-3 mb-6 shadow-md bg-gradient-to-r from-yellow-500 to-yellow-400 dark:from-gray-700 dark:to-gray-800">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-spartan text-[2.5em] font-extrabold text-white mb-[0px] [text-shadow:5px_1px_2px_rgba(0,0,0,0.3)]">
                Transaction History
              </h1>
              <p className="text-white font-regular font-spartan text-[1.1em]">
                View all payment transactions and history
              </p>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <TransactionsTable transactions={transactions} darkmode={darkmode} />
      </div>
    </div>
  );
};

export default TransactionsHistory;
