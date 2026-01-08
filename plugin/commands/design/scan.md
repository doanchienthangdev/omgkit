---
name: scan
description: Scan project for non-compliant color usage that should use theme variables
usage: /design:scan [--fix]
allowed-tools: Read, Glob, Grep
args:
  - name: --fix
    required: false
    description: Auto-fix simple violations (same as /design:rebuild)
---

# Design Scan

Scan project files for hardcoded colors that should use theme CSS variables instead.

## What This Command Does

1. **Scans Source Files**
   - Scans `app/`, `components/`, `src/`, `pages/` directories
   - Checks `.tsx`, `.jsx`, `.ts`, `.js` files
   - Excludes `node_modules`, `.git`, `.omgkit`, `dist`, `build`, `.next`

2. **Detects Non-Compliant Patterns**
   - Tailwind default colors (e.g., `bg-blue-500`, `text-gray-600`)
   - Hardcoded hex colors in className (e.g., `bg-[#3B82F6]`)
   - Inline style colors

3. **Reports Findings**
   - Groups violations by file
   - Shows line numbers
   - Suggests theme variable replacements

## Detection Patterns

### Tailwind Default Colors (Auto-Fixable)

| Pattern | Example | Should Be |
|---------|---------|-----------|
| Gray scales | `bg-gray-100` | `bg-muted` |
| Gray text | `text-gray-600` | `text-muted-foreground` |
| Blue primary | `bg-blue-500` | `bg-primary` |
| Red destructive | `bg-red-500` | `bg-destructive` |
| Gray borders | `border-gray-200` | `border-border` |

### Hardcoded Colors (Manual Review)

| Pattern | Example | Action |
|---------|---------|--------|
| Hex in className | `bg-[#E11D48]` | Use CSS variable |
| Arbitrary colors | `text-[#333333]` | Use theme foreground |
| Inline styles | `style={{ color: 'red' }}` | Use theme class |

## Usage Examples

### Basic Scan
```bash
/design:scan
```

### Scan and Auto-Fix
```bash
/design:scan --fix
```
Note: `--fix` is equivalent to running `/design:rebuild` with current theme.

## Example Output

```
🔍 Scanning project for non-compliant colors...

Scanned 45 files

⚠ Found 12 non-compliant color references

📁 app/page.tsx
   Line 15: bg-blue-500 → bg-primary
   Line 23: text-gray-600 → text-muted-foreground
   Line 45: bg-gray-50 → bg-muted

📁 components/Header.tsx
   Line 8: border-gray-200 → border-border
   Line 12: bg-white → bg-background
   Line 23: text-gray-900 → text-foreground

📁 components/Card.tsx
   Line 5: bg-[#ffffff] (manual review)
   Line 18: hover:bg-gray-100 → hover:bg-accent

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total: 12 violations in 3 files

Run omgkit design:rebuild <theme-id> to auto-fix
```

## Compliance Categories

### Fully Compliant (Good)
```tsx
// Using theme variables
<div className="bg-background text-foreground">
<button className="bg-primary text-primary-foreground">
<span className="text-muted-foreground">
<div className="border-border">
```

### Non-Compliant (Should Fix)
```tsx
// Hardcoded Tailwind colors
<div className="bg-white text-gray-900">          // ❌
<button className="bg-blue-500 text-white">       // ❌
<span className="text-gray-500">                  // ❌
<div className="border-gray-200">                 // ❌

// Should be
<div className="bg-background text-foreground">   // ✅
<button className="bg-primary text-primary-foreground"> // ✅
<span className="text-muted-foreground">          // ✅
<div className="border-border">                   // ✅
```

## Color Mapping Reference

| Hardcoded | Theme Variable | Context |
|-----------|---------------|---------|
| `bg-white` | `bg-background` | Page background |
| `bg-gray-50` | `bg-muted` | Subtle background |
| `bg-gray-100` | `bg-secondary` | Secondary background |
| `text-gray-900` | `text-foreground` | Primary text |
| `text-gray-600` | `text-muted-foreground` | Secondary text |
| `text-gray-500` | `text-muted-foreground` | Muted text |
| `border-gray-200` | `border-border` | Standard border |
| `border-gray-300` | `border-input` | Input border |
| `bg-blue-500` | `bg-primary` | Primary action |
| `text-blue-600` | `text-primary` | Accent text |
| `bg-red-500` | `bg-destructive` | Danger action |
| `text-red-600` | `text-destructive` | Error text |
| `ring-blue-500` | `ring-ring` | Focus ring |

## CLI Alternative

```bash
omgkit design:scan
```

## After Scanning

1. **Auto-fixable issues**: Run `/design:rebuild <theme-id>` to fix
2. **Manual review issues**: Edit files directly to use theme variables
3. **Re-scan**: Run `/design:scan` again to verify all fixed

## Related Commands

- `/design:rebuild <theme-id>` - Fix issues and apply new theme
- `/design:themes` - List available themes
- `/design:preview` - Preview current theme colors
