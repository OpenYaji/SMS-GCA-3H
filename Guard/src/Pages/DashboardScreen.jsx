import React from 'react';
import DutyScheduleWidget from '../Components/DutyScheduleWidget.jsx';
import CalendarWidget from '../Components/CalendarWidget.jsx';
import NotificationsWidget from '../Components/NotificationsWidget.jsx';
import AnnouncementsWidget from '../Components/AnnouncementsWidget.jsx';

const DashboardScreen = () => (
  <div className="grid grid-cols-12 gap-8">
    <DutyScheduleWidget className="col-span-12 xl:col-span-4" />
    <div className="col-span-12 xl:col-span-8 grid grid-cols-12 gap-10">
      <CalendarWidget className="col-span-12 lg:col-span-5" />
      <NotificationsWidget className="col-span-12 lg:col-span-7" />
      <AnnouncementsWidget className="col-span-12" />
    </div>
  </div>
);

export default DashboardScreen;
