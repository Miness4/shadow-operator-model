'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { LogOut, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils/cn';

/**
 * UserMenu component
 *
 * Displays user avatar and name with dropdown for settings and sign out
 */
export function UserMenu(): React.ReactElement {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, signOut, isSupabaseLoading } = useAuth();
  const profile = user?.user_metadata;

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleSignOut = async () => {
    setOpen(false);
    await signOut();
  };

  if (isSupabaseLoading) {
    return (
      <div className="flex h-9 w-9 animate-pulse items-center justify-center rounded-full bg-bg-tertiary" />
    );
  }

  const avatarUrl = profile?.avatar_url ?? profile?.picture;
  const displayName = profile?.full_name ?? profile?.name ?? user?.email ?? 'User';
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center gap-2 rounded-full border border-border bg-bg-tertiary px-2 py-1.5 transition-colors',
          'hover:bg-bg-elevated focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background'
        )}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={displayName}
            width={28}
            height={28}
            className="h-7 w-7 rounded-full object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
            {initials}
          </div>
        )}
        <ChevronDown
          className={cn(
            'h-4 w-4 text-muted-foreground transition-transform',
            open && 'rotate-180'
          )}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-border bg-bg-secondary p-1 shadow-lg"
          role="menu"
        >
          {/* User info */}
          <div className="border-b border-border px-3 py-2">
            <p className="text-sm font-medium">{displayName}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <button
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-bg-tertiary hover:text-foreground"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>

            <button
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10"
              role="menuitem"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Skeleton version of UserMenu for loading states
 */
export function UserMenuSkeleton(): React.ReactElement {
  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-bg-tertiary px-2 py-1.5">
      <div className="h-7 w-7 animate-pulse rounded-full bg-bg-elevated" />
      <div className="h-4 w-4 animate-pulse rounded bg-bg-elevated" />
    </div>
  );
}
