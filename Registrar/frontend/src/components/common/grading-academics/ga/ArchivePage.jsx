import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost/SMS-GCA-3H/Registrar/backend/api';

const ArchivePage = () => {
  const [archivedGrades, setArchivedGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchArchivedGrades();
  }, []);

  const fetchArchivedGrades = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/grades/get-archived-grades.php`, { withCredentials: true });
      
      if (response.data.success) {
        setArchivedGrades(response.data.data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to load archived grades: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredGrades = archivedGrades.filter(record =>
    record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.gradeLevel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading archived grades...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Grade Archive</h1>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 mb-6 border border-gray-200 dark:border-slate-700">
        <input
          type="text"
          placeholder="Search by student name or grade level..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 dark:border-slate-600 rounded px-4 py-2 bg-white dark:bg-slate-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {filteredGrades.length === 0 ? (
        <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-8 text-center border border-gray-200 dark:border-slate-700">
          <p className="text-gray-600 dark:text-gray-400 text-lg">No archived grades found</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-slate-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead className="bg-[#3C2F2F] dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Grade Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">School Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Average</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Released</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              {filteredGrades.map((record, idx) => (
                <tr key={idx} className="hover:bg-amber-50 dark:hover:bg-slate-700">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{record.studentName}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">{record.gradeLevel}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">{record.schoolYear}</td>
                  <td className="px-6 py-4">
                    <span className={`font-semibold ${
                      record.finalAverage >= 90 ? 'text-green-600 dark:text-green-400' :
                      record.finalAverage >= 75 ? 'text-blue-600 dark:text-blue-400' :
                      'text-red-600 dark:text-red-400'
                    }`}>
                      {record.finalAverage}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{record.releasedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ArchivePage;