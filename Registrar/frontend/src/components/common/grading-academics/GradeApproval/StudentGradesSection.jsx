import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentGradesSection = ({ submission, apiBaseUrl }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const [submissionDetails, setSubmissionDetails] = useState(null);

  useEffect(() => {
    const fetchStudentGrades = async () => {
      if (!submission?.id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const url = `${apiBaseUrl}/grades/get-submission-details.php?submissionId=${submission.id}`;
        const response = await axios.get(url, { withCredentials: true });
        
        if (response.data.success) {
          setStudents(response.data.data.students || []);
          setSubmissionDetails(response.data.data.submission);
        } else {
          throw new Error(response.data.message || 'Failed to fetch grades');
        }
      } catch (err) {
        console.error('Error fetching student grades:', err);
        setError(err.message || 'Failed to load student grades');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudentGrades();
  }, [submission?.id, apiBaseUrl]);

  if (loading) {
    return (
      <div className="lg:col-span-2 bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-2"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading student grades...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lg:col-span-2 bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center text-red-500">
            <p className="mb-2">⚠️ {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-2 bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
        Student Grades ({students.length} students)
      </h3>
      
      <div className="overflow-auto max-h-96">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-600">
          <thead className="bg-gray-100 dark:bg-slate-600 sticky top-0">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Student Name
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Student No.
              </th>
              {students[0]?.subjects?.map((subject) => (
                <th 
                  key={subject.id} 
                  className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase"
                  title={subject.name}
                >
                  {subject.code || subject.name.substring(0, 6)}
                </th>
              ))}
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Average
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-slate-600">
            {students.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-4 text-center text-gray-500 dark:text-gray-400">
                  No student grades found
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-100 dark:hover:bg-slate-600">
                  <td className="px-3 py-2 text-sm text-gray-800 dark:text-white font-medium whitespace-nowrap">
                    {student.name}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300">
                    {student.studentNumber}
                  </td>
                  {student.subjects.map((subject) => (
                    <td 
                      key={subject.id} 
                      className={`px-3 py-2 text-sm text-center ${
                        subject.grade === null 
                          ? 'text-gray-400' 
                          : subject.grade < 75 
                            ? 'text-red-600 dark:text-red-400 font-semibold' 
                            : 'text-gray-800 dark:text-white'
                      }`}
                    >
                      {subject.grade !== null ? subject.grade : '-'}
                    </td>
                  ))}
                  <td className={`px-3 py-2 text-sm text-center font-semibold ${
                    student.average === null 
                      ? 'text-gray-400' 
                      : student.average < 75 
                        ? 'text-red-600 dark:text-red-400' 
                        : 'text-green-600 dark:text-green-400'
                  }`}>
                    {student.average !== null ? student.average.toFixed(2) : '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Summary statistics */}
      {students.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-600">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400">Total Students</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">{students.length}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400">Passing</p>
              <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                {students.filter(s => s.average !== null && s.average >= 75).length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400">Failing</p>
              <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                {students.filter(s => s.average !== null && s.average < 75).length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentGradesSection;
