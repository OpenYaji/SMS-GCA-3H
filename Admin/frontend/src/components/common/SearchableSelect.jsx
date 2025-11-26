import { useState } from "react";
import { ChevronDown, AlertCircle } from "lucide-react";

/**
 * Searchable Select Component with error handling
 * @param {Object} props - Component props
 */
export default function SearchableSelect({
  label,
  name,
  icon: Icon,
  placeholder,
  value,
  onChange,
  options = [],
  loading,
  disabled,
  required = true,
  error,
  darkMode = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = Array.isArray(options)
    ? options.filter((opt) =>
        opt?.name?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const selectedOption = Array.isArray(options)
    ? options.find((opt) => opt.code === value)
    : null;

  const handleSelect = (option) => {
    if (option && option.code) {
      onChange({ target: { name, value: option.code } }, option);
      setIsOpen(false);
      setSearch("");
    }
  };

  return (
    <div className="mb-3">
      {label && (
        <label
          className={`block mb-1 capitalize ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {label}
          {!required && (
            <span className="text-gray-400 text-sm ml-1">(optional)</span>
          )}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 z-10" />
        )}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full border rounded-lg ${
            Icon ? "pl-10" : "pl-3"
          } pr-10 py-2 text-left focus:ring-2 outline-none ${
            disabled
              ? darkMode
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-gray-100 cursor-not-allowed"
              : darkMode
              ? "bg-gray-700"
              : "bg-white"
          } ${
            error
              ? "border-red-500 focus:ring-red-400"
              : "border-gray-300 focus:ring-yellow-400"
          } ${darkMode ? "text-white" : "text-gray-900"}`}
        >
          {loading ? (
            <span className="text-gray-400">Loading...</span>
          ) : selectedOption ? (
            <span>{selectedOption.name}</span>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </button>
        <ChevronDown className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />

        {isOpen && !disabled && (
          <div
            className={`absolute z-50 w-full mt-1 border rounded-lg shadow-lg max-h-60 overflow-hidden ${
              darkMode
                ? "bg-gray-700 border-gray-600"
                : "bg-white border-gray-300"
            }`}
          >
            <div className="p-2 border-b border-gray-300 dark:border-gray-600">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className={`w-full px-3 py-1 border rounded focus:ring-2 focus:ring-yellow-400 outline-none ${
                  darkMode
                    ? "bg-gray-600 border-gray-500 text-white"
                    : "border-gray-300"
                }`}
                autoFocus
              />
            </div>
            <div className="overflow-y-auto max-h-48">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.code}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`w-full text-left px-4 py-2 transition-colors ${
                      darkMode
                        ? "hover:bg-gray-600 text-white"
                        : "hover:bg-yellow-50 text-gray-900"
                    }`}
                  >
                    {option.name}
                  </button>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-400">
                  {loading ? "Loading..." : "No results found"}
                </div>
              )}
            </div>
          </div>
        )}
        {error && (
          <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
