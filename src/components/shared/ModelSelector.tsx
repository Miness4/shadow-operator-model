'use client';

import * as React from 'react';
import { Check, ChevronDown, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { AI_MODELS, type AIModel } from '@/types';

interface ModelSelectorProps {
  value?: string;
  onValueChange?: (value: string) => void;
}

export function ModelSelector({
  value,
  onValueChange,
}: ModelSelectorProps): React.ReactElement {
  const [open, setOpen] = React.useState(false);
  const [selectedModel, setSelectedModel] = React.useState<AIModel | undefined>(
    AI_MODELS.find((m) => m.id === value) ?? AI_MODELS.find((m) => m.isDefault)
  );

  const handleSelect = (model: AIModel): void => {
    setSelectedModel(model);
    onValueChange?.(model.id);
    setOpen(false);
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

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center gap-2 rounded-lg border border-border bg-bg-tertiary px-3 py-2 text-sm',
          'hover:bg-bg-elevated transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background'
        )}
      >
        <Cpu className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">{selectedModel?.name ?? 'Select Model'}</span>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-muted-foreground transition-transform',
            open && 'rotate-180'
          )}
        />
      </button>

      {open && (
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
