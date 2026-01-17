'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore, useSupabaseAuth, usePuterAuth, useIsFullyAuthenticated } from '@/stores/auth';
import { usePuter } from '@/components/providers/PuterProvider';

interface UseAuthReturn {
  // Supabase auth state
  user: ReturnType<typeof useSupabaseAuth>['user'];
  isSupabaseLoading: ReturnType<typeof useSupabaseAuth>['isLoading'];
  isSupabaseAuthenticated: ReturnType<typeof useSupabaseAuth>['isAuthenticated'];

  // Puter auth state
  puterUser: ReturnType<typeof usePuterAuth>['user'];
  isPuterReady: ReturnType<typeof usePuterAuth>['isReady'];
  isPuterAuthenticated: ReturnType<typeof usePuterAuth>['isAuthenticated'];

  // Combined state
  isFullyAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  signOut: () => Promise<void>;
  signInWithPuter: () => Promise<void>;
  signOutFromPuter: () => Promise<void>;
}

/**
 * Combined authentication hook
 *
 * Provides unified access to both Supabase and Puter auth state,
 * plus methods for signing in/out from either system.
 */
export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const supabaseAuth = useSupabaseAuth();
  const puterAuth = usePuterAuth();
  const isFullyAuthenticated = useIsFullyAuthenticated();
  const { signIn: puterSignIn, signOut: puterSignOut } = usePuter();
  const reset = useAuthStore((state) => state.reset);

  const isLoading = supabaseAuth.isLoading || !puterAuth.isReady;

  const signOut = useCallback(async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();

      // Also sign out from Puter if authenticated
      if (puterAuth.isAuthenticated) {
        try {
          await puterSignOut();
        } catch (error) {
          console.error('Puter sign out error:', error);
          // Continue even if Puter sign out fails
        }
      }

      reset();
      router.push('/login');
    } catch (error) {
      console.error('Sign out error:', error);
      // Force redirect even on error
      router.push('/login');
    }
  }, [puterAuth.isAuthenticated, puterSignOut, reset, router]);

  const signInWithPuter = useCallback(async () => {
    await puterSignIn();
  }, [puterSignIn]);

  const signOutFromPuter = useCallback(async () => {
    await puterSignOut();
  }, [puterSignOut]);

  return {
    // Supabase
    user: supabaseAuth.user,
    isSupabaseLoading: supabaseAuth.isLoading,
    isSupabaseAuthenticated: supabaseAuth.isAuthenticated,

    // Puter
    puterUser: puterAuth.user,
    isPuterReady: puterAuth.isReady,
    isPuterAuthenticated: puterAuth.isAuthenticated,

    // Combined
    isFullyAuthenticated,
    isLoading,

    // Actions
    signOut,
    signInWithPuter,
    signOutFromPuter,
  };
}
