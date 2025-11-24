import React from 'react';
import { CheckCircle, Award, TrendingUp } from 'lucide-react';

const SummaryCard = ({ title, value, icon, unit = '' }) => (
  <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 flex items-center gap-4 shadow-sm">
    <div className="p-3 bg-blue-100 dark:bg-slate-700 rounded-full text-blue-600 dark:text-blue-400">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}{unit}</p>
    </div>
  </div>
);

const PreviousGradesSummary = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <SummaryCard 
        title="Final General Average" 
        value={data.finalAverage} 
        icon={<TrendingUp size={24} />} 
      />
      <SummaryCard 
        title="Attendance Rate" 
        value={data.attendanceRate} 
        unit="%" 
        icon={<CheckCircle size={24} />} 
      />
      <SummaryCard 
        title="Academic Standing" 
        value={data.academicStanding} 
        icon={<Award size={24} />} 
      />
    </div>
  );
};

export default PreviousGradesSummary;