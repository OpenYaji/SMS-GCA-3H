import { useMemo } from "react";

const useSortCards = (data, sortOption) => {
  return useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    const sortedData = [...data];

    switch (sortOption) {
      case "name-asc":
        return sortedData.sort((a, b) =>
          (a.name || "").localeCompare(b.name || "")
        );

      case "name-desc":
        return sortedData.sort((a, b) =>
          (b.name || "").localeCompare(a.name || "")
        );

      case "date-newest":
        return sortedData.sort(
          (a, b) =>
            new Date(b.dateProposed || b.dateSubmitted || 0) -
            new Date(a.dateProposed || a.dateSubmitted || 0)
        );

      case "date-oldest":
        return sortedData.sort(
          (a, b) =>
            new Date(a.dateProposed || a.dateSubmitted || 0) -
            new Date(b.dateProposed || b.dateSubmitted || 0)
        );

      case "position-asc":
        return sortedData.sort((a, b) =>
          (a.position || "").localeCompare(b.position || "")
        );

      case "position-desc":
        return sortedData.sort((a, b) =>
          (b.position || "").localeCompare(a.position || "")
        );

      case "all":
      default:
        // Default sort by most recent first
        return sortedData.sort(
          (a, b) =>
            new Date(b.dateProposed || b.dateSubmitted || 0) -
            new Date(a.dateProposed || a.dateSubmitted || 0)
        );
    }
  }, [data, sortOption]);
};

export default useSortCards;
