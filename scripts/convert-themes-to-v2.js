#!/usr/bin/env node
/**
 * Convert V1 themes to V2 format
 *
 * This script converts all V1 themes to V2 schema with:
 * - 12-step color scales (Radix-compatible)
 * - Alpha variants
 * - Semantic tokens with $ref
 * - Status colors
 * - Effects (glassMorphism, glow, gradients)
 * - Animations
 * - Backward-compatible colors block
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const THEMES_DIR = join(__dirname, '../templates/design/themes');

// Color name mapping based on hue ranges
const COLOR_NAMES = [
  { min: 0, max: 15, name: 'red' },
  { min: 15, max: 45, name: 'orange' },
  { min: 45, max: 65, name: 'amber' },
  { min: 65, max: 85, name: 'yellow' },
  { min: 85, max: 105, name: 'lime' },
  { min: 105, max: 135, name: 'green' },
  { min: 135, max: 165, name: 'emerald' },
  { min: 165, max: 185, name: 'teal' },
  { min: 185, max: 205, name: 'cyan' },
  { min: 205, max: 225, name: 'sky' },
  { min: 225, max: 250, name: 'blue' },
  { min: 250, max: 270, name: 'indigo' },
  { min: 270, max: 290, name: 'violet' },
  { min: 290, max: 310, name: 'purple' },
  { min: 310, max: 335, name: 'fuchsia' },
  { min: 335, max: 350, name: 'pink' },
  { min: 350, max: 360, name: 'rose' }
];

/**
 * Parse HSL string to components
 */
function parseHSL(hslString) {
  const parts = hslString.split(/\s+/);
  return {
    h: parseFloat(parts[0]),
    s: parseFloat(parts[1]),
    l: parseFloat(parts[2])
  };
}

/**
 * Get color name from hue
 */
function getColorName(hue) {
  hue = hue % 360;
  for (const range of COLOR_NAMES) {
    if (hue >= range.min && hue < range.max) {
      return range.name;
    }
  }
  return 'blue';
}

/**
 * Generate 12-step color scale for light mode
 */
function generateLightScale(hue, baseSat) {
  const satRange = { low: Math.max(30, baseSat - 30), high: Math.min(100, baseSat + 5) };
  return {
    "1": `${hue} ${satRange.low}% 99%`,
    "2": `${hue} ${satRange.low + 5}% 97%`,
    "3": `${hue} ${satRange.low + 10}% 93%`,
    "4": `${hue} ${satRange.low + 15}% 88%`,
    "5": `${hue} ${satRange.low + 20}% 82%`,
    "6": `${hue} ${satRange.low + 25}% 74%`,
    "7": `${hue} ${satRange.low + 30}% 62%`,
    "8": `${hue} ${satRange.high - 10}% 50%`,
    "9": `${hue} ${satRange.high}% 45%`,
    "10": `${hue} ${satRange.high}% 40%`,
    "11": `${hue} ${satRange.high}% 32%`,
    "12": `${hue} ${satRange.high + 5}% 18%`
  };
}

/**
 * Generate 12-step color scale for dark mode
 */
function generateDarkScale(hue, baseSat) {
  const satRange = { low: Math.max(25, baseSat - 40), high: Math.min(100, baseSat) };
  return {
    "1": `${hue} ${satRange.low}% 7%`,
    "2": `${hue} ${satRange.low + 5}% 10%`,
    "3": `${hue} ${satRange.low + 10}% 14%`,
    "4": `${hue} ${satRange.low + 15}% 18%`,
    "5": `${hue} ${satRange.low + 20}% 22%`,
    "6": `${hue} ${satRange.low + 25}% 28%`,
    "7": `${hue} ${satRange.low + 30}% 35%`,
    "8": `${hue} ${satRange.high - 20}% 42%`,
    "9": `${hue} ${satRange.high}% 45%`,
    "10": `${hue} ${satRange.high - 5}% 52%`,
    "11": `${hue} ${satRange.high - 15}% 65%`,
    "12": `${hue} ${satRange.high - 25}% 80%`
  };
}

/**
 * Generate alpha variants
 */
function generateAlphaScale(hue, sat, lightness) {
  const base = `${hue} ${sat}% ${lightness}%`;
  return {
    "1": `${base} / 0.05`,
    "2": `${base} / 0.1`,
    "3": `${base} / 0.15`,
    "4": `${base} / 0.2`,
    "5": `${base} / 0.3`,
    "6": `${base} / 0.4`,
    "7": `${base} / 0.5`,
    "8": `${base} / 0.6`,
    "9": `${base} / 0.7`,
    "10": `${base} / 0.8`,
    "11": `${base} / 0.9`,
    "12": `${base} / 0.95`
  };
}

/**
 * Generate neutral scale based on foreground color
 */
function generateNeutralScale(fgHue) {
  const hue = Math.round(fgHue) || 220;
  return {
    name: hue > 200 && hue < 240 ? 'slate' : 'gray',
    hue: hue,
    steps: {
      light: {
        "1": `${hue - 10} 40% 99%`,
        "2": `${hue - 10} 40% 98%`,
        "3": `${hue - 10} 35% 96%`,
        "4": `${hue - 10} 30% 94%`,
        "5": `${hue - 10} 25% 91%`,
        "6": `${hue - 10} 20% 86%`,
        "7": `${hue - 10} 18% 78%`,
        "8": `${hue - 10} 16% 65%`,
        "9": `${hue - 10} 14% 50%`,
        "10": `${hue - 10} 12% 40%`,
        "11": `${hue} 47% 11%`,
        "12": `${hue} 84% 5%`
      },
      dark: {
        "1": `${hue} 84% 5%`,
        "2": `${hue} 50% 8%`,
        "3": `${hue - 5} 33% 17%`,
        "4": `${hue - 5} 30% 22%`,
        "5": `${hue - 5} 28% 28%`,
        "6": `${hue - 5} 26% 35%`,
        "7": `${hue - 5} 22% 45%`,
        "8": `${hue - 5} 20% 55%`,
        "9": `${hue - 7} 20% 65%`,
        "10": `${hue - 7} 18% 75%`,
        "11": `${hue - 10} 35% 88%`,
        "12": `${hue - 10} 40% 98%`
      }
    }
  };
}

/**
 * Convert V1 theme to V2 format
 */
function convertToV2(v1Theme) {
  // Extract primary color info
  const primaryHSL = parseHSL(v1Theme.colors.light.primary);
  const foregroundHSL = parseHSL(v1Theme.colors.light.foreground);

  const primaryHue = Math.round(primaryHSL.h);
  const primarySat = Math.round(primaryHSL.s);
  const primaryColorName = getColorName(primaryHue);

  // Generate scales
  const primaryScale = {
    name: primaryColorName,
    hue: primaryHue,
    saturation: {
      light: { low: Math.max(30, primarySat - 30), high: Math.min(100, primarySat + 5) },
      dark: { low: Math.max(25, primarySat - 40), high: primarySat }
    },
    steps: {
      light: generateLightScale(primaryHue, primarySat),
      dark: generateDarkScale(primaryHue, primarySat)
    },
    alpha: {
      light: generateAlphaScale(primaryHue, primarySat, 45),
      dark: generateAlphaScale(primaryHue, primarySat, 50)
    }
  };

  const neutralScale = generateNeutralScale(foregroundHSL.h);

  // Build V2 theme
  const v2Theme = {
    version: "2.0",
    name: v1Theme.name,
    id: v1Theme.id,
    category: v1Theme.category,
    description: v1Theme.description + " - featuring 12-step color scales, effects, and animations",

    colorSystem: {
      type: "radix",
      version: "3.0"
    },

    scales: {
      primary: primaryScale,
      neutral: neutralScale
    },

    semanticTokens: {
      light: {
        background: "0 0% 100%",
        foreground: { "$ref": "scales.neutral.steps.light.12" },
        surface: { "$ref": "scales.neutral.steps.light.2" },
        "surface-hover": { "$ref": "scales.neutral.steps.light.3" },
        "surface-active": { "$ref": "scales.neutral.steps.light.4" },
        primary: { "$ref": "scales.primary.steps.light.9" },
        "primary-hover": { "$ref": "scales.primary.steps.light.10" },
        "primary-foreground": "210 40% 98%",
        secondary: { "$ref": "scales.neutral.steps.light.3" },
        "secondary-hover": { "$ref": "scales.neutral.steps.light.4" },
        "secondary-foreground": { "$ref": "scales.neutral.steps.light.11" },
        muted: { "$ref": "scales.neutral.steps.light.3" },
        "muted-foreground": { "$ref": "scales.neutral.steps.light.9" },
        accent: { "$ref": "scales.neutral.steps.light.3" },
        "accent-hover": { "$ref": "scales.neutral.steps.light.4" },
        "accent-foreground": { "$ref": "scales.neutral.steps.light.11" },
        border: { "$ref": "scales.neutral.steps.light.5" },
        "border-hover": { "$ref": "scales.neutral.steps.light.6" },
        input: { "$ref": "scales.neutral.steps.light.5" },
        "input-hover": { "$ref": "scales.neutral.steps.light.6" },
        ring: { "$ref": "scales.primary.steps.light.9" },
        "ring-offset": "0 0% 100%",
        card: "0 0% 100%",
        "card-foreground": { "$ref": "scales.neutral.steps.light.12" },
        popover: "0 0% 100%",
        "popover-foreground": { "$ref": "scales.neutral.steps.light.12" },
        panel: { "$ref": "scales.neutral.steps.light.2" },
        "panel-translucent": "0 0% 100% / 0.9",
        overlay: "0 0% 0% / 0.4"
      },
      dark: {
        background: { "$ref": "scales.neutral.steps.dark.1" },
        foreground: { "$ref": "scales.neutral.steps.dark.12" },
        surface: { "$ref": "scales.neutral.steps.dark.2" },
        "surface-hover": { "$ref": "scales.neutral.steps.dark.3" },
        "surface-active": { "$ref": "scales.neutral.steps.dark.4" },
        primary: { "$ref": "scales.primary.steps.dark.9" },
        "primary-hover": { "$ref": "scales.primary.steps.dark.10" },
        "primary-foreground": { "$ref": "scales.neutral.steps.dark.1" },
        secondary: { "$ref": "scales.neutral.steps.dark.3" },
        "secondary-hover": { "$ref": "scales.neutral.steps.dark.4" },
        "secondary-foreground": { "$ref": "scales.neutral.steps.dark.12" },
        muted: { "$ref": "scales.neutral.steps.dark.3" },
        "muted-foreground": { "$ref": "scales.neutral.steps.dark.9" },
        accent: { "$ref": "scales.neutral.steps.dark.3" },
        "accent-hover": { "$ref": "scales.neutral.steps.dark.4" },
        "accent-foreground": { "$ref": "scales.neutral.steps.dark.12" },
        border: { "$ref": "scales.neutral.steps.dark.3" },
        "border-hover": { "$ref": "scales.neutral.steps.dark.4" },
        input: { "$ref": "scales.neutral.steps.dark.3" },
        "input-hover": { "$ref": "scales.neutral.steps.dark.4" },
        ring: { "$ref": "scales.primary.steps.dark.9" },
        "ring-offset": { "$ref": "scales.neutral.steps.dark.1" },
        card: { "$ref": "scales.neutral.steps.dark.1" },
        "card-foreground": { "$ref": "scales.neutral.steps.dark.12" },
        popover: { "$ref": "scales.neutral.steps.dark.1" },
        "popover-foreground": { "$ref": "scales.neutral.steps.dark.12" },
        panel: { "$ref": "scales.neutral.steps.dark.2" },
        "panel-translucent": `${neutralScale.hue} 84% 5% / 0.9`,
        overlay: "0 0% 0% / 0.6"
      }
    },

    statusColors: {
      light: {
        destructive: "0 84% 60%",
        "destructive-foreground": "0 0% 98%",
        success: "151 55% 42%",
        "success-foreground": "0 0% 100%",
        warning: "39 100% 50%",
        "warning-foreground": "39 40% 15%",
        info: "206 100% 50%",
        "info-foreground": "0 0% 100%"
      },
      dark: {
        destructive: "0 63% 31%",
        "destructive-foreground": "0 0% 98%",
        success: "151 50% 45%",
        "success-foreground": "0 0% 100%",
        warning: "39 90% 55%",
        "warning-foreground": "39 80% 10%",
        info: "206 90% 55%",
        "info-foreground": "0 0% 100%"
      }
    },

    chartColors: {
      "1": { "$ref": "scales.primary.steps.light.9" },
      "2": "262 83% 58%",
      "3": "25 95% 53%",
      "4": "142 76% 36%",
      "5": "347 77% 50%"
    },

    sidebarTokens: {
      light: {
        background: "0 0% 98%",
        foreground: { "$ref": "scales.neutral.steps.light.9" },
        primary: { "$ref": "scales.primary.steps.light.9" },
        "primary-foreground": "0 0% 98%",
        accent: { "$ref": "scales.neutral.steps.light.3" },
        "accent-foreground": { "$ref": "scales.neutral.steps.light.11" },
        border: { "$ref": "scales.neutral.steps.light.5" },
        ring: { "$ref": "scales.primary.steps.light.9" }
      },
      dark: {
        background: { "$ref": "scales.neutral.steps.dark.1" },
        foreground: { "$ref": "scales.neutral.steps.dark.12" },
        primary: { "$ref": "scales.primary.steps.dark.9" },
        "primary-foreground": "0 0% 100%",
        accent: { "$ref": "scales.neutral.steps.dark.3" },
        "accent-foreground": { "$ref": "scales.neutral.steps.dark.12" },
        border: { "$ref": "scales.neutral.steps.dark.3" },
        ring: { "$ref": "scales.primary.steps.dark.9" }
      }
    },

    typography: {
      fontFamily: v1Theme.fontFamily || {
        sans: "Inter, system-ui, sans-serif",
        mono: "JetBrains Mono, monospace"
      },
      fontFeatureSettings: "\"rlig\" 1, \"calt\" 1"
    },

    spacing: {
      radius: v1Theme.radius || "0.5rem",
      radiusLg: "var(--radius)",
      radiusMd: "calc(var(--radius) - 2px)",
      radiusSm: "calc(var(--radius) - 4px)"
    },

    effects: {
      glassMorphism: {
        background: { "$ref": "scales.neutral.steps.light.1" },
        backdropBlur: "12px"
      },
      glow: {
        default: "0 0 20px",
        lg: "0 0 40px",
        color: { "$ref": "scales.primary.steps.light.9" }
      },
      gradient: {
        primary: {
          from: { "$ref": "scales.primary.steps.light.9" },
          to: { "$ref": "scales.primary.steps.light.11" },
          direction: "135deg"
        },
        surface: {
          from: "0 0% 100%",
          to: { "$ref": "scales.neutral.steps.light.2" },
          direction: "180deg"
        }
      }
    },

    animations: {
      shimmer: {
        duration: "8s",
        easing: "ease-in-out",
        iteration: "infinite",
        keyframes: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        }
      },
      "pulse-glow": {
        duration: "2s",
        easing: "ease-in-out",
        iteration: "infinite",
        keyframes: {
          "0%, 100%": { boxShadow: `0 0 20px hsl(${primaryHue} ${primarySat}% 45% / 0.3)` },
          "50%": { boxShadow: `0 0 40px hsl(${primaryHue} ${primarySat}% 45% / 0.6)` }
        }
      },
      "fade-in": {
        duration: "0.3s",
        easing: "ease-out",
        keyframes: {
          from: { opacity: "0" },
          to: { opacity: "1" }
        }
      },
      "slide-up": {
        duration: "0.4s",
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        keyframes: {
          from: { transform: "translateY(10px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" }
        }
      }
    },

    // Backward compatible colors block
    colors: v1Theme.colors,
    radius: v1Theme.radius || "0.5rem",
    fontFamily: v1Theme.fontFamily || {
      sans: "Inter, system-ui, sans-serif",
      mono: "JetBrains Mono, monospace"
    }
  };

  return v2Theme;
}

/**
 * Main execution
 */
function main() {
  console.log('V1 to V2 Theme Migration\n========================\n');

  const categories = readdirSync(THEMES_DIR).filter(f => {
    const fullPath = join(THEMES_DIR, f);
    return existsSync(fullPath) && readdirSync(fullPath).some(file => file.endsWith('.json'));
  });

  let converted = 0;
  let skipped = 0;

  for (const category of categories) {
    const categoryDir = join(THEMES_DIR, category);
    const files = readdirSync(categoryDir).filter(f => f.endsWith('.json'));

    console.log(`\n📁 ${category}/`);

    for (const file of files) {
      const filePath = join(categoryDir, file);
      const theme = JSON.parse(readFileSync(filePath, 'utf8'));

      // Skip if already V2
      if (theme.version === '2.0' && !file.includes('-v2')) {
        console.log(`  ⏭️  ${file} (already V2)`);
        skipped++;
        continue;
      }

      // Special case: electric-cyan-v2 -> electric-cyan
      if (file === 'electric-cyan-v2.json') {
        const v2Theme = { ...theme };
        v2Theme.id = 'electric-cyan';
        v2Theme.name = 'Electric Cyan';
        v2Theme.description = v2Theme.description.replace(' V2', '');

        const newPath = join(categoryDir, 'electric-cyan.json');
        writeFileSync(newPath, JSON.stringify(v2Theme, null, 2) + '\n');
        unlinkSync(filePath);
        console.log(`  ✅ electric-cyan-v2.json → electric-cyan.json`);
        converted++;
        continue;
      }

      // Convert V1 to V2
      if (!theme.version) {
        const v2Theme = convertToV2(theme);
        writeFileSync(filePath, JSON.stringify(v2Theme, null, 2) + '\n');
        console.log(`  ✅ ${file} converted to V2`);
        converted++;
      }
    }
  }

  console.log(`\n========================`);
  console.log(`✅ Converted: ${converted} themes`);
  console.log(`⏭️  Skipped: ${skipped} themes`);
  console.log(`\nAll themes are now V2 format!`);
}

main();
