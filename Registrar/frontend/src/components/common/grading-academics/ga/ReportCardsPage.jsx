import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost/SMS-GCA-3H/Registrar/backend/api';

const ReportCardsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [releasing, setReleasing] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/grades/get-students-with-grades.php`, { withCredentials: true });
      
      if (response.data.success) {
        setStudents(response.data.data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const releaseGrades = async (student) => {
    if (!confirm(`Release grades to ${student.name}?`)) return;

    try {
      setReleasing(true);
      const response = await axios.post(
        `${API_BASE_URL}/grades/release-grades.php`,
        { studentId: student.id },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        alert(response.data.message);
        fetchStudents();
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setReleasing(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Report Cards - Grade Release</h1>
      
      {students.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600">No students with approved grades</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{student.studentNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{student.name}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => releaseGrades(student)}
                      disabled={releasing}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
                    >
                      Release Grades
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReportCardsPage;
