import { useRef, useState } from 'react';

const SpotlightCard = ({ 
  children, 
  className = '', 
  spotlightColor = 'rgba(244, 215, 125, 0.6)',
  darkSpotlightColor = 'rgba(251, 191, 36, 0.6)'
}) => {
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for dark mode
  const checkDarkMode = () => {
    return document.documentElement.classList.contains('dark');
  };

  const handleMouseMove = e => {
    if (!divRef.current || isFocused) return;

    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setIsDarkMode(checkDarkMode());
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(0.6);
    setIsDarkMode(checkDarkMode());
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(0.6);
    setIsDarkMode(checkDarkMode());
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  const currentSpotlightColor = isDarkMode ? darkSpotlightColor : spotlightColor;

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-3xl border border-[#F4D77D] dark:border-gray-800 bg-[#F4D77D] dark:bg-gray-800 overflow-hidden p-5 transition-colors duration-300 ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
        style={{
          opacity,
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${currentSpotlightColor}, transparent 80%)`
        }}
      />
      {children}
    </div>
  );
};

export default SpotlightCard;