import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';

const GradesTable = ({ subjects, onSubjectClick }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const getRemarkColor = (remarks) => {
    if (remarks === 'In Progress') return 'text-blue-600 dark:text-blue-400';
    if (remarks === 'Excellent') return 'text-green-600 dark:text-green-400';
    return 'text-gray-600 dark:text-gray-400';
  };
  
  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateGeneralAverage = () => {
    // Check if all subjects have final grades
    const allGradesComplete = filteredSubjects.every(
      subject => subject.final && !isNaN(subject.final)
    );
    
    if (!allGradesComplete) return 'N/A';
    
    const validGrades = filteredSubjects
      .map(subject => subject.final)
      .filter(grade => grade && !isNaN(grade));
    
    if (validGrades.length === 0) return 'N/A';
    
    const sum = validGrades.reduce((acc, grade) => acc + parseFloat(grade), 0);
    return (sum / validGrades.length).toFixed(1);
  };

  const getGeneralAverageRemark = (average) => {
    if (average === 'N/A') return 'In Progress';
    const avg = parseFloat(average);
    if (avg >= 90) return 'Excellent';
    if (avg >= 85) return 'Very Good';
    if (avg >= 80) return 'Good';
    if (avg >= 75) return 'Fair';
    return 'Needs Improvement';
  };

  const generalAverage = calculateGeneralAverage();
  const generalRemark = getGeneralAverageRemark(generalAverage);

  const [selectedQuarter, setSelectedQuarter] = useState('all');

  const getQuarterColumns = () => {
    if (selectedQuarter === 'all') {
      return [
        { key: 'q1', label: '1' },
        { key: 'q2', label: '2' },
        { key: 'q3', label: '3' },
        { key: 'q4', label: '4' }
      ];
    }
    return [{ key: selectedQuarter, label: selectedQuarter.replace('q', '') }];
  };

  const quarterColumns = getQuarterColumns();

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Search subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div className="relative w-full sm:w-auto">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select 
            value={selectedQuarter}
            onChange={(e) => setSelectedQuarter(e.target.value)}
            className="w-full sm:w-48 pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 appearance-none cursor-pointer"
          >
            <option value="all">All Quarters</option>
            <option value="q1">1st Quarter</option>
            <option value="q2">2nd Quarter</option>
            <option value="q3">3rd Quarter</option>
            <option value="q4">4th Quarter</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-slate-700/50 text-gray-500 dark:text-gray-400">
            <tr>
              <th className="p-3 font-semibold" rowSpan="2">Subjects</th>
              <th className="p-3 font-semibold text-center" colSpan={quarterColumns.length}>Quarter</th>
              <th className="p-3 font-semibold text-center" rowSpan="2">Final Grade</th>
              <th className="p-3 font-semibold" rowSpan="2">Remarks</th>
            </tr>
            <tr>
              {quarterColumns.map((quarter) => (
                <th key={quarter.key} className="p-3 font-semibold text-center border-t border-gray-200 dark:border-slate-600">
                  {quarter.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-gray-700 dark:text-gray-300">
            {filteredSubjects.map((subject) => (
              <tr 
                key={subject.id} 
                onClick={() => onSubjectClick(subject)}
                className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/30 cursor-pointer transition-colors"
              >
                <td className="p-3 font-semibold text-gray-800 dark:text-gray-200">{subject.name}</td>
                {quarterColumns.map((quarter) => (
                  <td key={quarter.key} className="p-3 text-center">
                    {subject[quarter.key] || 'N/A'}
                  </td>
                ))}
                <td className="p-3 font-bold text-center text-gray-800 dark:text-gray-100">{subject.final || 'N/A'}</td>
                <td className={`p-3 font-semibold ${getRemarkColor(subject.remarks)}`}>{subject.remarks || 'N/A'}</td>
              </tr>
            ))}
            <tr className="bg-amber-50 dark:bg-amber-900/20 font-bold">
              <td className="p-3 text-gray-800 dark:text-gray-200" colSpan={quarterColumns.length + 1}>General Average</td>
              <td className="p-3 text-center text-amber-700 dark:text-amber-400">{generalAverage}</td>
              <td className={`p-3 ${getRemarkColor(generalRemark)}`}>{generalRemark}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
};

export default GradesTable;