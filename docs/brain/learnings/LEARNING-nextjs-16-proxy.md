# LEARNING: Next.js 16 proxy.ts (Oct 2025+)

**Created:** 2026-01-16
**Type:** Technology Learning
**Status:** Active

---

## Key Changes from middleware.ts

### Middleware is DEPRECATED

In Next.js 16 (released October 2025), `middleware.ts` is deprecated. Use `proxy.ts` instead.

### Export Function Renamed

```typescript
// middleware.ts (OLD - DEPRECATED)
export function middleware(request: NextRequest) { ... }

// proxy.ts (NEW)
export async function proxy(request: NextRequest) { ... }
```

### Runtime Change

- **middleware.ts**: Ran in Edge Runtime
- **proxy.ts**: Runs in Node.js Runtime (more capabilities)

### File Location

The file should be at the project root or in the `src/` directory:

```
/
├── proxy.ts          # Root level
├── src/
│   └── proxy.ts      # Or in src/
```

---

## Config Options Renamed

```typescript
// middleware.ts (OLD)
export const config = {
  skipMiddlewareUrlNormalize: true
}

// proxy.ts (NEW)
export const config = {
  skipProxyUrlNormalize: true
}
```

---

## Migration Command

Next.js provides a codemod for automatic migration:

```bash
npx @next/codemod@latest middleware-to-proxy .
```

---

## Auth Pattern with Supabase

### CRITICAL: Use getUser() for Server-Side Validation

**DO NOT use `getSession()`** for server-side auth checks - it trusts client cookies and can be spoofed.

**DO use `getUser()`** which makes a request to Supabase Auth server to validate the JWT.

```typescript
// proxy.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
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

  // IMPORTANT: Use getUser() for secure server-side validation
  const { data: { user } } = await supabase.auth.getUser();

  // Protect routes
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

---

## Benefits of proxy.ts over middleware.ts

1. **Node.js Runtime**: Access to full Node.js APIs, not limited to Edge
2. **Better Error Handling**: More robust error handling capabilities
3. **Database Access**: Can directly access databases without Edge limitations
4. **File System**: Can read files from the filesystem
5. **Longer Execution Time**: Not limited by Edge runtime timeouts

---

## SHADOWCORE Implementation

Our proxy.ts protects dashboard routes and handles session refresh:

```typescript
// Protected routes
const protectedPaths = ['/synthesio', '/ghostwrite', '/flowy'];
const isProtected = protectedPaths.some((path) =>
  request.nextUrl.pathname.startsWith(path)
);

if (!user && isProtected) {
  const url = request.nextUrl.clone();
  url.pathname = '/login';
  url.searchParams.set('next', request.nextUrl.pathname);
  return NextResponse.redirect(url);
}
```

---

## Resources

- [Next.js 16 Release Notes](https://nextjs.org/blog/next-16)
- [Supabase SSR Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Auth Best Practices](https://supabase.com/docs/guides/auth/server-side-rendering)
