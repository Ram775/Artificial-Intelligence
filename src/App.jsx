import React from 'react';
import { ChatProvider } from './context/ChatContext';
import ChatContainer from './components/Chat/ChatContainer';

function App() {
  return (
    <ChatProvider>
      <div className="w-full h-full bg-white rounded-none md:rounded-2xl md:shadow-2xl flex flex-col overflow-hidden md:max-w-[2400px] md:h-[100vh]">
        <ChatContainer />
      </div>
    </ChatProvider>
  );
}

export default App;