// C:\xampp\htdocs\SMS-GCA-3H\Registrar\frontend\src\components\common\records\DocumentRequests.jsx

import React, { useState } from "react";
import ProcessRequestModal from "./ProcessRequestModal";

const DocumentRequests = () => {
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [filters, setFilters] = useState({
    documentType: "all",
    gradeLevel: "all",
    status: "all",
  });

  // Sample data - replace with API calls
  const students = [
    {
      id: 1,
      name: "Abuel, Kristine M.",
      studentId: "GCA-2025-004",
      gradeLevel: "Grade 7",
      documentType: "Form 137",
      requestDate: "Oct 15, 2025",
      status: "Pending",
      parentGuardian: "Abuel, Maria T.",
      contact: "09123456789",
      requestReason: "Transfer to another school",
    },
    {
      id: 2,
      name: "Almilla, John T.",
      studentId: "GCA-2025-006",
      gradeLevel: "Grade 9",
      documentType: "Certificate of Good Moral",
      requestDate: "Oct 16, 2025",
      status: "Pending",
      parentGuardian: "Almilla, Rosa S.",
      contact: "09234567890",
      requestReason: "Scholarship application",
    },
    {
      id: 3,
      name: "Bordallo, Angelo J.",
      studentId: "GCA-2025-011",
      gradeLevel: "Grade 4",
      documentType: "Form 137",
      requestDate: "Oct 20, 2025",
      status: "Pending",
      parentGuardian: "Bordallo, Jose M.",
      contact: "09345678901",
      requestReason: "Transfer to another school",
    },
    {
      id: 4,
      name: "Cruz, Catherine S.",
      studentId: "GCA-2025-017",
      gradeLevel: "Grade 3",
      documentType: "Certificate of Enrollment",
      requestDate: "Oct 21, 2025",
      status: "Pending",
      parentGuardian: "Cruz, Anna L.",
      contact: "09456789012",
      requestReason: "Travel visa application",
    },
  ];

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStudents(students.map((s) => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (studentId) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters({
      ...filters,
      [filterName]: value,
    });
  };

  const handleExportList = () => {
    console.log("Exporting list...");
    alert("Export feature: Generate CSV/Excel report");
  };

  const handleProcessSelected = () => {
    if (selectedStudents.length === 0) {
      alert("Please select at least one request");
      return;
    }
    console.log(`Processing ${selectedStudents.length} request(s)`);
    alert(`Processing ${selectedStudents.length} document request(s)`);
  };

  const handleProcessRequest = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto animate-fadeIn">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 mb-6 transition-all duration-300">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            📋 Document Requests
          </h2>

          {/* Filter Bar */}
          <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-stone-900 rounded-xl p-4 flex flex-wrap gap-4 items-center shadow-xl">
            <div className="flex items-center gap-2">
              <label className="text-white text-sm font-bold">Document Type:</label>
              <select
                value={filters.documentType}
                onChange={(e) => handleFilterChange("documentType", e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all hover:shadow-md cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="form137">Form 137</option>
                <option value="goodmoral">Good Moral Certificate</option>
                <option value="enrollment">Certificate of Enrollment</option>
                <option value="diploma">Diploma</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-white text-sm font-bold">Grade Level:</label>
              <select
                value={filters.gradeLevel}
                onChange={(e) => handleFilterChange("gradeLevel", e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all hover:shadow-md cursor-pointer"
              >
                <option value="all">All Grades</option>
                <option value="7">Grade 7</option>
                <option value="8">Grade 8</option>
                <option value="9">Grade 9</option>
                <option value="10">Grade 10</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-white text-sm font-bold">Status:</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all hover:shadow-md cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="ready">Ready</option>
              </select>
            </div>

            <div className="ml-auto flex gap-2">
              <button
                onClick={handleExportList}
                className="flex items-center gap-2 px-5 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
              >
                <span className="text-lg">📄</span>
                <span className="text-sm font-bold">Export List</span>
              </button>
              <button
                onClick={handleProcessSelected}
                className="flex items-center gap-2 px-5 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
              >
                <span className="text-lg">✓</span>
                <span className="text-sm font-bold">Process Selected</span>
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 group cursor-pointer">
            <h3 className="text-gray-600 text-sm font-bold mb-2 tracking-wide uppercase">
              Pending Requests
            </h3>
            <p className="text-5xl font-bold text-gray-900 mb-3 group-hover:scale-110 transition-transform">
              8
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 group cursor-pointer">
            <h3 className="text-gray-600 text-sm font-bold mb-2 tracking-wide uppercase">
              Form 137 Requests
            </h3>
            <p className="text-5xl font-bold text-gray-900 mb-3 group-hover:scale-110 transition-transform">
              5
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 group cursor-pointer">
            <h3 className="text-gray-600 text-sm font-bold mb-2 tracking-wide uppercase">
              Certificates
            </h3>
            <p className="text-5xl font-bold text-gray-900 mb-3 group-hover:scale-110 transition-transform">
              2
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 group cursor-pointer">
            <h3 className="text-gray-600 text-sm font-bold mb-2 tracking-wide uppercase">
              Other Documents
            </h3>
            <p className="text-5xl font-bold text-gray-900 mb-3 group-hover:scale-110 transition-transform">
              1
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-x-auto hover:shadow-2xl transition-all duration-300">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left w-12">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={
                      students.length > 0 &&
                      selectedStudents.length === students.length
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-900 tracking-wide">
                  Student Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-900 tracking-wide">
                  Student ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-900 tracking-wide">
                  Grade Level
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-900 tracking-wide">
                  Document Type
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-900 tracking-wide">
                  Request Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-900 tracking-wide">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-900 tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-gray-50 transition-all duration-200 hover:scale-[1.01]"
                >
                  <td className="px-6 py-4 w-12">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleSelectStudent(student.id)}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {student.studentId}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                    {student.gradeLevel}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                    {student.documentType}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                    {student.requestDate}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full shadow-sm">
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleProcessRequest(student)}
                      className="px-4 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors shadow-sm"
                    >
                      📝 Process
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {students.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-md mt-6">
            <div className="text-gray-400 text-5xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No document requests found
            </h3>
            <p className="text-gray-600">
              No pending document requests at the moment.
            </p>
          </div>
        )}
      </div>

      <ProcessRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        student={selectedStudent}
      />

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DocumentRequests;