import React, { useState } from 'react';
import SupportForm from '../common/help/SupportForm';
import TicketStatus from '../common/help/TicketStatus';

const HelpCenterPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTicketCreated = () => {
    // Trigger refresh of ticket list
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Help & Support
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SupportForm onTicketCreated={handleTicketCreated} />
        <TicketStatus refreshTrigger={refreshTrigger} />
      </div>
    </>
  );
};

export default HelpCenterPage;
