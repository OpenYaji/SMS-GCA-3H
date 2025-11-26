import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

const transactionService = {
  // GET ALL TRANSACTIONS MANNNNNNNNNNNNNN
  //PADAGDAGAN NG TIME DITO SA DATE AND TIME, DATE LANG KASI MERON E
  // Due date di ko na sinama sa dispaly since wala naman due date sabi ng Gymnazo
  getTransactions: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/transactions`);
      return {
        success: true,
        data: response.data.data,
        pagination: {
          links: response.data.links,
          meta: response.data.meta,
        },
      };
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch transactions",
        data: [],
      };
    }
  },
};

export default transactionService;
