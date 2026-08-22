import axios from 'axios';

const API_BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';
const TIMEOUT = 30000;

// Model performance tracking
const modelPerformance = new Map();

// Function to send message with fallback
export const sendMessageWithFallback = async (messages, options = {}) => {
  const {
    primaryModel = 'dots-studio/dots-3-note-preview:free',
    fallbackModels = ['openai/gpt-4o', 'anthropic/claude-3.5-sonnet'],
    maxRetries = 3,
    apiKey = import.meta.env.VITE_OPENROUTER_API_KEY,
    ...otherOptions
  } = options;

  if (!apiKey) {
    throw new Error('API key is required. Please set your OpenRouter API key.');
  }

  // Create model list with primary first, then fallbacks
  const modelList = [primaryModel, ...fallbackModels];
  let lastError = null;

  for (let i = 0; i < Math.min(modelList.length, maxRetries); i++) {
    const model = modelList[i];
    
    try {
      console.log(`🔄 Attempting with model: ${model} (${i + 1}/${Math.min(modelList.length, maxRetries)})`);
      
      const startTime = Date.now();
      const response = await sendMessage(messages, {
        ...otherOptions,
        model,
        apiKey
      });
      const responseTime = Date.now() - startTime;
      
      // Track successful response
      trackModelPerformance(model, true, responseTime);
      
      console.log(`✅ Success with model: ${model} (${responseTime}ms)`);
      
      return {
        ...response,
        _meta: {
          model,
          responseTime,
          attempts: i + 1,
          fallbackUsed: i > 0
        }
      };
    } catch (error) {
      lastError = error;
      const errorMessage = error.response?.data?.error?.message || error.message;
      console.warn(`❌ Model ${model} failed: ${errorMessage}`);
      
      // Track failed response
      trackModelPerformance(model, false);
      
      // Check if we should continue to next model
      const shouldContinue = shouldRetryError(error, i, modelList.length, maxRetries);
      
      if (!shouldContinue) {
        break;
      }
      
      // Wait before next attempt (exponential backoff)
      if (i < modelList.length - 1) {
        const delay = Math.min(1000 * Math.pow(2, i), 8000);
        console.log(`⏳ Waiting ${delay}ms before next attempt...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw new Error(`All models failed. Last error: ${lastError?.message || 'Unknown error'}`);
};

// Function to send streaming message with fallback
export const sendStreamingMessageWithFallback = async (messages, onChunk, options = {}) => {
  const {
    primaryModel = 'dots-studio/dots-3-note-preview:free',
    fallbackModels = ['openai/gpt-4o', 'anthropic/claude-3.5-sonnet'],
    maxRetries = 3,
    apiKey = import.meta.env.VITE_OPENROUTER_API_KEY,
    ...otherOptions
  } = options;

  if (!apiKey) {
    throw new Error('API key is required. Please set your OpenRouter API key.');
  }

  const modelList = [primaryModel, ...fallbackModels];
  let lastError = null;

  for (let i = 0; i < Math.min(modelList.length, maxRetries); i++) {
    const model = modelList[i];
    
    try {
      console.log(`🔄 Streaming with model: ${model} (${i + 1}/${Math.min(modelList.length, maxRetries)})`);
      
      const startTime = Date.now();
      await sendStreamingMessage(messages, onChunk, {
        ...otherOptions,
        model,
        apiKey
      });
      const responseTime = Date.now() - startTime;
      
      // Track successful response
      trackModelPerformance(model, true, responseTime);
      
      console.log(`✅ Streaming success with model: ${model} (${responseTime}ms)`);
      
      return {
        _meta: {
          model,
          responseTime,
          attempts: i + 1,
          fallbackUsed: i > 0
        }
      };
    } catch (error) {
      lastError = error;
      const errorMessage = error.response?.data?.error?.message || error.message;
      console.warn(`❌ Streaming model ${model} failed: ${errorMessage}`);
      
      // Track failed response
      trackModelPerformance(model, false);
      
      const shouldContinue = shouldRetryError(error, i, modelList.length, maxRetries);
      
      if (!shouldContinue) {
        break;
      }
      
      if (i < modelList.length - 1) {
        const delay = Math.min(1000 * Math.pow(2, i), 8000);
        console.log(`⏳ Waiting ${delay}ms before next attempt...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw new Error(`All models failed for streaming. Last error: ${lastError?.message || 'Unknown error'}`);
};

// Core sendMessage function
export const sendMessage = async (messages, options = {}) => {
  const {
    model = 'dots-studio/dots-3-note-preview:free',
    apiKey = import.meta.env.VITE_OPENROUTER_API_KEY,
    reasoningEnabled = true,
    maxTokens = 1000,
    temperature = 0.7,
    topP = 0.9,
    stream = false,
    timeout = TIMEOUT,
    ...otherOptions
  } = options;

  const requestBody = {
    model,
    messages,
    reasoning: { enabled: reasoningEnabled },
    max_tokens: maxTokens,
    temperature,
    top_p: topP,
    stream,
    ...otherOptions
  };

  try {
    const response = await axios.post(API_BASE_URL, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': options.siteUrl || window.location.origin,
        'X-Title': options.siteName || 'AI Chat Bot'
      },
      timeout
    });

    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
};

// Core sendStreamingMessage function
export const sendStreamingMessage = async (messages, onChunk, options = {}) => {
  const {
    model = 'dots-studio/dots-3-note-preview:free',
    apiKey = import.meta.env.VITE_OPENROUTER_API_KEY,
    reasoningEnabled = true,
    maxTokens = 1000,
    temperature = 0.7,
    topP = 0.9,
    timeout = TIMEOUT,
    ...otherOptions
  } = options;

  const requestBody = {
    model,
    messages,
    reasoning: { enabled: reasoningEnabled },
    max_tokens: maxTokens,
    temperature,
    top_p: topP,
    stream: true,
    ...otherOptions
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': options.siteUrl || window.location.origin,
        'X-Title': options.siteName || 'AI Chat Bot'
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to get streaming response');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;
          
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              onChunk(content);
            }
          } catch (e) {
            console.error('Error parsing stream data:', e);
          }
        }
      }
    }
  } catch (error) {
    console.error('Streaming Error:', error);
    throw error;
  }
};

// Model performance tracking
const trackModelPerformance = (modelId, success, responseTime = 0) => {
  if (!modelPerformance.has(modelId)) {
    modelPerformance.set(modelId, {
      successCount: 0,
      failCount: 0,
      totalResponseTime: 0,
      requestCount: 0,
      lastUsed: Date.now()
    });
  }

  const stats = modelPerformance.get(modelId);
  stats.requestCount++;
  stats.lastUsed = Date.now();

  if (success) {
    stats.successCount++;
    stats.totalResponseTime += responseTime;
  } else {
    stats.failCount++;
  }

  modelPerformance.set(modelId, stats);
};

// Get model performance stats
export const getModelPerformance = () => {
  const result = {};
  for (const [modelId, stats] of modelPerformance) {
    const total = stats.successCount + stats.failCount;
    result[modelId] = {
      successRate: total > 0 ? (stats.successCount / total) * 100 : 0,
      avgResponseTime: stats.successCount > 0 ? stats.totalResponseTime / stats.successCount : 0,
      requestCount: stats.requestCount,
      successCount: stats.successCount,
      failCount: stats.failCount,
      lastUsed: stats.lastUsed
    };
  }
  return result;
};

// Get best performing model
export const getBestModel = () => {
  let bestModel = null;
  let bestScore = -1;

  for (const [modelId, stats] of modelPerformance) {
    const total = stats.successCount + stats.failCount;
    if (total > 0) {
      const successRate = stats.successCount / total;
      const avgTime = stats.successCount > 0 ? stats.totalResponseTime / stats.successCount : Infinity;
      // Score: success rate weighted heavily, with slight penalty for slow responses
      const score = successRate * 100 - (avgTime / 100);
      
      if (score > bestScore) {
        bestScore = score;
        bestModel = modelId;
      }
    }
  }

  return bestModel;
};

// Error handling logic
const shouldRetryError = (error, attempt, totalModels, maxRetries) => {
  // Don't retry if we've reached the limit
  if (attempt >= maxRetries - 1 || attempt >= totalModels - 1) {
    return false;
  }

  const status = error.response?.status;
  
  // Don't retry on authentication errors
  if (status === 401 || status === 403) {
    return false;
  }
  
  // Don't retry on invalid request
  if (status === 400) {
    return false;
  }

  // Retry on rate limits, timeouts, server errors
  if (status === 429 || status === 500 || status === 502 || status === 503 || status === 504) {
    return true;
  }

  // Retry on network errors
  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    return true;
  }

  // For other errors, retry if it's not a client error (4xx)
  return !(status >= 400 && status < 500);
};

// Function to get smart model selection based on performance
export const getSmartModelSelection = (models, strategy = 'smart') => {
  const performance = getModelPerformance();
  const availableModels = models.filter(m => performance[m]?.successRate > 0 || !performance[m]);

  switch (strategy) {
    case 'smart': {
      // Sort by success rate, then by response time
      return availableModels.sort((a, b) => {
        const aStats = performance[a];
        const bStats = performance[b];
        
        if (!aStats) return -1;
        if (!bStats) return 1;
        
        // If one has significantly better success rate
        if (aStats.successRate !== bStats.successRate) {
          return bStats.successRate - aStats.successRate;
        }
        
        // Then by response time
        return (aStats.avgResponseTime || Infinity) - (bStats.avgResponseTime || Infinity);
      });
    }

    case 'round_robin': {
      // Simple round robin based on last used
      return availableModels.sort((a, b) => {
        const aStats = performance[a];
        const bStats = performance[b];
        return (aStats?.lastUsed || 0) - (bStats?.lastUsed || 0);
      });
    }

    case 'random': {
      // Shuffle the array
      const shuffled = [...availableModels];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }

    default: {
      // Sequential (default)
      return availableModels;
    }
  }
};