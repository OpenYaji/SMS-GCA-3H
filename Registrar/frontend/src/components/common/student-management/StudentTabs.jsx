import React, { useState } from 'react';
import Tabs from "@/components/ui/Tabs";
import ClassRosters from './ClassRosters/index';
import AllStudents from './AllStudents/index';
import AllStudentsPage from './AllStudents/AllStudentsPage';
import CR from './cr/cr';

const StudentTabs = () => {
  const [activeTab, setActiveTab] = useState('cr');

  const tabs = [
    { id: 'cr', label: 'Class Rosters' },
    { id: 'all', label: 'All Students' }
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
        {activeTab === 'all' && <AllStudentsPage />}
      </div>
    </div>
  );
};

export default StudentTabs; // Make sure this line says "export default"