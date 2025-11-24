import React, { useState, useEffect } from "react";
import {
  X,
  Loader,
  Calendar,
  Check,
  Clock,
  X as XIcon,
  AlertCircle,
  Users,
  BookOpen,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import studentService from "../../../../services/studentService";

const StudentAttendanceModal = ({
  isOpen,
  onClose,
  student,
  darkMode = false,
}) => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [expandedDates, setExpandedDates] = useState(new Set());
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!student || !isOpen) return;

      setIsLoading(true);
      setError(null);
      setSelectedDate(null);
      setExpandedDates(new Set());
      setIsDateDropdownOpen(false);

      try {
        const studentId = student.studentProfileId || student.id;
        const attendanceResponse = await studentService.getStudentAttendance(
          studentId
        );

        setAttendanceData(attendanceResponse.data || attendanceResponse);

        // Auto-select the first date if available
        if (attendanceResponse.data?.AttendanceByDate?.length > 0) {
          setSelectedDate(attendanceResponse.data.AttendanceByDate[0].Date);
        }
      } catch (err) {
        console.error("Error fetching student attendance:", err);
        setError(err.message || "Failed to load attendance data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendance();
  }, [student, isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isDateDropdownOpen &&
        !event.target.closest(".date-dropdown-container")
      ) {
        setIsDateDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDateDropdownOpen]);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "present":
        return <Check className="w-4 h-4 text-green-500" />;
      case "late":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "absent":
        return <XIcon className="w-4 h-4 text-red-500" />;
      case "excused":
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "present":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "late":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "absent":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "excused":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatDateLong = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    try {
      if (!timeString) return "N/A";
      const time = new Date(`2000-01-01T${timeString}`);
      return time.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return timeString;
    }
  };

  const formatDateTime = (dateTimeString) => {
    try {
      if (!dateTimeString) return "N/A";
      const date = new Date(dateTimeString);
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return dateTimeString;
    }
  };

  const getSelectedDateData = () => {
    if (!selectedDate || !attendanceData?.AttendanceByDate) return null;
    return attendanceData.AttendanceByDate.find(
      (dateRecord) => dateRecord.Date === selectedDate
    );
  };

  const getAllDates = () => {
    return attendanceData?.AttendanceByDate || [];
  };

  const getAttendanceStats = () => {
    if (!attendanceData?.AttendanceByDate) {
      return {
        totalClasses: 0,
        presentCount: 0,
        lateCount: 0,
        absentCount: 0,
        excusedCount: 0,
      };
    }

    let totalClasses = 0;
    let presentCount = 0;
    let lateCount = 0;
    let absentCount = 0;
    let excusedCount = 0;

    attendanceData.AttendanceByDate.forEach((dateRecord) => {
      dateRecord.Classes?.forEach((classItem) => {
        totalClasses++;
        switch (classItem.Attendance?.Status?.toLowerCase()) {
          case "present":
            presentCount++;
            break;
          case "late":
            lateCount++;
            break;
          case "absent":
            absentCount++;
            break;
          case "excused":
            excusedCount++;
            break;
        }
      });
    });

    return { totalClasses, presentCount, lateCount, absentCount, excusedCount };
  };

  const calculateAttendanceRate = () => {
    const stats = getAttendanceStats();
    if (stats.totalClasses === 0) return 0;
    return Math.round(
      ((stats.presentCount + stats.lateCount) / stats.totalClasses) * 100
    );
  };

  const toggleDateExpansion = (date) => {
    const newExpanded = new Set(expandedDates);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedDates(newExpanded);
  };

  const isDateExpanded = (date) => {
    return expandedDates.has(date);
  };

  const toggleAllDates = () => {
    const allDates = getAllDates();
    if (expandedDates.size === allDates.length) {
      // Collapse all
      setExpandedDates(new Set());
    } else {
      // Expand all
      const allDateStrings = new Set(
        allDates.map((dateRecord) => dateRecord.Date)
      );
      setExpandedDates(allDateStrings);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setIsDateDropdownOpen(false);
  };

  if (!isOpen) return null;

  const allDates = getAllDates();
  const selectedDateData = getSelectedDateData();
  const uniqueDates = allDates.map((item) => item.Date) || [];
  const selectedDateDisplay = selectedDate
    ? formatDateLong(selectedDate)
    : "Select a date";
  const stats = getAttendanceStats();
  const attendanceRate = calculateAttendanceRate();

  const getStudentName = () => {
    if (student.firstName && student.lastName) {
      const middleInitial = student.middleName
        ? ` ${student.middleName.charAt(0)}.`
        : "";
      return `${student.firstName}${middleInitial} ${student.lastName}`;
    }
    return student.name || "Unknown Student";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 dark:bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div
        className={`rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col font-kumbh ${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 border-b ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div>
            <h2 className="text-2xl font-bold font-kumbh">
              Attendance: {getStudentName()}
            </h2>
            <p
              className={`mt-1 font-kumbh text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Student Number: {student.studentNumber}
            </p>
            <p
              className={`text-xs font-kumbh ${
                darkMode ? "text-gray-500" : "text-gray-500"
              }`}
            >
              Total Classes: {stats.totalClasses} • Period: {uniqueDates.length}{" "}
              day{uniqueDates.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            }`}
          >
            <X
              className={`w-6 h-6 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader className="w-8 h-8 animate-spin text-yellow-500" />
              <span
                className={`ml-2 font-kumbh ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Loading attendance data...
              </span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle
                className={`w-16 h-16 mx-auto mb-4 ${
                  darkMode ? "text-gray-600" : "text-gray-300"
                }`}
              />
              <div
                className={`text-lg font-kumbh mb-2 ${
                  darkMode ? "text-red-400" : "text-red-500"
                }`}
              >
                Error loading attendance
              </div>
              <p
                className={`text-sm font-kumbh ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {error}
              </p>
            </div>
          ) : attendanceData ? (
            <div className="space-y-6">
              {/* Date Selection Dropdown and Summary Section */}
              <div
                className={`rounded-xl p-6 ${
                  darkMode ? "bg-gray-800" : "bg-gray-50"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <h3 className="text-lg font-semibold font-kumbh">
                    Attendance Summary
                  </h3>

                  {/* Date Dropdown */}
                  <div className="date-dropdown-container relative">
                    <button
                      onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
                      className={`flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors min-w-[280px] justify-between ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 hover:bg-gray-600 text-white"
                          : "bg-white border-gray-300 hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Calendar
                          className={`w-4 h-4 ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        />
                        <span className="font-medium text-sm">
                          {selectedDateDisplay}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        } ${isDateDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {isDateDropdownOpen && (
                      <div
                        className={`absolute top-full left-0 mt-1 w-full border rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto ${
                          darkMode
                            ? "bg-gray-800 border-gray-600"
                            : "bg-white border-gray-300"
                        }`}
                      >
                        {uniqueDates.map((date) => (
                          <button
                            key={date}
                            onClick={() => handleDateSelect(date)}
                            className={`w-full text-left p-3 hover:bg-gray-50 transition-colors font-kumbh text-sm ${
                              selectedDate === date
                                ? darkMode
                                  ? "bg-yellow-900/30 text-yellow-300"
                                  : "bg-yellow-50 text-yellow-700"
                                : darkMode
                                ? "text-gray-300 hover:bg-gray-700"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <div className="font-medium">
                              {formatDateLong(date)}
                            </div>
                            <div
                              className={`text-xs mt-1 ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {attendanceData?.AttendanceByDate?.find(
                                (d) => d.Date === date
                              )?.Classes?.length || 0}{" "}
                              classes
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  <div
                    className={`text-center p-4 rounded-lg shadow-sm ${
                      darkMode ? "bg-gray-700" : "bg-white"
                    }`}
                  >
                    <div
                      className={`text-2xl font-bold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {stats.totalClasses}
                    </div>
                    <div
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Total Classes Attended
                    </div>
                  </div>
                  <div
                    className={`text-center p-4 rounded-lg shadow-sm ${
                      darkMode ? "bg-gray-700" : "bg-white"
                    }`}
                  >
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {attendanceRate}%
                    </div>
                    <div
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Attendance Rate
                    </div>
                  </div>
                  <div
                    className={`text-center p-4 rounded-lg shadow-sm ${
                      darkMode ? "bg-gray-700" : "bg-white"
                    }`}
                  >
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {stats.presentCount}
                    </div>
                    <div
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      No. of days Present
                    </div>
                  </div>
                  <div
                    className={`text-center p-4 rounded-lg shadow-sm ${
                      darkMode ? "bg-gray-700" : "bg-white"
                    }`}
                  >
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {stats.lateCount}
                    </div>
                    <div
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      No. of days Late
                    </div>
                  </div>
                  <div
                    className={`text-center p-4 rounded-lg shadow-sm ${
                      darkMode ? "bg-gray-700" : "bg-white"
                    }`}
                  >
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {stats.absentCount}
                    </div>
                    <div
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      No. of days Absent
                    </div>
                  </div>
                  <div
                    className={`text-center p-4 rounded-lg shadow-sm ${
                      darkMode ? "bg-gray-700" : "bg-white"
                    }`}
                  >
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {stats.excusedCount}
                    </div>
                    <div
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      No. of days Excused
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected Date Details */}
              {selectedDate && selectedDateData && (
                <div
                  className={`rounded-xl p-6 ${
                    darkMode ? "bg-gray-800" : "bg-gray-50"
                  }`}
                >
                  <h3 className="text-lg font-semibold font-kumbh mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {formatDateLong(selectedDate)} - Class Attendance
                  </h3>

                  {selectedDateData.Classes?.length > 0 ? (
                    <div className="space-y-3">
                      {selectedDateData.Classes.map((classItem, index) => (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-4 rounded-lg border ${
                            darkMode
                              ? "bg-gray-700 border-gray-600"
                              : "bg-white border-gray-200"
                          }`}
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <BookOpen
                              className={`w-4 h-4 flex-shrink-0 ${
                                darkMode ? "text-gray-400" : "text-gray-400"
                              }`}
                            />
                            <div className="flex-1 min-w-0">
                              <div
                                className={`font-medium text-sm ${
                                  darkMode ? "text-white" : "text-gray-900"
                                }`}
                              >
                                {classItem.ClassInfo.Subject}
                              </div>
                              <div
                                className={`text-xs mt-1 ${
                                  darkMode ? "text-gray-400" : "text-gray-500"
                                }`}
                              >
                                {formatTime(classItem.ClassInfo.TimeStart)} -{" "}
                                {formatTime(classItem.ClassInfo.TimeEnd)} •{" "}
                                {classItem.ClassInfo.Room}
                              </div>
                              {classItem.ClassInfo.Teacher && (
                                <div
                                  className={`text-xs mt-1 ${
                                    darkMode ? "text-gray-400" : "text-gray-500"
                                  }`}
                                >
                                  Teacher:{" "}
                                  {classItem.ClassInfo.Teacher.FirstName}{" "}
                                  {classItem.ClassInfo.Teacher.LastName}
                                </div>
                              )}
                              {classItem.Attendance?.Notes && (
                                <div
                                  className={`text-xs mt-1 ${
                                    darkMode ? "text-gray-400" : "text-gray-600"
                                  }`}
                                >
                                  Note: {classItem.Attendance.Notes}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-4 ml-4">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(classItem.Attendance?.Status)}
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                  classItem.Attendance?.Status
                                )}`}
                              >
                                {classItem.Attendance?.Status}
                              </span>
                            </div>
                            <div
                              className={`text-right text-sm ${
                                darkMode ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              <div>
                                Check-in:{" "}
                                {formatDateTime(classItem.Attendance?.CheckIn)}
                              </div>
                              {classItem.Attendance?.CheckOut && (
                                <div>
                                  Check-out:{" "}
                                  {formatDateTime(
                                    classItem.Attendance?.CheckOut
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div
                      className={`text-center py-4 text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      No classes recorded for this date
                    </div>
                  )}
                </div>
              )}

              {/* All Dates Accordion */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold font-kumbh flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Attendance History
                  </h3>
                  <button
                    onClick={toggleAllDates}
                    className={`text-sm underline font-kumbh ${
                      darkMode
                        ? "text-blue-400 hover:text-blue-300"
                        : "text-blue-600 hover:text-blue-800"
                    }`}
                  >
                    {expandedDates.size === allDates.length
                      ? "Collapse All"
                      : "Expand All"}
                  </button>
                </div>

                {allDates.length > 0 ? (
                  <div className="space-y-2">
                    {allDates.map((dateRecord) => {
                      const isExpanded = isDateExpanded(dateRecord.Date);
                      const dateStats = {
                        total: dateRecord.Classes?.length || 0,
                        present:
                          dateRecord.Classes?.filter(
                            (c) =>
                              c.Attendance?.Status?.toLowerCase() === "present"
                          ).length || 0,
                        late:
                          dateRecord.Classes?.filter(
                            (c) =>
                              c.Attendance?.Status?.toLowerCase() === "late"
                          ).length || 0,
                        absent:
                          dateRecord.Classes?.filter(
                            (c) =>
                              c.Attendance?.Status?.toLowerCase() === "absent"
                          ).length || 0,
                        excused:
                          dateRecord.Classes?.filter(
                            (c) =>
                              c.Attendance?.Status?.toLowerCase() === "excused"
                          ).length || 0,
                      };

                      return (
                        <div
                          key={dateRecord.Date}
                          className={`rounded-lg border overflow-hidden ${
                            darkMode
                              ? "bg-gray-800 border-gray-700"
                              : "bg-white border-gray-200"
                          }`}
                        >
                          {/* Date Header Row */}
                          <div
                            className={`flex items-center p-4 cursor-pointer transition-colors ${
                              darkMode
                                ? "hover:bg-gray-700"
                                : "hover:bg-gray-50"
                            }`}
                            onClick={() => toggleDateExpansion(dateRecord.Date)}
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div
                                className={`transform transition-transform ${
                                  isExpanded ? "rotate-0" : "-rotate-90"
                                }`}
                              >
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div
                                  className={`font-medium ${
                                    darkMode ? "text-white" : "text-gray-900"
                                  }`}
                                >
                                  {formatDateLong(dateRecord.Date)}
                                </div>
                                <div
                                  className={`text-sm ${
                                    darkMode ? "text-gray-400" : "text-gray-500"
                                  }`}
                                >
                                  {dateStats.total} classes
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 ml-4">
                              {/* Date Summary Stats */}
                              <div className="text-right">
                                <div className="flex gap-1">
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${
                                      darkMode
                                        ? "bg-green-900 text-green-200"
                                        : "bg-green-100 text-green-800"
                                    }`}
                                  >
                                    P: {dateStats.present}
                                  </span>
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${
                                      darkMode
                                        ? "bg-yellow-900 text-yellow-200"
                                        : "bg-yellow-100 text-yellow-800"
                                    }`}
                                  >
                                    L: {dateStats.late}
                                  </span>
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${
                                      darkMode
                                        ? "bg-red-900 text-red-200"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    A: {dateStats.absent}
                                  </span>
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${
                                      darkMode
                                        ? "bg-blue-900 text-blue-200"
                                        : "bg-blue-100 text-blue-800"
                                    }`}
                                  >
                                    E: {dateStats.excused}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Expandable Content */}
                          {isExpanded && (
                            <div
                              className={`border-t p-4 ${
                                darkMode
                                  ? "border-gray-700 bg-gray-700"
                                  : "border-gray-200 bg-gray-50"
                              }`}
                            >
                              <div className="space-y-3">
                                {dateRecord.Classes?.map((classItem, index) => (
                                  <div
                                    key={index}
                                    className={`flex items-center justify-between p-3 rounded-lg border ${
                                      darkMode
                                        ? "bg-gray-800 border-gray-600"
                                        : "bg-white border-gray-200"
                                    }`}
                                  >
                                    <div className="flex items-center gap-4 flex-1">
                                      <BookOpen
                                        className={`w-4 h-4 flex-shrink-0 ${
                                          darkMode
                                            ? "text-gray-400"
                                            : "text-gray-400"
                                        }`}
                                      />
                                      <div className="flex-1 min-w-0">
                                        <div
                                          className={`font-medium text-sm ${
                                            darkMode
                                              ? "text-white"
                                              : "text-gray-900"
                                          }`}
                                        >
                                          {classItem.ClassInfo.Subject}
                                        </div>
                                        <div
                                          className={`text-xs mt-1 ${
                                            darkMode
                                              ? "text-gray-400"
                                              : "text-gray-500"
                                          }`}
                                        >
                                          {formatTime(
                                            classItem.ClassInfo.TimeStart
                                          )}{" "}
                                          -{" "}
                                          {formatTime(
                                            classItem.ClassInfo.TimeEnd
                                          )}{" "}
                                          • {classItem.ClassInfo.Room}
                                        </div>
                                        {classItem.ClassInfo.Teacher && (
                                          <div
                                            className={`text-xs mt-1 ${
                                              darkMode
                                                ? "text-gray-400"
                                                : "text-gray-500"
                                            }`}
                                          >
                                            Teacher:{" "}
                                            {
                                              classItem.ClassInfo.Teacher
                                                .FirstName
                                            }{" "}
                                            {
                                              classItem.ClassInfo.Teacher
                                                .LastName
                                            }
                                          </div>
                                        )}
                                        {classItem.Attendance?.Notes && (
                                          <div
                                            className={`text-xs mt-1 ${
                                              darkMode
                                                ? "text-gray-400"
                                                : "text-gray-600"
                                            }`}
                                          >
                                            Note: {classItem.Attendance.Notes}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-4 ml-4">
                                      <div className="flex items-center gap-2">
                                        {getStatusIcon(
                                          classItem.Attendance?.Status
                                        )}
                                        <span
                                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                            classItem.Attendance?.Status
                                          )}`}
                                        >
                                          {classItem.Attendance?.Status}
                                        </span>
                                      </div>
                                      <div
                                        className={`text-right text-sm ${
                                          darkMode
                                            ? "text-gray-400"
                                            : "text-gray-600"
                                        }`}
                                      >
                                        <div>
                                          Check-in:{" "}
                                          {formatDateTime(
                                            classItem.Attendance?.CheckIn
                                          )}
                                        </div>
                                        {classItem.Attendance?.CheckOut && (
                                          <div>
                                            Check-out:{" "}
                                            {formatDateTime(
                                              classItem.Attendance?.CheckOut
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div
                    className={`text-center py-12 rounded-lg border ${
                      darkMode
                        ? "bg-gray-800 border-gray-600"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <Users
                      className={`w-16 h-16 mx-auto mb-4 ${
                        darkMode ? "text-gray-600" : "text-gray-300"
                      }`}
                    />
                    <div
                      className={`text-lg font-kumbh ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      No attendance records found
                    </div>
                    <p
                      className={`text-sm mt-2 font-kumbh ${
                        darkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      There are no attendance records available for this student
                      yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertCircle
                className={`w-16 h-16 mx-auto mb-4 ${
                  darkMode ? "text-gray-600" : "text-gray-300"
                }`}
              />
              <div
                className={`text-lg font-kumbh ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                No attendance data available
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`sticky bottom-0 border-t px-6 py-4 flex justify-end gap-3 rounded-b-xl ${
            darkMode
              ? "bg-gray-900 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendanceModal;
