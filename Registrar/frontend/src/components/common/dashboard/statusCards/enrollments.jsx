import React, { useState, useEffect } from "react";
import { Users } from "lucide-react";
import { HOST_IP } from "../../../../../config";
const API_BASE =
  `http://${HOST_IP}/SMS-GCA-3H/Registrar/backend/api/dashboard/enrollments.php`;

const Enrollments = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [count, setCount] = useState("...");

  useEffect(() => {
    setIsVisible(true);

    const evtSource = new EventSource(API_BASE);

    evtSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setCount(data.active_enrollments ?? 0);
      console.log("Live active enrollments:", data.active_enrollments);
    };

    evtSource.onerror = () => {
      console.error("SSE connection error");
      evtSource.close();
    };

    return () => evtSource.close(); // cleanup
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
          Enrolled Students
        </span>
        <span className="text-black dark:text-white text-2xl font-extrabold">
          {count}
        </span>
      </div>

      <div
        className="w-11 h-11 rounded-lg flex items-center justify-center
        bg-[#F3D67D] dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-inner"
      >
        <Users size={26} />
      </div>
    </div>
  );
};

export default Enrollments;
