---
description: Preview current project theme colors
allowed-tools: Read
argument-hint: [light|dark]
---

# 👁️ Preview Theme: $ARGUMENTS

Preview the current project theme configuration and color palette.

## Process

1. Load `.omgkit/design/theme.json`
2. Display theme metadata (name, category, description)
3. Show color palette for light mode
4. Show color palette for dark mode
5. Display CSS variables

## Output

### Theme Information
- Name and ID
- Category
- Description
- Border radius
- Font families

### Color Palette (Light Mode)
- Background / Foreground
- Primary / Primary Foreground
- Secondary / Secondary Foreground
- Muted / Muted Foreground
- Accent / Accent Foreground
- Destructive / Destructive Foreground
- Border / Input / Ring

### Color Palette (Dark Mode)
- Same colors as light mode (inverted)

### CSS Variables
- Show the generated `:root` and `.dark` CSS blocks

## Usage

```bash
/design:preview         # Show full preview (both modes)
/design:preview light   # Show light mode only
/design:preview dark    # Show dark mode only
```

## Next Steps

- `/design:theme <id>` - Switch to different theme
- `/design:themes` - Browse available themes
- `/design:builder` - Customize current theme
