import React, { useState, useEffect } from "react";
import { CreditCard } from "lucide-react";
import { HOST_IP } from "../../../../../config";

const API_BASE = `http://${HOST_IP}/SMS-GCA-3H/Registrar/backend/api/financial-holds/getFinancialHolds.php`;

const Financial = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [count, setCount] = useState("...");

  useEffect(() => {
    setIsVisible(true);

    const fetchFinancialHolds = async () => {
      try {
        const response = await fetch(API_BASE);
        const data = await response.json();
        
        if (data.success) {
          setCount(data.stats?.activeHolds ?? 0);
          console.log("Live financial holds:", data.stats?.activeHolds);
        } else {
          console.error("API error:", data.message);
          setCount(0);
        }
      } catch (error) {
        console.error("Error fetching financial holds:", error);
        setCount(0);
      }
    };

    fetchFinancialHolds();
    const interval = setInterval(fetchFinancialHolds, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`relative group flex justify-between items-center 
        bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 
        rounded-lg p-4 shadow-md flex-1 min-w-[220px] cursor-pointer 
        transition-all duration-700 ease-out transform
        ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"}
        hover:-translate-y-1 hover:scale-105 hover:shadow-lg active:scale-100`}
    >
      <div className="flex flex-col">
        <span className="text-black dark:text-white text-sm font-semibold">
          Financial Holds
        </span>
        <span className="text-black dark:text-white text-2xl font-extrabold">
          {count}
        </span>
      </div>

      <div className="w-11 h-11 rounded-lg flex items-center justify-center
        bg-[#F3D67D] dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-inner">
        <CreditCard size={26} />
      </div>
    </div>
  );
};

export default Financial;
