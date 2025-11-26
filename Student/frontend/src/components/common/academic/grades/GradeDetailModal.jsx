import React from 'react';
import { X } from 'lucide-react';

const GradeDetailModal = ({ subject, onClose }) => {
  if (!subject) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg animate-fade-in-down">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{subject.name} - Grade Details</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            {Object.entries(subject.details).map(([key, value]) => {
              if (key === 'comments') return null; 
              return (
                <div key={key} className="flex justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                  <span className="capitalize text-gray-600 dark:text-gray-400">{key}</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">{value}</span>
                </div>
              );
            })}
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Teacher's Comments:</h3>
            <p className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 rounded-lg text-sm italic">
              "{subject.details.comments}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradeDetailModal;