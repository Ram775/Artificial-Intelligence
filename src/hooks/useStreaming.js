import { useState, useCallback } from 'react';

export const useStreaming = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);

  const startStream = useCallback(async (streamPromise) => {
    setIsStreaming(true);
    setContent('');
    setError(null);

    try {
      await streamPromise;
    } catch (err) {
      setError(err.message);
    } finally {
      setIsStreaming(false);
    }
  }, []);

  const appendContent = useCallback((chunk) => {
    setContent(prev => prev + chunk);
  }, []);

  return {
    isStreaming,
    content,
    error,
    startStream,
    appendContent,
    reset: () => {
      setContent('');
      setError(null);
      setIsStreaming(false);
    }
  };
};