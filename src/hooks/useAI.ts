'use client';

import { useState, useCallback } from 'react';
import { usePuter } from '@/components/providers/PuterProvider';
import { useAuthStore, usePuterAuth } from '@/stores/auth';
import type { PuterAIChatMessage, PuterAIChatOptions, PuterAIChatResponse } from '@/types/puter';

interface UseAIReturn {
  chat: (
    prompt: string | PuterAIChatMessage[],
    options?: Omit<PuterAIChatOptions, 'model'>
  ) => Promise<PuterAIChatResponse>;
  isLoading: boolean;
  error: string | null;
  isReady: boolean;
  requiresAuth: boolean;
}

/**
 * Hook for AI operations using Puter
 *
 * Provides:
 * - chat() method that uses the user's preferred model
 * - Loading and error states
 * - Auth status checks
 */
export function useAI(): UseAIReturn {
  const { puter, isReady: isPuterReady } = usePuter();
  const { isAuthenticated: isPuterAuthenticated } = usePuterAuth();
  const profile = useAuthStore((state) => state.profile);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isReady = isPuterReady && isPuterAuthenticated;
  const requiresAuth = isPuterReady && !isPuterAuthenticated;

  const chat = useCallback(async (
    prompt: string | PuterAIChatMessage[],
    options?: Omit<PuterAIChatOptions, 'model'>
  ): Promise<PuterAIChatResponse> => {
    if (!puter) {
      throw new Error('Puter SDK not loaded');
    }

    if (!isPuterAuthenticated) {
      throw new Error('Puter authentication required');
    }

    setIsLoading(true);
    setError(null);

    try {
      const model = profile?.preferred_model ?? 'claude-opus-4.5';

      const response = await puter.ai.chat(prompt, {
        ...options,
        model,
      });

      return response as PuterAIChatResponse;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'AI request failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [puter, isPuterAuthenticated, profile?.preferred_model]);

  return {
    chat,
    isLoading,
    error,
    isReady,
    requiresAuth,
  };
}
