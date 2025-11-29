import React, { useState, useEffect, useCallback } from 'react';
import Card from './Card.jsx';
import ChevronLeft from './ChevronLeft.jsx';
import ChevronRight from './ChevronRight.jsx';

const getCalendarDays = (year, month) => {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const numDays = lastDayOfMonth.getDate();
  const startDay = firstDayOfMonth.getDay();
  const days = [];
  for (let i = 0; i < startDay; i++) days.push('');
  for (let i = 1; i <= numDays; i++) days.push(i);
  const totalCells = 42;
  while (days.length < totalCells) days.push('');

  const lastDateIndex = days.slice(0, 35).lastIndexOf(numDays);
  if (lastDateIndex >= 28 && lastDateIndex < 35) return days.slice(0, 35);
  return days.slice(0, 42);
};

const CalendarWidget = ({ className = '' }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const today = new Date().getDate();
  const todayMonth = new Date().getMonth();
  const todayYear = new Date().getFullYear();

  useEffect(() => {
    setCalendarDays(getCalendarDays(currentYear, currentMonth));
  }, [currentYear, currentMonth]);

  const navigateMonth = useCallback((direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev.getTime());
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  }, []);

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const displayTitle = `${monthName} ${currentYear}`;
  const daysOfWeek = ['SUN','MON','TUE','WED','THU','FRI','SAT'];

  return (
    <Card title={displayTitle} className={className}>
      <div className="flex justify-between items-center mb-4 text-stone-600">
        <ChevronLeft className="w-7 h-7 p-1 cursor-pointer hover:text-stone-800 rounded-full hover:bg-stone-100" onClick={() => navigateMonth(-1)} />
        <span className="font-semibold text-lg text-stone-800">{displayTitle}</span>
        <ChevronRight className="w-7 h-7 p-1 cursor-pointer hover:text-stone-800 rounded-full hover:bg-stone-100" onClick={() => navigateMonth(1)} />
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        {daysOfWeek.map(day => (<div key={day} className="font-bold text-stone-500 text-xs">{day}</div>))}
        {calendarDays.map((date, index) => {
          const isToday = (date === today && currentMonth === todayMonth && currentYear === todayYear);
          return (
            <div key={index} className={`
              p-2 rounded-lg font-medium transition-colors select-none
              ${date ? 'cursor-pointer' : 'pointer-events-none'}
              ${isToday ? 'bg-amber-400 text-white shadow-md' : date ? 'text-stone-700 hover:bg-stone-100' : 'text-stone-300'}
            `}>
              {date}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default CalendarWidget;
