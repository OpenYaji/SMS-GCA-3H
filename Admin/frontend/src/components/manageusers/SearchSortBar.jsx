import { useState, useEffect, useRef } from "react";

/**
 * Props:
 * - searchValue, onSearchChange
 * - sortValue, onSortChange
 * - rowsLabel (string) optional (e.g., "Students")
 * - darkMode (boolean) optional
 */
export default function SearchSortBar({
  searchValue,
  onSearchChange,
  sortValue,
  onSortChange,
  rowsLabel = "Students",
  darkMode = false,
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const sortOptions = [
    { key: "all", label: "All Students" },
    { key: "newest-first", label: "Newest First" },
    { key: "alphabetical", label: "A - Z" },
    { key: "alphabetical-reverse", label: "Z - A" },
    { key: "grade-high-low", label: "Grade (high → low)" },
    { key: "grade-low-high", label: "Grade (low → high)" },
    { key: "archived", label: "Archived Students" },
  ];

  const activeLabel =
    sortOptions.find((o) => o.key === sortValue)?.label || "Sort by";

  return (
    <div className="flex gap-3 items-center">
      <div ref={containerRef} className="relative">
        <button
          id="sortButton"
          onClick={() => setOpen((s) => !s)}
          className={`flex items-center gap-2 border px-4 py-2 rounded-lg focus:outline-none ${
            darkMode
              ? "border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-300"
              : "border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M3 18v-2h6v2zm0-5v-2h12v2zm0-5V6h18v2z"
            />
          </svg>
          <span className="text-sm">{activeLabel}</span>
          <span
            className={
              "ml-2 transition-transform " + (open ? "rotate-180" : "")
            }
          >
            ▾
          </span>
        </button>

        {open && (
          <ul
            className={`absolute left-0 mt-2 w-56 border rounded-md shadow-lg z-50 ${
              darkMode
                ? "bg-gray-700 border-gray-600"
                : "bg-white border-gray-200"
            }`}
          >
            {sortOptions.map((opt) => (
              <li
                key={opt.key}
                onClick={() => {
                  onSortChange(opt.key);
                  setOpen(false);
                }}
                className={`px-4 py-2 text-sm cursor-pointer ${
                  darkMode
                    ? "text-gray-300 hover:bg-gray-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      <input
        type="text"
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={`Search ${rowsLabel} by name or email`}
        className={`flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400 outline-none ${
          darkMode
            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            : "border-gray-300 text-gray-900"
        }`}
      />
    </div>
  );
}
