import LogOut from './Components/LogOut.jsx';
import Mail from './Components/Mail.jsx';
import Users from './Components/Users.jsx';
import QrCode  from './Components/QrCode.jsx';  
import ClipboardList  from './Components/ClipboardList.jsx';
import User  from './Components/User.jsx';
import LayoutDashboard  from './Components/LayoutDashboard.jsx';
const MOCK_SCHEDULE = [
  { day: 'Monday', grade: 'Grade 5 - Section A', time: '6:30 AM - 7:30 AM', room: 'Room 301' },
  { day: 'Tuesday', grade: 'Grade 4 - Section B', time: '8:30 AM - 9:30 AM', room: 'Room 101' },
  { day: 'Wednesday', grade: 'Grade 3 - Section C', time: '9:30 AM - 10:30 AM', room: 'Room 203' },
  { day: 'Thursday', grade: 'Grade 2 - Section A', time: '11:30 AM - 12:00 PM', room: 'Room 201' },
  { day: 'Friday', grade: 'Grade 1 - Section A', time: '1:30 AM - 2:30 AM', room: 'Room 203' },
];

const MOCK_NOTIFICATIONS = [
  { role: 'ADMIN', time: '10:07 AM', text: 'The schedule of class Section B has been approved. Kindly re...' },
  { role: 'ADMIN', time: '8:42 AM', text: 'The schedule of class Section B has been approved. Kindly re...' },
  { role: 'REGISTRAR', time: '7:27 AM', text: 'The schedule of class Section B has been approved. Kindly re...' },
];

const MOCK_ANNOUNCEMENTS = [
  { title: 'Sports Day Announcement', date: 'May 12, 2025', text: 'The school\'s Annual Sports Day will be held on May 12, 2025.' },
  { title: 'Summer Break Start Date', date: 'May 25, 2025', text: 'Summer break begins on May 25, 2025. Have a wonderful summer!' },
  { title: 'Christmas Break Start Date', date: 'Oct 15, 2025', text: 'Christmas break begins on Oct 15, 2025. Have a wonderful holiday!' },
];

const MOCK_PROFILE_DATA = {
  fullName: 'Jhego Dacayo',
  employeeId: '852-963',
  sex: 'Male',
  dateOfBirth: 'January 20, 1965',
  phoneNumber: '+63 99-4856-9878',
  address: 'Sauyo, Quezon City Metro Manila',
  religion: 'Catholic',
  motherTongue: 'Tagalog',
  nationality: 'Filipino',
  weight: '82kg',
  height: '183cm',
};

const NAV_ITEMS = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'My Profile', icon: User },
  { name: 'Student Log', icon: ClipboardList },
  { name: 'Student List', icon: Users },
  { name: 'QR Code Scanner', icon: QrCode },
];
export {
  MOCK_SCHEDULE,
  MOCK_NOTIFICATIONS,
      MOCK_ANNOUNCEMENTS,
      MOCK_PROFILE_DATA,
      NAV_ITEMS
};