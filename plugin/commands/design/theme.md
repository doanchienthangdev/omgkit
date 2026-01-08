---
description: Switch project to a different OMGKIT theme
allowed-tools: Read, Write, Glob
argument-hint: <theme-id>
---

# 🎨 Switch Theme: $ARGUMENTS

Switch the project to a different OMGKIT design system theme.

## Available Theme IDs

**Tech & AI:**
- `neo-tokyo`, `electric-cyan`, `neural-dark`, `matrix-green`, `quantum-purple`, `hologram`

**Minimal & Clean:**
- `minimal-slate`, `paper`, `mono`, `zen`, `nordic`, `swiss`

**Corporate & Enterprise:**
- `ocean-blue`, `corporate-indigo`, `finance`, `legal`, `healthcare`, `consulting`

**Creative & Bold:**
- `coral-sunset`, `candy`, `neon`, `gradient-dream`, `retro`, `studio`

**Nature & Organic:**
- `forest`, `ocean`, `desert`, `lavender`, `arctic`, `autumn`

## Process

1. Validate theme ID exists
2. Load theme configuration from templates
3. Generate CSS variables (light + dark mode)
4. Write `.omgkit/design/theme.json`
5. Write `.omgkit/design/theme.css`
6. Show integration instructions

## Files Created/Updated

- `.omgkit/design/theme.json` - Theme configuration
- `.omgkit/design/theme.css` - CSS variables

## Integration

After switching themes, integrate into your project:

### Next.js / React
```css
/* In app/globals.css or styles/globals.css */
@import '../.omgkit/design/theme.css';
```

### Or copy CSS variables directly
Copy the `:root` and `.dark` blocks from `theme.css` into your global styles.

## Usage

```bash
/design:theme neo-tokyo          # Switch to Neo Tokyo theme
/design:theme minimal-slate      # Switch to Minimal Slate theme
/design:theme forest             # Switch to Forest theme
```

## Verification

After switching, run `/design:preview` to see the new theme colors.
