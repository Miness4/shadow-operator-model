# DECISION: Environment-Agnostic App URLs

**Date:** 2026-01-16
**Type:** Architecture Decision
**Status:** Active

---

## Context

Contributors may work on SHADOWCORE from different environments:
- GitHub Codespaces (cloud-based)
- Local VS Code (localhost)
- Other cloud IDEs
- Production deployment

Each environment has its own base URL.

---

## Decision

**Do NOT hardcode `localhost:3000` as the default app URL anywhere in the codebase.**

Instead:
1. Each contributor configures `NEXT_PUBLIC_APP_URL` in their `.env.local`
2. Code references `process.env.NEXT_PUBLIC_APP_URL` when needed
3. OAuth redirect URIs must be added to Google Console per environment

---

## Current Environment

**User's Codespace URL:** `https://didactic-winner-x5qg6j9w9x9vh99qg-3000.app.github.dev`

---

## Google OAuth Maintenance

When a new environment is used, add to Google Cloud Console:

**Authorized JavaScript origins:**
```
https://{new-environment-url}
```

**Authorized redirect URIs:**
```
https://rzvkdsoyjyikshvipwfl.supabase.co/auth/v1/callback
```

Note: The Supabase callback URL stays constant. Only the JS origin changes per environment.

---

## Future Reminder

When implementing auth callback routes, remind user to add:
- `/api/auth/callback` routes to Google Console if needed
- Wildcard patterns for dynamic subdomains if applicable

---

## Implementation

```typescript
// Correct - use env var
const appUrl = process.env.NEXT_PUBLIC_APP_URL;

// Incorrect - don't hardcode
const appUrl = 'http://localhost:3000'; // NO!
```
