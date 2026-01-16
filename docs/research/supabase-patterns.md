# Supabase Patterns

## Overview
PostgreSQL DB with Auth, RLS for user-owned data, Realtime, Storage.

## Next.js Integration
`@supabase/ssr` for SSR auth in server components.

## TypeScript Types
Generated via `npm db:generate`.

## Examples
### RLS Policy
```sql
CREATE POLICY \"User owns prompts\" ON prompts FOR ALL USING (auth.uid() = user_id);
```

**Sources:** [Supabase Docs](https://supabase.com/docs)