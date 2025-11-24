import { useState } from "react";
import { X } from "lucide-react";

// Mock schedule data for different grade levels
const generateScheduleData = (grade) => {
  const isLowerGrade = grade >= 1 && grade <= 3;

  const baseSchedule = [
    {
      time: "7:00 AM - 7:30 AM",
      subject: "English",
      teacher: "Dean W. Winchester",
    },
    {
      time: "7:30 AM - 8:30 AM",
      subject: "Reading",
      teacher: "Samuel J. Winchester",
    },
    {
      time: "8:30 AM - 9:30 AM",
      subject: "Filipino",
      teacher: "John E. Winchester",
    },
    {
      time: "9:30 AM - 10:30 AM",
      subject: "Science",
      teacher: "Mary C. Winchester",
    },
    { time: "10:30 AM - 11:00 AM", subject: "Lunch", teacher: "" }, // No teacher for lunch
    {
      time: "11:00 AM - 12:00 PM",
      subject: "Mathematics",
      teacher: "Ellen S. Harvelle",
    },
    {
      time: "12:00 PM - 1:00 PM",
      subject: "Araling Panlipunan",
      teacher: "Bobby L. Singer",
    },
    {
      time: "1:00 PM - 2:00 PM",
      subject: "Edukasyon sa Pagpapakatao",
      teacher: "Castiel J. Novak",
    },
  ];

  // Add MAPEH and Hele only for grades 4-6
  if (!isLowerGrade) {
    baseSchedule.push(
      {
        time: "2:00 PM - 3:00 PM",
        subject: "MAPEH",
        teacher: "Crowley F. Fergus",
      },
      { time: "3:00 PM - 4:00 PM", subject: "Hele", teacher: "Jody L. Mills" }
    );
  }

  return baseSchedule;
};

const days = [
  { id: "monday", label: "MONDAY" },
  { id: "tuesday", label: "TUESDAY" },
  { id: "wednesday", label: "WEDNESDAY" },
  { id: "thursday", label: "THURSDAY" },
  { id: "friday", label: "FRIDAY" },
];

export default function StudentScheduleModal({
  isOpen,
  onClose,
  student,
  darkMode = false,
}) {
  const [selectedDay, setSelectedDay] = useState("monday");

  if (!isOpen) return null;

  // Generate schedule based on student's grade
  const studentGrade = parseInt(student?.grade) || 4;
  const currentSchedule = generateScheduleData(studentGrade);
  const isLowerGrade = studentGrade >= 1 && studentGrade <= 3;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal container */}
      <div
        className={`relative rounded-xl shadow-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto font-kumbh ${
          darkMode ? "bg-gray-800 text-white" : "bg-white"
        }`}
      >
        {/* Header */}
        <div
          className={`sticky top-0 border-b px-6 py-4 flex justify-between items-center rounded-t-xl z-10 ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div>
            <h2 className="text-xl font-bold">
              Class Schedule - {student?.name}
            </h2>
            <p
              className={`text-sm mt-1 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Grade {student?.grade} • Section {student?.section}
              {isLowerGrade && (
                <span className="ml-2 text-yellow-600">
                  (Lower Grade Schedule)
                </span>
              )}
            </p>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              darkMode
                ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Days Tabs */}
        <div
          className={`border-b ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex px-6">
            {days.map((day) => (
              <button
                key={day.id}
                onClick={() => setSelectedDay(day.id)}
                className={`px-6 py-3 font-semibold text-sm uppercase tracking-wider transition-colors border-b-2 ${
                  selectedDay === day.id
                    ? "border-yellow-500 text-yellow-600 bg-yellow-50"
                    : `border-transparent ${
                        darkMode
                          ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      }`
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>

        {/* Schedule Content */}
        <div className="p-6">
          <div
            className={`rounded-lg border overflow-hidden ${
              darkMode
                ? "bg-gray-700 border-gray-600"
                : "bg-white border-gray-200"
            }`}
          >
            <table className="w-full">
              <thead>
                <tr
                  className={`border-b ${
                    darkMode
                      ? "bg-gray-700 border-gray-600"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <th
                    className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Time
                  </th>
                  <th
                    className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Subject
                  </th>
                  <th
                    className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Teacher
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  darkMode ? "divide-gray-600" : "divide-gray-200"
                }`}
              >
                {currentSchedule.map((period, index) => (
                  <tr
                    key={index}
                    className={`transition-colors ${
                      period.subject === "Lunch"
                        ? darkMode
                          ? "bg-orange-900 hover:bg-orange-800"
                          : "bg-orange-50 hover:bg-orange-100"
                        : darkMode
                        ? "hover:bg-gray-600"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        darkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {period.time}
                    </td>
                    <td
                      className={`px-6 py-4 text-sm ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      <div className="font-semibold">{period.subject}</div>
                    </td>
                    <td
                      className={`px-6 py-4 text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      <div className="flex flex-col">
                        {period.teacher ? (
                          <span>Teacher: {period.teacher}</span>
                        ) : (
                          <span
                            className={
                              darkMode ? "text-gray-500" : "text-gray-400"
                            }
                          >
                            No teacher assigned
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Schedule Summary */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              className={`p-4 rounded-lg border ${
                darkMode
                  ? "bg-blue-900 border-blue-800"
                  : "bg-blue-50 border-blue-200"
              }`}
            >
              <h4
                className={`font-semibold text-sm ${
                  darkMode ? "text-blue-200" : "text-blue-800"
                }`}
              >
                Total Subjects
              </h4>
              <p
                className={`text-2xl font-bold mt-1 ${
                  darkMode ? "text-blue-300" : "text-blue-600"
                }`}
              >
                {
                  currentSchedule.filter((period) => period.subject !== "Lunch")
                    .length
                }
              </p>
            </div>
            <div
              className={`p-4 rounded-lg border ${
                darkMode
                  ? "bg-green-900 border-green-800"
                  : "bg-green-50 border-green-200"
              }`}
            >
              <h4
                className={`font-semibold text-sm ${
                  darkMode ? "text-green-200" : "text-green-800"
                }`}
              >
                School Hours
              </h4>
              <p
                className={`text-2xl font-bold mt-1 ${
                  darkMode ? "text-green-300" : "text-green-600"
                }`}
              >
                {isLowerGrade ? "7 hrs" : "8 hrs"}
              </p>
            </div>
            <div
              className={`p-4 rounded-lg border ${
                darkMode
                  ? "bg-purple-900 border-purple-800"
                  : "bg-purple-50 border-purple-200"
              }`}
            >
              <h4
                className={`font-semibold text-sm ${
                  darkMode ? "text-purple-200" : "text-purple-800"
                }`}
              >
                Class Days
              </h4>
              <p
                className={`text-2xl font-bold mt-1 ${
                  darkMode ? "text-purple-300" : "text-purple-600"
                }`}
              >
                5
              </p>
            </div>
            <div
              className={`p-4 rounded-lg border ${
                darkMode
                  ? "bg-yellow-900 border-yellow-800"
                  : "bg-yellow-50 border-yellow-200"
              }`}
            >
              <h4
                className={`font-semibold text-sm ${
                  darkMode ? "text-yellow-200" : "text-yellow-800"
                }`}
              >
                Grade Level
              </h4>
              <p
                className={`text-2xl font-bold mt-1 ${
                  darkMode ? "text-yellow-300" : "text-yellow-600"
                }`}
              >
                {studentGrade}
              </p>
            </div>
          </div>

          {/* Grade Level Notice */}
          {isLowerGrade && (
            <div
              className={`mt-4 p-4 rounded-lg border ${
                darkMode
                  ? "bg-yellow-900 border-yellow-800"
                  : "bg-yellow-50 border-yellow-200"
              }`}
            >
              <p
                className={`text-sm ${
                  darkMode ? "text-yellow-200" : "text-yellow-800"
                }`}
              >
                <strong>Note for Grades 1-3:</strong> MAPEH and Hele subjects
                are not included in the curriculum for lower grades.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`sticky bottom-0 border-t px-6 py-4 flex justify-end rounded-b-xl ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              darkMode
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Close Schedule
          </button>
        </div>
      </div>
    </div>
  );
}
