import { MODELS } from '../utils/constants';

const API_BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Sabhi valid keys ko collect karein
const API_KEYS = [
  import.meta.env.VITE_OPENROUTER_API_KEY,
  import.meta.env.VITE_OPENROUTER1_API_KEY,
  import.meta.env.VITE_OPENROUTER2_API_KEY,
  import.meta.env.VITE_OPENROUTER3_API_KEY,
  import.meta.env.VITE_OPENROUTER4_API_KEY,
  import.meta.env.VITE_OPENROUTER5_API_KEY
].filter(Boolean);

// Array ko randomize karne ke liye helper function (Fisher-Yates Shuffle)
const getShuffledKeys = () => {
  const shuffled = [...API_KEYS];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const sendStreamingMessageWithFallback = async (messages, onChunk, onModelFail) => {
  if (API_KEYS.length === 0) {
    throw new Error('No API keys configured. Please check your .env file.');
  }

  const modelList = Array.isArray(MODELS) && MODELS.length > 0 ? [...MODELS] : [];
  if (modelList.length === 0) {
    throw new Error('No models found in constants.');
  }

  let lastError = null;

  for (let m = 0; m < modelList.length; m++) {
    const model = modelList[m];
    console.log(`🔄 Trying model: ${model} (${m + 1}/${modelList.length})`);

    // Har request ke liye keys ko randomly shuffle karein
    const randomizedKeys = getShuffledKeys();

    for (let k = 0; k < randomizedKeys.length; k++) {
      const apiKey = randomizedKeys[k];

      try {
        await sendStreamingMessage(messages, onChunk, model, apiKey);

        console.log(`✅ Success with model: ${model}`);
        return { success: true, model };

      } catch (error) {
        lastError = error;
        console.warn(`❌ Random key attempt #${k + 1} failed for ${model}:`, error.message);

        // Expired (401/403) ya Rate Limited (429) hone par agli random key try karega
        const isAuthOrLimitError = error.status === 401 || error.status === 403 || error.status === 429;
        
        if (!isAuthOrLimitError) {
          // Model down hone par dusri keys try karne ke bajaye agla model try karega
          break;
        }

        if (k < randomizedKeys.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    }

    if (onModelFail) {
      onModelFail(model, lastError);
    }

    if (m < modelList.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 800));
    }
  }

  throw new Error(`All models and API keys failed. Last error: ${lastError?.message || 'Unknown error'}`);
};

const sendStreamingMessage = async (messages, onChunk, model, apiKey) => {
  const requestBody = {
    model,
    messages,
    max_tokens: 2048,
    temperature: 0.7,
    top_p: 0.9,
    stream: true
  };

  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Shree AI'
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;
    let errorData = null;
    try {
      errorData = await response.json();
      errorMessage = errorData.error?.message || errorMessage;
    } catch {
      // JSON parse fallback
    }
    const err = new Error(errorMessage);
    err.status = response.status;
    err.data = errorData;
    throw err;
  }

  if (!response.body) {
    throw new Error('ReadableStream not supported.');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine.startsWith(':')) continue;

        if (trimmedLine.startsWith('data: ')) {
          const data = trimmedLine.slice(6).trim();
          if (data === '[DONE]') return;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              onChunk(content, model);
            }
          } catch {
            // Incomplete chunks handle
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
};