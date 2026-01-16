# Apify Integration

## Overview
Apify is a serverless platform for web scraping, data extraction, and RPA via Actors. SDK for Node.js/TS handles actor runs, inputs/outputs.

## Next.js Integration
Use `ApifyClient` in API routes/server actions. Auth via API token in env.

## TypeScript Types
Strong TS: `Actor<TInput>`, `ApifyClient`, `Dataset`.

## Examples
### Synthesio
```ts
const client = new ApifyClient({ token: process.env.APIFY_TOKEN });
const run = await client.actor('apify/website-content-crawler').call({ startUrls: [...] });
```

### Ghostwrite/Flowy
Extract content for PDF or campaigns.

**Sources:** [Apify Docs](https://docs.apify.com/)