import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiInfo } from 'react-icons/fi';

const NewsTicker = ({ newsItems }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => { 
            setCurrentIndex(prevIndex => (prevIndex + 1) % newsItems.length); 
        }, 4000);
        return () => clearInterval(timer);
    }, [newsItems.length]);

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
             <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center"><FiInfo className="mr-2 text-amber-500"/>School News</h3>
             <div className="h-6 overflow-hidden relative">
                <AnimatePresence>
                    <motion.div 
                        key={currentIndex} 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: -20 }} 
                        transition={{ duration: 0.5, ease: 'easeInOut' }} 
                        className="absolute inset-0"
                    >
                        <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{newsItems[currentIndex].title}</p>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default NewsTicker;