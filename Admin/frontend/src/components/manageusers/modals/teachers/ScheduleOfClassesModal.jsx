import { useState, useEffect } from "react";
import { X, Calendar } from "lucide-react";

const ScheduleOfClassesModal = ({
  isOpen,
  onClose,
  teacher,
  teacherDetails,
  darkMode = false,
}) => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock schedule data - Using teacher's subject
  const generateMockSchedule = (teacherSubject) => {
    const subject = teacherSubject || "General Subject";

    return {
      timeSlots: [
        "6:30 AM – 7:30 AM",
        "7:30 AM – 8:30 AM",
        "8:30 AM – 9:30 AM",
        "10:00 AM – 11:00 AM",
        "11:00 AM – 12:00 PM",
        "12:00 PM – 1:00 PM",
        "2:00 PM – 3:00 PM",
        "3:00 PM – 4:00 PM",
        "4:00 PM – 5:00 PM",
      ],
      // Same classes for all days with sections
      monday: [
        { subject: subject, section: "Grade 1 - Section A", timeSlot: 0 },
        { subject: subject, section: "Grade 1 - Section B", timeSlot: 1 },
        { subject: subject, section: "Grade 3 - Section C", timeSlot: 2 },
        { subject: subject, section: "Grade 2 - Section A", timeSlot: 3 },
        { subject: subject, section: "Grade 2 - Section B", timeSlot: 4 },
        { subject: "Lunch Break", section: "", timeSlot: 5 },
        { subject: subject, section: "Grade 6 - Section A", timeSlot: 6 },
        { subject: subject, section: "Grade 1 - Section C", timeSlot: 7 },
        { subject: subject, section: "Grade 2 - Section C", timeSlot: 8 },
      ],
      tuesday: [
        { subject: subject, section: "Grade 1 - Section A", timeSlot: 0 },
        { subject: subject, section: "Grade 1 - Section B", timeSlot: 1 },
        { subject: subject, section: "Grade 3 - Section C", timeSlot: 2 },
        { subject: subject, section: "Grade 2 - Section A", timeSlot: 3 },
        { subject: subject, section: "Grade 2 - Section B", timeSlot: 4 },
        { subject: "Lunch Break", section: "", timeSlot: 5 },
        { subject: subject, section: "Grade 6 - Section A", timeSlot: 6 },
        { subject: subject, section: "Grade 1 - Section C", timeSlot: 7 },
        { subject: subject, section: "Grade 2 - Section C", timeSlot: 8 },
      ],
      wednesday: [
        { subject: subject, section: "Grade 1 - Section A", timeSlot: 0 },
        { subject: subject, section: "Grade 1 - Section B", timeSlot: 1 },
        { subject: subject, section: "Grade 3 - Section C", timeSlot: 2 },
        { subject: subject, section: "Grade 2 - Section A", timeSlot: 3 },
        { subject: subject, section: "Grade 2 - Section B", timeSlot: 4 },
        { subject: "Lunch Break", section: "", timeSlot: 5 },
        { subject: subject, section: "Grade 6 - Section A", timeSlot: 6 },
        { subject: subject, section: "Grade 1 - Section C", timeSlot: 7 },
        { subject: subject, section: "Grade 2 - Section C", timeSlot: 8 },
      ],
      thursday: [
        { subject: subject, section: "Grade 1 - Section A", timeSlot: 0 },
        { subject: subject, section: "Grade 1 - Section B", timeSlot: 1 },
        { subject: subject, section: "Grade 3 - Section C", timeSlot: 2 },
        { subject: subject, section: "Grade 2 - Section A", timeSlot: 3 },
        { subject: subject, section: "Grade 2 - Section B", timeSlot: 4 },
        { subject: "Lunch Break", section: "", timeSlot: 5 },
        { subject: subject, section: "Grade 6 - Section A", timeSlot: 6 },
        { subject: subject, section: "Grade 1 - Section C", timeSlot: 7 },
        { subject: subject, section: "Grade 2 - Section C", timeSlot: 8 },
      ],
      friday: [
        { subject: subject, section: "Grade 1 - Section A", timeSlot: 0 },
        { subject: subject, section: "Grade 1 - Section B", timeSlot: 1 },
        { subject: subject, section: "Grade 3 - Section C", timeSlot: 2 },
        { subject: subject, section: "Grade 2 - Section A", timeSlot: 3 },
        { subject: subject, section: "Grade 2 - Section B", timeSlot: 4 },
        { subject: "Lunch Break", section: "", timeSlot: 5 },
        { subject: subject, section: "Grade 6 - Section A", timeSlot: 6 },
        { subject: subject, section: "Grade 1 - Section C", timeSlot: 7 },
        { subject: subject, section: "Grade 2 - Section C", timeSlot: 8 },
      ],
    };
  };

  useEffect(() => {
    if (isOpen && teacher) {
      fetchSchedule();
    }
  }, [isOpen, teacher]);

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      // Try to fetch from API first
      const response = await fetch(`/api/teachers/${teacher.id}/schedule`);

      if (response.ok) {
        const data = await response.json();
        setSchedule(data);
      } else {
        // Fallback to mock data
        throw new Error("API not available");
      }
    } catch (error) {
      console.error("Error fetching schedule:", error);
      // Use mock data with teacher's subject
      const mockSchedule = generateMockSchedule(
        teacherDetails?.subject || teacher?.subject
      );
      setSchedule(mockSchedule);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get class for a specific day and time slot
  const getClassForTimeSlot = (day, timeSlotIndex) => {
    const scheduleData =
      Object.keys(schedule).length > 0
        ? schedule
        : generateMockSchedule(teacherDetails?.subject || teacher?.subject);
    const daySchedule = scheduleData[day.toLowerCase()];
    if (!daySchedule) return null;

    return daySchedule.find(
      (classItem) => classItem.timeSlot === timeSlotIndex
    );
  };

  if (!isOpen) return null;

  const days = [
    { key: "monday", label: "MONDAY" },
    { key: "tuesday", label: "TUESDAY" },
    { key: "wednesday", label: "WEDNESDAY" },
    { key: "thursday", label: "THURSDAY" },
    { key: "friday", label: "FRIDAY" },
  ];

  // Calculate statistics
  const scheduleData =
    Object.keys(schedule).length > 0
      ? schedule
      : generateMockSchedule(teacherDetails?.subject || teacher?.subject);
  const dailyClasses = scheduleData.monday.filter(
    (cls) => cls.subject !== "Lunch Break"
  ).length;
  const weeklyClasses = dailyClasses * 5;
  const teachingDays = 5;
  const dailyHours = "8.5 hours";

  // Get teacher's subject for display
  const teacherSubject =
    teacherDetails?.subject || teacher?.subject || "General Subject";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div
        className={`relative rounded-xl shadow-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto font-kumbh ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
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
            <h2
              className={`text-xl font-semibold ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Schedule of Classes
            </h2>
            <p
              className={`text-sm mt-1 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {teacherDetails?.firstName} {teacherDetails?.lastName} •{" "}
              {teacherSubject}
            </p>
          </div>

          <button
            onClick={onClose}
            className={`transition-colors p-1 rounded-full hover:bg-gray-100 ${
              darkMode
                ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div
                className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
                  darkMode ? "border-blue-400" : "border-blue-600"
                }`}
              ></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Schedule Table */}
              <table
                className={`w-full border-collapse border ${
                  darkMode ? "border-gray-700" : "border-gray-300"
                }`}
              >
                <thead>
                  <tr className={darkMode ? "bg-gray-700" : "bg-gray-100"}>
                    <th
                      className={`border p-3 text-left font-semibold w-40 ${
                        darkMode
                          ? "border-gray-600 text-gray-300"
                          : "border-gray-300 text-gray-800"
                      }`}
                    >
                      TIME
                    </th>
                    {days.map((day) => (
                      <th
                        key={day.key}
                        className={`border p-3 text-center font-semibold ${
                          darkMode
                            ? "border-gray-600 text-gray-300"
                            : "border-gray-300 text-gray-800"
                        }`}
                      >
                        {day.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {scheduleData.timeSlots.map((timeSlot, timeIndex) => (
                    <tr
                      key={timeIndex}
                      className={
                        darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                      }
                    >
                      {/* Time Slot Column */}
                      <td
                        className={`border p-3 text-sm font-medium ${
                          darkMode
                            ? "border-gray-700 text-gray-300"
                            : "border-gray-300 text-gray-700"
                        }`}
                      >
                        {timeSlot}
                      </td>

                      {/* Day Columns */}
                      {days.map((day) => {
                        const classItem = getClassForTimeSlot(
                          day.key,
                          timeIndex
                        );
                        const isEmpty = !classItem;
                        const isLunchBreak =
                          classItem?.subject === "Lunch Break";

                        return (
                          <td
                            key={`${day.key}-${timeIndex}`}
                            className={`border p-3 ${
                              isLunchBreak
                                ? darkMode
                                  ? "bg-orange-900 border-orange-800"
                                  : "bg-orange-50 border-orange-200"
                                : isEmpty
                                ? darkMode
                                  ? "bg-gray-700 border-gray-600"
                                  : "bg-gray-50 border-gray-300"
                                : darkMode
                                ? "bg-blue-900 border-blue-800"
                                : "bg-blue-50 border-blue-200"
                            }`}
                          >
                            {classItem ? (
                              <div className="text-center">
                                <div
                                  className={`font-semibold text-sm mb-1 ${
                                    isLunchBreak
                                      ? darkMode
                                        ? "text-orange-300"
                                        : "text-orange-800"
                                      : darkMode
                                      ? "text-blue-300"
                                      : "text-blue-800"
                                  }`}
                                >
                                  {classItem.subject}
                                </div>
                                {classItem.section && (
                                  <div
                                    className={`text-xs ${
                                      darkMode
                                        ? "text-gray-400"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {classItem.section}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div
                                className={`text-center text-sm ${
                                  darkMode ? "text-gray-500" : "text-gray-400"
                                }`}
                              >
                                -
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Legend */}
              <div className="mt-6 flex flex-wrap gap-4 items-center justify-center text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded ${
                      darkMode
                        ? "bg-blue-800 border border-blue-700"
                        : "bg-blue-100 border border-blue-300"
                    }`}
                  ></div>
                  <span
                    className={darkMode ? "text-gray-300" : "text-gray-700"}
                  >
                    Class Session
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded ${
                      darkMode
                        ? "bg-orange-800 border border-orange-700"
                        : "bg-orange-100 border border-orange-300"
                    }`}
                  ></div>
                  <span
                    className={darkMode ? "text-gray-300" : "text-gray-700"}
                  >
                    Lunch Break
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded ${
                      darkMode
                        ? "bg-gray-700 border border-gray-600"
                        : "bg-gray-100 border border-gray-300"
                    }`}
                  ></div>
                  <span
                    className={darkMode ? "text-gray-300" : "text-gray-700"}
                  >
                    No Class
                  </span>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div
                  className={`p-4 rounded-lg text-center border ${
                    darkMode
                      ? "bg-blue-900 border-blue-800"
                      : "bg-blue-50 border-blue-200"
                  }`}
                >
                  <div
                    className={`text-2xl font-bold ${
                      darkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                  >
                    {dailyClasses}
                  </div>
                  <div
                    className={`mt-1 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Daily Classes
                  </div>
                </div>
                <div
                  className={`p-4 rounded-lg text-center border ${
                    darkMode
                      ? "bg-green-900 border-green-800"
                      : "bg-green-50 border-green-200"
                  }`}
                >
                  <div
                    className={`text-2xl font-bold ${
                      darkMode ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    {weeklyClasses}
                  </div>
                  <div
                    className={`mt-1 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Weekly Classes
                  </div>
                </div>
                <div
                  className={`p-4 rounded-lg text-center border ${
                    darkMode
                      ? "bg-purple-900 border-purple-800"
                      : "bg-purple-50 border-purple-200"
                  }`}
                >
                  <div
                    className={`text-2xl font-bold ${
                      darkMode ? "text-purple-400" : "text-purple-600"
                    }`}
                  >
                    {teachingDays}
                  </div>
                  <div
                    className={`mt-1 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Teaching Days
                  </div>
                </div>
                <div
                  className={`p-4 rounded-lg text-center border ${
                    darkMode
                      ? "bg-yellow-900 border-yellow-800"
                      : "bg-yellow-50 border-yellow-200"
                  }`}
                >
                  <div
                    className={`text-lg font-bold ${
                      darkMode ? "text-yellow-400" : "text-yellow-600"
                    }`}
                  >
                    {dailyHours}
                  </div>
                  <div
                    className={`mt-1 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Daily Hours
                  </div>
                </div>
              </div>

              {/* Schedule Notice */}
              <div
                className={`mt-4 p-4 border rounded-lg ${
                  darkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <p
                  className={`text-sm text-center ${
                    darkMode ? "text-gray-300" : "text-gray-800"
                  }`}
                >
                  <strong>Note:</strong> This teacher teaches {teacherSubject}{" "}
                  and follows the same schedule Monday through Friday.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`sticky bottom-0 border-t px-6 py-4 flex justify-end gap-2 rounded-b-xl ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-md transition-colors ${
              darkMode
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleOfClassesModal;
