# Supabase Patterns

**Last Updated:** 2026-01-16
**Status:** Comprehensive Research Complete

---

## Overview

Supabase is the open-source Firebase alternative providing:

- **PostgreSQL Database:** Full SQL with JSON support
- **Authentication:** OAuth, magic links, passwords
- **Row Level Security (RLS):** Fine-grained access control
- **Realtime:** Live subscriptions to data changes
- **Storage:** File storage with CDN
- **Edge Functions:** Serverless TypeScript functions

For SHADOWCORE, Supabase handles all data persistence, user auth, and real-time campaign metrics.

---

## Next.js 16 Integration with @supabase/ssr

### Installation

```bash
npm install @supabase/supabase-js @supabase/ssr
```

### Environment Variables

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Browser Client

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

### Server Client (App Router)

```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from Server Component - ignore
          }
        },
      },
    }
  );
}
```

### Proxy Helper (Next.js 16)

```typescript
// lib/supabase/proxy.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Use getClaims() for server-side JWT validation
  // NOT getSession() which trusts client cookies
  const { data: { claims } } = await supabase.auth.getClaims();

  // Protected routes
  const protectedPaths = ['/synthesio', '/ghostwrite', '/flowy'];
  const isProtected = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (!claims && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
```

---

## Authentication Patterns

### Google OAuth Setup

1. **Configure in Supabase Dashboard:**
   - Authentication > Providers > Google
   - Add Client ID and Secret from Google Cloud Console
   - Set redirect URL: `https://your-project.supabase.co/auth/v1/callback`

2. **Implementation:**

```typescript
// lib/auth/google.ts
'use client';

import { createClient } from '@/lib/supabase/client';

export async function signInWithGoogle() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
```

### Auth Callback Route

```typescript
// app/auth/callback/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/synthesio';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Create/update profile on first login
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('profiles').upsert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata.full_name,
          avatar_url: user.user_metadata.avatar_url,
          updated_at: new Date().toISOString(),
        });
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
```

### Auth State Hook

```typescript
// hooks/useAuth.ts
'use client';

import { createClient } from '@/lib/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { user, session, loading };
}
```

---

## Row Level Security (RLS) Patterns

### Policy Design Principles

1. **Default deny:** Enable RLS on all tables
2. **Explicit allow:** Create policies for each operation
3. **User ownership:** Most data belongs to `auth.uid()`
4. **Use functions:** Create helper functions for complex policies

### Basic User-Owned Data

```sql
-- Users can only access their own data
CREATE POLICY "Users can CRUD own data"
  ON public.creators
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### Cascading Access (Through Relations)

```sql
-- Access creator_dna through creator ownership
CREATE POLICY "Users can CRUD own creator_dna"
  ON public.creator_dna
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.creators
      WHERE creators.id = creator_dna.creator_id
        AND creators.user_id = auth.uid()
    )
  );
```

### Public Read, Authenticated Write

```sql
-- Niche database is publicly readable
CREATE POLICY "Niche database is publicly readable"
  ON public.niche_database
  FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can modify niche database
CREATE POLICY "Only admins can modify niches"
  ON public.niche_database
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );
```

### Service Role Bypass

```typescript
// For admin operations, use service role client
// lib/supabase/admin.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
```

---

## Realtime Subscriptions

### Subscribe to Campaign Metrics

```typescript
// hooks/useCampaignMetrics.ts
'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import type { CampaignMetrics } from '@/types/database';

export function useCampaignMetrics(campaignId: string) {
  const [metrics, setMetrics] = useState<CampaignMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Initial fetch
    const fetchMetrics = async () => {
      const { data } = await supabase
        .from('campaign_metrics')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('recorded_at', { ascending: false })
        .limit(1)
        .single();

      setMetrics(data);
      setLoading(false);
    };

    fetchMetrics();

    // Subscribe to changes
    const channel = supabase
      .channel(`campaign-${campaignId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'campaign_metrics',
          filter: `campaign_id=eq.${campaignId}`,
        },
        (payload) => {
          setMetrics(payload.new as CampaignMetrics);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [campaignId]);

  return { metrics, loading };
}
```

### Subscribe to Multiple Tables

```typescript
// Subscribe to all user activity
export function useUserActivity(userId: string) {
  const [activity, setActivity] = useState<Activity[]>([]);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel('user-activity')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'interactions',
          filter: `user_id=eq.${userId}`,
        },
        handleInteraction
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'generations',
          filter: `user_id=eq.${userId}`,
        },
        handleGeneration
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [userId]);

  return activity;
}
```

---

## Query Patterns

### Type-Safe Queries

```typescript
// Using generated types
const { data: creators } = await supabase
  .from('creators')
  .select(`
    id,
    instagram_handle,
    name,
    follower_count,
    engagement_rate,
    creator_dna (
      niche,
      desperation_score,
      recommended_product_type
    )
  `)
  .eq('user_id', userId)
  .order('created_at', { ascending: false });

// TypeScript knows the shape:
// creators: Array<{
//   id: string;
//   instagram_handle: string;
//   name: string;
//   follower_count: number;
//   engagement_rate: number;
//   creator_dna: {
//     niche: string;
//     desperation_score: number;
//     recommended_product_type: string;
//   } | null;
// }>
```

### Complex Filtering

```typescript
// Find ideal creators for outreach
const { data: idealCreators } = await supabase
  .from('creators')
  .select(`
    *,
    creator_dna!inner (
      desperation_score,
      recommended_product_type
    )
  `)
  .eq('user_id', userId)
  .gte('follower_count', 10000)
  .lte('follower_count', 100000)
  .gte('engagement_rate', 3)
  .gte('creator_dna.desperation_score', 7)
  .is('gameplans.id', null) // No existing gameplan
  .order('creator_dna.desperation_score', { ascending: false })
  .limit(20);
```

### Aggregations

```typescript
// Get campaign statistics
const { data: stats } = await supabase
  .rpc('get_campaign_stats', { user_id: userId });

// Defined as a database function:
/*
CREATE OR REPLACE FUNCTION get_campaign_stats(user_id UUID)
RETURNS TABLE (
  total_campaigns BIGINT,
  active_campaigns BIGINT,
  total_revenue NUMERIC,
  avg_conversion_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) as total_campaigns,
    COUNT(*) FILTER (WHERE phase = 'live') as active_campaigns,
    COALESCE(SUM(actual_revenue), 0) as total_revenue,
    COALESCE(AVG(conversion_rate), 0) as avg_conversion_rate
  FROM gameplans g
  WHERE g.user_id = get_campaign_stats.user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
*/
```

### Upsert Pattern

```typescript
// Create or update creator profile
const { data: creator, error } = await supabase
  .from('creators')
  .upsert(
    {
      user_id: userId,
      instagram_handle: profile.username,
      name: profile.fullName,
      follower_count: profile.followersCount,
      engagement_rate: engagementRate,
      profile_data: profileData,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: 'user_id,instagram_handle',
      ignoreDuplicates: false,
    }
  )
  .select()
  .single();
```

---

## Edge Functions

### Creating an Edge Function

```typescript
// supabase/functions/extract-creator-dna/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { creatorId } = await req.json();

    // Create Supabase client with user's JWT
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get creator data
    const { data: creator } = await supabaseClient
      .from('creators')
      .select('*')
      .eq('id', creatorId)
      .single();

    if (!creator) {
      throw new Error('Creator not found');
    }

    // Call AI for DNA extraction (using Puter or direct API)
    const dnaResult = await extractDNAWithAI(creator);

    // Store DNA
    const { data: dna, error } = await supabaseClient
      .from('creator_dna')
      .upsert({
        creator_id: creatorId,
        ...dnaResult,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    return new Response(JSON.stringify({ dna }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
```

### Invoking Edge Functions

```typescript
// From client
const { data, error } = await supabase.functions.invoke('extract-creator-dna', {
  body: { creatorId },
});

// From server with service role
const { data, error } = await adminClient.functions.invoke('process-payment', {
  body: { campaignId, amount },
});
```

---

## Type Generation

### Generate Types from Schema

```bash
# Install Supabase CLI
npm install -D supabase

# Login
npx supabase login

# Link to project
npx supabase link --project-ref your-project-ref

# Generate types
npx supabase gen types typescript --linked > types/database.ts
```

### Generated Types Example

```typescript
// types/database.ts (auto-generated)
export type Database = {
  public: {
    Tables: {
      creators: {
        Row: {
          id: string;
          user_id: string;
          instagram_handle: string;
          name: string | null;
          follower_count: number | null;
          engagement_rate: number | null;
          profile_data: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          instagram_handle: string;
          name?: string | null;
          // ...
        };
        Update: {
          id?: string;
          user_id?: string;
          // ...
        };
      };
      // ... other tables
    };
    Functions: {
      get_campaign_stats: {
        Args: { user_id: string };
        Returns: {
          total_campaigns: number;
          active_campaigns: number;
          total_revenue: number;
          avg_conversion_rate: number;
        }[];
      };
    };
  };
};
```

---

## Storage Patterns

### Upload Files

```typescript
// Upload pitch deck PDF
export async function uploadPitchDeck(
  campaignId: string,
  pdfBlob: Blob
): Promise<string> {
  const supabase = createClient();
  const fileName = `pitch-decks/${campaignId}.pdf`;

  const { data, error } = await supabase.storage
    .from('exports')
    .upload(fileName, pdfBlob, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (error) throw error;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('exports')
    .getPublicUrl(fileName);

  return publicUrl;
}
```

### Storage RLS

```sql
-- Storage bucket policies
CREATE POLICY "Users can upload to own folder"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'exports' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can read own files"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'exports' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
```

---

## Best Practices

1. **Always use RLS:** Enable on every table, no exceptions
2. **Type everything:** Generate and use Database types
3. **Use server client in Server Components:** Never expose service role key
4. **Validate with getClaims():** Not getSession() for auth checks
5. **Index foreign keys:** Add indexes on all _id columns
6. **Use transactions:** For multi-table operations
7. **Cache queries:** Use React Query or SWR for client-side caching
8. **Monitor usage:** Set up alerts for database size and function invocations

---

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase SSR Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Edge Functions](https://supabase.com/docs/guides/functions)
- [Realtime](https://supabase.com/docs/guides/realtime)
