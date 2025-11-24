import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import "../assets/css/layout.css";

export default function Layout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const handleSidebarToggle = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`flex min-h-screen ${isDarkMode ? "dark" : ""}`}>
      {/* Sidebar */}
      <Sidebar
        onToggle={handleSidebarToggle}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Main Content */}
      <main
        className={`main-content ${
          isSidebarCollapsed ? "sidebar-collapsed" : ""
        } ${isDarkMode ? "dark-mode" : ""}`}
      >
        <Outlet context={{ isDarkMode, toggleDarkMode }} />
      </main>
    </div>
  );
}
