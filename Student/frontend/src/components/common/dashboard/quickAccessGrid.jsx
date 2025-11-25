import React from 'react';
import { Link } from 'react-router-dom';
import { 
  NotebookText, 
  FileText, 
  CreditCard, 
  MessageCircleQuestion 
} from 'lucide-react';

const QuickAccessCard = ({ icon, title, subtitle, tooltipText, path }) => {
  return (
    <Link 
      to={path} 
      className='relative block bg-white dark:bg-slate-800 rounded-xl p-4 hover:shadow-md transition-all duration-300 group border border-gray-100 dark:border-slate-700'
    >
      <div className='flex items-start gap-4'>
        <div className='bg-[#F4D77D] dark:bg-slate-700 p-2.5 rounded-lg text-gray-800 dark:text-amber-300'>
          {icon}
        </div>
        <div>
          <h3 className='text-sm font-bold text-gray-800 dark:text-gray-100 mb-1'>{title}</h3>
          <p className='text-xs text-gray-500 dark:text-gray-400'>{subtitle}</p>
        </div>
      </div>

      <span className="
        absolute bottom-full left-1/2 -translate-x-1/2 mb-2
        bg-gray-900 text-white text-xs font-bold 
        rounded-md px-2 py-1 
        opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 
        transition-all duration-300 ease-in-out
        whitespace-nowrap
        z-10
      ">
        {tooltipText || title}
      </span>
    </Link>
  );
};

const QuickAccessGrid = () => {
  const quickAccessItems = [
    { 
      icon: <NotebookText size={20} />, 
      title: 'Subjects', 
      subtitle: '7 Active',
      tooltipText: 'View Subjects',
      path: '/student-dashboard/subject'
    },
    { 
      icon: <MessageCircleQuestion size={20} />, 
      title: 'Grades', 
      subtitle: 'View Latest Grades',
      tooltipText: 'Check your Grades',
      path: '/student-dashboard/academic/current-grades' 
    },
    { 
      icon: <FileText size={20} />, 
      title: 'Document Request', 
      subtitle: '0 Pending',
      tooltipText: 'Request a Document',
      path: '/student-dashboard/document-request'
    },
    { 
      icon: <CreditCard size={20} />, 
      title: 'Pay Tuition', 
      subtitle: 'View Balance',
      tooltipText: 'Go to Payment Portal',
      path: '/student-dashboard/transaction/payment-portal'
    },
    { 
      icon: <MessageCircleQuestion size={20} />, 
      title: 'Escorts', 
      subtitle: 'Add & Verify New Escorts',
      tooltipText: 'View Authorized Escorts',
      path: '/student-dashboard/text-sundo' 
    },
    { 
      icon: <MessageCircleQuestion size={20} />, 
      title: 'Enroll', 
      subtitle: 'Enrollment for SY 2025-26 is open now!',
      tooltipText: 'View Enrollment Status',
      path: '/student-dashboard/text-sundo' 
    }
  ];

  return (
    <div className='mb-6'>
      <div className='grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4'>
        {quickAccessItems.map((item, index) => (
          <QuickAccessCard
            key={index}
            icon={item.icon}
            title={item.title}
            subtitle={item.subtitle}
            tooltipText={item.tooltipText}
            path={item.path}
          />
        ))}
      </div>
    </div>
  );
};

export default QuickAccessGrid;