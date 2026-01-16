# React-PDF Patterns

**Last Updated:** 2026-01-16
**Status:** Comprehensive Research Complete

---

## Overview

`@react-pdf/renderer` enables creating PDF documents using React components. For SHADOWCORE, this powers:

- **Pitch Deck Generation:** Visual presentations for creators
- **Campaign Reports:** Performance summaries
- **Gameplan Exports:** Downloadable monetization blueprints
- **Story Sequence Guides:** Printable 14-day copy schedules

Key advantages: No external dependencies (Gamma, Google Slides), fully customizable dark theme, React component patterns.

---

## Installation & Setup

```bash
npm install @react-pdf/renderer
```

### Next.js Configuration

React-PDF requires specific Next.js configuration for SSR:

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Handle React-PDF's canvas dependency
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
  // React-PDF works in Edge runtime
  experimental: {
    serverComponentsExternalPackages: ['@react-pdf/renderer'],
  },
};

export default nextConfig;
```

---

## Core Components

### Document Structure

```tsx
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Link,
  Font,
} from '@react-pdf/renderer';

// Register custom fonts
Font.register({
  family: 'Inter',
  fonts: [
    { src: '/fonts/Inter-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/Inter-Medium.ttf', fontWeight: 500 },
    { src: '/fonts/Inter-Bold.ttf', fontWeight: 700 },
  ],
});

Font.register({
  family: 'JetBrains Mono',
  src: '/fonts/JetBrainsMono-Regular.ttf',
});
```

### StyleSheet API

```tsx
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#000000',
    padding: 40,
    fontFamily: 'Inter',
  },
  heading: {
    fontSize: 32,
    fontWeight: 700,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  body: {
    fontSize: 14,
    color: '#E0E0E0',
    lineHeight: 1.6,
  },
  accent: {
    color: '#00FF88', // Neon green
  },
});
```

---

## SHADOWCORE Dark Theme System

### Color Palette (oklch to RGB for PDF)

```tsx
// lib/pdf/theme.ts
export const PDF_COLORS = {
  // Backgrounds
  bgPrimary: '#000000',
  bgSecondary: '#0F0F0F',
  bgTertiary: '#1A1A1A',
  bgElevated: '#212121',

  // Text
  foreground: '#FAFAFA',
  muted: '#A0A0A0',
  subtle: '#666666',

  // Accents
  primary: '#00FF88',       // Neon green
  secondary: '#3366FF',     // Electric blue
  warning: '#FFB800',       // Amber
  destructive: '#FF3366',   // Red

  // Module Colors
  synthesio: '#00D9FF',     // Cyan
  ghostwrite: '#A855F7',    // Purple
  flowy: '#22C55E',         // Green
};

export const PDF_FONTS = {
  heading: 'Inter',
  body: 'Inter',
  mono: 'JetBrains Mono',
};
```

### Base Page Component

```tsx
// components/pdf/BasePage.tsx
import { Page, View, StyleSheet } from '@react-pdf/renderer';
import { PDF_COLORS } from '@/lib/pdf/theme';

const styles = StyleSheet.create({
  page: {
    backgroundColor: PDF_COLORS.bgPrimary,
    padding: 40,
    position: 'relative',
  },
  content: {
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pageNumber: {
    fontSize: 10,
    color: PDF_COLORS.muted,
  },
  branding: {
    fontSize: 10,
    color: PDF_COLORS.muted,
  },
});

interface BasePageProps {
  children: React.ReactNode;
  showPageNumber?: boolean;
  showBranding?: boolean;
}

export function BasePage({
  children,
  showPageNumber = true,
  showBranding = true,
}: BasePageProps) {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.content}>{children}</View>
      <View style={styles.footer}>
        {showBranding && (
          <Text style={styles.branding}>SHADOWCORE</Text>
        )}
        {showPageNumber && (
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
          />
        )}
      </View>
    </Page>
  );
}
```

---

## Pitch Deck Generator

### Complete Pitch Deck Document

```tsx
// components/pdf/PitchDeck.tsx
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { PDF_COLORS, PDF_FONTS } from '@/lib/pdf/theme';

const styles = StyleSheet.create({
  page: {
    backgroundColor: PDF_COLORS.bgPrimary,
    padding: 60,
    justifyContent: 'center',
  },
  titleSlide: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 700,
    color: PDF_COLORS.foreground,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 24,
    color: PDF_COLORS.muted,
    textAlign: 'center',
    marginBottom: 40,
  },
  accent: {
    color: PDF_COLORS.primary,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: 700,
    color: PDF_COLORS.foreground,
    marginBottom: 24,
  },
  bodyText: {
    fontSize: 16,
    color: PDF_COLORS.foreground,
    lineHeight: 1.8,
    marginBottom: 16,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  bullet: {
    width: 8,
    height: 8,
    backgroundColor: PDF_COLORS.primary,
    borderRadius: 4,
    marginRight: 12,
    marginTop: 6,
  },
  bulletText: {
    flex: 1,
    fontSize: 16,
    color: PDF_COLORS.foreground,
    lineHeight: 1.6,
  },
  statBox: {
    backgroundColor: PDF_COLORS.bgTertiary,
    padding: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  statValue: {
    fontSize: 48,
    fontWeight: 700,
    color: PDF_COLORS.primary,
  },
  statLabel: {
    fontSize: 14,
    color: PDF_COLORS.muted,
    marginTop: 8,
  },
  pricingTier: {
    backgroundColor: PDF_COLORS.bgTertiary,
    padding: 24,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: PDF_COLORS.primary,
  },
  tierPrice: {
    fontSize: 36,
    fontWeight: 700,
    color: PDF_COLORS.foreground,
  },
  tierName: {
    fontSize: 18,
    color: PDF_COLORS.muted,
    marginTop: 8,
  },
  ctaBox: {
    backgroundColor: PDF_COLORS.primary,
    padding: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 24,
    fontWeight: 700,
    color: PDF_COLORS.bgPrimary,
  },
});

interface PitchDeckProps {
  creatorName: string;
  creatorNiche: string;
  audiencePainPoints: string[];
  productType: string;
  productName: string;
  pricing: {
    tier1: number;
    tier2: number;
    tier3: number;
  };
  revenueProjection: {
    conservative: number;
    realistic: number;
    aggressive: number;
  };
  modules: Array<{
    title: string;
    description: string;
  }>;
  timeline: string;
}

export function PitchDeck({
  creatorName,
  creatorNiche,
  audiencePainPoints,
  productType,
  productName,
  pricing,
  revenueProjection,
  modules,
  timeline,
}: PitchDeckProps) {
  return (
    <Document>
      {/* Slide 1: Title */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.titleSlide}>
          <Text style={styles.title}>{productName}</Text>
          <Text style={styles.subtitle}>
            A {productType} by <Text style={styles.accent}>{creatorName}</Text>
          </Text>
        </View>
      </Page>

      {/* Slide 2: The Problem */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        <Text style={styles.sectionTitle}>The Problem</Text>
        <Text style={styles.bodyText}>
          Your audience in {creatorNiche} is struggling with:
        </Text>
        {audiencePainPoints.map((point, i) => (
          <View key={i} style={styles.bulletPoint}>
            <View style={styles.bullet} />
            <Text style={styles.bulletText}>{point}</Text>
          </View>
        ))}
      </Page>

      {/* Slide 3: The Solution */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        <Text style={styles.sectionTitle}>The Solution</Text>
        <Text style={styles.bodyText}>
          {productName} transforms your audience from struggling to succeeding
          with a proven system.
        </Text>
        <View style={{ flexDirection: 'row', marginTop: 24 }}>
          <View style={[styles.statBox, { flex: 1, marginRight: 16 }]}>
            <Text style={styles.statValue}>{modules.length}</Text>
            <Text style={styles.statLabel}>Modules</Text>
          </View>
          <View style={[styles.statBox, { flex: 1 }]}>
            <Text style={styles.statValue}>{timeline}</Text>
            <Text style={styles.statLabel}>To Results</Text>
          </View>
        </View>
      </Page>

      {/* Slide 4: What's Included */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        <Text style={styles.sectionTitle}>What's Included</Text>
        {modules.slice(0, 4).map((module, i) => (
          <View key={i} style={styles.bulletPoint}>
            <View style={styles.bullet} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.bulletText, { fontWeight: 700 }]}>
                {module.title}
              </Text>
              <Text style={[styles.bulletText, { color: PDF_COLORS.muted }]}>
                {module.description}
              </Text>
            </View>
          </View>
        ))}
      </Page>

      {/* Slide 5: Pricing */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        <Text style={styles.sectionTitle}>Investment Options</Text>
        <View style={{ flexDirection: 'row' }}>
          <View style={[styles.pricingTier, { flex: 1, marginRight: 16 }]}>
            <Text style={styles.tierPrice}>${pricing.tier1}</Text>
            <Text style={styles.tierName}>Starter</Text>
          </View>
          <View
            style={[
              styles.pricingTier,
              { flex: 1, marginRight: 16, borderLeftColor: PDF_COLORS.secondary },
            ]}
          >
            <Text style={styles.tierPrice}>${pricing.tier2}</Text>
            <Text style={styles.tierName}>Professional</Text>
          </View>
          <View
            style={[
              styles.pricingTier,
              { flex: 1, borderLeftColor: PDF_COLORS.warning },
            ]}
          >
            <Text style={styles.tierPrice}>${pricing.tier3}</Text>
            <Text style={styles.tierName}>VIP</Text>
          </View>
        </View>
      </Page>

      {/* Slide 6: Revenue Projection */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        <Text style={styles.sectionTitle}>Revenue Potential</Text>
        <View style={{ flexDirection: 'row' }}>
          <View style={[styles.statBox, { flex: 1, marginRight: 16 }]}>
            <Text style={[styles.statValue, { fontSize: 36 }]}>
              ${revenueProjection.conservative.toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>Conservative</Text>
          </View>
          <View style={[styles.statBox, { flex: 1, marginRight: 16 }]}>
            <Text style={styles.statValue}>
              ${revenueProjection.realistic.toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>Realistic</Text>
          </View>
          <View style={[styles.statBox, { flex: 1 }]}>
            <Text style={[styles.statValue, { fontSize: 36 }]}>
              ${revenueProjection.aggressive.toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>Aggressive</Text>
          </View>
        </View>
      </Page>

      {/* Slide 7: CTA */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={[styles.title, { marginBottom: 40 }]}>
            Ready to Launch?
          </Text>
          <View style={styles.ctaBox}>
            <Text style={styles.ctaText}>Let's Build Your Product</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
```

---

## Story Sequence Guide

### 14-Day Copy Guide PDF

```tsx
// components/pdf/StorySequenceGuide.tsx
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { PDF_COLORS } from '@/lib/pdf/theme';

const styles = StyleSheet.create({
  page: {
    backgroundColor: PDF_COLORS.bgPrimary,
    padding: 40,
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: PDF_COLORS.bgTertiary,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: PDF_COLORS.foreground,
  },
  subtitle: {
    fontSize: 12,
    color: PDF_COLORS.muted,
    marginTop: 8,
  },
  dayCard: {
    backgroundColor: PDF_COLORS.bgSecondary,
    padding: 20,
    marginBottom: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  phase1Border: { borderLeftColor: '#00D9FF' }, // Cyan
  phase2Border: { borderLeftColor: '#A855F7' }, // Purple
  phase3Border: { borderLeftColor: '#22C55E' }, // Green
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: 700,
    color: PDF_COLORS.foreground,
  },
  phase: {
    fontSize: 12,
    color: PDF_COLORS.muted,
    backgroundColor: PDF_COLORS.bgTertiary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  copyText: {
    fontSize: 14,
    color: PDF_COLORS.foreground,
    lineHeight: 1.6,
    marginBottom: 12,
  },
  metadata: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 10,
    color: PDF_COLORS.muted,
    marginRight: 4,
  },
  metaValue: {
    fontSize: 10,
    color: PDF_COLORS.primary,
    fontWeight: 500,
  },
  imageDirection: {
    backgroundColor: PDF_COLORS.bgTertiary,
    padding: 12,
    borderRadius: 4,
    marginTop: 12,
  },
  imageLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: PDF_COLORS.muted,
    marginBottom: 4,
  },
  imageText: {
    fontSize: 11,
    color: PDF_COLORS.foreground,
    fontStyle: 'italic',
  },
});

interface StoryDay {
  day: number;
  phase: 1 | 2 | 3;
  copy: string;
  psychologicalTrigger: string;
  imageDirection: string;
}

interface StorySequenceGuideProps {
  creatorName: string;
  productName: string;
  stories: StoryDay[];
}

const PHASE_NAMES = {
  1: 'Warm-Up',
  2: 'Value',
  3: 'Money',
};

export function StorySequenceGuide({
  creatorName,
  productName,
  stories,
}: StorySequenceGuideProps) {
  // Group stories by phase for multi-page layout
  const storiesPerPage = 3;
  const pages: StoryDay[][] = [];
  for (let i = 0; i < stories.length; i += storiesPerPage) {
    pages.push(stories.slice(i, i + storiesPerPage));
  }

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={[styles.page, { justifyContent: 'center' }]}>
        <View style={{ alignItems: 'center' }}>
          <Text style={[styles.title, { fontSize: 36, marginBottom: 16 }]}>
            14-Day Story Sequence
          </Text>
          <Text style={[styles.subtitle, { fontSize: 18 }]}>
            {productName}
          </Text>
          <Text style={[styles.subtitle, { marginTop: 40 }]}>
            Prepared for {creatorName}
          </Text>
        </View>
      </Page>

      {/* Story Pages */}
      {pages.map((pageStories, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page}>
          {pageIndex === 0 && (
            <View style={styles.header}>
              <Text style={styles.title}>Story Copy Sequence</Text>
              <Text style={styles.subtitle}>
                Post one story per day. Follow the sequence exactly.
              </Text>
            </View>
          )}

          {pageStories.map((story) => (
            <View
              key={story.day}
              style={[
                styles.dayCard,
                story.phase === 1
                  ? styles.phase1Border
                  : story.phase === 2
                  ? styles.phase2Border
                  : styles.phase3Border,
              ]}
            >
              <View style={styles.dayHeader}>
                <Text style={styles.dayNumber}>Day {story.day}</Text>
                <Text style={styles.phase}>
                  Phase {story.phase}: {PHASE_NAMES[story.phase]}
                </Text>
              </View>

              <Text style={styles.copyText}>{story.copy}</Text>

              <View style={styles.metadata}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Trigger:</Text>
                  <Text style={styles.metaValue}>{story.psychologicalTrigger}</Text>
                </View>
              </View>

              <View style={styles.imageDirection}>
                <Text style={styles.imageLabel}>IMAGE DIRECTION</Text>
                <Text style={styles.imageText}>{story.imageDirection}</Text>
              </View>
            </View>
          ))}
        </Page>
      ))}
    </Document>
  );
}
```

---

## PDF Generation API Route

### Server-Side Rendering

```typescript
// app/api/pdf/pitch-deck/route.ts
import { NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { PitchDeck } from '@/components/pdf/PitchDeck';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { gameplanId } = await request.json();

    // Verify auth
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch gameplan data
    const { data: gameplan } = await supabase
      .from('gameplans')
      .select(`
        *,
        creator:creators (
          name,
          instagram_handle
        ),
        creator_dna:creator_dna (
          niche,
          audience_pain_points
        )
      `)
      .eq('id', gameplanId)
      .eq('user_id', user.id)
      .single();

    if (!gameplan) {
      return NextResponse.json({ error: 'Gameplan not found' }, { status: 404 });
    }

    // Generate PDF
    const pdfBuffer = await renderToBuffer(
      <PitchDeck
        creatorName={gameplan.creator.name}
        creatorNiche={gameplan.creator_dna.niche}
        audiencePainPoints={gameplan.creator_dna.audience_pain_points}
        productType={gameplan.product_recommendation.type}
        productName={gameplan.product_recommendation.name}
        pricing={gameplan.product_recommendation.pricing}
        revenueProjection={gameplan.revenue_projections}
        modules={gameplan.curriculum.modules}
        timeline="14 days"
      />
    );

    // Return PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="pitch-deck-${gameplan.creator.instagram_handle}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF generation failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
```

### Client-Side Download

```tsx
// components/PitchDeckDownload.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';

interface PitchDeckDownloadProps {
  gameplanId: string;
  creatorName: string;
}

export function PitchDeckDownload({ gameplanId, creatorName }: PitchDeckDownloadProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/pdf/pitch-deck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameplanId }),
      });

      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pitch-deck-${creatorName}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleDownload} disabled={loading}>
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      Download Pitch Deck
    </Button>
  );
}
```

---

## Advanced Styling Patterns

### Gradient-Like Effects

```tsx
// React-PDF doesn't support gradients, but we can simulate with layered elements
const GradientHeader = () => (
  <View style={{ position: 'relative', height: 120 }}>
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 40,
        backgroundColor: '#00FF88',
        opacity: 0.3,
      }}
    />
    <View
      style={{
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        height: 40,
        backgroundColor: '#00FF88',
        opacity: 0.2,
      }}
    />
    <View
      style={{
        position: 'absolute',
        top: 80,
        left: 0,
        right: 0,
        height: 40,
        backgroundColor: '#00FF88',
        opacity: 0.1,
      }}
    />
  </View>
);
```

### Responsive Tables

```tsx
const DataTable = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <View>
    {/* Header Row */}
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: PDF_COLORS.bgTertiary,
        paddingVertical: 8,
        paddingHorizontal: 12,
      }}
    >
      {headers.map((header, i) => (
        <Text
          key={i}
          style={{
            flex: 1,
            fontSize: 10,
            fontWeight: 700,
            color: PDF_COLORS.muted,
          }}
        >
          {header}
        </Text>
      ))}
    </View>

    {/* Data Rows */}
    {rows.map((row, rowIndex) => (
      <View
        key={rowIndex}
        style={{
          flexDirection: 'row',
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderBottomWidth: 1,
          borderBottomColor: PDF_COLORS.bgTertiary,
        }}
      >
        {row.map((cell, cellIndex) => (
          <Text
            key={cellIndex}
            style={{
              flex: 1,
              fontSize: 11,
              color: PDF_COLORS.foreground,
            }}
          >
            {cell}
          </Text>
        ))}
      </View>
    ))}
  </View>
);
```

### Charts (Basic)

```tsx
// Simple bar chart using Views
const BarChart = ({
  data,
}: {
  data: Array<{ label: string; value: number; max: number }>;
}) => (
  <View>
    {data.map((item, i) => (
      <View key={i} style={{ marginBottom: 12 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 4,
          }}
        >
          <Text style={{ fontSize: 11, color: PDF_COLORS.foreground }}>
            {item.label}
          </Text>
          <Text style={{ fontSize: 11, color: PDF_COLORS.primary }}>
            {item.value}
          </Text>
        </View>
        <View
          style={{
            height: 8,
            backgroundColor: PDF_COLORS.bgTertiary,
            borderRadius: 4,
          }}
        >
          <View
            style={{
              width: `${(item.value / item.max) * 100}%`,
              height: 8,
              backgroundColor: PDF_COLORS.primary,
              borderRadius: 4,
            }}
          />
        </View>
      </View>
    ))}
  </View>
);
```

---

## Performance Optimization

### Lazy Component Loading

```tsx
// Only load PDF components when needed
import dynamic from 'next/dynamic';

const PitchDeck = dynamic(
  () => import('@/components/pdf/PitchDeck').then((mod) => mod.PitchDeck),
  { ssr: false }
);
```

### Caching Generated PDFs

```typescript
// Store generated PDFs in Supabase Storage
export async function generateAndCachePitchDeck(
  gameplanId: string,
  gameplanData: GameplanData
): Promise<string> {
  const supabase = createClient();

  // Check cache first
  const cachePath = `pitch-decks/${gameplanId}.pdf`;
  const { data: existingFile } = await supabase.storage
    .from('exports')
    .list('pitch-decks', {
      search: gameplanId,
    });

  if (existingFile?.length) {
    const { data: { publicUrl } } = supabase.storage
      .from('exports')
      .getPublicUrl(cachePath);
    return publicUrl;
  }

  // Generate new PDF
  const pdfBuffer = await renderToBuffer(<PitchDeck {...gameplanData} />);

  // Upload to storage
  await supabase.storage
    .from('exports')
    .upload(cachePath, pdfBuffer, {
      contentType: 'application/pdf',
      upsert: true,
    });

  const { data: { publicUrl } } = supabase.storage
    .from('exports')
    .getPublicUrl(cachePath);

  return publicUrl;
}
```

---

## TypeScript Types

```typescript
// types/pdf.ts
export interface PDFTheme {
  colors: {
    bgPrimary: string;
    bgSecondary: string;
    bgTertiary: string;
    foreground: string;
    muted: string;
    primary: string;
    secondary: string;
  };
  fonts: {
    heading: string;
    body: string;
    mono: string;
  };
}

export interface PitchDeckData {
  creatorName: string;
  creatorNiche: string;
  audiencePainPoints: string[];
  productType: string;
  productName: string;
  pricing: {
    tier1: number;
    tier2: number;
    tier3: number;
  };
  revenueProjection: {
    conservative: number;
    realistic: number;
    aggressive: number;
  };
  modules: Array<{
    title: string;
    description: string;
  }>;
  timeline: string;
}

export interface StorySequenceData {
  creatorName: string;
  productName: string;
  stories: Array<{
    day: number;
    phase: 1 | 2 | 3;
    copy: string;
    psychologicalTrigger: string;
    imageDirection: string;
  }>;
}
```

---

## Best Practices

1. **Register fonts early:** Do it once at module level, not in components
2. **Use StyleSheet.create:** Better performance than inline styles
3. **Test across pages:** PDFs render differently than web
4. **Keep components pure:** No hooks or state in PDF components
5. **Handle long text:** Use `textOverflow` and page breaks
6. **Optimize images:** Use appropriate sizes, not full resolution
7. **Cache PDFs:** Store generated PDFs for repeated access
8. **Server-side render:** Use API routes for generation, not client-side

---

## Resources

- [React-PDF Documentation](https://react-pdf.org/)
- [React-PDF GitHub](https://github.com/diegomura/react-pdf)
- [Font Registration](https://react-pdf.org/fonts)
- [Supported CSS Properties](https://react-pdf.org/styling)
