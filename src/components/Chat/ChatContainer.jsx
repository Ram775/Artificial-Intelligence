import React from 'react';
import { useChatContext } from '../../context/ChatContext';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

const ChatContainer = () => {
  const { isLoading } = useChatContext();

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-2xl overflow-hidden">
      <ChatHeader />
      <ChatMessages />
      <ChatInput disabled={isLoading} />
    </div>
  );
};

export default ChatContainer;