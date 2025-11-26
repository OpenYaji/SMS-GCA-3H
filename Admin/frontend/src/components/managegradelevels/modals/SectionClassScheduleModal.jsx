import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  X,
  Loader,
  AlertCircle,
  Download,
  ChevronDown,
  FileText,
  Table,
} from "lucide-react";
import manageGradeLevelsService from "../../../services/manageGradeLevelsService";

const days = [
  { id: "monday", label: "MONDAY" },
  { id: "tuesday", label: "TUESDAY" },
  { id: "wednesday", label: "WEDNESDAY" },
  { id: "thursday", label: "THURSDAY" },
  { id: "friday", label: "FRIDAY" },
];

const SectionClassScheduleModal = ({
  isOpen,
  onClose,
  section,
  gradeLevel,
}) => {
  const [selectedDay, setSelectedDay] = useState("monday");
  const [scheduleData, setScheduleData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloadDropdownOpen, setDownloadDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const teacher = useMemo(() => {
    if (!section) return null;
    const adviser = section.rawData?.Adviser;
    if (adviser) {
      return {
        id: adviser.AdviserTeacherID || section.AdviserID,
        name:
          `${adviser.FirstName || ""} ${adviser.LastName || ""}`.trim() ||
          "Not Assigned",
        firstName: adviser.FirstName,
        lastName: adviser.LastName,
        middleName: adviser.MiddleName,
      };
    }

    return {
      id: section.AdviserID,
      name: section.adviser || section.AdviserName || "Not Assigned",
    };
  }, [section]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDownloadDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!section || !isOpen) return;

      setIsLoading(true);
      setError(null);

      try {
        let scheduleResponse;
        if (section.rawData?.Schedule) {
          scheduleResponse = await manageGradeLevelsService.getScheduleByURL(
            section.rawData.Schedule
          );
        } else {
          scheduleResponse = await manageGradeLevelsService.getSectionSchedule(
            section.id
          );
        }

        console.log("Schedule API Response:", scheduleResponse); // Debug log

        // Handle the nested structure
        if (scheduleResponse.data && scheduleResponse.data.Schedules) {
          setScheduleData(scheduleResponse.data.Schedules);
        } else if (scheduleResponse.Schedules) {
          setScheduleData(scheduleResponse.Schedules);
        } else if (Array.isArray(scheduleResponse.data)) {
          // Fallback for array format
          setScheduleData(scheduleResponse.data);
        } else if (Array.isArray(scheduleResponse)) {
          setScheduleData(scheduleResponse);
        } else {
          setScheduleData(null);
        }
      } catch (err) {
        console.error("Error fetching section schedule:", err);
        setError(err.message || "Failed to load schedule");
        setScheduleData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedule();
  }, [section, isOpen]);

  // Transform schedule data for display
  const getScheduleForDay = (day) => {
    if (!scheduleData) return [];

    const dayKey = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
    const daySchedule = scheduleData[dayKey];

    if (!daySchedule || !Array.isArray(daySchedule)) return [];

    return daySchedule.map((item, index) => ({
      id: index,
      startTime: item.StartTime,
      endTime: item.EndTime,
      subject: item.SubjectName,
      subjectCode: item.SubjectCode,
      teacher: item.Teacher,
      room: item.RoomNumber,
      day: dayKey,
    }));
  };

  // Get all schedule data for export
  const getAllScheduleData = () => {
    if (!scheduleData) return [];

    const allSchedules = [];
    days.forEach((day) => {
      const daySchedule = getScheduleForDay(day.id);
      daySchedule.forEach((period) => {
        allSchedules.push({
          ...period,
          day: day.label,
        });
      });
    });
    return allSchedules;
  };

  // Get schedule for selected day
  const filteredSchedule = getScheduleForDay(selectedDay);

  // Sort schedule by time
  const sortedSchedule = [...filteredSchedule].sort((a, b) => {
    return a.startTime.localeCompare(b.startTime);
  });

  // Format time display
  const formatTimeDisplay = (scheduleItem) => {
    if (scheduleItem.startTime && scheduleItem.endTime) {
      // Convert 24-hour format to 12-hour format
      const formatTime = (timeStr) => {
        const [hours, minutes] = timeStr.split(":");
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minutes} ${ampm}`;
      };

      return `${formatTime(scheduleItem.startTime)} - ${formatTime(
        scheduleItem.endTime
      )}`;
    }
    return "TBA";
  };

  // Format time for export (24-hour format)
  const formatTimeForExport = (scheduleItem) => {
    if (scheduleItem.startTime && scheduleItem.endTime) {
      return `${scheduleItem.startTime} - ${scheduleItem.endTime}`;
    }
    return "TBA";
  };

  // Format subject name
  const getSubjectName = (scheduleItem) => {
    return scheduleItem.subject || "No Subject";
  };

  // Format teacher name
  const getTeacherName = (scheduleItem) => {
    const teacher = scheduleItem.teacher;
    if (typeof teacher === "object") {
      return (
        `${teacher.FirstName || ""} ${teacher.LastName || ""}`.trim() ||
        "Not Assigned"
      );
    }
    return teacher || "Not Assigned";
  };

  // Format room
  const getRoom = (scheduleItem) => {
    return scheduleItem.room || "TBA";
  };

  // Download as Excel function
  const downloadAsExcel = () => {
    if (!scheduleData || Object.keys(scheduleData).length === 0) {
      alert("No schedule data available to download.");
      return;
    }

    try {
      const allSchedules = getAllScheduleData();

      // Create CSV content with high-quality formatting
      let csvContent = "CLASS SCHEDULE REPORT\n";
      csvContent += "=====================\n\n";
      csvContent += `Grade Level: ${gradeLevel}\n`;
      csvContent += `Section: ${section?.name || "N/A"}\n`;
      csvContent += `Adviser: ${teacher?.name || "Not Assigned"}\n`;
      csvContent += `Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n\n`;

      // Add summary statistics
      const totalSubjects = new Set(allSchedules.map((item) => item.subject))
        .size;
      const totalTeachers = new Set(
        allSchedules.map((item) => getTeacherName(item))
      ).size;
      const scheduledDays = days.filter(
        (day) => getScheduleForDay(day.id).length > 0
      ).length;

      csvContent += "SUMMARY\n";
      csvContent += "-------\n";
      csvContent += `Total Subjects: ${totalSubjects}\n`;
      csvContent += `Total Teachers: ${totalTeachers}\n`;
      csvContent += `Scheduled Days: ${scheduledDays}\n\n`;

      // Add detailed schedule by day
      days.forEach((day) => {
        const daySchedule = getScheduleForDay(day.id);
        if (daySchedule.length > 0) {
          csvContent += `${day.label.toUpperCase()}\n`;
          csvContent += `${"=".repeat(day.label.length)}\n`;
          csvContent +=
            "Start Time,End Time,Subject,Subject Code,Teacher,Room\n";

          // Sort day schedule by time
          const sortedDaySchedule = [...daySchedule].sort((a, b) =>
            a.startTime.localeCompare(b.startTime)
          );

          sortedDaySchedule.forEach((period) => {
            const startTime = period.startTime || "";
            const endTime = period.endTime || "";
            const subject = getSubjectName(period);
            const subjectCode = period.subjectCode || "N/A";
            const teacherName = getTeacherName(period);
            const room = getRoom(period);

            // Escape commas and quotes in values
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

            csvContent += `${escapeCsv(startTime)},${escapeCsv(
              endTime
            )},${escapeCsv(subject)},${escapeCsv(subjectCode)},${escapeCsv(
              teacherName
            )},${escapeCsv(room)}\n`;
          });
          csvContent += "\n";
        }
      });

      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `ClassSchedule_${gradeLevel}_${
          section?.name || "Section"
        }_${new Date().getTime()}.csv`
      );
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadDropdownOpen(false);
    } catch (err) {
      console.error("Error generating Excel file:", err);
      alert("Error generating Excel file. Please try again.");
    }
  };

  // Download as PDF function
  const downloadAsPDF = async () => {
    if (!scheduleData || Object.keys(scheduleData).length === 0) {
      alert("No schedule data available to download.");
      return;
    }

    try {
      // Dynamically import jsPDF to ensure it's available
      const { jsPDF } = await import("jspdf");

      const allSchedules = getAllScheduleData();
      const doc = new jsPDF();

      // Set document properties
      doc.setProperties({
        title: `Class Schedule - ${gradeLevel} - ${section?.name}`,
        subject: "Class Schedule Report",
        author: "School Management System",
        creator: "School Management System",
      });

      // Colors
      const primaryColor = [41, 128, 185];
      const secondaryColor = [52, 152, 219];
      const lightGray = [241, 242, 246];
      const darkGray = [87, 96, 111];

      // Header
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, 210, 40, "F");

      doc.setFontSize(20);
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text("CLASS SCHEDULE REPORT", 105, 15, { align: "center" });

      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255, 0.9);
      doc.setFont("helvetica", "normal");
      doc.text(`${gradeLevel} - ${section?.name || "N/A"}`, 105, 25, {
        align: "center",
      });

      // School info
      doc.setFontSize(10);
      doc.text(`Adviser: ${teacher?.name || "Not Assigned"}`, 15, 35);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 35, {
        align: "center",
      });
      doc.text(`Total Records: ${allSchedules.length}`, 180, 35, {
        align: "right",
      });

      let yPosition = 55;

      // Summary section
      doc.setFillColor(...lightGray);
      doc.roundedRect(15, yPosition, 180, 25, 3, 3, "F");

      doc.setFontSize(12);
      doc.setTextColor(...darkGray);
      doc.setFont("helvetica", "bold");
      doc.text("SCHEDULE SUMMARY", 25, yPosition + 8);

      // Summary stats
      const totalSubjects = new Set(allSchedules.map((item) => item.subject))
        .size;
      const totalTeachers = new Set(
        allSchedules.map((item) => getTeacherName(item))
      ).size;
      const scheduledDays = days.filter(
        (day) => getScheduleForDay(day.id).length > 0
      ).length;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Total Subjects: ${totalSubjects}`, 25, yPosition + 16);
      doc.text(`Total Teachers: ${totalTeachers}`, 80, yPosition + 16);
      doc.text(`Scheduled Days: ${scheduledDays}`, 135, yPosition + 16);

      yPosition += 40;

      // Schedule by day
      days.forEach((day) => {
        const daySchedule = getScheduleForDay(day.id);
        if (daySchedule.length === 0) return;

        // Check if we need a new page
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }

        // Day header
        doc.setFillColor(...secondaryColor);
        doc.roundedRect(15, yPosition, 180, 8, 2, 2, "F");

        doc.setFontSize(11);
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.text(day.label, 20, yPosition + 5.5);

        yPosition += 12;

        // Table headers
        doc.setFillColor(...lightGray);
        doc.rect(15, yPosition, 180, 8, "F");

        doc.setFontSize(9);
        doc.setTextColor(...darkGray);
        doc.setFont("helvetica", "bold");
        doc.text("TIME", 20, yPosition + 5.5);
        doc.text("SUBJECT", 50, yPosition + 5.5);
        doc.text("TEACHER", 110, yPosition + 5.5);
        doc.text("ROOM", 170, yPosition + 5.5);

        yPosition += 8;

        // Sort day schedule by time
        const sortedDaySchedule = [...daySchedule].sort((a, b) =>
          a.startTime.localeCompare(b.startTime)
        );

        // Schedule items
        sortedDaySchedule.forEach((period, index) => {
          // Check if we need a new page
          if (yPosition > 280) {
            doc.addPage();
            yPosition = 20;

            // Redraw headers on new page
            doc.setFillColor(...lightGray);
            doc.rect(15, yPosition, 180, 8, "F");
            doc.setTextColor(...darkGray);
            doc.setFont("helvetica", "bold");
            doc.text("TIME", 20, yPosition + 5.5);
            doc.text("SUBJECT", 50, yPosition + 5.5);
            doc.text("TEACHER", 110, yPosition + 5.5);
            doc.text("ROOM", 170, yPosition + 5.5);
            yPosition += 8;
          }

          // Alternate row colors
          if (index % 2 === 0) {
            doc.setFillColor(255, 255, 255);
          } else {
            doc.setFillColor(250, 250, 250);
          }
          doc.rect(15, yPosition, 180, 10, "F");

          // Content
          doc.setFontSize(8);
          doc.setTextColor(0, 0, 0);
          doc.setFont("helvetica", "normal");

          // Time
          doc.text(formatTimeDisplay(period), 20, yPosition + 6);

          // Subject (with code)
          const subjectLine = getSubjectName(period);
          doc.text(subjectLine, 50, yPosition + 3.5);
          if (period.subjectCode) {
            doc.setFontSize(7);
            doc.setTextColor(100, 100, 100);
            doc.text(`Code: ${period.subjectCode}`, 50, yPosition + 7.5);
            doc.setFontSize(8);
            doc.setTextColor(0, 0, 0);
          }

          // Teacher
          const teacherName = getTeacherName(period);
          if (teacherName.length > 25) {
            doc.text(teacherName.substring(0, 25) + "...", 110, yPosition + 6);
          } else {
            doc.text(teacherName, 110, yPosition + 6);
          }

          // Room
          doc.text(getRoom(period), 170, yPosition + 6, { align: "center" });

          yPosition += 10;
        });

        yPosition += 5; // Space between days
      });

      // Footer
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i} of ${totalPages}`, 105, 290, { align: "center" });
        doc.text(`Generated by School Management System`, 105, 295, {
          align: "center",
        });
      }

      // Save the PDF - this should trigger automatic download
      doc.save(
        `ClassSchedule_${gradeLevel}_${
          section?.name || "Section"
        }_${new Date().getTime()}.pdf`
      );

      setDownloadDropdownOpen(false);
    } catch (err) {
      console.error("Error generating PDF with jsPDF:", err);
      // Fallback to simple HTML download
      fallbackPDFDownload();
    }
  };

  // Simple fallback PDF download using HTML
  const fallbackPDFDownload = () => {
    try {
      const allSchedules = getAllScheduleData();
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Class Schedule - ${gradeLevel} - ${section?.name}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
                .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 15px; margin-bottom: 20px; }
                .header h1 { margin: 0; font-size: 24px; }
                .summary { background: #f5f5f5; padding: 15px; margin-bottom: 20px; border-radius: 5px; }
                .day-section { margin-bottom: 25px; }
                .day-header { background: #2c3e50; color: white; padding: 10px; font-weight: bold; }
                table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                th, td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #ddd; }
                th { background-color: #f8f9fa; font-weight: bold; }
                .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>CLASS SCHEDULE REPORT</h1>
                <div><strong>${gradeLevel} - ${
        section?.name || "N/A"
      }</strong></div>
                <div>Adviser: ${teacher?.name || "Not Assigned"}</div>
                <div>Generated: ${new Date().toLocaleDateString()}</div>
            </div>

            <div class="summary">
                <strong>Schedule Summary:</strong><br>
                Total Subjects: ${
                  new Set(allSchedules.map((item) => item.subject)).size
                } | 
                Total Teachers: ${
                  new Set(allSchedules.map((item) => getTeacherName(item))).size
                } | 
                Scheduled Days: ${
                  days.filter((day) => getScheduleForDay(day.id).length > 0)
                    .length
                }
            </div>

            ${days
              .map((day) => {
                const daySchedule = getScheduleForDay(day.id);
                if (daySchedule.length === 0) return "";

                const sortedDaySchedule = [...daySchedule].sort((a, b) =>
                  a.startTime.localeCompare(b.startTime)
                );

                return `
                <div class="day-section">
                    <div class="day-header">${day.label}</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Subject</th>
                                <th>Teacher</th>
                                <th>Room</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${sortedDaySchedule
                              .map(
                                (period) => `
                                <tr>
                                    <td>${formatTimeDisplay(period)}</td>
                                    <td>
                                        <strong>${getSubjectName(
                                          period
                                        )}</strong><br>
                                        <small>${
                                          period.subjectCode || "N/A"
                                        }</small>
                                    </td>
                                    <td>${getTeacherName(period)}</td>
                                    <td>${getRoom(period)}</td>
                                </tr>
                            `
                              )
                              .join("")}
                        </tbody>
                    </table>
                </div>
                `;
              })
              .join("")}

            <div class="footer">
                Generated on ${new Date().toLocaleDateString()} | Total Records: ${
        allSchedules.length
      }
            </div>
        </body>
        </html>
      `;

      // Create a blob and download as HTML file (users can print as PDF)
      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ClassSchedule_${gradeLevel}_${
        section?.name || "Section"
      }_${new Date().getTime()}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadDropdownOpen(false);
    } catch (err) {
      console.error("Error with fallback PDF download:", err);
      alert(
        "Error generating PDF file. Please try again or use the Excel export."
      );
    }
  };

  // Check if schedule exists
  const hasSchedule = scheduleData && Object.keys(scheduleData).length > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal container */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto font-kumbh">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center rounded-t-xl z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Class Schedule: {gradeLevel}: {section?.name}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {" "}
              Adviser: {teacher?.name || "Not Assigned"}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {/* Download Dropdown */}
            {hasSchedule && !isLoading && !error && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDownloadDropdownOpen(!downloadDropdownOpen)}
                  className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium"
                  aria-label="Download options"
                >
                  <Download size={16} className="mr-2" />
                  Download As
                  <ChevronDown size={16} className="ml-2" />
                </button>

                {downloadDropdownOpen && (
                  <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-20">
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
                    <button
                      onClick={downloadAsPDF}
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors first:rounded-t-lg last:rounded-b-lg"
                    >
                      <FileText size={16} className="mr-3 text-red-500" />
                      <div className="text-left">
                        <div className="font-medium">PDF Format</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Direct Download
                        </div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={onClose}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Days Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex px-6">
            {days.map((day) => (
              <button
                key={day.id}
                onClick={() => setSelectedDay(day.id)}
                className={`px-6 py-3 font-semibold text-sm uppercase tracking-wider transition-colors border-b-2 ${
                  selectedDay === day.id
                    ? "border-yellow-500 text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>

        {/* Schedule Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 animate-spin text-yellow-500" />
              <span className="ml-3 text-gray-600 dark:text-gray-400">
                Loading schedule...
              </span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-red-300 dark:text-red-500 mx-auto mb-4" />
              <div className="text-red-500 dark:text-red-400 text-lg mb-2">
                Error loading schedule
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : !hasSchedule ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                No Schedule Available
              </div>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                This section doesn't have a class schedule set up yet.
              </p>
            </div>
          ) : (
            <>
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Teacher
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Room
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {sortedSchedule.length > 0 ? (
                      sortedSchedule.map((period) => (
                        <tr
                          key={period.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {formatTimeDisplay(period)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                            <div className="font-semibold">
                              {getSubjectName(period)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {period.subjectCode}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex flex-col">
                              {getTeacherName(period)}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                            {getRoom(period)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                        >
                          No classes scheduled for{" "}
                          {selectedDay.charAt(0).toUpperCase() +
                            selectedDay.slice(1)}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Schedule Summary */}
              {hasSchedule && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-300 text-sm">
                      Total Subjects
                    </h4>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                      {
                        new Set(
                          Object.values(scheduleData)
                            .flat()
                            .map((item) => item.SubjectName)
                        ).size
                      }
                    </p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="font-semibold text-green-800 dark:text-green-300 text-sm">
                      Scheduled Days
                    </h4>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                      {Object.keys(scheduleData).length}
                    </p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                    <h4 className="font-semibold text-purple-800 dark:text-purple-300 text-sm">
                      Teachers
                    </h4>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                      {
                        new Set(
                          Object.values(scheduleData)
                            .flat()
                            .map((item) =>
                              item.Teacher
                                ? `${item.Teacher.FirstName || ""} ${
                                    item.Teacher.LastName || ""
                                  }`.trim()
                                : ""
                            )
                            .filter((name) => name)
                        ).size
                      }
                    </p>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 text-sm">
                      Grade Level
                    </h4>
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1 capitalize">
                      {gradeLevel}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end rounded-b-xl">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-medium transition-colors"
          >
            Close Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default SectionClassScheduleModal;
