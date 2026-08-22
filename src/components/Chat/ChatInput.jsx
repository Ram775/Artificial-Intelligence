import React, { useState, useRef, useEffect } from 'react';
import { useChatContext } from '../../context/ChatContext';
import { Send } from 'lucide-react';

const ChatInput = ({ disabled }) => {
  const [input, setInput] = useState('');
  const { sendChatMessage } = useChatContext();
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  }, [input]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      const message = input;
      setInput('');
      await sendChatMessage(message);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className="flex gap-2.5 p-4 bg-white border-t border-gray-200 items-end" onSubmit={handleSubmit}>
      <textarea
        ref={textareaRef}
        className="flex-1 px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-inherit resize-none max-h-[150px] leading-relaxed transition-colors duration-300 bg-gray-50 focus:outline-none focus:border-primary-500 focus:bg-white disabled:opacity-60 disabled:cursor-not-allowed"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        disabled={disabled}
        rows={1}
      />
      <button 
        type="submit" 
        className="w-11 h-11 rounded-xl border-none bg-primary-500 text-white cursor-pointer flex items-center justify-center transition-all duration-300 hover:bg-primary-600 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex-shrink-0"
        disabled={!input.trim() || disabled}
      >
        <Send size={20} />
      </button>
    </form>
  );
};

export default ChatInput;