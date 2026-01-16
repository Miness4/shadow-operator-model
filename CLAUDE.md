# CLAUDE.md - Persistent Memory Core

> **LAST UPDATED:** {Auto-updated by Claude Code}
> **CURRENT PHASE:** 0 (Pre-initialization)
> **SESSION COUNT:** 0

---

## 🚨 MANDATORY READS (ALWAYS LOAD THESE)

Before doing ANYTHING, you MUST read these files to maintain context:

### Core Documentation
- `/INIT.md` - Master initialization (read first, always)
- `/docs/brain/_index.md` - Brain index (check for updates)
- `/GET-STARTED.md` - Current state overview (when exists)

### Active Notes (Auto-populated)
<!-- NOTES_START -->
<!-- New note paths are added here automatically -->
<!-- Format: - `/docs/brain/{category}/{filename}.md` -->
<!-- NOTES_END -->

### Research Documents (After Phase 1)
<!-- RESEARCH_START -->
<!-- Populated after research phase -->
<!-- RESEARCH_END -->

### Phase Completions
<!-- PHASES_START -->
<!-- Populated as phases complete -->
<!-- PHASES_END -->

---

## 📋 CURRENT CONTEXT

### Active Phase
```
Phase: 0
Status: Not Started
Next Action: Read INIT.md and begin Phase 1
```

### Active Work Item
```
Task: None
Started: N/A
Branch: main
```

### Known Issues
<!-- ISSUES_START -->
<!-- Active issues tracked here -->
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

### Testing
- Playwright for E2E
- Vitest for units
- Test before committing

### Git
- Conventional commits
- Small, focused commits
- Never skip CI checks

---

## 📊 SESSION LOG

<!-- SESSION_LOG_START -->
| Date | Phase | Duration | Summary |
|------|-------|----------|---------|
<!-- New sessions logged here -->
<!-- SESSION_LOG_END -->

---

## 🔗 QUICK REFERENCES

### Key Commands
```bash
# Development
npm build              # Production build
npm dev                 # Start dev server
npm lint               # Run ESLint
npm typecheck          # Run TypeScript check
npm test               # Run all tests
npm test:e2e           # Playwright tests

# Database
npm db:generate        # Generate types from Supabase
npm db:migrate         # Run migrations
```

### File Locations
- Prompts: `/prompts/`
- Components: `/components/`
- API Routes: `/app/api/`
- Stores: `/stores/`
- Types: `/types/`
- Tests: `/tests/`
- Brain: `/docs/brain/`

---

## 🎯 PHASE CHECKLIST

### Phase 1: Foundation & Research
- [ ] Read all workbooks in `/resources/workbooks/`
- [ ] Read all transcripts in `/resources/transcripts/`
- [ ] Complete `/docs/research/puter-js-deep-dive.md`
- [ ] Complete `/docs/research/apify-integration.md`
- [ ] Complete `/docs/research/supabase-patterns.md`
- [ ] Complete `/docs/research/react-pdf-patterns.md`
- [ ] Complete `/docs/research/workbook-analysis.md`
- [ ] Complete `/docs/research/transcript-insights.md`
- [ ] Initialize Next.js project with TypeScript strict
- [ ] Setup Tailwind + shadcn/ui
- [ ] Configure ESLint + Prettier
- [ ] Setup Supabase project
- [ ] Create database schema
- [ ] Setup RLS policies
- [ ] Create app shell with tabs
- [ ] Initialize memory system directories
- [ ] Create GET-STARTED.md
- [ ] Create PHASE-01-COMPLETE.md

<!-- Additional phase checklists added as phases complete -->

---

## 💾 CONTEXT PRESERVATION

When context window approaches limits:
1. Ensure all active work is noted in `/docs/brain/sessions/`
2. Update this file with current state
3. Commit all changes
4. Next session will restore from MANDATORY READS

**This file is your anchor. Keep it updated. It survives context resets.**
