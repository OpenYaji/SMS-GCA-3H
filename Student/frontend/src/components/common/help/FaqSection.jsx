import React, { useState } from 'react';
import { Search, ChevronDown, Lock, FileText, Banknote } from 'lucide-react';

const faqData = {
  "General": [
    { q: "How does the RFID attendance work?", a: "Students tap their ID on the RFID scanner upon entering and leaving the school. The system automatically records the time, providing real-time attendance data for parents and administrators." },
  ],
  "Billing & Payments": [
    { q: "How are payments processed?", a: "Payments can be made online through our portal via credit/debit card, or e-wallets like Paymaya. You can also pay in cash at the school's cashier." },
    { q: "Can I view my payment history?", a: "Yes, the 'Transaction' page provides a detailed history of all your payments, including dates, amounts, and payment methods." },
  ],
  "Technical Issues": [
    { q: "I forgot my password, what should I do?", a: "On the login page, click the 'Forgot Password' link. You will receive an email with instructions on how to reset your password securely." },
  ]
};

const FaqItem = ({ faq, isOpen, onToggle }) => (
  <div className="border-b border-gray-200 dark:border-slate-700">
    <button onClick={onToggle} className="w-full flex justify-between items-center text-left py-4">
      <span className="font-semibold text-gray-800 dark:text-gray-200">{faq.q}</span>
      <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
    </button>
    {isOpen && (
      <div className="pb-4 text-gray-600 dark:text-gray-400">
        <p>{faq.a}</p>
      </div>
    )}
  </div>
);


const FaqSection = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFaqs = Object.keys(faqData).reduce((acc, category) => {
    const filtered = faqData[category].filter(faq => 
      faq.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
      faq.a.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {});

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 shadow-md">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Frequently Asked Questions</h2>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input 
          type="text"
          placeholder="Search for answers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 focus:ring-2 focus:ring-amber-400 outline-none"
        />
      </div>

      <div className="space-y-4">
        {Object.keys(filteredFaqs).map(category => (
          <div key={category}>
            <h3 className="font-bold text-lg text-amber-600 dark:text-amber-400 mb-2">{category}</h3>
            {filteredFaqs[category].map((faq, index) => (
              <FaqItem 
                key={index}
                faq={faq}
                isOpen={openFaq === `${category}-${index}`}
                onToggle={() => setOpenFaq(openFaq === `${category}-${index}` ? null : `${category}-${index}`)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqSection;