/**
 * TypeScript declarations for Puter.js SDK
 * @see https://docs.puter.com/
 *
 * The Puter SDK is loaded via script tag (https://js.puter.com/v2/)
 * and exposes a global `puter` object on `window`.
 */

interface PuterAuthUser {
  username: string;
  uuid: string;
  email?: string;
}

interface PuterAuthAPI {
  /**
   * Check if user is currently signed in
   */
  isSignedIn: () => Promise<boolean>;

  /**
   * Initiate sign-in flow (opens Puter auth modal)
   */
  signIn: () => Promise<PuterAuthUser>;

  /**
   * Sign out the current user
   */
  signOut: () => Promise<void>;

  /**
   * Get the current authenticated user
   */
  getUser: () => Promise<PuterAuthUser | null>;

  /**
   * Listen to auth state changes
   */
  onAuthStateChanged: (callback: (user: PuterAuthUser | null) => void) => void;
}

interface PuterAIChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface PuterAIChatOptions {
  model?: string;
  stream?: boolean;
  temperature?: number;
  max_tokens?: number;
}

interface PuterAIChatResponse {
  message: {
    role: 'assistant';
    content: string;
  };
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface PuterAIStreamChunk {
  text?: string;
  done?: boolean;
}

interface PuterAIAPI {
  /**
   * Send a chat completion request
   */
  chat: (
    prompt: string | PuterAIChatMessage[],
    options?: PuterAIChatOptions
  ) => Promise<PuterAIChatResponse>;

  /**
   * Send a streaming chat completion request
   */
  chat: (
    prompt: string | PuterAIChatMessage[],
    options: PuterAIChatOptions & { stream: true }
  ) => AsyncGenerator<PuterAIStreamChunk>;
}

interface PuterFSAPI {
  /**
   * Write content to a file
   */
  write: (path: string, content: string | Blob) => Promise<void>;

  /**
   * Read content from a file
   */
  read: (path: string) => Promise<Blob>;

  /**
   * Create a directory
   */
  mkdir: (path: string) => Promise<void>;

  /**
   * List directory contents
   */
  readdir: (path: string) => Promise<string[]>;

  /**
   * Delete a file or directory
   */
  delete: (path: string) => Promise<void>;

  /**
   * Check if path exists
   */
  stat: (path: string) => Promise<{ name: string; is_dir: boolean } | null>;
}

interface PuterSDK {
  auth: PuterAuthAPI;
  ai: PuterAIAPI;
  fs: PuterFSAPI;

  /**
   * Initialize the Puter SDK (called automatically when script loads)
   */
  init: () => Promise<void>;
}

declare global {
  interface Window {
    puter?: PuterSDK;
  }
}

export type {
  PuterSDK,
  PuterAuthAPI,
  PuterAuthUser,
  PuterAIAPI,
  PuterAIChatMessage,
  PuterAIChatOptions,
  PuterAIChatResponse,
  PuterAIStreamChunk,
  PuterFSAPI,
};
