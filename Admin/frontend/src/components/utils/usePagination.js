// usePagination.js - Enhanced with better responsive styles
import { useState, useMemo } from "react";

const usePagination = (data, initialItemsPerPage = 5) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  const totalPages = useMemo(() => {
    return Math.ceil(data.length / itemsPerPage);
  }, [data.length, itemsPerPage]);

  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage]);

  const goToPage = (page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  const updateItemsPerPage = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Enhanced responsive styles based on items per page
  const getResponsiveStyles = () => {
    if (itemsPerPage <= 7) {
      return {
        padding: "py-4",
        fontSize: "text-sm",
        avatarSize: "w-6 h-6",
        avatarText: "text-xs",
        rowHeight: "min-h-[60px]",
      };
    } else if (itemsPerPage <= 10) {
      return {
        padding: "py-2.5",
        fontSize: "text-sm",
        avatarSize: "w-7 h-7",
        avatarText: "text-xs",
        rowHeight: "min-h-[50px]",
      };
    } else if (itemsPerPage <= 12) {
      return {
        padding: "py-1.5",
        fontSize: "text-xs",
        avatarSize: "w-6 h-6",
        avatarText: "text-[10px]",
        rowHeight: "min-h-[45px]",
      };
    } else {
      return {
        padding: "py-.5",
        fontSize: "text-xs",
        avatarSize: "w-4 h-4",
        avatarText: "text-[10px]",
        rowHeight: "min-h-[40px]",
      };
    }
  };

  return {
    currentData,
    currentPage,
    totalPages,
    itemsPerPage,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    updateItemsPerPage,
    getResponsiveStyles,
  };
};

export default usePagination;
