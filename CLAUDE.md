# CLAUDE.md - Persistent Memory Core

> **LAST UPDATED:** 2026-01-16
> **CURRENT PHASE:** 1 (Complete)
> **SESSION COUNT:** 1

---

## 🚨 MANDATORY READS (ALWAYS LOAD THESE)

Before doing ANYTHING, you MUST read these files to maintain context:

### Core Documentation
- `/INIT.md` - Master initialization (read first, always)
- `/docs/brain/_index.md` - Brain index (check for updates)
- `/GET-STARTED.md` - Current state overview

### Active Notes (Auto-populated)
<!-- NOTES_START -->
- `/docs/brain/chains/CHAIN-phase1-execution.md` - Phase 1 execution plan
- `/docs/brain/learnings/LEARNING-tailwind-v4.md` - Tailwind CSS v4 patterns
- `/docs/brain/learnings/LEARNING-nextjs-16-proxy.md` - Next.js 16 proxy.ts
- `/docs/brain/decisions/DECISION-environment-agnostic-urls.md` - App URL handling
- `/docs/brain/patterns/PATTERN-supabase-setup.md` - Supabase project details
- `/docs/brain/sessions/SESSION-2026-01-16-phase1-complete.md` - Phase 1 session
<!-- NOTES_END -->

### Research Documents
<!-- RESEARCH_START -->
- `/docs/research/puter-js-deep-dive.md` - AI integration patterns
- `/docs/research/apify-integration.md` - Instagram scraping
- `/docs/research/supabase-patterns.md` - Auth & RLS patterns
- `/docs/research/react-pdf-patterns.md` - PDF generation
- `/docs/research/RESEARCH-INTEGRATION-GUIDE.md` - Feature mapping
<!-- RESEARCH_END -->

### Phase Completions
<!-- PHASES_START -->
- Phase 1: Foundation & Research - COMPLETE (2026-01-16)
<!-- PHASES_END -->

---

## 👤 USER PREFERENCES

### Development Environment
- **Primary environment:** GitHub Codespaces (NOT local VS Code)
- **Never hardcode `localhost:3000`** - Contributors work from various environments
- Each contributor sets `NEXT_PUBLIC_APP_URL` in their own `.env.local`

### Google OAuth Management
- User manually adds new origins/redirect URIs to Google Cloud Console when environment changes
- **REMINDER:** When implementing auth callback routes, remind user to add `/api/auth/callback` or wildcard patterns to Google Console

### Database Management
- User prefers running SQL via Supabase Dashboard SQL Editor
- Schema was executed manually on 2026-01-16

### Commit Messages
- **Do NOT mention "Claude", "AI assistant", or similar** in commit messages
- Write commits as if a human developer made the changes

---

## 📋 CURRENT CONTEXT

### Active Phase
```
Phase: 1 (Complete)
Status: Foundation Ready
Next Action: Begin Phase 2 - Core Features
```

### Supabase Project
```
Project ID: rzvkdsoyjyikshvipwfl
URL: https://rzvkdsoyjyikshvipwfl.supabase.co
Schema: Executed (2026-01-16)
Google OAuth: Configured
```

### Active Work Item
```
Task: None (Phase 1 Complete)
Started: N/A
Branch: main
```

### Known Issues
<!-- ISSUES_START -->
- Testing setup (Playwright + Vitest) deferred to Phase 2
<!-- ISSUES_END -->

---

## 🧠 MEMORY PROTOCOL

### On Every Interaction:
1. Read all files in MANDATORY READS section
2. Check for new notes in `/docs/brain/_index.md`
3. Load current phase context
4. Execute requested task
5. Write appropriate notes
6. Update this file if new notes created

### Note Creation Triggers:
- **DECISION:** Any architectural or implementation choice
- **PATTERN:** Any reusable code pattern established
- **ERROR:** Any error encountered (even if fixed immediately)
- **FIX:** Any bug fix or correction
- **LEARNING:** Any new insight about tools/libraries
- **CHAIN:** Any multi-step reasoning process
- **SESSION:** Start and end of significant work sessions

### Note Update Protocol:
```
1. Create note in appropriate /docs/brain/{category}/
2. Add entry to /docs/brain/_index.md
3. Add path to MANDATORY READS > Active Notes section below
4. Commit with message: "docs: add {NOTE_TYPE} - {title}"
```

---

## 🔒 RULES ENFORCEMENT

### TypeScript
- Strict mode enabled
- No `any` - use `unknown` and narrow
- Explicit return types on functions
- Interfaces over types where possible

### Code Quality
- ESLint must pass with 0 warnings
- Prettier formatting applied
- JSDoc on all exports
- Meaningful variable names

### Environment URLs
- **NEVER use `localhost:3000` as default anywhere**
- Always reference `process.env.NEXT_PUBLIC_APP_URL`
- Each environment configures its own URL in `.env.local`

### Testing
- Playwright for E2E
- Vitest for units
- Test before committing

### Git
- Conventional commits
- Small, focused commits
- Never skip CI checks
- **No AI/assistant mentions in commits**

---

## 📊 SESSION LOG

<!-- SESSION_LOG_START -->
| Date | Phase | Duration | Summary |
|------|-------|----------|---------|
| 2026-01-16 | 1 | ~1.5hr | Phase 1 Complete: Foundation, Research docs, Next.js 16, Tailwind v4, App shell, Supabase setup |
<!-- SESSION_LOG_END -->

---

## 🔗 QUICK REFERENCES

### Key Commands
```bash
# Development
npm run build          # Production build
npm run dev            # Start dev server
npm run lint           # Run ESLint

# Database
npx supabase gen types typescript --project-id rzvkdsoyjyikshvipwfl > src/types/database.ts
```

### File Locations
- Prompts: `/prompts/`
- Components: `/src/components/`
- API Routes: `/src/app/api/`
- Stores: `/src/stores/`
- Types: `/src/types/`
- Tests: `/tests/`
- Brain: `/docs/brain/`

---

## 🎯 PHASE CHECKLIST

### Phase 1: Foundation & Research ✅ COMPLETE
- [x] Expand research documentation
- [x] Initialize Next.js 16 with TypeScript strict
- [x] Setup Tailwind v4 (CSS-first) + shadcn/ui base
- [x] Configure ESLint (0 warnings)
- [x] Create Supabase client files
- [x] Create database schema SQL
- [x] Setup RLS policies
- [x] Create app shell with 3-tab navigation
- [x] Create ModelSelector component
- [x] Initialize memory system directories
- [x] Create GET-STARTED.md
- [x] Configure .env.local with Supabase credentials
- [x] Execute database schema in Supabase
- [x] Configure Google OAuth
- [ ] Setup testing (deferred)

### Phase 2: Core Features (Next)
- [ ] Creator DNA Scanner (Synthesio)
- [ ] Story Copy Generator (Ghostwrite)
- [ ] Campaign Dashboard (Flowy)
- [ ] Basic payment tracking
- [ ] Outreach interaction tracker

---

## 🔔 REMINDERS FOR FUTURE

### When Implementing Auth Callbacks
Remind user to add to Google Cloud Console:
- Authorized redirect URIs: `{APP_URL}/api/auth/callback`
- Consider wildcard patterns for dynamic environments

### When Adding New Environments
User will need to:
1. Add new origin to Google Cloud Console
2. Update `.env.local` with new `NEXT_PUBLIC_APP_URL`

---

## 💾 CONTEXT PRESERVATION

When context window approaches limits:
1. Ensure all active work is noted in `/docs/brain/sessions/`
2. Update this file with current state
3. Commit all changes
4. Next session will restore from MANDATORY READS

**This file is your anchor. Keep it updated. It survives context resets.**
