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

// ============================================================================
// THEME REBUILD & ROLLBACK FUNCTIONS
// ============================================================================

/**
 * Directories to scan for color references (standard React/Next.js paths)
 */
export const SCAN_DIRECTORIES = ['app', 'components', 'src', 'pages'];

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
 * @returns {Object} { files: [], totalReferences: number, nonCompliant: [], compliant: number }
 */
export function scanProjectColors(projectDir) {
  const result = {
    files: [],
    totalReferences: 0,
    nonCompliant: [],
    compliant: 0,
    scannedFiles: 0
  };

  // Find all files to scan
  const filesToScan = [];
  for (const scanDir of SCAN_DIRECTORIES) {
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

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineNum = i + 1;

        // Check for Tailwind default colors
        let match;
        const pattern = new RegExp(COLOR_PATTERNS.tailwindDefaults.source, 'g');
        while ((match = pattern.exec(line)) !== null) {
          result.totalReferences++;
          const fullMatch = match[0];

          // Check if this has a theme-compliant mapping
          const mapping = THEME_VAR_MAP[fullMatch];
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
          } else {
            // Unmapped color - warn only
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
 * @returns {Object} { changed, replacements, content }
 */
export function updateFileColors(filePath, projectDir) {
  const fullPath = join(projectDir, filePath);
  if (!existsSync(fullPath)) {
    return { changed: false, replacements: [], error: 'File not found' };
  }

  let content = readFileSync(fullPath, 'utf8');
  const replacements = [];
  let changed = false;

  // Apply theme variable mappings
  for (const [pattern, replacement] of Object.entries(THEME_VAR_MAP)) {
    // Escape special regex characters in pattern
    const escapedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedPattern}\\b`, 'g');

    const matches = content.match(regex);
    if (matches && matches.length > 0) {
      content = content.replace(regex, replacement);
      replacements.push({
        from: pattern,
        to: replacement,
        count: matches.length
      });
      changed = true;
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
 * @param {Object} options - { dryRun, force, fixColors }
 * @returns {Object} { success, backupPath, changedFiles, warnings, error }
 */
export function rebuildProjectTheme(projectDir, themeId, options = {}) {
  const { dryRun = false, force = false, fixColors = true } = options;

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
    dryRun
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
    const scanResult = scanProjectColors(projectDir);

    for (const fileInfo of scanResult.files) {
      const fixableMatches = fileInfo.matches.filter(m => m.fixable);

      if (fixableMatches.length > 0) {
        if (!dryRun) {
          const updateResult = updateFileColors(fileInfo.path, projectDir);
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

      // Add warnings for unfixable colors
      const unfixable = fileInfo.matches.filter(m => !m.fixable);
      for (const u of unfixable) {
        result.warnings.push(`${u.file}:${u.line} - ${u.match} (manual review needed)`);
      }
    }
  }

  return result;
}
