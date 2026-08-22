export const DEFAULT_MODEL = "dots-studio/dots-3-note-preview:free";

export const AVAILABLE_MODELS = [
  {
    id: "dots-studio/dots-3-note-preview:free",
    name: "Dots 3 Note (Free)",
    provider: "OpenRouter",
    free: true,
  },
  {
    id: "openai/gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    free: false,
  },
  {
    id: "anthropic/claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    free: false,
  },
  {
    id: "google/gemini-pro",
    name: "Gemini Pro",
    provider: "Google",
    free: false,
  },
  {
    id: "meta-llama/llama-3.3-70b-instruct",
    name: "Llama 3.3 70B",
    provider: "Meta",
    free: false,
  },
  {
    id: "mistralai/mistral-7b-instruct",
    name: "Mistral 7B",
    provider: "Mistral",
    free: false,
  },
  {
    id: "cohere/command-r",
    name: "Command R",
    provider: "Cohere",
    free: false,
  },
];

export const DEFAULT_SETTINGS = {
  model: DEFAULT_MODEL,
  fallbackModels: [
    "openai/gpt-4o",
    "anthropic/claude-3.5-sonnet",
    "google/gemini-pro",
  ],
  reasoningEnabled: true,
  maxTokens: 1000,
  temperature: 0.7,
  topP: 0.9,
  streamEnabled: true,
  maxRetries: 3,
  timeout: 30000,
};

export const FALLBACK_STRATEGIES = {
  SEQUENTIAL: "sequential", // Try models one by one
  ROUND_ROBIN: "round_robin", // Distribute load across models
  RANDOM: "random", // Randomly pick a model
  SMART: "smart", // Based on previous success rates
};
