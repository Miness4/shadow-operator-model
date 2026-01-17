'use client';

import { useCallback } from 'react';
import { useAuthStore } from '@/stores/auth';
import type { Database } from '@/types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface UseProfileReturn {
  profile: Profile | null;
  isLoading: boolean;
  updateProfile: (data: Partial<Pick<Profile, 'full_name' | 'avatar_url' | 'settings'>>) => Promise<void>;
  updatePreference: (preferredModel: string) => Promise<void>;
}

/**
 * Hook for managing user profile data
 *
 * Provides:
 * - Current profile from Zustand store
 * - Methods to update profile and preferences
 * - Optimistic updates for better UX
 */
export function useProfile(): UseProfileReturn {
  const { profile, isProfileLoading: isLoading, setProfile, updateProfilePreference } = useAuthStore();

  const updateProfile = useCallback(async (
    data: Partial<Pick<Profile, 'full_name' | 'avatar_url' | 'settings'>>
  ) => {
    // Optimistic update
    if (profile) {
      setProfile({ ...profile, ...data });
    }

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const { profile: updatedProfile } = await response.json();
      setProfile(updatedProfile);
    } catch (error) {
      // Rollback on error
      console.error('Profile update error:', error);
      // Re-fetch to ensure consistency
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const { profile: freshProfile } = await response.json();
        setProfile(freshProfile);
      }
      throw error;
    }
  }, [profile, setProfile]);

  const updatePreference = useCallback(async (preferredModel: string) => {
    // Optimistic update
    updateProfilePreference(preferredModel);

    try {
      const response = await fetch('/api/user/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferred_model: preferredModel }),
      });

      if (!response.ok) {
        throw new Error('Failed to update preference');
      }
    } catch (error) {
      console.error('Preference update error:', error);
      // Re-fetch profile to get actual value
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const { profile: freshProfile } = await response.json();
        setProfile(freshProfile);
      }
      throw error;
    }
  }, [updateProfilePreference, setProfile]);

  return {
    profile,
    isLoading,
    updateProfile,
    updatePreference,
  };
}
