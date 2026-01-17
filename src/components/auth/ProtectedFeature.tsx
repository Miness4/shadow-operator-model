'use client';

import { useState } from 'react';
import { Sparkles, Lock } from 'lucide-react';
import { usePuterAuth } from '@/stores/auth';
import { usePuter } from '@/components/providers/PuterProvider';
import { PuterAuthModal } from './PuterAuthModal';
import { cn } from '@/lib/utils/cn';

interface ProtectedFeatureProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

/**
 * ProtectedFeature wrapper
 *
 * Wraps AI-powered features that require Puter authentication.
 * Shows a fallback UI prompting users to connect AI when not authenticated.
 */
export function ProtectedFeature({
  children,
  fallback,
  className,
}: ProtectedFeatureProps): React.ReactElement {
  const [showModal, setShowModal] = useState(false);
  const { isAuthenticated } = usePuterAuth();
  const { isReady } = usePuter();

  // Show children if authenticated
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Loading state
  if (!isReady) {
    return (
      <div className={cn('animate-pulse rounded-lg bg-bg-tertiary p-6', className)}>
        <div className="h-4 w-1/3 rounded bg-bg-elevated" />
        <div className="mt-2 h-4 w-1/2 rounded bg-bg-elevated" />
      </div>
    );
  }

  // Custom fallback
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default fallback UI
  return (
    <>
      <div
        className={cn(
          'relative overflow-hidden rounded-lg border border-border bg-bg-secondary p-6',
          className
        )}
      >
        {/* Blur overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg-primary/80 backdrop-blur-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">AI Feature Locked</h3>
          <p className="mt-1 max-w-xs text-center text-sm text-muted-foreground">
            Connect your AI account to unlock this feature
          </p>
          <button
            onClick={() => setShowModal(true)}
            className={cn(
              'mt-4 flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground',
              'transition-colors hover:bg-primary/90'
            )}
          >
            <Sparkles className="h-4 w-4" />
            Connect AI
          </button>
        </div>

        {/* Placeholder content */}
        <div className="space-y-3 opacity-30">
          <div className="h-4 w-3/4 rounded bg-bg-tertiary" />
          <div className="h-4 w-1/2 rounded bg-bg-tertiary" />
          <div className="h-24 w-full rounded bg-bg-tertiary" />
        </div>
      </div>

      <PuterAuthModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}

/**
 * Hook to check if a feature is protected
 * Returns true if user needs to authenticate with Puter
 */
export function useProtectedFeature(): {
  isProtected: boolean;
  isReady: boolean;
  isAuthenticated: boolean;
} {
  const { isAuthenticated } = usePuterAuth();
  const { isReady } = usePuter();

  return {
    isProtected: isReady && !isAuthenticated,
    isReady,
    isAuthenticated,
  };
}
