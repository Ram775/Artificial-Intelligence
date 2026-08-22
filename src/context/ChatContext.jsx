import React, { createContext, useState, useContext, useCallback } from 'react';
import { 
  sendMessageWithFallback, 
  sendStreamingMessageWithFallback,
  getModelPerformance,
  getBestModel,
  getSmartModelSelection
} from '../api/openrouter';
import { DEFAULT_SETTINGS, FALLBACK_STRATEGIES } from '../utils/constants';

const ChatContext = createContext();

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_OPENROUTER_API_KEY || '');
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [currentModel, setCurrentModel] = useState(null);
  const [modelPerformance, setModelPerformance] = useState({});
  const [failedModels, setFailedModels] = useState([]);

  const sendChatMessage = useCallback(async (content) => {
    if (!content.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);
    setFailedModels([]);

    const assistantMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
      modelInfo: null
    };

    setMessages(prev => [...prev, assistantMessage]);

    const messagesForAPI = [...messages, userMessage].map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    try {
      // Smart model selection
      const modelList = getSmartModelSelection(
        [settings.model, ...settings.fallbackModels],
        FALLBACK_STRATEGIES.SMART
      );

      const primaryModel = modelList[0] || settings.model;
      const fallbackModels = modelList.slice(1);

      console.log('📋 Model selection:', {
        primary: primaryModel,
        fallbacks: fallbackModels,
        allModels: modelList
      });

      if (settings.streamEnabled) {
        let modelUsed = null;
        let isFirstChunk = true;

        await sendStreamingMessageWithFallback(
          messagesForAPI,
          (chunk) => {
            if (isFirstChunk && modelUsed) {
              setMessages(prev => 
                prev.map(msg => 
                  msg.id === assistantMessage.id 
                    ? { ...msg, modelInfo: modelUsed }
                    : msg
                )
              );
              isFirstChunk = false;
            }
            
            setMessages(prev => 
              prev.map(msg => 
                msg.id === assistantMessage.id 
                  ? { ...msg, content: msg.content + chunk }
                  : msg
              )
            );
          },
          {
            primaryModel,
            fallbackModels,
            maxRetries: settings.maxRetries || 3,
            apiKey: apiKey || import.meta.env.VITE_OPENROUTER_API_KEY,
            reasoningEnabled: settings.reasoningEnabled,
            maxTokens: settings.maxTokens,
            temperature: settings.temperature,
            topP: settings.topP,
            onModelChange: (model) => {
              modelUsed = model;
              setCurrentModel(model);
              setMessages(prev => 
                prev.map(msg => 
                  msg.id === assistantMessage.id 
                    ? { ...msg, modelInfo: model }
                    : msg
                )
              );
            },
            onModelFail: (model, error) => {
              setFailedModels(prev => [...prev, { model, error: error.message }]);
            }
          }
        );
        
        setMessages(prev => 
          prev.map(msg => 
            msg.id === assistantMessage.id 
              ? { ...msg, isStreaming: false }
              : msg
          )
        );
      } else {
        const response = await sendMessageWithFallback(messagesForAPI, {
          primaryModel,
          fallbackModels,
          maxRetries: settings.maxRetries || 3,
          apiKey: apiKey || import.meta.env.VITE_OPENROUTER_API_KEY,
          reasoningEnabled: settings.reasoningEnabled,
          maxTokens: settings.maxTokens,
          temperature: settings.temperature,
          topP: settings.topP
        });

        const assistantResponse = response.choices[0]?.message?.content || 'No response received';
        const modelInfo = response._meta?.model || 'Unknown';
        
        setCurrentModel(modelInfo);
        setMessages(prev => 
          prev.map(msg => 
            msg.id === assistantMessage.id 
              ? { 
                  ...msg, 
                  content: assistantResponse, 
                  isStreaming: false,
                  modelInfo: modelInfo,
                  attempts: response._meta?.attempts,
                  fallbackUsed: response._meta?.fallbackUsed
                }
              : msg
          )
        );
      }

      // Update performance stats
      const performance = getModelPerformance();
      setModelPerformance(performance);
      
    } catch (err) {
      setError(err.message);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === assistantMessage.id 
            ? { 
                ...msg, 
                content: `Error: ${err.message}`, 
                isStreaming: false,
                modelInfo: 'Error'
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [messages, apiKey, settings]);

  const clearMessages = () => {
    setMessages([]);
    setCurrentModel(null);
    setError(null);
    setFailedModels([]);
  };

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const setApiKeyValue = (key) => {
    setApiKey(key);
    localStorage.setItem('openrouter_api_key', key);
  };

  const getBestPerformingModel = () => {
    return getBestModel();
  };

  const getModelStats = () => {
    return getModelPerformance();
  };

  return (
    <ChatContext.Provider value={{
      messages,
      isLoading,
      error,
      apiKey,
      settings,
      currentModel,
      modelPerformance,
      failedModels,
      sendChatMessage,
      clearMessages,
      updateSettings,
      setApiKey: setApiKeyValue,
      getBestPerformingModel,
      getModelStats
    }}>
      {children}
    </ChatContext.Provider>
  );
};