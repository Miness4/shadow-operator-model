'use client';

import Link from 'next/link';
import { Zap } from 'lucide-react';
import { TabNavigation } from './TabNavigation';
import { ModelSelector } from './ModelSelector';
import { UserMenu } from './UserMenu';
import { AuthStatusPill } from './AuthStatusPill';

interface AppShellProps {
  children: React.ReactNode;
}

/**
 * AppShell - Main application layout wrapper
 *
 * Includes:
 * - Header with logo, model selector, auth status, and user menu
 * - Tab navigation for the three pillars
 * - Main content area
 */
export function AppShell({ children }: AppShellProps): React.ReactElement {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-bg-primary">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">SHADOWCORE</span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <AuthStatusPill />
            <ModelSelector />
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <TabNavigation />

      {/* Main Content */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}

/**
 * AppShellSkeleton - Loading skeleton for AppShell
 */
export function AppShellSkeleton(): React.ReactElement {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header skeleton */}
      <header className="border-b border-border bg-bg-primary">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo skeleton */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 animate-pulse rounded-lg bg-bg-tertiary" />
            <div className="h-5 w-28 animate-pulse rounded bg-bg-tertiary" />
          </div>

          {/* Right side skeleton */}
          <div className="flex items-center gap-3">
            <div className="h-7 w-24 animate-pulse rounded-full bg-bg-tertiary" />
            <div className="h-9 w-32 animate-pulse rounded-lg bg-bg-tertiary" />
            <div className="h-9 w-16 animate-pulse rounded-full bg-bg-tertiary" />
          </div>
        </div>
      </header>

      {/* Tab navigation skeleton */}
      <div className="border-b border-border bg-bg-secondary">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
          <div className="h-12 w-24 animate-pulse rounded bg-transparent" />
          <div className="h-12 w-24 animate-pulse rounded bg-transparent" />
          <div className="h-12 w-24 animate-pulse rounded bg-transparent" />
        </div>
      </div>

      {/* Main content skeleton */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <div className="h-8 w-1/3 animate-pulse rounded bg-bg-tertiary" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-bg-tertiary" />
            <div className="h-64 w-full animate-pulse rounded-lg bg-bg-tertiary" />
          </div>
        </div>
      </main>
    </div>
  );
}
