import React, { useState } from 'react';
import { useChatContext } from '../../context/ChatContext';
import { Trash2, Bot, Circle, Activity, Cpu } from 'lucide-react';

const ChatHeader = () => {
  const { isLoading, clearMessages, currentModel, modelPerformance } = useChatContext();
  const [showStats, setShowStats] = useState(false);

  const getModelDisplayName = (modelId) => {
    if (!modelId) return 'AI Assistant';
    const name = modelId.split('/').pop().replace(/-/g, ' ');
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <div className="flex justify-between items-center px-5 py-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-b border-white/10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center relative">
          <Bot size={24} className="text-white" />
          {currentModel && !isLoading && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center border-2 border-white">
              <Activity size={10} className="text-white" />
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold m-0">AI Assistant</h2>
            {currentModel && !isLoading && (
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">
                {getModelDisplayName(currentModel)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs opacity-90">
            <Circle 
              size={8} 
              className={`fill-current ${isLoading ? 'text-yellow-400 animate-pulse' : 'text-green-400'}`} 
            />
            <span>{isLoading ? 'Thinking...' : 'Online'}</span>
            {Object.keys(modelPerformance).length > 0 && (
              <button
                onClick={() => setShowStats(!showStats)}
                className="ml-2 bg-white/10 px-2 py-0.5 rounded-full text-[10px] hover:bg-white/20 transition-colors flex items-center gap-1"
              >
                <Cpu size={10} />
                Stats
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button 
          className="bg-white/15 border-none text-white px-3 py-2 rounded-lg cursor-pointer transition-all duration-300 hover:bg-white/25 flex items-center gap-1.5"
          onClick={clearMessages}
          title="Clear chat"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;