import React from 'react';

const Loader = ({ size = 'md', color = 'primary' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  const colors = {
    primary: 'border-primary-500',
    white: 'border-white',
    gray: 'border-gray-500'
  };

  return (
    <div className="flex justify-center items-center">
      <div 
        className={`${sizes[size]} ${colors[color]} border-t-transparent rounded-full animate-spin`}
      />
    </div>
  );
};

export default Loader;