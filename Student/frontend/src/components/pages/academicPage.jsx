import React from 'react';
import OverallPerformanceCard from '../common/academic/OverallPerformanceCard';
import TeacherFeedbackCard from '../common/academic/TeacherFeedbackCard';
import QuickActionsCard from '../common/academic/QuickActionsCard';

const AcademicPage = () => {
  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Academic Performance
      </h1>

      <div className="flex flex-col gap-6">

        <OverallPerformanceCard />
        <QuickActionsCard />
        <TeacherFeedbackCard />
        
      </div>
    </>
  );
};

export default AcademicPage;