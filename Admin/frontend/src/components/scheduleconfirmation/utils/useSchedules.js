import { useState, useEffect } from "react";
import { scheduleService } from "../../../services/scheduleService";

export const useSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const data = await scheduleService.getAllProposedSchedules();

      // Only show the headteacher who submitted the proposal, not all teachers
      if (data.SubmittedBy) {
        const headTeacher = {
          id: data.SubmittedBy.TeacherID || 1,
          name: `${data.SubmittedBy.FirstName} ${data.SubmittedBy.LastName}`,
          position: data.SubmittedBy.Specialization || "Head Teacher",
          idNumber: `HT${
            data.SubmittedBy.TeacherID?.toString().padStart(3, "0") || "001"
          }`,
          schedule: "View proposed schedules",
          proposedBy: `${data.SubmittedBy.FirstName} ${data.SubmittedBy.LastName}`,
          dateProposed: new Date().toISOString().split("T")[0],
          teacherData: data.SubmittedBy,
          // Store proposal data for API calls
          proposalData: {
            submittedBy: data.SubmittedBy.TeacherID,
            headTeacherId: data.SubmittedBy.TeacherID,
            proposalId: data.proposalId || data.id, // Include any proposal identifier
          },
          // Store all teachers for the modal
          allTeachers: data.SchedulesByTeacher.filter(
            (teacher) => teacher.TeacherID && teacher.FirstName
          ),
        };

        setSchedules([headTeacher]);
      } else {
        setSchedules([]);
      }
    } catch (error) {
      console.error("Error fetching schedules:", error);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  const approveAllSchedules = async (proposalData) => {
    try {
      await scheduleService.approveAllSchedules(proposalData);
      // Clear all schedules after approval
      setSchedules([]);
      return { success: true };
    } catch (error) {
      console.error("Error approving schedules:", error);
      throw error;
    }
  };

  const declineAllSchedules = async (proposalData) => {
    try {
      await scheduleService.declineAllSchedules(proposalData);
      // Clear all schedules after decline
      setSchedules([]);
      return { success: true };
    } catch (error) {
      console.error("Error declining schedules:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return {
    schedules,
    loading,
    approveSchedule: approveAllSchedules,
    declineSchedule: declineAllSchedules,
    refetch: fetchSchedules,
  };
};
