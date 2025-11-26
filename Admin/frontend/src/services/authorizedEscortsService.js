const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

export const authorizedEscortsService = {
  async getAuthorizedEscorts() {
    try {
      const response = await fetch(`${API_BASE_URL}/authorized-escorts`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error("Error fetching authorized escorts:", error);
      throw new Error("Failed to fetch authorized escorts");
    }
  },

  async approveEscort(escortId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/authorized-escorts/${escortId}/approve`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("Error approving escort:", error);
      throw new Error("Failed to approve escort");
    }
  },

  async rejectEscort(escortId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/authorized-escorts/${escortId}/reject`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("Error rejecting escort:", error);
      throw new Error("Failed to reject escort");
    }
  },
};
