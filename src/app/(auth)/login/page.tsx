'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Zap, AlertCircle, Loader2 } from 'lucide-react';
import { LoginButton } from '@/components/auth/LoginButton';

const ERROR_MESSAGES: Record<string, string> = {
  missing_code: 'Authorization code was missing. Please try again.',
  auth_failed: 'Authentication failed. Please try again.',
  default: 'An error occurred during sign in. Please try again.',
};

/**
 * Inner login content that uses useSearchParams
 * Must be wrapped in Suspense boundary per Next.js 16 requirements
 */
function LoginContent(): React.ReactElement {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const next = searchParams.get('next') ?? '/synthesio';

  const errorMessage = error
    ? ERROR_MESSAGES[error] ?? ERROR_MESSAGES.default
    : null;

  return (
    <>
      {/* Error Message */}
      {errorMessage && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Login Form */}
      <div className="space-y-4">
        <LoginButton redirectTo={next} />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <div className="space-y-3">
          <input
            type="email"
            placeholder="Email address"
            className="w-full rounded-lg border border-border bg-bg-secondary px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
            disabled
            title="Email login coming soon"
          />
          <button
            className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            disabled
            title="Email login coming soon"
          >
            Continue with Email
          </button>
        </div>
      </div>
    </>
  );
}

/**
 * Loading fallback for Suspense boundary
 */
function LoginContentSkeleton(): React.ReactElement {
  return (
    <div className="space-y-4">
      <div className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-bg-secondary px-4 py-3">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    </div>
  );
}

export default function LoginPage(): React.ReactElement {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Zap className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="mt-4 text-2xl font-bold">Welcome to SHADOWCORE</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Sign in to access your AI-powered business hivemind
          </p>
        </div>

        {/* Login content with Suspense boundary */}
        <Suspense fallback={<LoginContentSkeleton />}>
          <LoginContent />
        </Suspense>

        {/* Info */}
        <div className="rounded-lg border border-border bg-bg-secondary p-4">
          <p className="text-center text-xs text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy.
            Your data is securely stored and never shared.
          </p>
        </div>

        {/* Back to home */}
        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            &larr; Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
