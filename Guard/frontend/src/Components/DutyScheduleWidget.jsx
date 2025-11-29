import React from 'react';
import Card from './Card.jsx';
import Clock from './Clock.jsx';
import MapPin from './MapPin.jsx';
import { MOCK_SCHEDULE } from '../Constants.jsx';

const DutyScheduleWidget = ({ className = '' }) => (
  <Card title="Duty Schedule" className={className}>
    <div className="space-y-4">
      {MOCK_SCHEDULE.map((item, index) => (
        <div key={index} className="flex flex-col sm:flex-row justify-between border-b pb-4 last:border-b-0 last:pb-0">
          <div className="flex flex-col">
            <p className="text-lg font-bold text-stone-800">{item.day}</p>
            <p className="text-sm text-stone-500">{item.grade}</p>
          </div>
          <div className="flex flex-col items-start sm:items-end mt-2 sm:mt-0">
            <div className="flex items-center text-sm text-stone-700 font-medium">
              <Clock className="w-4 h-4 mr-1 text-amber-500" />
              <span className="font-semibold text-stone-800">{item.time}</span>
            </div>
            <div className="flex items-center text-sm text-stone-500">
              <MapPin className="w-4 h-4 mr-1 text-red-500" />
              {item.room}
            </div>
          </div>
        </div>
      ))}
    </div>
  </Card>
);

export default DutyScheduleWidget;
