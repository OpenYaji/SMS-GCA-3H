import React from "react";
import TransactTab from "../common/transaction/transactTab";

const TransactionPage = () => {
  return (
    <>
     <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Transaction</h1>
      <TransactTab />
    </div>
    </>
  );
};

export default TransactionPage;
