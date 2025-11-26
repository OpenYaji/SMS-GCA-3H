import React, { useState, useEffect } from 'react';
import { X, Download, FileText, Calendar, GraduationCap, AlertCircle } from 'lucide-react';
import axios from 'axios';

const GradeDownloadModal = ({ isOpen, onClose, onDownload, currentGrades }) => {
    const [downloadType, setDownloadType] = useState('current');
    const [selectedQuarter, setSelectedQuarter] = useState('');
    const [selectedSchoolYear, setSelectedSchoolYear] = useState('');
    const [previousYears, setPreviousYears] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && downloadType === 'previous') {
            fetchPreviousYears();
        }
    }, [isOpen, downloadType]);

    const fetchPreviousYears = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/backend/api/academics/getPreviousGrades.php', {
                withCredentials: true,
            });
            if (response.data.success) {
                setPreviousYears(response.data.data);
                if (response.data.data.length > 0) {
                    setSelectedSchoolYear(response.data.data[0].schoolYear);
                }
            }
        } catch (error) {
            console.error('Error fetching previous years:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkQuarterComplete = (quarter) => {
        if (!currentGrades || !currentGrades.subjects) return false;

        return currentGrades.subjects.every(subject => {
            const quarterKey = `q${quarter}`;
            return subject[quarterKey] !== null && subject[quarterKey] !== undefined;
        });
    };

    const checkAllGradesComplete = () => {
        if (!currentGrades || !currentGrades.subjects) return false;

        return currentGrades.subjects.every(subject =>
            subject.q1 && subject.q2 && subject.q3 && subject.q4
        );
    };

    const quarters = [
        { value: '1', label: '1st Quarter', complete: checkQuarterComplete(1) },
        { value: '2', label: '2nd Quarter', complete: checkQuarterComplete(2) },
        { value: '3', label: '3rd Quarter', complete: checkQuarterComplete(3) },
        { value: '4', label: '4th Quarter', complete: checkQuarterComplete(4) }
    ];

    const handleDownload = () => {
        if (downloadType === 'current-complete') {
            if (!checkAllGradesComplete()) {
                alert('Cannot download complete report. Some grades are not yet available.');
                return;
            }
            onDownload('current-complete', null, null);
        } else if (downloadType === 'current-quarter') {
            if (!selectedQuarter) {
                alert('Please select a quarter');
                return;
            }
            const quarter = quarters.find(q => q.value === selectedQuarter);
            if (!quarter.complete) {
                alert(`Cannot download ${quarter.label} report. Grades are not yet complete.`);
                return;
            }
            onDownload('quarter', selectedQuarter, null);
        } else if (downloadType === 'previous') {
            if (!selectedSchoolYear) {
                alert('Please select a school year');
                return;
            }
            onDownload('previous', null, selectedSchoolYear);
        }
        onClose();
    };

    if (!isOpen) return null;

    const allGradesComplete = checkAllGradesComplete();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-slideUp">
                {/* Header */}
                                <div className="bg-[#F4D77D] dark:bg-amber-400 p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Download className="w-6 h-6 text-white" />
                                        <h2 className="text-xl font-bold text-white">Download Grade Report</h2>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Body */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                        Select the type of report you want to download:
                    </p>

                    {/* Current School Year - Complete Report */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-amber-600" />
                            Current School Year (S.Y. 2025-2026)
                        </h3>

                        <label
                            className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all mb-3 ${downloadType === 'current-complete'
                                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                                    : 'border-gray-200 dark:border-slate-600 hover:border-amber-300 dark:hover:border-amber-700'
                                } ${!allGradesComplete ? 'opacity-60 cursor-not-allowed' : ''}`}
                        >
                            <input
                                type="radio"
                                name="downloadType"
                                value="current-complete"
                                checked={downloadType === 'current-complete'}
                                onChange={(e) => setDownloadType(e.target.value)}
                                disabled={!allGradesComplete}
                                className="mt-1 w-4 h-4 text-amber-600 focus:ring-amber-500"
                            />
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-100">
                                        Complete Grade Report (All Quarters)
                                    </h4>
                                    {!allGradesComplete && (
                                        <AlertCircle className="w-4 h-4 text-orange-500" />
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Includes all quarterly grades, summary, and performance report
                                </p>
                                {!allGradesComplete && (
                                    <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                                        ⚠️ Not all grades are available yet. Please wait until all quarters are complete.
                                    </p>
                                )}
                            </div>
                        </label>

                        {/* Quarter Selection */}
                        <label
                            className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${downloadType === 'current-quarter'
                                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                                    : 'border-gray-200 dark:border-slate-600 hover:border-amber-300 dark:hover:border-amber-700'
                                }`}
                        >
                            <input
                                type="radio"
                                name="downloadType"
                                value="current-quarter"
                                checked={downloadType === 'current-quarter'}
                                onChange={(e) => setDownloadType(e.target.value)}
                                className="mt-1 w-4 h-4 text-amber-600 focus:ring-amber-500"
                            />
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                                    Quarter Grade Slip
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                    Download grade slip for a specific quarter
                                </p>

                                {downloadType === 'current-quarter' && (
                                    <div className="grid grid-cols-2 gap-2 mt-3">
                                        {quarters.map((quarter) => (
                                            <button
                                                key={quarter.value}
                                                onClick={() => setSelectedQuarter(quarter.value)}
                                                disabled={!quarter.complete}
                                                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${selectedQuarter === quarter.value
                                                        ? 'border-amber-500 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                                                        : 'border-gray-300 dark:border-slate-600 hover:border-amber-400'
                                                    } ${!quarter.complete ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span>{quarter.label}</span>
                                                    {quarter.complete ? (
                                                        <span className="text-green-600 dark:text-green-400">✓</span>
                                                    ) : (
                                                        <AlertCircle className="w-4 h-4 text-orange-500" />
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </label>
                    </div>

                    {/* Previous School Years */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-amber-600" />
                            Previous School Years
                        </h3>

                        <label
                            className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${downloadType === 'previous'
                                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                                    : 'border-gray-200 dark:border-slate-600 hover:border-amber-300 dark:hover:border-amber-700'
                                }`}
                        >
                            <input
                                type="radio"
                                name="downloadType"
                                value="previous"
                                checked={downloadType === 'previous'}
                                onChange={(e) => setDownloadType(e.target.value)}
                                className="mt-1 w-4 h-4 text-amber-600 focus:ring-amber-500"
                            />
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                                    Historical Grade Report
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                    Download complete report from previous school years
                                </p>

                                {downloadType === 'previous' && (
                                    <div className="mt-3">
                                        {loading ? (
                                            <p className="text-sm text-gray-500">Loading school years...</p>
                                        ) : previousYears.length > 0 ? (
                                            <select
                                                value={selectedSchoolYear}
                                                onChange={(e) => setSelectedSchoolYear(e.target.value)}
                                                className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                                            >
                                                {previousYears.map((year) => (
                                                    <option key={year.schoolYear} value={year.schoolYear}>
                                                        {year.schoolYear} - {year.gradeLevel}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <p className="text-sm text-gray-500">No previous records found</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </label>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 dark:bg-slate-700/50 p-4 flex justify-end gap-3 border-t border-gray-200 dark:border-slate-600">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDownload}
                        className="px-6 py-2 rounded-lg font-semibold bg-amber-500 hover:bg-amber-600 text-white transition-colors flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Download PDF
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default GradeDownloadModal;
