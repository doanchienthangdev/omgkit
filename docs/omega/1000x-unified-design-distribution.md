# 1000x Moonshot: Unified Design Distribution for OMGKIT Projects

> **"What if every project using OMGKIT automatically had world-class design?"**

---

## The Problem Restatement

**Current state:** Every `.omgkit` project creates its own design system, leading to:
- Inconsistent UI across projects
- Repeated design decisions
- No shared component library
- Each project starts from zero

**Desired state:** OMGKIT ships with a unified design system that:
- Provides consistent components across ALL projects
- Allows customization from screenshots/inspiration
- Uses industry standards (shadcn, Radix UI)
- Distributes automatically with `omgkit init`

---

## The 1000x Insight

**The problem isn't "how to create a design system" - it's "how to DISTRIBUTE design consistently."**

OMGKIT is uniquely positioned because:
1. It already has `templates/` distribution mechanism
2. It already runs `omgkit init` in projects
3. It can embed design tokens, components, and themes
4. AI can generate components that follow the system

---

## Technical Architecture

### Design Token Distribution Pipeline

```
                    +------------------+
                    | OMGKIT Package   |
                    | templates/design/|
                    +--------+---------+
                             |
         +-------------------+-------------------+
         |                   |                   |
    +----v-----+      +------v------+     +------v------+
    | omega.   |      | omega.      |     | components/ |
    | tokens.  |      | tailwind.   |     | registry.   |
    | json     |      | preset.js   |     | json        |
    +----+-----+      +------+------+     +------+------+
         |                   |                   |
         +-------------------+-------------------+
                             |
                    +--------v---------+
                    | omgkit init      |
                    | --with-design    |
                    +--------+---------+
                             |
         +-------------------+-------------------+
         |                   |                   |
    +----v-----+      +------v------+     +------v------+
    | Project  |      | Project     |     | Project     |
    | tokens   |      | tailwind    |     | components  |
    +----------+      | config      |     | (shadcn)    |
                      +-------------+     +-------------+
```

### Core Components

#### 1. Design Tokens (`templates/design/omega.tokens.json`)

W3C Design Tokens Format (2025.10):

```json
{
  "$schema": "https://tr.designtokens.org/format/2025.10/schema.json",
  "omega": {
    "$type": "color",
    "purple": {
      "50": { "$value": "#FAF5FF" },
      "100": { "$value": "#F3E8FF" },
      "200": { "$value": "#E9D5FF" },
      "300": { "$value": "#D8B4FE" },
      "400": { "$value": "#C084FC" },
      "500": { "$value": "#A855F7" },
      "600": { "$value": "#9333EA" },
      "700": { "$value": "#7C3AED" },
      "800": { "$value": "#6B21A8" },
      "900": { "$value": "#581C87" }
    },
    "amber": {
      "50": { "$value": "#FFFBEB" },
      "500": { "$value": "#F59E0B" },
      "600": { "$value": "#D97706" }
    }
  },
  "semantic": {
    "$type": "color",
    "primary": { "$value": "{omega.purple.700}" },
    "secondary": { "$value": "{omega.amber.500}" },
    "success": { "$value": "#10B981" },
    "warning": { "$value": "#F59E0B" },
    "error": { "$value": "#EF4444" },
    "info": { "$value": "#3B82F6" }
  },
  "spacing": {
    "$type": "dimension",
    "0": { "$value": "0px" },
    "1": { "$value": "4px" },
    "2": { "$value": "8px" },
    "3": { "$value": "12px" },
    "4": { "$value": "16px" },
    "6": { "$value": "24px" },
    "8": { "$value": "32px" },
    "12": { "$value": "48px" }
  },
  "radius": {
    "$type": "dimension",
    "sm": { "$value": "4px" },
    "md": { "$value": "8px" },
    "lg": { "$value": "12px" },
    "full": { "$value": "9999px" }
  },
  "typography": {
    "$type": "fontFamily",
    "sans": { "$value": "Inter, system-ui, sans-serif" },
    "mono": { "$value": "JetBrains Mono, monospace" }
  }
}
```

#### 2. Tailwind Preset (`templates/design/omega.tailwind.preset.js`)

```javascript
// Auto-generated from omega.tokens.json
module.exports = {
  theme: {
    extend: {
      colors: {
        omega: {
          50: '#FAF5FF',
          100: '#F3E8FF',
          // ... full scale
          700: '#7C3AED', // Primary
          900: '#581C87'
        },
        primary: '#7C3AED',
        secondary: '#F59E0B',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      borderRadius: {
        omega: '8px'
      }
    }
  }
}
```

#### 3. Component Registry (`templates/design/components.registry.json`)

shadcn-compatible registry:

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "omega-ui",
  "homepage": "https://omgkit.dev/design",
  "items": [
    {
      "name": "button",
      "type": "registry:ui",
      "files": ["components/ui/button.tsx"],
      "dependencies": ["@radix-ui/react-slot"],
      "registryDependencies": []
    },
    {
      "name": "card",
      "type": "registry:ui",
      "files": ["components/ui/card.tsx"],
      "dependencies": [],
      "registryDependencies": []
    },
    {
      "name": "agent-card",
      "type": "registry:ui",
      "files": ["components/omgkit/agent-card.tsx"],
      "dependencies": ["lucide-react"],
      "registryDependencies": ["card", "badge"]
    },
    {
      "name": "sprint-board",
      "type": "registry:ui",
      "files": ["components/omgkit/sprint-board.tsx"],
      "dependencies": ["@dnd-kit/core"],
      "registryDependencies": ["card"]
    },
    {
      "name": "command-palette",
      "type": "registry:ui",
      "files": ["components/omgkit/command-palette.tsx"],
      "dependencies": ["cmdk"],
      "registryDependencies": ["dialog"]
    }
  ]
}
```

---

## Screenshot-to-Theme Pipeline

### The Magic Command

```bash
/design:from-screenshot "path/to/inspiration.png"
```

### How It Works

```
Screenshot → Vision AI → Color Extraction → Token Generation → Theme Override
    │              │              │                │               │
    │              │              │                │               v
    │              │              │                │         project/
    │              │              │                │         omega.tokens.local.json
    │              │              │                v
    │              │              │          Map to semantic tokens
    │              │              v          (primary, secondary, etc.)
    │              │         Extract palette
    │              │         using perceptual clustering
    │              v
    │         Analyze UI patterns
    │         (spacing, typography, layout)
    v
Input image (Dribbble, screenshot, Figma export)
```

### Implementation

```javascript
// lib/design/screenshot-to-theme.js
async function extractThemeFromScreenshot(imagePath) {
  // 1. Use Claude Vision to analyze the image
  const analysis = await analyzeDesign(imagePath);

  // 2. Extract dominant colors
  const palette = await extractColorPalette(analysis);

  // 3. Map to semantic tokens
  const tokens = mapToSemanticTokens(palette, analysis);

  // 4. Generate override file
  return generateLocalTokens(tokens);
}
```

---

## Distribution Mechanism

### Enhanced `omgkit init`

```bash
# Standard init (includes design system)
omgkit init

# Init with custom theme from screenshot
omgkit init --theme-from screenshot.png

# Init with specific preset
omgkit init --theme minimal
omgkit init --theme vibrant
omgkit init --theme corporate
```

### What Gets Distributed

```
project/
├── .omgkit/
│   ├── config.yaml
│   └── design/
│       ├── omega.tokens.json      # Base tokens (from OMGKIT)
│       ├── omega.tokens.local.json # Local overrides (optional)
│       ├── tailwind.preset.js     # Generated Tailwind config
│       └── components.json        # shadcn config pointing to registry
├── components/
│   └── ui/                        # shadcn components (added via CLI)
└── tailwind.config.js             # Extends omega preset
```

### Component Installation

```bash
# Add Omega UI components
npx shadcn@latest add button -r omega-ui
npx shadcn@latest add card -r omega-ui
npx shadcn@latest add agent-card -r omega-ui

# Or use OMGKIT command
/design:add button card agent-card
```

---

## Omega Registry

### Hosting the Registry

The component registry is hosted at:
- **Primary**: `https://omgkit.dev/registry`
- **GitHub**: `https://raw.githubusercontent.com/omgkit/registry/main`

### Registry Structure

```
registry/
├── index.json           # Registry manifest
├── styles/
│   ├── default.json     # Default Omega theme
│   ├── minimal.json     # Minimal theme
│   └── vibrant.json     # High contrast theme
├── components/
│   ├── ui/              # Base shadcn components (themed)
│   └── omgkit/          # OMGKIT-specific components
└── blocks/              # Full page templates
    ├── dashboard.json
    └── sprint-board.json
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1-2)

**Goal:** Create distributable design tokens

1. Create `templates/design/` directory structure
2. Define `omega.tokens.json` with W3C format
3. Build token-to-tailwind generator script
4. Add `--with-design` flag to `omgkit init`

**Deliverables:**
- `templates/design/omega.tokens.json`
- `templates/design/omega.tailwind.preset.js`
- `scripts/generate-tailwind-from-tokens.js`
- Updated `lib/init.js`

### Phase 2: Component Distribution (Week 3-4)

**Goal:** Ship themed shadcn components

1. Fork/customize base shadcn components
2. Apply Omega tokens to all components
3. Create `components.registry.json`
4. Set up registry hosting

**Deliverables:**
- `templates/design/components/` directory
- `templates/design/components.registry.json`
- Registry deployment (GitHub Pages or Vercel)

### Phase 3: OMGKIT Components (Week 5-6)

**Goal:** Build OMGKIT-specific components

1. AgentCard - Display agent info
2. SprintBoard - Kanban for sprints
3. CommandPalette - cmdk integration
4. WorkflowVisualizer - Show workflow steps
5. SkillBadge - Display skill info

**Deliverables:**
- 5+ OMGKIT-specific components
- Component documentation
- Usage examples

### Phase 4: Screenshot Pipeline (Week 7-8)

**Goal:** Enable theme customization from images

1. Integrate Claude Vision for analysis
2. Build color extraction algorithm
3. Create semantic mapping logic
4. Implement `/design:from-screenshot` command

**Deliverables:**
- `lib/design/screenshot-to-theme.js`
- `plugin/commands/design/from-screenshot.md`
- Theme override system

### Phase 5: CLI Integration (Week 9-10)

**Goal:** Seamless developer experience

1. `/design:add` command for components
2. `/design:theme` command for switching themes
3. `/design:sync` command for updating tokens
4. `/design:preview` command for previewing changes

**Deliverables:**
- 4 new design commands
- CLI documentation
- Integration tests

### Phase 6: Documentation & Launch (Week 11-12)

**Goal:** Make it discoverable

1. Design system documentation site
2. Interactive component playground
3. Theme gallery
4. Migration guide for existing projects

**Deliverables:**
- `docs/design/` documentation
- Live component playground
- Launch announcement

---

## First Concrete Step

Create the foundation structure:

```bash
mkdir -p templates/design/components
```

**File: `templates/design/omega.tokens.json`**

```json
{
  "$schema": "https://tr.designtokens.org/format/2025.10/schema.json",
  "omega": {
    "$type": "color",
    "$description": "Omega brand palette",
    "purple": {
      "50": { "$value": "#FAF5FF" },
      "100": { "$value": "#F3E8FF" },
      "200": { "$value": "#E9D5FF" },
      "300": { "$value": "#D8B4FE" },
      "400": { "$value": "#C084FC" },
      "500": { "$value": "#A855F7" },
      "600": { "$value": "#9333EA" },
      "700": { "$value": "#7C3AED" },
      "800": { "$value": "#6B21A8" },
      "900": { "$value": "#581C87" }
    }
  },
  "semantic": {
    "$type": "color",
    "background": { "$value": "#FFFFFF" },
    "foreground": { "$value": "#09090B" },
    "primary": { "$value": "{omega.purple.700}" },
    "primary-foreground": { "$value": "#FFFFFF" },
    "secondary": { "$value": "#F4F4F5" },
    "secondary-foreground": { "$value": "#18181B" },
    "muted": { "$value": "#F4F4F5" },
    "muted-foreground": { "$value": "#71717A" },
    "accent": { "$value": "#F4F4F5" },
    "accent-foreground": { "$value": "#18181B" },
    "destructive": { "$value": "#EF4444" },
    "destructive-foreground": { "$value": "#FFFFFF" },
    "border": { "$value": "#E4E4E7" },
    "input": { "$value": "#E4E4E7" },
    "ring": { "$value": "{omega.purple.700}" }
  }
}
```

**File: `scripts/generate-tailwind-from-tokens.js`**

```javascript
#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';

const tokens = JSON.parse(readFileSync('templates/design/omega.tokens.json'));

function resolveReference(value, tokens) {
  if (typeof value === 'string' && value.startsWith('{')) {
    const path = value.slice(1, -1).split('.');
    let resolved = tokens;
    for (const key of path) {
      resolved = resolved[key];
    }
    return resolved.$value || resolved;
  }
  return value;
}

function generateTailwindPreset(tokens) {
  const colors = {};

  // Extract omega colors
  if (tokens.omega?.purple) {
    colors.omega = {};
    for (const [shade, config] of Object.entries(tokens.omega.purple)) {
      colors.omega[shade] = config.$value;
    }
  }

  // Extract semantic colors
  if (tokens.semantic) {
    for (const [name, config] of Object.entries(tokens.semantic)) {
      if (config.$type === 'color' || !config.$type) {
        colors[name] = resolveReference(config.$value, tokens);
      }
    }
  }

  return {
    theme: {
      extend: { colors }
    }
  };
}

const preset = generateTailwindPreset(tokens);
const output = `// Auto-generated from omega.tokens.json
// Do not edit manually
module.exports = ${JSON.stringify(preset, null, 2)}
`;

writeFileSync('templates/design/omega.tailwind.preset.js', output);
console.log('Generated templates/design/omega.tailwind.preset.js');
```

---

## The 1000x Vision

**Imagine:**

```bash
# Designer shares a Dribbble screenshot
/design:from-screenshot ~/Downloads/inspiration.png

# AI analyzes and generates theme
✓ Extracted 8 colors from screenshot
✓ Mapped to semantic tokens
✓ Generated omega.tokens.local.json
✓ Updated Tailwind config

# Every component now uses the new theme
/design:preview

# Happy with it? Commit the theme
/design:commit "New dashboard theme inspired by modern SaaS"
```

**This is 1000x because:**
- Typical design system setup: 2-4 weeks
- Screenshot to working theme: 5 minutes
- Consistency across projects: Automatic
- Component library: Pre-built and tested

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| shadcn breaking changes | Pin versions, copy-paste model isolates |
| Token format changes | Use stable W3C 2025.10 spec |
| Color extraction accuracy | Allow manual adjustment UI |
| Registry availability | Mirror on multiple CDNs |
| Projects not adopting | Make it default, opt-out available |

---

## Success Metrics

1. **Adoption**: 80%+ of new OMGKIT projects use Omega Design
2. **Consistency**: 0 design inconsistencies in component library
3. **Speed**: Theme customization < 5 minutes
4. **Satisfaction**: NPS > 50 for design system

---

## Sources

- [W3C Design Tokens Format Module 2025.10](https://tr.designtokens.org/format/)
- [shadcn/ui Registry Documentation](https://ui.shadcn.com/docs/registry)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [Tailwind CSS Configuration](https://tailwindcss.com/docs/configuration)
- [Design Systems and AI: MCP Integration](https://www.figma.com/blog/design-systems-ai-mcp/)

---

*Think Omega. Build Omega. Be Omega.*
