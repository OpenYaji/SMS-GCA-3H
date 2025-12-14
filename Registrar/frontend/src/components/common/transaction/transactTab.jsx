import React, { useState } from 'react';
import Tabs from "@/components/ui/Tabs";
import EnrollmentCompletion from './EnrollmentCompletion/index';
import FinancialHolds from './FinancialHolds/index';
import FinancialHoldsArchive from './FinancialHolds/financialHoldsArchive';
const TransactTab = () => {
  const [activeTab, setActiveTab] = useState('enrollment');

  const tabs = [
    { id: 'enrollment', label: 'Payment Confirmation' },
    { id: "financial-holds", label: "Financial Holds" },
    { id: "fa", label: "Financial Archives"}
  ];

  return (
    <div className="w-full">
      <Tabs 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        variant="underline"
      />

      <div className="py-4">
        {activeTab === 'enrollment' && <EnrollmentCompletion />}
        {activeTab === "financial-holds" && <FinancialHolds />}
        {activeTab === "fa" && <FinancialHoldsArchive/>}
      </div>
    </div>
  );
};

export default TransactTab; // Make sure this line says "export default"