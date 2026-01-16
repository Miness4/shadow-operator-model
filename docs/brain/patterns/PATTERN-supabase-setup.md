# PATTERN: Supabase Project Setup

**Date:** 2026-01-16
**Type:** Setup Pattern
**Status:** Active

---

## Current Project

**Project ID:** `rzvkdsoyjyikshvipwfl`
**Project URL:** `https://rzvkdsoyjyikshvipwfl.supabase.co`
**Region:** (check dashboard)

---

## Database Schema Status

**Schema executed:** 2026-01-16 via Supabase Dashboard SQL Editor

**Tables created:**
- `profiles` - User profiles linked to auth.users
- `creators` - Instagram creator profiles
- `creator_dna` - Extracted creator analysis
- `gameplans` - Monetization blueprints
- `niche_database` - 200+ niches reference
- `campaign_dna` - Brand voice settings
- `generations` - AI-generated content log
- `story_templates` - 14-day sequence templates
- `contacts` - CRM contacts
- `interactions` - Contact interaction log
- `reminders` - Follow-up reminders

**RLS Policies:** All tables have row-level security enabled with user-scoped access.

---

## Authentication

**Providers enabled:**
- Google OAuth (configured)
- Email/Password (available)

**Google OAuth Config:**
- Client ID and Secret stored in Supabase Dashboard
- Redirect URI: `https://rzvkdsoyjyikshvipwfl.supabase.co/auth/v1/callback`

---

## Environment Variables

Required in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://rzvkdsoyjyikshvipwfl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_APP_URL={environment-specific}
```

---

## Type Generation

To regenerate TypeScript types after schema changes:
```bash
npx supabase gen types typescript --project-id rzvkdsoyjyikshvipwfl > src/types/database.ts
```

Or if linked:
```bash
npx supabase link --project-ref rzvkdsoyjyikshvipwfl
npx supabase gen types typescript --linked > src/types/database.ts
```
