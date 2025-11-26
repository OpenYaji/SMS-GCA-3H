import React from 'react';
import WelcomeBanner from '../common/dashboard/welcomeBanner';
import QuickAccessGrid from '../common/dashboard/quickAccessGrid';
import Announcement from '../common/homepage/announcement/announcement';
import AnnouncementModal from '../common/homepage/announcement/AnnouncementModal';
import Carousel from '../common/homepage/announcement/Carousel';
const DashboardPage = () => {
  return (
    <>
      <WelcomeBanner />
      <QuickAccessGrid />
      <Announcement/>
      <AnnouncementModal/>
      <Carousel/>

    </>
  );
};

export default DashboardPage;