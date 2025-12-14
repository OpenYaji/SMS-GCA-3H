TotalTuitionCollected.jsx

import React, { useState, useEffect } from "react";
import { PhilippinePeso } from "lucide-react"; // Changed icon to DollarSign
import { HOST_IP } from "../../../../../config";

// Assume this is the new API endpoint for total collection
const LIVE_API = `http://${HOST_IP}/SMS-GCA-3H/Registrar/backend/api/dashboard/total_collection.php`; 

const TotalTuitionCollected = () => {
  const [isVisible, setIsVisible] = useState(false);
  // Use null or initial loading state for the amount
  const [totalAmount, setTotalAmount] = useState(null);

  useEffect(() => {
    setIsVisible(true);

    const evtSource = new EventSource(LIVE_API);

    evtSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Update the state with the total collected amount
      setTotalAmount(data.total_collected ?? 0);
      console.log("Live total collection:", data.total_collected);
    };

    evtSource.onerror = () => {
      console.error("SSE connection error for total collection");
      evtSource.close();
      // Optionally set a static error value
      setTotalAmount("Error");
    };

    return () => evtSource.close();
  }, []);

  // Function to format the amount as currency (e.g., ₱ 1,234,567.89)
  const formatCurrency = (amount) => {
    if (amount === null) return "...";
    if (amount === "Error") return "0";

    return new Intl.NumberFormat('en-PH', { 
      style: 'currency', 
      currency: 'PHP',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div
      className={`relative group flex justify-between items-center 
        bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 
        rounded-lg p-4 shadow-md flex-1 min-w-[220px] cursor-pointer 
        transition-all duration-700 ease-out transform
        ${isVisible ? "opacity-100 scale-100 translate-x-0" : "opacity-0 scale-90 translate-x-16"}
        hover:-translate-y-1 hover:scale-105 hover:shadow-lg active:scale-100`}
    >
      <div className="flex flex-col">
        <span className="text-black dark:text-white text-sm font-semibold">
          Total Collections
        </span>
        <span className="text-black dark:text-white text-2xl font-extrabold">
          {formatCurrency(totalAmount)}
        </span>
      </div>

      <div
        className="w-11 h-11 rounded-lg flex items-center justify-center
        bg-[#6EE7B7] dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-inner" // Changed color for tuition
      >
        <PhilippinePeso size={26} />
      </div>
    </div>
  );
};

export default TotalTuitionCollected;