import React, { useState, useEffect } from 'react';
import { HOST_IP } from '../../../../../config';
// Assume you have a component library for charts, e.g., <BarChartComponent />

// --- CONFIGURATION: BASE API URL ---
const BASE_API_PATH = `http://${HOST_IP}/SMS-GCA-3H/Registrar/backend/api/financial-holds`;

// Re-use the formatPeso function
const formatPeso = (amount) => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) {
        return '₱ 0.00';
    }
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2,
    }).format(numericAmount);
};

// --- NEW UTILITY: Clean up the year name string ---
const cleanYearName = (name) => {
    // Trim whitespace, then remove trailing space + '0' or any trailing non-alphanumeric character 
    // that isn't part of the year format (e.g., to handle "2025-2026 0" -> "2025-2026")
    return name.replace(/\s+0*$/g, '').trim(); 
};


// Placeholder component for Chart
const BarChartComponent = ({ data }) => {
    // Determine the max collection value for the simple bar chart visual
    const maxCollection = data.length > 0 ? parseFloat(data[0].totalCollectionsSY) : 1;
    
    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b pb-2">Collections by School Year</h3>
            <div className="space-y-4">
                {data.map((item, index) => {
                    const collectionAmount = parseFloat(item.totalCollectionsSY);
                    // Prevent division by zero if maxCollection is 0 (though should be 1 from guard)
                    const barWidth = maxCollection > 0 ? (collectionAmount / maxCollection) * 100 : 0; 
                    const displayYearName = cleanYearName(item.schoolYearName); // Use the cleaner year name

                    return (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                            <span className={`font-medium w-40 ${item.IsActive ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                {displayYearName} {item.IsActive && '(Current)'}
                            </span>
                            <div className="w-2/3 bg-gray-200 rounded-full h-2.5 mx-4 dark:bg-gray-700">
                                {/* Simple visual bar */}
                                <div 
                                    className={`h-2.5 rounded-full transition-all duration-700 ${item.IsActive ? 'bg-indigo-600' : 'bg-gray-400'}`} 
                                    style={{ width: `${barWidth}%` }}
                                ></div>
                            </div>
                            <span className="text-sm font-bold text-gray-800 dark:text-white text-right w-32">
                                {formatPeso(collectionAmount)}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


const FinancialHoldsArchive = () => {
    const [archiveStats, setArchiveStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Calculate overall totals
    const grandTotalCollected = archiveStats.reduce((sum, item) => sum + parseFloat(item.totalCollectionsSY), 0);
    const grandTotalRemaining = archiveStats.reduce((sum, item) => sum + parseFloat(item.remainingBalanceSY), 0);
    const totalSchoolYears = archiveStats.length;

    useEffect(() => {
        const fetchArchiveData = async () => {
            try {
                // *** FIX APPLIED HERE: Concatenate path and filename carefully. ***
                const url = `${BASE_API_PATH}/financialarchive.php`; 
                const response = await fetch(url); 

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Server responded with status ${response.status}. URL: ${url}. Response: ${errorText.substring(0, 100)}...`);
                }

                const contentType = response.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    const errorText = await response.text();
                    throw new Error(`Expected JSON but received non-JSON response from PHP. Check PHP errors. Response snippet: ${errorText.substring(0, 100)}...`);
                }

                const data = await response.json();

                if (data.success) {
                    const sortedData = data.archiveStats.sort((a, b) => b.totalCollectionsSY - a.totalCollectionsSY);
                    setArchiveStats(sortedData);
                } else {
                    setError(data.message || 'Failed to load archive data from successful API response.');
                }
            } catch (err) {
                console.error("Fetch Error:", err);
                setError(`Network error or data issue: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchArchiveData();
    }, []);

    if (loading) {
        return <div className="text-center py-10 text-gray-500">Loading Archives...</div>;
    }

    if (error) {
        return (
            <div className="p-6 text-center text-red-600 bg-red-100 border border-red-400 rounded-lg">
                <h2 className="text-xl font-bold mb-2">🚫 Data Load Error</h2>
                <p className="mb-4">Could not retrieve financial archives. Please check the API URL and server status.</p>
                <code className="block bg-white p-2 rounded text-sm text-left whitespace-pre-wrap">{error}</code>
            </div>
        );
    }

    return (
        <div className="p-0">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Financial Holds Archive</h1>
            
            {/* ----------------- ARCHIVE SUMMARY CARDS ----------------- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                
                {/* Grand Total Collected */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-t-4 border-green-500">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Grand Total Collected (All Years)</p>
                    <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
                        {formatPeso(grandTotalCollected)}
                    </p>
                </div>

                {/* Total School Years */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-t-4 border-indigo-500">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">School Years Archived</p>
                    <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
                        {totalSchoolYears}
                    </p>
                </div>

                {/* Total Remaining Balance (Overall) */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-t-4 border-red-500">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Historical Remaining Balance</p>
                    <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
                        {formatPeso(grandTotalRemaining)}
                    </p>
                </div>
            </div>

            {/* ----------------- ARCHIVE CHART/GRAPH ----------------- */}
            {archiveStats.length > 0 ? (
                <BarChartComponent data={archiveStats} />
            ) : (
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl text-center text-gray-500">
                    No historical data available.
                </div>
            )}
            
            {/* ----------------- DATA TABLE ----------------- */}
            <div className="mt-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Detailed School Year Data</h3>
                <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">School Year</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total Collections</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total Transactions</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Remaining Balance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {archiveStats.map((item) => {
                                const displayYearName = cleanYearName(item.schoolYearName); // Use the cleaner year name
                                return (
                                    <tr key={item.SchoolYearID} className={item.IsActive ? 'bg-indigo-50 dark:bg-gray-700/50' : 'bg-white dark:bg-gray-800'}>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${item.IsActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-900 dark:text-gray-100'}`}>
                                            {displayYearName} {item.IsActive && '(Active)'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                            {formatPeso(item.totalCollectionsSY)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                            {item.totalTransactionsSY}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 dark:text-red-400 font-semibold">
                                            {formatPeso(item.remainingBalanceSY)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FinancialHoldsArchive;