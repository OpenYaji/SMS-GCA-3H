import { Eye, Edit } from "lucide-react";

export default function StudentsTable({
  paginatedStudents,
  handleViewStudent,
  handleEditStudent,
}) {
  return (
    <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
      <table className="w-full" id="students-table">
        <thead className="bg-gray-100 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold">Student Number</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Student Name</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Grade & Section</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Guardian</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Contact</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
            <th className="px-6 py-3 text-center text-sm font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
          {paginatedStudents.length > 0 ? (
            paginatedStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition">
                <td className="px-6 py-4 text-sm">{student.studentNumber}</td>

                <td className="px-6 py-4">
                  <div className="font-medium text-sm">{student.fullName}</div>
                </td>

                <td className="px-6 py-4 text-sm">
                  {student.gradeLevel} - {student.section}
                </td>

                <td className="px-6 py-4 text-sm">{student.guardianName}</td>

                <td className="px-6 py-4 text-sm">{student.guardianPhone}</td>

                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      student.status === "Enrolled"
                        ? "bg-green-500 text-white"
                        : student.status === "Withdrawn"
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                    }`}
                  >
                    {student.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    
                    {/* View Button */}
                    <div className="relative inline-block group">
                      <button
                        className="inline-flex items-center gap-1.5 border border-blue-500 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-md text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
                        onClick={() => handleViewStudent(student)}
                        type="button"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                      <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-medium rounded-md px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                        View student details
                      </span>
                    </div>

                    {/* Edit Button */}
                    <div className="relative inline-block group">
                      <button
                        className="inline-flex items-center gap-1.5 border border-green-500 text-green-600 dark:text-green-400 px-3 py-1.5 rounded-md text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-green-50 dark:hover:bg-green-900/20 transition"
                        onClick={() => handleEditStudent(student)}
                        type="button"
                      >
                        <Edit className="w-3.5 h-3.5" /> Edit
                      </button>
                      <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-medium rounded-md px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                        Edit student information
                      </span>
                    </div>

                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="px-6 py-12 text-center">
                <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                  <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-lg font-medium">No students found</p>
                  <p className="text-sm">Try adjusting your search or filters</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}