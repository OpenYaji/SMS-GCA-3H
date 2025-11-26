import React, { useState, useEffect } from 'react';

const ScrollUpButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-[4.75rem] sm:bottom-[5.5rem] md:bottom-[6rem] md:right-7 right-4 z-40 w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-[#F4D77D] dark:bg-amber-400 text-[#5B3E31] border-2 border-[#5B3E31] dark:border-gray-900 dark:text-gray-900 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 pointer-events-none'}`}
            aria-label="Scroll to top"
        >
            <svg
                className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
            </svg>
        </button>
    );
};

export default ScrollUpButton;
