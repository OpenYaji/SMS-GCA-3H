import React from "react";

const GradeLevelTabs = ({ activeTab, onChange, gradeLevels = [] }) => {
  if (gradeLevels.length === 0) {
    return (
      <div className="flex justify-center px-3 mb-4">
        <p className="text-gray-500 dark:text-gray-400 font-kumbh">
          No grade levels available
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-between flex-wrap px-3 mb-4 w-full gap-7">
      {gradeLevels.map((level) => (
        <button
          key={level.id}
          onClick={() => onChange(level.levelName)}
          className={`flex-1 mx-1 py-3 rounded-lg font-kumbh text-base transform transition-all duration-300 shadow-inner shadow-gray-300 dark:shadow-gray-700 ${
            activeTab === level.levelName
              ? "bg-yellow-400 text-gray-900 shadow-[0_4px_10px_rgba(0,0,0,0.25)] scale-[1.02]"
              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:-translate-y-1 hover:shadow-[0_6px_12px_rgba(0,0,0,0.25)]"
          }`}
        >
          {level.levelName}
        </button>
      ))}
    </div>
  );
};

export default GradeLevelTabs;
