# Puter.js Deep Dive

## Overview
Puter.js is a client-side cloud filesystem (FS) API enabling serverless file operations directly from the browser. Key features include no servers required, no API keys, built-in AI integration, and support for file creation, reading, modification, directory management, and access control. Ideal for AI apps handling prompt storage, PDF exports, and workflows without backend infrastructure.

## Next.js Integration
Integrates seamlessly into Next.js via script tag or npm package in client components (`useEffect` for initialization). Supports CSR and SSR by handling auth via browser sessions.

## TypeScript Types
Full TypeScript support with type-safe FS operations (e.g., `FileHandle`, `DirectoryEntry`).

## Examples
### Synthesio (AI Synthesis)
```ts
puter.fs.writeFile('/synthesio/prompts/ai-input.txt', 'Generate report');
```

### Ghostwrite (PDF Gen)
```ts
puter.fs.writeFile('/ghostwrite/templates/report.pdf', pdfBlob);
```

### Flowy (Campaigns)
```ts
puter.fs.mkdir('/flowy/campaigns/user123');
```

**Sources:** [Puter.js Developer](https://developer.puter.com/)