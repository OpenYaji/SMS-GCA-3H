import React from 'react';
import ShieldCheck from './ShieldCheck.jsx';
import AlertCircle from './AlertCircle.jsx';

const NotificationItem = ({ role, time, text }) => {
  const Icon = role === 'ADMIN' ? ShieldCheck : AlertCircle;
  const color = role === 'ADMIN' ? 'text-green-500 bg-green-50' : 'text-blue-500 bg-blue-50';

  return (
    <div className="flex items-start space-x-3 p-3 rounded-xl hover:bg-stone-50 transition-colors">
      <div className={`p-2 rounded-full ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <p className="font-bold text-sm uppercase text-stone-800">{role}</p>
          <p className="text-xs text-stone-500">{time}</p>
        </div>
        <p className="text-xs text-stone-600 line-clamp-2">{text}</p>
      </div>
    </div>
  );
};

export default NotificationItem;
