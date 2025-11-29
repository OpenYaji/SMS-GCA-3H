import React from 'react';
import Speaker from './Speaker.jsx';

const AnnouncementItem = ({ title, date, text }) => (
  <div className="flex items-start space-x-3 p-4 bg-white rounded-xl shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer">
    <div className="p-2 rounded-full bg-amber-100 text-amber-600">
      <Speaker className="w-5 h-5" />
      <span className="sr-only">Announcement Icon</span>
    </div>
    <div className="flex-1">
      <p className="font-semibold text-base text-stone-800 mb-1">{title}</p>
      <p className="text-xs text-stone-500 mb-1">{date}</p>
      <p className="text-sm text-stone-600 line-clamp-2">{text}</p>
    </div>
  </div>
);

export default AnnouncementItem;
