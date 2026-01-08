---
name: validate
description: Validate theme structure and check for errors
usage: /design:validate [theme-file] [--strict] [--fix]
args:
  - name: theme-file
    required: false
    description: Path to theme JSON file (default .omgkit/design/theme.json)
  - name: --strict
    required: false
    description: Enable strict validation (warn on missing optional tokens)
  - name: --fix
    required: false
    description: Attempt to fix auto-fixable issues
---

# Design Validate

Validate your theme structure, check for errors, and verify all required tokens are present.

## What This Command Validates

### Basic Validation
- Required fields (name, id, category)
- ID format (kebab-case)
- Valid category
- Color format (HSL values)

### V1 Theme Validation
- Light and dark color palettes
- All 19 required color tokens
- HSL format for each color

### V2 Theme Validation
- Schema version
- Color scales structure (12 steps)
- Semantic tokens with $ref resolution
- Status colors
- Effects configuration
- Animation definitions
- Circular reference detection

## Usage Examples

### Validate Current Theme
```bash
/design:validate
```

### Validate Specific File
```bash
/design:validate ./my-theme.json
/design:validate .omgkit/design/theme.json
```

### Strict Validation
```bash
/design:validate --strict
```

### Auto-fix Issues
```bash
/design:validate --fix
```

## Validation Rules

### Required Fields

| Field | V1 | V2 | Description |
|-------|----|----|-------------|
| name | ✓ | ✓ | Display name |
| id | ✓ | ✓ | Unique kebab-case ID |
| category | ✓ | ✓ | Theme category |
| colors | ✓ | ○ | Light/dark color palettes |
| semanticTokens | ○ | ✓ | Semantic token definitions |

### Required Color Tokens (V1)

```
background, foreground
primary, primary-foreground
secondary, secondary-foreground
muted, muted-foreground
accent, accent-foreground
destructive, destructive-foreground
border, input, ring
card, card-foreground
popover, popover-foreground
```

### V2 Extended Tokens

```
surface, surface-hover, surface-active
primary-hover, secondary-hover, accent-hover
border-hover, input-hover
ring-offset, panel, panel-translucent, overlay
```

### V2 Status Colors

```
success, success-foreground
warning, warning-foreground
info, info-foreground
```

## Example Output

### Valid Theme
```
🔮 Theme Validation
━━━━━━━━━━━━━━━━━━━

📄 File: .omgkit/design/theme.json
📛 Theme: Electric Cyan
🔖 Version: 2.0

✅ Basic Validation
   ✓ Required fields present
   ✓ ID format valid (electric-cyan)
   ✓ Category valid (tech-ai)

✅ Color System
   ✓ Version: 2.0 (radix)
   ✓ Color scales defined (primary, neutral)
   ✓ All 12 steps present in each scale

✅ Semantic Tokens
   ✓ Light mode: 25 tokens
   ✓ Dark mode: 25 tokens
   ✓ All $ref resolved successfully

✅ Status Colors
   ✓ Light mode: 6 tokens
   ✓ Dark mode: 6 tokens

✅ Effects
   ✓ Glassmorphism configured
   ✓ Glow effects defined

✅ Animations
   ✓ 2 animations defined
   ✓ All keyframes valid

━━━━━━━━━━━━━━━━━━━
✅ Theme is valid!
```

### Invalid Theme
```
🔮 Theme Validation
━━━━━━━━━━━━━━━━━━━

📄 File: .omgkit/design/theme.json

❌ Validation Errors

1. Missing required field: name
2. Invalid ID format: "My Theme" (must be kebab-case)
3. Missing colors.light.primary
4. Invalid HSL format for colors.light.background: "#ffffff"
5. Circular reference detected: scales.primary.steps.light.9

⚠️  Warnings

1. Missing optional token: chart-1
2. Missing optional token: sidebar-background
3. Version field not set (defaulting to 1.0)

━━━━━━━━━━━━━━━━━━━
❌ Theme has 5 errors and 3 warnings
```

## Auto-Fix Capabilities

With `--fix` flag, the following issues can be auto-fixed:

| Issue | Fix Applied |
|-------|-------------|
| Missing version | Add `"version": "2.0"` |
| Invalid ID format | Convert to kebab-case |
| Hex color values | Convert to HSL |
| Missing optional tokens | Add with sensible defaults |

## HSL Format

Colors must be in HSL format without the `hsl()` wrapper:

```json
{
  "background": "0 0% 100%",       // ✓ Correct
  "background": "hsl(0 0% 100%)", // ✗ Incorrect
  "background": "#ffffff"         // ✗ Incorrect
}
```

## Strict Mode

With `--strict`, additional warnings are shown for:

- Missing optional color tokens (charts, sidebar)
- Missing typography settings
- Missing spacing configuration
- Unused color scales
- $ref pointing to non-semantic colors

## CLI Alternative

```bash
omgkit design:validate
omgkit design:validate ./theme.json
omgkit design:validate --strict
omgkit design:validate --fix
```

## Related Commands

- `/design:themes` - List available themes
- `/design:rebuild` - Apply a new theme
- `/design:export` - Export theme to various formats
- `/design:scan` - Scan project for non-compliant colors
