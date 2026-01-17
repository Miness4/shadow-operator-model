'use client';

import * as React from 'react';
import { Check, ChevronDown, Cpu, Lock } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { AI_MODELS, type AIModel } from '@/types';
import { useProfile } from '@/hooks/useProfile';
import { usePuterAuth } from '@/stores/auth';

/**
 * ModelSelector component
 *
 * Allows users to select their preferred AI model.
 * - Integrates with Zustand store for state management
 * - Persists preference to Supabase via useProfile hook
 * - Shows disabled state when Puter auth is not connected
 */
export function ModelSelector(): React.ReactElement {
  const [open, setOpen] = React.useState(false);
  const { profile, updatePreference } = useProfile();
  const { isAuthenticated: isPuterAuthenticated } = usePuterAuth();

  // Get selected model from profile or default
  const selectedModelId = profile?.preferred_model ?? 'claude-opus-4.5';
  const selectedModel = AI_MODELS.find((m) => m.id === selectedModelId) ?? AI_MODELS.find((m) => m.isDefault);

  const handleSelect = async (model: AIModel): Promise<void> => {
    setOpen(false);

    try {
      await updatePreference(model.id);
    } catch (error) {
      console.error('Failed to update model preference:', error);
    }
  };

  const getTierColor = (tier: AIModel['tier']): string => {
    switch (tier) {
      case 'premium':
        return 'text-primary';
      case 'standard':
        return 'text-secondary';
      case 'economy':
        return 'text-muted-foreground';
    }
  };

  // Show disabled state if Puter not authenticated
  const isDisabled = !isPuterAuthenticated;

  return (
    <div className="relative">
      <button
        onClick={() => !isDisabled && setOpen(!open)}
        disabled={isDisabled}
        className={cn(
          'flex items-center gap-2 rounded-lg border border-border bg-bg-tertiary px-3 py-2 text-sm',
          'hover:bg-bg-elevated transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background',
          isDisabled && 'cursor-not-allowed opacity-50'
        )}
        title={isDisabled ? 'Connect AI to select model' : undefined}
      >
        {isDisabled ? (
          <Lock className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Cpu className="h-4 w-4 text-muted-foreground" />
        )}
        <span className="font-medium">{selectedModel?.name ?? 'Select Model'}</span>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-muted-foreground transition-transform',
            open && 'rotate-180'
          )}
        />
      </button>

      {open && !isDisabled && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />

          {/* Dropdown */}
          <div
            className={cn(
              'absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border border-border bg-bg-secondary p-1 shadow-lg',
              'animate-in'
            )}
          >
            {AI_MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => handleSelect(model)}
                className={cn(
                  'flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm',
                  'hover:bg-bg-tertiary transition-colors',
                  selectedModel?.id === model.id && 'bg-bg-tertiary'
                )}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{model.name}</span>
                  <span className={cn('text-xs', getTierColor(model.tier))}>
                    {model.tier.charAt(0).toUpperCase() + model.tier.slice(1)} •{' '}
                    {model.provider}
                  </span>
                </div>
                {selectedModel?.id === model.id && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Skeleton version of ModelSelector for loading states
 */
export function ModelSelectorSkeleton(): React.ReactElement {
  return (
    <div className="h-9 w-36 animate-pulse rounded-lg bg-bg-tertiary" />
  );
}
