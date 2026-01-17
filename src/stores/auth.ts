import { create } from 'zustand';
import type { User, Session } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];

export interface PuterUser {
  username: string;
  uuid: string;
  email?: string;
}

export interface AuthState {
  // Supabase auth
  user: User | null;
  session: Session | null;
  isSupabaseLoading: boolean;
  isSupabaseAuthenticated: boolean;

  // Puter auth
  puterUser: PuterUser | null;
  isPuterReady: boolean;
  isPuterAuthenticated: boolean;

  // User profile from database
  profile: Profile | null;
  isProfileLoading: boolean;

  // Combined state
  isFullyAuthenticated: boolean;
}

export interface AuthActions {
  // Supabase actions
  setSupabaseAuth: (user: User | null, session: Session | null) => void;
  setSupabaseLoading: (loading: boolean) => void;

  // Puter actions
  setPuterUser: (user: PuterUser | null) => void;
  setPuterReady: (ready: boolean) => void;

  // Profile actions
  setProfile: (profile: Profile | null) => void;
  setProfileLoading: (loading: boolean) => void;
  updateProfilePreference: (preferredModel: string) => void;

  // Reset
  reset: () => void;
}

const initialState: AuthState = {
  user: null,
  session: null,
  isSupabaseLoading: true,
  isSupabaseAuthenticated: false,
  puterUser: null,
  isPuterReady: false,
  isPuterAuthenticated: false,
  profile: null,
  isProfileLoading: false,
  isFullyAuthenticated: false,
};

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  ...initialState,

  setSupabaseAuth: (user, session) =>
    set((state) => ({
      user,
      session,
      isSupabaseAuthenticated: !!user,
      isFullyAuthenticated: !!user && state.isPuterAuthenticated,
    })),

  setSupabaseLoading: (loading) =>
    set({ isSupabaseLoading: loading }),

  setPuterUser: (puterUser) =>
    set((state) => ({
      puterUser,
      isPuterAuthenticated: !!puterUser,
      isFullyAuthenticated: state.isSupabaseAuthenticated && !!puterUser,
    })),

  setPuterReady: (ready) =>
    set({ isPuterReady: ready }),

  setProfile: (profile) =>
    set({ profile }),

  setProfileLoading: (loading) =>
    set({ isProfileLoading: loading }),

  updateProfilePreference: (preferredModel) =>
    set((state) => ({
      profile: state.profile
        ? { ...state.profile, preferred_model: preferredModel }
        : null,
    })),

  reset: () => set(initialState),
}));

/**
 * Selector hooks for common use cases
 */
export const useSupabaseAuth = () =>
  useAuthStore((state) => ({
    user: state.user,
    session: state.session,
    isLoading: state.isSupabaseLoading,
    isAuthenticated: state.isSupabaseAuthenticated,
  }));

export const usePuterAuth = () =>
  useAuthStore((state) => ({
    user: state.puterUser,
    isReady: state.isPuterReady,
    isAuthenticated: state.isPuterAuthenticated,
  }));

export const useProfile = () =>
  useAuthStore((state) => ({
    profile: state.profile,
    isLoading: state.isProfileLoading,
  }));

export const useIsFullyAuthenticated = () =>
  useAuthStore((state) => state.isFullyAuthenticated);
