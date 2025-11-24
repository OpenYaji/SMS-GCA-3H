import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiTag, FiX } from 'react-icons/fi';

const AnnouncementModal = ({ announcement, onClose }) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!announcement) return null;

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.95, y: 20 }} 
        transition={{ duration: 0.3, ease: "easeInOut" }} 
        onClick={(e) => e.stopPropagation()} 
        className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="overflow-y-auto">
          <img src={announcement.imageUrl} alt={announcement.title} className="w-full h-72 object-cover" />
          <div className="p-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3">{announcement.title}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
              <div className="flex items-center"><FiCalendar className="mr-2" /><span>{new Date(announcement.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
              <div className="flex items-center"><FiTag className="mr-2" /><span className="inline-block bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 text-xs font-semibold px-2.5 py-1 rounded-full">{announcement.category}</span></div>
            </div>
            <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: announcement.fullContent }}/>
          </div>
        </div>
        <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/50 dark:bg-black/50 hover:bg-white/80 dark:hover:bg-black/80 text-gray-700 dark:text-gray-200 transition-colors"><FiX size={20} /></button>
      </motion.div>
    </div>
  );
};

export default AnnouncementModal;