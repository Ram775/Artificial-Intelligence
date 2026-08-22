export const DEFAULT_MODEL = 'dots-studio/dots-3-note-preview:free';

export const AVAILABLE_MODELS = [
  { 
    id: 'dots-studio/dots-3-note-preview:free', 
    name: 'Dots 3 Note (Free)',
    provider: 'Dots Studio',
    free: true,
    description: 'Fast and efficient model'
  },
  { 
    id: 'liquid/lfm-2.5-2.6b:free', 
    name: 'LFM 2.5-2.6B (Free)',
    provider: 'Liquid AI',
    free: true,
    description: 'Lightweight language model'
  },
  { 
    id: 'nvidia/nemotron-3.5-lightning:free', 
    name: 'Nemotron 3.5 Lightning (Free)',
    provider: 'NVIDIA',
    free: true,
    description: 'Fast inference model'
  },
  { 
    id: 'thinkingmachines/inkling-small:free', 
    name: 'Inkling Small (Free)',
    provider: 'Thinking Machines',
    free: true,
    description: 'Small and efficient model'
  },
  { 
    id: 'poolside/laguna-s-2.1:free', 
    name: 'Laguna S 2.1 (Free)',
    provider: 'Poolside',
    free: true,
    description: 'Balanced performance model'
  }
];

export const FREE_MODELS_ONLY = true;

export const DEFAULT_SETTINGS = {
  model: DEFAULT_MODEL,
  fallbackModels: [
    'liquid/lfm-2.5-2.6b:free',
    'nvidia/nemotron-3.5-lightning:free',
    'thinkingmachines/inkling-small:free',
    'poolside/laguna-s-2.1:free'
  ],
  reasoningEnabled: true,
  maxTokens: 1000,
  temperature: 0.7,
  topP: 0.9,
  streamEnabled: true,
  maxRetries: 5,
  timeout: 30000
};

export const FALLBACK_STRATEGIES = {
  SEQUENTIAL: 'sequential',
  SMART: 'smart'
};