import React, { useState } from 'react';
import Tabs from "@/components/ui/Tabs";
import CR from './cr/cr';
import AS from './as/as';
const StudentTabs = () => {
  const [activeTab, setActiveTab] = useState('cr');

  const tabs = [
    { id: 'cr', label: 'Class Rosters' },
      { id: 'as', label: 'All Students' }
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
        {activeTab === 'cr' && <CR />}
        {activeTab === 'as' && <AS />}

      </div>
    </div>
  );
};

export default StudentTabs; // Make sure this line says "export default"