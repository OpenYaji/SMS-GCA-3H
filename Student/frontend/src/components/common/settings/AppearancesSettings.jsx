import React, { useState } from 'react';
import { Monitor, Sun, Moon, Check } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

const AppearancesSettings = () => {
  const { theme, accentColor, changeTheme, changeAccentColor } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [selectedAccent, setSelectedAccent] = useState(accentColor);
  const [hasChanges, setHasChanges] = useState(false);

  const themes = [
    { id: 'dark', name: 'Dark', icon: <Moon />, previewClass: 'bg-gray-900' },
    { id: 'light', name: 'Light', icon: <Sun />, previewClass: 'bg-white border-2 border-gray-200' },
  ];

  const accentColors = [
    { id: 'green', name: 'Green', className: 'bg-green-400' },
    { id: 'amber', name: 'Amber', className: 'bg-amber-400' },
    { id: 'rose', name: 'Rose', className: 'bg-rose-500' },
    { id: 'orange', name: 'Orange', className: 'bg-orange-500' },
  ];

  const handleThemeSelect = (themeId) => {
    setSelectedTheme(themeId);
    setHasChanges(themeId !== theme || selectedAccent !== accentColor);
  };

  const handleAccentSelect = (colorId) => {
    setSelectedAccent(colorId);
    setHasChanges(selectedTheme !== theme || colorId !== accentColor);
  };

  const handleSaveChanges = () => {
    changeTheme(selectedTheme);
    changeAccentColor(selectedAccent);
    setHasChanges(false);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Appearances Settings
      </h2>

      <div className="mb-8">
        <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-4">Theme</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {themes.map((themeOption) => (
            <div key={themeOption.id} className="relative group">
              <button
                onClick={() => handleThemeSelect(themeOption.id)}
                className={`w-full h-24 rounded-lg transition-all ${themeOption.previewClass} ${selectedTheme === themeOption.id
                  ? 'ring-2 ring-amber-500 ring-offset-2 dark:ring-offset-slate-800'
                  : ''
                  } flex items-center justify-center`}
              >
                {selectedTheme === themeOption.id && (
                  <Check className="w-8 h-8 text-amber-500" />
                )}
              </button>
              <div className="flex items-center justify-center gap-2 mt-2">
                <input
                  type="radio"
                  id={themeOption.id}
                  name="theme"
                  value={themeOption.id}
                  checked={selectedTheme === themeOption.id}
                  onChange={() => handleThemeSelect(themeOption.id)}
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-slate-700"
                />
                <label htmlFor={themeOption.id} className="text-sm font-medium text-gray-600 dark:text-gray-400 cursor-pointer">
                  {themeOption.name}
                </label>
              </div>
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs font-bold rounded-md px-2 py-1 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-in-out whitespace-nowrap z-10">
                Set theme to {themeOption.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-4">Accent Color</h3>
        <div className="flex items-center gap-4">
          {accentColors.map((color) => (
            <div key={color.id} className="relative group">
              <button
                onClick={() => handleAccentSelect(color.id)}
                className={`w-10 h-10 rounded-full transition-all ${color.className} ${selectedAccent === color.id
                  ? 'ring-2 ring-offset-2 dark:ring-offset-slate-800 ring-gray-800 dark:ring-gray-200'
                  : ''
                  } flex items-center justify-center`}
              >
                {selectedAccent === color.id && (
                  <Check className="w-5 h-5 text-white" strokeWidth={3} />
                )}
              </button>
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs font-bold rounded-md px-2 py-1 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-in-out whitespace-nowrap z-10">
                Set accent to {color.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        {hasChanges && (
          <div className="relative group">
            <button
              onClick={() => {
                setSelectedTheme(theme);
                setSelectedAccent(accentColor);
                setHasChanges(false);
              }}
              className="bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors"
            >
              Cancel
            </button>
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs font-bold rounded-md px-2 py-1 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-in-out whitespace-nowrap z-10">
              Discard changes
            </span>
          </div>
        )}
        <div className="relative group">
          <button
            onClick={handleSaveChanges}
            disabled={!hasChanges}
            className="bg-amber-400 text-stone-900 font-bold py-2 px-6 rounded-lg hover:bg-amber-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Changes
          </button>
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs font-bold rounded-md px-2 py-1 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-in-out whitespace-nowrap z-10">
            {hasChanges ? 'Save appearance settings' : 'No changes to save'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AppearancesSettings;