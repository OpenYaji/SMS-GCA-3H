import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NotificationDropdown = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loadingNotifications, setLoadingNotifications] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (user && user.userId) {
            fetchNotifications();
            // Poll for new notifications every 30 seconds
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        if (!user || !user.userId) return;

        setLoadingNotifications(true);
        try {
            const response = await fetch(
                `http://localhost/Gymazo-Student-Side/backend/api/notification/getNotifications.php?userId=${user.userId}&limit=10`
            );
            const data = await response.json();

            if (data.success) {
                setNotifications(data.data.notifications);
                setUnreadCount(data.data.unreadCount);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoadingNotifications(false);
        }
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            const response = await fetch(
                'http://localhost/Gymazo-Student-Side/backend/api/notification/markAsRead.php',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        notificationId,
                        userId: user.userId,
                    }),
                }
            );

            const data = await response.json();
            if (data.success) {
                fetchNotifications();
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            const response = await fetch(
                'http://localhost/Gymazo-Student-Side/backend/api/notification/markAllAsRead.php',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: user.userId,
                    }),
                }
            );

            const data = await response.json();
            if (data.success) {
                fetchNotifications();
            }
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative group" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="relative p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
            >
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    </span>
                )}
            </button>

            {/* Tooltip */}
            <span className="
                absolute top-full left-1/2 -translate-x-1/2 mt-2
                bg-gray-900 text-white text-xs font-bold 
                rounded-md px-2 py-1 
                opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 
                transition-all duration-300 ease-in-out
                whitespace-nowrap z-50
            ">
                Notifications
            </span>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-700 rounded-lg shadow-xl border dark:border-slate-600 animate-fade-in-down">
                    <div className="p-4 border-b dark:border-slate-600 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800 dark:text-white">
                            Notifications
                        </h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="text-xs text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                            >
                                <CheckCheck size={14} />
                                Mark all as read
                            </button>
                        )}
                    </div>
                    <ul className="py-2 max-h-64 overflow-y-auto">
                        {loadingNotifications ? (
                            <li className="px-4 py-6 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto"></div>
                            </li>
                        ) : notifications.length === 0 ? (
                            <li className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                                No notifications yet
                            </li>
                        ) : (
                            notifications.map((notif) => (
                                <li
                                    key={notif.id}
                                    onClick={() => !notif.isRead && handleMarkAsRead(notif.id)}
                                    className={`px-4 py-3 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer border-l-4 ${notif.isRead
                                            ? 'border-transparent'
                                            : 'border-amber-500 bg-amber-50 dark:bg-slate-800'
                                        }`}
                                >
                                    <p
                                        className={`text-sm ${notif.isRead
                                                ? 'text-gray-600 dark:text-gray-400'
                                                : 'text-gray-800 dark:text-gray-200 font-medium'
                                            }`}
                                    >
                                        {notif.message}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {notif.timeAgo}
                                    </p>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
