import React, { useEffect, useState } from "react";

const InboxHeader = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger animation after component mount
    setAnimate(true);
  }, []);

  return (
    <div className="flex items-center justify-between mb-4 relative">
      {/* Inline keyframes for both directions */}
      <style>
        {`
          @keyframes slideInLeft {
            0% {
              transform: translateX(-30px);
              opacity: 0;
            }
            100% {
              transform: translateX(0);
              opacity: 1;
            }
          }
          @keyframes slideInRight {
            0% {
              transform: translateX(30px);
              opacity: 0;
            }
            100% {
              transform: translateX(0);
              opacity: 1;
            }
          }
          .animate-slideInLeft {
            animation: slideInLeft 0.6s ease-out forwards;
          }
          .animate-slideInRight {
            animation: slideInRight 0.6s ease-out forwards;
          }
        `}
      </style>

      {/* Title */}
      <h2
        className={`text-xl font-bold text-black dark:text-white transition-all duration-500 
          ${animate ? "animate-slideInLeft" : "opacity-0"}`}
      >
        Pending Applications for Validation
      </h2>

      {/* Buttons */}
      <div
        className={`flex gap-2 transition-all duration-500 
          ${animate ? "animate-slideInRight" : "opacity-0"}`}
      >
      </div>
    </div>
  );
};

export default InboxHeader;
