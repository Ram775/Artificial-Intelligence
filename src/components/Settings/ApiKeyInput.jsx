import React, { useState } from 'react';
import { Eye, EyeOff, Key } from 'lucide-react';

const ApiKeyInput = ({ value, onChange, placeholder = 'Enter your API key' }) => {
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-medium text-sm text-gray-700 flex items-center gap-2">
        <Key size={16} className="text-primary-500" />
        API Key
      </label>
      <div className="relative">
        <input
          type={showKey ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm transition-colors duration-300 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
        />
        <button
          type="button"
          onClick={() => setShowKey(!showKey)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      <small className="text-gray-500 text-xs">
        Get your key from <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-primary-500 no-underline hover:underline">OpenRouter Dashboard</a>
      </small>
    </div>
  );
};

export default ApiKeyInput;