---
description: Extract theme from webpage URL
allowed-tools: WebFetch, Read, Write, Task
argument-hint: <url>
---

# 🌐 Extract Theme from URL: $ARGUMENTS

Analyze a webpage and extract its color theme for your project.

## Process

1. Fetch the webpage content
2. Take a screenshot or analyze CSS
3. Extract CSS custom properties if available
4. Analyze computed styles for color patterns
5. Generate OMGKIT theme from extracted colors

## Extraction Methods

### Method 1: CSS Variables (Best)
If the site uses CSS custom properties:
```css
:root {
  --primary: #...
  --background: #...
}
```

### Method 2: Computed Styles
Analyze rendered element colors:
- Body background
- Heading colors
- Link/button colors
- Border colors

### Method 3: Screenshot Analysis
Fall back to visual analysis using Claude Vision.

## Popular Sites for Inspiration

```
/design:from-url https://stripe.com
/design:from-url https://linear.app
/design:from-url https://vercel.com
/design:from-url https://notion.so
/design:from-url https://figma.com
/design:from-url https://raycast.com
```

## Output

- `.omgkit/design/theme.json` - Extracted theme configuration
- `.omgkit/design/theme.css` - CSS variables (light + dark)

## Usage

```bash
/design:from-url https://example.com
/design:from-url https://your-inspiration-site.com
```

## Limitations

- Some sites may block automated access
- Highly dynamic sites may not extract well
- Sites with many gradients may produce inconsistent results

## Post-Extraction

After extraction:
- `/design:preview` - Review extracted colors
- `/design:builder` - Adjust colors manually
- `/design:theme <id>` - Switch to curated theme instead
