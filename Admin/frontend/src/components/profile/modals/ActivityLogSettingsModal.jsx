import React, { useState, useEffect } from "react";
import { activitySettingsService } from "../../../services/activitySettingsService";

const ActivityLogSettingsModal = ({ show, onClose, onSave }) => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await activitySettingsService.getActivitySettings();
        setSettings(data);
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setLoading(false);
      }
    };

    if (show) {
      loadSettings();
    }
  }, [show]);

  const handleToggleSetting = (categoryIndex, settingIndex) => {
    setSettings((prev) => {
      const newSettings = [...prev];
      newSettings[categoryIndex].settings[settingIndex].enabled =
        !newSettings[categoryIndex].settings[settingIndex].enabled;
      return newSettings;
    });
  };

  const handleToggleCategory = (categoryIndex) => {
    setSettings((prev) => {
      const newSettings = [...prev];
      const category = newSettings[categoryIndex];
      const allEnabled = category.settings.every((setting) => setting.enabled);

      category.settings.forEach((setting) => {
        setting.enabled = !allEnabled;
      });

      return newSettings;
    });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-md">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] mx-4 flex flex-col transition-colors duration-300">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white font-kumbh">
              Activity Log Settings
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1 font-kumbh">
              Customize what types of activity will you receive
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Loading settings...
              </div>
            ) : (
              <div className="space-y-6">
                {settings.map((category, categoryIndex) => (
                  <div
                    key={category.category}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    {/* Category Header */}
                    <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white font-kumbh">
                          {category.category}
                        </h3>
                        <button
                          onClick={() => handleToggleCategory(categoryIndex)}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-kumbh"
                        >
                          {category.settings.every((s) => s.enabled)
                            ? "Deselect All"
                            : "Select All"}
                        </button>
                      </div>
                    </div>

                    {/* Settings List */}
                    <div className="p-4 space-y-4">
                      {category.settings.map((setting, settingIndex) => (
                        <label
                          key={setting.id}
                          className="flex items-start space-x-4 cursor-pointer group"
                        >
                          <div className="flex items-center h-5 mt-0.5">
                            <input
                              type="checkbox"
                              checked={setting.enabled}
                              onChange={() =>
                                handleToggleSetting(categoryIndex, settingIndex)
                              }
                              className="w-4 h-4 text-yellow-400 border-gray-300 dark:border-gray-600 rounded focus:ring-yellow-400 dark:focus:ring-yellow-500 transition-colors bg-white dark:bg-gray-800"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium text-gray-900 dark:text-white font-kumbh block group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                              {setting.name}
                            </span>
                            {setting.description && (
                              <span className="text-xs text-gray-500 dark:text-gray-400 font-kumbh block mt-2 leading-relaxed">
                                {setting.description}
                              </span>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer*/}
        <div className="flex-shrink-0 flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium font-kumbh transition-colors border border-white/30"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-6 py-2.5 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium font-kumbh transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogSettingsModal;
