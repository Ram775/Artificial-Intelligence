import React from 'react';
import { MessageSquare } from 'lucide-react';

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center">
      <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mb-4">
        <MessageSquare size={40} className="text-primary-500" />
      </div>
      <h3 className="text-xl mb-2 text-gray-700 font-semibold">Start a conversation</h3>
      <p className="text-sm text-gray-500 max-w-xs">
        Ask me anything! I'm here to help with your questions and tasks.
      </p>
    </div>
  );
};

export default EmptyState;