import React, { useState } from 'react';
import Tabs from "@/components/ui/Tabs";
import EnrollmentCompletion from './EnrollmentCompletion/index';
import FinancialHolds from './FinancialHolds/index';

const TransactTab = () => {
  const [activeTab, setActiveTab] = useState('enrollment');

  const tabs = [
    { id: 'enrollment', label: 'Payment Confirmation' },
    { id: "financial-holds", label: "Financial Holds" },
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
      </div>
    </div>
  );
};

export default TransactTab; // Make sure this line says "export default"