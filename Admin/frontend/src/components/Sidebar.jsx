import { NavLink } from "react-router-dom";
import { useState } from "react";
import "../assets/css/dashboard.css";
import logo from "../assets/images/logo1.png";
import { logoutService } from "../services/logoutService";

const Sidebar = ({ onToggle, isDarkMode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);

    if (onToggle) {
      onToggle(newCollapsedState);
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();

    // Optional: Add confirmation dialog
    if (window.confirm("Are you sure you want to logout?")) {
      try {
        await logoutService.logout();
      } catch (error) {
        console.error("Logout failed:", error);
        // Fallback redirect in case of error
        window.location.href = "http://localhost:5173/login";
      }
    }
  };

  const navItems = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      ),
    },
    {
      to: "/manage-users",
      label: "Manage Users",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
    },
    {
      to: "/manage-grade-levels",
      label: "Manage Grade Levels",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 512 512"
        >
          <path
            fill="currentColor"
            d="M128 496H48V304h80Zm224 0h-80V208h80Zm112 0h-80V96h80Zm-224 0h-80V16h80Z"
          />
        </svg>
      ),
    },
    {
      to: "/schedule-confirmations",
      label: "Schedule Confirmations",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      ),
    },
    {
      to: "/transactions-history",
      label: "Transactions History",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <g
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          >
            <path d="M15.093 12.343a2.43 2.43 0 0 0 2.031.956c1.244 0 2.254-.757 2.254-1.691s-1.01-1.69-2.254-1.69s-2.255-.758-2.255-1.692s1.01-1.691 2.255-1.691a2.43 2.43 0 0 1 2.031.956M17.124 13.3v1.126m0-9.018v1.127" />
            <path d="M20.354 2.25H3.646A2.646 2.646 0 0 0 1 4.896v10.708a2.646 2.646 0 0 0 2.646 2.646h16.708A2.646 2.646 0 0 0 23 15.604V4.896a2.646 2.646 0 0 0-2.646-2.646M12 18.25v3.5m-5 0h10M4.622 6.689h6.012m-6.012 3.826h6.012m-6.012 3.826h3.006" />
          </g>
        </svg>
      ),
    },
    {
      to: "/announcements",
      label: "Announcements",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
      ),
    },
    {
      to: "/profile",
      label: "Profile & Activities",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M4 21v-2a4 4 0 0 1 3-3.87" />
          <circle cx="12" cy="6" r="4" />
        </svg>
      ),
    },
  ];

  return (
    <div
      className={`sidebar ${isCollapsed ? "collapsed" : ""} ${
        isDarkMode ? "dark-mode" : ""
      }`}
    >
      <div className="logo-section">
        <center>
          {/* Clickable Logo */}
          <div className="logo clickable" onClick={toggleSidebar}>
            <img src={logo} alt="Institution Logo" />
            {/* Collapse/Expand Indicator */}
            <div className="collapse-indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </div>
          </div>
          <br />
          <div className="school-name">
            Gymnazo Christian
            <br />
            Academy Novaliches
          </div>
        </center>
      </div>

      <ul className="nav-menu">
        {navItems.map((item, index) => (
          <li key={index} className="nav-item">
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              data-tooltip={isCollapsed ? item.label : ""}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <a
        href="#"
        className="logout-btn"
        onClick={handleLogout}
        data-tooltip={isCollapsed ? "Logout" : ""}
      >
        <span className="logout-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 512 512"
          >
            <path
              fill="currentColor"
              d="M160 256a16 16 0 0 1 16-16h144V136c0-32-33.79-56-64-56H104a56.06 56.06 0 0 0-56 56v240a56.06 56.06 0 0 0 56 56h160a56.06 56.06 0 0 0 56-56V272H176a16 16 0 0 1-16-16m299.31-11.31l-80-80a16 16 0 0 0-22.62 22.62L409.37 240H320v32h89.37l-52.68 52.69a16 16 0 1 0 22.62 22.62l80-80a16 16 0 0 0 0-22.62"
            />
          </svg>
        </span>
        <span className="logout-text">Logout</span>
      </a>
    </div>
  );
};

export default Sidebar;
