import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardSidebar from '../common/dashboardSidebar';
import DashboardHeader from '../common/dashboardHeader';

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className='flex h-screen dark:bg-slate-900 overflow-hidden'>
      <DashboardSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <DashboardHeader
          setMobileOpen={setMobileOpen}
        />
        <main className='p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;