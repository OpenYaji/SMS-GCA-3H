// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import AdminDashboard from "./pages/AdminDashboard";
import ManageUsers from "./pages/ManageUsers";
import ManageGradeLevels from "./pages/ManageGradeLevelsPage";
import ScheduleConfirmations from "./pages/ScheduleConfirmation";
import Announcements from "./pages/Announcements";
import Profile from "./pages/Profile";
import TransactionsHistory from "./pages/TransactionsHistory";

export default function App() {
  return (
    <Routes>
      {/* All routes under Layout will share Sidebar */}
      <Route path="/" element={<Layout />}>
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/manage-users" element={<ManageUsers />} />
        <Route path="/manage-grade-levels" element={<ManageGradeLevels />} />
        <Route
          path="/schedule-confirmations"
          element={<ScheduleConfirmations />}
        />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/transactions-history" element={<TransactionsHistory />} />
        {/* <Route path="settings" element={<Settings />} /> */}
      </Route>
    </Routes>
  );
}
