import React, { useState } from 'react';
import AppearancesSettings from '../common/settings/AppearancesSettings';
import NotificationsSettings from '../common/settings/NotificationsSettings';
import SecuritySettings from '../common/settings/SecuritySettings';
import AccessibilitySettings from '../common/settings/AccessibilitySettings';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('Appearances');

  const tabs = [
    { id: 'Notifications', label: 'Notifications', tooltipText: 'Manage your notifications' },
    { id: 'Appearances', label: 'Appearances', tooltipText: 'Customize the look and feel' },
    { id: 'Security', label: 'Security', tooltipText: 'Manage your account security' },
    { id: 'Accessibility', label: 'Accessibility', tooltipText: 'Adjust accessibility settings' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Notifications':
        return <NotificationsSettings />;
      case 'Appearances':
        return <AppearancesSettings />;
      case 'Security':
        return <SecuritySettings />;
      case 'Accessibility':
        return <AccessibilitySettings />;
      default:
        return <AppearancesSettings />;
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Settings
      </h1>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        {tabs.map((tab) => (
          <div key={tab.id} className="relative group">
            <button
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors duration-300 ${
                activeTab === tab.id
                  ? 'bg-amber-400 text-stone-900'
                  : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs font-bold rounded-md px-2 py-1 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-in-out whitespace-nowrap z-10">
              {tab.tooltipText}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 md:p-8 shadow-md">
        {renderContent()}
      </div>
    </>
  );
};

export default SettingsPage;