import React from 'react';

const Input = ({ 
  type = 'text', 
  label, 
  error, 
  className = '', 
  ...props 
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="font-medium text-sm text-gray-700">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`px-3 py-2 border rounded-lg text-sm transition-colors duration-300 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
      {error && (
        <span className="text-red-500 text-xs">{error}</span>
      )}
    </div>
  );
};

export default Input;