# CHAIN: Phase 1 Execution - SHADOWCORE Foundation

**Created:** 2026-01-16
**Type:** Multi-step Implementation Chain
**Phase:** 1 - Foundation & Research

---

## Chain Overview

This chain documents the complete execution of Phase 1 for the SHADOWCORE system, establishing the foundational infrastructure for an AI-powered business hivemind.

---

## Decision Points

### 1. Technology Stack Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Next.js 16 | Latest stable with proxy.ts support |
| CSS | Tailwind v4 (CSS-first) | Modern approach, no config file needed |
| Database | Supabase | Auth + RLS + Realtime built-in |
| AI Integration | Puter.js | 500+ models, no API keys needed |
| Component Library | shadcn/ui | Customizable, accessible, modern |

### 2. Architecture Decisions

- **App Router** over Pages Router for better server components support
- **proxy.ts** instead of middleware.ts (Next.js 16 standard)
- **CSS Variables** for theming via Tailwind v4 @theme directive
- **Dark mode only** - matches target user aesthetic
- **3-tab navigation** for clear module separation

---

## Execution Steps

### Step 1: Memory System Initialization
- [x] Create `/docs/brain/decisions/`
- [x] Create `/docs/brain/patterns/`
- [x] Create `/docs/brain/errors/`
- [x] Create `/docs/brain/fixes/`
- [x] Create `/docs/brain/learnings/`
- [x] Create `/docs/brain/chains/`
- [x] Create `/docs/brain/sessions/`

### Step 2: Research Documentation Expansion
- [ ] Expand `puter-js-deep-dive.md` with auth flow, API methods, error handling
- [ ] Expand `apify-integration.md` with Instagram actors, data structures
- [ ] Expand `supabase-patterns.md` with OAuth, RLS, Edge Functions
- [ ] Expand `react-pdf-patterns.md` with styling, dark theme, layouts

### Step 3: Next.js 16 Project Setup
- [ ] Initialize project with TypeScript strict mode
- [ ] Configure Tailwind CSS v4 (CSS-first config)
- [ ] Setup shadcn/ui components
- [ ] Configure ESLint + Prettier
- [ ] Create proxy.ts for auth

### Step 4: Supabase Configuration
- [ ] Create client files (browser + server)
- [ ] Create database schema SQL
- [ ] Define RLS policies
- [ ] Create type definitions

### Step 5: App Shell Construction
- [ ] Create root layout with dark theme
- [ ] Build TabNavigation component
- [ ] Build ModelSelector component
- [ ] Create dashboard layout
- [ ] Create placeholder pages (Synthesio, Ghostwrite, Flowy)

### Step 6: Testing Setup
- [ ] Configure Playwright for E2E
- [ ] Configure Vitest for unit tests

### Step 7: Documentation
- [ ] Create GET-STARTED.md
- [ ] Create LEARNING notes for critical discoveries
- [ ] Update CLAUDE.md with new note paths

---

## Critical Technology Notes

### Tailwind CSS v4 (2025+)
```css
/* NO tailwind.config.js needed */
@import "tailwindcss";

@theme {
  --color-primary: oklch(0.80 0.20 155);
}
```

### Next.js 16 proxy.ts (Oct 2025+)
```typescript
// proxy.ts (NOT middleware.ts)
export async function proxy(request: NextRequest) {
  // Auth logic here
}
```

---

## Verification Criteria

- [ ] `npm run typecheck` passes with 0 errors
- [ ] `npm run lint` passes with 0 warnings
- [ ] `npm run build` completes successfully
- [ ] Dev server starts and loads correctly
- [ ] All 3 tabs navigate properly
- [ ] Model selector dropdown functions

---

## Related Notes

- `/docs/brain/learnings/LEARNING-tailwind-v4.md`
- `/docs/brain/learnings/LEARNING-nextjs-16-proxy.md`
- `/docs/research/RESEARCH-INTEGRATION-GUIDE.md`
