'use client';

import { useState } from 'react';
import { Sparkles, Check, Loader2 } from 'lucide-react';
import { usePuterAuth } from '@/stores/auth';
import { usePuter } from '@/components/providers/PuterProvider';
import { PuterAuthModal } from '@/components/auth/PuterAuthModal';
import { cn } from '@/lib/utils/cn';

/**
 * AuthStatusPill component
 *
 * Shows Puter AI connection status:
 * - Green "AI Connected" when authenticated
 * - Yellow "Connect AI" when not authenticated (clickable)
 */
export function AuthStatusPill(): React.ReactElement {
  const [showModal, setShowModal] = useState(false);
  const { isAuthenticated, user } = usePuterAuth();
  const { isReady } = usePuter();

  // Loading state while Puter SDK loads
  if (!isReady) {
    return (
      <div className="flex items-center gap-1.5 rounded-full border border-border bg-bg-tertiary px-3 py-1.5 text-xs text-muted-foreground">
        <Loader2 className="h-3 w-3 animate-spin" />
        <span>Loading AI...</span>
      </div>
    );
  }

  // Connected state
  if (isAuthenticated && user) {
    return (
      <div
        className="flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1.5 text-xs text-green-400"
        title={`Connected as ${user.username}`}
      >
        <Check className="h-3 w-3" />
        <span>AI Connected</span>
      </div>
    );
  }

  // Not connected state
  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={cn(
          'flex items-center gap-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1.5 text-xs text-yellow-400',
          'transition-colors hover:bg-yellow-500/20 focus:outline-none focus:ring-2 focus:ring-yellow-500/50'
        )}
      >
        <Sparkles className="h-3 w-3" />
        <span>Connect AI</span>
      </button>

      <PuterAuthModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}

/**
 * Skeleton version of AuthStatusPill for loading states
 */
export function AuthStatusPillSkeleton(): React.ReactElement {
  return (
    <div className="h-7 w-24 animate-pulse rounded-full bg-bg-tertiary" />
  );
}
