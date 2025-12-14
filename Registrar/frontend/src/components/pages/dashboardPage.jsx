import React, { useState, useEffect } from "react";
// import Status from "../common/dashboard/status";
import {
  FileText,
  DollarSign,
  Users,
  GraduationCap,
  FileCheck,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";
import { HOST_IP } from "../../config";

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
    const interval = setInterval(fetchDashboardStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(
        `http://${HOST_IP}/SMS-GCA-3H/Registrar/backend/api/dashboard/getStats.php`,
        { credentials: "include" }
      );
      const result = await response.json();
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  // Pie Chart Component - FIXED: Handle edge cases and NaN values
  const PieChart = ({ data, colors }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    // If no data or all zeros, show empty state
    if (total === 0) {
      return (
        <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
          <div className="text-center">
            <div className="w-40 h-40 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
              <div>
                <p className="text-2xl font-bold text-gray-400 dark:text-gray-500">0</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">No Data</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    let currentAngle = 0;

    return (
      <div className="relative w-40 h-40 mx-auto">
        <svg viewBox="0 0 100 100" className="transform -rotate-90">
          {data.map((item, index) => {
            if (item.value === 0) return null; // Skip zero values

            const percentage = (item.value / total) * 100;
            const angle = (percentage / 100) * 360;
            const startAngle = currentAngle;
            currentAngle += angle;

            // Convert angles to radians for calculation
            const startRad = (Math.PI * startAngle) / 180;
            const endRad = (Math.PI * currentAngle) / 180;

            const x1 = 50 + 45 * Math.cos(startRad);
            const y1 = 50 + 45 * Math.sin(startRad);
            const x2 = 50 + 45 * Math.cos(endRad);
            const y2 = 50 + 45 * Math.sin(endRad);
            const largeArc = angle > 180 ? 1 : 0;

            // Check for valid coordinates
            if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
              return null;
            }

            return (
              <path
                key={index}
                d={`M 50 50 L ${x1.toFixed(2)} ${y1.toFixed(2)} A 45 45 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`}
                fill={colors[index]}
                className="transition-all duration-300 hover:opacity-80"
              />
            );
          })}
          <circle cx="50" cy="50" r="30" fill="white" className="dark:fill-slate-800" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{total}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
          </div>
        </div>
      </div>
    );
  };

  // Bar Chart Component - Add safety checks
  const BarChart = ({ data, colors }) => {
    const maxValue = Math.max(...data.map(item => item.value), 1);

    return (
      <div className="space-y-3">
        {data.map((item, index) => {
          const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
          return (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400 font-medium">{item.label}</span>
                <span className="font-bold text-gray-900 dark:text-white">{item.value}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-700 ease-out ${colors[index]}`}
                  style={{ width: loading ? '0%' : `${Math.min(percentage, 100)}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Donut Chart Component - Add safety checks
  const DonutChart = ({ value, total, color, label }) => {
    const safeValue = isNaN(value) ? 0 : value;
    const safeTotal = isNaN(total) || total === 0 ? 1 : total;
    const percentage = (safeValue / safeTotal) * 100;
    const circumference = 2 * Math.PI * 35;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-32 h-32">
        <svg className="transform -rotate-90 w-32 h-32">
          <circle
            cx="64"
            cy="64"
            r="35"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200 dark:text-slate-700"
          />
          <circle
            cx="64"
            cy="64"
            r="35"
            stroke={color}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={loading ? circumference : strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-2xl font-bold text-gray-800 dark:text-white">{safeValue}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center px-2">{label}</p>
        </div>
      </div>
    );
  };

  // Stat Card with Icon - FIXED: Changed <p> to <span> to avoid nesting error
  const StatCard = ({ icon: Icon, label, value, color, bgColor }) => (
    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-900/50 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-900 transition-colors">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bgColor}`}>
        <Icon size={18} className="text-white" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <div className={`text-lg font-bold ${color}`}>
          {loading ? (
            <div className="h-6 w-16 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
          ) : (
            value
          )}
        </div>
      </div>
    </div>
  );

  // Applications Pie Chart Data
  const applicationsPieData = [
    { label: 'Pending', value: stats?.applications?.pending || 0 },
    { label: 'For Review', value: stats?.applications?.forReview || 0 },
    { label: 'Approved', value: stats?.applications?.approved || 0 },
    { label: 'Rejected', value: stats?.applications?.rejected || 0 }
  ];

  const applicationsPieColors = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'];

  // Enrollments Bar Chart Data
  const enrollmentsBarData = [
    { label: 'Total Enrolled', value: stats?.enrollments?.total || 0 },
    { label: 'This Year', value: stats?.enrollments?.thisYear || 0 },
    { label: 'Pending', value: stats?.enrollments?.pending || 0 },
    { label: 'Cancelled', value: stats?.enrollments?.cancelled || 0 }
  ];

  const enrollmentsBarColors = [
    'bg-gradient-to-r from-purple-500 to-purple-600',
    'bg-gradient-to-r from-green-500 to-green-600',
    'bg-gradient-to-r from-amber-500 to-amber-600',
    'bg-gradient-to-r from-red-500 to-red-600'
  ];

  return (
    <div className="space-y-6">
      {/* Applications & Enrollments - Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Applications Module with Pie Chart */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#F3D67D] dark:bg-slate-700 flex items-center justify-center shadow-lg">
              <FileText size={24} className="text-slate-800 dark:text-slate-100" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Applications Overview</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Distribution by status</p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <PieChart data={applicationsPieData} colors={applicationsPieColors} />
            <div className="mt-6 w-full max-w-xs space-y-2">
              {applicationsPieData.map((item, index) => (
                <div key={index} className="flex items-center justify-between gap-3 p-2 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: applicationsPieColors[index] }}></div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enrollments Module with Bar Chart */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#F3D67D] dark:bg-slate-700 flex items-center justify-center shadow-lg">
              <GraduationCap size={24} className="text-slate-800 dark:text-slate-100" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Enrollments Status</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Current school year</p>
            </div>
          </div>

          <BarChart data={enrollmentsBarData} colors={enrollmentsBarColors} />
        </div>
      </div>

      {/* Transactions, Students & Documents - Donut Charts & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Transactions Module */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#F3D67D] dark:bg-slate-700 flex items-center justify-center shadow-lg">
              <DollarSign size={24} className="text-slate-800 dark:text-slate-100" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-800 dark:text-gray-200">Transactions</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Financial overview</p>
            </div>
          </div>

          <div className="mb-6 p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-xs text-green-700 dark:text-green-400 font-medium mb-1">Total Collected (SY)</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              ₱{(stats?.transactions?.totalCollected || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="flex justify-center mb-4">
            <DonutChart
              value={stats?.transactions?.outstandingCount || 0}
              total={(stats?.transactions?.outstandingCount || 0) + (stats?.transactions?.clearedThisQuarter || 0)}
              color="#ef4444"
              label="Outstanding"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-slate-900/50 rounded">
              <span className="text-xs text-gray-600 dark:text-gray-400">Pending Verification</span>
              <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                {stats?.transactions?.pendingVerification || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-slate-900/50 rounded">
              <span className="text-xs text-gray-600 dark:text-gray-400">Verified This Month</span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                {stats?.transactions?.verifiedThisMonth || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-slate-900/50 rounded">
              <span className="text-xs text-gray-600 dark:text-gray-400">Cleared This Quarter</span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {stats?.transactions?.clearedThisQuarter || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Students Module */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#F3D67D] dark:bg-slate-700 flex items-center justify-center shadow-lg">
              <Users size={24} className="text-slate-800 dark:text-slate-100" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-800 dark:text-gray-200">Students</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Student records</p>
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <DonutChart
              value={stats?.students?.totalActive || 0}
              total={stats?.students?.totalActive || 1}
              color="#6366f1"
              label="Active"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <TrendingUp size={16} className="text-green-600 dark:text-green-400 mb-1" />
              <p className="text-xs text-green-700 dark:text-green-400 font-medium">New</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                {stats?.students?.newThisYear || 0}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <Users size={16} className="text-blue-600 dark:text-blue-400 mb-1" />
              <p className="text-xs text-blue-700 dark:text-blue-400 font-medium">Transferees</p>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {stats?.students?.transferees || 0}
              </p>
            </div>
            <div className="col-span-2 p-3 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <GraduationCap size={16} className="text-purple-600 dark:text-purple-400 mb-1" />
              <p className="text-xs text-purple-700 dark:text-purple-400 font-medium">Graduated</p>
              <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                {stats?.students?.graduated || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Document Requests Module */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#F3D67D] dark:bg-slate-700 flex items-center justify-center shadow-lg">
              <FileCheck size={24} className="text-slate-800 dark:text-slate-100" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-800 dark:text-gray-200">Documents</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Request status</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative pt-4">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block text-amber-600 dark:text-amber-400">
                    Pending
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-amber-600 dark:text-amber-400">
                    {stats?.documents?.pending || 0}
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 text-xs flex rounded-full bg-amber-200 dark:bg-amber-900/30">
                <div
                  style={{ width: loading ? '0%' : `${((stats?.documents?.pending || 0) / (stats?.documents?.thisMonth || 1)) * 100}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-amber-500 transition-all duration-700"
                ></div>
              </div>
            </div>

            <div className="relative pt-4">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block text-blue-600 dark:text-blue-400">
                    Processing
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600 dark:text-blue-400">
                    {stats?.documents?.processing || 0}
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 text-xs flex rounded-full bg-blue-200 dark:bg-blue-900/30">
                <div
                  style={{ width: loading ? '0%' : `${((stats?.documents?.processing || 0) / (stats?.documents?.thisMonth || 1)) * 100}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-700"
                ></div>
              </div>
            </div>

            <div className="relative pt-4">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block text-green-600 dark:text-green-400">
                    Completed
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-green-600 dark:text-green-400">
                    {stats?.documents?.completed || 0}
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 text-xs flex rounded-full bg-green-200 dark:bg-green-900/30">
                <div
                  style={{ width: loading ? '0%' : `${((stats?.documents?.completed || 0) / (stats?.documents?.thisMonth || 1)) * 100}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-700"
                ></div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <p className="text-xs text-orange-700 dark:text-orange-400 font-medium mb-1">This Month</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {stats?.documents?.thisMonth || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
