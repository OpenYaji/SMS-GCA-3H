import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  NotebookText,
  FileText,
  CreditCard,
  MessageCircleQuestion,
  GraduationCap
} from 'lucide-react';

const QuickAccessCard = ({ icon, title, subtitle, tooltipText, path, disabled = false }) => {
  const cardContent = (
    <div className={`flex items-start gap-4 ${disabled ? 'opacity-50' : ''}`}>
      <div className={`p-2.5 rounded-lg ${disabled ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400' : 'bg-[#F4D77D] dark:bg-slate-700 text-gray-800 dark:text-amber-300'}`}>
        {icon}
      </div>
      <div>
        <h3 className='text-sm font-bold text-gray-800 dark:text-gray-100 mb-1'>{title}</h3>
        <p className='text-xs text-gray-500 dark:text-gray-400'>{subtitle}</p>
      </div>
    </div>
  );

  if (disabled) {
    return (
      <div className='relative block bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700 cursor-not-allowed group'>
        {cardContent}
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs font-bold rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
          {tooltipText}
        </span>
      </div>
    );
  }

  return (
    <Link
      to={path}
      className='relative block bg-white dark:bg-slate-800 rounded-xl p-4 hover:shadow-md transition-all duration-300 group border border-gray-100 dark:border-slate-700'
    >
      {cardContent}
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs font-bold rounded-md px-2 py-1 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-in-out whitespace-nowrap z-10">
        {tooltipText || title}
      </span>
    </Link>
  );
};

const QuickAccessGrid = () => {
  const [currentBalance, setCurrentBalance] = useState(0);
  const [enrollmentStatus, setEnrollmentStatus] = useState({
    isEnrolled: false,
    isEnrollmentOpen: false,
    currentSchoolYear: null,
    nextSchoolYear: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [balanceResponse, enrollmentResponse] = await Promise.all([
        axios.get('/backend/api/transactions/getTransactionData.php', {
          withCredentials: true,
        }),
        axios.get('/backend/api/enrollment/getEnrollmentStatus.php', {
          withCredentials: true,
        })
      ]);

      if (balanceResponse.data.success) {
        setCurrentBalance(balanceResponse.data.data.currentBalance || 0);
      }

      if (enrollmentResponse.data.success) {
        setEnrollmentStatus(enrollmentResponse.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setCurrentBalance(0);
    } finally {
      setLoading(false);
    }
  };

  const hasBalance = currentBalance > 0;
  const canEnroll = !enrollmentStatus.isEnrolled && enrollmentStatus.isEnrollmentOpen;

  // Determine enrollment subtitle and tooltip
  const getEnrollmentInfo = () => {
    if (enrollmentStatus.isEnrolled && !enrollmentStatus.isEnrollmentOpen) {
      return {
        subtitle: `Currently enrolled in S.Y. ${enrollmentStatus.currentSchoolYear}`,
        tooltip: 'You are already enrolled for the current school year'
      };
    } else if (enrollmentStatus.isEnrolled && enrollmentStatus.isEnrollmentOpen) {
      return {
        subtitle: `Enrollment for S.Y. ${enrollmentStatus.nextSchoolYear} is open!`,
        tooltip: 'Enroll for the upcoming school year'
      };
    } else if (!enrollmentStatus.isEnrolled && enrollmentStatus.isEnrollmentOpen) {
      return {
        subtitle: `Enrollment for S.Y. ${enrollmentStatus.nextSchoolYear} is open now!`,
        tooltip: 'Start your enrollment process'
      };
    } else {
      return {
        subtitle: 'Enrollment is currently closed',
        tooltip: 'Enrollment is not open at this time'
      };
    }
  };

  const enrollmentInfo = getEnrollmentInfo();

  const quickAccessItems = [
    {
      icon: <NotebookText size={20} />,
      title: 'Subjects',
      subtitle: '7 Active',
      tooltipText: 'View Subjects',
      path: '/student-dashboard/subject',
      disabled: false
    },
    {
      icon: <MessageCircleQuestion size={20} />,
      title: 'Grades',
      subtitle: 'View Latest Grades',
      tooltipText: 'Check your Grades',
      path: '/student-dashboard/academic/current-grades',
      disabled: false
    },
    {
      icon: <FileText size={20} />,
      title: 'Document Request',
      subtitle: '0 Pending',
      tooltipText: 'Request a Document',
      path: '/student-dashboard/document-request',
      disabled: false
    },
    {
      icon: <CreditCard size={20} />,
      title: 'Pay Tuition',
      subtitle: hasBalance ? `₱${currentBalance.toLocaleString('en-PH', { minimumFractionDigits: 2 })} Balance` : 'Fully Paid',
      tooltipText: hasBalance ? 'Go to Payment Portal' : 'No outstanding balance',
      path: '/student-dashboard/transaction/payment-portal',
      disabled: !hasBalance
    },
    {
      icon: <MessageCircleQuestion size={20} />,
      title: 'Escorts',
      subtitle: 'Add & Verify New Escorts',
      tooltipText: 'View Authorized Escorts',
      path: '/student-dashboard/text-sundo',
      disabled: false
    },
    {
      icon: <GraduationCap size={20} />,
      title: 'Enroll',
      subtitle: enrollmentInfo.subtitle,
      tooltipText: enrollmentInfo.tooltip,
      path: '/student-dashboard/enrollment',
      disabled: !canEnroll
    }
  ];

  if (loading) {
    return (
      <div className='mb-6'>
        <div className='grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4'>
          {[...Array(6)].map((_, index) => (
            <div key={index} className='bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700 animate-pulse'>
              <div className='flex items-start gap-4'>
                <div className='w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-lg'></div>
                <div className='flex-1'>
                  <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2 w-3/4'></div>
                  <div className='h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2'></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
            disabled={item.disabled}
          />
        ))}
      </div>
    </div>
  );
};

export default QuickAccessGrid;