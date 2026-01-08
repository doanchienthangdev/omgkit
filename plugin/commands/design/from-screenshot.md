---
description: Extract theme from screenshot using AI vision
allowed-tools: Read, Write, Task
argument-hint: <screenshot-path>
---

# 📸 Extract Theme from Screenshot: $ARGUMENTS

Use Claude Vision to analyze a screenshot and extract a cohesive color theme.

## Supported Formats

- PNG, JPG, JPEG, WebP
- Screenshots from websites, apps, or design tools
- Dribbble shots, Figma exports, or any UI design

## Process

1. Load the screenshot image
2. Analyze colors using Claude Vision
3. Extract dominant colors:
   - Background and foreground
   - Primary brand color
   - Secondary and accent colors
   - Semantic colors (success, warning, error)
4. Determine light/dark mode preference
5. Generate complementary dark/light mode
6. Create theme.json and theme.css

## Color Extraction

Claude Vision will identify:
- **Backgrounds** - Main surface colors
- **Text colors** - Primary and secondary text
- **Brand colors** - CTAs, buttons, links
- **Semantic colors** - Success, warning, error indicators
- **Borders** - Dividers and boundaries

## Output

- `.omgkit/design/theme.json` - Extracted theme configuration
- `.omgkit/design/theme.css` - CSS variables (light + dark)

## Usage

```bash
/design:from-screenshot ./mockup.png
/design:from-screenshot ~/Downloads/dribbble-shot.jpg
/design:from-screenshot ./figma-export.webp
```

## Tips for Best Results

1. **High contrast screenshots** - Clear color distinctions work best
2. **Full UI screenshots** - More elements = better color extraction
3. **Avoid gradients** - Solid colors extract more reliably
4. **Include buttons/CTAs** - Helps identify primary colors

## Post-Extraction

After extraction, you can:
- `/design:preview` - Review extracted colors
- `/design:builder` - Adjust colors manually
- `/design:theme <id>` - Switch to a curated theme instead
