import React, { useState, useRef, useEffect } from 'react';
import { BotMessageSquare, X, User, Bot, Send, MessageCircle } from 'lucide-react';

const HelpSupport = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const FAQ = [
    {
      id: 1,
      title: 'Location & Address',
      keywords: ['location', 'address', 'where'],
      answer: 'Gymnazo Christian Academy is located at 268 Zabala St. Cor. Luahati St. Tondo, Manila, Manila, Philippines.'
    },
    {
      id: 2,
      title: 'Contact Information',
      keywords: ['contact', 'phone', 'call', 'number'],
      answer: 'You can contact us at 282472450 or email us at gymnazochristianacademy@gmail.com'
    },
    {
      id: 3,
      title: 'Email Address',
      keywords: ['email', 'mail'],
      answer: 'Our email address is gymnazochristianacademy@gmail.com'
    },
    {
      id: 4,
      title: 'Mission & Vision',
      keywords: ['mission', 'vision', 'purpose'],
      answer: 'Our mission is committed to the formation of values and education among learners, nurturing both academic excellence and Christian character.'
    },
    {
      id: 5,
      title: 'Admission & Enrollment',
      keywords: ['admission', 'enroll', 'enrollment', 'apply'],
      answer: 'For admission and enrollment information, please contact our office at 282472450 or email gymnazochristianacademy@gmail.com. Our staff will guide you through the enrollment process.'
    },
    {
      id: 6,
      title: 'Tuition & Fees',
      keywords: ['tuition', 'fee', 'cost', 'payment'],
      answer: 'For detailed information about tuition fees and payment options, please contact our office at 282472450 or email gymnazochristianacademy@gmail.com'
    },
    {
      id: 7,
      title: 'Programs & Curriculum',
      keywords: ['program', 'curriculum', 'course'],
      answer: 'We offer comprehensive Christian-based education programs. For specific curriculum details, please contact us at 282472450 or gymnazochristianacademy@gmail.com'
    },
    {
      id: 8,
      title: 'Class Schedule',
      keywords: ['schedule', 'class', 'time'],
      answer: 'For information about class schedules and timings, please contact our office at 282472450 or email gymnazochristianacademy@gmail.com'
    },
    {
      id: 9,
      title: 'Facilities & Campus',
      keywords: ['facility', 'facilities', 'building', 'campus'],
      answer: 'Our campus is equipped with modern facilities to support quality Christian education. For a detailed tour, please contact us at 282472450.'
    },
    {
      id: 10,
      title: 'Scholarship & Financial Aid',
      keywords: ['scholarship', 'financial aid', 'assistance'],
      answer: 'For information about scholarships and financial assistance programs, please contact our office at 282472450 or email gymnazochristianacademy@gmail.com'
    }
  ];

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m the Gymnazo Christian Academy assistant. How can I help you today? You can ask me about admissions, programs, facilities, or contact information.',
      timestamp: new Date()
    },
    {
      role: 'assistant',
      type: 'faq-list',
      content: 'Here are some frequently asked questions:',
      timestamp: new Date()
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleHelp = () => {
    setIsHelpOpen(!isHelpOpen);
  };

  const findAnswer = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    for (const faq of FAQ) {
      if (faq.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return faq.answer;
      }
    }
    
    return "I'm not sure about that specific question. Please contact us at 282472450 or email gymnazochristianacademy@gmail.com for more information.";
  };

  const handleFAQClick = (faq) => {
    setMessages(prev => [...prev, {
      role: 'user',
      content: faq.title,
      timestamp: new Date()
    }]);

    setIsLoading(true);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: faq.answer,
        timestamp: new Date()
      }]);

      setIsLoading(false);
    }, 500);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');

    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }]);

    setIsLoading(true);

    setTimeout(() => {
      const answer = findAnswer(userMessage);
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: answer,
        timestamp: new Date()
      }]);

      setIsLoading(false);
    }, 500);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        {isHelpOpen && (
          <div className="absolute bottom-12 sm:bottom-16 right-0 mb-2 w-72 sm:w-80 md:w-96 h-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 animate-slideUp flex flex-col">
            <div className="bg-gradient-to-r from-[#F4D77D] to-[#F7C236] dark:from-amber-600 dark:to-amber-700 p-3 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <BotMessageSquare className="w-5 h-5 text-[#5B3E31] dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-xs sm:text-sm">GCA Assistant</h3>
                  <p className="text-[10px] sm:text-xs text-white/80">Ask me anything</p>
                </div>
              </div>
              <button
                onClick={toggleHelp}
                className="text-white hover:bg-white/20 rounded-full p-1 transition-colors duration-200"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            <div className="p-2.5 sm:p-3 overflow-y-auto bg-gray-50 dark:bg-gray-900 space-y-2 flex-1">
              {messages.map((message, index) => (
                <div key={index}>
                  {message.type === 'faq-list' ? (
                    <div className="flex gap-1.5 sm:gap-2 justify-start">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 bg-[#F4D77D] dark:bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#5B3E31]" />
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-2 sm:p-2.5 max-w-[85%] shadow-sm">
                        <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 mb-2">{message.content}</p>
                        <div className="grid grid-cols-1 gap-1.5">
                          {FAQ.map((faq) => (
                            <button
                              key={faq.id}
                              onClick={() => handleFAQClick(faq)}
                              disabled={isLoading}
                              className="flex items-center gap-1.5 text-left px-2 py-1.5 bg-gray-50 dark:bg-gray-700 hover:bg-[#F4D77D]/10 dark:hover:bg-amber-600/20 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                              <MessageCircle className="w-3 h-3 text-[#F4D77D] dark:text-amber-400 flex-shrink-0" />
                              <span className="text-[10px] sm:text-xs text-gray-700 dark:text-gray-300 group-hover:text-[#5B3E31] dark:group-hover:text-amber-300">
                                {faq.title}
                              </span>
                            </button>
                          ))}
                        </div>
                        <span className="text-[10px] sm:text-xs mt-1 block text-gray-500 dark:text-gray-400">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className={`flex gap-1.5 sm:gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {message.role === 'assistant' && (
                        <div className="w-6 h-6 sm:w-7 sm:h-7 bg-[#F4D77D] dark:bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#5B3E31]" />
                        </div>
                      )}
                      <div className={`rounded-lg p-2 sm:p-2.5 max-w-[75%] shadow-sm ${message.role === 'user'
                        ? 'bg-[#F4D77D] dark:bg-amber-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                        }`}>
                        <p className="text-xs sm:text-sm whitespace-pre-wrap break-words">{message.content}</p>
                        <span className={`text-[10px] sm:text-xs mt-0.5 block ${message.role === 'user'
                          ? 'text-white/80'
                          : 'text-gray-500 dark:text-gray-400'
                          }`}>
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      {message.role === 'user' && (
                        <div className="w-6 h-6 sm:w-7 sm:h-7 bg-[#5B3E31] dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-1.5 sm:gap-2 justify-start">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-[#F4D77D] dark:bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-2 sm:p-2.5 shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-2.5 sm:p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <form onSubmit={handleSendMessage} className="flex gap-1.5 sm:gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask about the school..."
                  disabled={isLoading}
                  className="flex-1 px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F4D77D] dark:focus:ring-amber-500 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs sm:text-sm disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-[#F4D77D] hover:bg-[#F7C236] dark:bg-amber-600 dark:hover:bg-amber-700 text-white rounded-full p-1.5 sm:p-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </form>
              <div className="mt-1.5 text-[9px] sm:text-[10px] md:text-xs text-gray-600 dark:text-gray-400 text-center">
                Email: <a href="mailto:gymnazochristianacademy@gmail.com" className="hover:text-[#F4D77D] dark:hover:text-amber-400 transition-colors break-all">gymnazochristianacademy@gmail.com</a>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={toggleHelp}
          className="relative bg-[#F4D77D] dark:bg-amber-400 border-2 border-[#5B3E31] dark:border-amber-400 text-white w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center hover:scale-110 group"
          aria-label="Help & Support"
        >
          <BotMessageSquare
            className={`text-[#5B3E31] w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 absolute transition-all duration-300 ${isHelpOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100 group-hover:rotate-12'}`}
          />
          <X
            className={`text-[#5B3E31] w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 absolute transition-all duration-300 ${isHelpOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`}
          />
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default HelpSupport;
