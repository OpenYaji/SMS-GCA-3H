import React from "react";

const Tabs = ({ activeTab, onTabChange, tabs }) => {
  return (
    <div className="mb-6">
      <nav className="flex space-x-4 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-8 py-2 rounded-lg font-kumbh text-base font-medium transform transition-all duration-300 shadow-inner shadow-gray-300 dark:shadow-gray-700 ${
              activeTab === tab.id
                ? "bg-yellow-400 text-gray-900 shadow-[0_4px_10px_rgba(0,0,0,0.25)] scale-[1.02]"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:-translate-y-1 hover:shadow-[0_6px_12px_rgba(0,0,0,0.25)] border border-gray-200 dark:border-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Tabs;
