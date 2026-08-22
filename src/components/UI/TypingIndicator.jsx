import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex gap-1.5 px-3.5 py-2.5 bg-white rounded-xl border border-gray-200 items-center">
      <div className="w-2 h-2 rounded-full bg-gray-400 animate-typing"></div>
      <div className="w-2 h-2 rounded-full bg-gray-400 animate-typing" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-2 h-2 rounded-full bg-gray-400 animate-typing" style={{ animationDelay: '0.4s' }}></div>
    </div>
  );
};

export default TypingIndicator;