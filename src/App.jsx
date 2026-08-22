import React, { useState } from 'react';
import { ChatProvider } from './context/ChatContext';
import ChatContainer from './components/Chat/ChatContainer';
import SettingsModal from './components/Settings/SettingsModal';
import { Settings } from 'lucide-react';
import './App.css';

function App() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <ChatProvider>
      <div className="app-container">
        <button 
          className="settings-toggle"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings size={16} />
          Settings
        </button>
        <ChatContainer />
        {showSettings && (
          <SettingsModal onClose={() => setShowSettings(false)} />
        )}
      </div>
    </ChatProvider>
  );
}

export default App;