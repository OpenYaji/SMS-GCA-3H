import React from 'react';

const NavItem = ({ name, Icon, active, onClick }) => (
  <button
    className={`
      flex items-center p-3 my-2 mx-4 text-sm font-medium rounded-xl transition-all duration-200 w-full
      ${active
        ? 'bg-amber-300 text-stone-900 shadow-lg'
        : 'text-stone-300 hover:bg-stone-700 hover:text-white'
      }
    `}
    onClick={() => onClick(name)}
  >
    <Icon className="w-5 h-5 mr-3" />
    {name}
  </button>
);

export default NavItem;
