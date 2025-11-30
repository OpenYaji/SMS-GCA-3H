// App.jsx
import React, { useState, useEffect } from 'react';
import jsQR from 'jsqr'; 
import Logo1 from './logo/logo1.png';
import LogOut from './Components/LogOut.jsx';

import NavItem from './Components/NavItem.jsx';
import {
  // MOCK_SCHEDULE, MOCK_NOTIFICATIONS, MOCK_ANNOUNCEMENTS, MOCK_PROFILE_DATA,
  NAV_ITEMS,
} from './Constants.jsx';

// Page Components
import DashboardScreen from './Pages/DashboardScreen.jsx';
import ProfileScreen from './Pages/ProfileScreen.jsx';
import StudentLogScreen from './Pages/StudentLogScreen.jsx';
import QrScannerScreen from './Pages/QrScannerScreen.jsx';
import StudentListScreen from './Pages/StudentListScreen.jsx';


// --- Configuration and Utility Functions ---

/**
 * Maps database data structure to a front-end readable profile object.
 */
const mapToDisplayData = (data) => {
  // NOTE: data_EmployeeNumber seems like a typo, using data.EmployeeNumber if available.
  const employeeIdToUse = data.EmployeeNumber || ''; 
  const nameParts = [data.fname, data.middle_name, data.last_name, employeeIdToUse].filter(Boolean);

  return {
    fullName: nameParts.length > 0 ? nameParts.join(' ') : '',
    fname: data.fname || '',
    // Include all necessary fields from the DB here
    ...data,
  };
};

// SET CORRECT ID FROM YOUR DATABASE
// This is the variable you defined to hold the ID: GUARD_EmployeeNumber
const GUARD_EmployeeNumber = 'EMP-0001'; 


// --- Main Application Component ---

const App = () => {
  const [activeTab, setActiveTab] = useState('QR Code Scanner');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Initial state reflects a loading status
  const [profileData, setProfileData] = useState({ fname: 'Loading...' });

  /**
   * Fetches the employee/guard profile data from the backend API.
   */
  const fetchEmployeeProfile = async () => {
    // 🎯 FIX APPLIED HERE: Use GUARD_EmployeeNumber instead of the undefined variable EmployeeNumber
    const apiUrl = `http://localhost:5174/server/server.php/profile/${GUARD_EmployeeNumber}`; 

    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        // Throw an error with the response status text for better debugging
        throw new Error(`Cannot load profile. Status: ${response.statusText}`); 
      }

      const data = await response.json();
      const mapped = mapToDisplayData(data);
      setProfileData(mapped);

    } catch (err) {
      console.error('Fetch Error:', err);
      // Fallback state on error
      setProfileData({ fname: 'Unknown' }); 
    }
  };

  // Effect to fetch profile data on component mount
  useEffect(() => {
    fetchEmployeeProfile();
  }, []);

  /**
   * Renders the content component based on the currently active tab.
   */
  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <>
            <header className="bg-amber-200/50 p-6 rounded-2xl flex justify-between items-center mb-10 shadow-inner">
              <div>
                <h1 className="text-3xl font-extrabold text-stone-900">Welcome back,</h1>
                <h2 className="text-2xl font-semibold text-stone-800">{profileData.fname}</h2>
              </div>

              <div className="hidden sm:block">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-amber-300 shadow-inner">
  <img 
    src={Logo1} 
    alt="School Logo" 
    className="w-full h-full object-cover"
  />
</div>
              </div>
            </header>
            <DashboardScreen />
          </>
        );

      case 'My Profile':
        return <ProfileScreen profileData={profileData} />; // Assuming ProfileScreen needs data
      case 'Student Log':
        return <StudentLogScreen />;
      case 'Student List':
        return <StudentListScreen />;
      case 'QR Code Scanner':
        return <QrScannerScreen />;
      default:
        return (
          <div className="text-center p-20 text-stone-500">
            <h1 className="text-2xl font-bold">Content for "{activeTab}" is not yet implemented.</h1>
          </div>
        );
    }
  };

  // --- JSX Render ---
  return (
    <div className="flex h-screen bg-stone-50 text-stone-900 font-sans">

      {/* Mobile Sidebar Button */}
      <button
        className="lg:hidden absolute top-4 left-4 z-50 p-2 rounded-lg bg-stone-800 text-white"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>

      {/* Sidebar Navigation */}
      <div
        className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out
          w-64 lg:w-64 bg-stone-800 shadow-2xl p-5 flex flex-col z-40 rounded-r-3xl
        `}
      >
        <div className="flex flex-col items-center py-6">
          <div className="w-24 h-24 rounded-full bg-yellow-400 flex items-center justify-center border-2 border-amber-300 overflow-hidden shadow-inner">
           <img 
    src={Logo1} 
    alt="School Logo" 
    className="w-full h-full object-cover"
  />
          </div>

          <h1 className="text-xl font-bold text-white mt-3 text-center">GYMNAZO CHRISTIAN ACADEMY</h1>
        </div>

        <nav className="flex-1 mt-8 space-y-2">
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.name}
              name={item.name}
              Icon={item.icon}
              active={activeTab === item.name}
              onClick={setActiveTab}
            />
          ))}
        </nav>

        <div className="py-4 border-t border-stone-700">
          <button
            className="flex items-center p-3 mx-4 text-sm font-medium rounded-xl text-red-400 hover:bg-stone-700 hover:text-red-300 transition-colors w-full"
            onClick={() => console.log('Logging out...')}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-4 lg:p-8 bg-amber-50 rounded-l-3xl overflow-y-auto">
        {renderContent()}
      </main>

    </div>
  );
};

export default App;