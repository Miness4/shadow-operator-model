# React-PDF Patterns

## Overview
`@react-pdf/renderer` creates PDFs via React components.

## Next.js Integration
SSR in API routes: `renderToStream()`.

## TypeScript Types
Full TS: `DocumentProps`, `PageProps`.

## Examples
### Ghostwrite
```tsx
<Document><Page><Text>{content}</Text></Page></Document>
```

**Sources:** [React-PDF](https://react-pdf.org/)