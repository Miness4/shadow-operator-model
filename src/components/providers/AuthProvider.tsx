'use client';

import { useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/auth';

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider handles Supabase authentication state
 *
 * Responsibilities:
 * - Listen to auth state changes
 * - Sync auth state to Zustand store
 * - Fetch user profile on auth
 * - Handle initial session check
 */
export function AuthProvider({ children }: AuthProviderProps): React.ReactElement {
  const {
    setSupabaseAuth,
    setSupabaseLoading,
    setProfile,
    setProfileLoading,
  } = useAuthStore();

  const fetchProfile = useCallback(async (userId: string) => {
    setProfileLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  }, [setProfile, setProfileLoading]);

  useEffect(() => {
    const supabase = createClient();

    // Check initial session
    const initializeAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
          console.error('Auth initialization error:', error);
          setSupabaseAuth(null, null);
        } else {
          const { data: { session } } = await supabase.auth.getSession();
          setSupabaseAuth(user, session);

          if (user) {
            await fetchProfile(user.id);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setSupabaseAuth(null, null);
      } finally {
        setSupabaseLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user ?? null;
        setSupabaseAuth(user, session);

        if (event === 'SIGNED_IN' && user) {
          await fetchProfile(user.id);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
          useAuthStore.getState().reset();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [setSupabaseAuth, setSupabaseLoading, setProfile, fetchProfile]);

  return <>{children}</>;
}
