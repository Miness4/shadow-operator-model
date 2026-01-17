import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { AI_MODELS } from '@/types';
import type { Database } from '@/types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];

/**
 * GET /api/user/preferences
 * Fetch current user's model preference
 */
export async function GET(): Promise<NextResponse> {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const { data, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError || !data) {
    console.error('Preferences fetch error:', profileError);
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
      { status: 500 }
    );
  }

  const profile = data as Profile;

  return NextResponse.json({
    preferred_model: profile.preferred_model ?? 'claude-opus-4.5',
  });
}

/**
 * PATCH /api/user/preferences
 * Update current user's model preference
 */
export async function PATCH(request: NextRequest): Promise<NextResponse> {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  let body: { preferred_model?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const { preferred_model } = body;

  // Validate model ID
  if (!preferred_model || typeof preferred_model !== 'string') {
    return NextResponse.json(
      { error: 'preferred_model is required' },
      { status: 400 }
    );
  }

  const validModelIds = AI_MODELS.map((m) => m.id);
  if (!validModelIds.includes(preferred_model)) {
    return NextResponse.json(
      { error: 'Invalid model ID' },
      { status: 400 }
    );
  }

  const { data, error: updateError } = await supabase
    .from('profiles')
    .update({
      preferred_model,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)
    .select('*')
    .single();

  if (updateError || !data) {
    console.error('Preferences update error:', updateError);
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    );
  }

  const updatedProfile = data as Profile;

  return NextResponse.json({
    preferred_model: updatedProfile.preferred_model,
  });
}
