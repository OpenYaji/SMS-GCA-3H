// File: src/pages/ArchivePage.jsx (MODIFIED FOR FULL WIDTH)

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { HOST_IP } from '../../../../../config';
import ArchiveDetailsModal from './ArchiveDetailsModal'; 

// --- Utility Components (Simplified) ---
const LoadingSpinner = () => (
    <div className="text-center p-10 bg-white dark:bg-slate-900 rounded-lg shadow-inner">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400 inline-block"></div>
        <p className="mt-2 text-indigo-600 dark:text-indigo-400">Loading Archive Data...</p>
    </div>
);

// --- Main Component ---

const ArchivePage = ({ history }) => {
    const ARCHIVE_API_URL = `http://${HOST_IP}/SMS-GCA-3H/Registrar/backend/api/grades/archive.php`; 
    const DETAIL_API_URL = `http://${HOST_IP}/SMS-GCA-3H/Registrar/backend/api/grades/get-submission-details.php`; 
    
    const [submissions, setSubmissions] = useState([]);
    const [schoolYears, setSchoolYears] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // State para sa Modal
    // State for the Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [detailsError, setDetailsError] = useState(null);

    // Filters... 
    const [filters, setFilters] = useState({
        schoolYearId: '',
        gradingPeriod: '',
        gradeLevel: '',
    });

    const gradeLevels = ['Nursery', 'Kinder 1', 'Kinder 2', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4']; 

    const fetchArchiveData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const response = await axios.get(`${ARCHIVE_API_URL}?${queryParams}`);
            
            if (response.data.success) {
                setSubmissions(response.data.data);
                setSchoolYears(response.data.schoolYears || []);
            } else {
                setError(response.data.message || 'Failed to fetch archive data.');
            }
        } catch (err) {
            setError('Error connecting to the server. Check network or API path.');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchArchiveData();
    }, [fetchArchiveData]);

    const handleFilterChange = (e) => {
        setFilters(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    // ***************************************************************
    // * DINAGDAG: Function para i-reset ang lahat ng filter values *
    // ***************************************************************
    const handleClearFilters = () => {
        setFilters({
            schoolYearId: '',
            gradingPeriod: '',
            gradeLevel: '',
        });
    };

    const handleViewDetails = async (submissionId) => {
        setDetailsLoading(true);
        setDetailsError(null);
        setIsModalOpen(true); 
        setSelectedSubmission(null);

        try {
            const response = await axios.get(`${DETAIL_API_URL}?submissionId=${submissionId}`);
            if (response.data.success) {
                setSelectedSubmission(response.data.data);
            } else {
                setDetailsError(response.data.message || 'Failed to load submission details.');
            }
        } catch (err) {
            setDetailsError('Network error while fetching details.');
        } finally {
            setDetailsLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        if (status === 'Released' || status === 'Approved') {
            return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
        }
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
    };

    return (
        // TINANGGAL ANG max-w-7xl AT mx-auto DITO
        // REMOVED max-w-7xl AND mx-auto HERE
        <div className=""> 
            
            {/* Page Title */}
            <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                Archive Grades
            </h1>

            {/* Filter Section - Full width na rin ito */}
            {/* Filter Section - This is also full width */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700">
                
                {/* School Year Filter */}
                <select 
                    name="schoolYearId" 
                    onChange={handleFilterChange} 
                    value={filters.schoolYearId}
                    // * BINAGO: Nagdagdag ng flex-1 at min-w
                    className="flex-1 border p-2 rounded-lg text-sm bg-gray-50 dark:bg-slate-700 dark:text-gray-300 dark:border-slate-600 focus:ring-indigo-500 focus:border-indigo-500 min-w-[150px]"
                >
                    <option value="">All School Years</option>
                    {schoolYears.map(sy => (
                        <option key={sy.id} value={sy.id}>{sy.name}</option>
                    ))}
                </select>

                {/* Grade Level Filter */}
                <select 
                    name="gradeLevel" 
                    onChange={handleFilterChange} 
                    value={filters.gradeLevel}
                    // * BINAGO: Nagdagdag ng flex-1 at min-w
                    className="flex-1 border p-2 rounded-lg text-sm bg-gray-50 dark:bg-slate-700 dark:text-gray-300 dark:border-slate-600 focus:ring-indigo-500 focus:border-indigo-500 min-w-[150px]"
                >
                    <option value="">All Grade Levels</option>
                    {gradeLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                    ))}
                </select>

                {/* Quarter Filter */}
                <select 
                    name="gradingPeriod" 
                    onChange={handleFilterChange} 
                    value={filters.gradingPeriod}
                    // * BINAGO: Nagdagdag ng flex-1 at min-w
                    className="flex-1 border p-2 rounded-lg text-sm bg-gray-50 dark:bg-slate-700 dark:text-gray-300 dark:border-slate-600 focus:ring-indigo-500 focus:border-indigo-500 min-w-[150px]"
                >
                    <option value="">All Quarters</option>
                    {quarters.map(q => (
                        <option key={q} value={q}>{q}</option>
                    ))}
                </select>

                {/* ********************************************************* */}
                {/* * DINAGDAG: Clear Filters Button ************************ */}
                {/* ********************************************************* */}
                <button
                    onClick={handleClearFilters}
                    className="flex-shrink-0 bg-gray-500 hover:bg-gray-600 dark:bg-slate-600 dark:hover:bg-slate-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center h-[42px] min-w-[120px]"
                >
                    {/* Gumamit ako ng simpleng text muna, kung may icon library ka, pwede mong palitan ang "Clear" */}
                    Clear Filters
                </button>
                {/* ********************************************************* */}
            </div>

            {loading ? (
                <LoadingSpinner />
            ) : error ? (
                <div className="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg shadow-md border border-red-300 dark:border-red-700">
                    Error loading list: {error}
                </div>
            ) : (
                <>
                    {/* Count Display */}
                    <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                        Showing **{submissions.length}** archived submission records.
                    </p>

                    {/* Submissions Table Container - Full width at Dark Mode Styling */}
                    {/* Submissions Table Container - Full width and Dark Mode Styling */}
                    <div className="rounded-xl shadow-md border border-gray-300 dark:border-slate-600 overflow-hidden">
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                                
                                {/* Table Header (Thead) */}
                                <thead className="bg-gray-100 dark:bg-slate-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-800 dark:text-white uppercase tracking-wider">School Year</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-800 dark:text-white uppercase tracking-wider">Teacher</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-800 dark:text-white uppercase tracking-wider">Grade & Section</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-800 dark:text-white uppercase tracking-wider">Quarter</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-800 dark:text-white uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-800 dark:text-white uppercase tracking-wider">Students</th>
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                
                                {/* Table Body (Tbody) */}
                                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                                    {submissions.length > 0 ? (
                                        submissions.map((submission) => (
                                            <tr key={submission.id} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{submission.schoolYear}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{submission.teacher}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                                    {submission.gradeLevel} - **{submission.section}**
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{submission.gradingPeriod}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(submission.status)}`}>
                                                        {submission.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                                    {submission.studentsWithGrades}/{submission.studentCount}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button 
                                                        onClick={() => handleViewDetails(submission.id)} 
                                                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold transition duration-150"
                                                    >
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                                                No archived submissions match the criteria.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* Modal for Details */}
            <ArchiveDetailsModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                submissionData={selectedSubmission}
                loading={detailsLoading}
                error={detailsError}
            />
        </div>
    );
};

export default ArchivePage;