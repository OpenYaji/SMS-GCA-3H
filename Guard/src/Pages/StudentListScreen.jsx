import React, { useState, useEffect, useMemo } from 'react';
import ChevronDown from '../Components/ChevronDown.jsx';
import Search from '../Components/Search.jsx';

const StudentListScreen = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:5174/api/student-log');
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorText}`);
        }
        const data = await response.json();
        setStudents(data);
      } catch (err) {
        console.error("Fetch error:", err.message);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filtered = useMemo(() => {
    if (!searchTerm) return students;
    const lower = searchTerm.toLowerCase();
    return students.filter(s => s.user && s.user.toLowerCase().startsWith(lower));
  }, [students, searchTerm]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  if (isLoading) {
    return (
      <div className="text-center p-20 text-stone-500">
        <p className="text-2xl font-bold">Loading......</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-700 bg-red-100 border-2 border-red-300 rounded-xl">
        <p className="text-xl font-bold mb-2">Error Loading Data!</p>
        <p className="text-sm">Details: {error}</p>
        <p className="mt-2 text-sm">Action: 
          1. Ensure your MySQL database is running. 
          2. Ensure your Node.js server (`server.js`) is running and shows "listening on port 5174".
        </p>
      </div>
    );
  }

  if (filtered.length === 0 && students.length > 0) {
    return (
      <div className="text-center p-8 text-stone-700 bg-stone-100 border-2 border-stone-300 rounded-xl">
        <p className="text-xl font-bold mb-2">No Students Found Matching "{searchTerm}"</p>
        <p className="text-sm">Please clear the search filter or try a different name.</p>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="text-center p-8 text-stone-700 bg-stone-100 border-2 border-stone-300 rounded-xl">
        <p className="text-xl font-bold mb-2">No Students Found</p>
        <p className="text-sm">The database query returned no records.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-0">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-stone-900">Student List</h1>
      </div>

      <div className="flex mb-8 w-full max-w-lg">
        <div className="relative flex items-center bg-white border border-stone-300 rounded-lg shadow-sm w-full">
          <button className="flex items-center px-4 py-3 text-stone-700 font-medium whitespace-nowrap focus:outline-none">
            Filter 
            <ChevronDown className="w-4 h-4 ml-2 text-stone-500" />
          </button>
          <div className="h-full w-px bg-stone-300 mx-2"></div>
          <div className="flex items-center flex-1">
            <Search className="w-5 h-5 ml-4 text-stone-400" />
            <input 
              type="text"
              placeholder="Search Student Name"
              className="flex-1 p-3 text-stone-800 placeholder-stone-400 focus:outline-none rounded-r-lg"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-x-auto">
        <div className="grid grid-cols-4 text-left font-bold text-stone-900 bg-amber-300 p-4 rounded-t-2xl min-w-[500px]">
          <div className='col-span-1'>ID</div>
          <div className="col-span-1">Student Name</div>
          <div className="col-span-1">Section/Grade</div>
        </div>

        {filtered.map((student, index) => (
          <div 
            key={student.id || index} 
            className={`grid grid-cols-4 items-center p-4 border-b border-stone-200 last:border-b-0 min-w-[500px] ${index % 2 === 1 ? 'bg-white' : 'bg-stone-50'} hover:bg-amber-50 transition-colors`} 
          >
            <div className="col-span-1 text-stone-800 font-medium">{student.id ?? 'N/A'}</div>
            <div className="col-span-1 text-stone-800 font-medium">{student.user || 'N/A'}</div>
            <div className="col-span-1 text-stone-600">{student.section || 'N/A'}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentListScreen;
