import { Eye } from "lucide-react";

export default function StudentsTable({
  paginatedStudents,
  handleViewStudent,
}) {
  return (
    <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
      <table className="w-full">
        <thead className="bg-gray-100 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600">
          <tr>
            <th className="px-6 py-3 text-left">Student Number</th>
            <th className="px-6 py-3 text-left">Student Name</th>
            <th className="px-6 py-3 text-left">Grade & Section</th>
            <th className="px-6 py-3 text-left">Guardian</th>
            <th className="px-6 py-3 text-left">Contact</th>
            <th className="px-6 py-3 text-left">Status</th>
            <th className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
          {paginatedStudents.length > 0 ? (
            paginatedStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                <td className="px-6 py-4">{student.studentNumber}</td>

                <td className="px-6 py-4">
                  <div className="font-medium">{student.fullName}</div>
                </td>

                <td className="px-6 py-4">
                  {student.gradeLevel} - {student.section}
                </td>

                <td className="px-6 py-4">{student.guardianName}</td>

                <td className="px-6 py-4">{student.guardianPhone}</td>

                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      student.status === "Enrolled"
                        ? "bg-green-500 text-white"
                        : student.status === "Withdrawn"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {student.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-center">
                  <div className="relative inline-block group">
                    <button
                      className="inline-flex items-center gap-2 border border-gray-400 text-black dark:text-white px-3 py-1.5 rounded-md text-sm font-semibold bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 transition cursor-pointer"
                      onClick={() => handleViewStudent(student)}
                      type="button"
                    >
                      <Eye className="w-4 h-4" /> View
                    </button>

                    {/* Tooltip */}
                    <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-medium rounded-md px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                      View student details
                    </span>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="px-6 py-12 text-center">
                <p className="text-gray-500">No students found. Adjust your filters.</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
