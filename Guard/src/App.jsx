import React, { useState, useEffect, useCallback, useMemo } from 'react';
import jsQR from 'jsqr';
import LogOut from './Components/LogOut.jsx';


// NEW: imported the extracted components
import NavItem from './Components/NavItem.jsx';
import { MOCK_SCHEDULE, MOCK_NOTIFICATIONS, MOCK_ANNOUNCEMENTS, MOCK_PROFILE_DATA, NAV_ITEMS } from  './Constants.jsx';

// NEW: import Pages + moved Widgets
import DashboardScreen from './Pages/DashboardScreen.jsx';
import ProfileScreen from './Pages/ProfileScreen.jsx';
import StudentLogScreen from './Pages/StudentLogScreen.jsx';
import QrScannerScreen from './Pages/QrScannerScreen.jsx';
import StudentListScreen from './Pages/StudentListScreen.jsx';


// NEW: Extracted the mapping logic from ProfileScreen for App component use
const mapToDisplayData = (data) => {
    // This logic needs to be robust for missing data
    const nameParts = [data.fname, data.middle_name, data.last_name].filter(Boolean);
    return {
        fullName: nameParts.length > 0 ? nameParts.join(' ') : '',
        // ONLY return the pieces you need, like fname
        fname: data.fname || '', // <-- We need this
        // ... other fields not strictly needed here
    };
};

const GUARD_EMPLOYEE_ID = 'employee_id'; // Placeholder ID for the currently logged-in user

// --- MAIN APP COMPONENT ---

const App = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    // NEW STATE: Store the fetched profile data
    const [profileData, setProfileData] = useState({ fname: 'Loading...' }); // Default state

    // --- Data Fetching Logic (Copied/Modified from ProfileScreen) ---
    const fetchEmployeeProfile = async () => {
        if (!GUARD_EMPLOYEE_ID) return;

        try {
            const response = await fetch(`http://localhost:5174/api/profile/${GUARD_EMPLOYEE_ID}`);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();

            const mappedData = mapToDisplayData(data);
            setProfileData(mappedData);
        } catch (err) {
            console.error("Fetch profile error in App:", err.message);
            setProfileData({ fname: 'Guard' }); // Fallback on error
        }
    };

    useEffect(() => {
        fetchEmployeeProfile();
    }, []); // Run once on mount

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <>
            <header className="bg-amber-200/50 p-6 rounded-2xl flex justify-between items-center mb-10 shadow-inner">
              <div>
                <h1 className="text-3xl font-extrabold text-stone-900">Welcome back,</h1>
                {/* MODIFIED: Use the fetched first name */}
                <h2 className="text-2xl font-semibold text-stone-800">{profileData.fname}</h2>
              </div>
              <div className='hidden sm:block'>
                <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center border-2 border-stone-800 shadow-md">
                  <span className="text-sm font-black text-stone-800 p-1 text-center">LOGO</span>
                </div>
              </div>
            </header>
            <DashboardScreen />
          </>
        );
      case 'My Profile':
        return <ProfileScreen />;
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

  return (
    <div className="flex h-screen bg-stone-50 text-stone-900 font-sans">
      <button
        className="lg:hidden absolute top-4 left-4 z-50 p-2 rounded-lg bg-stone-800 text-white"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      <div className={`
        fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out
        w-64 lg:w-64 h-250 bg-stone-800 shadow-2xl p-5 flex flex-col z-40 rounded-r-3xl
      `}>
        <div className="flex flex-col items-center py-6">
          <div className="w-24 h-24 rounded-full bg-yellow-400 flex items-center justify-center border-2 border-amber-300 overflow-hidden shadow-inner">
            <span className="text-xl font-black text-stone-800 p-1 text-center">LOGO</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-3 text-center">GYMNAZO CHRISTIAN ACADEMY</h1>
          
        </div>

        <nav className="flex-1 mt-8 space-y-2 ">
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

      <main className="flex-1 p-4 lg:p-8 bg-amber-50 rounded-l-3xl overflow-y-auto"> 
        {renderContent()}
      </main>
    </div>
  );
};

export default App;