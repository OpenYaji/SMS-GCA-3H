import React from 'react';
import { Percent, Award, TrendingUp } from 'lucide-react';

const SummaryCard = ({ title, value, icon, unit = '' }) => (
  <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 flex items-center gap-4 shadow-sm">
    <div className="p-3 bg-amber-100 dark:bg-slate-700 rounded-full text-amber-600 dark:text-amber-400">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
        {value === 'N/A' ? value : `${value}${unit}`}
      </p>
    </div>
  </div>
);

const GradesSummary = ({ data, subjects }) => {
  // Check if all subjects have complete grades (all 4 quarters)
  const allGradesComplete = subjects && subjects.every(subject =>
    subject.q1 && subject.q2 && subject.q3 && subject.q4
  );

  // Calculate general average only if all grades are complete
  const displayGeneralAverage = allGradesComplete && data.generalAverage > 0
    ? data.generalAverage
    : 'N/A';

  // Academic standing should also be N/A if grades are incomplete
  const displayAcademicStanding = allGradesComplete
    ? data.academicStanding
    : 'In Progress';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <SummaryCard
        title="General Average"
        value={displayGeneralAverage}
        icon={<TrendingUp size={24} />}
      />
      <SummaryCard
        title="Attendance Rate"
        value={data.attendanceRate}
        unit="%"
        icon={<Percent size={24} />}
      />
      <SummaryCard
        title="Academic Standing"
        value={displayAcademicStanding}
        icon={<Award size={24} />}
      />
    </div>
  );
};

export default GradesSummary;