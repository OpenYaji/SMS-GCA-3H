import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

import GradesSummary from '../common/academic/grades/GradesSummary';
import GradesTable from '../common/academic/grades/GradesTable';
import GradeDetailModal from '../common/academic/grades/GradeDetailModal';
import GradeTrendChart from '../common/academic/grades/GradeTrendChart';

const CurrentGradesPage = () => {
    const [gradesData, setGradesData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchGrades = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/backend/api/academics/getCurrentGrades.php', {
                    withCredentials: true,
                });
                if (response.data.success) {
                    setGradesData(response.data.data);
                } else {
                    setError(response.data.message || 'Failed to fetch grades data.');
                }
            } catch (err) {
                setError('An error occurred while fetching grades.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchGrades();
    }, []);

    if (loading) {
        return (
            <div className="p-4 sm:p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
                <p className="mt-4 text-base sm:text-lg font-medium">Loading Current Grades...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 sm:p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                    <span className="text-2xl">⚠️</span>
                </div>
                <p className="text-red-500 font-medium text-sm sm:text-base">{error}</p>
            </div>
        );
    }

    if (!gradesData || !gradesData.subjects || gradesData.subjects.length === 0) {
        return (
            <div className="p-4 sm:p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                    <span className="text-2xl">📊</span>
                </div>
                <p className="font-medium text-sm sm:text-base">No current grades are available at this time.</p>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
                        Current Grades
                    </h1>
                    <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-800 px-2 sm:px-3 py-1 rounded-full">
                            {user.gradeLevel}
                        </span>
                        <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-800 px-2 sm:px-3 py-1 rounded-full">
                            {user.schoolYear}
                        </span>
                    </div>
                </div>
                
                <Link 
                    to="/student-dashboard/academic"
                    className="inline-flex items-center justify-center gap-2 text-sm font-semibold bg-white dark:bg-slate-700 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-all duration-200 border border-gray-200 dark:border-slate-600 shadow-sm hover:shadow"
                >
                    <ArrowLeft size={16} />
                    Back to Academic
                </Link>
            </div>

            <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
                <GradesSummary data={gradesData.summary} />
                <GradesTable subjects={gradesData.subjects} onSubjectClick={setSelectedSubject} />
                <GradeTrendChart subjects={gradesData.subjects} />
            </div>

            <GradeDetailModal 
                subject={selectedSubject}
                onClose={() => setSelectedSubject(null)}
            />
        </>
    );
}
export default CurrentGradesPage;
