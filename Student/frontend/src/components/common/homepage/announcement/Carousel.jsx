import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DRAG_BUFFER = 50;
const SPRING_OPTIONS = {
  type: "spring",
  mass: 0.5,
  stiffness: 400,
  damping: 50,
};

export default function Carousel({
  items = [],
  baseWidth = 400, 
  height = 420,   
  autoplay = false,
  autoplayDelay = 4000,
  pauseOnHover = true,
  loop = true,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (autoplay && !isHovered) {
        setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
      }
    }, autoplayDelay);
    return () => clearInterval(interval);
  }, [items, autoplay, autoplayDelay, isHovered]);

  const handleDragEnd = (e, { offset, velocity }) => {
    if (offset.x > DRAG_BUFFER) {
      setCurrentIndex((prev) => (prev === 0 ? (loop ? items.length - 1 : 0) : prev - 1));
    } else if (offset.x < -DRAG_BUFFER) {
      setCurrentIndex((prev) => (prev === items.length - 1 ? (loop ? 0 : items.length - 1) : prev + 1));
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => pauseOnHover && setIsHovered(true)}
      onMouseLeave={() => pauseOnHover && setIsHovered(false)}
      className="relative w-full max-w-lg mx-auto overflow-hidden" 
    >
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        className="relative flex h-full cursor-grab active:cursor-grabbing"
        animate={{ x: `-${currentIndex * 100}%` }}
        transition={SPRING_OPTIONS}
      >
        {items.map((item) => (
          <motion.div
            key={item.id}
            className="relative w-full shrink-0"
          >
            <div className="block w-full rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
              <div
                className="w-full bg-gray-200 dark:bg-gray-700 rounded-t-xl bg-cover bg-center"
                style={{
                  backgroundImage: `url(${item.image})`,
                  height: `${height * 0.6}px`, 
                }}
              />
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{item.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="absolute bottom-1 left-0 right-0">
        <div className="flex justify-center gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 w-2 rounded-full transition-colors ${
                currentIndex === index ? 'bg-gray-800 dark:bg-white' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}