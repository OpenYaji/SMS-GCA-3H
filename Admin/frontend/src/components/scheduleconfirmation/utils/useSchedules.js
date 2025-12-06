import { useState, useEffect } from "react";
import { scheduleService } from "../../../services/scheduleService";

export const useSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError(null);
      // Use the correct endpoint from scheduleService
      const data = await scheduleService.getAllProposedSchedules();

      console.log("Fetched schedules data:", data); // Debug log

      // Check if we have valid data
      if (data && data.SubmittedBy && data.SubmittedBy.TeacherID) {
        // Create headteacher card with proposal information
        const headTeacher = {
          id: data.SubmittedBy.TeacherID,
          name: `${data.SubmittedBy.FirstName || ""} ${
            data.SubmittedBy.LastName || ""
          }`.trim(),
          position: data.SubmittedBy.Specialization || "Head Teacher",
          idNumber: `HT${data.SubmittedBy.TeacherID.toString().padStart(
            3,
            "0"
          )}`,
          schedule: "View proposed schedules",
          proposedBy: `${data.SubmittedBy.FirstName || ""} ${
            data.SubmittedBy.LastName || ""
          }`.trim(),
          dateProposed: new Date().toISOString().split("T")[0],
          teacherData: data.SubmittedBy,
          // Store proposal data for API calls
          proposalData: {
            submittedBy: data.SubmittedBy.TeacherID,
            headTeacherId: data.SubmittedBy.TeacherID,
            proposalId: data.SubmittedBy.TeacherID,
          },
          // Store all teachers for the modal
          allTeachers: data.SchedulesByTeacher || [],
          // Additional info from backend (for modal use only)
          totalPendingSchedules: data.TotalPendingSchedules || 0,
          totalTeachers: data.TotalTeachers || 0,
          hasSchedules: (data.TotalPendingSchedules || 0) > 0,
          message: data.Message || "",
        };

        // Add avatar placeholder using UI Avatars
        headTeacher.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
          headTeacher.name
        )}&background=FFBC0D&color=fff&bold=true&size=128`;

        // Only show the headteacher card if there are pending schedules
        if (headTeacher.hasSchedules) {
          setSchedules([headTeacher]);
        } else {
          // If no pending schedules, show empty state
          setSchedules([]);
        }
      } else {
        console.warn("No valid head teacher data found in response");
        setSchedules([]);
      }
    } catch (error) {
      console.error("Error fetching schedules:", error);
      setError(error.message || "Failed to fetch proposed schedules");
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  const approveAllSchedules = async (proposalData) => {
    try {
      // Use the correct service method
      const result = await scheduleService.approveAllSchedules(proposalData);

      // Show success message
      console.log("Approval successful:", result);

      // Refresh the schedules after approval
      await fetchSchedules();
      return { success: true, data: result };
    } catch (error) {
      console.error("Error approving schedules:", error);

      // Check if it's a conflict error
      if (error.conflicts) {
        throw {
          type: "conflict",
          message: error.originalMessage || "Schedule conflicts found",
          conflicts: error.conflicts,
        };
      }

      throw {
        type: "error",
        message: error.message || "Failed to approve schedules",
      };
    }
  };

  const declineAllSchedules = async (proposalData) => {
    try {
      // Use the correct service method
      const result = await scheduleService.declineAllSchedules(proposalData);

      // Show success message
      console.log("Decline successful:", result);

      // Refresh the schedules after decline
      await fetchSchedules();
      return { success: true, data: result };
    } catch (error) {
      console.error("Error declining schedules:", error);
      throw {
        type: "error",
        message: error.message || "Failed to decline schedules",
      };
    }
  };

  // Fetch detailed schedules for a specific teacher
  const fetchTeacherScheduleDetails = async (teacherId) => {
    try {
      const data = await scheduleService.getScheduleByTeacherId(teacherId);
      return data;
    } catch (error) {
      console.error(`Error fetching schedule for teacher ${teacherId}:`, error);
      throw error;
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return {
    schedules,
    loading,
    error,
    approveSchedule: approveAllSchedules,
    declineSchedule: declineAllSchedules,
    fetchTeacherScheduleDetails,
    refetch: fetchSchedules,
  };
};
