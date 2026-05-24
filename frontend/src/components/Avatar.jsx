import React from 'react';

const Avatar = ({ children, className = '' }) => {
  return (
    <div 
      className={`
        inline-flex items-center justify-center 
        h-9 w-9 rounded-xl font-bold text-sm tracking-wide 
        bg-theme-accent-primary text-white shadow-inner 
        transition-all transform hover:scale-105 active:scale-98
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Avatar;