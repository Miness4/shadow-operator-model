# Apify Integration

**Last Updated:** 2026-01-16
**Status:** Comprehensive Research Complete

---

## Overview

Apify is a serverless platform for web scraping, data extraction, and robotic process automation (RPA). For SHADOWCORE, Apify enables:

- **Instagram Profile Scraping:** Extract creator data for DNA analysis
- **Content Analysis:** Analyze posts, engagement, and audience
- **Competitor Research:** Scan niches for saturation analysis
- **Automated Data Collection:** Schedule regular creator discovery

---

## Core Concepts

### Actors

Actors are serverless functions that run on Apify's cloud. Key actors for SHADOWCORE:

| Actor | Purpose | Cost |
|-------|---------|------|
| `apify/instagram-profile-scraper` | Get profile data | ~$0.25/1000 profiles |
| `apify/instagram-post-scraper` | Get recent posts | ~$0.50/1000 posts |
| `apify/instagram-hashtag-scraper` | Find creators by hashtag | ~$0.30/1000 results |
| `apify/instagram-comment-scraper` | Analyze engagement | ~$0.40/1000 comments |

### Datasets

Results are stored in datasets - structured JSON collections.

### Runs

Each actor execution is a "run" with its own input/output/logs.

---

## Next.js Integration

### Installation

```bash
npm install apify-client
```

### Environment Setup

```env
# .env.local
APIFY_TOKEN=apify_api_xxxxxxxxxxxxx
```

### Server-Side Client

```typescript
// lib/apify/client.ts
import { ApifyClient } from 'apify-client';

export const apifyClient = new ApifyClient({
  token: process.env.APIFY_TOKEN!,
});
```

---

## Instagram Profile Scraping

### Basic Profile Fetch

```typescript
// lib/apify/instagram.ts
import { apifyClient } from './client';

interface InstagramProfile {
  id: string;
  username: string;
  fullName: string;
  biography: string;
  profilePicUrl: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isBusinessAccount: boolean;
  isVerified: boolean;
  externalUrl: string;
  businessCategoryName?: string;
  latestPosts: InstagramPost[];
}

interface InstagramPost {
  id: string;
  type: 'Image' | 'Video' | 'Sidecar';
  caption: string;
  likesCount: number;
  commentsCount: number;
  timestamp: string;
  url: string;
}

export async function scrapeInstagramProfile(
  username: string
): Promise<InstagramProfile | null> {
  try {
    // Run the Instagram profile scraper actor
    const run = await apifyClient.actor('apify/instagram-profile-scraper').call({
      usernames: [username],
      resultsLimit: 1,
    });

    // Fetch results from the run's dataset
    const { items } = await apifyClient.dataset(run.defaultDatasetId).listItems();

    if (items.length === 0) {
      return null;
    }

    const profile = items[0];

    return {
      id: profile.id,
      username: profile.username,
      fullName: profile.fullName,
      biography: profile.biography,
      profilePicUrl: profile.profilePicUrl,
      followersCount: profile.followersCount,
      followingCount: profile.followsCount,
      postsCount: profile.postsCount,
      isBusinessAccount: profile.isBusinessAccount,
      isVerified: profile.verified,
      externalUrl: profile.externalUrl,
      businessCategoryName: profile.businessCategoryName,
      latestPosts: (profile.latestPosts || []).slice(0, 12).map((post: any) => ({
        id: post.id,
        type: post.type,
        caption: post.caption || '',
        likesCount: post.likesCount,
        commentsCount: post.commentsCount,
        timestamp: post.timestamp,
        url: post.url,
      })),
    };
  } catch (error) {
    console.error('Instagram scraping failed:', error);
    return null;
  }
}
```

### Batch Profile Scraping

```typescript
// For scanning multiple creators in a niche
export async function scrapeMultipleProfiles(
  usernames: string[]
): Promise<InstagramProfile[]> {
  const run = await apifyClient.actor('apify/instagram-profile-scraper').call({
    usernames,
    resultsLimit: usernames.length,
  });

  const { items } = await apifyClient.dataset(run.defaultDatasetId).listItems();

  return items.map(transformProfileData);
}
```

---

## Creator Discovery by Hashtag

### Finding Creators in a Niche

```typescript
// lib/apify/discovery.ts
interface HashtagResult {
  username: string;
  postUrl: string;
  likesCount: number;
  commentsCount: number;
  caption: string;
}

export async function discoverCreatorsByHashtag(
  hashtag: string,
  limit: number = 100
): Promise<HashtagResult[]> {
  const run = await apifyClient.actor('apify/instagram-hashtag-scraper').call({
    hashtags: [hashtag],
    resultsLimit: limit,
    searchType: 'hashtag',
  });

  const { items } = await apifyClient.dataset(run.defaultDatasetId).listItems();

  return items.map((item: any) => ({
    username: item.ownerUsername,
    postUrl: item.url,
    likesCount: item.likesCount,
    commentsCount: item.commentsCount,
    caption: item.caption,
  }));
}

// Find potential creators matching our criteria
export async function findPotentialCreators(
  niche: string,
  hashtags: string[]
): Promise<string[]> {
  const allResults: HashtagResult[] = [];

  for (const hashtag of hashtags) {
    const results = await discoverCreatorsByHashtag(hashtag, 50);
    allResults.push(...results);
  }

  // Deduplicate and filter
  const uniqueUsernames = [...new Set(allResults.map(r => r.username))];

  return uniqueUsernames;
}
```

---

## Engagement Analysis

### Calculate Engagement Rate

```typescript
// lib/apify/analytics.ts
export function calculateEngagementRate(profile: InstagramProfile): number {
  if (profile.followersCount === 0 || profile.latestPosts.length === 0) {
    return 0;
  }

  const totalEngagement = profile.latestPosts.reduce(
    (sum, post) => sum + post.likesCount + post.commentsCount,
    0
  );

  const avgEngagement = totalEngagement / profile.latestPosts.length;
  const engagementRate = (avgEngagement / profile.followersCount) * 100;

  return Math.round(engagementRate * 100) / 100; // 2 decimal places
}
```

### Analyze Content Patterns

```typescript
export interface ContentAnalysis {
  postingFrequency: string;
  avgPostsPerWeek: number;
  topContentTypes: string[];
  avgCaptionLength: number;
  hashtagUsage: number;
  engagementTrend: 'rising' | 'stable' | 'declining';
}

export function analyzeContentPatterns(
  profile: InstagramProfile
): ContentAnalysis {
  const posts = profile.latestPosts;

  if (posts.length < 2) {
    return {
      postingFrequency: 'unknown',
      avgPostsPerWeek: 0,
      topContentTypes: [],
      avgCaptionLength: 0,
      hashtagUsage: 0,
      engagementTrend: 'stable',
    };
  }

  // Calculate posting frequency
  const timestamps = posts.map(p => new Date(p.timestamp).getTime());
  const timeSpan = Math.max(...timestamps) - Math.min(...timestamps);
  const weeks = timeSpan / (1000 * 60 * 60 * 24 * 7);
  const avgPostsPerWeek = weeks > 0 ? posts.length / weeks : posts.length;

  // Analyze content types
  const typeCount = posts.reduce((acc, post) => {
    acc[post.type] = (acc[post.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topContentTypes = Object.entries(typeCount)
    .sort((a, b) => b[1] - a[1])
    .map(([type]) => type);

  // Caption analysis
  const avgCaptionLength = posts.reduce(
    (sum, p) => sum + p.caption.length, 0
  ) / posts.length;
  const hashtagUsage = posts.reduce(
    (sum, p) => sum + (p.caption.match(/#/g) || []).length, 0
  ) / posts.length;

  // Engagement trend (compare first half vs second half)
  const halfIndex = Math.floor(posts.length / 2);
  const firstHalfAvg = posts.slice(0, halfIndex).reduce(
    (sum, p) => sum + p.likesCount + p.commentsCount, 0
  ) / halfIndex;
  const secondHalfAvg = posts.slice(halfIndex).reduce(
    (sum, p) => sum + p.likesCount + p.commentsCount, 0
  ) / (posts.length - halfIndex);

  let engagementTrend: 'rising' | 'stable' | 'declining';
  if (secondHalfAvg > firstHalfAvg * 1.1) {
    engagementTrend = 'rising';
  } else if (secondHalfAvg < firstHalfAvg * 0.9) {
    engagementTrend = 'declining';
  } else {
    engagementTrend = 'stable';
  }

  return {
    postingFrequency: avgPostsPerWeek > 5 ? 'high' : avgPostsPerWeek > 2 ? 'medium' : 'low',
    avgPostsPerWeek: Math.round(avgPostsPerWeek * 10) / 10,
    topContentTypes,
    avgCaptionLength: Math.round(avgCaptionLength),
    hashtagUsage: Math.round(hashtagUsage * 10) / 10,
    engagementTrend,
  };
}
```

---

## Creator Fit Scoring

### Ideal Creator Criteria (From Workbooks)

```typescript
// lib/apify/scoring.ts
interface CreatorFitCriteria {
  followerRange: { min: number; max: number };
  engagementRange: { min: number; max: number };
  hasExistingProduct: boolean;
  hasExistingPartnership: boolean;
  teamSize: number;
  estimatedMonthlyIncome: { min: number; max: number };
}

const IDEAL_CRITERIA: CreatorFitCriteria = {
  followerRange: { min: 10000, max: 100000 },
  engagementRange: { min: 3, max: 8 },
  hasExistingProduct: false,
  hasExistingPartnership: false,
  teamSize: 0,
  estimatedMonthlyIncome: { min: 200, max: 1000 },
};

export interface FitScore {
  total: number;
  breakdown: {
    followerScore: number;
    engagementScore: number;
    productScore: number;
    partnershipScore: number;
    desperationScore: number;
  };
  disqualifiers: string[];
}

export function calculateFitScore(
  profile: InstagramProfile,
  engagementRate: number
): FitScore {
  const disqualifiers: string[] = [];
  let followerScore = 0;
  let engagementScore = 0;
  let productScore = 0;
  let partnershipScore = 0;
  let desperationScore = 0;

  // Follower count scoring (0-30 points)
  const { followerRange } = IDEAL_CRITERIA;
  if (profile.followersCount >= 1000000) {
    disqualifiers.push('Mega-creator (1M+ followers) - auto disqualified');
    followerScore = 0;
  } else if (
    profile.followersCount >= followerRange.min &&
    profile.followersCount <= followerRange.max
  ) {
    // Sweet spot: full points
    followerScore = 30;
  } else if (profile.followersCount < followerRange.min) {
    // Too small
    followerScore = Math.round((profile.followersCount / followerRange.min) * 15);
  } else {
    // Larger but not mega
    const excess = profile.followersCount - followerRange.max;
    const penalty = Math.min(excess / 100000, 1) * 15;
    followerScore = Math.max(15, 30 - penalty);
  }

  // Engagement rate scoring (0-30 points)
  const { engagementRange } = IDEAL_CRITERIA;
  if (engagementRate >= engagementRange.min && engagementRate <= engagementRange.max) {
    engagementScore = 30;
  } else if (engagementRate < engagementRange.min) {
    engagementScore = Math.round((engagementRate / engagementRange.min) * 15);
  } else {
    // Very high engagement is suspicious or very small account
    engagementScore = 20;
  }

  // Product existence check (0-20 points)
  const bioLower = profile.biography.toLowerCase();
  const hasProductIndicators =
    bioLower.includes('course') ||
    bioLower.includes('coaching') ||
    bioLower.includes('community') ||
    bioLower.includes('program') ||
    bioLower.includes('link in bio') && profile.externalUrl?.includes('stan.store');

  if (hasProductIndicators) {
    disqualifiers.push('Appears to have existing product');
    productScore = 0;
  } else {
    productScore = 20;
  }

  // Partnership indicators (0-10 points)
  const hasPartnershipIndicators =
    bioLower.includes('collab') ||
    bioLower.includes('partner') ||
    bioLower.includes('ambassador') ||
    bioLower.includes('sponsored');

  if (hasPartnershipIndicators) {
    partnershipScore = 5; // Some partnerships OK
  } else {
    partnershipScore = 10;
  }

  // Desperation indicators (0-10 points)
  const desperationIndicators = [
    profile.followersCount > 20000 && !profile.externalUrl, // Good following, no monetization
    engagementRate > 4, // Engaged audience
    !hasProductIndicators, // No products yet
    bioLower.includes('dm') || bioLower.includes('help'), // Seeking connection
  ];
  desperationScore = desperationIndicators.filter(Boolean).length * 2.5;

  const total = followerScore + engagementScore + productScore + partnershipScore + desperationScore;

  return {
    total: Math.round(total),
    breakdown: {
      followerScore,
      engagementScore,
      productScore,
      partnershipScore,
      desperationScore,
    },
    disqualifiers,
  };
}
```

---

## API Route Implementation

### Profile Scanning Endpoint

```typescript
// app/api/creators/scan/route.ts
import { NextResponse } from 'next/server';
import { scrapeInstagramProfile } from '@/lib/apify/instagram';
import { calculateEngagementRate, analyzeContentPatterns } from '@/lib/apify/analytics';
import { calculateFitScore } from '@/lib/apify/scoring';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // Scrape profile
    const profile = await scrapeInstagramProfile(username);

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found or private' },
        { status: 404 }
      );
    }

    // Calculate metrics
    const engagementRate = calculateEngagementRate(profile);
    const contentAnalysis = analyzeContentPatterns(profile);
    const fitScore = calculateFitScore(profile, engagementRate);

    // Store in Supabase
    const supabase = await createServerClient();
    const { data: creator, error } = await supabase
      .from('creators')
      .upsert({
        instagram_handle: profile.username,
        name: profile.fullName,
        bio: profile.biography,
        profile_picture_url: profile.profilePicUrl,
        follower_count: profile.followersCount,
        following_count: profile.followingCount,
        post_count: profile.postsCount,
        engagement_rate: engagementRate,
        profile_data: {
          isBusinessAccount: profile.isBusinessAccount,
          isVerified: profile.isVerified,
          externalUrl: profile.externalUrl,
          businessCategory: profile.businessCategoryName,
          contentAnalysis,
          fitScore,
        },
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      profile,
      engagementRate,
      contentAnalysis,
      fitScore,
      creatorId: creator.id,
    });
  } catch (error) {
    console.error('Scan failed:', error);
    return NextResponse.json(
      { error: 'Failed to scan profile' },
      { status: 500 }
    );
  }
}
```

---

## Pricing & Cost Management

### Apify Pricing Model

- **Free tier:** $5/month credit
- **Personal:** $49/month (includes $49 platform credit)
- **Team:** $499/month (includes $499 platform credit)

### Cost Estimation for SHADOWCORE

```typescript
// Estimated costs per operation
const APIFY_COSTS = {
  profileScrape: 0.00025, // ~$0.25 per 1000 profiles
  postScrape: 0.0005,     // ~$0.50 per 1000 posts
  hashtagSearch: 0.0003,  // ~$0.30 per 1000 results
  commentScrape: 0.0004,  // ~$0.40 per 1000 comments
};

// Per-user monthly estimate
// 20 creator scans/month = $0.005
// 50 hashtag searches/month = $0.015
// Total: ~$0.02/user/month
```

### Caching Strategy

```typescript
// lib/apify/cache.ts
import { createServerClient } from '@/lib/supabase/server';

const CACHE_DURATION_HOURS = 24;

export async function getCachedProfile(
  username: string
): Promise<InstagramProfile | null> {
  const supabase = await createServerClient();

  const { data: creator } = await supabase
    .from('creators')
    .select('*')
    .eq('instagram_handle', username)
    .single();

  if (!creator) return null;

  // Check if cache is fresh
  const updatedAt = new Date(creator.updated_at);
  const now = new Date();
  const hoursSinceUpdate = (now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60);

  if (hoursSinceUpdate > CACHE_DURATION_HOURS) {
    return null; // Cache expired
  }

  return transformCreatorToProfile(creator);
}
```

---

## TypeScript Types

```typescript
// types/apify.ts
export interface ApifyRunInput {
  usernames?: string[];
  hashtags?: string[];
  resultsLimit?: number;
  searchType?: 'user' | 'hashtag' | 'place';
}

export interface ApifyRunResult<T> {
  id: string;
  status: 'READY' | 'RUNNING' | 'SUCCEEDED' | 'FAILED';
  defaultDatasetId: string;
  defaultKeyValueStoreId: string;
}

export interface ApifyDatasetItem {
  [key: string]: unknown;
}

export interface InstagramProfile {
  id: string;
  username: string;
  fullName: string;
  biography: string;
  profilePicUrl: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isBusinessAccount: boolean;
  isVerified: boolean;
  externalUrl: string;
  businessCategoryName?: string;
  latestPosts: InstagramPost[];
}

export interface InstagramPost {
  id: string;
  type: 'Image' | 'Video' | 'Sidecar';
  caption: string;
  likesCount: number;
  commentsCount: number;
  timestamp: string;
  url: string;
}

export interface ContentAnalysis {
  postingFrequency: 'high' | 'medium' | 'low' | 'unknown';
  avgPostsPerWeek: number;
  topContentTypes: string[];
  avgCaptionLength: number;
  hashtagUsage: number;
  engagementTrend: 'rising' | 'stable' | 'declining';
}

export interface FitScore {
  total: number;
  breakdown: {
    followerScore: number;
    engagementScore: number;
    productScore: number;
    partnershipScore: number;
    desperationScore: number;
  };
  disqualifiers: string[];
}
```

---

## Error Handling

```typescript
// lib/apify/errors.ts
export class ApifyError extends Error {
  constructor(
    message: string,
    public code: 'RATE_LIMIT' | 'AUTH_FAILED' | 'ACTOR_FAILED' | 'TIMEOUT' | 'UNKNOWN'
  ) {
    super(message);
    this.name = 'ApifyError';
  }
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');

      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
      }
    }
  }

  throw lastError;
}
```

---

## Resources

- [Apify Documentation](https://docs.apify.com/)
- [Instagram Profile Scraper](https://apify.com/apify/instagram-profile-scraper)
- [Apify SDK for Node.js](https://docs.apify.com/sdk/js/)
- [Apify Pricing](https://apify.com/pricing)
