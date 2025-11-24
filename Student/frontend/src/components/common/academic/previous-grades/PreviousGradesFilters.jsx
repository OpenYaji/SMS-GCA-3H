import React from 'react';
import { Calendar, GraduationCap, Download } from 'lucide-react';

const PreviousGradesFilters = ({ schoolYears, selectedYear, onYearChange, gradeLevel }) => {
  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-4 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <div className="relative w-full sm:w-48">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select 
            value={selectedYear}
            onChange={(e) => onYearChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 appearance-none focus:ring-2 focus:ring-amber-400 outline-none"
          >
            {schoolYears.map(year => <option key={year} value={year}>S.Y. {year}</option>)}
          </select>
        </div>
        
        <div className="relative w-full sm:w-48">
          <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <div className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700/50">
            {gradeLevel}
          </div>
        </div>
      </div>

      <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-400 text-stone-900 font-bold py-2 px-4 rounded-lg hover:bg-amber-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={!selectedYear}>
        <Download size={16} />
        Download Report Card
      </button>
    </div>
  );
};

export default PreviousGradesFilters;