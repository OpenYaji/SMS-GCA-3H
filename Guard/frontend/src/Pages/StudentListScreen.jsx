import React, { useState, useEffect, useMemo } from 'react';
import ChevronDown from '../Components/ChevronDown.jsx';
import Search from '../Components/Search.jsx';


// --- Icon Components (Missing Dependencies) ---
// --- Main Application Component ---

const App = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // NOTE: The URL below targets your provided PHP script endpoint
  const API_URL = 'http://localhost:5174/server/server.php/student-log';

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorText}`);
        }
        
        const data = await response.json();
        
        // Ensure data is an array before setting state
        if (Array.isArray(data)) {
            setStudents(data);
        } else {
            // Handle case where API returns a non-array response (e.g., just an error object)
            throw new Error(`Invalid data format received. Expected array, got ${typeof data}.`);
        }
        
      } catch (err) {
        console.error("Fetch error:", err.message);
        // Use a more user-friendly error message for the display
        setError(`Failed to connect or retrieve data. (${err.message.substring(0, 100)}...)`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filtered = useMemo(() => {
    if (!searchTerm) return students;
    const lower = searchTerm.toLowerCase();
    
    // Filtering based on the 'user' field (Student Name)
    return students.filter(s => 
      s.UserID && typeof s.UserID === 'string' && s.UserID.toLowerCase().startsWith(lower)
    );
  }, [students, searchTerm]); 

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  // --- Render States ---

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-stone-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-500"></div>
        <p className="ml-4 text-xl font-semibold text-stone-500">Loading Student Data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-xl mx-auto mt-10 bg-white shadow-2xl rounded-xl">
        <div className="text-center text-red-700 bg-red-50 border-2 border-red-300 rounded-xl p-6">
          <p className="text-2xl font-extrabold mb-4">API Connection Error</p>
          <p className="text-sm font-mono break-all mb-4">
            {error}
          </p>
          <div className="text-left text-sm mt-4 p-3 bg-red-100 rounded">
            <p className="font-bold text-red-900 mb-1">Troubleshooting Steps:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Ensure your MySQL database is running.</li>
              <li>Ensure your Node.js server (`server.js`) is running and accessible at `http://localhost:5174`.</li>
              <li>Verify the PHP script (`server.php`) is correctly configured and working.</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="p-8 max-w-xl mx-auto mt-10">
        <div className="text-center text-stone-700 bg-stone-100 border-2 border-stone-300 rounded-xl p-6">
          <p className="text-2xl font-bold mb-2">No Students Found in Database</p>
          <p className="text-md">The API query executed successfully but returned zero records from the `user_info` table.</p>
        </div>
      </div>
    );
  }
  
  if (filtered.length === 0 && students.length > 0) {
    return (
      <div className="p-8 max-w-xl mx-auto mt-10">
        <div className="text-center text-stone-700 bg-stone-100 border-2 border-stone-300 rounded-xl p-6">
          <p className="text-2xl font-bold mb-2">No Students Match "{searchTerm}"</p>
          <button 
            onClick={() => setSearchTerm('')} 
            className="mt-4 px-4 py-2 bg-amber-500 text-white font-semibold rounded-lg shadow hover:bg-amber-600 transition-colors"
          >
            Clear Search Filter
          </button>
        </div>
      </div>
    );
  }

  // --- Main Render ---
  
  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto font-[Inter] min-h-screen bg-stone-50">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-stone-900 border-b-4 border-amber-400 pb-1">
          Student List
        </h1>
      </div>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 w-full">
        {/* Search Bar Container */}
        <div className="w-full md:max-w-lg mb-4 md:mb-0">
          <div className="relative flex items-center bg-white border-2 border-stone-200 rounded-xl shadow-lg w-full transition-shadow duration-300 hover:shadow-amber-200">
            {/* Filter Button (Decorative/Placeholder) */}
            <button className="hidden sm:flex items-center px-4 py-3 text-stone-600 font-medium whitespace-nowrap focus:outline-none border-r border-stone-200 hover:bg-stone-50 rounded-l-xl transition-colors">
              Filter By 
              <ChevronDown className="w-4 h-4 ml-2 text-stone-500" />
            </button>
            
            {/* Search Input */}
            <div className="flex items-center flex-1">
              <Search className="w-6 h-6 ml-4 text-amber-500" />
              <input 
                type="text"
                placeholder="Search Student Name..."
                className="flex-1 p-3 text-stone-800 placeholder-stone-400 focus:outline-none rounded-r-xl bg-transparent"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
        
        {/* Student Count Badge */}
        <div className="text-lg font-semibold text-stone-600 bg-white border border-stone-300 px-4 py-2 rounded-lg shadow-md">
            Total Students: <span className="text-amber-600 ml-1">{students.length}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden ring-1 ring-stone-200">
        
        {/* Table Header */}
        <div className="grid grid-cols-3 text-left font-extrabold text-stone-900 bg-amber-400 p-4 min-w-[500px] sticky top-0 z-10">
          <div className='col-span-1'>ID</div>
          <div className="col-span-1">Student Name</div>
          <div className="col-span-1">Section/Grade</div>
          <div className="col-span-1"></div> {/* For future actions */}
        </div>

        {/* Table Body */}
        <div className="max-h-[60vh] overflow-y-auto">
            {filtered.map((student, index) => (
                <div 
                    key={student.id || index} 
                    className={`grid grid-cols-3 items-center p-4 border-b border-stone-300 last:border-b-0 min-w-[500px] ${index % 2 === 1 ? 'bg-white' : 'bg-stone-50'} hover:bg-amber-50 transition-colors`} 
                >
                    <div className="col-span-1 text-stone-800 font-mono text-sm">{student.UserID ?? 'N/A'}</div>
                    <div className="col-span-1 text-stone-900 font-semibold truncate">{student.FirstName || 'N/A'}</div>
                    <div className="col-span-1 text-stone-600 font-medium">{student.Gender || 'N/A'}</div>
                    {/* <div className="col-span-1 text-right">
                         <button className="text-amber-600 hover:text-amber-800 font-semibold text-sm transition-colors">
                            View Profile
                        </button>
                    </div> */}
                </div>
            ))}
            {filtered.length === 0 && (
                 <div className="p-12 text-center text-stone-500">
                    <p className="text-xl">No results.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default App;