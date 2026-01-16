# LEARNING: Tailwind CSS v4 (2025+)

**Created:** 2026-01-16
**Type:** Technology Learning
**Status:** Active

---

## Key Changes from v3

### Configuration is CSS-First

**NO `tailwind.config.js`** - All configuration is done in CSS using the `@theme` directive.

```css
@import "tailwindcss";

@theme {
  --color-primary: oklch(0.80 0.20 155);
  --font-sans: "Inter", system-ui, sans-serif;
}
```

### Import Statement

Use `@import "tailwindcss"` instead of the v3 directives:

```css
/* v3 (OLD) */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* v4 (NEW) */
@import "tailwindcss";
```

### PostCSS Configuration

The PostCSS config uses only `@tailwindcss/postcss`:

```javascript
// postcss.config.mjs
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

### Color Functions

Colors use `oklch()` for wide gamut support:

```css
@theme {
  --color-primary: oklch(0.80 0.20 155);    /* Neon green */
  --color-secondary: oklch(0.55 0.20 260);  /* Electric blue */
}
```

---

## Renamed Utilities

Some utilities have been renamed in v4:

| v3 | v4 |
|----|-----|
| `shadow-sm` | `shadow-xs` |
| `shadow` | `shadow-sm` |
| `rounded-sm` | `rounded-xs` |
| `rounded` | `rounded-sm` |
| `blur-sm` | `blur-xs` |
| `blur` | `blur-sm` |

---

## Important Modifier Change

The important modifier moved from prefix to suffix:

```html
<!-- v3 (OLD) -->
<div class="!flex">

<!-- v4 (NEW) -->
<div class="flex!">
```

---

## Arbitrary Value Syntax

Parentheses replace brackets for CSS variables:

```html
<!-- v3 (OLD) -->
<div class="bg-[--my-color]">

<!-- v4 (NEW) -->
<div class="bg-(--my-color)">
```

---

## Installation

```bash
# Install Tailwind v4 dependencies
npm install tailwindcss@latest @tailwindcss/postcss postcss
```

---

## SHADOWCORE Theme Structure

Our theme uses the `@theme` directive for all design tokens:

```css
@theme {
  /* Reset default colors */
  --color-*: initial;

  /* Backgrounds */
  --color-bg-primary: oklch(0.00 0.00 0);
  --color-bg-secondary: oklch(0.06 0.00 0);

  /* Semantic */
  --color-background: oklch(0.00 0.00 0);
  --color-foreground: oklch(0.98 0.00 0);

  /* Accents */
  --color-primary: oklch(0.80 0.20 155);
  --color-secondary: oklch(0.55 0.20 260);

  /* Module Colors */
  --color-synthesio: oklch(0.70 0.15 200);
  --color-ghostwrite: oklch(0.65 0.20 290);
  --color-flowy: oklch(0.70 0.18 145);
}
```

---

## Resources

- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)
- [oklch Color Picker](https://oklch.com/)
