import React from 'react';
import { X } from 'lucide-react';

const AnnouncementModal = ({ announcement, onClose }) => {
    if (!announcement) return null;
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up" onClick={e => e.stopPropagation()}>
                <img src={announcement.imageUrl} alt={announcement.title} className="w-full h-64 object-cover rounded-t-2xl"/>
                <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <span className="text-xs font-bold bg-blue-600 text-white px-3 py-1 rounded-full uppercase tracking-wider">{announcement.category}</span>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-4">{announcement.title}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{announcement.publishDate}</p>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300">
                            <X size={24} />
                        </button>
                    </div>
                    <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                        <p>{announcement.fullContent}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementModal;
