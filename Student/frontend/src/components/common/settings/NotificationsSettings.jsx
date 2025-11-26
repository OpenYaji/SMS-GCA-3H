import React from 'react';
import { Mail, Bell, CheckCircle2, XCircle, Clock } from 'lucide-react';

const SettingsToggle = ({ icon, title, description, enabled }) => (
  <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-slate-700">
    <div className="flex items-center gap-4">
      {icon}
      <div>
        <h4 className="font-semibold text-gray-800 dark:text-gray-200">{title}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
    </div>
    <div className={`w-12 h-6 rounded-full p-1 transition-colors ${enabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-slate-600'}`}>
      <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${enabled ? 'translate-x-6' : 'translate-x-0'}`} />
    </div>
  </div>
);

const NotificationsSettings = () => {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
        Notifications Settings
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Manage how you receive important updates.
      </p>

      <div className="space-y-4">
        <SettingsToggle 
          icon={<Mail className="text-blue-500" />} 
          title="Email Notifications" 
          description="Receive updates in your inbox." 
          enabled={true} 
        />
        <SettingsToggle 
          icon={<Bell className="text-purple-500" />} 
          title="Push Notifications" 
          description="Get alerts directly on your device." 
          enabled={false} 
        />
        <SettingsToggle 
          icon={<CheckCircle2 className="text-green-500" />} 
          title="New Grades Posted" 
          description="Notify when a teacher posts a new grade." 
          enabled={true} 
        />
        <SettingsToggle 
          icon={<Clock className="text-amber-500" />} 
          title="Upcoming Deadlines" 
          description="Reminders for assignments and projects." 
          enabled={true} 
        />
        <SettingsToggle 
          icon={<XCircle className="text-red-500" />} 
          title="Tuition & Billing Alerts" 
          description="Get alerts for payment deadlines." 
          enabled={false} 
        />
      </div>
    </div>
  );
};

export default NotificationsSettings;