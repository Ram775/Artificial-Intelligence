import { MODELS } from '../utils/constants';

const API_BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || import.meta.env.VITE_OPENROUTER1_API_KEY || import.meta.env.VITE_OPENROUTER2_API_KEY || import.meta.env.VITE_OPENROUTER3_API_KEY || import.meta.env.VITE_OPENROUTER4_API_KEY || import.meta.env.VITE_OPENROUTER5_API_KEY;

export const sendStreamingMessageWithFallback = async (messages, onChunk, onModelFail) => {
  if (!API_KEY) {
    throw new Error('API key not configured. Please check your VITE_OPENROUTER_API_KEY in .env file.');
  }

  const modelList = Array.isArray(MODELS) && MODELS.length > 0 ? [...MODELS] : [];
  if (modelList.length === 0) {
    throw new Error('No models found in constants.');
  }

  let lastError = null;

  for (let i = 0; i < modelList.length; i++) {
    const model = modelList[i];

    try {
      console.log(`🔄 Trying model: ${model} (${i + 1}/${modelList.length})`);

      await sendStreamingMessage(messages, onChunk, model);

      console.log(`✅ Success with: ${model}`);
      return { success: true, model };

    } catch (error) {
      lastError = error;
      console.warn(`❌ Model ${model} failed:`, error.message);

      if (onModelFail) {
        onModelFail(model, error);
      }

      // Invalid API key hone par aage ke models try karne ka fayda nahi
      if (error.status === 401 || error.status === 403) {
        break;
      }

      // Next model try karne se pehle chhota delay
      if (i < modelList.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 800));
      }
    }
  }

  throw new Error(`All models failed. Last error: ${lastError?.message || 'Unknown error'}`);
};

const sendStreamingMessage = async (messages, onChunk, model) => {
  // Free models ke compatibility ke liye clean payload
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
      'Authorization': `Bearer ${API_KEY}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Shree AI'
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error?.message || errorMessage;
    } catch {
      // JSON parse fail hone par default error code
    }
    const err = new Error(errorMessage);
    err.status = response.status;
    throw err;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Ping comments ignore karein
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
          // Incomplete chunks ko gracefully ignore karein
        }
      }
    }
  }
};