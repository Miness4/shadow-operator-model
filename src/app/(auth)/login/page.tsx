import Link from 'next/link';
import { Zap } from 'lucide-react';

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

        {/* Login Form Placeholder */}
        <div className="space-y-4">
          <button
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-bg-secondary px-4 py-3 text-sm font-medium transition-colors hover:bg-bg-tertiary"
            disabled
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

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
            />
            <button
              className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              disabled
            >
              Continue with Email
            </button>
          </div>
        </div>

        {/* Notice */}
        <div className="rounded-lg border border-border bg-bg-secondary p-4">
          <p className="text-center text-xs text-muted-foreground">
            <strong className="text-foreground">Note:</strong> Authentication is
            configured but requires Supabase environment variables. Set{' '}
            <code className="rounded bg-bg-tertiary px-1">
              NEXT_PUBLIC_SUPABASE_URL
            </code>{' '}
            and{' '}
            <code className="rounded bg-bg-tertiary px-1">
              NEXT_PUBLIC_SUPABASE_ANON_KEY
            </code>{' '}
            in your .env.local file.
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
