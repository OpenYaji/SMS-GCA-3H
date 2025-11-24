import { useState, useEffect, useRef } from "react";
import {
  X,
  Calendar,
  BookOpen,
  TrendingUp,
  Loader,
  AlertCircle,
  Download,
  ChevronDown,
  FileText,
  Grid,
  LayoutGrid,
  Table,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import studentService from "../../../../services/studentService";
import logo from "../../../../assets/images/logo1.png";

const BaseModal = ({
  isOpen,
  title,
  children,
  onClose,
  width = "max-w-lg",
  darkMode = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div
        className={`rounded-2xl shadow-lg p-6 w-full ${width} relative animate-fadeIn font-kumbh ${
          darkMode ? "bg-gray-900 text-white" : "bg-white"
        }`}
      >
        <button
          onClick={onClose}
          className={`absolute top-3 right-3 text-2xl transition ${
            darkMode
              ? "text-gray-400 hover:text-gray-200"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          &times;
        </button>
        {title && (
          <h2
            className={`text-2xl font-semibold mb-4 font-kumbh ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            {title}
          </h2>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
};

// QuarterGrades component for per-quarter view
const QuarterGrades = ({ quarter, quarterName, darkMode, onDownload }) => {
  if (!quarter || !quarter.Grades || quarter.Grades.length === 0) {
    return (
      <div
        className={`rounded-lg p-4 text-center ${
          darkMode ? "bg-gray-700" : "bg-gray-100"
        }`}
      >
        <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
          No grades available for {quarterName}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h4
          className={`font-semibold text-base ${
            darkMode ? "text-gray-200" : "text-gray-800"
          }`}
        >
          {quarterName}
        </h4>
        {onDownload && (
          <button
            onClick={() => onDownload(quarter, quarterName)}
            className={`px-3 py-1 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm ${
              darkMode
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            <Download className="w-4 h-4" />
            Download Excel
          </button>
        )}
      </div>
      <div
        className={`rounded-lg overflow-hidden border ${
          darkMode ? "border-gray-600" : "border-gray-200"
        }`}
      >
        <table className="w-full text-sm">
          <thead>
            <tr className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
              <th
                className={`text-left p-3 font-semibold ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Subject
              </th>
              <th
                className={`text-center p-3 font-semibold ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Grade
              </th>
              <th
                className={`text-center p-3 font-semibold ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Status
              </th>
              <th
                className={`text-left p-3 font-semibold ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Remarks
              </th>
            </tr>
          </thead>
          <tbody>
            {quarter.Grades.map((subject, index) => {
              const gradeValue = parseFloat(subject.GradeValue) || 0;
              const isPassing = gradeValue >= 75;

              return (
                <tr
                  key={index}
                  className={`border-t ${
                    darkMode
                      ? "border-gray-600 hover:bg-gray-700"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <td
                    className={`p-3 font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {subject.Subject}
                  </td>
                  <td className="p-3 text-center font-bold">
                    <span
                      className={isPassing ? "text-green-600" : "text-red-600"}
                    >
                      {gradeValue.toFixed(2)}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        subject.Status === "Passed"
                          ? darkMode
                            ? "bg-green-900 text-green-200"
                            : "bg-green-100 text-green-800"
                          : darkMode
                          ? "bg-red-900 text-red-200"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {subject.Status || "N/A"}
                    </span>
                  </td>
                  <td
                    className={`p-3 text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {subject.Remarks || "No remarks"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {quarter.Average !== null && quarter.Average !== undefined && (
          <div
            className={`p-3 border-t ${
              darkMode
                ? "border-gray-600 bg-gray-700"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="flex justify-between items-center">
              <span
                className={`font-semibold ${
                  darkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Quarter Average:
              </span>
              <span
                className={`text-lg font-bold ${
                  quarter.Average >= 75 ? "text-green-600" : "text-red-600"
                }`}
              >
                {quarter.Average.toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// SchoolYearGrades component for consolidated view
const SchoolYearGrades = ({
  gradeRecord,
  darkMode,
  viewMode,
  includeSummary = true,
}) => {
  const quarters = [
    { key: "FirstQuarter", name: "First Quarter" },
    { key: "SecondQuarter", name: "Second Quarter" },
    { key: "ThirdQuarter", name: "Third Quarter" },
    { key: "FourthQuarter", name: "Fourth Quarter" },
  ];

  // Per Quarter View
  if (viewMode === "perQuarter") {
    return (
      <div className="space-y-6">
        {/* Header Info */}
        <div
          className={`rounded-lg p-4 ${
            darkMode ? "bg-gray-700" : "bg-gray-100"
          }`}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
                School Year:
              </span>
              <p
                className={`font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {gradeRecord.SchoolYear}
              </p>
            </div>
            <div className="md:col-span-2">
              <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
                Grade Level & Section:
              </span>
              <p
                className={`font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {gradeRecord.GradeLevel} - {gradeRecord.Section}
              </p>
            </div>
            <div>
              <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
                General Average:
              </span>
              <p
                className={`text-lg font-bold ${
                  gradeRecord.GeneralAverage >= 75
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {gradeRecord.GeneralAverage
                  ? gradeRecord.GeneralAverage.toFixed(2)
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Summary - Only show if includeSummary is true */}
        {includeSummary && gradeRecord.Summary && (
          <div
            className={`rounded-lg p-4 ${
              darkMode
                ? "bg-blue-900/20 border border-blue-800"
                : "bg-blue-50 border border-blue-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <span
                className={`font-semibold ${
                  darkMode ? "text-blue-300" : "text-blue-700"
                }`}
              >
                Summary
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className={darkMode ? "text-blue-300" : "text-blue-600"}>
                  Total Subjects:
                </span>
                <p
                  className={`font-semibold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {gradeRecord.Summary.TotalSubjects || 0}
                </p>
              </div>
              <div>
                <span className={darkMode ? "text-blue-300" : "text-blue-600"}>
                  Completed Quarters:
                </span>
                <p
                  className={`font-semibold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {gradeRecord.Summary.CompletedQuarters || 0}/4
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quarters */}
        <div className="space-y-6">
          {quarters.map((quarter) => (
            <QuarterGrades
              key={quarter.key}
              quarter={gradeRecord.Quarters?.[quarter.key]}
              quarterName={quarter.name}
              darkMode={darkMode}
            />
          ))}
        </div>
      </div>
    );
  }

  // Consolidated View (View as Whole)
  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div
        className={`rounded-lg p-4 ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
              School Year:
            </span>
            <p
              className={`font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {gradeRecord.SchoolYear}
            </p>
          </div>
          <div className="md:col-span-2">
            <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
              Grade Level & Section:
            </span>
            <p
              className={`font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {gradeRecord.GradeLevel} - {gradeRecord.Section}
            </p>
          </div>
          <div>
            <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
              General Average:
            </span>
            <p
              className={`text-lg font-bold ${
                gradeRecord.GeneralAverage >= 75
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {gradeRecord.GeneralAverage
                ? gradeRecord.GeneralAverage.toFixed(2)
                : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Summary - Only show if includeSummary is true */}
      {includeSummary && gradeRecord.Summary && (
        <div
          className={`rounded-lg p-4 ${
            darkMode
              ? "bg-blue-900/20 border border-blue-800"
              : "bg-blue-50 border border-blue-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <span
              className={`font-semibold ${
                darkMode ? "text-blue-300" : "text-blue-700"
              }`}
            >
              Summary
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className={darkMode ? "text-blue-300" : "text-blue-600"}>
                Total Subjects:
              </span>
              <p
                className={`font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {gradeRecord.Summary.TotalSubjects || 0}
              </p>
            </div>
            <div>
              <span className={darkMode ? "text-blue-300" : "text-blue-600"}>
                Completed Quarters:
              </span>
              <p
                className={`font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {gradeRecord.Summary.CompletedQuarters || 0}/4
              </p>
            </div>
          </div>
        </div>
      )}

      {/* All Quarters in One Table */}
      <div className="space-y-6">
        <div
          className={`rounded-lg overflow-hidden border ${
            darkMode ? "border-gray-600" : "border-gray-200"
          }`}
        >
          <table className="w-full text-sm">
            <thead>
              <tr className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
                <th
                  className={`text-left p-3 font-semibold ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Subject
                </th>
                {quarters.map((quarter) => (
                  <th
                    key={quarter.key}
                    className={`text-center p-3 font-semibold ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {quarter.name}
                  </th>
                ))}
                <th
                  className={`text-center p-3 font-semibold ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Status
                </th>
                <th
                  className={`text-left p-3 font-semibold ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Remarks
                </th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                // Get all unique subjects across all quarters
                const allSubjects = {};
                quarters.forEach((quarter) => {
                  const quarterData = gradeRecord.Quarters?.[quarter.key];
                  if (quarterData?.Grades) {
                    quarterData.Grades.forEach((subject) => {
                      if (!allSubjects[subject.SubjectCode]) {
                        allSubjects[subject.SubjectCode] = {
                          Subject: subject.Subject,
                          SubjectCode: subject.SubjectCode,
                          Status: subject.Status,
                          Remarks: subject.Remarks,
                          Grades: {},
                        };
                      }
                      allSubjects[subject.SubjectCode].Grades[quarter.key] =
                        parseFloat(subject.GradeValue) || 0;
                    });
                  }
                });

                return Object.values(allSubjects).map((subject, index) => (
                  <tr
                    key={index}
                    className={`border-t ${
                      darkMode
                        ? "border-gray-600 hover:bg-gray-700"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <td
                      className={`p-3 font-medium ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {subject.Subject}
                    </td>
                    {quarters.map((quarter) => {
                      const grade = subject.Grades[quarter.key];
                      const isPassing = grade >= 75;
                      return (
                        <td
                          key={quarter.key}
                          className="p-3 text-center font-bold"
                        >
                          {grade ? (
                            <span
                              className={
                                isPassing ? "text-green-600" : "text-red-600"
                              }
                            >
                              {grade.toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          subject.Status === "Passed"
                            ? darkMode
                              ? "bg-green-900 text-green-200"
                              : "bg-green-100 text-green-800"
                            : darkMode
                            ? "bg-red-900 text-red-200"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {subject.Status || ""}
                      </span>
                    </td>
                    <td
                      className={`p-3 text-xs ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {subject.Remarks || ""}
                    </td>
                  </tr>
                ));
              })()}
            </tbody>
          </table>

          {/* Quarter Averages */}
          <div
            className={`p-3 border-t ${
              darkMode
                ? "border-gray-600 bg-gray-700"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="flex justify-between items-center">
              <span
                className={`font-semibold ${
                  darkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Quarter Averages:
              </span>
              <div className="flex gap-6">
                {quarters.map((quarter) => {
                  const quarterData = gradeRecord.Quarters?.[quarter.key];
                  const average = quarterData?.Average;
                  return (
                    <div key={quarter.key} className="text-center">
                      <div className="text-xs text-gray-500">
                        {quarter.name.split(" ")[0]}
                      </div>
                      <span
                        className={`text-sm font-bold ${
                          average >= 75
                            ? "text-green-600"
                            : average
                            ? "text-red-600"
                            : "text-gray-400"
                        }`}
                      >
                        {average ? average.toFixed(2) : "-"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function StudentGradesModal({
  isOpen,
  onClose,
  student,
  darkMode = false,
}) {
  const [grades, setGrades] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedSchoolYear, setSelectedSchoolYear] = useState("");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [viewMode, setViewMode] = useState("whole"); // 'whole' or 'perQuarter'
  const [downloadStatus, setDownloadStatus] = useState(null); // null, 'success', 'error'
  const [downloadError, setDownloadError] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isOpen && student) {
      fetchGrades();
    }
  }, [isOpen, student]);

  useEffect(() => {
    if (grades && grades.GradeRecords && grades.GradeRecords.length > 0) {
      setSelectedSchoolYear(grades.GradeRecords[0].SchoolYear);
    }
  }, [grades]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDownloadOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchGrades = async () => {
    if (!student) return;

    setLoading(true);
    setError("");
    try {
      const studentId = student.studentProfileId || student.id;
      const gradesData = await studentService.getStudentGrades(studentId);

      console.log("Fetched grades data:", gradesData);
      setGrades(gradesData);
    } catch (err) {
      console.error("Error fetching student grades:", err);
      setError(err.message || "Failed to load student grades");
    } finally {
      setLoading(false);
    }
  };

  const getCurrentGradeRecord = () => {
    if (!grades || !grades.GradeRecords || !selectedSchoolYear) return null;
    return grades.GradeRecords.find(
      (record) => record.SchoolYear === selectedSchoolYear
    );
  };

  // Download as PDF function - UPDATED VERSION with bold labels and margin-top
  const downloadAsPDF = async () => {
    if (!grades) return;

    setIsGeneratingPDF(true);
    setShowDownloadOptions(false);
    setDownloadStatus(null);
    setDownloadError("");

    try {
      // Dynamically import jsPDF
      const { jsPDF } = await import("jspdf");

      const currentGradeRecord = getCurrentGradeRecord();
      if (!currentGradeRecord) {
        throw new Error("No grade data available for the selected school year");
      }

      // Create PDF with proper orientation
      const orientation = viewMode === "whole" ? "l" : "p"; // landscape for whole, portrait for per quarter
      const doc = new jsPDF(orientation, "mm", "a4");

      // Set document properties
      doc.setProperties({
        title: `Student Grades - ${student?.formattedName || student?.name}`,
        subject: "Student Grades Report",
        author: "Gymnazo Christian Academy - Novaliches",
        creator: "School Management System",
      });

      // Colors for styling
      const primaryColor = [52, 40, 37]; // yellow-500 in rgb format
      const lightGray = [243, 244, 246]; // gray-100
      const darkGray = [55, 65, 81]; // gray-700

      // Function to add header to each page
      const addHeader = (doc, pageNumber, totalPages) => {
        const pageWidth = doc.internal.pageSize.width;

        // Header background
        doc.setFillColor(...primaryColor);
        doc.rect(0, 0, pageWidth, 25, "F");

        // Add logo on left side
        try {
          doc.addImage(logo, "PNG", 10, 5, 15, 15);
        } catch (err) {
          console.log("Logo not available for PDF");
        }

        // School name
        doc.setFontSize(16);
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.text("GYMNAZO CHRISTIAN ACADEMY - NOVALICHES", pageWidth / 2, 12, {
          align: "center",
        });

        // Report title
        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255);
        doc.text("STUDENT GRADES REPORT", pageWidth / 2, 18, {
          align: "center",
        });

        // Add logo on right side
        try {
          doc.addImage(logo, "PNG", pageWidth - 25, 5, 15, 15);
        } catch (err) {
          console.log("Logo not available for PDF");
        }

        // Page number
        doc.setFontSize(8);
        doc.text(`Page ${pageNumber} of ${totalPages}`, pageWidth - 10, 22, {
          align: "right",
        });
      };

      let yPosition = 35;
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 15;

      // Student Information Section - UPDATED 2-COLUMN LAYOUT WITH BOLD LABELS
      doc.setFillColor(...lightGray);
      doc.roundedRect(margin, yPosition, pageWidth - margin * 2, 20, 3, 3, "F");

      doc.setFontSize(9);
      doc.setTextColor(...darkGray);

      // Calculate column positions
      const leftColumn = margin + 10;
      const rightColumn = pageWidth / 2 + 10;

      // First Column: Name, Grade and Section - ALL LABELS BOLD
      doc.setFont("helvetica", "bold");
      doc.text("Name:", leftColumn, yPosition + 8);
      doc.text("Grade & Section:", leftColumn, yPosition + 14);

      // Second Column: Student Number and School Year - ALL LABELS BOLD
      doc.text("Student No:", rightColumn, yPosition + 8);
      doc.text("School Year:", rightColumn, yPosition + 14);

      // Values in normal font
      doc.setFont("helvetica", "normal");
      doc.text(
        `${student?.formattedName || student?.name}`,
        leftColumn + 15,
        yPosition + 8
      );
      doc.text(
        `${currentGradeRecord?.GradeLevel || ""} - ${
          currentGradeRecord?.Section || ""
        }`,
        leftColumn + 35,
        yPosition + 14
      );
      doc.text(
        `${student?.studentNumber || student?.id}`,
        rightColumn + 25,
        yPosition + 8
      );
      doc.text(
        `${currentGradeRecord?.SchoolYear || ""}`,
        rightColumn + 28,
        yPosition + 14
      );

      yPosition += 25;

      // Determine the appropriate title based on view mode
      let gradesTitle;
      if (viewMode === "whole") {
        gradesTitle = "ALL QUARTERS GRADES";
      } else {
        // For per quarter view, determine which quarter has data
        const quarters = [
          { key: "FirstQuarter", name: "First Quarter" },
          { key: "SecondQuarter", name: "Second Quarter" },
          { key: "ThirdQuarter", name: "Third Quarter" },
          { key: "FourthQuarter", name: "Fourth Quarter" },
        ];

        const activeQuarter = quarters.find(
          (quarter) =>
            currentGradeRecord?.Quarters?.[quarter.key]?.Grades?.length > 0
        );

        if (activeQuarter) {
          gradesTitle = `${activeQuarter.name.toUpperCase()} GRADES`;
        } else {
          gradesTitle = "GRADES OVERVIEW";
        }
      }

      // Grades Table
      const quarters = [
        { key: "FirstQuarter", name: "First Quarter" },
        { key: "SecondQuarter", name: "Second Quarter" },
        { key: "ThirdQuarter", name: "Third Quarter" },
        { key: "FourthQuarter", name: "Fourth Quarter" },
      ];

      const allSubjects = {};
      quarters.forEach((quarter) => {
        const quarterData = currentGradeRecord?.Quarters?.[quarter.key];
        if (quarterData?.Grades) {
          quarterData.Grades.forEach((subject) => {
            if (!allSubjects[subject.SubjectCode]) {
              allSubjects[subject.SubjectCode] = {
                Subject: subject.Subject,
                SubjectCode: subject.SubjectCode,
                Status: subject.Status,
                Remarks: subject.Remarks,
                Grades: {},
              };
            }
            allSubjects[subject.SubjectCode].Grades[quarter.key] =
              parseFloat(subject.GradeValue) || 0;
          });
        }
      });

      if (Object.keys(allSubjects).length > 0) {
        // Table Header - ADDED MARGIN TOP
        if (yPosition > pageHeight - 30) {
          doc.addPage();
          addHeader(doc, doc.getNumberOfPages(), 0);
          yPosition = 35;
        }

        yPosition += 8;

        doc.setFontSize(11);
        doc.setTextColor(...darkGray);
        doc.setFont("helvetica", "bold");
        doc.text(gradesTitle, margin, yPosition);
        yPosition += 8;

        // Table Headers
        doc.setFillColor(...lightGray);
        doc.rect(margin, yPosition, pageWidth - margin * 2, 8, "F");

        doc.setFontSize(8);
        doc.setTextColor(...darkGray);

        if (viewMode === "whole") {
          // All quarters view - landscape
          let xPos = margin + 5;

          doc.text("SUBJECT", xPos, yPosition + 5.5);
          xPos += 70; // Width for subject column

          quarters.forEach((quarter) => {
            doc.text(
              quarter.name.split(" ")[0].toUpperCase(),
              xPos,
              yPosition + 5.5,
              { align: "center" }
            );
            xPos += 25;
          });

          doc.text("STATUS", xPos, yPosition + 5.5, { align: "center" });
        } else {
          // Per quarter view - portrait
          doc.text("SUBJECT", margin + 5, yPosition + 5.5);
          doc.text("GRADE", margin + 120, yPosition + 5.5, { align: "center" });
          doc.text("STATUS", margin + 150, yPosition + 5.5, {
            align: "center",
          });
        }

        yPosition += 8;

        // Table Rows
        doc.setFontSize(8);
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");

        Object.values(allSubjects).forEach((subject, index) => {
          if (yPosition > pageHeight - 15) {
            doc.addPage();
            addHeader(doc, doc.getNumberOfPages(), 0);
            yPosition = 35;

            // Redraw table headers
            doc.setFillColor(...lightGray);
            doc.rect(margin, yPosition, pageWidth - margin * 2, 8, "F");
            doc.setFontSize(8);
            doc.setTextColor(...darkGray);
            doc.setFont("helvetica", "bold");

            if (viewMode === "whole") {
              let xPos = margin + 5;
              doc.text("SUBJECT", xPos, yPosition + 5.5);
              xPos += 70;
              quarters.forEach((quarter) => {
                doc.text(
                  quarter.name.split(" ")[0].toUpperCase(),
                  xPos,
                  yPosition + 5.5,
                  { align: "center" }
                );
                xPos += 25;
              });
              doc.text("STATUS", xPos, yPosition + 5.5, { align: "center" });
            } else {
              doc.text("SUBJECT", margin + 5, yPosition + 5.5);
              doc.text("GRADE", margin + 120, yPosition + 5.5, {
                align: "center",
              });
              doc.text("STATUS", margin + 150, yPosition + 5.5, {
                align: "center",
              });
            }

            yPosition += 8;
          }

          // Alternate row colors
          if (index % 2 === 0) {
            doc.setFillColor(255, 255, 255);
          } else {
            doc.setFillColor(250, 250, 250);
          }
          doc.rect(margin, yPosition, pageWidth - margin * 2, 8, "F");

          // Content
          if (viewMode === "whole") {
            let xPos = margin + 5;

            // Subject Name only (no code)
            const subjectName =
              subject.Subject.length > 40
                ? subject.Subject.substring(0, 40) + "..."
                : subject.Subject;
            doc.text(subjectName, xPos, yPosition + 5.5);
            xPos += 70;

            // Quarter grades
            quarters.forEach((quarter) => {
              const grade = subject.Grades[quarter.key];
              if (grade) {
                const gradeColor = grade >= 75 ? [34, 197, 94] : [239, 68, 68];
                doc.setTextColor(...gradeColor);
                doc.text(grade.toFixed(2), xPos, yPosition + 5.5, {
                  align: "center",
                });
                doc.setTextColor(0, 0, 0);
              } else {
                doc.text("-", xPos, yPosition + 5.5, { align: "center" });
              }
              xPos += 25;
            });

            // Status
            const statusColor =
              subject.Status === "Passed" ? [34, 197, 94] : [239, 68, 68];
            doc.setTextColor(...statusColor);
            doc.text(subject.Status || "N/A", xPos, yPosition + 5.5, {
              align: "center",
            });
            doc.setTextColor(0, 0, 0);
          } else {
            // Per quarter view - simplified
            const subjectName =
              subject.Subject.length > 35
                ? subject.Subject.substring(0, 35) + "..."
                : subject.Subject;
            doc.text(subjectName, margin + 5, yPosition + 5.5);

            // Get the first available grade (for per quarter view)
            const firstGrade = Object.values(subject.Grades)[0];
            if (firstGrade) {
              const gradeColor =
                firstGrade >= 75 ? [34, 197, 94] : [239, 68, 68];
              doc.setTextColor(...gradeColor);
              doc.text(firstGrade.toFixed(2), margin + 120, yPosition + 5.5, {
                align: "center",
              });
              doc.setTextColor(0, 0, 0);
            } else {
              doc.text("-", margin + 120, yPosition + 5.5, { align: "center" });
            }

            const statusColor =
              subject.Status === "Passed" ? [34, 197, 94] : [239, 68, 68];
            doc.setTextColor(...statusColor);
            doc.text(subject.Status || "N/A", margin + 150, yPosition + 5.5, {
              align: "center",
            });
            doc.setTextColor(0, 0, 0);
          }

          yPosition += 8;
        });

        yPosition += 5;

        // Quarter Averages for whole view
        if (viewMode === "whole" && yPosition < pageHeight - 20) {
          doc.setFillColor(...lightGray);
          doc.roundedRect(
            margin,
            yPosition,
            pageWidth - margin * 2,
            12,
            3,
            3,
            "F"
          );

          doc.setFontSize(9);
          doc.setTextColor(...darkGray);
          doc.setFont("helvetica", "bold");
          doc.text("QUARTER AVERAGES", margin + 10, yPosition + 7);

          let xPos = pageWidth - margin - 10;
          quarters.reverse().forEach((quarter) => {
            const quarterData = currentGradeRecord?.Quarters?.[quarter.key];
            const average = quarterData?.Average;
            if (average) {
              const avgColor = average >= 75 ? [34, 197, 94] : [239, 68, 68];
              doc.setTextColor(...avgColor);
              doc.text(
                `${quarter.name.split(" ")[0]}: ${average.toFixed(2)}`,
                xPos,
                yPosition + 7,
                { align: "right" }
              );
              doc.setTextColor(...darkGray);
              xPos -= 35;
            }
          });
        }
      }

      // Add headers to all pages
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        addHeader(doc, i, totalPages);
      }

      // Save the PDF
      const fileName = `Student_Grades_${
        student?.formattedName || student?.name
      }_${currentGradeRecord?.SchoolYear || ""}_${
        viewMode === "whole" ? "All_Quarters" : "Per_Quarter"
      }.pdf`;
      doc.save(fileName);

      setDownloadStatus("success");
    } catch (err) {
      console.error("Error generating PDF:", err);
      setDownloadStatus("error");
      setDownloadError(
        err.message || "Failed to generate PDF. Please try again."
      );
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Download as Excel function (without academic summary)
  const downloadAsExcel = () => {
    if (!grades) {
      setDownloadStatus("error");
      setDownloadError("No grade data available to download.");
      return;
    }

    try {
      const currentGradeRecord = getCurrentGradeRecord();
      const quarters = [
        { key: "FirstQuarter", name: "First Quarter" },
        { key: "SecondQuarter", name: "Second Quarter" },
        { key: "ThirdQuarter", name: "Third Quarter" },
        { key: "FourthQuarter", name: "Fourth Quarter" },
      ];

      // Create CSV content with high-quality formatting
      let csvContent = "GYMNAZO CHRISTIAN ACADEMY - NOVALICHES\n";
      csvContent += "STUDENT GRADES REPORT\n";
      csvContent += "=====================\n\n";

      // Student Information
      csvContent += `Student Name: ${
        student?.formattedName || student?.name
      }\n`;
      csvContent += `Student Number: ${
        student?.studentNumber || student?.id
      }\n`;
      csvContent += `School Year: ${currentGradeRecord?.SchoolYear || ""}\n`;
      csvContent += `Grade Level & Section: ${
        currentGradeRecord?.GradeLevel || ""
      } - ${currentGradeRecord?.Section || ""}\n\n`;

      // NOTE: Academic Summary section has been REMOVED from Excel downloads

      // Grades Data
      if (viewMode === "whole") {
        csvContent += "ALL QUARTERS GRADES\n";
        csvContent += "-------------------\n";
        csvContent +=
          "Subject,First Quarter,Second Quarter,Third Quarter,Fourth Quarter,Status,Remarks\n";

        const allSubjects = {};
        quarters.forEach((quarter) => {
          const quarterData = currentGradeRecord?.Quarters?.[quarter.key];
          if (quarterData?.Grades) {
            quarterData.Grades.forEach((subject) => {
              if (!allSubjects[subject.SubjectCode]) {
                allSubjects[subject.SubjectCode] = {
                  Subject: subject.Subject,
                  SubjectCode: subject.SubjectCode,
                  Status: subject.Status,
                  Remarks: subject.Remarks,
                  Grades: {},
                };
              }
              allSubjects[subject.SubjectCode].Grades[quarter.key] =
                parseFloat(subject.GradeValue) || 0;
            });
          }
        });

        Object.values(allSubjects).forEach((subject) => {
          const escapeCsv = (value) => {
            if (
              value.includes(",") ||
              value.includes('"') ||
              value.includes("\n")
            ) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          };

          csvContent += `${escapeCsv(subject.Subject)},`;
          quarters.forEach((quarter) => {
            const grade = subject.Grades[quarter.key];
            csvContent += `${grade ? grade.toFixed(2) : ""},`;
          });
          csvContent += `${escapeCsv(subject.Status || "")},${escapeCsv(
            subject.Remarks || ""
          )}\n`;
        });

        // Quarter Averages
        csvContent += "\nQUARTER AVERAGES\n";
        csvContent += "----------------\n";
        quarters.forEach((quarter) => {
          const quarterData = currentGradeRecord?.Quarters?.[quarter.key];
          const average = quarterData?.Average;
          csvContent += `${quarter.name}: ${
            average ? average.toFixed(2) : "N/A"
          }\n`;
        });
      } else {
        // Per Quarter view
        quarters.forEach((quarter) => {
          const quarterData = currentGradeRecord?.Quarters?.[quarter.key];
          if (quarterData?.Grades && quarterData.Grades.length > 0) {
            csvContent += `${quarter.name.toUpperCase()}\n`;
            csvContent += `${"=".repeat(quarter.name.length)}\n`;
            csvContent += "Subject,Grade,Status,Remarks\n";

            quarterData.Grades.forEach((subject) => {
              const escapeCsv = (value) => {
                if (
                  value.includes(",") ||
                  value.includes('"') ||
                  value.includes("\n")
                ) {
                  return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
              };

              csvContent += `${escapeCsv(subject.Subject)},${
                subject.GradeValue || ""
              },${escapeCsv(subject.Status || "")},${escapeCsv(
                subject.Remarks || ""
              )}\n`;
            });

            if (quarterData.Average) {
              csvContent += `Quarter Average: ${quarterData.Average.toFixed(
                2
              )}\n`;
            }
            csvContent += "\n";
          }
        });
      }

      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `Student_Grades_${student?.formattedName || student?.name}_${
          currentGradeRecord?.SchoolYear || ""
        }_${viewMode === "whole" ? "All_Quarters" : "Per_Quarter"}.csv`
      );
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadStatus("success");
      setShowDownloadOptions(false);
    } catch (err) {
      console.error("Error generating Excel file:", err);
      setDownloadStatus("error");
      setDownloadError("Error generating Excel file. Please try again.");
    }
  };

  const handleDownloadClick = () => {
    setShowDownloadOptions(!showDownloadOptions);
  };

  const handleCloseDownloadStatus = () => {
    setDownloadStatus(null);
    setDownloadError("");
  };

  const handleRetryDownload = () => {
    setDownloadStatus(null);
    setDownloadError("");
    downloadAsPDF();
  };

  // Success Modal
  const renderSuccessModal = () => (
    <BaseModal
      isOpen={downloadStatus === "success"}
      onClose={handleCloseDownloadStatus}
      title="Download Successful"
      width="max-w-md"
      darkMode={darkMode}
    >
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              darkMode ? "bg-green-900/50" : "bg-green-100"
            }`}
          >
            <CheckCircle
              className={`w-8 h-8 ${
                darkMode ? "text-green-400" : "text-green-600"
              }`}
            />
          </div>
        </div>

        <h3
          className={`text-lg font-semibold mb-2 font-kumbh ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Download Complete!
        </h3>
        <p
          className={`mb-6 font-kumbh ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Your file has been downloaded successfully.
        </p>

        <button
          onClick={handleCloseDownloadStatus}
          className="px-6 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium transition-colors font-kumbh"
        >
          Done
        </button>
      </div>
    </BaseModal>
  );

  // Error Modal
  const renderErrorModal = () => (
    <BaseModal
      isOpen={downloadStatus === "error"}
      onClose={handleCloseDownloadStatus}
      title="Download Failed"
      width="max-w-md"
      darkMode={darkMode}
    >
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              darkMode ? "bg-red-900/50" : "bg-red-100"
            }`}
          >
            <AlertTriangle
              className={`w-8 h-8 ${
                darkMode ? "text-red-400" : "text-red-600"
              }`}
            />
          </div>
        </div>

        <h3
          className={`text-lg font-semibold mb-2 font-kumbh ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Download Failed
        </h3>
        <p
          className={`mb-4 font-kumbh ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {downloadError || "Failed to download file. Please try again."}
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={handleRetryDownload}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors font-kumbh"
          >
            Try Again
          </button>
          <button
            onClick={handleCloseDownloadStatus}
            className={`px-4 py-2 rounded-lg font-medium transition-colors font-kumbh ${
              darkMode
                ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                : "bg-gray-300 text-gray-800 hover:bg-gray-400"
            }`}
          >
            Cancel
          </button>
        </div>
      </div>
    </BaseModal>
  );

  if (!isOpen) return null;

  const currentGradeRecord = getCurrentGradeRecord();

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div
          id="grades-modal-content"
          className={`relative w-full max-w-6xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden font-kumbh ${
            darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
          }`}
        >
          {/* Header */}
          <div
            className={`p-6 border-b ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-gradient-to-r from-yellow-500 to-yellow-600 border-yellow-300"
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-white/20">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Student Grades
                  </h2>
                  <p className="text-white/90">
                    {student?.formattedName || student?.name}:{" "}
                    {student?.studentNumber || student?.id}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* View Mode Toggle */}
                <div className="flex bg-white/20 rounded-lg p-1 mr-2">
                  <button
                    onClick={() => setViewMode("whole")}
                    className={`px-3 py-1 rounded-md transition-colors flex items-center gap-2 ${
                      viewMode === "whole"
                        ? "bg-white text-yellow-600"
                        : "text-white/80 hover:text-white"
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                    View as Whole
                  </button>
                  <button
                    onClick={() => setViewMode("perQuarter")}
                    className={`px-3 py-1 rounded-md transition-colors flex items-center gap-2 ${
                      viewMode === "perQuarter"
                        ? "bg-white text-yellow-600"
                        : "text-white/80 hover:text-white"
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                    Per Quarter
                  </button>
                </div>

                {/* Download Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={handleDownloadClick}
                    disabled={isGeneratingPDF || !grades}
                    className={`px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <Download className="w-4 h-4" />
                    Download As
                    <ChevronDown size={16} className="ml-2" />
                  </button>

                  {showDownloadOptions && (
                    <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-20">
                      <button
                        onClick={downloadAsPDF}
                        disabled={isGeneratingPDF}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors first:rounded-t-lg last:rounded-b-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FileText size={16} className="mr-3 text-red-500" />
                        <div className="text-left">
                          <div className="font-medium">PDF Format</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {viewMode === "whole" ? "Landscape" : "Portrait"}
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={downloadAsExcel}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors first:rounded-t-lg last:rounded-b-lg"
                      >
                        <Table size={16} className="mr-3 text-blue-500" />
                        <div className="text-left">
                          <div className="font-medium">Excel Format</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            High-quality CSV
                          </div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={onClose}
                  className="p-2 rounded-full transition-colors hover:bg-white/20 text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader className="w-8 h-8 animate-spin text-blue-500" />
                <span className="ml-3">Loading grades...</span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Failed to Load Grades
                </h3>
                <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  {error}
                </p>
                <button
                  onClick={fetchGrades}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : grades &&
              grades.GradeRecords &&
              grades.GradeRecords.length > 0 ? (
              <div className="space-y-6">
                {/* School Year Selector */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <span className="font-semibold">School Year:</span>
                  </div>
                  <select
                    value={selectedSchoolYear}
                    onChange={(e) => setSelectedSchoolYear(e.target.value)}
                    className={`px-4 py-2 rounded-lg border-2 font-medium ${
                      darkMode
                        ? "bg-gray-700 border-blue-500 text-white"
                        : "bg-white border-blue-500 text-gray-800"
                    }`}
                  >
                    {grades.GradeRecords.map((record, index) => (
                      <option key={index} value={record.SchoolYear}>
                        {record.SchoolYear}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Grades Display - includeSummary is true for display */}
                {currentGradeRecord ? (
                  <SchoolYearGrades
                    gradeRecord={currentGradeRecord}
                    darkMode={darkMode}
                    viewMode={viewMode}
                    includeSummary={true}
                  />
                ) : (
                  <div
                    className={`rounded-lg p-8 text-center ${
                      darkMode ? "bg-gray-800" : "bg-gray-100"
                    }`}
                  >
                    <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
                      No grade data available for the selected school year.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div
                className={`rounded-lg p-8 text-center ${
                  darkMode ? "bg-gray-800" : "bg-gray-100"
                }`}
              >
                <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No Grade Records</h3>
                <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
                  No grade records found for this student.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Download Status Modals */}
      {renderSuccessModal()}
      {renderErrorModal()}
    </>
  );
}
