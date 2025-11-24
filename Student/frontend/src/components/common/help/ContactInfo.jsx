import React from 'react';
import { School, Mail, Phone } from 'lucide-react';

const ContactInfo = () => {
  const contactDetails = [
    { icon: <School className="w-5 h-5 text-amber-500" />, text: 'Gymnazo Christian Academy' },
    { icon: <Mail className="w-5 h-5 text-amber-500" />, text: 'g2022gymnazo@gmail.com' },
    { icon: <Phone className="w-5 h-5 text-amber-500" />, text: '282472450' },
  ];
  
  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 shadow-md">
       <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Contact Us Directly</h2>
       <div className="space-y-4">
        {contactDetails.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            {item.icon}
            <span className="text-sm text-gray-700 dark:text-gray-300">{item.text}</span>
          </div>
        ))}
       </div>
    </div>
  );
};

export default ContactInfo;