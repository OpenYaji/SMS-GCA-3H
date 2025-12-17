import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, Sun, Moon, User, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import DefaultProfilePic from '../../assets/img/userdef.png';
import NotificationDropdown from './NotificationDropdown';

const Tooltip = ({ text }) => (
    <span className="
    absolute top-full left-1/2 -translate-x-1/2 mt-2
    bg-gray-900 text-white text-xs font-bold 
    rounded-md px-2 py-1 
    opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 
    transition-all duration-300 ease-in-out
    whitespace-nowrap z-50
  ">
        {text}
    </span>
);

const DashboardHeader = ({ setMobileOpen }) => {
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [openDropdown, setOpenDropdown] = useState(null);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);

    const profileRef = useRef(null);
    const searchRef = useRef(null);

    // Define searchable routes
    const searchableRoutes = [
        { name: 'Dashboard', path: '/student-dashboard', keywords: ['home', 'main', 'overview'] },
        { name: 'Academic', path: '/student-dashboard/academic', keywords: ['grades', 'subjects', 'studies'] },
        { name: 'Current Grades', path: '/student-dashboard/academic/current-grades', keywords: ['grades', 'current', 'marks'] },
        { name: 'Previous Grades', path: '/student-dashboard/academic/previous-grades', keywords: ['grades', 'previous', 'history', 'old'] },
        { name: 'Transaction', path: '/student-dashboard/transaction', keywords: ['payment', 'billing', 'finance'] },
        { name: 'Payment Portal', path: '/student-dashboard/transaction/payment-portal', keywords: ['pay', 'payment', 'portal'] },
        { name: 'Settings', path: '/student-dashboard/settings', keywords: ['preferences', 'configuration'] },
        { name: 'Help & Support', path: '/student-dashboard/help', keywords: ['help', 'support', 'assistance'] },
        { name: 'My Account', path: '/student-dashboard/my-account', keywords: ['profile', 'account', 'me'] },
        { name: 'Subjects', path: '/student-dashboard/subject', keywords: ['subjects', 'courses', 'classes'] },
        { name: 'Document Request', path: '/student-dashboard/document-request', keywords: ['document', 'request', 'forms'] },
        { name: 'Events', path: '/student-dashboard/events', keywords: ['events', 'calendar', 'activities'] },
        { name: 'Library', path: '/student-dashboard/library', keywords: ['library', 'books', 'resources'] },
        { name: 'Profile Settings', path: '/student-dashboard/profile-settings', keywords: ['profile', 'settings', 'edit'] },
        { name: 'Text Sundo', path: '/student-dashboard/text-sundo', keywords: ['escort', 'sundo', 'text', 'system'] }
    ];

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (openDropdown === 'profile' && profileRef.current && !profileRef.current.contains(event.target)) {
                setOpenDropdown(null);
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearchResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openDropdown]);

    // Handle search
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setSearchResults([]);
            setShowSearchResults(false);
            return;
        }

        const query = searchQuery.toLowerCase();
        const results = searchableRoutes.filter(route => {
            const nameMatch = route.name.toLowerCase().includes(query);
            const keywordMatch = route.keywords.some(keyword => keyword.includes(query));
            return nameMatch || keywordMatch;
        });

        setSearchResults(results);
        setShowSearchResults(results.length > 0);
    }, [searchQuery]);

    const handleSearchSelect = (path) => {
        navigate(path);
        setSearchQuery('');
        setShowSearchResults(false);
        setIsMobileSearchOpen(false);
    };

    const toggleDropdown = (dropdown) => {
        setOpenDropdown(openDropdown === dropdown ? null : dropdown);
    };

    const formattedDate = currentTime.toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
    });

    const formattedTime = currentTime.toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
    });

    if (!user) {
        return (
            <header className='sticky top-0 z-30 w-full bg-[#F9F9F9] dark:bg-slate-900 dark:border-b dark:border-slate-700 py-4 flex items-center justify-between animate-pulse'>
                <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/4 ml-6"></div>
                <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded w-1/4 mr-6"></div>
            </header>
        );
    }

    const getProfilePictureUrl = (profilePictureURL) => {
        if (!profilePictureURL) return DefaultProfilePic;
        // If it's already a full URL, return it
        if (profilePictureURL.startsWith('http')) return profilePictureURL;
        // Otherwise, construct the full URL
        return `http://localhost/SMS-GCA-3H/Student/backend/${profilePictureURL}`;
    };

    return (
        <header className='sticky top-0 z-30 w-full bg-[#F9F9F9] dark:bg-slate-900 dark:border-b dark:border-slate-700 py-4 flex items-center justify-between rounded-xl dark:rounded-none'>

            {/*Mobile Search View */}
            {isMobileSearchOpen && (
                <div className="absolute inset-0 bg-[#F9F9F9] dark:bg-slate-900 w-full flex items-center px-4 z-40 sm:hidden">
                    <button onClick={() => setIsMobileSearchOpen(false)} className="mr-2 text-gray-500 dark:text-gray-400">
                        <ArrowLeft size={24} />
                    </button>
                    <div className='relative flex-1' ref={searchRef}>
                        <input
                            type='text'
                            placeholder='Search pages...'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className='w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F3D67D]'
                            autoFocus
                        />
                        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-300' />

                        {showSearchResults && searchResults.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-700 rounded-lg shadow-xl border border-gray-200 dark:border-slate-600 max-h-64 overflow-y-auto">
                                {searchResults.map((result, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSearchSelect(result.path)}
                                        className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-slate-600 flex items-center justify-between group"
                                    >
                                        <span className="text-sm text-gray-700 dark:text-gray-300">{result.name}</span>
                                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-amber-500 transition-colors" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="flex items-center flex-1">
                <div className="relative group pl-6 md:hidden">
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="text-gray-500 dark:text-gray-400"
                        aria-label="Open sidebar"
                    >
                        <Menu size={24} />
                    </button>
                    <Tooltip text="Open menu" />
                </div>

                <div className='hidden sm:block flex-1 max-w-sm md:pl-6'>
                    <div className='relative' ref={searchRef}>
                        <input
                            type='text'
                            placeholder='Search pages...'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className='w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F3D67D]'
                        />
                        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-300' />

                        {showSearchResults && searchResults.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-700 rounded-lg shadow-xl border border-gray-200 dark:border-slate-600 max-h-64 overflow-y-auto z-50">
                                {searchResults.map((result, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSearchSelect(result.path)}
                                        className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-slate-600 flex items-center justify-between group"
                                    >
                                        <span className="text-sm text-gray-700 dark:text-gray-300">{result.name}</span>
                                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-amber-500 transition-colors" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className='flex items-center gap-4 ml-4 pr-6'>
                <div className='hidden sm:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
                    <span>{formattedDate}</span>
                    <span>-</span>
                    <span>{formattedTime}</span>
                </div>

                <div className="relative group sm:hidden">
                    <button onClick={() => setIsMobileSearchOpen(true)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                        <Search className='w-5 h-5 text-gray-600 dark:text-gray-400' />
                    </button>
                    <Tooltip text="Search" />
                </div>

                <div className="relative group">
                    <button onClick={toggleTheme} className='p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors'>
                        {theme === 'dark' ? <Sun className='w-5 h-5 text-yellow-400' /> : <Moon className='w-5 h-5 text-gray-600' />}
                    </button>
                    <Tooltip text={theme === 'dark' ? 'Light Mode' : 'Dark Mode'} />
                </div>

                <NotificationDropdown />

                <div className="relative group" ref={profileRef}>
                    <button onClick={() => toggleDropdown('profile')} className='flex items-center gap-2 cursor-pointer'>
                        <div className='w-10 h-10 rounded-full bg-gray-300 overflow-hidden'>
                            <img
                                src={getProfilePictureUrl(user.profilePictureURL)}
                                alt='User'
                                className='w-full h-full object-cover'
                                onError={(e) => { e.target.src = DefaultProfilePic; }}
                            />
                        </div>
                        <div className='hidden md:block'>
                            <p className='text-sm font-semibold text-gray-800 dark:text-gray-200'>{user.fullName}</p>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>{user.studentNumber}</p>
                        </div>
                    </button>
                    {openDropdown !== 'profile' && <Tooltip text="My Account" />}
                    {openDropdown === 'profile' && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-700 rounded-lg shadow-xl border dark:border-slate-600 animate-fade-in-down">
                            <ul className="py-2">
                                <li className="relative group/item">
                                    <Link
                                        to="/student-dashboard/my-account"
                                        onClick={() => setOpenDropdown(null)}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer flex items-center gap-3"
                                    >
                                        <User size={16} className="text-gray-600 dark:text-gray-400" />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">My Account</span>
                                    </Link>
                                    <span className="
                                     absolute top-full left-1/2 -translate-x-1/2 mt-1
                                     bg-gray-900 text-white text-xs font-bold 
                                     rounded-md px-2 py-1 
                                     opacity-0 scale-0 group-hover/item:opacity-100 group-hover/item:scale-100 
                                     transition-all duration-300 ease-in-out
                                     whitespace-nowrap z-50
                                   ">
                                        View Account Profile
                                    </span>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;