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
import manageGradeLevelsService from "../../../services/manageGradeLevelsService";

const SectionAttendanceModal = ({ isOpen, onClose, section, gradeLevel }) => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [expandedStudents, setExpandedStudents] = useState(new Set());
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!section || !isOpen) return;

      setIsLoading(true);
      setError(null);
      setSelectedDate(null);
      setExpandedStudents(new Set());
      setIsDateDropdownOpen(false);

      try {
        let attendanceResponse;

        // Try to get attendance by section ID first
        if (section.id) {
          attendanceResponse =
            await manageGradeLevelsService.getSectionAttendance(section.id);
        }
        // If that fails, try using the Attendance URL from section data
        else if (section.rawData?.Attendance) {
          attendanceResponse =
            await manageGradeLevelsService.getAttendanceByURL(
              section.rawData.Attendance
            );
        } else {
          throw new Error("No section ID or attendance URL available");
        }

        setAttendanceData(attendanceResponse.data || attendanceResponse);

        // Auto-select the first date if available
        if (attendanceResponse.data?.AttendanceByDate?.length > 0) {
          setSelectedDate(attendanceResponse.data.AttendanceByDate[0].Date);
        }
      } catch (err) {
        console.error("Error fetching attendance:", err);
        setError(err.message || "Failed to load attendance data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendance();
  }, [section, isOpen]);

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

  const getAllStudents = () => {
    const allStudents = new Map();

    if (!attendanceData?.AttendanceByDate)
      return Array.from(allStudents.values());

    attendanceData.AttendanceByDate.forEach((dateRecord) => {
      dateRecord.Classes?.forEach((classItem) => {
        classItem.StudentAttendances?.forEach((student) => {
          if (!allStudents.has(student.StudentNumber)) {
            allStudents.set(student.StudentNumber, {
              ...student,
              totalClasses: 0,
              presentCount: 0,
              lateCount: 0,
              absentCount: 0,
              excusedCount: 0,
              attendanceByDate: new Map(),
            });
          }

          const studentRecord = allStudents.get(student.StudentNumber);
          studentRecord.totalClasses++;

          // Count statuses
          switch (student.Status?.toLowerCase()) {
            case "present":
              studentRecord.presentCount++;
              break;
            case "late":
              studentRecord.lateCount++;
              break;
            case "absent":
              studentRecord.absentCount++;
              break;
            case "excused":
              studentRecord.excusedCount++;
              break;
          }

          // Store attendance by date
          if (!studentRecord.attendanceByDate.has(dateRecord.Date)) {
            studentRecord.attendanceByDate.set(dateRecord.Date, []);
          }
          studentRecord.attendanceByDate.get(dateRecord.Date).push({
            ...student,
            classInfo: classItem.ClassInfo,
            date: dateRecord.Date,
          });
        });
      });
    });

    return Array.from(allStudents.values()).sort((a, b) =>
      a.LastName.localeCompare(b.LastName)
    );
  };

  const calculateAttendanceRate = (student) => {
    if (student.totalClasses === 0) return 0;
    return Math.round(
      ((student.presentCount + student.lateCount) / student.totalClasses) * 100
    );
  };

  const getStudentAttendanceForDate = (student, date) => {
    const dateAttendances = student.attendanceByDate.get(date);
    if (!dateAttendances) return [];
    return dateAttendances;
  };

  const toggleStudentExpansion = (studentNumber) => {
    const newExpanded = new Set(expandedStudents);
    if (newExpanded.has(studentNumber)) {
      newExpanded.delete(studentNumber);
    } else {
      newExpanded.add(studentNumber);
    }
    setExpandedStudents(newExpanded);
  };

  const isStudentExpanded = (studentNumber) => {
    return expandedStudents.has(studentNumber);
  };

  const toggleAllStudents = () => {
    const allStudents = getAllStudents();
    if (expandedStudents.size === allStudents.length) {
      // Collapse all
      setExpandedStudents(new Set());
    } else {
      // Expand all
      const allStudentNumbers = new Set(
        allStudents.map((student) => student.StudentNumber)
      );
      setExpandedStudents(allStudentNumbers);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setIsDateDropdownOpen(false);
  };

  if (!isOpen) return null;

  const allStudents = getAllStudents();
  const selectedDateData = getSelectedDateData();
  const uniqueDates =
    attendanceData?.AttendanceByDate?.map((item) => item.Date) || [];
  const selectedDateDisplay = selectedDate
    ? formatDateLong(selectedDate)
    : "Select a date";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 dark:bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col font-kumbh">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-kumbh">
              Attendance: {gradeLevel} – {section?.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1 font-kumbh text-sm">
              Adviser: {attendanceData?.Section?.Adviser?.FirstName}{" "}
              {attendanceData?.Section?.Adviser?.LastName}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-kumbh">
              Total Students: {allStudents.length} • Period:{" "}
              {uniqueDates.length} day{uniqueDates.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader className="w-8 h-8 animate-spin text-yellow-500" />
              <span className="ml-2 text-gray-600 dark:text-gray-400 font-kumbh">
                Loading attendance data...
              </span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <div className="text-red-500 dark:text-red-400 text-lg font-kumbh mb-2">
                Error loading attendance
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-kumbh">
                {error}
              </p>
            </div>
          ) : attendanceData ? (
            <div className="space-y-6">
              {/* Date Selection Dropdown and Summary Section */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-kumbh">
                    Overall Attendance Summary
                  </h3>

                  {/* Date Dropdown */}
                  <div className="date-dropdown-container relative">
                    <button
                      onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
                      className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-w-[280px] justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">
                          {selectedDateDisplay}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${
                          isDateDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isDateDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                        {uniqueDates.map((date) => (
                          <button
                            key={date}
                            onClick={() => handleDateSelect(date)}
                            className={`w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-kumbh text-sm ${
                              selectedDate === date
                                ? "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                                : "text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            <div className="font-medium">
                              {formatDateLong(date)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {allStudents.length}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Total Students
                    </div>
                  </div>
                  <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {allStudents.reduce(
                        (sum, student) => sum + student.presentCount,
                        0
                      )}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Present
                    </div>
                  </div>
                  <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {allStudents.reduce(
                        (sum, student) => sum + student.lateCount,
                        0
                      )}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Late
                    </div>
                  </div>
                  <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {allStudents.reduce(
                        (sum, student) => sum + student.absentCount,
                        0
                      )}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Absent
                    </div>
                  </div>
                  <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {allStudents.reduce(
                        (sum, student) => sum + student.excusedCount,
                        0
                      )}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Excused
                    </div>
                  </div>
                </div>
              </div>

              {/* Students Attendance Accordion */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-kumbh flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Student Attendance Records
                    {selectedDate && (
                      <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-2">
                        ({formatDate(selectedDate)})
                      </span>
                    )}
                  </h3>
                  <button
                    onClick={toggleAllStudents}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-kumbh underline"
                  >
                    {expandedStudents.size === allStudents.length
                      ? "Collapse All"
                      : "Expand All"}
                  </button>
                </div>

                {allStudents.length > 0 ? (
                  <div className="space-y-2">
                    {allStudents.map((student) => {
                      const isExpanded = isStudentExpanded(
                        student.StudentNumber
                      );
                      const todaysAttendance = selectedDate
                        ? getStudentAttendanceForDate(student, selectedDate)
                        : [];

                      return (
                        <div
                          key={student.StudentNumber}
                          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                        >
                          {/* Student Header Row */}
                          <div
                            className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                            onClick={() =>
                              toggleStudentExpansion(student.StudentNumber)
                            }
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
                                <div className="font-medium text-gray-900 dark:text-white truncate">
                                  {student.FirstName} {student.LastName}
                                  {student.MiddleName &&
                                    ` ${student.MiddleName.charAt(0)}.`}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {student.StudentNumber}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 ml-4">
                              {/* Overall Attendance Stats */}
                              <div className="text-right">
                                <div
                                  className={`text-sm font-medium ${
                                    calculateAttendanceRate(student) >= 90
                                      ? "text-green-600 dark:text-green-400"
                                      : calculateAttendanceRate(student) >= 75
                                      ? "text-yellow-600 dark:text-yellow-400"
                                      : "text-red-600 dark:text-red-400"
                                  }`}
                                >
                                  {calculateAttendanceRate(student)}% Attendance
                                </div>
                                <div className="flex gap-1 mt-1">
                                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                    P: {student.presentCount}
                                  </span>
                                  <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                    L: {student.lateCount}
                                  </span>
                                  <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                    A: {student.absentCount}
                                  </span>
                                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                    E: {student.excusedCount}
                                  </span>
                                </div>
                              </div>

                              {/* Today's Summary (if date selected) */}
                              {selectedDate && todaysAttendance.length > 0 && (
                                <div className="text-right">
                                  <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Today: {todaysAttendance.length} classes
                                  </div>
                                  <div className="flex gap-1 mt-1">
                                    {todaysAttendance.map((att, idx) => (
                                      <div
                                        key={idx}
                                        className="flex items-center gap-1"
                                      >
                                        {getStatusIcon(att.Status)}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Expandable Content */}
                          {isExpanded && (
                            <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-700">
                              {/* Selected Date Details */}
                              {selectedDate && (
                                <div className="mb-4">
                                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {formatDateLong(selectedDate)} - Attendance
                                    Details
                                  </h4>
                                  {todaysAttendance.length > 0 ? (
                                    <div className="space-y-3">
                                      {todaysAttendance.map(
                                        (attendance, index) => (
                                          <div
                                            key={index}
                                            className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600"
                                          >
                                            <div className="flex items-center gap-4 flex-1">
                                              <BookOpen className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                              <div className="flex-1 min-w-0">
                                                <div className="font-medium text-gray-900 dark:text-white text-sm">
                                                  {attendance.classInfo.Subject}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                  {formatTime(
                                                    attendance.classInfo
                                                      .TimeStart
                                                  )}{" "}
                                                  -{" "}
                                                  {formatTime(
                                                    attendance.classInfo.TimeEnd
                                                  )}{" "}
                                                  • {attendance.classInfo.Room}
                                                </div>
                                                {attendance.Notes && (
                                                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                    Note: {attendance.Notes}
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                            <div className="flex items-center gap-4 ml-4">
                                              <div className="flex items-center gap-2">
                                                {getStatusIcon(
                                                  attendance.Status
                                                )}
                                                <span
                                                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                                    attendance.Status
                                                  )}`}
                                                >
                                                  {attendance.Status}
                                                </span>
                                              </div>
                                              <div className="text-right text-sm text-gray-600 dark:text-gray-400">
                                                <div>
                                                  Check-in:{" "}
                                                  {formatDateTime(
                                                    attendance.CheckIn
                                                  )}
                                                </div>
                                                {attendance.CheckOut && (
                                                  <div>
                                                    Check-out:{" "}
                                                    {formatDateTime(
                                                      attendance.CheckOut
                                                    )}
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  ) : (
                                    <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                                      No attendance recorded for this date
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* All Dates Summary */}
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">
                                  Attendance History
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {uniqueDates.map((date) => {
                                    const dateAttendances =
                                      getStudentAttendanceForDate(
                                        student,
                                        date
                                      );
                                    return (
                                      <div
                                        key={date}
                                        className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600"
                                      >
                                        <div className="font-medium text-gray-900 dark:text-white text-sm mb-2">
                                          {formatDate(date)}
                                        </div>
                                        <div className="space-y-1">
                                          {dateAttendances.length > 0 ? (
                                            dateAttendances.map((att, idx) => (
                                              <div
                                                key={idx}
                                                className="flex items-center justify-between text-xs"
                                              >
                                                <span className="text-gray-600 dark:text-gray-400 truncate flex-1">
                                                  {att.classInfo.Subject}
                                                </span>
                                                <span
                                                  className={`ml-2 px-2 py-1 rounded-full ${getStatusColor(
                                                    att.Status
                                                  )}`}
                                                >
                                                  {att.Status}
                                                </span>
                                              </div>
                                            ))
                                          ) : (
                                            <div className="text-gray-400 dark:text-gray-500 text-xs italic">
                                              No attendance
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <div className="text-gray-500 dark:text-gray-400 text-lg font-kumbh">
                      No student attendance records found
                    </div>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-2 font-kumbh">
                      There are no attendance records available for students in
                      this section yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <div className="text-gray-500 dark:text-gray-400 text-lg font-kumbh">
                No attendance data available
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end gap-3 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SectionAttendanceModal;
