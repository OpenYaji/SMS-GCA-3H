import React from 'react';
import { Clock, Smartphone, CheckCircle, Users } from 'lucide-react';

const SummaryCards = ({ summary }) => {
  const cards = [
    {
      title: 'Pending GCash',
      value: summary.pendingGCash || 0,
      icon: Smartphone,
      bgColor: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgLight: 'bg-blue-100'
    },
    {
      title: 'Pending Bank Transfer',
      value: summary.pendingBankTransfer || 0,
      icon: Clock,
      bgColor: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgLight: 'bg-yellow-100'
    },
    {
      title: 'Verified Today',
      value: summary.verifiedToday || 0,
      icon: CheckCircle,
      bgColor: 'bg-green-500',
      textColor: 'text-green-600',
      bgLight: 'bg-green-100'
    },
    {
      title: 'Total Pending',
      value: summary.totalPending || 0,
      icon: Users,
      bgColor: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgLight: 'bg-purple-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center space-x-4 hover:shadow-lg transition-shadow"
          >
            <div className={`${card.bgLight} dark:${card.bgColor} dark:bg-opacity-20 p-4 rounded-lg`}>
              <Icon className={`${card.textColor} dark:text-white`} size={32} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{card.title}</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{card.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;