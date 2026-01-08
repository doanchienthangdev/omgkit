# OMGKIT Design System Themes

> **30 Pre-built Design Systems + Custom Options**

When initializing an OMGKIT project, users can choose from:
- **30 curated design system themes** (each with light + dark mode)
- **Screenshot-inspired** - Extract theme from image
- **Webpage reference** - Extract theme from URL

---

## Theme Selection at Init

```bash
# Interactive selection
omgkit init

# Direct theme selection
omgkit init --theme neo-tokyo
omgkit init --theme minimal-slate

# Custom from screenshot
omgkit init --theme-from ~/inspiration.png

# Custom from webpage
omgkit init --theme-from https://linear.app
```

---

## The 30 Design Systems

### Category 1: Tech & AI (6 themes)

#### 1. **Neo Tokyo**
Cyberpunk-inspired, futuristic AI aesthetic
```yaml
name: neo-tokyo
primary: "#E11D48"      # Rose 600
secondary: "#06B6D4"    # Cyan 500
accent: "#FACC15"       # Yellow 400
background:
  light: "#FAFAFA"
  dark: "#0A0A0F"
inspiration: "Cyberpunk 2077, Akira"
vibe: "Futuristic, edgy, high-tech"
```

#### 2. **Electric Cyan**
Modern AI/SaaS aesthetic
```yaml
name: electric-cyan
primary: "#06B6D4"      # Cyan 500
secondary: "#8B5CF6"    # Violet 500
accent: "#F97316"       # Orange 500
background:
  light: "#FFFFFF"
  dark: "#0F172A"
inspiration: "Vercel, Supabase"
vibe: "Clean, modern, developer-friendly"
```

#### 3. **Neural Dark**
Deep learning / AI research aesthetic
```yaml
name: neural-dark
primary: "#3B82F6"      # Blue 500
secondary: "#A855F7"    # Purple 500
accent: "#22D3EE"       # Cyan 400
background:
  light: "#F8FAFC"
  dark: "#030712"
inspiration: "OpenAI, DeepMind"
vibe: "Intelligent, sophisticated, research"
```

#### 4. **Matrix Green**
Hacker/terminal aesthetic
```yaml
name: matrix-green
primary: "#22C55E"      # Green 500
secondary: "#10B981"    # Emerald 500
accent: "#84CC16"       # Lime 500
background:
  light: "#F0FDF4"
  dark: "#022C22"
inspiration: "The Matrix, terminal"
vibe: "Hacker, code-focused, retro-tech"
```

#### 5. **Quantum Purple**
Premium AI platform aesthetic
```yaml
name: quantum-purple
primary: "#7C3AED"      # Violet 600
secondary: "#EC4899"    # Pink 500
accent: "#06B6D4"       # Cyan 500
background:
  light: "#FAFAFA"
  dark: "#0C0A1D"
inspiration: "Anthropic, AI research"
vibe: "Premium, innovative, thoughtful"
```

#### 6. **Hologram**
AR/VR inspired aesthetic
```yaml
name: hologram
primary: "#14B8A6"      # Teal 500
secondary: "#F472B6"    # Pink 400
accent: "#A78BFA"       # Violet 400
background:
  light: "#F0FDFA"
  dark: "#042F2E"
inspiration: "Apple Vision Pro, Meta"
vibe: "Spatial, immersive, next-gen"
```

---

### Category 2: Minimal & Clean (6 themes)

#### 7. **Minimal Slate**
Ultra-clean developer tool aesthetic
```yaml
name: minimal-slate
primary: "#475569"      # Slate 600
secondary: "#0EA5E9"    # Sky 500
accent: "#F59E0B"       # Amber 500
background:
  light: "#FFFFFF"
  dark: "#0F172A"
inspiration: "Linear, Raycast, Arc"
vibe: "Clean, focused, professional"
```

#### 8. **Paper**
Documentation/writing focused
```yaml
name: paper
primary: "#1F2937"      # Gray 800
secondary: "#6366F1"    # Indigo 500
accent: "#F97316"       # Orange 500
background:
  light: "#FFFBEB"
  dark: "#1C1917"
inspiration: "Notion, Bear, iA Writer"
vibe: "Calm, readable, content-first"
```

#### 9. **Mono**
Black and white with single accent
```yaml
name: mono
primary: "#171717"      # Neutral 900
secondary: "#525252"    # Neutral 600
accent: "#EF4444"       # Red 500
background:
  light: "#FFFFFF"
  dark: "#0A0A0A"
inspiration: "Apple, Vercel docs"
vibe: "Elegant, timeless, minimal"
```

#### 10. **Zen**
Japanese-inspired minimal
```yaml
name: zen
primary: "#78716C"      # Stone 500
secondary: "#A8A29E"    # Stone 400
accent: "#DC2626"       # Red 600
background:
  light: "#FAF9F6"
  dark: "#1C1917"
inspiration: "Muji, Japanese design"
vibe: "Calm, balanced, intentional"
```

#### 11. **Nordic**
Scandinavian design aesthetic
```yaml
name: nordic
primary: "#64748B"      # Slate 500
secondary: "#94A3B8"    # Slate 400
accent: "#0369A1"       # Sky 700
background:
  light: "#F8FAFC"
  dark: "#1E293B"
inspiration: "IKEA, Scandinavian design"
vibe: "Functional, clean, accessible"
```

#### 12. **Swiss**
International typographic style
```yaml
name: swiss
primary: "#18181B"      # Zinc 900
secondary: "#71717A"    # Zinc 500
accent: "#DC2626"       # Red 600
background:
  light: "#FFFFFF"
  dark: "#18181B"
inspiration: "Swiss design, Helvetica"
vibe: "Grid-based, typographic, precise"
```

---

### Category 3: Corporate & Enterprise (6 themes)

#### 13. **Ocean Blue**
Enterprise trustworthy aesthetic
```yaml
name: ocean-blue
primary: "#2563EB"      # Blue 600
secondary: "#1D4ED8"    # Blue 700
accent: "#F59E0B"       # Amber 500
background:
  light: "#FFFFFF"
  dark: "#0F172A"
inspiration: "IBM, Salesforce, Microsoft"
vibe: "Trustworthy, stable, enterprise"
```

#### 14. **Corporate Indigo**
Professional SaaS aesthetic
```yaml
name: corporate-indigo
primary: "#4F46E5"      # Indigo 600
secondary: "#6366F1"    # Indigo 500
accent: "#10B981"       # Emerald 500
background:
  light: "#FAFAFA"
  dark: "#1E1B4B"
inspiration: "Stripe, Intercom"
vibe: "Professional, polished, premium"
```

#### 15. **Finance**
Banking/fintech aesthetic
```yaml
name: finance
primary: "#0F766E"      # Teal 700
secondary: "#115E59"    # Teal 800
accent: "#CA8A04"       # Yellow 600
background:
  light: "#FFFFFF"
  dark: "#042F2E"
inspiration: "Bloomberg, Robinhood"
vibe: "Secure, reliable, data-focused"
```

#### 16. **Legal**
Law/compliance aesthetic
```yaml
name: legal
primary: "#1E3A5F"      # Custom navy
secondary: "#374151"    # Gray 700
accent: "#B45309"       # Amber 700
background:
  light: "#FEFEFE"
  dark: "#111827"
inspiration: "Law firms, gov sites"
vibe: "Authoritative, traditional, serious"
```

#### 17. **Healthcare**
Medical/health aesthetic
```yaml
name: healthcare
primary: "#0891B2"      # Cyan 600
secondary: "#0E7490"    # Cyan 700
accent: "#059669"       # Emerald 600
background:
  light: "#F0F9FF"
  dark: "#083344"
inspiration: "Health apps, medical"
vibe: "Clean, calming, trustworthy"
```

#### 18. **Consulting**
Management consulting aesthetic
```yaml
name: consulting
primary: "#1E40AF"      # Blue 800
secondary: "#1E3A8A"    # Blue 900
accent: "#D97706"       # Amber 600
background:
  light: "#FFFFFF"
  dark: "#172554"
inspiration: "McKinsey, BCG, Bain"
vibe: "Premium, strategic, executive"
```

---

### Category 4: Creative & Bold (6 themes)

#### 19. **Coral Sunset**
Warm, creative aesthetic
```yaml
name: coral-sunset
primary: "#F97316"      # Orange 500
secondary: "#FB923C"    # Orange 400
accent: "#14B8A6"       # Teal 500
background:
  light: "#FFFBEB"
  dark: "#1C1917"
inspiration: "Figma, Framer"
vibe: "Warm, creative, approachable"
```

#### 20. **Candy**
Playful, vibrant aesthetic
```yaml
name: candy
primary: "#EC4899"      # Pink 500
secondary: "#F472B6"    # Pink 400
accent: "#8B5CF6"       # Violet 500
background:
  light: "#FDF2F8"
  dark: "#500724"
inspiration: "Dribbble, creative agencies"
vibe: "Fun, playful, youthful"
```

#### 21. **Neon**
High contrast vibrant aesthetic
```yaml
name: neon
primary: "#F43F5E"      # Rose 500
secondary: "#10B981"    # Emerald 500
accent: "#FACC15"       # Yellow 400
background:
  light: "#FAFAFA"
  dark: "#09090B"
inspiration: "Gaming, esports"
vibe: "Energetic, bold, attention-grabbing"
```

#### 22. **Gradient Dream**
Gradient-heavy aesthetic
```yaml
name: gradient-dream
primary: "#8B5CF6"      # Violet 500
secondary: "#EC4899"    # Pink 500
accent: "#06B6D4"       # Cyan 500
gradient: "from-violet-500 via-pink-500 to-cyan-500"
background:
  light: "#FFFFFF"
  dark: "#0F0F23"
inspiration: "Instagram, Spotify Wrapped"
vibe: "Modern, dynamic, eye-catching"
```

#### 23. **Retro**
80s/90s inspired aesthetic
```yaml
name: retro
primary: "#7C3AED"      # Violet 600
secondary: "#F472B6"    # Pink 400
accent: "#FACC15"       # Yellow 400
background:
  light: "#FEF3C7"
  dark: "#1E1B4B"
inspiration: "Synthwave, retrowave"
vibe: "Nostalgic, fun, distinctive"
```

#### 24. **Studio**
Design studio aesthetic
```yaml
name: studio
primary: "#18181B"      # Zinc 900
secondary: "#EF4444"    # Red 500
accent: "#FBBF24"       # Amber 400
background:
  light: "#FFFFFF"
  dark: "#09090B"
inspiration: "Design agencies, portfolios"
vibe: "Bold, creative, confident"
```

---

### Category 5: Nature & Organic (6 themes)

#### 25. **Forest**
Deep nature aesthetic
```yaml
name: forest
primary: "#166534"      # Green 800
secondary: "#15803D"    # Green 700
accent: "#CA8A04"       # Yellow 600
background:
  light: "#F0FDF4"
  dark: "#052E16"
inspiration: "Outdoor brands, eco-tech"
vibe: "Natural, sustainable, grounded"
```

#### 26. **Ocean**
Sea-inspired aesthetic
```yaml
name: ocean
primary: "#0369A1"      # Sky 700
secondary: "#0284C7"    # Sky 600
accent: "#FCD34D"       # Amber 300
background:
  light: "#F0F9FF"
  dark: "#0C4A6E"
inspiration: "Marine, coastal"
vibe: "Calm, deep, refreshing"
```

#### 27. **Desert**
Warm earth tones aesthetic
```yaml
name: desert
primary: "#B45309"      # Amber 700
secondary: "#D97706"    # Amber 600
accent: "#0891B2"       # Cyan 600
background:
  light: "#FFFBEB"
  dark: "#292524"
inspiration: "Southwest, earth"
vibe: "Warm, natural, timeless"
```

#### 28. **Lavender Fields**
Soft purple nature aesthetic
```yaml
name: lavender
primary: "#7E22CE"      # Purple 700
secondary: "#A855F7"    # Purple 500
accent: "#65A30D"       # Lime 600
background:
  light: "#FAF5FF"
  dark: "#3B0764"
inspiration: "Provence, botanical"
vibe: "Soft, elegant, calming"
```

#### 29. **Arctic**
Cold, clean aesthetic
```yaml
name: arctic
primary: "#0EA5E9"      # Sky 500
secondary: "#38BDF8"    # Sky 400
accent: "#F97316"       # Orange 500
background:
  light: "#F8FAFC"
  dark: "#0C4A6E"
inspiration: "Winter, ice, Nordic"
vibe: "Clean, crisp, refreshing"
```

#### 30. **Autumn**
Warm fall aesthetic
```yaml
name: autumn
primary: "#C2410C"      # Orange 700
secondary: "#EA580C"    # Orange 600
accent: "#15803D"       # Green 700
background:
  light: "#FFF7ED"
  dark: "#431407"
inspiration: "Fall foliage, harvest"
vibe: "Warm, cozy, rich"
```

---

## Theme Structure (shadcn/Radix Compatible)

Each theme generates a complete shadcn-compatible CSS variables set:

```css
/* Example: neo-tokyo theme - dark mode */
:root[data-theme="neo-tokyo"] {
  /* Core */
  --background: 240 10% 4%;
  --foreground: 0 0% 98%;

  /* Primary */
  --primary: 347 77% 50%;
  --primary-foreground: 0 0% 100%;

  /* Secondary */
  --secondary: 186 91% 43%;
  --secondary-foreground: 0 0% 0%;

  /* Accent */
  --accent: 48 97% 54%;
  --accent-foreground: 0 0% 0%;

  /* Muted */
  --muted: 240 6% 15%;
  --muted-foreground: 240 5% 65%;

  /* Card */
  --card: 240 10% 6%;
  --card-foreground: 0 0% 98%;

  /* Popover */
  --popover: 240 10% 6%;
  --popover-foreground: 0 0% 98%;

  /* Border */
  --border: 240 6% 20%;
  --input: 240 6% 20%;
  --ring: 347 77% 50%;

  /* Semantic */
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;
  --success: 142 71% 45%;
  --success-foreground: 0 0% 100%;
  --warning: 38 92% 50%;
  --warning-foreground: 0 0% 0%;
  --info: 199 89% 48%;
  --info-foreground: 0 0% 100%;

  /* Radius */
  --radius: 0.5rem;
}
```

---

## Custom Theme Options

### Option A: From Screenshot

```bash
omgkit init --theme-from ~/Downloads/inspiration.png
```

Process:
1. Claude Vision analyzes the image
2. Extracts dominant colors (primary, secondary, accent)
3. Detects light/dark preference
4. Generates complete theme file
5. User can adjust before applying

### Option B: From Webpage URL

```bash
omgkit init --theme-from https://linear.app
```

Process:
1. Fetch page and extract CSS variables
2. Analyze computed styles
3. Extract color palette
4. Generate theme based on detected system
5. User can adjust before applying

### Option C: Interactive Builder

```bash
omgkit init --theme-builder
```

Interactive CLI:
```
? Select base theme category:
  ❯ Tech & AI
    Minimal & Clean
    Corporate & Enterprise
    Creative & Bold
    Nature & Organic

? Select starting theme:
  ❯ Electric Cyan
    Neural Dark
    Neo Tokyo
    ...

? Customize primary color? (hex or name)
  > #00D9FF

? Customize accent color? (hex or name)
  > (keep default)

? Preview in browser? (Y/n)
  > Y

✓ Theme generated: .omgkit/design/theme.css
```

---

## Theme File Structure

When a theme is selected, these files are generated:

```
project/
├── .omgkit/
│   └── design/
│       ├── theme.json          # Theme configuration
│       ├── theme.css           # CSS variables
│       ├── tailwind.preset.js  # Tailwind config
│       └── components.json     # shadcn config
├── components/
│   └── ui/                     # shadcn components
└── tailwind.config.js          # Extends preset
```

### theme.json

```json
{
  "$schema": "https://omgkit.dev/schemas/theme.json",
  "name": "neo-tokyo",
  "version": "1.0.0",
  "source": "preset",
  "colors": {
    "primary": "#E11D48",
    "secondary": "#06B6D4",
    "accent": "#FACC15",
    "background": {
      "light": "#FAFAFA",
      "dark": "#0A0A0F"
    }
  },
  "radius": "0.5rem",
  "fontFamily": {
    "sans": "Inter",
    "mono": "JetBrains Mono"
  }
}
```

---

## Theme Categories Summary

| Category | Count | Best For |
|----------|-------|----------|
| Tech & AI | 6 | AI products, dev tools, SaaS |
| Minimal & Clean | 6 | Documentation, productivity apps |
| Corporate & Enterprise | 6 | B2B, fintech, healthcare |
| Creative & Bold | 6 | Portfolios, agencies, consumer apps |
| Nature & Organic | 6 | Sustainability, lifestyle, wellness |
| **Custom** | ∞ | Screenshot, URL, builder |

---

## Implementation Priority

### Phase 1: Core 10 Themes
1. Electric Cyan (Tech)
2. Minimal Slate (Minimal)
3. Ocean Blue (Corporate)
4. Coral Sunset (Creative)
5. Forest (Nature)
6. Neo Tokyo (Tech)
7. Paper (Minimal)
8. Corporate Indigo (Corporate)
9. Neon (Creative)
10. Arctic (Nature)

### Phase 2: Remaining 20 Themes
Complete all 30 themes with full CSS variable sets.

### Phase 3: Custom Options
- Screenshot extraction
- URL extraction
- Interactive builder

---

*Every project deserves great design. Choose yours.*
