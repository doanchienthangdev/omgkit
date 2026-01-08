/**
 * Style Dictionary Generator
 * Generates Style Dictionary design tokens format
 *
 * @module lib/generators/style-dictionary
 */

import { detectThemeVersion } from '../theme.js';
import { processTheme } from '../theme-v2.js';

/**
 * Generate Style Dictionary tokens
 * @param {Object} theme - Theme object (v1 or v2)
 * @param {Object} options - Generation options
 * @param {string} options.category - Token category (default: 'brand')
 * @param {boolean} options.includeMeta - Include metadata (default: true)
 * @param {boolean} options.flatStructure - Use flat structure (default: false)
 * @returns {string} JSON string of Style Dictionary tokens
 */
export function generateStyleDictionary(theme, options = {}) {
  const {
    category = 'brand',
    includeMeta = true,
    flatStructure = false
  } = options;

  const version = detectThemeVersion(theme);
  const result = processTheme(theme);
  const { light: lightVars, dark: darkVars } = result.variables;

  // Build token structure
  const tokens = {};

  // Metadata
  if (includeMeta) {
    tokens.$meta = {
      generator: 'OMGKIT Design System',
      themeId: theme.id,
      themeName: theme.name,
      themeVersion: version,
      generatedAt: new Date().toISOString()
    };
  }

  // Color tokens
  if (flatStructure) {
    tokens.color = buildFlatColorTokens(lightVars, darkVars, category);
  } else {
    tokens.color = buildNestedColorTokens(lightVars, darkVars, category);
  }

  // Typography tokens
  tokens.font = buildFontTokens(theme, category);

  // Spacing tokens
  tokens.spacing = buildSpacingTokens(category);

  // Border radius tokens
  tokens.radius = buildRadiusTokens(theme, category);

  // Effect tokens
  if (theme.effects) {
    tokens.effect = buildEffectTokens(theme.effects, category);
  }

  // Animation tokens
  if (theme.animations) {
    tokens.animation = buildAnimationTokens(theme.animations, category);
  }

  return JSON.stringify(tokens, null, 2);
}

/**
 * Build flat color tokens
 * @param {Object} lightVars - Light mode variables
 * @param {Object} darkVars - Dark mode variables
 * @param {string} category - Token category
 * @returns {Object} Flat color tokens
 */
function buildFlatColorTokens(lightVars, darkVars, category) {
  const tokens = {
    light: {},
    dark: {}
  };

  // Light tokens
  for (const [name, value] of Object.entries(lightVars)) {
    tokens.light[name] = {
      value: value,
      type: 'color',
      category: category,
      comment: `Light mode ${name}`
    };
  }

  // Dark tokens
  for (const [name, value] of Object.entries(darkVars)) {
    tokens.dark[name] = {
      value: value,
      type: 'color',
      category: category,
      comment: `Dark mode ${name}`
    };
  }

  return tokens;
}

/**
 * Build nested color tokens (organized by semantic meaning)
 * @param {Object} lightVars - Light mode variables
 * @param {Object} darkVars - Dark mode variables
 * @param {string} category - Token category
 * @returns {Object} Nested color tokens
 */
function buildNestedColorTokens(lightVars, darkVars, category) {
  const tokens = {};

  // Organize tokens by semantic groups
  const groups = {
    base: ['background', 'foreground'],
    primary: ['primary', 'primary-foreground', 'primary-hover'],
    secondary: ['secondary', 'secondary-foreground', 'secondary-hover'],
    muted: ['muted', 'muted-foreground'],
    accent: ['accent', 'accent-foreground', 'accent-hover'],
    destructive: ['destructive', 'destructive-foreground'],
    border: ['border', 'border-hover', 'input', 'input-hover', 'ring', 'ring-offset'],
    card: ['card', 'card-foreground'],
    popover: ['popover', 'popover-foreground'],
    sidebar: ['sidebar-background', 'sidebar-foreground', 'sidebar-primary',
              'sidebar-primary-foreground', 'sidebar-accent', 'sidebar-accent-foreground',
              'sidebar-border', 'sidebar-ring'],
    chart: ['chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5'],
    status: ['success', 'success-foreground', 'warning', 'warning-foreground',
             'info', 'info-foreground'],
    surface: ['surface', 'surface-hover', 'surface-active', 'panel',
              'panel-translucent', 'overlay']
  };

  // Build grouped structure
  for (const [group, names] of Object.entries(groups)) {
    tokens[group] = {
      light: {},
      dark: {}
    };

    for (const name of names) {
      if (lightVars[name]) {
        tokens[group].light[name.replace(`${group}-`, '')] = {
          value: lightVars[name],
          type: 'color',
          category: category
        };
      }
      if (darkVars[name]) {
        tokens[group].dark[name.replace(`${group}-`, '')] = {
          value: darkVars[name],
          type: 'color',
          category: category
        };
      }
    }
  }

  // Add color scales (12-step)
  const scalePattern = /^([a-z]+)-(\d+|a\d+)$/;
  const scales = {};

  for (const [name, value] of Object.entries(lightVars)) {
    const match = name.match(scalePattern);
    if (match) {
      const [, scaleName, step] = match;
      if (!scales[scaleName]) {
        scales[scaleName] = { light: {}, dark: {} };
      }
      scales[scaleName].light[step] = {
        value: value,
        type: 'color',
        category: category
      };
    }
  }

  for (const [name, value] of Object.entries(darkVars)) {
    const match = name.match(scalePattern);
    if (match) {
      const [, scaleName, step] = match;
      if (!scales[scaleName]) {
        scales[scaleName] = { light: {}, dark: {} };
      }
      scales[scaleName].dark[step] = {
        value: value,
        type: 'color',
        category: category
      };
    }
  }

  // Add scales to tokens
  if (Object.keys(scales).length > 0) {
    tokens.scale = scales;
  }

  return tokens;
}

/**
 * Build font tokens
 * @param {Object} theme - Theme object
 * @param {string} category - Token category
 * @returns {Object} Font tokens
 */
function buildFontTokens(theme, category) {
  const fontSans = theme.typography?.fontFamily?.sans ||
                   theme.fontFamily?.sans ||
                   'Inter, system-ui, sans-serif';
  const fontMono = theme.typography?.fontFamily?.mono ||
                   theme.fontFamily?.mono ||
                   'JetBrains Mono, monospace';

  return {
    family: {
      sans: {
        value: fontSans,
        type: 'fontFamily',
        category: category
      },
      mono: {
        value: fontMono,
        type: 'fontFamily',
        category: category
      }
    },
    size: {
      xs: { value: '0.75rem', type: 'dimension', category: category },
      sm: { value: '0.875rem', type: 'dimension', category: category },
      base: { value: '1rem', type: 'dimension', category: category },
      lg: { value: '1.125rem', type: 'dimension', category: category },
      xl: { value: '1.25rem', type: 'dimension', category: category },
      '2xl': { value: '1.5rem', type: 'dimension', category: category },
      '3xl': { value: '1.875rem', type: 'dimension', category: category },
      '4xl': { value: '2.25rem', type: 'dimension', category: category },
      '5xl': { value: '3rem', type: 'dimension', category: category }
    },
    weight: {
      normal: { value: '400', type: 'fontWeight', category: category },
      medium: { value: '500', type: 'fontWeight', category: category },
      semibold: { value: '600', type: 'fontWeight', category: category },
      bold: { value: '700', type: 'fontWeight', category: category }
    },
    lineHeight: {
      none: { value: '1', type: 'lineHeight', category: category },
      tight: { value: '1.25', type: 'lineHeight', category: category },
      snug: { value: '1.375', type: 'lineHeight', category: category },
      normal: { value: '1.5', type: 'lineHeight', category: category },
      relaxed: { value: '1.625', type: 'lineHeight', category: category },
      loose: { value: '2', type: 'lineHeight', category: category }
    }
  };
}

/**
 * Build spacing tokens
 * @param {string} category - Token category
 * @returns {Object} Spacing tokens
 */
function buildSpacingTokens(category) {
  const scales = {
    '0': '0',
    '1': '0.25rem',
    '2': '0.5rem',
    '3': '0.75rem',
    '4': '1rem',
    '5': '1.25rem',
    '6': '1.5rem',
    '8': '2rem',
    '10': '2.5rem',
    '12': '3rem',
    '16': '4rem',
    '20': '5rem',
    '24': '6rem',
    '32': '8rem',
    '40': '10rem',
    '48': '12rem',
    '56': '14rem',
    '64': '16rem'
  };

  const tokens = {};
  for (const [name, value] of Object.entries(scales)) {
    tokens[name] = {
      value: value,
      type: 'dimension',
      category: category
    };
  }

  return tokens;
}

/**
 * Build border radius tokens
 * @param {Object} theme - Theme object
 * @param {string} category - Token category
 * @returns {Object} Radius tokens
 */
function buildRadiusTokens(theme, category) {
  const radius = theme.spacing?.radius || theme.radius || '0.5rem';

  return {
    none: { value: '0', type: 'dimension', category: category },
    sm: { value: `calc(${radius} - 4px)`, type: 'dimension', category: category },
    md: { value: `calc(${radius} - 2px)`, type: 'dimension', category: category },
    default: { value: radius, type: 'dimension', category: category },
    lg: { value: radius, type: 'dimension', category: category },
    xl: { value: `calc(${radius} + 4px)`, type: 'dimension', category: category },
    '2xl': { value: `calc(${radius} + 8px)`, type: 'dimension', category: category },
    full: { value: '9999px', type: 'dimension', category: category }
  };
}

/**
 * Build effect tokens
 * @param {Object} effects - Theme effects
 * @param {string} category - Token category
 * @returns {Object} Effect tokens
 */
function buildEffectTokens(effects, category) {
  const tokens = {};

  if (effects.glassMorphism) {
    tokens.glass = {
      blur: {
        value: effects.glassMorphism.backdropBlur || '12px',
        type: 'dimension',
        category: category
      }
    };
  }

  if (effects.glow) {
    tokens.glow = {
      default: {
        value: effects.glow.default || '0 0 20px',
        type: 'boxShadow',
        category: category
      },
      lg: {
        value: effects.glow.lg || '0 0 40px',
        type: 'boxShadow',
        category: category
      }
    };
  }

  if (effects.gradient) {
    tokens.gradient = {};
    for (const [name, gradient] of Object.entries(effects.gradient)) {
      tokens.gradient[name] = {
        from: { value: gradient.from, type: 'color', category: category },
        to: { value: gradient.to, type: 'color', category: category },
        direction: {
          value: gradient.direction || '135deg',
          type: 'dimension',
          category: category
        }
      };
    }
  }

  return tokens;
}

/**
 * Build animation tokens
 * @param {Object} animations - Theme animations
 * @param {string} category - Token category
 * @returns {Object} Animation tokens
 */
function buildAnimationTokens(animations, category) {
  const tokens = {};

  for (const [name, animation] of Object.entries(animations)) {
    tokens[name] = {
      duration: {
        value: animation.duration || '0.2s',
        type: 'duration',
        category: category
      },
      easing: {
        value: animation.easing || 'ease-out',
        type: 'cubicBezier',
        category: category
      }
    };

    if (animation.iteration) {
      tokens[name].iteration = {
        value: animation.iteration,
        type: 'number',
        category: category
      };
    }
  }

  return tokens;
}

/**
 * Generate Style Dictionary config file
 * @param {Object} theme - Theme object
 * @param {Object} options - Options
 * @returns {string} Config JSON string
 */
export function generateStyleDictionaryConfig(theme, options = {}) {
  const config = {
    source: ['tokens/**/*.json'],
    platforms: {
      css: {
        transformGroup: 'css',
        buildPath: 'build/css/',
        files: [{
          destination: 'variables.css',
          format: 'css/variables'
        }]
      },
      scss: {
        transformGroup: 'scss',
        buildPath: 'build/scss/',
        files: [{
          destination: '_variables.scss',
          format: 'scss/variables'
        }]
      },
      js: {
        transformGroup: 'js',
        buildPath: 'build/js/',
        files: [{
          destination: 'tokens.js',
          format: 'javascript/module'
        }]
      },
      json: {
        transformGroup: 'web',
        buildPath: 'build/json/',
        files: [{
          destination: 'tokens.json',
          format: 'json'
        }]
      }
    }
  };

  return JSON.stringify(config, null, 2);
}
