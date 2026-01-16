# GET-STARTED.md - SHADOWCORE Quick Reference

> **Last Updated:** 2026-01-16
> **Phase:** 1 Complete
> **Status:** Foundation Ready

---

## Current State

Phase 1 of SHADOWCORE is complete. The foundation includes:

- **Next.js 16** with TypeScript strict mode
- **Tailwind CSS v4** with dark theme (CSS-first configuration)
- **Supabase** client/server setup with proxy.ts auth
- **3-Tab Navigation**: Synthesio, Ghostwrite, Flowy
- **AI Model Selector** with 6 models configured
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
APIFY_TOKEN=your-apify-token
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Run Database Migrations

Execute the schema in Supabase SQL Editor:

```bash
# Copy contents of supabase/schema.sql to Supabase Dashboard > SQL Editor
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
│   │   ├── api/health/            # Health check endpoint
│   │   ├── globals.css            # Tailwind v4 theme
│   │   ├── layout.tsx             # Root layout
│   │   └── page.tsx               # Landing page
│   ├── components/
│   │   ├── ui/                    # Base UI components
│   │   └── shared/                # Shared components
│   │       ├── AppShell.tsx       # Main layout wrapper
│   │       ├── TabNavigation.tsx  # 3-tab nav
│   │       └── ModelSelector.tsx  # AI model dropdown
│   ├── lib/
│   │   ├── supabase/              # Supabase clients
│   │   │   ├── client.ts          # Browser client
│   │   │   ├── server.ts          # Server client
│   │   │   └── proxy.ts           # Auth proxy helper
│   │   └── utils/
│   │       └── cn.ts              # Class name utility
│   └── types/
│       ├── database.ts            # Supabase types
│       └── index.ts               # Shared types
├── proxy.ts                       # Next.js 16 auth proxy
├── supabase/
│   └── schema.sql                 # Database schema
├── docs/
│   ├── brain/                     # Memory system
│   │   ├── chains/                # Multi-step reasoning
│   │   ├── learnings/             # Technology discoveries
│   │   └── _index.md              # Brain index
│   └── research/                  # Integration guides
├── prompts/                       # AI prompt templates
└── resources/                     # Workbooks & transcripts
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript check |

---

## Key Files to Know

### Configuration
- `tsconfig.json` - TypeScript strict mode enabled
- `postcss.config.mjs` - Tailwind v4 PostCSS config
- `proxy.ts` - Next.js 16 auth proxy (not middleware!)

### Theme
- `src/app/globals.css` - Complete dark theme with @theme directive

### Auth
- `src/lib/supabase/proxy.ts` - Session management
- `proxy.ts` - Route protection

### Types
- `src/types/database.ts` - Supabase table types
- `src/types/index.ts` - AI models, contacts, etc.

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

## Next Steps (Phase 2)

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
- Runs in Node.js runtime

### Supabase Auth
- Use `getUser()` for server-side validation
- NOT `getSession()` (trusts client cookies)
- RLS policies protect all tables

---

## Resources

- [INIT.MD](/INIT.MD) - Full project specification
- [CLAUDE.md](/CLAUDE.md) - Memory and rules
- [Brain Index](/docs/brain/_index.md) - Notes and learnings
- [Research Guide](/docs/research/RESEARCH-INTEGRATION-GUIDE.md) - Implementation mapping

---

**Phase 1 Complete - Ready for Feature Development**
