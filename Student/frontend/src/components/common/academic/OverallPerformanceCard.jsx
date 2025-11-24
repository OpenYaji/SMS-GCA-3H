import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, Users, Calendar, Award } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';


const OverallPerformanceCard = () => {
    const { user } = useAuth();
    const [performanceData, setPerformanceData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardSummary = async () => {
            if (!user) return;
            try {
                setLoading(true);
                const response = await axios.get('/backend/api/academics/getDashboardSummary.php',{
                    withCredentials: true,
                });
                if (response.data.success) {
                    setPerformanceData(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard summary", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardSummary();
    }, [user]);

    const getGradeColorClass = (average) => {
        if (!average) return "text-gray-500";
        if (average >= 90) return "text-green-500";
        if (average >= 85) return "text-blue-500";
        if (average >= 80) return "text-yellow-500";
        return "text-red-500";
    };

    const getQuarterMonthRange = (quarter) => {
        switch (quarter) {
            case 'First Quarter': return 'August - October';
            case 'Second Quarter': return 'November - January';
            case 'Third Quarter': return 'February - April';
            case 'Fourth Quarter': return 'May - June';
            default: return 'Current Period';
        }
    };

    if (loading || !user) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-8 shadow-lg min-h-[400px] animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-6 sm:mb-8"></div>
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                    <div className="h-40 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
                    <div className="h-40 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
                    <div className="h-40 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
                </div>
            </div>
        );
    }

    if (!performanceData) {
        return (
            <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-4 sm:p-8 shadow-lg">
                <p className="text-sm sm:text-base">Could not load performance data at this time.</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg">
            <div className="flex items-start sm:items-center justify-between mb-6 sm:mb-8 flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    <div className="p-2 sm:p-3 bg-[#F4D77D] dark:bg-slate-700 rounded-xl flex-shrink-0">
                        <Award className="w-6 h-6 sm:w-8 sm:h-8 text-gray-800 dark:text-amber-300" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 truncate">
                            {user.fullName}
                        </h2>
                        <div className="flex items-center gap-2 sm:gap-3 mt-1 flex-wrap">
                            <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                {user.gradeAndSection}
                            </span>
                            <span className="text-xs sm:text-sm px-2 sm:px-3 py-1 bg-[#F4D77D]/20 dark:bg-slate-700 text-gray-700 dark:text-amber-300 rounded-full font-medium">
                                {performanceData.quarter}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="text-left sm:text-right w-full sm:w-auto">
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        {user.schoolYear}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-gray-50 dark:bg-slate-700/50 p-4 sm:p-6 rounded-2xl border border-gray-200 dark:border-slate-600">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 bg-white dark:bg-slate-800 rounded-lg">
                            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">General Average</span>
                    </div>
                    <div className="flex items-end gap-2 mb-3">
                        <p className={`text-4xl sm:text-5xl font-bold ${getGradeColorClass(performanceData.generalAverage)}`}>
                            {performanceData.generalAverage.toFixed(2)}
                        </p>
                        <p className="text-xl sm:text-2xl font-semibold text-gray-400 dark:text-gray-500 mb-1">/100</p>
                    </div>
                    <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold inline-block">
                        {performanceData.remark}
                    </div>
                </div>

                <div className="bg-gray-50 dark:bg-slate-700/50 p-4 sm:p-6 rounded-2xl border border-gray-200 dark:border-slate-600">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 bg-white dark:bg-slate-800 rounded-lg">
                            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Attendance</span>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4 mb-3">
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-200 dark:text-slate-600" />
                                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="transparent"
                                    strokeDasharray={2 * Math.PI * 36}
                                    strokeDashoffset={2 * Math.PI * 36 * (1 - performanceData.attendance / 100)}
                                    className="text-blue-500 dark:text-blue-400 transition-all duration-1000"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">{performanceData.attendance}%</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">{performanceData.totalDaysPresent}/{performanceData.totalDays}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{getQuarterMonthRange(performanceData.quarter)}</p>
                        </div>
                    </div>
                    <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-bold inline-block">
                        {performanceData.attendanceRemark}
                    </div>
                </div>

                <div className="bg-gray-50 dark:bg-slate-700/50 p-4 sm:p-6 rounded-2xl border border-gray-200 dark:border-slate-600">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 bg-white dark:bg-slate-800 rounded-lg">
                            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Class Participation</span>
                    </div>
                    <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-6 h-6 sm:w-8 sm:h-8 ${i < performanceData.participation.rating ? 'text-amber-400' : 'text-gray-300 dark:text-slate-600'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                    </div>
                    <div className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-xs font-bold inline-block">
                        {performanceData.participation.remark}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverallPerformanceCard;
