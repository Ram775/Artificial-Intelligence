import React, { useRef, useEffect } from 'react';
import { useChatContext } from '../../context/ChatContext';
import ChatMessage from './ChatMessage';
import TypingIndicator from '../UI/TypingIndicator';
import EmptyState from '../UI/EmptyState';
import { AlertCircle } from 'lucide-react';

const ChatMessages = () => {
  const { messages, isLoading, error, failedModels } = useChatContext();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-5 py-4 bg-gray-50 flex flex-col gap-3 scrollbar-thin">
      {messages.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {failedModels.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2 text-sm text-yellow-800">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Some models failed:</p>
                <ul className="text-xs list-disc list-inside text-yellow-700">
                  {failedModels.map((fm, idx) => (
                    <li key={idx}>{fm.model} - {fm.error}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </>
      )}
      {isLoading && (
        <div className="flex gap-2.5 max-w-[85%] self-start animate-slide-in">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-base bg-gray-200 flex-shrink-0">
            🤖
          </div>
          <TypingIndicator />
        </div>
      )}
      {error && !isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;