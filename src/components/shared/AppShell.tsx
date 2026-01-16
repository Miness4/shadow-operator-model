'use client';

import Link from 'next/link';
import { Zap, User } from 'lucide-react';
import { TabNavigation } from './TabNavigation';
import { ModelSelector } from './ModelSelector';

interface AppShellProps {
  children: React.ReactNode;
}

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
          <div className="flex items-center gap-4">
            <ModelSelector />

            {/* User avatar placeholder */}
            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-bg-tertiary transition-colors hover:bg-bg-elevated">
              <User className="h-5 w-5 text-muted-foreground" />
            </button>
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
