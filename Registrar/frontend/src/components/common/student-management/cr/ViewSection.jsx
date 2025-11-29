import { useEffect, useState } from "react";
import HeaderActions from "./components/HeaderActions";
import StudentTable from "./components/StudentTable";

const ViewSection = ({ section }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  if (!section) return; // if section is null, do nothing

  const sectionId = section.SectionID || section.id;
  if (!sectionId) return;

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/SMS-GCA-3H/Registrar/backend/api/cr/crApi.php?path=sections/${sectionId}/students&schoolYearId=7`
      );
      const data = await response.json();
      console.log("Fetched students:", data); // check console
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch students:", err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  fetchStudents();
}, [section]);

  return (
    <div className="w-full bg-gray-800 rounded-xl p-6 mt-6">
      <HeaderActions sectionId={section.SectionID} />

      <h2 className="text-xl font-bold mb-4">
        {section.SectionName} — Student List
      </h2>

      {loading ? (
        <p>Loading students...</p>
      ) : students.length === 0 ? (
        <p>No students enrolled in this section.</p>
      ) : (
        <table className="w-full text-left text-gray-300">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-2">Student</th>
              <th>Parent</th>
              <th>Contact</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s) => (
              <tr key={s.StudentProfileID} className="border-b border-gray-700">
                <td className="py-2">{s.Student}</td>
                <td>{s.Guardian}</td>
                <td>{s.Contact}</td>
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
      )}
    </div>
  );
};

export default ViewSection;
