import React from 'react';

const Card = ({ title, children, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-xl p-6 ${className}`}>
    <h2 className="text-xl font-semibold text-stone-800 mb-4">{title}</h2>
    {children}
  </div>
);

export default Card;
