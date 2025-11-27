import React from 'react';
import AnnouncementItem from './AnnouncementItem.jsx';
import { MOCK_ANNOUNCEMENTS } from '../Constants.jsx';

const AnnouncementsWidget = ({ className = '' }) => (
  <div className={`p-6 bg-white rounded-2xl shadow-xl ${className}`}>
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold text-stone-800">Announcements</h2>
      <a href="#" className="text-amber-600 hover:text-amber-700 text-sm font-medium">View all</a>
    </div>
    <div className="space-y-4">
      {MOCK_ANNOUNCEMENTS.map((item, index) => (
        <AnnouncementItem key={index} {...item} />
      ))}
    </div>
  </div>
);

export default AnnouncementsWidget;
