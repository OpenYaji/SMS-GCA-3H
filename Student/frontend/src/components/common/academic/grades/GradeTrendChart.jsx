import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const GradeTrendChart = ({ subjects }) => {
  // Determine which quarters have data
  const hasQuarterData = {
    q1: subjects.some(s => s.q1 !== null && s.q1 !== undefined),
    q2: subjects.some(s => s.q2 !== null && s.q2 !== undefined),
    q3: subjects.some(s => s.q3 !== null && s.q3 !== undefined),
    q4: subjects.some(s => s.q4 !== null && s.q4 !== undefined)
  };

  // Build chart data dynamically
  const chartData = subjects.map(subject => {
    const data = { name: subject.name };
    if (hasQuarterData.q1) data['1st Quarter'] = subject.q1;
    if (hasQuarterData.q2) data['2nd Quarter'] = subject.q2;
    if (hasQuarterData.q3) data['3rd Quarter'] = subject.q3;
    if (hasQuarterData.q4) data['4th Quarter'] = subject.q4;
    return data;
  });

  // Define colors for each quarter
  const quarterColors = {
    '1st Quarter': '#F59E0B',
    '2nd Quarter': '#3B82F6',
    '3rd Quarter': '#10B981',
    '4th Quarter': '#8B5CF6'
  };

  // Get active quarters for bars
  const activeQuarters = [];
  if (hasQuarterData.q1) activeQuarters.push('1st Quarter');
  if (hasQuarterData.q2) activeQuarters.push('2nd Quarter');
  if (hasQuarterData.q3) activeQuarters.push('3rd Quarter');
  if (hasQuarterData.q4) activeQuarters.push('4th Quarter');

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 shadow-md">
      <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4">Grade Trends by Quarter</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis domain={[70, 100]} tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid #ccc',
                backdropFilter: 'blur(5px)',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '14px' }} />
            {activeQuarters.map((quarter) => (
              <Bar
                key={quarter}
                dataKey={quarter}
                fill={quarterColors[quarter]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GradeTrendChart;