import React, { useState, useRef, useEffect } from 'react';

const HelpSupport = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m the Gymnazo Christian Academy assistant. How can I help you today? Feel free to ask about admissions, programs, facilities, or contact information.',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const SCHOOL_CONTEXT = `
You are a helpful assistant for Gymnazo Christian Academy Novaliches. 
You should ONLY answer questions related to the school.

School Information:
- Name: Gymnazo Christian Academy
- Location: 268 Zabala St. Cor. Luahati St. Tondo, Manila, Manila, Philippines
- Contact: 282472450
- Email: gymnazochristianacademy@gmail.com
- Mission: Committed to the formation of values and education among learners
- Type: Christian Academy

If users ask questions unrelated to the school, politely redirect them to ask about:
- Admissions and enrollment
- Academic programs
- School facilities
- Contact information
- School policies
- Events and announcements

Keep responses concise, friendly, and professional. If you don't know something specific about the school, suggest contacting the school office directly.
`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleHelp = () => {
    setIsHelpOpen(!isHelpOpen);
  };

  const sendMessageToGemini = async (userMessage) => {
    try {
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${SCHOOL_CONTEXT}\n\nUser question: ${userMessage}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API Error:', errorData);
        throw new Error('Failed to get response from Gemini API');
      }

      const data = await response.json();
      const aiResponse = data.candidates[0]?.content?.parts[0]?.text || 
        "I'm sorry, I couldn't process that. Please try rephrasing your question about the school.";

      return aiResponse;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return "I'm having trouble connecting right now. Please try again later or contact the school directly at gymnazochristianacademy@gmail.com or call 282472450.";
    }
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

    const aiResponse = await sendMessageToGemini(userMessage);

    setMessages(prev => [...prev, {
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    }]);

    setIsLoading(false);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        {isHelpOpen && (
          <div className="mb-4 w-72 sm:w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 animate-slideUp">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#F4D77D] to-[#F7C236] dark:from-amber-600 dark:to-amber-700 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#5B3E31] dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-white text-xs">GCA Assistant</h3>
                  <p className="text-[10px] text-white/80">Powered by AI</p>
                </div>
              </div>
              <button 
                onClick={toggleHelp}
                className="text-white hover:bg-white/20 rounded-full p-1 transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-3 h-64 overflow-y-auto bg-gray-50 dark:bg-gray-900 space-y-2">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-6 h-6 bg-[#F4D77D] dark:bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  <div className={`rounded-lg p-2 max-w-[75%] shadow-sm ${
                    message.role === 'user' 
                      ? 'bg-[#F4D77D] dark:bg-amber-600 text-white' 
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                  }`}>
                    <p className="text-xs whitespace-pre-wrap break-words">{message.content}</p>
                    <span className={`text-[10px] mt-1 block ${
                      message.role === 'user' 
                        ? 'text-white/80' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-6 h-6 bg-[#5B3E31] dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-2 justify-start">
                  <div className="w-6 h-6 bg-[#F4D77D] dark:bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask about the school..."
                  disabled={isLoading}
                  className="flex-1 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F4D77D] dark:focus:ring-amber-500 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs disabled:opacity-50"
                />
                <button 
                  type="submit"
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-[#F4D77D] hover:bg-[#F7C236] dark:bg-amber-600 dark:hover:bg-amber-700 text-white rounded-full p-1.5 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
              <div className="mt-1.5 text-[10px] text-gray-600 dark:text-gray-400 text-center">
                Email: <a href="mailto:gymnazochristianacademy@gmail.com" className="hover:text-[#F4D77D] dark:hover:text-amber-400 transition-colors">gymnazochristianacademy@gmail.com</a>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={toggleHelp}
          className="bg-gradient-to-r from-[#F4D77D] to-[#F7C236] dark:from-amber-600 dark:to-amber-700 text-white w-12 h-12 rounded-full shadow-2xl flex items-center justify-center relative"
          aria-label="Help & Support"
        >
          {isHelpOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
              </svg>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
            </>
          )}
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