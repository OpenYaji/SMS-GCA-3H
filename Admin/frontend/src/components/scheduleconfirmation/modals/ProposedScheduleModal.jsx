import { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Clock,
  Users,
  BookOpen,
  Download,
  Image,
  FileText,
  Loader,
  ChevronDown,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { scheduleService } from "../../../services/scheduleService";

const days = [
  { id: "monday", label: "MONDAY" },
  { id: "tuesday", label: "TUESDAY" },
  { id: "wednesday", label: "WEDNESDAY" },
  { id: "thursday", label: "THURSDAY" },
  { id: "friday", label: "FRIDAY" },
];

export default function ProposedScheduleModal({ isOpen, onClose, proposal }) {
  const [selectedDay, setSelectedDay] = useState("monday");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [scheduleData, setScheduleData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showTeacherDropdown, setShowTeacherDropdown] = useState(false);

  // Get all teachers from the proposal
  const allTeachers = proposal?.allTeachers || [];

  useEffect(() => {
    if (isOpen && proposal) {
      // Set first teacher as default selection
      if (allTeachers.length > 0 && !selectedTeacher) {
        setSelectedTeacher(allTeachers[0]);
      }
      fetchScheduleData();
    } else {
      // Reset state when modal closes
      setScheduleData(null);
      setError(null);
      setSelectedDay("monday");
      setSelectedTeacher(null);
    }
  }, [isOpen, proposal]);

  useEffect(() => {
    if (selectedTeacher) {
      fetchScheduleData();
    }
  }, [selectedTeacher]);

  const fetchScheduleData = async () => {
    if (!proposal || !selectedTeacher) return;

    try {
      setLoading(true);
      setError(null);
      const data = await scheduleService.getScheduleByTeacherId(
        selectedTeacher.TeacherID
      );
      setScheduleData(data);
    } catch (error) {
      console.error("Error fetching schedule data:", error);
      setError("Failed to load schedule data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format time from "HH:MM:SS" to "HH:MM AM/PM"
  const formatTime = (timeString) => {
    if (!timeString) return "";

    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const minute = parseInt(minutes, 10);

    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    const formattedMinute = minute.toString().padStart(2, "0");

    return `${formattedHour}:${formattedMinute} ${period}`;
  };

  // Helper function to determine section/grade level based on subject
  const determineSection = (subject, teacherData) => {
    // For breaks and special activities
    if (subject === "Break") return "Break Time";
    if (subject === "Lunch") return "Lunch Break";
    if (subject === "Daily Routine") return "All Grades";

    // Based on teacher specialization and subject, determine grade level
    // You can customize this logic based on your school's structure
    return "Grade 1"; // Default section
  };

  // Transform API data to match the expected format for the selected teacher
  const transformScheduleData = (apiData, teacher) => {
    if (!apiData || !Array.isArray(apiData) || !teacher) return null;

    const schedule = {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
    };

    // Find the specific teacher's data
    const teacherData = apiData.find((t) => t.TeacherID === teacher.TeacherID);

    // Also get break/lunch schedules (teacher with no ID)
    const commonSchedules = apiData.find((t) => t.TeacherID === "");

    if (!teacherData) return null;

    // Add teacher's schedules
    if (teacherData.Schedules) {
      teacherData.Schedules.forEach((scheduleItem) => {
        const day = scheduleItem.DayOfWeek.toLowerCase();
        if (schedule[day]) {
          schedule[day].push({
            time: `${formatTime(scheduleItem.StartTime)} — ${formatTime(
              scheduleItem.EndTime
            )}`,
            subject: scheduleItem.Subject,
            section: determineSection(scheduleItem.Subject, teacherData),
            status: scheduleItem.Status,
            teacherId: teacherData.TeacherID,
            startTime: scheduleItem.StartTime,
          });
        }
      });
    }

    // Add common schedules (breaks, lunch) for all teachers
    if (commonSchedules && commonSchedules.Schedules) {
      commonSchedules.Schedules.forEach((scheduleItem) => {
        const day = scheduleItem.DayOfWeek.toLowerCase();
        if (schedule[day]) {
          schedule[day].push({
            time: `${formatTime(scheduleItem.StartTime)} — ${formatTime(
              scheduleItem.EndTime
            )}`,
            subject: scheduleItem.Subject,
            section: determineSection(scheduleItem.Subject, null),
            status: scheduleItem.Status,
            teacherId: null,
            startTime: scheduleItem.StartTime,
          });
        }
      });
    }

    // Sort each day's schedule by start time
    Object.keys(schedule).forEach((day) => {
      schedule[day].sort((a, b) => {
        return a.startTime.localeCompare(b.startTime);
      });
    });

    return {
      proposalInfo: {
        title: "Proposed Schedule",
        proposer: proposal?.name || "Head Teacher",
        date: proposal?.dateProposed || new Date().toISOString().split("T")[0],
        status: "Pending Review",
        selectedTeacher: `${teacher.FirstName} ${teacher.LastName}`,
        teacherSpecialization: teacher.Specialization || "Teacher",
      },
      schedule,
    };
  };

  const transformedData = transformScheduleData(scheduleData, selectedTeacher);
  const currentSchedule = transformedData?.schedule?.[selectedDay] || [];
  const proposalInfo = transformedData?.proposalInfo;

  // Calculate summary data for the selected teacher using actual API data
  const totalClasses = transformedData
    ? Object.values(transformedData.schedule)
        .flat()
        .filter(
          (item) =>
            item.subject !== "Break" &&
            item.subject !== "Lunch" &&
            item.subject !== "Daily Routine" &&
            item.teacherId === selectedTeacher?.TeacherID
        ).length
    : 0;

  const totalHours = totalClasses;

  // Get unique subjects from the actual schedule data
  const subjects = transformedData
    ? [
        ...new Set(
          Object.values(transformedData.schedule)
            .flat()
            .filter(
              (item) =>
                item.subject !== "Break" &&
                item.subject !== "Lunch" &&
                item.subject !== "Daily Routine" &&
                item.teacherId === selectedTeacher?.TeacherID
            )
            .map((item) => item.subject)
        ),
      ]
    : [];

  // Get unique sections from the actual schedule data
  const sections = transformedData
    ? [
        ...new Set(
          Object.values(transformedData.schedule)
            .flat()
            .filter(
              (item) =>
                item.subject !== "Break" &&
                item.subject !== "Lunch" &&
                item.subject !== "Daily Routine" &&
                item.teacherId === selectedTeacher?.TeacherID
            )
            .map((item) => item.section)
        ),
      ]
    : [];

  // Calculate subject distribution
  const subjectDistribution = transformedData
    ? Object.values(transformedData.schedule)
        .flat()
        .filter(
          (item) =>
            item.subject !== "Break" &&
            item.subject !== "Lunch" &&
            item.subject !== "Daily Routine" &&
            item.teacherId === selectedTeacher?.TeacherID
        )
        .reduce((acc, item) => {
          acc[item.subject] = (acc[item.subject] || 0) + 1;
          return acc;
        }, {})
    : {};

  const downloadPDF = async () => {
    if (!transformedData) return;

    setIsGeneratingPDF(true);
    setShowDownloadOptions(false);

    try {
      const pdfContainer = document.createElement("div");
      pdfContainer.style.position = "absolute";
      pdfContainer.style.left = "-9999px";
      pdfContainer.style.top = "0";
      pdfContainer.style.width = "794px";
      pdfContainer.style.backgroundColor = "white";
      pdfContainer.style.padding = "20px";
      pdfContainer.style.fontFamily = "Arial, sans-serif";

      const originalContent = document.getElementById("schedule-modal-content");
      const clonedContent = originalContent.cloneNode(true);

      const interactiveElements =
        clonedContent.querySelectorAll("button, [onclick]");
      interactiveElements.forEach((el) => el.remove());

      clonedContent.style.display = "block";
      clonedContent.style.width = "100%";
      clonedContent.style.maxHeight = "none";
      clonedContent.style.overflow = "visible";
      clonedContent.style.position = "relative";

      const stickyElements =
        clonedContent.querySelectorAll('[class*="sticky"]');
      stickyElements.forEach((el) => {
        el.style.position = "relative";
        el.style.top = "auto";
      });

      pdfContainer.appendChild(clonedContent);
      document.body.appendChild(pdfContainer);

      const canvas = await html2canvas(pdfContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        logging: false,
        width: pdfContainer.offsetWidth,
        height: pdfContainer.scrollHeight,
        windowWidth: pdfContainer.scrollWidth,
        windowHeight: pdfContainer.scrollHeight,
      });

      document.body.removeChild(pdfContainer);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;
      let pageHeight = 297;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `Proposed_Schedule_${proposalInfo.selectedTeacher.replace(
        /\s+/g,
        "_"
      )}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const downloadSimplePDF = () => {
    if (!transformedData) return;

    setIsGeneratingPDF(true);
    setShowDownloadOptions(false);

    try {
      const pdf = new jsPDF();
      let yPosition = 20;
      const pageHeight = pdf.internal.pageSize.height;
      const margin = 20;
      const lineHeight = 7;

      pdf.setFontSize(20);
      pdf.text("PROPOSED SCHEDULE", margin, yPosition);
      yPosition += 15;

      pdf.setFontSize(12);
      pdf.text(`Proposed by: ${proposalInfo.proposer}`, margin, yPosition);
      yPosition += lineHeight;
      pdf.text(`Teacher: ${proposalInfo.selectedTeacher}`, margin, yPosition);
      yPosition += lineHeight;
      pdf.text(
        `Specialization: ${proposalInfo.teacherSpecialization}`,
        margin,
        yPosition
      );
      yPosition += lineHeight;
      pdf.text(`Date: ${proposalInfo.date}`, margin, yPosition);
      yPosition += lineHeight;
      pdf.text(`Status: ${proposalInfo.status}`, margin, yPosition);
      yPosition += 15;

      pdf.setFontSize(16);
      pdf.text("SCHEDULE SUMMARY", margin, yPosition);
      yPosition += 10;

      pdf.setFontSize(10);
      pdf.text(`• Total Classes: ${totalClasses}`, margin, yPosition);
      yPosition += lineHeight;
      pdf.text(`• Teaching Hours: ${totalHours}h per week`, margin, yPosition);
      yPosition += lineHeight;
      pdf.text(`• Subjects: ${subjects.join(", ")}`, margin, yPosition);
      yPosition += lineHeight;
      pdf.text(`• Sections: ${sections.join(", ")}`, margin, yPosition);
      yPosition += 15;

      days.forEach((day) => {
        const daySchedule = transformedData.schedule[day.id];

        if (yPosition > pageHeight - 50) {
          pdf.addPage();
          yPosition = margin;
        }

        pdf.setFontSize(14);
        pdf.text(day.label, margin, yPosition);
        yPosition += 8;

        pdf.setFontSize(9);
        daySchedule.forEach((period) => {
          if (yPosition > pageHeight - 10) {
            pdf.addPage();
            yPosition = margin;
          }

          const line = `${period.time} | ${period.subject} | ${period.section}`;
          pdf.text(line, margin, yPosition);
          yPosition += 5;
        });

        yPosition += 5;
      });

      if (yPosition > pageHeight - 50) {
        pdf.addPage();
        yPosition = margin;
      }

      yPosition += 10;
      pdf.setFontSize(14);
      pdf.text("SUBJECT DISTRIBUTION", margin, yPosition);
      yPosition += 8;

      pdf.setFontSize(10);
      Object.entries(subjectDistribution).forEach(([subject, count]) => {
        if (yPosition > pageHeight - 10) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(`• ${subject}: ${count} classes`, margin, yPosition);
        yPosition += lineHeight;
      });

      const fileName = `Proposed_Schedule_${proposalInfo.selectedTeacher.replace(
        /\s+/g,
        "_"
      )}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleDownloadClick = () => {
    setShowDownloadOptions(true);
  };

  const DownloadOptionsModal = () => {
    if (!showDownloadOptions) return null;

    return (
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
          onClick={() => setShowDownloadOptions(false)}
        ></div>

        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md">
          <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Download size={20} />
              Download Options
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Choose your preferred PDF format
            </p>
          </div>

          <div className="p-6 space-y-4">
            <button
              onClick={downloadPDF}
              disabled={isGeneratingPDF || !transformedData}
              className="w-full p-4 border-2 border-blue-200 dark:border-blue-800 rounded-lg hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-200 text-left group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                  <Image className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 dark:text-white text-sm">
                    High-Quality PDF
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Captures the exact visual appearance with colors and
                    formatting
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={downloadSimplePDF}
              disabled={isGeneratingPDF || !transformedData}
              className="w-full p-4 border-2 border-green-200 dark:border-green-800 rounded-lg hover:border-green-400 dark:hover:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 transition-all duration-200 text-left group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
                  <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 dark:text-white text-sm">
                    Complete Text PDF
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Includes all days, summary, and details in a clean text
                    format
                  </p>
                </div>
              </div>
            </button>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end">
            <button
              onClick={() => setShowDownloadOptions(false)}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div
          className="absolute inset-[-30px] bg-black/50 dark:bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        ></div>

        <div
          id="schedule-modal-content"
          className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto font-kumbh"
        >
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center rounded-t-xl z-10">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {proposalInfo?.title || "Proposed Schedule"}
              </h2>
              {proposalInfo && (
                <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Users size={14} />
                    <span>Proposed by: {proposalInfo.proposer}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>Date: {proposalInfo.date}</span>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      proposalInfo.status === "Pending Review"
                        ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                        : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                    }`}
                  >
                    {proposalInfo.status}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowTeacherDropdown(!showTeacherDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <Users size={16} />
                {selectedTeacher
                  ? `${selectedTeacher.FirstName} ${selectedTeacher.LastName}`
                  : "Select Teacher"}
                <ChevronDown size={16} />
              </button>

              {showTeacherDropdown && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                  {allTeachers.map((teacher) => (
                    <button
                      key={teacher.TeacherID}
                      onClick={() => {
                        setSelectedTeacher(teacher);
                        setShowTeacherDropdown(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        selectedTeacher?.TeacherID === teacher.TeacherID
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <div className="font-medium">
                        {teacher.FirstName} {teacher.LastName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {teacher.Specialization}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ml-2"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          {loading && (
            <div className="flex justify-center items-center py-16">
              <Loader className="w-8 h-8 animate-spin text-blue-500" />
              <span className="ml-2 text-gray-600 dark:text-gray-400">
                Loading schedule data for {selectedTeacher?.FirstName}...
              </span>
            </div>
          )}

          {error && !loading && (
            <div className="flex justify-center items-center py-16">
              <div className="text-center">
                <X className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                <button
                  onClick={fetchScheduleData}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {!loading && !error && transformedData && selectedTeacher && (
            <>
              <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-blue-800 dark:text-blue-300">
                      {selectedTeacher.FirstName} {selectedTeacher.LastName}
                    </h3>
                    <p className="text-blue-600 dark:text-blue-400 text-sm">
                      {selectedTeacher.Specialization}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-600 dark:text-blue-400 text-sm">
                      Teacher ID: T
                      {selectedTeacher.TeacherID.toString().padStart(3, "0")}
                    </p>
                    <p className="text-blue-600 dark:text-blue-400 text-sm">
                      Total Classes: {totalClasses} • Teaching Hours:{" "}
                      {totalHours}h
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex px-6">
                  {days.map((day) => (
                    <button
                      key={day.id}
                      onClick={() => setSelectedDay(day.id)}
                      className={`px-6 py-3 font-semibold text-sm uppercase tracking-wider transition-colors border-b-2 ${
                        selectedDay === day.id
                          ? "border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30"
                          : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
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
                          Section
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {currentSchedule.map((period, index) => (
                        <tr
                          key={index}
                          className={`transition-colors ${
                            period.subject === "Lunch"
                              ? "bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30"
                              : period.subject === "Break"
                              ? "bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700"
                              : period.subject === "Daily Routine"
                              ? "bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                              : "bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {period.time}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                            <div
                              className={`font-semibold ${
                                period.subject === "Lunch"
                                  ? "text-orange-800 dark:text-orange-300"
                                  : period.subject === "Break"
                                  ? "text-gray-500 dark:text-gray-400"
                                  : period.subject === "Daily Routine"
                                  ? "text-purple-800 dark:text-purple-300"
                                  : "text-green-800 dark:text-green-300"
                              }`}
                            >
                              {period.subject}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                period.subject === "Lunch"
                                  ? "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200"
                                  : period.subject === "Break"
                                  ? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                                  : period.subject === "Daily Routine"
                                  ? "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
                                  : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                              }`}
                            >
                              {period.section}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <h4 className="font-semibold text-blue-800 dark:text-blue-300 text-sm">
                        Total Classes
                      </h4>
                    </div>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                      {totalClasses}
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      Weekly
                    </p>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <h4 className="font-semibold text-green-800 dark:text-green-300 text-sm">
                        Teaching Hours
                      </h4>
                    </div>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                      {totalHours}h
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      Per week
                    </p>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      <h4 className="font-semibold text-purple-800 dark:text-purple-300 text-sm">
                        Subjects
                      </h4>
                    </div>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                      {subjects.length}
                    </p>
                    <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                      Different subjects
                    </p>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                      <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 text-sm">
                        Sections
                      </h4>
                    </div>
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">
                      {sections.length}
                    </p>
                    <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                      Different sections
                    </p>
                  </div>
                </div>

                {Object.keys(subjectDistribution).length > 0 && (
                  <div className="mt-6">
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                        <BookOpen size={16} />
                        Subject Distribution
                      </h4>
                      <div className="space-y-2">
                        {Object.entries(subjectDistribution).map(
                          ([subject, count], index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                            >
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {subject}
                              </span>
                              <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                                {count} classes
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center rounded-b-xl">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing schedule for: {selectedTeacher.FirstName}{" "}
                  {selectedTeacher.LastName}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleDownloadClick}
                    disabled={isGeneratingPDF}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Download size={16} />
                    {isGeneratingPDF ? "Generating PDF..." : "Download PDF"}
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <DownloadOptionsModal />
    </>
  );
}
