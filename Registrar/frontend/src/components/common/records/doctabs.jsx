import React, { useState } from 'react';
import Tabs from "@/components/ui/Tabs";
import DocumentRequests from './DocumentRequests';
import CompletedRequestHistory from './CompletedRequest';
import ArchiveSearch from './archivesearch';
const Doct = () => {
  const [activeTab, setActiveTab] = useState('dr');

  const tabs = [
    { id: 'dr', label: 'Document Request' },
    { id: 'crr', label: 'Completed Request' },
    { id: 'ass', label: 'Archive Request' }
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
        {activeTab === 'dr' && <DocumentRequests />}
        {activeTab === 'crr' && <CompletedRequestHistory />}
        {activeTab === 'ass' && <ArchiveSearch />}
      </div>
    </div>
  );
};

export default Doct; // Make sure this line says "export default"