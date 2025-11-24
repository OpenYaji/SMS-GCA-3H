import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { API_BASE_URL } from '../../config';

import PreviousGradesFilters from '../common/academic/previous-grades/PreviousGradesFilters';
import PreviousGradesSummary from '../common/academic/previous-grades/PreviousGradesSummary';
import PreviousGradesTable from '../common/academic/previous-grades/PreviousGradesTable';
import YearPerformanceChart from '../common/academic/previous-grades/YearPerformanceChart';

const PreviousGradesPage = () => {
    const [allGrades, setAllGrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedYear, setSelectedYear] = useState('');

    useEffect(() => {
        const fetchPreviousGrades = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/backend/api/academics/getPreviousGrades.php', {
                    withCredentials: true,
                });
                if (response.data.success) {
                    setAllGrades(response.data.data);
                    if (response.data.data.length > 0) {
                        setSelectedYear(response.data.data[0].schoolYear);
                    }
                } else {
                    setError(response.data.message || 'Failed to fetch grade history.');
                }
            } catch (err) {
                setError('An error occurred while fetching grade history.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPreviousGrades();
    }, []);

    const selectedYearData = useMemo(() => {
        return allGrades.find(data => data.schoolYear === selectedYear);
    }, [allGrades, selectedYear]);

    const yearChartData = useMemo(() => {
        return allGrades.map(data => ({
            year: data.schoolYear.replace('S.Y. ', ''),
            'Final Average': data.summary.finalAverage
        })).reverse();
    }, [allGrades]);

    if (loading) {
        return <div className="p-8 text-center">Loading Grade History...</div>;
    }
    
    if (error) {
        return <div className="p-8 text-center text-red-500">{error}</div>;
    }

    if (allGrades.length === 0) {
        return <div className="p-8 text-center">No previous grade history found.</div>;
    }

    return (
        <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                    Previous Grades
                </h1>
                <Link 
                    to="/student-dashboard/academic"
                    className="flex items-center gap-2 text-sm font-semibold bg-white dark:bg-slate-700 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors border border-gray-200 dark:border-slate-600"
                >
                    <ArrowLeft size={16} />
                    Back to Academic
                </Link>
            </div>

            <div className="flex flex-col gap-8">
                <PreviousGradesFilters 
                    schoolYears={allGrades.map(g => g.schoolYear)}
                    selectedYear={selectedYear}
                    onYearChange={setSelectedYear}
                    gradeLevel={selectedYearData?.gradeLevel || 'N/A'}
                />
                
                {selectedYearData && (
                    <>
                        <PreviousGradesSummary data={selectedYearData.summary} />
                        <PreviousGradesTable subjects={selectedYearData.subjects} />
                    </>
                )}
                
                <YearPerformanceChart data={yearChartData} />
            </div>
        </>
    );
};

export default PreviousGradesPage;
