---
description: Interactive theme builder
allowed-tools: Read, Write
argument-hint: [base-theme]
---

# 🔧 Theme Builder: $ARGUMENTS

Build a custom theme interactively or customize an existing theme.

## Process

1. Start with base theme (optional) or neutral defaults
2. Configure each color slot:
   - Background / Foreground
   - Primary / Primary Foreground
   - Secondary / Secondary Foreground
   - Muted / Muted Foreground
   - Accent / Accent Foreground
   - Destructive / Destructive Foreground
   - Border / Input / Ring
3. Configure typography (optional)
4. Configure border radius
5. Preview changes
6. Generate theme files

## Color Input Formats

Accept colors in any format:
- Hex: `#E11D48` or `E11D48`
- HSL: `346.8 77.2% 49.8%`
- RGB: `rgb(225, 29, 72)`
- Named: `red`, `blue`, `emerald-500`

## Quick Start Options

### From Base Theme
```bash
/design:builder neo-tokyo      # Start with Neo Tokyo
/design:builder minimal-slate  # Start with Minimal Slate
```

### From Scratch
```bash
/design:builder                # Start with neutral defaults
```

## Customization Steps

### Step 1: Primary Color
The main brand color used for buttons, links, and key elements.

### Step 2: Secondary Color
Background color for secondary actions and subtle surfaces.

### Step 3: Accent Color
Highlight color for hovers, selections, and emphasis.

### Step 4: Mode Preference
Choose default mode (light/dark) and generate the opposite.

### Step 5: Border Radius
- `0rem` - Sharp corners
- `0.25rem` - Subtle rounding
- `0.5rem` - Default
- `0.75rem` - Rounded
- `9999px` - Full/pill

### Step 6: Typography (Optional)
- Sans-serif font family
- Monospace font family

## Output

- `.omgkit/design/theme.json` - Custom theme configuration
- `.omgkit/design/theme.css` - CSS variables (light + dark)

## Usage Examples

```bash
# Start fresh
/design:builder

# Customize existing theme
/design:builder electric-cyan

# Quick customization
/design:builder --primary "#7C3AED" --radius "0.75rem"
```

## Integration

After building your theme:
1. Import theme.css in your globals.css
2. Run `npx shadcn@latest init` if not done
3. Add components with `/design:add`
