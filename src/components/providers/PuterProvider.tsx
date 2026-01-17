'use client';

import { createContext, useContext, useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '@/stores/auth';
import type { PuterSDK } from '@/types/puter';

interface PuterContextValue {
  puter: PuterSDK | null;
  isReady: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const PuterContext = createContext<PuterContextValue>({
  puter: null,
  isReady: false,
  signIn: async () => {},
  signOut: async () => {},
});

const PUTER_SDK_URL = 'https://js.puter.com/v2/';

interface PuterProviderProps {
  children: React.ReactNode;
}

/**
 * PuterProvider handles Puter SDK initialization and auth
 *
 * Responsibilities:
 * - Dynamically load Puter SDK script
 * - Check initial auth state
 * - Listen to auth state changes
 * - Expose puter instance and auth methods via context
 */
export function PuterProvider({ children }: PuterProviderProps): React.ReactElement {
  const scriptLoadedRef = useRef(false);
  const { setPuterUser, setPuterReady, isPuterReady } = useAuthStore();

  const checkAuthState = useCallback(async () => {
    if (!window.puter) return;

    try {
      const isSignedIn = await window.puter.auth.isSignedIn();
      if (isSignedIn) {
        const user = await window.puter.auth.getUser();
        if (user) {
          setPuterUser({
            username: user.username,
            uuid: user.uuid,
            email: user.email,
          });
        }
      } else {
        setPuterUser(null);
      }
    } catch (error) {
      console.error('Puter auth check error:', error);
      setPuterUser(null);
    }
  }, [setPuterUser]);

  useEffect(() => {
    // Prevent duplicate script loading
    if (scriptLoadedRef.current) return;
    if (typeof window === 'undefined') return;

    // Check if script already exists
    const existingScript = document.querySelector(`script[src="${PUTER_SDK_URL}"]`);
    if (existingScript) {
      scriptLoadedRef.current = true;
      if (window.puter) {
        setPuterReady(true);
        checkAuthState();
      }
      return;
    }

    // Create and append script
    const script = document.createElement('script');
    script.src = PUTER_SDK_URL;
    script.async = true;

    script.onload = () => {
      scriptLoadedRef.current = true;
      setPuterReady(true);
      checkAuthState();

      // Listen for auth state changes
      if (window.puter) {
        window.puter.auth.onAuthStateChanged((user) => {
          if (user) {
            setPuterUser({
              username: user.username,
              uuid: user.uuid,
              email: user.email,
            });
          } else {
            setPuterUser(null);
          }
        });
      }
    };

    script.onerror = () => {
      console.error('Failed to load Puter SDK');
      scriptLoadedRef.current = true;
      setPuterReady(true); // Mark ready even on error so UI can handle gracefully
    };

    document.head.appendChild(script);

    return () => {
      // Don't remove script on unmount - it should persist
    };
  }, [setPuterReady, setPuterUser, checkAuthState]);

  const signIn = useCallback(async () => {
    if (!window.puter) {
      throw new Error('Puter SDK not loaded');
    }

    try {
      const user = await window.puter.auth.signIn();
      setPuterUser({
        username: user.username,
        uuid: user.uuid,
        email: user.email,
      });
    } catch (error) {
      console.error('Puter sign in error:', error);
      throw error;
    }
  }, [setPuterUser]);

  const signOut = useCallback(async () => {
    if (!window.puter) {
      throw new Error('Puter SDK not loaded');
    }

    try {
      await window.puter.auth.signOut();
      setPuterUser(null);
    } catch (error) {
      console.error('Puter sign out error:', error);
      throw error;
    }
  }, [setPuterUser]);

  const value: PuterContextValue = {
    puter: typeof window !== 'undefined' ? window.puter ?? null : null,
    isReady: isPuterReady,
    signIn,
    signOut,
  };

  return (
    <PuterContext.Provider value={value}>
      {children}
    </PuterContext.Provider>
  );
}

/**
 * Hook to access Puter SDK and auth methods
 */
export function usePuter(): PuterContextValue {
  const context = useContext(PuterContext);
  if (!context) {
    throw new Error('usePuter must be used within a PuterProvider');
  }
  return context;
}
