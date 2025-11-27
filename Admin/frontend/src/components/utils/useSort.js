import { useMemo } from "react";

export default function useSort(data, sortOption) {
  return useMemo(() => {
    if (!data || !Array.isArray(data)) {
      console.warn("useSort: Invalid data provided");
      return [];
    }

    let filtered = [...data];

    console.log(
      `useSort - Input: ${filtered.length} items, Option: "${sortOption}"`
    );

    // Remove all filtering logic for student archive options
    // The data is already pre-filtered by the API calls in StudentTable.jsx
    // We only need to handle sorting here, not filtering
    if (
      sortOption !== "Archived Students Account" &&
      sortOption !== "Students with No Accounts" &&
      sortOption !== "Archived Student Records" &&
      sortOption !== "Students Fully Archived"
    ) {
      switch (sortOption) {
        // Teacher options
        case "All Teachers":
          filtered = filtered.filter((item) => item.archived !== true);
          console.log(
            `All Teachers filter: ${filtered.length} non-archived teachers`
          );
          break;

        case "Archived Teachers":
          filtered = filtered.filter((item) => item.archived === true);
          console.log(
            `Archived Teachers filter: ${filtered.length} archived teachers`
          );
          break;

        // Guard options
        case "All Guards":
          filtered = filtered.filter((item) => item.archived !== true);
          console.log(
            `All Guards filter: ${filtered.length} non-archived guards`
          );
          break;

        case "Archived Guards":
          filtered = filtered.filter((item) => item.archived === true);
          console.log(
            `Archived Guards filter: ${filtered.length} archived guards`
          );
          break;

        // Registrar options
        case "All Registrars":
          filtered = filtered.filter((item) => item.archived !== true);
          console.log(
            `All Registrars filter: ${filtered.length} non-archived registrars`
          );
          break;

        case "Archived Registrars":
          filtered = filtered.filter((item) => item.archived === true);
          console.log(
            `Archived Registrars filter: ${filtered.length} archived registrars`
          );
          break;

        // Admin options
        case "All Admins":
          filtered = filtered.filter((item) => item.archived !== true);
          console.log(
            `All Admins filter: ${filtered.length} non-archived admins`
          );
          break;

        case "Archived Admins":
          filtered = filtered.filter((item) => item.archived === true);
          console.log(
            `Archived Admins filter: ${filtered.length} archived admins`
          );
          break;

        // Parent options - Updated to handle escort status
        case "All Escorts":
          // Show only approved escorts by default
          filtered = filtered.filter(
            (item) => item.EscortStatus === "Approved" && item.archived !== true
          );
          console.log(
            `All Escorts filter: ${filtered.length} approved escorts`
          );
          break;

        case "Approved Only":
          filtered = filtered.filter(
            (item) => item.EscortStatus === "Approved" && item.archived !== true
          );
          console.log(
            `Approved Only filter: ${filtered.length} approved escorts`
          );
          break;

        case "Pending Only":
          filtered = filtered.filter(
            (item) => item.EscortStatus === "Pending" && item.archived !== true
          );
          console.log(
            `Pending Only filter: ${filtered.length} pending escorts`
          );
          break;

        case "Declined Only":
          filtered = filtered.filter(
            (item) => item.EscortStatus === "Rejected" && item.archived !== true
          );
          console.log(
            `Declined Only filter: ${filtered.length} declined escorts`
          );
          break;

        case "All Parents":
          filtered = filtered.filter((item) => item.archived !== true);
          console.log(
            `All Parents filter: ${filtered.length} non-archived parents`
          );
          break;

        case "Archived Parents":
          filtered = filtered.filter((item) => item.archived === true);
          console.log(
            `Archived Parents filter: ${filtered.length} archived parents`
          );
          break;

        // Transaction options
        case "Fully Paid":
          filtered = filtered.filter((item) => {
            const balance = parseFloat(item.balance) || 0;
            return balance === 0;
          });
          console.log(`Fully Paid filter: ${filtered.length} items`);
          break;

        case "With Outstanding Balance":
          filtered = filtered.filter((item) => {
            const balance = parseFloat(item.balance) || 0;
            return balance > 0;
          });
          console.log(`Outstanding Balance filter: ${filtered.length} items`);
          break;

        // Student options - Only apply basic filtering for "All Students"
        case "All Students":
          filtered = filtered.filter(
            (item) => !item.isRecordArchived && !item.isAccountArchived
          );
          console.log(
            `All Students filter: ${filtered.length} active students`
          );
          break;

        default:
          filtered = filtered.filter((item) => item.archived !== true);
          console.log(`Default filter: ${filtered.length} non-archived items`);
      }
    } else {
      // For student archive views, don't apply any filtering as the data is already pre-filtered
      console.log(
        `Student archive view - no filtering applied: ${filtered.length} items`
      );
    }

    // Then apply sorting
    switch (sortOption) {
      case "Newest First":
        filtered.sort((a, b) => {
          const dateA = new Date(
            a.rawData?.HireDate || a.createdAt || a.date || 0
          );
          const dateB = new Date(
            b.rawData?.HireDate || b.createdAt || b.date || 0
          );
          return dateB - dateA;
        });
        console.log(`Newest First: ${filtered.length} items sorted`);
        break;

      case "Oldest First":
        filtered.sort((a, b) => {
          const dateA = new Date(
            a.rawData?.HireDate || a.createdAt || a.date || 0
          );
          const dateB = new Date(
            b.rawData?.HireDate || b.createdAt || b.date || 0
          );
          return dateA - dateB;
        });
        console.log(`Oldest First: ${filtered.length} items sorted`);
        break;

      case "Amount (High to Low)":
        filtered.sort((a, b) => {
          const amountA =
            parseFloat((a.amount || "0").replace(/[^\d.-]/g, "")) || 0;
          const amountB =
            parseFloat((b.amount || "0").replace(/[^\d.-]/g, "")) || 0;
          return amountB - amountA;
        });
        console.log(`Amount High to Low: ${filtered.length} items sorted`);
        break;

      case "Amount (Low to High)":
        filtered.sort((a, b) => {
          const amountA =
            parseFloat((a.amount || "0").replace(/[^\d.-]/g, "")) || 0;
          const amountB =
            parseFloat((b.amount || "0").replace(/[^\d.-]/g, "")) || 0;
          return amountA - amountB;
        });
        console.log(`Amount Low to High: ${filtered.length} items sorted`);
        break;

      case "Alphabetical (A-Z)":
        filtered.sort((a, b) => {
          const nameA = (
            a.name ||
            a.formattedName ||
            a.user ||
            a.FullName ||
            ""
          ).toLowerCase();
          const nameB = (
            b.name ||
            b.formattedName ||
            b.user ||
            b.FullName ||
            ""
          ).toLowerCase();
          return nameA.localeCompare(nameB);
        });
        console.log(`A-Z sort: ${filtered.length} items sorted`);
        break;

      case "Alphabetical (Z-A)":
        filtered.sort((a, b) => {
          const nameA = (
            a.name ||
            a.formattedName ||
            a.user ||
            a.FullName ||
            ""
          ).toLowerCase();
          const nameB = (
            b.name ||
            b.formattedName ||
            b.user ||
            b.FullName ||
            ""
          ).toLowerCase();
          return nameB.localeCompare(nameA);
        });
        console.log(`Z-A sort: ${filtered.length} items sorted`);
        break;
    }

    console.log(
      `useSort - Output: ${filtered.length} items after filtering/sorting`
    );
    return filtered;
  }, [data, sortOption]);
}
