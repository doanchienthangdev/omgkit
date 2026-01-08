/**
 * OMGKIT Theme Processing Library
 * Handles theme loading, validation, CSS generation, and extraction
 *
 * @module lib/theme
 */

import { existsSync, readFileSync, writeFileSync, readdirSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

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
 * Generate CSS variables from theme
 * @param {Object} theme - Theme object
 * @returns {string} CSS content with variables
 */
export function generateThemeCSS(theme) {
  const generateColorVars = (colors) => {
    let css = '';
    for (const [key, value] of Object.entries(colors)) {
      css += `  --${key}: ${value};\n`;
    }
    return css;
  };

  const lightVars = generateColorVars(theme.colors.light);
  const darkVars = generateColorVars(theme.colors.dark);

  return `/* OMGKIT Theme: ${theme.name} */
/* Theme ID: ${theme.id} */
/* Category: ${theme.category} */
/* Generated by OMGKIT Design System */

@layer base {
  :root {
${lightVars}  --radius: ${theme.radius || '0.5rem'};
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
