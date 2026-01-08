/**
 * Figma Tokens Generator
 * Generates Figma design tokens format
 *
 * @module lib/generators/figma
 */

import { detectThemeVersion } from '../theme.js';
import { processTheme, hslToHex } from '../theme-v2.js';

// Import hex converter from theme.js
import { hslToHex as themeHslToHex } from '../theme.js';

/**
 * Convert HSL string to hex
 * @param {string} hsl - HSL string (e.g., '220 14.3% 95.9%')
 * @returns {string} Hex color
 */
function convertHslToHex(hsl) {
  if (!hsl || typeof hsl !== 'string') return '#000000';

  try {
    // Handle HSL with alpha
    if (hsl.includes('/')) {
      const [hslPart] = hsl.split('/');
      return themeHslToHex(hslPart.trim());
    }
    return themeHslToHex(hsl);
  } catch {
    return '#000000';
  }
}

/**
 * Generate Figma design tokens
 * @param {Object} theme - Theme object (v1 or v2)
 * @param {Object} options - Generation options
 * @param {string} options.format - 'figma' or 'tokens-studio' (default: 'figma')
 * @param {boolean} options.includeHex - Include hex values (default: true)
 * @param {boolean} options.includeMeta - Include metadata (default: true)
 * @returns {string} JSON string of Figma tokens
 */
export function generateFigmaTokens(theme, options = {}) {
  const {
    format = 'figma',
    includeHex = true,
    includeMeta = true
  } = options;

  const version = detectThemeVersion(theme);
  const result = processTheme(theme);
  const { light: lightVars, dark: darkVars } = result.variables;

  const tokens = {
    $themes: [],
    $metadata: includeMeta ? {
      tokenSetOrder: ['global', 'light', 'dark'],
      generator: 'OMGKIT Design System',
      themeId: theme.id,
      themeName: theme.name,
      version: version
    } : undefined
  };

  // Global tokens
  tokens.global = {
    typography: buildTypographyTokens(theme),
    spacing: buildSpacingTokens(theme),
    borderRadius: buildRadiusTokens(theme)
  };

  // Light mode tokens
  tokens.light = {
    colors: buildColorTokens(lightVars, includeHex)
  };

  // Dark mode tokens
  tokens.dark = {
    colors: buildColorTokens(darkVars, includeHex)
  };

  // Add effects if present
  if (theme.effects) {
    tokens.global.effects = buildEffectTokens(theme.effects);
  }

  // Theme sets for Figma
  tokens.$themes = [
    {
      id: `${theme.id}-light`,
      name: `${theme.name} Light`,
      selectedTokenSets: { global: 'enabled', light: 'enabled' }
    },
    {
      id: `${theme.id}-dark`,
      name: `${theme.name} Dark`,
      selectedTokenSets: { global: 'enabled', dark: 'enabled' }
    }
  ];

  // Remove undefined values
  if (!includeMeta) {
    delete tokens.$metadata;
  }

  return JSON.stringify(tokens, null, 2);
}

/**
 * Build color tokens from variables
 * @param {Object} vars - Color variables
 * @param {boolean} includeHex - Include hex conversion
 * @returns {Object} Color tokens
 */
function buildColorTokens(vars, includeHex) {
  const tokens = {};

  for (const [name, value] of Object.entries(vars)) {
    const token = {
      value: value,
      type: 'color'
    };

    if (includeHex) {
      token.$extensions = {
        'figma': {
          hexValue: convertHslToHex(value)
        }
      };
    }

    // Organize by category
    const category = getColorCategory(name);
    if (!tokens[category]) {
      tokens[category] = {};
    }

    // Clean name for token path
    const cleanName = name.replace(category + '-', '').replace('-', '.');

    if (cleanName === category || cleanName === '') {
      tokens[category].DEFAULT = token;
    } else {
      tokens[category][cleanName] = token;
    }
  }

  return tokens;
}

/**
 * Get color category from token name
 * @param {string} name - Token name
 * @returns {string} Category
 */
function getColorCategory(name) {
  const categories = [
    'background', 'foreground', 'primary', 'secondary',
    'muted', 'accent', 'destructive', 'border', 'input',
    'ring', 'card', 'popover', 'sidebar', 'chart',
    'success', 'warning', 'info', 'surface', 'panel', 'overlay'
  ];

  for (const cat of categories) {
    if (name.startsWith(cat)) return cat;
  }

  // Color scales (e.g., teal-1, teal-9)
  const scaleMatch = name.match(/^([a-z]+)-\d+$/);
  if (scaleMatch) {
    return scaleMatch[1];
  }

  return 'other';
}

/**
 * Build typography tokens
 * @param {Object} theme - Theme object
 * @returns {Object} Typography tokens
 */
function buildTypographyTokens(theme) {
  const fontSans = theme.typography?.fontFamily?.sans ||
                   theme.fontFamily?.sans ||
                   'Inter, system-ui, sans-serif';
  const fontMono = theme.typography?.fontFamily?.mono ||
                   theme.fontFamily?.mono ||
                   'JetBrains Mono, monospace';

  return {
    fontFamily: {
      sans: {
        value: fontSans,
        type: 'fontFamilies'
      },
      mono: {
        value: fontMono,
        type: 'fontFamilies'
      }
    },
    fontSize: {
      xs: { value: '0.75rem', type: 'fontSizes' },
      sm: { value: '0.875rem', type: 'fontSizes' },
      base: { value: '1rem', type: 'fontSizes' },
      lg: { value: '1.125rem', type: 'fontSizes' },
      xl: { value: '1.25rem', type: 'fontSizes' },
      '2xl': { value: '1.5rem', type: 'fontSizes' },
      '3xl': { value: '1.875rem', type: 'fontSizes' },
      '4xl': { value: '2.25rem', type: 'fontSizes' }
    },
    fontWeight: {
      normal: { value: '400', type: 'fontWeights' },
      medium: { value: '500', type: 'fontWeights' },
      semibold: { value: '600', type: 'fontWeights' },
      bold: { value: '700', type: 'fontWeights' }
    },
    lineHeight: {
      none: { value: '1', type: 'lineHeights' },
      tight: { value: '1.25', type: 'lineHeights' },
      snug: { value: '1.375', type: 'lineHeights' },
      normal: { value: '1.5', type: 'lineHeights' },
      relaxed: { value: '1.625', type: 'lineHeights' },
      loose: { value: '2', type: 'lineHeights' }
    }
  };
}

/**
 * Build spacing tokens
 * @param {Object} theme - Theme object
 * @returns {Object} Spacing tokens
 */
function buildSpacingTokens(theme) {
  return {
    '0': { value: '0', type: 'spacing' },
    '1': { value: '0.25rem', type: 'spacing' },
    '2': { value: '0.5rem', type: 'spacing' },
    '3': { value: '0.75rem', type: 'spacing' },
    '4': { value: '1rem', type: 'spacing' },
    '5': { value: '1.25rem', type: 'spacing' },
    '6': { value: '1.5rem', type: 'spacing' },
    '8': { value: '2rem', type: 'spacing' },
    '10': { value: '2.5rem', type: 'spacing' },
    '12': { value: '3rem', type: 'spacing' },
    '16': { value: '4rem', type: 'spacing' },
    '20': { value: '5rem', type: 'spacing' },
    '24': { value: '6rem', type: 'spacing' }
  };
}

/**
 * Build border radius tokens
 * @param {Object} theme - Theme object
 * @returns {Object} Radius tokens
 */
function buildRadiusTokens(theme) {
  const radius = theme.spacing?.radius || theme.radius || '0.5rem';

  return {
    none: { value: '0', type: 'borderRadius' },
    sm: { value: `calc(${radius} - 4px)`, type: 'borderRadius' },
    md: { value: `calc(${radius} - 2px)`, type: 'borderRadius' },
    DEFAULT: { value: radius, type: 'borderRadius' },
    lg: { value: radius, type: 'borderRadius' },
    xl: { value: `calc(${radius} + 4px)`, type: 'borderRadius' },
    '2xl': { value: `calc(${radius} + 8px)`, type: 'borderRadius' },
    full: { value: '9999px', type: 'borderRadius' }
  };
}

/**
 * Build effect tokens
 * @param {Object} effects - Theme effects
 * @returns {Object} Effect tokens
 */
function buildEffectTokens(effects) {
  const tokens = {};

  if (effects.glassMorphism) {
    tokens.glass = {
      blur: {
        value: effects.glassMorphism.backdropBlur || '12px',
        type: 'dimension'
      }
    };
  }

  if (effects.glow) {
    tokens.glow = {
      DEFAULT: {
        value: effects.glow.default || '0 0 20px',
        type: 'boxShadow'
      },
      lg: {
        value: effects.glow.lg || '0 0 40px',
        type: 'boxShadow'
      }
    };
  }

  return tokens;
}

/**
 * Generate Tokens Studio format (alternative Figma plugin)
 * @param {Object} theme - Theme object
 * @returns {string} JSON string
 */
export function generateTokensStudio(theme) {
  return generateFigmaTokens(theme, { format: 'tokens-studio' });
}
