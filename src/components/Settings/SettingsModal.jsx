import React, { useState } from 'react';
import { useChatContext } from '../../context/ChatContext';
import { AVAILABLE_MODELS, FALLBACK_STRATEGIES } from '../../utils/constants';
import { 
  X, Key, Cpu, Thermometer, FileText, Check, Brain, Zap, 
  Layers, RefreshCw, AlertTriangle, Activity
} from 'lucide-react';

const SettingsModal = ({ onClose }) => {
  const { apiKey, settings, updateSettings, setApiKey, getModelStats } = useChatContext();
  const [localApiKey, setLocalApiKey] = useState(apiKey || '');
  const [localSettings, setLocalSettings] = useState(settings);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const modelStats = getModelStats();

  const handleSave = () => {
    setApiKey(localApiKey);
    updateSettings(localSettings);
    onClose();
  };

  const toggleFallbackModel = (modelId) => {
    const currentFallbacks = localSettings.fallbackModels || [];
    if (currentFallbacks.includes(modelId)) {
      setLocalSettings({
        ...localSettings,
        fallbackModels: currentFallbacks.filter(id => id !== modelId)
      });
    } else {
      setLocalSettings({
        ...localSettings,
        fallbackModels: [...currentFallbacks, modelId]
      });
    }
  };

  const getModelSuccessRate = (modelId) => {
    const stats = modelStats[modelId];
    if (!stats) return null;
    return Math.round(stats.successRate);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-[90%] max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-800 m-0 flex items-center gap-2">
            <Cpu size={20} className="text-primary-500" />
            Settings
          </h2>
          <button 
            className="bg-none border-none p-2 rounded-lg cursor-pointer text-gray-500 transition-all duration-300 hover:bg-gray-100 hover:text-gray-700"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 flex flex-col gap-5">
          {/* API Key */}
          <div className="flex flex-col gap-1.5">
            <label className="font-medium text-sm text-gray-700 flex items-center gap-2">
              <Key size={16} className="text-primary-500" />
              API Key
            </label>
            <input
              type="password"
              value={localApiKey}
              onChange={(e) => setLocalApiKey(e.target.value)}
              placeholder="Enter your OpenRouter API key"
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm transition-colors duration-300 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            />
            <small className="text-gray-500 text-xs">
              Get your key from <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-primary-500 no-underline hover:underline">OpenRouter Dashboard</a>
            </small>
          </div>

          {/* Primary Model */}
          <div className="flex flex-col gap-1.5">
            <label className="font-medium text-sm text-gray-700 flex items-center gap-2">
              <Cpu size={16} className="text-primary-500" />
              Primary Model
            </label>
            <select
              value={localSettings.model}
              onChange={(e) => setLocalSettings({ ...localSettings, model: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm transition-colors duration-300 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            >
              {AVAILABLE_MODELS.map(model => (
                <option key={model.id} value={model.id}>
                  {model.name} {model.free ? '(Free)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Fallback Models */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-sm text-gray-700 flex items-center gap-2">
              <Layers size={16} className="text-primary-500" />
              Fallback Models
            </label>
            <p className="text-xs text-gray-500">
              Select backup models to use if the primary model fails
            </p>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_MODELS.filter(m => m.id !== localSettings.model).map(model => {
                const isSelected = localSettings.fallbackModels?.includes(model.id);
                const successRate = getModelSuccessRate(model.id);
                
                return (
                  <button
                    key={model.id}
                    onClick={() => toggleFallbackModel(model.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                      isSelected 
                        ? 'bg-primary-500 text-white hover:bg-primary-600' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {model.name.split(' ')[0]}
                    {successRate !== null && (
                      <span className={`text-[8px] ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>
                        {successRate}%
                      </span>
                    )}
                    {isSelected && <Check size={12} />}
                  </button>
                );
              })}
            </div>
            {localSettings.fallbackModels?.length === 0 && (
              <p className="text-xs text-yellow-600 flex items-center gap-1">
                <AlertTriangle size={12} />
                No fallback models selected
              </p>
            )}
          </div>

          {/* Temperature */}
          <div className="flex flex-col gap-1.5">
            <label className="font-medium text-sm text-gray-700 flex items-center gap-2">
              <Thermometer size={16} className="text-primary-500" />
              Temperature: {localSettings.temperature}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={localSettings.temperature}
              onChange={(e) => setLocalSettings({ ...localSettings, temperature: parseFloat(e.target.value) })}
              className="w-full accent-primary-500"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Precise</span>
              <span>Balanced</span>
              <span>Creative</span>
            </div>
          </div>

          {/* Max Tokens */}
          <div className="flex flex-col gap-1.5">
            <label className="font-medium text-sm text-gray-700 flex items-center gap-2">
              <FileText size={16} className="text-primary-500" />
              Max Tokens
            </label>
            <input
              type="number"
              min="100"
              max="4000"
              step="100"
              value={localSettings.maxTokens}
              onChange={(e) => setLocalSettings({ ...localSettings, maxTokens: parseInt(e.target.value) })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm transition-colors duration-300 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          {/* Advanced Settings */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1 font-medium"
          >
            <RefreshCw size={14} className={`${showAdvanced ? 'rotate-180' : ''} transition-transform`} />
            {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
          </button>

          {showAdvanced && (
            <div className="border-t border-gray-200 pt-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-medium text-sm text-gray-700 flex items-center gap-2">
                  <RefreshCw size={16} className="text-primary-500" />
                  Max Retries
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={localSettings.maxRetries || 3}
                  onChange={(e) => setLocalSettings({ ...localSettings, maxRetries: parseInt(e.target.value) })}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm transition-colors duration-300 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                />
                <small className="text-xs text-gray-500">Number of models to try before giving up</small>
              </div>

              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={localSettings.reasoningEnabled}
                      onChange={(e) => setLocalSettings({ ...localSettings, reasoningEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-md peer-checked:bg-primary-500 peer-checked:border-primary-500 transition-all duration-200 flex items-center justify-center">
                      {localSettings.reasoningEnabled && <Check size={14} className="text-white" />}
                    </div>
                  </div>
                  <span className="text-sm text-gray-700 flex items-center gap-2 group-hover:text-gray-900 transition-colors">
                    <Brain size={16} className="text-primary-500" />
                    Enable Reasoning
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={localSettings.streamEnabled}
                      onChange={(e) => setLocalSettings({ ...localSettings, streamEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-md peer-checked:bg-primary-500 peer-checked:border-primary-500 transition-all duration-200 flex items-center justify-center">
                      {localSettings.streamEnabled && <Check size={14} className="text-white" />}
                    </div>
                  </div>
                  <span className="text-sm text-gray-700 flex items-center gap-2 group-hover:text-gray-900 transition-colors">
                    <Zap size={16} className="text-primary-500" />
                    Enable Streaming
                  </span>
                </label>
              </div>

              {/* Model Performance Stats */}
              {Object.keys(modelStats).length > 0 && (
                <div className="border-t border-gray-200 pt-4">
                  <label className="font-medium text-sm text-gray-700 flex items-center gap-2 mb-2">
                    <Activity size={16} className="text-primary-500" />
                    Model Performance
                  </label>
                  <div className="space-y-1.5">
                    {Object.entries(modelStats)
                      .sort((a, b) => b[1].successRate - a[1].successRate)
                      .slice(0, 5)
                      .map(([modelId, stats]) => (
                        <div key={modelId} className="flex items-center justify-between text-xs">
                          <span className="text-gray-600 truncate max-w-[120px]">
                            {modelId.split('/').pop()}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  stats.successRate > 80 ? 'bg-green-500' :
                                  stats.successRate > 50 ? 'bg-yellow-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${stats.successRate}%` }}
                              />
                            </div>
                            <span className="text-gray-500 w-10 text-right">
                              {Math.round(stats.successRate)}%
                            </span>
                            <span className="text-gray-400">
                              {stats.avgResponseTime}ms
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 bg-white">
          <button 
            className="px-5 py-2 border-none rounded-lg text-sm font-medium cursor-pointer transition-all duration-300 bg-gray-100 text-gray-700 hover:bg-gray-200"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="px-5 py-2 border-none rounded-lg text-sm font-medium cursor-pointer transition-all duration-300 bg-primary-500 text-white hover:bg-primary-600 hover:scale-105 flex items-center gap-2"
            onClick={handleSave}
          >
            <Check size={16} />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;