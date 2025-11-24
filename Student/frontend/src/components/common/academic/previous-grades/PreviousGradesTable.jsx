import React, { useState } from 'react';
import { Search } from 'lucide-react';

const PreviousGradesTable = ({ subjects }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const getRemarkColor = (remarks) => {
        if (remarks === 'Passed') return 'text-green-600 dark:text-green-400';
        if (remarks === 'Failed') return 'text-red-600 dark:text-red-400';
        return 'text-gray-600 dark:text-gray-400';
    };

    const filteredSubjects = subjects.filter(subject =>
        subject.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const generalAverage = (subjects.reduce((acc, curr) => acc + curr.final, 0) / subjects.length).toFixed(2);

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 shadow-md">
      <div className="flex justify-end mb-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Search subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-slate-700/50 text-gray-500 dark:text-gray-400">
            <tr>
              <th className="p-3 font-semibold">Subjects</th>
              <th className="p-3 font-semibold text-center">1</th>
              <th className="p-3 font-semibold text-center">2</th>
              <th className="p-3 font-semibold text-center">3</th>
              <th className="p-3 font-semibold text-center">4</th>
              <th className="p-3 font-semibold text-center">Final Grade</th>
              <th className="p-3 font-semibold">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubjects.map((subject) => (
              <tr key={subject.id} className="border-b border-gray-100 dark:border-slate-700">
                <td className="p-3 font-semibold text-gray-800 dark:text-gray-200">{subject.name}</td>
                <td className="p-3 text-center">{subject.q1}</td>
                <td className="p-3 text-center">{subject.q2}</td>
                <td className="p-3 text-center">{subject.q3}</td>
                <td className="p-3 text-center">{subject.q4}</td>
                <td className="p-3 font-bold text-center text-gray-800 dark:text-gray-100">{subject.final}</td>
                <td className={`p-3 font-semibold ${getRemarkColor(subject.remarks)}`}>{subject.remarks}</td>
              </tr>
            ))}
            <tr className="bg-blue-50 dark:bg-blue-900/20 font-bold">
                <td className="p-3" colSpan="5">Final General Average</td>
                <td className="p-3 text-center text-blue-700 dark:text-blue-400">{generalAverage}</td>
                <td className="p-3"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PreviousGradesTable;