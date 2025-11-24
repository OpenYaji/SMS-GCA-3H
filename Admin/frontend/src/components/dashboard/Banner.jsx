import React from "react";
export default function Banner({ darkMode, onToggleDarkMode }) {
  const bannerStyle = darkMode
    ? { background: "linear-gradient(135deg, #374151 0%, #1f2937 100%)" }
    : { background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)" };

  const buttonStyle = darkMode
    ? { background: "#374151", color: "#f9fafb" }
    : { background: "#ffffff", color: "#1f2937" };

  return (
    <div className="rounded-3xl px-8 py-3 mb-6 shadow-md" style={bannerStyle}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-spartan text-[2.5em] font-extrabold text-white mb-[0px] [text-shadow:5px_1px_2px_rgba(0,0,0,0.3)]">
            Welcome Back Admin!
          </h1>
          <p className="text-white font-regular font-spartan text-[1.1em]">
            Here is what's happening at Gymnazo Christian Academy - Novaliches
            now
          </p>
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={onToggleDarkMode}
          className="p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          style={buttonStyle}
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
