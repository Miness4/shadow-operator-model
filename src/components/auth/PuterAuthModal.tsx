'use client';

import { useState, useEffect } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { usePuter } from '@/components/providers/PuterProvider';
import { usePuterAuth } from '@/stores/auth';
import { cn } from '@/lib/utils/cn';

interface PuterAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

/**
 * Modal for Puter AI authentication
 *
 * Explains why Puter auth is needed and provides a button
 * to initiate the Puter sign-in flow.
 */
export function PuterAuthModal({
  isOpen,
  onClose,
  onSuccess,
}: PuterAuthModalProps): React.ReactElement | null {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, isReady } = usePuter();
  const { isAuthenticated } = usePuterAuth();

  // Close modal when authenticated
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      onSuccess?.();
      onClose();
    }
  }, [isAuthenticated, isOpen, onClose, onSuccess]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleConnect = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await signIn();
    } catch (err) {
      console.error('Puter auth error:', err);
      setError('Failed to connect. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative mx-4 w-full max-w-md rounded-xl border border-border bg-bg-primary p-6 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-bg-tertiary hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center">
            <h2 className="text-xl font-bold">Connect AI Features</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              SHADOWCORE uses Puter to power AI features. Connect your Puter account
              to unlock Creator DNA scanning, story generation, and more.
            </p>
          </div>

          {/* Benefits */}
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="text-primary">•</span>
              Access to multiple AI models (Claude, GPT, Gemini)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">•</span>
              Creator DNA analysis and insights
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">•</span>
              14-day story copy generation
            </li>
          </ul>

          {/* Error */}
          {error && (
            <p className="text-center text-sm text-red-400">{error}</p>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleConnect}
              disabled={isLoading || !isReady}
              className={cn(
                'flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors',
                'hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background',
                'disabled:cursor-not-allowed disabled:opacity-50'
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Connect AI
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="w-full rounded-lg border border-border bg-transparent px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-bg-tertiary hover:text-foreground"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
