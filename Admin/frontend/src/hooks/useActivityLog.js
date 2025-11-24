import { useState, useEffect } from "react";
import { activityService } from "../services/activityService";

export const useActivityLog = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActivities = async (role = null) => {
    try {
      setLoading(true);
      setError(null);

      let data;
      if (role && role !== "All Roles") {
        data = await activityService.getActivitiesByRole(role);
      } else {
        data = await activityService.getActivities();
      }

      setActivities(data);
    } catch (err) {
      setError("Failed to fetch activities. Please try again later.");
      console.error("Error fetching activities:", err);

      // Even on error, we might have mock data, but we set error state
      // The component can decide how to handle this
    } finally {
      setLoading(false);
    }
  };

  const addActivity = async (activityData) => {
    try {
      // Optimistically update the UI
      const newActivity = {
        id: Date.now(), // temporary ID
        timestamp: new Date().toISOString(),
        ...activityData,
      };

      setActivities((prev) => [newActivity, ...prev]);

      // Try to save to backend
      const savedActivity = await activityService.addActivity(activityData);

      // Replace the temporary activity with the saved one
      setActivities((prev) =>
        prev.map((activity) =>
          activity.id === newActivity.id ? savedActivity : activity
        )
      );

      return savedActivity;
    } catch (err) {
      // Revert optimistic update on error
      setActivities((prev) =>
        prev.filter((activity) => activity.id !== newActivity.id)
      );
      throw err;
    }
  };

  // Load activities on component mount
  useEffect(() => {
    fetchActivities();
  }, []);

  return {
    activities,
    loading,
    error,
    refetch: fetchActivities,
    addActivity,
  };
};
