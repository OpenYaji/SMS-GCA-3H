const StudentTable = ({ students }) => {
  if (!students || students.length === 0) {
    return <p className="text-gray-400">No students enrolled.</p>;
  }

  return (
    <table className="w-full text-left text-gray-300">
      <thead>
        <tr className="border-b border-gray-700">
          <th className="py-2">Student Number</th>
          <th>Student</th>
          <th>Parent/Guardian</th>
          <th>Contact</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {students.map((s) => (
          <tr key={s.StudentProfileID} className="border-b border-gray-700">
            
            {/* Student Number */}
            <td className="py-2">{s.StudentNumber ?? "N/A"}</td>

            {/* Student Name + Profile Picture */}
            <td className="py-2 flex items-center gap-2">
              {s.ProfilePictureURL && (
                <img
                  src={s.ProfilePictureURL}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              {s.Student}
            </td>

            {/* Guardian */}
            <td>{s.Guardian ?? "N/A"}</td>


            {/* Contact */}
            <td>{s.Contact ?? "N/A"}</td>

            {/* Status */}
            <td>
              <span
                className={`px-2 py-1 rounded text-white text-sm ${
                  s.Status === "Enrolled" ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {s.Status}
              </span>
            </td>

          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StudentTable;