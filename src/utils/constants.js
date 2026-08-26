// All available free models
export const MODELS = [

  'dots-studio/dots-3-note-preview:free',
  "cohere/north-mini-code:free",
  'nvidia/nemotron-3.5-lightning:free',
  "z-ai/glm-5.2:free",
  'thinkingmachines/inkling-small:free',
  'poolside/laguna-s-2.1:free',
  'liquid/lfm-2.5-2.6b:free',
  "minimax/minimax-m2.7:free",
    "google/gemma-4-31b-it:free",
    "google/gemma-4-26b-a4b-it:free",
];

// Default model (first one)
export const DEFAULT_MODEL = MODELS[0];

// Default settings (hidden from user)
export const DEFAULT_SETTINGS = {
  model: DEFAULT_MODEL,
  fallbackModels: MODELS.slice(1), // All other models as fallback
  reasoningEnabled: true,
  maxTokens: 1000,
  temperature: 0.7,
  topP: 0.9,
  streamEnabled: true,
  maxRetries: MODELS.length // Try all models
};
