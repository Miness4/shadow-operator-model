# GET-STARTED.md - SHADOWCORE Quick Reference

> **Last Updated:** 2026-01-17
> **Phase:** 2 Complete
> **Status:** Authentication Ready

---

## Current State

Phase 2 of SHADOWCORE is complete. The foundation includes:

- **Next.js 16** with TypeScript strict mode
- **Tailwind CSS v4** with dark theme (CSS-first configuration)
- **Supabase** client/server setup with proxy.ts auth
- **Google OAuth** authentication via Supabase
- **Puter.js** AI integration with lazy authentication
- **3-Tab Navigation**: Synthesio, Ghostwrite, Flowy
- **AI Model Selector** with 6 models and preference persistence
- **Complete Database Schema** with RLS policies

---

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=https://your-codespace-url.github.dev
APIFY_TOKEN=your-apify-token
```

**IMPORTANT:** Set `NEXT_PUBLIC_APP_URL` to your Codespace/environment URL.

### 3. Configure Google OAuth

1. Go to Google Cloud Console > APIs & Services > Credentials
2. Add authorized redirect URI: `{NEXT_PUBLIC_APP_URL}/auth/callback`
3. Ensure Supabase has Google OAuth provider enabled

### 4. Run Development Server

```bash
npm run dev
```

Open your Codespace URL (not localhost)

### 5. Run Database Migrations

Execute the schema in Supabase SQL Editor:

```bash
# Copy contents of supabase/schema.sql to Supabase Dashboard > SQL Editor
```

---

## Authentication Flow

### Login Flow
1. User clicks "Continue with Google" on `/login`
2. Supabase redirects to Google OAuth
3. Google redirects to `/auth/callback`
4. Session created, profile upserted
5. User redirected to `/synthesio`

### Puter AI Authentication
- Triggered lazily when user accesses AI features
- "Connect AI" pill in header shows status
- Model selector disabled until Puter connected
- ProtectedFeature wrapper gates AI components

### Auth State Management
```tsx
// Combined auth hook
const { user, signOut, isFullyAuthenticated } = useAuth();

// Check if AI features available
const { isAuthenticated: hasPuterAuth } = usePuterAuth();

// Access/update profile
const { profile, updatePreference } = useProfile();
```

---

## Project Structure

```
/
├── src/
│   ├── app/
│   │   ├── (auth)/login/          # Login page
│   │   ├── (dashboard)/           # Protected dashboard
│   │   │   ├── synthesio/         # Product Architect
│   │   │   ├── ghostwrite/        # Copywriting OS
│   │   │   └── flowy/             # CRM
│   │   ├── api/
│   │   │   ├── health/            # Health check
│   │   │   └── user/              # User profile/preferences
│   │   ├── auth/callback/         # OAuth callback
│   │   ├── globals.css            # Tailwind v4 theme
│   │   └── layout.tsx             # Root layout with Providers
│   ├── components/
│   │   ├── auth/                  # Auth components
│   │   │   ├── LoginButton.tsx    # Google OAuth button
│   │   │   ├── PuterAuthModal.tsx # Puter connection modal
│   │   │   └── ProtectedFeature.tsx # AI feature gate
│   │   ├── providers/             # Context providers
│   │   │   ├── AuthProvider.tsx   # Supabase auth
│   │   │   └── PuterProvider.tsx  # Puter SDK
│   │   ├── shared/                # Shared components
│   │   │   ├── AppShell.tsx       # Main layout wrapper
│   │   │   ├── UserMenu.tsx       # User dropdown
│   │   │   ├── AuthStatusPill.tsx # Puter status
│   │   │   ├── TabNavigation.tsx  # 3-tab nav
│   │   │   └── ModelSelector.tsx  # AI model dropdown
│   │   └── skeletons/             # Loading skeletons
│   ├── hooks/
│   │   ├── useAuth.ts             # Combined auth hook
│   │   ├── useProfile.ts          # Profile management
│   │   └── useAI.ts               # AI operations
│   ├── stores/
│   │   └── auth.ts                # Zustand auth store
│   ├── lib/
│   │   └── supabase/              # Supabase clients
│   └── types/
│       ├── database.ts            # Supabase types
│       ├── puter.d.ts             # Puter SDK types
│       └── index.ts               # Shared types
├── proxy.ts                       # Next.js 16 auth proxy
├── supabase/
│   └── schema.sql                 # Database schema
└── docs/
    ├── brain/                     # Memory system
    ├── phases/                    # Phase completion markers
    └── research/                  # Integration guides
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint (must be 0 warnings) |

---

## Key Components

### Auth Components
- `<LoginButton />` - Google OAuth login
- `<UserMenu />` - User avatar with dropdown
- `<AuthStatusPill />` - Puter connection status
- `<PuterAuthModal />` - AI connection prompt
- `<ProtectedFeature />` - Wrap AI features

### Hooks
- `useAuth()` - Combined auth state and actions
- `useProfile()` - Profile data and updates
- `useAI()` - AI chat operations
- `usePuter()` - Puter SDK instance

### Stores
- `useAuthStore` - Zustand store for auth state
- `useSupabaseAuth()` - Supabase auth selector
- `usePuterAuth()` - Puter auth selector

---

## Three Pillars

### 1. Synthesio (Product Architect)
- Creator DNA Scanner
- Gameplan Generator
- Niche Explorer
- Pitch Deck Generator

### 2. Ghostwrite (Copywriting OS)
- 14-Day Story Sequence
- Sales Page Builder
- Email Sequence Generator
- 11 Psychological Buy Buttons

### 3. Flowy (CRM)
- Contact Management
- Pipeline Tracking
- Outreach Automation
- Reminder System

---

## Next Steps (Phase 3)

1. **Creator DNA Scanner** - Apify integration for Instagram scraping
2. **Story Copy Generator** - AI-powered 14-day sequences
3. **Campaign Dashboard** - Real-time metrics tracking
4. **Outreach Automation** - Follow-up sequences

---

## Important Notes

### Tailwind v4
- No `tailwind.config.js` - all config in `globals.css`
- Uses `@theme` directive for tokens
- Colors use `oklch()` format

### Next.js 16
- Uses `proxy.ts` NOT `middleware.ts`
- Export `proxy()` function (not `middleware()`)
- `useSearchParams()` requires Suspense boundary

### Supabase Auth
- Use `getUser()` for server-side validation
- NOT `getSession()` (trusts client cookies)
- RLS policies protect all tables

### Environment URLs
- **Never hardcode localhost** - contributors work from different environments
- Always use `process.env.NEXT_PUBLIC_APP_URL`

---

## Resources

- [INIT.MD](/INIT.MD) - Full project specification
- [CLAUDE.md](/CLAUDE.md) - Memory and rules
- [Brain Index](/docs/brain/_index.md) - Notes and learnings
- [Phase 2 Complete](/docs/phases/PHASE-02-COMPLETE.md) - Auth implementation details
- [Research Guide](/docs/research/RESEARCH-INTEGRATION-GUIDE.md) - Implementation mapping

---

**Phase 2 Complete - Authentication Ready for Feature Development**
