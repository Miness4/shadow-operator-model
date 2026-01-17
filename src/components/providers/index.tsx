'use client';

import { AuthProvider } from './AuthProvider';
import { PuterProvider } from './PuterProvider';

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Combined providers wrapper
 *
 * Order matters:
 * 1. AuthProvider (Supabase) - primary auth, must be first
 * 2. PuterProvider - AI auth, depends on knowing if user is signed in
 */
export function Providers({ children }: ProvidersProps): React.ReactElement {
  return (
    <AuthProvider>
      <PuterProvider>
        {children}
      </PuterProvider>
    </AuthProvider>
  );
}

// Re-export individual providers for flexibility
export { AuthProvider } from './AuthProvider';
export { PuterProvider, usePuter } from './PuterProvider';
