/**
 * Shared TypeScript types for SHADOWCORE
 */

// Re-export database types
export type { Database, Json } from './database';

// AI Model types
export interface AIModel {
  id: string;
  name: string;
  provider: 'anthropic' | 'openai' | 'google' | 'meta' | 'mistral';
  tier: 'premium' | 'standard' | 'economy';
  contextWindow: number;
  isDefault?: boolean;
}

export const AI_MODELS: AIModel[] = [
  {
    id: 'claude-opus-4.5',
    name: 'Claude Opus 4.5',
    provider: 'anthropic',
    tier: 'premium',
    contextWindow: 200000,
    isDefault: true,
  },
  {
    id: 'claude-sonnet-4.5',
    name: 'Claude Sonnet 4.5',
    provider: 'anthropic',
    tier: 'standard',
    contextWindow: 200000,
  },
  {
    id: 'gpt-5.2',
    name: 'GPT-5.2',
    provider: 'openai',
    tier: 'standard',
    contextWindow: 128000,
  },
  {
    id: 'o3',
    name: 'O3',
    provider: 'openai',
    tier: 'premium',
    contextWindow: 128000,
  },
  {
    id: 'gemini-3-pro',
    name: 'Gemini 3 Pro',
    provider: 'google',
    tier: 'standard',
    contextWindow: 1000000,
  },
  {
    id: 'o4-mini',
    name: 'O4 Mini',
    provider: 'openai',
    tier: 'economy',
    contextWindow: 128000,
  },
] as const;

// Creator types
export type CreatorArchetype = 'authority' | 'lifestyle' | 'educator' | 'personality';

export interface CreatorDNA {
  niche: string;
  audiencePainPoints: string[];
  creatorArchetype: CreatorArchetype;
  toneOfVoice: string;
  contentFrequency: string;
  currentMonetization: number;
  potentialIncome: number;
  desperationScore: number;
  recommendedProductType: string;
}

// Gameplan types
export interface RevenueProjection {
  conservative: number;
  realistic: number;
  aggressive: number;
}

export interface PricingTier {
  tier1: number;
  tier2: number;
  tier3: number;
}

export interface CurriculumModule {
  title: string;
  description: string;
  lessons: string[];
  outcomes: string[];
}

// Contact/CRM types
export type ContactStatus =
  | 'prospect'
  | 'reached_out'
  | 'in_conversation'
  | 'deal_signed'
  | 'active_client'
  | 'churned';

export type InteractionType =
  | 'dm_sent'
  | 'dm_received'
  | 'call'
  | 'note'
  | 'gameplan_created'
  | 'gameplan_sent'
  | 'status_change';

// Story generation types
export interface StoryDay {
  day: number;
  phase: 1 | 2 | 3;
  copy: string;
  psychologicalTrigger: string;
  imageDirection: string;
}

export const PHASE_NAMES: Record<1 | 2 | 3, string> = {
  1: 'Warm-Up',
  2: 'Value',
  3: 'Money',
};

// Module colors for UI
export const MODULE_COLORS = {
  synthesio: {
    bg: 'bg-synthesio/10',
    text: 'text-synthesio',
    border: 'border-synthesio',
  },
  ghostwrite: {
    bg: 'bg-ghostwrite/10',
    text: 'text-ghostwrite',
    border: 'border-ghostwrite',
  },
  flowy: {
    bg: 'bg-flowy/10',
    text: 'text-flowy',
    border: 'border-flowy',
  },
} as const;
