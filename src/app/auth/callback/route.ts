import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * OAuth callback handler for Supabase Auth
 *
 * This route handles the redirect from Google OAuth:
 * 1. Exchanges the authorization code for a session
 * 2. Upserts the user's profile (creates on first login)
 * 3. Redirects to the requested page or dashboard
 *
 * IMPORTANT: Remind user to add this callback URL to Google Cloud Console:
 * {NEXT_PUBLIC_APP_URL}/auth/callback
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/synthesio';
  const origin = requestUrl.origin;

  if (!code) {
    // No code provided - redirect to login with error
    return NextResponse.redirect(
      new URL('/login?error=missing_code', origin)
    );
  }

  const supabase = await createClient();

  // Exchange the authorization code for a session
  const { data: { user }, error: authError } = await supabase.auth.exchangeCodeForSession(code);

  if (authError || !user) {
    console.error('OAuth callback error:', authError);
    return NextResponse.redirect(
      new URL('/login?error=auth_failed', origin)
    );
  }

  // Upsert user profile on successful auth
  try {
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(
        {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
          avatar_url: user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'id',
          ignoreDuplicates: false,
        }
      );

    if (profileError) {
      console.error('Profile upsert error:', profileError);
      // Don't fail the auth flow - profile will be created on next page load
    }
  } catch (error) {
    console.error('Profile upsert error:', error);
    // Don't fail the auth flow
  }

  // Redirect to the requested page
  return NextResponse.redirect(new URL(next, origin));
}
