import React, { useState } from 'react';

// Sample data for the FAQs pero dapat galing sa backend to
const faqData = [
  { id: 1, question: "What grade levels does Gymnazo Christian Academy offer?", answer: "We currently offer classes for Elementary (Grades 1-6), Junior High School (Grades 7-10), and Senior High School (Grades 11-12) programs." },
  { id: 2, question: "What are the school's operating hours?", answer: "The campus is open from 7:00 AM to 5:00 PM, Monday to Friday. Class schedules vary by grade level, typically running from 8:00 AM to 3:00 PM." },
  { id: 3, question: "Is financial aid or scholarship available?", answer: "Yes, we offer limited merit-based scholarships and needs-based financial assistance programs. Please visit the 'Admission' section and contact the Registrar's office for detailed requirements and application forms." },
  { id: 4, question: "What is the primary mode of instruction?", answer: "Gymnazo Christian Academy primarily utilizes a blended learning model, combining face-to-face instruction with supplementary digital resources and online collaborative tools." },
  { id: 5, question: "How can I schedule a campus tour or an interview?", answer: "You can schedule a campus tour by contacting our admissions office via the Contact Us form, or by calling our main line during business hours. Interviews are scheduled after the initial application submission." },
];

const FAQ = () => {
  const [openId, setOpenId] = useState(null);

  const toggleAnswer = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const halfLength = Math.ceil(faqData.length / 2);
  const col1 = faqData.slice(0, halfLength);
  const col2 = faqData.slice(halfLength);

  return (
    <div className='bg-white dark:bg-transparent transition-colors duration-300 p-4 h-full rounded-xl'> 
      <div className='w-full mx-auto'>
        
        <div className='mb-8'>
          <h3 className='text-3xl font-extrabold text-[#5B3E31] dark:text-amber-400'>FREQUENTLY ASKED QUESTIONS (FAQs)</h3> 
        </div>

        <div className='divide-y divide-gray-300 dark:divide-gray-700 space-y-2'> 
          {faqData.map((faq) => (
            <div key={faq.id} className='py-3 transition-all duration-300'>
              
              <button
                className='w-full flex justify-between items-start text-left 
                           font-medium text-base text-[#5B3E31] dark:text-gray-100 hover:text-amber-500 transition-colors duration-200'
                onClick={() => toggleAnswer(faq.id)}
                aria-expanded={openId === faq.id}
                aria-controls={`faq-answer-${faq.id}`}
              >
                <span className='text-[#5B3E31] dark:text-gray-100'>{faq.question}</span> 
                <svg
                  className={`w-5 h-5 flex-shrink-0 ml-6 transform transition-transform duration-300 ${
                    openId === faq.id ? 'rotate-180 text-amber-500' : 'rotate-0 text-amber-500 dark:text-amber-400' 
                  }`}
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                id={`faq-answer-${faq.id}`}
                className={`overflow-hidden transition-all ease-in-out duration-500 ${
                  openId === faq.id ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'
                }`}
              >
                <div className='pl-6'>
                  <p className='text-gray-600 dark:text-gray-400 text-sm'>
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className='mt-8 text-center p-6 bg-gray-100 dark:bg-[#212529] rounded-xl shadow-lg'> {/* Added light bg */}
            <p className='text-base font-medium text-[#5B3E31] dark:text-amber-400 '>
                Can't find your question? Reach out to us directly!
            </p>
        </div>
          
      </div>
    </div>
  );
}

export default FAQ;