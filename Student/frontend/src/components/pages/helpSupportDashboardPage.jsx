import React from 'react';
import FaqSection from '../common/help/FaqSection';
import SupportForm from '../common/help/SupportForm';
import TicketStatus from '../common/help/TicketStatus';
import ContactInfo from '../common/help/ContactInfo';

const HelpSupportPage = () => {
  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Help & Support
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 flex flex-col gap-8">
          <FaqSection />
          <TicketStatus />
        </div>

        <div className="lg:col-span-1 flex flex-col gap-8">
          <SupportForm />
          <ContactInfo />
        </div>

      </div>
    </>
  );
};

export default HelpSupportPage;