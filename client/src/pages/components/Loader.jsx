import React from 'react';

const Loader = ({ size = 'md', color = 'blue' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const colorClasses = {
    blue: 'border-blue-500',
    green: 'border-green-500',
    purple: 'border-purple-500',
    red: 'border-red-500'
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`
          ${sizeClasses[size]}
          border-4
          border-gray-200
          ${colorClasses[color]}
          border-t-transparent
          rounded-full
          animate-spin
        `}
      />
      <div className="sr-only">Loading...</div>
    </div>
  );
};

export default Loader;