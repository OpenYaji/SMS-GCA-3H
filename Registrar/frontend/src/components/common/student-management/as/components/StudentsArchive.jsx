import React, { useState, useEffect, useCallback } from 'react';
import ViewStudentModal from './ViewStudentModal'; // Assuming this component exists in the same folder
// Importing Lucide React icons
import { Eye } from 'lucide-react'; 
import { HOST_IP } from '../../../../../../config';
// --- CONFIGURATION ---
// IMPORTANT: Update this with your actual API base URL
const API_BASE_URL = `http://${HOST_IP}/SMS-GCA-3H/Registrar/backend/api/students`;
const ARCHIVE_ENDPOINT = `${API_BASE_URL}/archived-students.php`; 
const SCHOOL_YEARS_ENDPOINT = `${API_BASE_URL}/get-archived-school-years.php`; 
// --- END CONFIGURATION ---

const StudentsArchive = () => {
    const [students, setStudents] = useState([]);
    const [schoolYears, setSchoolYears] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Filters and Search State
    const [selectedSchoolYear, setSelectedSchoolYear] = useState('');
    const [gradeLevelFilter, setGradeLevelFilter] = useState('All Grades');
    const [sectionFilter, setSectionFilter] = useState('All Sections');
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    // Fetch list of archived School Years for the dropdown
    useEffect(() => {
        const fetchSchoolYears = async () => {
            try {
                const response = await fetch(SCHOOL_YEARS_ENDPOINT);
                 if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                
                if (data.success) {
                    setSchoolYears(data.data);
                    
                    // Set the most recent archived school year as default selection
                    if (data.data.length > 0) {
                        setSelectedSchoolYear(data.data[0].SchoolYearID);
                    }
                } else {
                    setError(data.message || 'Failed to fetch school years.');
                }
            } catch (err) {
                setError(`Error fetching school years. Check API path. Details: ${err.message}`);
                console.error(err);
                 setIsLoading(false); // Ensure loading stops on failure
            }
        };

        fetchSchoolYears();
    }, []);

    // Fetch Students Data for the selected School Year and applied filters
    const fetchStudents = useCallback(async (syId) => {
        if (!syId) {
            setStudents([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);
        
        // Build URL parameters based on filters
        const queryParams = new URLSearchParams({
            schoolYearId: syId, 
            gradeLevel: gradeLevelFilter,
            section: sectionFilter,
            status: statusFilter,
            search: searchTerm,
        }).toString();

        try {
            const response = await fetch(`${ARCHIVE_ENDPOINT}?${queryParams}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success) {
                setStudents(data.data);
            } else {
                setError(data.message || 'Failed to fetch student data.');
            }
        } catch (err) {
            setError(`Error fetching student data. Check the archived-students.php endpoint. Details: ${err.message}`);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [gradeLevelFilter, sectionFilter, statusFilter, searchTerm]);

    // Effect to trigger fetching whenever school year or filters change
    useEffect(() => {
        if (selectedSchoolYear) {
            fetchStudents(selectedSchoolYear);
        }
    }, [selectedSchoolYear, fetchStudents]);

    const handleViewDetails = (student) => {
        setSelectedStudent(student);
        setIsModalVisible(true);
    };

    const handleSchoolYearChange = (e) => {
        setSelectedSchoolYear(e.target.value);
    };
    
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleResetFilters = () => {
        setGradeLevelFilter('All Grades');
        setSectionFilter('All Sections');
        setStatusFilter('All Status');
        setSearchTerm('');
        // fetchStudents will be triggered by useEffect
    };

    // Placeholder/Sample data for select options (ideally fetched from API)
    const gradeLevels = ['All Grades', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'];
    const sections = ['All Sections', 'Section A', 'Section B', 'Section C', 'Section D'];
    const statuses = ['All Status', 'Enrolled', 'Transferred Out', 'Dropped'];


    return (
        <div className="p-0 dark:bg-slate-900 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                Archive Lists
            </h1>


            {/* --- Filter & School Year Selector Section (FIXED LAYOUT) --- */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                    
                    {/* School Year Selector */}
                    <div className="md:col-span-1">
                        <label htmlFor="school-year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Archived School Year
                        </label>
                        <select
                            id="school-year"
                            value={selectedSchoolYear}
                            onChange={handleSchoolYearChange}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                            disabled={schoolYears.length === 0 || isLoading}
                        >
                            <option value="">Select School Year</option>
                            {schoolYears.map((sy) => (
                                <option key={sy.SchoolYearID} value={sy.SchoolYearID}>
                                    {sy.YearName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Grade Level Filter */}
                    <div className="md:col-span-1">
                        <label htmlFor="grade-level" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Grade Level
                        </label>
                        <select
                            id="grade-level"
                            value={gradeLevelFilter}
                            onChange={(e) => setGradeLevelFilter(e.target.value)}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                        >
                            {gradeLevels.map((level) => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>
                    </div>

                    {/* Section Filter */}
                    <div className="md:col-span-1">
                        <label htmlFor="section" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Section
                        </label>
                        <select
                            id="section"
                            value={sectionFilter}
                            onChange={(e) => setSectionFilter(e.target.value)}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                        >
                            {sections.map((section) => (
                                <option key={section} value={section}>{section}</option>
                            ))}
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div className="md:col-span-1">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Status
                        </label>
                        <select
                            id="status"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                        >
                            {statuses.map((status) => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    {/* Reset Button - Aligned horizontally */}
                    <div className="md:col-span-1 flex items-end">
                        <button 
                            onClick={handleResetFilters}
                            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md transition duration-150 h-[42px]"
                        >
                            Reset Filters
                        </button>
                    </div>
                    
                    {/* Search Bar - FIX: Takes up 5 columns (full width) on MD screens and above */}
                    <div className="md:col-span-5">
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Search Student (Name or ID)
                        </label>
                        <input
                            type="text"
                            id="search"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Enter student name or number..."
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>
                </div>
            </div>

            {/* --- Student List Table Section --- */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md overflow-x-auto">
                {error && (
                    <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
                        {error}
                    </div>
                )}

                {isLoading ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-10">Loading archived students...</p>
                ) : students.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-10">
                        No students found for the selected school year or matching the filters.
                    </p>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                        <thead className="bg-gray-50 dark:bg-slate-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Student No.
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Full Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    School Year
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Grade & Section
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                            {students.map((student) => (
                                <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {student.studentNumber || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        {student.fullName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        {student.schoolYear}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        {student.gradeLevel} - {student.section}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                            ${student.status === 'Enrolled' ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100' :
                                                student.status === 'Transferred Out' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100' :
                                                'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100'
                                            }`}>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleViewDetails(student)}
                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200 transition"
                                            title="View Details"
                                        >
                                            <Eye className="h-5 w-5 inline-block" /> View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            
            {/* Student View Modal */}
            <ViewStudentModal 
                isVisible={isModalVisible} 
                student={selectedStudent} 
                onClose={() => setIsModalVisible(false)} 
            />
        </div>
    );
};

export default StudentsArchive;