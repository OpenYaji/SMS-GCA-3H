import React from "react";

const StudentsFilters = ({
  search,
  setSearch,
  gradeLevels,
  sections,
  statuses,
  selectedFilters,
  setSelectedFilters
}) => {
  // Clear all filters and search
  const clearFilters = () => {
    setSearch("");
    setSelectedFilters({ gradeLevel: "", section: "", status: "" });
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700 flex gap-4 items-center">

      {/* Search */}
      <input
        type="text"
        placeholder="Search StudNumber/Name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="
          flex-1 min-w-0
          p-3 
          rounded-lg 
          bg-gray-100 dark:bg-slate-700 
          text-gray-800 dark:text-white 
          placeholder-gray-500 dark:placeholder-gray-400
          focus:outline-none 
          focus:ring-2 
          focus:ring-blue-500
        "
      />

      {/* Grade Filter */}
      <select
        value={selectedFilters.gradeLevel}
        onChange={(e) => setSelectedFilters({ ...selectedFilters, gradeLevel: e.target.value })}
        className="flex-1 min-w-0 p-3 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-white"
      >
        <option value="">All Grades</option>
        {gradeLevels.map(gl => <option key={gl} value={gl}>{gl}</option>)}
      </select>

      {/* Section Filter */}
      <select
        value={selectedFilters.section}
        onChange={(e) => setSelectedFilters({ ...selectedFilters, section: e.target.value })}
        className="flex-1 min-w-0 p-3 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-white"
      >
        <option value="">All Sections</option>
        {sections.map(sec => <option key={sec} value={sec}>{sec}</option>)}
      </select>

      {/* Status Filter */}
      <select
        value={selectedFilters.status}
        onChange={(e) => setSelectedFilters({ ...selectedFilters, status: e.target.value })}
        className="flex-1 min-w-0 p-3 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-white"
      >
        <option value="">All Statuses</option>
        {statuses.map(st => <option key={st} value={st}>{st}</option>)}
      </select>

      {/* Clear Tip Button */}
      <button
        onClick={clearFilters}
        className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition whitespace-nowrap"
        title="Clear all filters and search"
      >
        Clear Filters
      </button>

    </div>
  );
};

export default StudentsFilters;
