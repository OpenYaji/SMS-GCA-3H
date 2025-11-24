import React, { useState, useRef, useEffect } from "react";

const SortDropdown = ({ onSortChange, currentSort }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const sortOptions = [
    { value: "all", label: "All Schedules" },
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "date-newest", label: "Date (Newest First)" },
    { value: "date-oldest", label: "Date (Oldest First)" },
    { value: "position-asc", label: "Position (A-Z)" },
    { value: "position-desc", label: "Position (Z-A)" },
  ];

  const currentOption =
    sortOptions.find((opt) => opt.value === currentSort) || sortOptions[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionClick = (option) => {
    onSortChange(option.value);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium font-kumbh min-w-[140px] transition-colors text-gray-900 dark:text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          className="text-gray-600 dark:text-gray-400"
        >
          <path
            fill="currentColor"
            d="M3 18v-2h6v2zm0-5v-2h12v2zm0-5V6h18v2z"
          />
        </svg>
        <span className="flex-1 text-left">{currentOption.label}</span>
        <span className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <ul className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 py-1">
          {sortOptions.map((option) => (
            <li
              key={option.value}
              onClick={() => handleOptionClick(option)}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 font-kumbh text-sm ${
                currentSort === option.value
                  ? "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SortDropdown;
