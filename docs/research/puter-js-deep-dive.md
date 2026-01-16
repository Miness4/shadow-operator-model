# Puter.js Deep Dive

**Last Updated:** 2026-01-16
**Status:** Comprehensive Research Complete

---

## Overview

Puter.js is a revolutionary client-side SDK that provides serverless cloud services directly from the browser. It eliminates the need for backend infrastructure by offering:

- **Cloud Filesystem (FS):** Persistent file storage without server
- **AI Integration:** Access to 500+ AI models without API keys
- **Authentication:** Built-in user auth via browser sessions
- **Key-Value Storage:** Simple persistent data storage
- **Hosting:** Deploy static sites instantly

The key value proposition: **Zero infrastructure, zero API keys, zero backend code.**

---

## AI Integration (Critical for SHADOWCORE)

### Available Models (500+)

Puter.js provides access to models from all major providers:

```typescript
// Model categories available
const AI_PROVIDERS = {
  anthropic: ['claude-opus-4.5', 'claude-sonnet-4.5', 'claude-haiku-4.5'],
  openai: ['gpt-5.2', 'gpt-5.2-mini', 'o3', 'o4-mini'],
  google: ['gemini-3-pro', 'gemini-3-flash'],
  meta: ['llama-4-405b', 'llama-4-70b'],
  mistral: ['mistral-large-3', 'mixtral-9x22b'],
  // ... 500+ total models
};
```

### AI Chat API

```typescript
// Basic chat completion
const response = await puter.ai.chat(
  'Generate a monetization gameplan for a fitness creator with 50K followers',
  { model: 'claude-opus-4.5' }
);
console.log(response.message.content);

// With system prompt
const response = await puter.ai.chat([
  { role: 'system', content: 'You are a creator monetization expert...' },
  { role: 'user', content: 'Analyze this Instagram profile...' }
], { model: 'claude-opus-4.5' });

// Streaming response
const stream = await puter.ai.chat(
  'Generate 14-day story copy sequence',
  { model: 'claude-opus-4.5', stream: true }
);
for await (const chunk of stream) {
  process.stdout.write(chunk.text);
}
```

### Model Selection Logic

```typescript
interface AIModelConfig {
  id: string;
  name: string;
  provider: string;
  tier: 'premium' | 'standard' | 'economy';
  contextWindow: number;
  costPer1kTokens: number;
  bestFor: string[];
}

const RECOMMENDED_MODELS: AIModelConfig[] = [
  {
    id: 'claude-opus-4.5',
    name: 'Claude Opus 4.5',
    provider: 'anthropic',
    tier: 'premium',
    contextWindow: 200000,
    costPer1kTokens: 0.015,
    bestFor: ['complex analysis', 'long-form content', 'strategic planning']
  },
  {
    id: 'claude-sonnet-4.5',
    name: 'Claude Sonnet 4.5',
    provider: 'anthropic',
    tier: 'standard',
    contextWindow: 200000,
    costPer1kTokens: 0.003,
    bestFor: ['general tasks', 'copy generation', 'quick responses']
  },
  {
    id: 'gpt-5.2',
    name: 'GPT-5.2',
    provider: 'openai',
    tier: 'standard',
    contextWindow: 128000,
    costPer1kTokens: 0.005,
    bestFor: ['creative writing', 'brainstorming', 'conversational']
  },
  {
    id: 'o3',
    name: 'O3',
    provider: 'openai',
    tier: 'premium',
    contextWindow: 128000,
    costPer1kTokens: 0.020,
    bestFor: ['reasoning', 'analysis', 'code generation']
  },
  {
    id: 'gemini-3-pro',
    name: 'Gemini 3 Pro',
    provider: 'google',
    tier: 'standard',
    contextWindow: 1000000,
    costPer1kTokens: 0.002,
    bestFor: ['large context', 'document analysis', 'multimodal']
  }
];
```

---

## Authentication Flow

### Browser-Based Auth

Puter handles auth entirely in the browser:

```typescript
// Check if user is authenticated
const isLoggedIn = puter.auth.isSignedIn();

// Get current user info
if (isLoggedIn) {
  const user = await puter.auth.getUser();
  console.log(user.username, user.email);
}

// Sign in (opens Puter auth modal)
await puter.auth.signIn();

// Sign out
await puter.auth.signOut();

// Listen for auth state changes
puter.auth.onAuthStateChanged((user) => {
  if (user) {
    console.log('User signed in:', user.username);
  } else {
    console.log('User signed out');
  }
});
```

### Integration with Supabase

For SHADOWCORE, we use Puter for AI and Supabase for database:

```typescript
// After Puter auth, sync with Supabase
const syncUserToSupabase = async () => {
  const puterUser = await puter.auth.getUser();

  // Create/update Supabase profile
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: supabase.auth.getUser().id, // Supabase auth ID
      puter_username: puterUser.username,
      preferred_model: 'claude-opus-4.5',
      updated_at: new Date().toISOString()
    });
};
```

---

## Cloud Filesystem API

### File Operations

```typescript
// Write file
await puter.fs.writeFile('/shadowcore/prompts/creator-dna.md', promptContent);

// Read file
const content = await puter.fs.readFile('/shadowcore/prompts/creator-dna.md');

// Check if exists
const exists = await puter.fs.exists('/shadowcore/prompts/creator-dna.md');

// Delete file
await puter.fs.deleteFile('/shadowcore/exports/old-gameplan.pdf');

// Get file info
const stat = await puter.fs.stat('/shadowcore/exports/pitch.pdf');
console.log(stat.size, stat.modified);
```

### Directory Operations

```typescript
// Create directory
await puter.fs.mkdir('/shadowcore/campaigns/2026-01');

// List directory contents
const entries = await puter.fs.readdir('/shadowcore/campaigns');
for (const entry of entries) {
  console.log(entry.name, entry.is_dir);
}

// Remove directory (recursive)
await puter.fs.rmdir('/shadowcore/campaigns/old', { recursive: true });
```

### Binary Files (PDFs, Images)

```typescript
// Write PDF blob
const pdfBlob = await generatePitchDeckPDF(gameplanData);
await puter.fs.writeFile('/shadowcore/exports/pitch-deck.pdf', pdfBlob);

// Read as blob
const blob = await puter.fs.readFile('/shadowcore/exports/pitch-deck.pdf', {
  returnType: 'blob'
});

// Get public URL for sharing
const publicUrl = await puter.fs.getPublicURL('/shadowcore/exports/pitch-deck.pdf');
```

---

## Next.js Integration

### Client Component Setup

```tsx
// components/providers/PuterProvider.tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface PuterContextType {
  puter: typeof window.puter | null;
  isReady: boolean;
  isAuthenticated: boolean;
  user: PuterUser | null;
}

const PuterContext = createContext<PuterContextType>({
  puter: null,
  isReady: false,
  isAuthenticated: false,
  user: null
});

export function PuterProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PuterContextType>({
    puter: null,
    isReady: false,
    isAuthenticated: false,
    user: null
  });

  useEffect(() => {
    // Load Puter.js script
    const script = document.createElement('script');
    script.src = 'https://js.puter.com/v2/';
    script.async = true;
    script.onload = async () => {
      const puter = window.puter;
      const isAuthenticated = puter.auth.isSignedIn();
      const user = isAuthenticated ? await puter.auth.getUser() : null;

      setState({
        puter,
        isReady: true,
        isAuthenticated,
        user
      });

      // Listen for auth changes
      puter.auth.onAuthStateChanged(async (user) => {
        setState(prev => ({
          ...prev,
          isAuthenticated: !!user,
          user
        }));
      });
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <PuterContext.Provider value={state}>
      {children}
    </PuterContext.Provider>
  );
}

export const usePuter = () => useContext(PuterContext);
```

### AI Hook

```tsx
// hooks/useAI.ts
'use client';

import { usePuter } from '@/components/providers/PuterProvider';
import { useState, useCallback } from 'react';

interface UseAIOptions {
  model?: string;
  systemPrompt?: string;
}

export function useAI(options: UseAIOptions = {}) {
  const { puter, isReady } = usePuter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const chat = useCallback(async (prompt: string) => {
    if (!puter || !isReady) {
      throw new Error('Puter not initialized');
    }

    setIsLoading(true);
    setError(null);

    try {
      const messages = options.systemPrompt
        ? [
            { role: 'system', content: options.systemPrompt },
            { role: 'user', content: prompt }
          ]
        : prompt;

      const response = await puter.ai.chat(messages, {
        model: options.model || 'claude-opus-4.5'
      });

      return response.message.content;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('AI request failed');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [puter, isReady, options.model, options.systemPrompt]);

  const streamChat = useCallback(async function* (prompt: string) {
    if (!puter || !isReady) {
      throw new Error('Puter not initialized');
    }

    setIsLoading(true);
    setError(null);

    try {
      const messages = options.systemPrompt
        ? [
            { role: 'system', content: options.systemPrompt },
            { role: 'user', content: prompt }
          ]
        : prompt;

      const stream = await puter.ai.chat(messages, {
        model: options.model || 'claude-opus-4.5',
        stream: true
      });

      for await (const chunk of stream) {
        yield chunk.text;
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('AI stream failed');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [puter, isReady, options.model, options.systemPrompt]);

  return { chat, streamChat, isLoading, error, isReady };
}
```

---

## Error Handling

```typescript
// Comprehensive error handling for Puter operations
async function safePuterOperation<T>(
  operation: () => Promise<T>,
  fallback?: T
): Promise<T | undefined> {
  try {
    return await operation();
  } catch (error) {
    if (error instanceof Error) {
      // Common Puter errors
      if (error.message.includes('not authenticated')) {
        // Trigger re-auth
        await puter.auth.signIn();
        return operation(); // Retry
      }
      if (error.message.includes('rate limit')) {
        // Wait and retry
        await new Promise(resolve => setTimeout(resolve, 1000));
        return operation();
      }
      if (error.message.includes('model not available')) {
        // Fallback to different model
        console.warn('Model unavailable, using fallback');
        // Handle model fallback
      }
    }
    console.error('Puter operation failed:', error);
    return fallback;
  }
}
```

---

## SHADOWCORE Integration Points

### Synthesio (Creator DNA)

```typescript
// lib/ai/synthesio.ts
export async function extractCreatorDNA(
  profileData: InstagramProfile,
  model: string = 'claude-opus-4.5'
): Promise<CreatorDNA> {
  const prompt = `
    Analyze this Instagram creator profile and extract their DNA:

    Profile: ${JSON.stringify(profileData)}

    Return JSON with:
    - niche
    - audience_pain_points (array of 3)
    - creator_archetype (authority|lifestyle|educator|personality)
    - desperation_score (1-10)
    - monetization_gaps
    - recommended_product_type
  `;

  const response = await puter.ai.chat(prompt, { model });
  return JSON.parse(response.message.content);
}
```

### Ghostwrite (Story Copy)

```typescript
// lib/ai/ghostwrite.ts
export async function generateStoryCopy(
  day: number,
  phase: number,
  creatorDNA: CreatorDNA,
  model: string = 'claude-opus-4.5'
): Promise<StoryCopy> {
  const prompt = `
    Generate Instagram story copy for Day ${day} (Phase ${phase}).

    Creator: ${creatorDNA.niche}
    Audience pain points: ${creatorDNA.audience_pain_points.join(', ')}
    Product type: ${creatorDNA.recommended_product_type}

    Requirements:
    - 60-80 words
    - Activate psychological button: ${getButtonForDay(day)}
    - Include image direction

    Return JSON with: copy, psychological_trigger, image_direction
  `;

  const response = await puter.ai.chat(prompt, { model });
  return JSON.parse(response.message.content);
}
```

---

## TypeScript Types

```typescript
// types/puter.d.ts
declare global {
  interface Window {
    puter: PuterSDK;
  }
}

interface PuterSDK {
  auth: PuterAuth;
  ai: PuterAI;
  fs: PuterFS;
  kv: PuterKV;
}

interface PuterAuth {
  isSignedIn(): boolean;
  signIn(): Promise<void>;
  signOut(): Promise<void>;
  getUser(): Promise<PuterUser>;
  onAuthStateChanged(callback: (user: PuterUser | null) => void): void;
}

interface PuterUser {
  username: string;
  email: string;
  uuid: string;
}

interface PuterAI {
  chat(
    messages: string | ChatMessage[],
    options?: ChatOptions
  ): Promise<ChatResponse>;
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatOptions {
  model?: string;
  stream?: boolean;
  temperature?: number;
  max_tokens?: number;
}

interface ChatResponse {
  message: {
    role: 'assistant';
    content: string;
  };
}

interface PuterFS {
  writeFile(path: string, content: string | Blob): Promise<void>;
  readFile(path: string, options?: ReadOptions): Promise<string | Blob>;
  exists(path: string): Promise<boolean>;
  deleteFile(path: string): Promise<void>;
  mkdir(path: string): Promise<void>;
  readdir(path: string): Promise<DirectoryEntry[]>;
  rmdir(path: string, options?: RmdirOptions): Promise<void>;
  stat(path: string): Promise<FileStat>;
  getPublicURL(path: string): Promise<string>;
}

interface DirectoryEntry {
  name: string;
  is_dir: boolean;
}

interface FileStat {
  size: number;
  modified: Date;
  created: Date;
}
```

---

## Best Practices

1. **Always check `isReady`** before making Puter calls
2. **Use streaming** for long-form content generation
3. **Implement model fallback** for unavailable models
4. **Cache AI responses** in Supabase for repeated queries
5. **Use appropriate models** - premium for analysis, standard for copy
6. **Handle rate limits** with exponential backoff
7. **Store prompts in files** for version control and iteration

---

## Resources

- [Puter.js Documentation](https://docs.puter.com/)
- [Puter AI Models List](https://docs.puter.com/ai/models)
- [Puter GitHub](https://github.com/HeyPuter/puter)
- [Next.js Integration Guide](https://docs.puter.com/guides/nextjs)
