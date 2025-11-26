import React from 'react';
import Card from './Card.jsx';
import NotificationItem from './NotificationItem.jsx';
import { MOCK_NOTIFICATIONS } from '../Constants.jsx';

const NotificationsWidget = ({ className = '' }) => (
  <Card title="Notifications" className={className}>
    <div className="flex justify-end text-sm mb-4">
      <a href="#" className="text-amber-600 hover:text-amber-700 font-medium">View all</a>
    </div>
    <div className="space-y-2">
      {MOCK_NOTIFICATIONS.map((item, index) => (
        <NotificationItem key={index} {...item} />
      ))}
    </div>
  </Card>
);

export default NotificationsWidget;
