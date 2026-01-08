/**
 * Tailwind CSS Config Generator
 * Generates Tailwind configuration with v2 features
 *
 * @module lib/generators/tailwind
 */

import { detectThemeVersion, isV2Theme } from '../theme.js';
import { processTheme, expandColorScales } from '../theme-v2.js';

/**
 * Generate Tailwind v2 config from theme
 * @param {Object} theme - Theme object (v1 or v2)
 * @param {Object} options - Generation options
 * @param {string} options.format - 'ts' or 'js' (default: 'ts')
 * @param {boolean} options.includeColorScales - Include 12-step scales (default: true)
 * @param {boolean} options.includeAnimations - Include animation config (default: true)
 * @param {string[]} options.contentPaths - Content paths (default: standard Next.js paths)
 * @returns {string} Tailwind config content
 */
export function generateTailwindV2(theme, options = {}) {
  const {
    format = 'ts',
    includeColorScales = true,
    includeAnimations = true,
    contentPaths = [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
      './src/**/*.{js,ts,jsx,tsx,mdx}'
    ]
  } = options;

  const version = detectThemeVersion(theme);
  const isV2 = version === '2.0';

  // Font families
  const fontSans = theme.typography?.fontFamily?.sans ||
                   theme.fontFamily?.sans ||
                   'Inter, system-ui, sans-serif';
  const fontMono = theme.typography?.fontFamily?.mono ||
                   theme.fontFamily?.mono ||
                   'JetBrains Mono, monospace';

  // Build colors object
  let colorsConfig = buildBaseColors();

  // Add color scales for v2 themes
  if (isV2 && includeColorScales && theme.scales) {
    for (const [scaleName, scale] of Object.entries(theme.scales)) {
      const colorName = scale.name || scaleName;
      colorsConfig += buildColorScale(colorName);
    }
  }

  // Add status colors
  if (isV2) {
    colorsConfig += buildStatusColors();
  }

  // Build animations config
  let animationConfig = '';
  let keyframesConfig = '';

  if (includeAnimations && theme.animations) {
    const { animStr, keyframesStr } = buildAnimationsConfig(theme.animations);
    animationConfig = animStr;
    keyframesConfig = keyframesStr;
  }

  // Build the full config
  const typeAnnotation = format === 'ts' ? 'import type { Config } from "tailwindcss";\n\nconst config: Config = ' : 'module.exports = ';
  const exportStatement = format === 'ts' ? '\nexport default config;' : '';

  const config = `${format === 'ts' ? typeAnnotation : ''}${format === 'js' ? 'module.exports = ' : ''}{
  darkMode: ["class"],
  content: [
${contentPaths.map(p => `    "${p}"`).join(',\n')}
  ],
  theme: {
    extend: {
      colors: {
${colorsConfig}      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["${fontSans}"],
        mono: ["${fontMono}"],
      },${animationConfig ? `
      animation: {
${animationConfig}
      },` : ''}${keyframesConfig ? `
      keyframes: {
${keyframesConfig}
      },` : ''}
    },
  },
  plugins: [require("tailwindcss-animate")],
}${format === 'ts' ? ';\n\nexport default config;' : ';'}
`;

  return config;
}

/**
 * Build base semantic color configuration
 * @returns {string} Colors config string
 */
function buildBaseColors() {
  return `        background: "hsl(var(--background))",
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
`;
}

/**
 * Build 12-step color scale configuration
 * @param {string} colorName - Color name (e.g., 'teal')
 * @returns {string} Color scale config string
 */
function buildColorScale(colorName) {
  let config = `        ${colorName}: {\n`;

  for (let i = 1; i <= 12; i++) {
    config += `          "${i}": "hsl(var(--${colorName}-${i}))",\n`;
  }

  // Add alpha variants
  for (let i = 1; i <= 12; i++) {
    config += `          "a${i}": "hsl(var(--${colorName}-a${i}))",\n`;
  }

  config += `        },\n`;
  return config;
}

/**
 * Build status colors configuration
 * @returns {string} Status colors config string
 */
function buildStatusColors() {
  return `        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
`;
}

/**
 * Build animations configuration
 * @param {Object} animations - Theme animations object
 * @returns {{ animStr: string, keyframesStr: string }}
 */
function buildAnimationsConfig(animations) {
  let animStr = '';
  let keyframesStr = '';

  for (const [name, animation] of Object.entries(animations)) {
    const duration = animation.duration || '0.2s';
    const easing = animation.easing || 'ease-out';
    const iteration = animation.iteration || '';

    animStr += `        "${name}": "${name} ${duration} ${easing}${iteration ? ' ' + iteration : ''}",\n`;

    if (animation.keyframes) {
      keyframesStr += `        "${name}": {\n`;
      for (const [key, props] of Object.entries(animation.keyframes)) {
        keyframesStr += `          "${key}": {\n`;
        for (const [prop, value] of Object.entries(props)) {
          // Convert camelCase to kebab-case for CSS
          const cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
          keyframesStr += `            "${cssProp}": "${value}",\n`;
        }
        keyframesStr += `          },\n`;
      }
      keyframesStr += `        },\n`;
    }
  }

  return { animStr, keyframesStr };
}

/**
 * Generate minimal Tailwind config (no scales, minimal options)
 * @param {Object} theme - Theme object
 * @returns {string} Minimal Tailwind config
 */
export function generateTailwindMinimal(theme) {
  return generateTailwindV2(theme, {
    includeColorScales: false,
    includeAnimations: false
  });
}
