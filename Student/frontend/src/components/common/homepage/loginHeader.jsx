import  { useState, useEffect } from 'react';
import Logo from '../../../assets/img/gymnazu.png';
import { Link } from 'react-router-dom'; 

const LoginHeader = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <header className='w-full shadow-md sticky top-0 z-50'>
      <div className='flex justify-between items-center h-16 sm:h-20 bg-gray-100 dark:bg-gray-800 px-4 sm:px-0 transition-colors duration-300'>
        <div className='flex items-center'>
          <Link to="/"> 
            <img 
              src={Logo} 
              alt='Gymnazo' 
              className='h-10 w-10 sm:h-14 sm:w-14 sm:ml-7 border-[#5B3E31] dark:border-amber-400 border-2 rounded-full'
            />
          </Link>
          <div className='ml-2 sm:ml-4 text-[#5B3E31] dark:text-amber-400 transition-colors duration-300'>
            <div className='font-bold text-xs sm:text-base'>GYMNAZO CHRISTIAN ACADEMY</div>
            <div className='text-[10px] sm:text-sm'>NOVALICHES</div>
          </div>
        </div>
        <div className='flex items-center space-x-2 sm:space-x-6 sm:mr-10'> 
          
          <button
            onClick={toggleDarkMode}
            className="relative w-8 h-8 rounded-full bg-white dark:bg-gray-700 border border-[#5B3E31] dark:border-amber-400 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-sm"
            aria-label="Toggle dark mode"
          >
            <svg
              className={`absolute w-4 h-4 text-orange-500 transition-all duration-300 ${
                isDarkMode ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
              }`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12,17c-2.76,0-5-2.24-5-5s2.24-5,5-5,5,2.24,5,5-2.24,5-5,5ZM13,0h-2V5h2V0Zm0,19h-2v5h2v-5ZM5,11H0v2H5v-2Zm19,0h-5v2h5v-2Zm-2.81-6.78l-1.41-1.41-3.54,3.54,1.41,1.41,3.54-3.54ZM7.76,17.66l-1.41-1.41-3.54,3.54,1.41,1.41,3.54-3.54Zm0-11.31l-3.54-3.54-1.41,1.41,3.54,3.54,1.41-1.41Zm13.44,13.44l-3.54-3.54-1.41,1.41,3.54,3.54,1.41-1.41Z" />
            </svg>

            <svg
              className={`absolute w-4 h-4 text-amber-400 transition-all duration-300 ${
                isDarkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
              }`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12.009,24A12.067,12.067,0,0,1,.075,10.725,12.121,12.121,0,0,1,10.1.152a13,13,0,0,1,5.03.206,2.5,2.5,0,0,1,1.8,1.8,2.47,2.47,0,0,1-.7,2.425c-4.559,4.168-4.165,10.645.807,14.412h0a2.5,2.5,0,0,1-.7,4.319A13.875,13.875,0,0,1,12.009,24Zm.074-22a10.776,10.776,0,0,0-1.675.127,10.1,10.1,0,0,0-8.344,8.8A9.928,9.928,0,0,0,4.581,18.7a10.473,10.473,0,0,0,11.093,2.734.5.5,0,0,0,.138-.856h0C9.883,16.1,9.417,8.087,14.865,3.124a.459.459,0,0,0,.127-.465.491.491,0,0,0-.356-.362A10.68,10.68,0,0,0,12.083,2Z" />
            </svg>
          </button>
          <Link to="/admission">
          <button className='bg-[#F4D77D] dark:bg-amber-500 hover:bg-amber-300 dark:hover:bg-amber-400 text-black font-bold py-2 px-4 border-2 border-[#5B3E31] dark:border-amber-600 rounded-full shadow-3xl text-xs sm:text-sm transition-colors duration-300'>
            ENROLL
          </button>
          </Link>
        </div>
      </div>
      <div className='h-8 sm:h-8 bg-[#F4D77D] dark:bg-gray-700 flex items-center justify-center py-2 transition-colors duration-300'>
        <h1 className='text-center text-sm sm:text-base md:text-lg lg:text-xl font-bold text-[#5B3E31] dark:text-amber-400 px-4 transition-colors duration-300'>
            STUDENT PORTAL LOGIN
        </h1>
      </div>
    </header>
  )
}

export default LoginHeader;