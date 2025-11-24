import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const STATUS_COLORS = {
  Paid: '#10B981',    // Green
  Pending: '#F59E0B', // Amber
  Overdue: '#EF4444',   // Red
  'No Data': '#475569' // default
};

const PayAnalysisCard = ({ data }) => {
  const defaultData = [{ name: 'No Data', value: 100 }];
  const totalValue = data?.reduce((sum, entry) => sum + entry.value, 0) || 0;
  const hasData = totalValue > 0;
  const displayData = hasData ? data : defaultData;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length && hasData) {
      return (
        <div className="bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 p-2 border border-gray-200 dark:border-slate-700 rounded-md shadow-lg">
          <p className="font-bold text-gray-800 dark:text-gray-100">{`${payload[0].name}: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 shadow-md h-full">
      <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4">Pay Analysis</h3>
      <div className="h-48 w-full mb-4">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={displayData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={hasData ? 5 : 0}
              dataKey="value"
              cornerRadius={hasData ? 8 : 0}
            >
              {displayData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name]} stroke={STATUS_COLORS[entry.name]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-4 text-xs">
        {displayData.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: STATUS_COLORS[item.name] }}></span>
            <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PayAnalysisCard;