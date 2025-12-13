import React from 'react';

const Filters = ({ filters, onFilterChange, onClearFilters }) => {
    // Defined lists for filters
    const gradeLevels = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];
    const statuses = ['Submitted', 'Approved', 'Rejected', 'Resubmitted', 'Released'];

    // Select class - Ginamit ang style mo pero inalis ang 'w-full' para sa flex layout
    const selectClass = "border p-2 rounded-lg text-sm bg-gray-50 dark:bg-slate-700 dark:text-gray-300 dark:border-slate-600 focus:ring-amber-500 focus:border-amber-500 shadow-sm flex-1 min-w-[120px] h-[42px]";
    
    // Helper function to handle the filter change
    const handleLocalFilterChange = (name, value) => {
        onFilterChange({
            ...filters,
            [name]: value
        });
    };

    return (
        // Container na ginaya ang style ng ArchivePage filter bar
        <div className="flex flex-col sm:flex-row gap-3 mb-6 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700">
            
            {/* 1. Grade Level Filter */}
            {/* Note: Gumagamit ng <select> tag at pinalitan ng default option ang label */}
            <select 
                className={selectClass} 
                name="gradeLevel"
                value={filters.gradeLevel || ''}
                onChange={(e) => handleLocalFilterChange(e.target.name, e.target.value)}
            >
                <option value="">All Grades</option>
                {gradeLevels.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                ))}
            </select>

            {/* 2. Status Filter */}
            <select 
                className={selectClass} 
                name="status"
                value={filters.status || ''}
                onChange={(e) => handleLocalFilterChange(e.target.name, e.target.value)}
            >
                <option value="">All Status</option>
                {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                ))}
            </select>

            {/* 3. Clear Filters Button */}
            {/* Ginawa kong h-[42px] para maging consistent ang height sa dropdowns */}
            <button 
                className="flex-shrink-0 bg-gray-500 hover:bg-gray-600 dark:bg-slate-600 dark:hover:bg-slate-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md flex items-center justify-center h-[42px]"
                onClick={onClearFilters}
            >
                <span className="i-tabler-filter-off text-lg mr-1 inline-block align-middle" />
                Clear Filters
            </button>
        </div>
    );
};

export default Filters;