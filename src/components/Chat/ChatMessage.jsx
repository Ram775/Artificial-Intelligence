import React from 'react';
import { User, Bot, Cpu, AlertCircle } from 'lucide-react';

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';
  const isStreaming = message.isStreaming || false;
  const isError = message.content?.startsWith('Error:');

  return (
    <div className={`flex gap-2.5 max-w-[85%] animate-slide-in ${isUser ? 'self-end flex-row-reverse' : 'self-start'}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-600'
      }`}>
        {isUser ? <User size={18} /> : <Bot size={18} />}
      </div>
      <div className="flex flex-col gap-1">
        <div className={`px-3.5 py-2.5 rounded-xl break-words leading-relaxed ${
          isUser 
            ? 'bg-primary-500 text-white rounded-br-none' 
            : isError
              ? 'bg-red-50 border border-red-200 text-red-700 rounded-bl-none'
              : 'bg-white border border-gray-200 rounded-bl-none text-gray-800'
        }`}>
          {message.content || (isStreaming ? '...' : '')}
          {isStreaming && message.content && (
            <span className="inline-block animate-blink">▌</span>
          )}
        </div>
        
        {/* Model Information */}
        {!isUser && message.modelInfo && !isStreaming && (
          <div className="flex items-center gap-1.5 text-[10px] text-gray-400 px-1">
            <Cpu size={12} />
            <span>{message.modelInfo}</span>
            {message.fallbackUsed && (
              <span className="text-yellow-500 flex items-center gap-0.5">
                <AlertCircle size={10} />
                (Fallback)
              </span>
            )}
            {message.attempts && message.attempts > 1 && (
              <span className="text-gray-400">
                • {message.attempts} attempts
              </span>
            )}
          </div>
        )}
        
        <div className={`text-[10px] text-gray-400 px-1 ${isUser ? 'text-right' : ''}`}>
          {message.timestamp?.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;