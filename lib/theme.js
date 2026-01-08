/**
 * OMGKIT Theme Processing Library
 * Handles theme loading, validation, CSS generation, and extraction
 *
 * @module lib/theme
 */

import { existsSync, readFileSync, writeFileSync, readdirSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// V2 imports (lazy-loaded to avoid circular deps)
let themeV2Module = null;
async function getThemeV2Module() {
  if (!themeV2Module) {
    themeV2Module = await import('./theme-v2.js');
  }
  return themeV2Module;
}

// Package root detection
let PACKAGE_ROOT;

/**
 * Set the package root directory (for testing)
 * @param {string} root - Package root path
 */
export function setThemePackageRoot(root) {
  PACKAGE_ROOT = root;
}

/**
 * Get the package root directory
 * @returns {string} Package root path
 */
export function getThemePackageRoot() {
  if (PACKAGE_ROOT) return PACKAGE_ROOT;
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  PACKAGE_ROOT = join(__dirname, '..');
  return PACKAGE_ROOT;
}

/**
 * Theme category definitions
 */
export const THEME_CATEGORIES = {
  'tech-ai': {
    name: 'Tech & AI',
    description: 'Futuristic, cyberpunk, and technology-inspired themes',
    emoji: '⚡'
  },
  'minimal-clean': {
    name: 'Minimal & Clean',
    description: 'Simple, elegant, and distraction-free themes',
    emoji: '✨'
  },
  'corporate-enterprise': {
    name: 'Corporate & Enterprise',
    description: 'Professional themes for business applications',
    emoji: '🏢'
  },
  'creative-bold': {
    name: 'Creative & Bold',
    description: 'Vibrant, expressive themes for creative projects',
    emoji: '🎨'
  },
  'nature-organic': {
    name: 'Nature & Organic',
    description: 'Earthy, natural color palettes inspired by nature',
    emoji: '🌿'
  }
};

/**
 * Required color variables for shadcn compatibility
 */
export const REQUIRED_COLORS = [
  'background', 'foreground',
  'primary', 'primary-foreground',
  'secondary', 'secondary-foreground',
  'muted', 'muted-foreground',
  'accent', 'accent-foreground',
  'destructive', 'destructive-foreground',
  'border', 'input', 'ring',
  'card', 'card-foreground',
  'popover', 'popover-foreground'
];

/**
 * Optional color variables (charts, sidebar)
 */
export const OPTIONAL_COLORS = [
  'chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5',
  'sidebar-background', 'sidebar-foreground',
  'sidebar-primary', 'sidebar-primary-foreground',
  'sidebar-accent', 'sidebar-accent-foreground',
  'sidebar-border', 'sidebar-ring'
];

/**
 * V2 extended tokens (new in v2 schema)
 */
export const V2_EXTENDED_TOKENS = [
  'surface', 'surface-hover', 'surface-active',
  'primary-hover', 'secondary-hover', 'accent-hover',
  'border-hover', 'input-hover',
  'ring-offset', 'panel', 'panel-translucent', 'overlay'
];

/**
 * V2 status colors
 */
export const V2_STATUS_COLORS = [
  'success', 'success-foreground',
  'warning', 'warning-foreground',
  'info', 'info-foreground'
];

/**
 * Detect theme schema version
 * @param {Object} theme - Theme object
 * @returns {'1.0' | '2.0'} Theme version
 */
export function detectThemeVersion(theme) {
  if (!theme) return '1.0';

  // Explicit version check
  if (theme.version === '2.0' || theme.version === 2) return '2.0';

  // V2 indicators (any of these marks it as v2)
  if (theme.scales) return '2.0';
  if (theme.semanticTokens) return '2.0';
  if (theme.effects) return '2.0';
  if (theme.animations) return '2.0';
  if (theme.colorSystem) return '2.0';
  if (theme.statusColors) return '2.0';

  // Default to v1
  return '1.0';
}

/**
 * Check if theme is v2 format
 * @param {Object} theme - Theme object
 * @returns {boolean} True if v2 theme
 */
export function isV2Theme(theme) {
  return detectThemeVersion(theme) === '2.0';
}

/**
 * Load all available themes from templates/design/themes
 * @returns {Object} Themes grouped by category
 */
export function loadAllThemes() {
  const themesDir = join(getThemePackageRoot(), 'templates', 'design', 'themes');
  const themes = {};

  for (const categoryId of Object.keys(THEME_CATEGORIES)) {
    const categoryDir = join(themesDir, categoryId);
    if (!existsSync(categoryDir)) {
      themes[categoryId] = [];
      continue;
    }

    themes[categoryId] = [];
    const files = readdirSync(categoryDir).filter(f => f.endsWith('.json'));

    for (const file of files) {
      try {
        const themePath = join(categoryDir, file);
        const theme = JSON.parse(readFileSync(themePath, 'utf8'));
        themes[categoryId].push(theme);
      } catch (err) {
        console.warn(`Failed to load theme ${file}: ${err.message}`);
      }
    }
  }

  return themes;
}

/**
 * Get a specific theme by ID
 * @param {string} themeId - Theme identifier
 * @returns {Object|null} Theme object or null if not found
 */
export function getThemeById(themeId) {
  const themes = loadAllThemes();
  for (const category of Object.values(themes)) {
    const theme = category.find(t => t.id === themeId);
    if (theme) return theme;
  }
  return null;
}

/**
 * Get all theme IDs
 * @returns {string[]} Array of theme IDs
 */
export function getAllThemeIds() {
  const themes = loadAllThemes();
  const ids = [];
  for (const category of Object.values(themes)) {
    for (const theme of category) {
      ids.push(theme.id);
    }
  }
  return ids;
}

/**
 * Validate theme against schema
 * @param {Object} theme - Theme object to validate
 * @returns {{valid: boolean, errors: string[]}} Validation result
 */
export function validateTheme(theme) {
  const errors = [];

  // Check required fields
  const requiredFields = ['name', 'id', 'category', 'colors'];
  for (const field of requiredFields) {
    if (!theme[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Validate ID format
  if (theme.id && !/^[a-z0-9-]+$/.test(theme.id)) {
    errors.push('ID must be kebab-case (lowercase letters, numbers, hyphens)');
  }

  // Validate category
  if (theme.category && !THEME_CATEGORIES[theme.category]) {
    errors.push(`Invalid category: ${theme.category}. Must be one of: ${Object.keys(THEME_CATEGORIES).join(', ')}`);
  }

  // Validate colors
  if (theme.colors) {
    if (!theme.colors.light) errors.push('Missing light color palette');
    if (!theme.colors.dark) errors.push('Missing dark color palette');

    for (const mode of ['light', 'dark']) {
      if (theme.colors[mode]) {
        for (const color of REQUIRED_COLORS) {
          if (!theme.colors[mode][color]) {
            errors.push(`Missing ${mode}.${color} color`);
          }
        }

        // Validate HSL format
        for (const [key, value] of Object.entries(theme.colors[mode])) {
          if (typeof value === 'string' && !/^\d+(\.\d+)?\s+\d+(\.\d+)?%\s+\d+(\.\d+)?%$/.test(value)) {
            errors.push(`Invalid HSL format for ${mode}.${key}: "${value}". Expected format: "H S% L%" (e.g., "220 14.3% 95.9%")`);
          }
        }
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Generate CSS variables from theme (sync version, v1 only)
 * @param {Object} theme - Theme object
 * @returns {string} CSS content with variables
 */
export function generateThemeCSS(theme) {
  // Check if v2 theme - if so, use simple generation for compatibility
  // For full v2 features, use generateThemeCSSAsync or processTheme from theme-v2.js
  const generateColorVars = (colors) => {
    let css = '';
    for (const [key, value] of Object.entries(colors)) {
      css += `  --${key}: ${value};\n`;
    }
    return css;
  };

  // Handle v2 themes with semanticTokens
  const lightColors = theme.colors?.light || theme.semanticTokens?.light || {};
  const darkColors = theme.colors?.dark || theme.semanticTokens?.dark || {};

  const lightVars = generateColorVars(lightColors);
  const darkVars = generateColorVars(darkColors);

  const version = isV2Theme(theme) ? '2.0' : '1.0';

  return `/* OMGKIT Theme: ${theme.name} */
/* Theme ID: ${theme.id} */
/* Category: ${theme.category} */
/* Version: ${version} */
/* Generated by OMGKIT Design System */

@layer base {
  :root {
${lightVars}  --radius: ${theme.spacing?.radius || theme.radius || '0.5rem'};
  }

  .dark {
${darkVars}  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
`;
}

/**
 * Generate CSS variables from theme (async version, full v2 support)
 * @param {Object} theme - Theme object (v1 or v2)
 * @returns {Promise<string>} CSS content with all v2 features
 */
export async function generateThemeCSSAsync(theme) {
  if (isV2Theme(theme)) {
    const v2 = await getThemeV2Module();
    return v2.generateV2ThemeCSS(theme);
  }
  return generateThemeCSS(theme);
}

/**
 * Process theme with unified processor (async)
 * @param {Object} theme - Theme object (v1 or v2)
 * @param {Object} options - Processing options
 * @returns {Promise<Object>} Processed theme result
 */
export async function processThemeUnified(theme, options = {}) {
  const v2 = await getThemeV2Module();
  return v2.processTheme(theme, options);
}

/**
 * Generate components.json for shadcn
 * @param {Object} theme - Theme object
 * @param {Object} options - Configuration options
 * @returns {Object} components.json content
 */
export function generateComponentsJson(theme, options = {}) {
  const {
    cssPath = 'app/globals.css',
    tailwindConfig = 'tailwind.config.ts',
    style = 'new-york',
    rsc = true,
    tsx = true
  } = options;

  return {
    "$schema": "https://ui.shadcn.com/schema.json",
    "style": style,
    "rsc": rsc,
    "tsx": tsx,
    "tailwind": {
      "config": tailwindConfig,
      "css": cssPath,
      "baseColor": "slate",
      "cssVariables": true,
      "prefix": ""
    },
    "aliases": {
      "components": "@/components",
      "utils": "@/lib/utils",
      "ui": "@/components/ui",
      "lib": "@/lib",
      "hooks": "@/hooks"
    },
    "iconLibrary": "lucide"
  };
}

/**
 * Generate tailwind.config.ts content
 * @param {Object} theme - Theme object
 * @returns {string} Tailwind config content
 */
export function generateTailwindConfig(theme) {
  const fontSans = theme.fontFamily?.sans || 'Inter, system-ui, sans-serif';
  const fontMono = theme.fontFamily?.mono || 'JetBrains Mono, monospace';

  return `import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["${fontSans}"],
        mono: ["${fontMono}"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
`;
}

/**
 * Apply theme to project directory
 * @param {Object} theme - Theme object
 * @param {string} projectDir - Project directory path
 * @returns {{themeJson: string, themeCss: string}} Created file paths
 */
export function applyThemeToProject(theme, projectDir) {
  const designDir = join(projectDir, '.omgkit', 'design');

  // Create design directory
  mkdirSync(designDir, { recursive: true });

  // Write theme.json
  const themeJsonPath = join(designDir, 'theme.json');
  writeFileSync(themeJsonPath, JSON.stringify(theme, null, 2));

  // Write theme.css
  const themeCssPath = join(designDir, 'theme.css');
  writeFileSync(themeCssPath, generateThemeCSS(theme));

  return {
    themeJson: themeJsonPath,
    themeCss: themeCssPath
  };
}

/**
 * Get project's current theme
 * @param {string} projectDir - Project directory path
 * @returns {Object|null} Theme object or null if not found
 */
export function getProjectTheme(projectDir) {
  const themeJsonPath = join(projectDir, '.omgkit', 'design', 'theme.json');
  if (!existsSync(themeJsonPath)) return null;

  try {
    return JSON.parse(readFileSync(themeJsonPath, 'utf8'));
  } catch {
    return null;
  }
}

/**
 * List all themes with preview data
 * @returns {Array} Array of category objects with themes
 */
export function listThemesWithPreview() {
  const themes = loadAllThemes();
  const result = [];

  for (const [categoryId, categoryThemes] of Object.entries(themes)) {
    const category = THEME_CATEGORIES[categoryId];
    if (!category) continue;

    result.push({
      categoryId,
      categoryName: category.name,
      emoji: category.emoji,
      description: category.description,
      themes: categoryThemes.map(t => ({
        id: t.id,
        name: t.name,
        description: t.description,
        primaryLight: t.colors.light.primary,
        primaryDark: t.colors.dark.primary,
        backgroundLight: t.colors.light.background,
        backgroundDark: t.colors.dark.background
      }))
    });
  }

  return result;
}

/**
 * Get prompt for Claude Vision screenshot extraction
 * @returns {string} Extraction prompt
 */
export function getScreenshotExtractionPrompt() {
  return `Analyze this screenshot and extract a cohesive color theme for a web application.

For each color, provide the HSL value in this format: "H S% L%" (e.g., "220 14.3% 95.9%")

Extract these colors:
1. **background** - Main page background
2. **foreground** - Primary text color
3. **primary** - Brand/accent color (buttons, links)
4. **primary-foreground** - Text on primary color
5. **secondary** - Secondary backgrounds
6. **secondary-foreground** - Text on secondary
7. **muted** - Subtle backgrounds
8. **muted-foreground** - Subtle text
9. **accent** - Highlights, hovers
10. **accent-foreground** - Text on accent
11. **destructive** - Error/danger color
12. **destructive-foreground** - Text on destructive
13. **border** - Border colors
14. **input** - Input field borders
15. **ring** - Focus ring color
16. **card** - Card background
17. **card-foreground** - Card text
18. **popover** - Popover background
19. **popover-foreground** - Popover text

Return a JSON object with this structure:
{
  "name": "Extracted Theme",
  "id": "extracted-theme",
  "category": "custom",
  "description": "Theme extracted from screenshot",
  "colors": {
    "light": { ... all colors ... },
    "dark": { ... inverted/dark mode colors ... }
  },
  "radius": "0.5rem"
}`;
}

/**
 * Convert hex color to HSL string
 * @param {string} hex - Hex color (e.g., "#E11D48")
 * @returns {string} HSL string (e.g., "346.8 77.2% 49.8%")
 */
export function hexToHsl(hex) {
  // Remove # if present
  hex = hex.replace(/^#/, '');

  // Parse hex
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  h = Math.round(h * 360 * 10) / 10;
  s = Math.round(s * 100 * 10) / 10;
  l = Math.round(l * 100 * 10) / 10;

  return `${h} ${s}% ${l}%`;
}

/**
 * Convert HSL string to hex color
 * @param {string} hsl - HSL string (e.g., "346.8 77.2% 49.8%")
 * @returns {string} Hex color (e.g., "#E11D48")
 */
export function hslToHex(hsl) {
  const [h, s, l] = hsl.split(/\s+/).map((v, i) => {
    const num = parseFloat(v);
    return i === 0 ? num / 360 : num / 100;
  });

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  const toHex = x => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

// ============================================================================
// THEME REBUILD & ROLLBACK FUNCTIONS
// ============================================================================

/**
 * Directories to scan for color references (standard React/Next.js paths)
 */
export const SCAN_DIRECTORIES = ['app', 'components', 'src', 'pages'];

/**
 * Extended directories for FULL mode scan (includes tests, lib, etc.)
 */
export const FULL_SCAN_DIRECTORIES = [
  'app', 'components', 'src', 'pages',
  'tests', 'test', '__tests__',
  'lib', 'utils', 'hooks',
  'styles', 'features', 'modules',
  'layouts', 'views', 'screens'
];

/**
 * File extensions to scan
 */
export const SCAN_EXTENSIONS = ['.tsx', '.jsx', '.ts', '.js'];

/**
 * Directories to always exclude from scanning
 */
export const EXCLUDE_DIRS = ['node_modules', '.git', '.omgkit', 'dist', 'build', '.next', 'out'];

/**
 * Color patterns to detect non-compliant colors
 */
export const COLOR_PATTERNS = {
  // Tailwind default colors (should use theme vars)
  tailwindDefaults: /\b(bg|text|border|ring|fill|stroke|outline|divide|from|via|to|shadow|decoration)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white|black)-(\d{2,3})\b/g,

  // Hardcoded hex colors in className or style
  hexColors: /#([0-9A-Fa-f]{3}){1,2}\b/g,

  // Hardcoded RGB/HSL in styles
  rgbHsl: /\b(rgb|hsl)a?\([^)]+\)/g
};

/**
 * Mapping of hardcoded Tailwind colors to theme variables
 */
export const THEME_VAR_MAP = {
  // Background mappings
  'bg-white': 'bg-background',
  'bg-gray-50': 'bg-muted',
  'bg-gray-100': 'bg-muted',
  'bg-gray-200': 'bg-muted',
  'bg-gray-900': 'bg-foreground',
  'bg-slate-50': 'bg-muted',
  'bg-slate-100': 'bg-muted',
  'bg-slate-900': 'bg-foreground',
  'bg-zinc-50': 'bg-muted',
  'bg-zinc-100': 'bg-muted',
  'bg-zinc-900': 'bg-foreground',

  // Text mappings
  'text-black': 'text-foreground',
  'text-white': 'text-background',
  'text-gray-900': 'text-foreground',
  'text-gray-800': 'text-foreground',
  'text-gray-700': 'text-foreground',
  'text-gray-600': 'text-muted-foreground',
  'text-gray-500': 'text-muted-foreground',
  'text-gray-400': 'text-muted-foreground',
  'text-slate-900': 'text-foreground',
  'text-slate-600': 'text-muted-foreground',
  'text-slate-500': 'text-muted-foreground',
  'text-zinc-900': 'text-foreground',
  'text-zinc-600': 'text-muted-foreground',
  'text-zinc-500': 'text-muted-foreground',

  // Border mappings
  'border-gray-100': 'border-border',
  'border-gray-200': 'border-border',
  'border-gray-300': 'border-input',
  'border-slate-200': 'border-border',
  'border-slate-300': 'border-input',
  'border-zinc-200': 'border-border',
  'border-zinc-300': 'border-input',

  // Primary/accent colors (common patterns)
  'bg-blue-500': 'bg-primary',
  'bg-blue-600': 'bg-primary',
  'bg-blue-700': 'bg-primary',
  'text-blue-500': 'text-primary',
  'text-blue-600': 'text-primary',
  'text-blue-700': 'text-primary',
  'ring-blue-500': 'ring-ring',
  'ring-blue-600': 'ring-ring',

  // Destructive
  'bg-red-500': 'bg-destructive',
  'bg-red-600': 'bg-destructive',
  'text-red-500': 'text-destructive',
  'text-red-600': 'text-destructive',
  'border-red-500': 'border-destructive',

  // Secondary/accent patterns
  'bg-gray-100': 'bg-secondary',
  'bg-slate-100': 'bg-secondary',
  'hover:bg-gray-100': 'hover:bg-accent',
  'hover:bg-slate-100': 'hover:bg-accent'
};

/**
 * Extended color mapping for FULL mode
 * Maps ALL common Tailwind colors to theme variables
 */
export const FULL_THEME_VAR_MAP = {
  ...THEME_VAR_MAP,

  // === GREENS → success ===
  'bg-green-50': 'bg-success/10',
  'bg-green-100': 'bg-success/20',
  'bg-green-200': 'bg-success/30',
  'bg-green-300': 'bg-success/50',
  'bg-green-400': 'bg-success/70',
  'bg-green-500': 'bg-success',
  'bg-green-600': 'bg-success',
  'bg-green-700': 'bg-success',
  'bg-green-800': 'bg-success',
  'bg-green-900': 'bg-success',
  'text-green-500': 'text-success',
  'text-green-600': 'text-success',
  'text-green-700': 'text-success',
  'text-green-800': 'text-success',
  'border-green-500': 'border-success',
  'ring-green-500': 'ring-success',

  'bg-emerald-50': 'bg-success/10',
  'bg-emerald-100': 'bg-success/20',
  'bg-emerald-200': 'bg-success/30',
  'bg-emerald-300': 'bg-success/50',
  'bg-emerald-400': 'bg-success/70',
  'bg-emerald-500': 'bg-success',
  'bg-emerald-600': 'bg-success',
  'bg-emerald-700': 'bg-success',
  'text-emerald-500': 'text-success',
  'text-emerald-600': 'text-success',
  'text-emerald-700': 'text-success',
  'border-emerald-500': 'border-success',

  'bg-teal-500': 'bg-success',
  'bg-teal-600': 'bg-success',
  'text-teal-500': 'text-success',
  'text-teal-600': 'text-success',

  // === YELLOWS/ORANGES → warning ===
  'bg-yellow-50': 'bg-warning/10',
  'bg-yellow-100': 'bg-warning/20',
  'bg-yellow-200': 'bg-warning/30',
  'bg-yellow-300': 'bg-warning/50',
  'bg-yellow-400': 'bg-warning/70',
  'bg-yellow-500': 'bg-warning',
  'bg-yellow-600': 'bg-warning',
  'text-yellow-500': 'text-warning',
  'text-yellow-600': 'text-warning',
  'text-yellow-700': 'text-warning',
  'border-yellow-500': 'border-warning',

  'bg-amber-50': 'bg-warning/10',
  'bg-amber-100': 'bg-warning/20',
  'bg-amber-300': 'bg-warning/50',
  'bg-amber-400': 'bg-warning/70',
  'bg-amber-500': 'bg-warning',
  'bg-amber-600': 'bg-warning',
  'text-amber-500': 'text-warning',
  'text-amber-600': 'text-warning',
  'border-amber-500': 'border-warning',

  'bg-orange-500': 'bg-warning',
  'bg-orange-600': 'bg-warning',
  'text-orange-500': 'text-warning',
  'text-orange-600': 'text-warning',
  'border-orange-500': 'border-warning',

  // === BLUES → info or primary ===
  'bg-blue-50': 'bg-primary/10',
  'bg-blue-100': 'bg-primary/20',
  'bg-blue-200': 'bg-primary/30',
  'bg-blue-300': 'bg-primary/50',
  'bg-blue-400': 'bg-primary/70',
  'bg-blue-800': 'bg-primary',
  'bg-blue-900': 'bg-primary',
  'text-blue-800': 'text-primary',
  'text-blue-900': 'text-primary',

  'bg-cyan-50': 'bg-info/10',
  'bg-cyan-100': 'bg-info/20',
  'bg-cyan-300': 'bg-info/50',
  'bg-cyan-400': 'bg-info/70',
  'bg-cyan-500': 'bg-info',
  'bg-cyan-600': 'bg-info',
  'text-cyan-500': 'text-info',
  'text-cyan-600': 'text-info',
  'border-cyan-500': 'border-info',

  'bg-sky-50': 'bg-info/10',
  'bg-sky-100': 'bg-info/20',
  'bg-sky-400': 'bg-info/70',
  'bg-sky-500': 'bg-info',
  'bg-sky-600': 'bg-info',
  'text-sky-500': 'text-info',
  'text-sky-600': 'text-info',
  'border-sky-500': 'border-info',

  // === REDS → destructive ===
  'bg-red-50': 'bg-destructive/10',
  'bg-red-100': 'bg-destructive/20',
  'bg-red-200': 'bg-destructive/30',
  'bg-red-300': 'bg-destructive/50',
  'bg-red-400': 'bg-destructive/70',
  'bg-red-700': 'bg-destructive',
  'bg-red-800': 'bg-destructive',
  'bg-red-900': 'bg-destructive',
  'text-red-700': 'text-destructive',
  'text-red-800': 'text-destructive',
  'border-red-600': 'border-destructive',

  'bg-rose-50': 'bg-destructive/10',
  'bg-rose-100': 'bg-destructive/20',
  'bg-rose-400': 'bg-destructive/70',
  'bg-rose-500': 'bg-destructive',
  'bg-rose-600': 'bg-destructive',
  'text-rose-500': 'text-destructive',
  'text-rose-600': 'text-destructive',
  'border-rose-500': 'border-destructive',

  // === PURPLES → accent ===
  'bg-purple-50': 'bg-accent/10',
  'bg-purple-100': 'bg-accent/20',
  'bg-purple-200': 'bg-accent/30',
  'bg-purple-400': 'bg-accent/70',
  'bg-purple-500': 'bg-accent',
  'bg-purple-600': 'bg-accent',
  'bg-purple-700': 'bg-accent',
  'text-purple-500': 'text-accent-foreground',
  'text-purple-600': 'text-accent-foreground',
  'text-purple-700': 'text-accent-foreground',
  'border-purple-500': 'border-accent',

  'bg-violet-50': 'bg-accent/10',
  'bg-violet-100': 'bg-accent/20',
  'bg-violet-400': 'bg-accent/70',
  'bg-violet-500': 'bg-accent',
  'bg-violet-600': 'bg-accent',
  'text-violet-500': 'text-accent-foreground',
  'text-violet-600': 'text-accent-foreground',
  'border-violet-500': 'border-accent',

  'bg-indigo-50': 'bg-accent/10',
  'bg-indigo-100': 'bg-accent/20',
  'bg-indigo-400': 'bg-accent/70',
  'bg-indigo-500': 'bg-accent',
  'bg-indigo-600': 'bg-accent',
  'text-indigo-500': 'text-accent-foreground',
  'text-indigo-600': 'text-accent-foreground',
  'border-indigo-500': 'border-accent',

  // === PINKS → accent variant ===
  'bg-pink-50': 'bg-accent/10',
  'bg-pink-100': 'bg-accent/20',
  'bg-pink-400': 'bg-accent/70',
  'bg-pink-500': 'bg-accent',
  'bg-pink-600': 'bg-accent',
  'text-pink-500': 'text-accent-foreground',
  'text-pink-600': 'text-accent-foreground',

  'bg-fuchsia-500': 'bg-accent',
  'bg-fuchsia-600': 'bg-accent',
  'text-fuchsia-500': 'text-accent-foreground',
  'text-fuchsia-600': 'text-accent-foreground',

  // === NEUTRALS (extended) ===
  'bg-neutral-50': 'bg-muted',
  'bg-neutral-100': 'bg-muted',
  'bg-neutral-200': 'bg-muted',
  'bg-neutral-800': 'bg-foreground',
  'bg-neutral-900': 'bg-foreground',
  'text-neutral-900': 'text-foreground',
  'text-neutral-800': 'text-foreground',
  'text-neutral-600': 'text-muted-foreground',
  'text-neutral-500': 'text-muted-foreground',
  'border-neutral-200': 'border-border',
  'border-neutral-300': 'border-input',

  'bg-stone-50': 'bg-muted',
  'bg-stone-100': 'bg-muted',
  'bg-stone-200': 'bg-muted',
  'text-stone-900': 'text-foreground',
  'text-stone-600': 'text-muted-foreground',
  'text-stone-500': 'text-muted-foreground',
  'border-stone-200': 'border-border',
  'border-stone-300': 'border-input',

  // === LIME → success variant ===
  'bg-lime-500': 'bg-success',
  'bg-lime-600': 'bg-success',
  'text-lime-500': 'text-success',
  'text-lime-600': 'text-success',

  // === HOVER STATES ===
  'hover:bg-gray-50': 'hover:bg-muted',
  'hover:bg-gray-200': 'hover:bg-muted',
  'hover:bg-slate-50': 'hover:bg-muted',
  'hover:bg-slate-200': 'hover:bg-muted',
  'hover:bg-zinc-50': 'hover:bg-muted',
  'hover:bg-zinc-100': 'hover:bg-accent',
  'hover:bg-zinc-200': 'hover:bg-muted',
  'hover:bg-blue-600': 'hover:bg-primary/90',
  'hover:bg-blue-700': 'hover:bg-primary/90',
  'hover:bg-red-600': 'hover:bg-destructive/90',
  'hover:bg-red-700': 'hover:bg-destructive/90',
  'hover:bg-green-600': 'hover:bg-success/90',
  'hover:bg-green-700': 'hover:bg-success/90',

  // === FOCUS STATES ===
  'focus:ring-blue-500': 'focus:ring-ring',
  'focus:ring-blue-600': 'focus:ring-ring',
  'focus:border-blue-500': 'focus:border-ring',
  'focus:border-blue-600': 'focus:border-ring',

  // === DARK MODE VARIANTS ===
  'dark:bg-gray-800': 'dark:bg-muted',
  'dark:bg-gray-900': 'dark:bg-background',
  'dark:bg-slate-800': 'dark:bg-muted',
  'dark:bg-slate-900': 'dark:bg-background',
  'dark:text-gray-100': 'dark:text-foreground',
  'dark:text-gray-200': 'dark:text-foreground',
  'dark:text-gray-300': 'dark:text-muted-foreground',
  'dark:text-gray-400': 'dark:text-muted-foreground',
  'dark:border-gray-700': 'dark:border-border',
  'dark:border-gray-800': 'dark:border-border'
};

/**
 * Recursively get all files in a directory
 * @param {string} dir - Directory to scan
 * @param {string[]} extensions - File extensions to include
 * @param {string[]} excludeDirs - Directories to exclude
 * @returns {string[]} Array of file paths
 */
function getFilesRecursive(dir, extensions, excludeDirs) {
  const files = [];
  if (!existsSync(dir)) return files;

  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!excludeDirs.includes(entry.name)) {
        files.push(...getFilesRecursive(fullPath, extensions, excludeDirs));
      }
    } else if (entry.isFile()) {
      const ext = '.' + entry.name.split('.').pop();
      if (extensions.includes(ext)) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

/**
 * Scan project for files with non-compliant color references
 * @param {string} projectDir - Project root directory
 * @param {Object} options - { fullMode: boolean }
 * @returns {Object} { files: [], totalReferences: number, nonCompliant: [], compliant: number }
 */
export function scanProjectColors(projectDir, options = {}) {
  const { fullMode = false } = options;
  const scanDirs = fullMode ? FULL_SCAN_DIRECTORIES : SCAN_DIRECTORIES;
  const colorMap = fullMode ? FULL_THEME_VAR_MAP : THEME_VAR_MAP;

  const result = {
    files: [],
    totalReferences: 0,
    nonCompliant: [],
    compliant: 0,
    scannedFiles: 0,
    fullMode
  };

  // Find all files to scan
  const filesToScan = [];
  for (const scanDir of scanDirs) {
    const fullPath = join(projectDir, scanDir);
    if (existsSync(fullPath)) {
      filesToScan.push(...getFilesRecursive(fullPath, SCAN_EXTENSIONS, EXCLUDE_DIRS));
    }
  }

  result.scannedFiles = filesToScan.length;

  // Scan each file
  for (const filePath of filesToScan) {
    try {
      const content = readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      const relativePath = filePath.replace(projectDir + '/', '');
      const fileMatches = [];

      // Check if this is a test file (for special handling)
      const isTestFile = relativePath.includes('test') ||
                         relativePath.includes('spec') ||
                         relativePath.includes('__tests__');

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineNum = i + 1;

        // Skip test assertions in test files (don't modify expected values)
        if (isTestFile && (
          line.includes('expect(') ||
          line.includes('toBe(') ||
          line.includes('toEqual(') ||
          line.includes('toContain(') ||
          line.includes('toMatch(') ||
          line.includes('toHaveClass(')
        )) {
          continue;
        }

        // Check for Tailwind default colors
        let match;
        const pattern = new RegExp(COLOR_PATTERNS.tailwindDefaults.source, 'g');
        while ((match = pattern.exec(line)) !== null) {
          result.totalReferences++;
          const fullMatch = match[0];

          // Check if this has a theme-compliant mapping
          const mapping = colorMap[fullMatch];
          if (mapping) {
            fileMatches.push({
              file: relativePath,
              line: lineNum,
              column: match.index,
              match: fullMatch,
              suggestion: mapping,
              type: 'tailwind-default',
              fixable: true
            });
            result.nonCompliant.push({
              file: relativePath,
              line: lineNum,
              match: fullMatch,
              suggestion: mapping
            });
          } else if (fullMode) {
            // In FULL mode, try to find best match dynamically
            const dynamicMapping = getDynamicColorMapping(fullMatch);
            if (dynamicMapping) {
              fileMatches.push({
                file: relativePath,
                line: lineNum,
                column: match.index,
                match: fullMatch,
                suggestion: dynamicMapping,
                type: 'dynamic-mapped',
                fixable: true
              });
              result.nonCompliant.push({
                file: relativePath,
                line: lineNum,
                match: fullMatch,
                suggestion: dynamicMapping
              });
            } else {
              // Still unmapped - warn only
              fileMatches.push({
                file: relativePath,
                line: lineNum,
                column: match.index,
                match: fullMatch,
                suggestion: null,
                type: 'unmapped',
                fixable: false
              });
              result.nonCompliant.push({
                file: relativePath,
                line: lineNum,
                match: fullMatch,
                suggestion: null
              });
            }
          } else {
            // Standard mode - unmapped color, warn only
            fileMatches.push({
              file: relativePath,
              line: lineNum,
              column: match.index,
              match: fullMatch,
              suggestion: null,
              type: 'unmapped',
              fixable: false
            });
            result.nonCompliant.push({
              file: relativePath,
              line: lineNum,
              match: fullMatch,
              suggestion: null
            });
          }
        }

        // Check for hex colors in className or style attributes
        const hexPattern = new RegExp(COLOR_PATTERNS.hexColors.source, 'g');
        while ((match = hexPattern.exec(line)) !== null) {
          // Only flag if it appears to be in className or style context
          const before = line.slice(0, match.index);
          if (before.includes('className') || before.includes('style') || before.includes('bg-[') || before.includes('text-[')) {
            result.totalReferences++;
            fileMatches.push({
              file: relativePath,
              line: lineNum,
              column: match.index,
              match: match[0],
              suggestion: 'Use CSS variable (e.g., bg-background)',
              type: 'hex-color',
              fixable: false
            });
            result.nonCompliant.push({
              file: relativePath,
              line: lineNum,
              match: match[0],
              suggestion: 'Use CSS variable'
            });
          }
        }
      }

      if (fileMatches.length > 0) {
        result.files.push({
          path: relativePath,
          matches: fileMatches
        });
      }
    } catch (err) {
      // Skip files that can't be read
    }
  }

  result.compliant = result.totalReferences - result.nonCompliant.length;

  return result;
}

/**
 * Dynamically determine best theme variable for unknown Tailwind color (FULL mode)
 * @param {string} colorClass - Tailwind color class (e.g., "bg-emerald-400")
 * @returns {string|null} Theme variable mapping or null
 */
export function getDynamicColorMapping(colorClass) {
  // Parse the color class: prefix-color-shade
  const match = colorClass.match(/^(bg|text|border|ring|fill|stroke|outline|divide|from|via|to|shadow|decoration)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(\d+)$/);

  if (!match) return null;

  const [, prefix, color, shade] = match;
  const shadeNum = parseInt(shade, 10);

  // Determine semantic color based on hue family
  let semantic;
  switch (color) {
    case 'green':
    case 'emerald':
    case 'teal':
    case 'lime':
      semantic = 'success';
      break;
    case 'red':
    case 'rose':
      semantic = 'destructive';
      break;
    case 'yellow':
    case 'amber':
    case 'orange':
      semantic = 'warning';
      break;
    case 'blue':
      semantic = 'primary';
      break;
    case 'cyan':
    case 'sky':
      semantic = 'info';
      break;
    case 'purple':
    case 'violet':
    case 'indigo':
    case 'fuchsia':
    case 'pink':
      semantic = 'accent';
      break;
    case 'slate':
    case 'gray':
    case 'zinc':
    case 'neutral':
    case 'stone':
      // Neutrals depend on shade
      if (shadeNum <= 200) return `${prefix}-muted`;
      if (shadeNum >= 700) return `${prefix}-foreground`;
      return `${prefix}-muted-foreground`;
    default:
      return null;
  }

  // Determine opacity based on shade
  if (shadeNum <= 100) return `${prefix}-${semantic}/10`;
  if (shadeNum <= 200) return `${prefix}-${semantic}/20`;
  if (shadeNum <= 300) return `${prefix}-${semantic}/30`;
  if (shadeNum <= 400) return `${prefix}-${semantic}/70`;
  // 500-900 → full semantic color
  return `${prefix}-${semantic}`;
}

/**
 * Create a theme backup before rebuild
 * @param {string} projectDir - Project root directory
 * @param {string} newThemeId - ID of new theme being applied
 * @returns {Object} { success, backupId, backupPath, error }
 */
export function createThemeBackup(projectDir, newThemeId = 'unknown') {
  const designDir = join(projectDir, '.omgkit', 'design');
  const backupsDir = join(designDir, 'backups');

  // Create backups directory
  mkdirSync(backupsDir, { recursive: true });

  // Generate backup ID
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const backupId = `${timestamp}-${newThemeId}`;
  const backupPath = join(backupsDir, backupId);

  try {
    mkdirSync(backupPath, { recursive: true });

    // Get current theme
    const currentTheme = getProjectTheme(projectDir);
    const previousThemeId = currentTheme?.id || 'none';

    // Create manifest
    const manifest = {
      id: backupId,
      previousTheme: previousThemeId,
      newTheme: newThemeId,
      timestamp: now.toISOString(),
      changedFiles: []
    };

    // Backup theme.json if exists
    const themeJsonPath = join(designDir, 'theme.json');
    if (existsSync(themeJsonPath)) {
      const content = readFileSync(themeJsonPath, 'utf8');
      writeFileSync(join(backupPath, 'theme.json.bak'), content);
      manifest.changedFiles.push({ path: '.omgkit/design/theme.json', backup: 'theme.json.bak' });
    }

    // Backup theme.css if exists
    const themeCssPath = join(designDir, 'theme.css');
    if (existsSync(themeCssPath)) {
      const content = readFileSync(themeCssPath, 'utf8');
      writeFileSync(join(backupPath, 'theme.css.bak'), content);
      manifest.changedFiles.push({ path: '.omgkit/design/theme.css', backup: 'theme.css.bak' });
    }

    // Backup tailwind.config.ts if exists
    const tailwindConfigPath = join(projectDir, 'tailwind.config.ts');
    if (existsSync(tailwindConfigPath)) {
      const content = readFileSync(tailwindConfigPath, 'utf8');
      writeFileSync(join(backupPath, 'tailwind.config.ts.bak'), content);
      manifest.changedFiles.push({ path: 'tailwind.config.ts', backup: 'tailwind.config.ts.bak' });
    }

    // Also check for .js version
    const tailwindConfigJsPath = join(projectDir, 'tailwind.config.js');
    if (existsSync(tailwindConfigJsPath)) {
      const content = readFileSync(tailwindConfigJsPath, 'utf8');
      writeFileSync(join(backupPath, 'tailwind.config.js.bak'), content);
      manifest.changedFiles.push({ path: 'tailwind.config.js', backup: 'tailwind.config.js.bak' });
    }

    // Write manifest
    writeFileSync(join(backupPath, 'manifest.json'), JSON.stringify(manifest, null, 2));

    return { success: true, backupId, backupPath, manifest };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * List available theme backups
 * @param {string} projectDir - Project root directory
 * @returns {Array} Array of backup info objects
 */
export function listThemeBackups(projectDir) {
  const backupsDir = join(projectDir, '.omgkit', 'design', 'backups');
  if (!existsSync(backupsDir)) return [];

  const backups = [];
  const entries = readdirSync(backupsDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const manifestPath = join(backupsDir, entry.name, 'manifest.json');
    if (!existsSync(manifestPath)) continue;

    try {
      const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
      backups.push({
        id: manifest.id,
        previousTheme: manifest.previousTheme,
        newTheme: manifest.newTheme,
        timestamp: manifest.timestamp,
        date: new Date(manifest.timestamp).toLocaleString(),
        filesChanged: manifest.changedFiles.length,
        path: join(backupsDir, entry.name)
      });
    } catch {
      // Skip invalid backup
    }
  }

  // Sort by timestamp descending (newest first)
  return backups.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

/**
 * Rollback to a previous theme state
 * @param {string} projectDir - Project root directory
 * @param {string} backupId - Backup ID to restore (optional, defaults to latest)
 * @returns {Object} { success, restoredTheme, restoredFiles, error }
 */
export function rollbackTheme(projectDir, backupId = null) {
  const backups = listThemeBackups(projectDir);

  if (backups.length === 0) {
    return { success: false, error: 'No theme backups found' };
  }

  // Find backup to restore
  let backup;
  if (backupId) {
    backup = backups.find(b => b.id === backupId);
    if (!backup) {
      return { success: false, error: `Backup not found: ${backupId}` };
    }
  } else {
    backup = backups[0]; // Latest
  }

  try {
    const manifestPath = join(backup.path, 'manifest.json');
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    const restoredFiles = [];

    // Create a new backup before rollback (safety)
    createThemeBackup(projectDir, `rollback-from-${manifest.newTheme}`);

    // Restore each file
    for (const file of manifest.changedFiles) {
      const backupFilePath = join(backup.path, file.backup);
      const targetPath = join(projectDir, file.path);

      if (existsSync(backupFilePath)) {
        const content = readFileSync(backupFilePath, 'utf8');
        mkdirSync(dirname(targetPath), { recursive: true });
        writeFileSync(targetPath, content);
        restoredFiles.push(file.path);
      }
    }

    return {
      success: true,
      restoredTheme: manifest.previousTheme,
      restoredFiles,
      backupUsed: backup.id
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Update file replacing hardcoded colors with theme variables
 * @param {string} filePath - File to update
 * @param {string} projectDir - Project root directory
 * @param {Object} options - { fullMode: boolean }
 * @returns {Object} { changed, replacements, content }
 */
export function updateFileColors(filePath, projectDir, options = {}) {
  const { fullMode = false } = options;
  const colorMap = fullMode ? FULL_THEME_VAR_MAP : THEME_VAR_MAP;

  const fullPath = join(projectDir, filePath);
  if (!existsSync(fullPath)) {
    return { changed: false, replacements: [], error: 'File not found' };
  }

  let content = readFileSync(fullPath, 'utf8');
  const replacements = [];
  let changed = false;

  // Check if this is a test file (for special handling)
  const isTestFile = filePath.includes('test') ||
                     filePath.includes('spec') ||
                     filePath.includes('__tests__');

  // Apply theme variable mappings
  for (const [pattern, replacement] of Object.entries(colorMap)) {
    // Escape special regex characters in pattern
    const escapedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedPattern}\\b`, 'g');

    const matches = content.match(regex);
    if (matches && matches.length > 0) {
      if (isTestFile) {
        // For test files, only replace in non-assertion lines
        const lines = content.split('\n');
        let modifiedContent = '';
        let totalReplaced = 0;

        for (const line of lines) {
          if (line.includes('expect(') ||
              line.includes('toBe(') ||
              line.includes('toEqual(') ||
              line.includes('toContain(') ||
              line.includes('toMatch(') ||
              line.includes('toHaveClass(')) {
            // Don't modify test assertions
            modifiedContent += line + '\n';
          } else {
            const lineMatches = line.match(regex);
            if (lineMatches) {
              totalReplaced += lineMatches.length;
            }
            modifiedContent += line.replace(regex, replacement) + '\n';
          }
        }

        if (totalReplaced > 0) {
          content = modifiedContent.slice(0, -1); // Remove trailing newline
          replacements.push({
            from: pattern,
            to: replacement,
            count: totalReplaced
          });
          changed = true;
        }
      } else {
        content = content.replace(regex, replacement);
        replacements.push({
          from: pattern,
          to: replacement,
          count: matches.length
        });
        changed = true;
      }
    }
  }

  // In FULL mode, also apply dynamic mappings for unmapped colors
  if (fullMode) {
    const tailwindPattern = new RegExp(COLOR_PATTERNS.tailwindDefaults.source, 'g');
    let match;
    const dynamicReplacements = new Map();

    // First pass: find all unmapped colors
    while ((match = tailwindPattern.exec(content)) !== null) {
      const colorClass = match[0];
      if (!colorMap[colorClass] && !dynamicReplacements.has(colorClass)) {
        const dynamicMapping = getDynamicColorMapping(colorClass);
        if (dynamicMapping) {
          dynamicReplacements.set(colorClass, dynamicMapping);
        }
      }
    }

    // Second pass: apply dynamic replacements
    for (const [colorClass, replacement] of dynamicReplacements) {
      const escapedPattern = colorClass.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedPattern}\\b`, 'g');

      if (isTestFile) {
        // Handle test files specially
        const lines = content.split('\n');
        let modifiedContent = '';
        let totalReplaced = 0;

        for (const line of lines) {
          if (line.includes('expect(') ||
              line.includes('toBe(') ||
              line.includes('toEqual(')) {
            modifiedContent += line + '\n';
          } else {
            const lineMatches = line.match(regex);
            if (lineMatches) {
              totalReplaced += lineMatches.length;
            }
            modifiedContent += line.replace(regex, replacement) + '\n';
          }
        }

        if (totalReplaced > 0) {
          content = modifiedContent.slice(0, -1);
          replacements.push({
            from: colorClass,
            to: replacement,
            count: totalReplaced,
            dynamic: true
          });
          changed = true;
        }
      } else {
        const matches = content.match(regex);
        if (matches && matches.length > 0) {
          content = content.replace(regex, replacement);
          replacements.push({
            from: colorClass,
            to: replacement,
            count: matches.length,
            dynamic: true
          });
          changed = true;
        }
      }
    }
  }

  return { changed, replacements, content };
}

/**
 * Update project's tailwind.config file with new theme
 * @param {Object} theme - Theme object
 * @param {string} projectDir - Project root directory
 * @returns {Object} { success, path, error }
 */
export function updateProjectTailwindConfig(theme, projectDir) {
  // Check for tailwind.config.ts first, then .js
  let configPath = join(projectDir, 'tailwind.config.ts');
  let isTs = true;

  if (!existsSync(configPath)) {
    configPath = join(projectDir, 'tailwind.config.js');
    isTs = false;
    if (!existsSync(configPath)) {
      // Create new config
      configPath = join(projectDir, 'tailwind.config.ts');
      isTs = true;
    }
  }

  try {
    const newConfig = generateTailwindConfig(theme);
    writeFileSync(configPath, newConfig);
    return { success: true, path: configPath, isTs };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Ensure globals.css imports theme.css
 * @param {string} projectDir - Project root directory
 * @returns {Object} { updated, path, alreadyImported }
 */
export function ensureThemeImport(projectDir) {
  // Look for globals.css in common locations
  const possiblePaths = [
    join(projectDir, 'app', 'globals.css'),
    join(projectDir, 'src', 'app', 'globals.css'),
    join(projectDir, 'styles', 'globals.css'),
    join(projectDir, 'src', 'styles', 'globals.css')
  ];

  let globalsPath = null;
  for (const p of possiblePaths) {
    if (existsSync(p)) {
      globalsPath = p;
      break;
    }
  }

  if (!globalsPath) {
    return { updated: false, path: null, error: 'globals.css not found' };
  }

  let content = readFileSync(globalsPath, 'utf8');
  const themeImport = "@import '../.omgkit/design/theme.css';";
  const altThemeImport = "@import '../../.omgkit/design/theme.css';";

  // Check if already imported
  if (content.includes('.omgkit/design/theme.css')) {
    return { updated: false, path: globalsPath, alreadyImported: true };
  }

  // Add import at the beginning
  const relativePath = globalsPath.includes('/src/') ? altThemeImport : themeImport;
  content = `${relativePath}\n${content}`;

  writeFileSync(globalsPath, content);
  return { updated: true, path: globalsPath, alreadyImported: false };
}

/**
 * Rebuild entire project with a new theme
 * @param {string} projectDir - Project root directory
 * @param {string} themeId - New theme ID
 * @param {Object} options - { dryRun, force, fixColors, fullMode }
 * @returns {Object} { success, backupPath, changedFiles, warnings, error }
 */
export function rebuildProjectTheme(projectDir, themeId, options = {}) {
  const { dryRun = false, force = false, fixColors = true, fullMode = false } = options;

  // Validate project has .omgkit
  if (!existsSync(join(projectDir, '.omgkit'))) {
    return { success: false, error: 'Not an OMGKIT project. Run: omgkit init' };
  }

  // Get new theme
  const newTheme = getThemeById(themeId);
  if (!newTheme) {
    return { success: false, error: `Theme not found: ${themeId}. Run /design:themes to see available themes.` };
  }

  // Validate theme
  const validation = validateTheme(newTheme);
  if (!validation.valid) {
    return { success: false, error: `Invalid theme: ${validation.errors.join(', ')}` };
  }

  const result = {
    success: true,
    newTheme: themeId,
    backupId: null,
    backupPath: null,
    changedFiles: [],
    fixedColors: [],
    warnings: [],
    dryRun,
    fullMode
  };

  // Step 1: Create backup (unless dry-run)
  if (!dryRun) {
    const backup = createThemeBackup(projectDir, themeId);
    if (!backup.success) {
      return { success: false, error: `Failed to create backup: ${backup.error}` };
    }
    result.backupId = backup.backupId;
    result.backupPath = backup.backupPath;
  }

  // Step 2: Apply new theme
  if (!dryRun) {
    const applied = applyThemeToProject(newTheme, projectDir);
    result.changedFiles.push(applied.themeJson.replace(projectDir + '/', ''));
    result.changedFiles.push(applied.themeCss.replace(projectDir + '/', ''));
  } else {
    result.changedFiles.push('.omgkit/design/theme.json');
    result.changedFiles.push('.omgkit/design/theme.css');
  }

  // Step 3: Update tailwind config
  if (!dryRun) {
    const tailwindResult = updateProjectTailwindConfig(newTheme, projectDir);
    if (tailwindResult.success) {
      result.changedFiles.push(tailwindResult.path.replace(projectDir + '/', ''));
    }
  } else {
    result.changedFiles.push('tailwind.config.ts');
  }

  // Step 4: Ensure theme import in globals.css
  if (!dryRun) {
    const importResult = ensureThemeImport(projectDir);
    if (importResult.updated) {
      result.changedFiles.push(importResult.path.replace(projectDir + '/', ''));
    }
  }

  // Step 5: Scan and fix colors (if enabled)
  if (fixColors) {
    const scanResult = scanProjectColors(projectDir, { fullMode });

    for (const fileInfo of scanResult.files) {
      const fixableMatches = fileInfo.matches.filter(m => m.fixable);

      if (fixableMatches.length > 0) {
        if (!dryRun) {
          const updateResult = updateFileColors(fileInfo.path, projectDir, { fullMode });
          if (updateResult.changed) {
            // Write updated content
            writeFileSync(join(projectDir, fileInfo.path), updateResult.content);
            result.changedFiles.push(fileInfo.path);
            result.fixedColors.push({
              file: fileInfo.path,
              replacements: updateResult.replacements
            });
          }
        } else {
          // Dry run - just report what would be changed
          result.fixedColors.push({
            file: fileInfo.path,
            replacements: fixableMatches.map(m => ({ from: m.match, to: m.suggestion }))
          });
        }
      }

      // Add warnings for unfixable colors (in standard mode)
      // In FULL mode, fewer warnings since more colors are mapped
      if (!fullMode) {
        const unfixable = fileInfo.matches.filter(m => !m.fixable);
        for (const u of unfixable) {
          result.warnings.push(`${u.file}:${u.line} - ${u.match} (manual review needed)`);
        }
      }
    }
  }

  return result;
}
