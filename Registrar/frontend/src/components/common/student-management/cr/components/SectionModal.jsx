import { useEffect, useState } from "react";
import HeaderActions from "./HeaderActions";
import StudentTable from "./StudentTable";
import { getSectionStudents } from "../api/crApi";  // ✔ FIXED

const SectionModal = ({ section, onClose }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        // ✔ FIXED: correct function + pass schoolYearId 
        const data = await getSectionStudents(section.SectionID, 7);
        setStudents(data);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      }
      setLoading(false);
    };
    fetchStudents();
  }, [section.SectionID]);

 return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 
                 animate-fade-in"
    >
      <div
        className="relative bg-gray-800 rounded-xl w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto p-6"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-gray-300 transition"
          aria-label="Close modal"
        >
          &times;
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold mb-6 text-white">
          {section.SectionName} — Student List
        </h2>

        <HeaderActions sectionId={section.SectionID} />

        {loading ? (
          <p className="text-center text-gray-400 mt-8">Loading students...</p>
        ) : (
          <StudentTable students={students} />
        )}
      </div>

      {/* Animation CSS */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.25s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default SectionModal;