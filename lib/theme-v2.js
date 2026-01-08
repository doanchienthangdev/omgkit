/**
 * OMGKIT Theme V2 Processing Library
 * Handles v2 schema processing: color scales, $ref resolution, effects, animations
 *
 * @module lib/theme-v2
 */

import { REQUIRED_COLORS, OPTIONAL_COLORS, V2_EXTENDED_TOKENS, V2_STATUS_COLORS } from './theme.js';

/**
 * Maximum depth for $ref resolution to prevent infinite loops
 */
const MAX_REF_DEPTH = 10;

/**
 * Resolve a $ref value in theme
 * @param {any} value - Value to resolve (may contain $ref)
 * @param {Object} theme - Full theme object for lookups
 * @param {Set} visited - Set of visited paths (for circular detection)
 * @param {number} depth - Current recursion depth
 * @returns {string} Resolved value
 * @throws {Error} If circular reference or invalid path detected
 */
export function resolveReference(value, theme, visited = new Set(), depth = 0) {
  // Not a reference, return as-is
  if (typeof value !== 'object' || value === null) {
    return value;
  }

  // No $ref property, return as-is
  if (!value.$ref) {
    return value;
  }

  const refPath = value.$ref;

  // Depth check
  if (depth >= MAX_REF_DEPTH) {
    throw new Error(`Maximum reference depth exceeded at: ${refPath}`);
  }

  // Circular reference detection
  if (visited.has(refPath)) {
    throw new Error(`Circular reference detected: ${refPath}`);
  }
  visited.add(refPath);

  // Security: Prevent prototype pollution
  const dangerousPaths = ['__proto__', 'constructor', 'prototype'];
  const parts = refPath.split('.');
  for (const part of parts) {
    if (dangerousPaths.includes(part)) {
      throw new Error(`Invalid reference path (security): ${refPath}`);
    }
  }

  // Navigate to referenced value
  let current = theme;
  for (const part of parts) {
    if (current === undefined || current === null) {
      throw new Error(`Invalid reference path: ${refPath} (${part} not found)`);
    }
    current = current[part];
  }

  if (current === undefined) {
    throw new Error(`Reference not found: ${refPath}`);
  }

  // Recursively resolve if result is also a $ref
  return resolveReference(current, theme, visited, depth + 1);
}

/**
 * Resolve all $refs in a token set
 * @param {Object} tokenSet - Token set with potential $refs
 * @param {Object} theme - Full theme for reference resolution
 * @returns {Object} Resolved token set
 */
export function resolveTokenSet(tokenSet, theme) {
  if (!tokenSet || typeof tokenSet !== 'object') {
    return tokenSet;
  }

  const resolved = {};
  for (const [key, value] of Object.entries(tokenSet)) {
    try {
      resolved[key] = resolveReference(value, theme);
    } catch (error) {
      console.warn(`Warning: Could not resolve ${key}: ${error.message}`);
      resolved[key] = value; // Keep original if resolution fails
    }
  }
  return resolved;
}

/**
 * Expand color scales to flat CSS variables
 * @param {Object} scales - Color scales object from theme
 * @param {string} mode - 'light' or 'dark'
 * @returns {Object} Flat object of color variables
 */
export function expandColorScales(scales, mode = 'light') {
  const result = {};

  if (!scales) return result;

  for (const [scaleName, scale] of Object.entries(scales)) {
    const colorName = scale.name || scaleName;

    // Expand steps (1-12)
    if (scale.steps && scale.steps[mode]) {
      for (let i = 1; i <= 12; i++) {
        const stepValue = scale.steps[mode][i] || scale.steps[mode][String(i)];
        if (stepValue) {
          result[`${colorName}-${i}`] = stepValue;
        }
      }
    }

    // Expand alpha variants (a1-a12)
    if (scale.alpha && scale.alpha[mode]) {
      for (let i = 1; i <= 12; i++) {
        const alphaValue = scale.alpha[mode][i] || scale.alpha[mode][String(i)];
        if (alphaValue) {
          result[`${colorName}-a${i}`] = alphaValue;
        }
      }
    }
  }

  return result;
}

/**
 * Process effects into CSS variables
 * @param {Object} effects - Effects object from theme
 * @param {Object} theme - Full theme for $ref resolution
 * @returns {Object} CSS variables for effects
 */
export function processEffects(effects, theme) {
  const result = {};

  if (!effects) return result;

  // Glassmorphism
  if (effects.glassMorphism) {
    if (effects.glassMorphism.background) {
      const bg = resolveReference(effects.glassMorphism.background, theme);
      result['glass-background'] = bg;
    }
    if (effects.glassMorphism.backdropBlur) {
      result['glass-blur'] = effects.glassMorphism.backdropBlur;
    }
  }

  // Glow
  if (effects.glow) {
    if (effects.glow.default) {
      result['glow'] = effects.glow.default;
    }
    if (effects.glow.lg) {
      result['glow-lg'] = effects.glow.lg;
    }
    if (effects.glow.color) {
      const color = resolveReference(effects.glow.color, theme);
      result['glow-color'] = color;
    }
  }

  // Gradients
  if (effects.gradient) {
    for (const [name, gradient] of Object.entries(effects.gradient)) {
      if (gradient.from) {
        const from = resolveReference(gradient.from, theme);
        result[`gradient-${name}-from`] = from;
      }
      if (gradient.to) {
        const to = resolveReference(gradient.to, theme);
        result[`gradient-${name}-to`] = to;
      }
      if (gradient.direction) {
        result[`gradient-${name}-direction`] = gradient.direction;
      }
    }
  }

  return result;
}

/**
 * Process animations into CSS keyframes and animations
 * @param {Object} animations - Animations object from theme
 * @returns {Object} { keyframes: {...}, animations: {...} }
 */
export function processAnimations(animations) {
  const keyframes = {};
  const animationDefs = {};

  if (!animations) return { keyframes, animations: animationDefs };

  for (const [name, animation] of Object.entries(animations)) {
    // Process keyframes
    if (animation.keyframes) {
      keyframes[name] = animation.keyframes;
    }

    // Build animation shorthand
    const parts = [];
    parts.push(name); // animation-name
    parts.push(animation.duration || '0.2s');
    parts.push(animation.easing || 'ease-out');
    if (animation.iteration) {
      parts.push(animation.iteration);
    }

    animationDefs[name] = parts.join(' ');
  }

  return { keyframes, animations: animationDefs };
}

/**
 * Migrate V1 theme to V2 format
 * @param {Object} v1Theme - V1 theme object
 * @returns {Object} V2 theme object
 */
export function migrateV1ToV2(v1Theme) {
  if (!v1Theme) {
    throw new Error('Cannot migrate null/undefined theme');
  }

  // Already v2?
  if (v1Theme.version === '2.0' || v1Theme.scales) {
    return v1Theme;
  }

  return {
    version: '2.0',
    name: v1Theme.name,
    id: v1Theme.id,
    category: v1Theme.category,
    description: v1Theme.description || '',

    colorSystem: {
      type: 'semantic',
      version: '1.0'
    },

    // V1 has no scales
    scales: {},

    // Map v1 colors to semanticTokens
    semanticTokens: {
      light: {
        ...v1Theme.colors?.light,
        // Add v2 tokens with sensible defaults from v1
        'surface': v1Theme.colors?.light?.muted || v1Theme.colors?.light?.background,
        'surface-hover': v1Theme.colors?.light?.accent || v1Theme.colors?.light?.muted,
        'surface-active': v1Theme.colors?.light?.secondary || v1Theme.colors?.light?.muted,
        'primary-hover': v1Theme.colors?.light?.primary,
        'secondary-hover': v1Theme.colors?.light?.secondary,
        'accent-hover': v1Theme.colors?.light?.accent,
        'border-hover': v1Theme.colors?.light?.input || v1Theme.colors?.light?.border,
        'input-hover': v1Theme.colors?.light?.input,
        'ring-offset': '0 0% 100%',
        'panel': v1Theme.colors?.light?.muted || v1Theme.colors?.light?.background,
        'panel-translucent': v1Theme.colors?.light?.muted + ' / 0.8',
        'overlay': '0 0% 0% / 0.4'
      },
      dark: {
        ...v1Theme.colors?.dark,
        'surface': v1Theme.colors?.dark?.muted || v1Theme.colors?.dark?.background,
        'surface-hover': v1Theme.colors?.dark?.accent || v1Theme.colors?.dark?.muted,
        'surface-active': v1Theme.colors?.dark?.secondary || v1Theme.colors?.dark?.muted,
        'primary-hover': v1Theme.colors?.dark?.primary,
        'secondary-hover': v1Theme.colors?.dark?.secondary,
        'accent-hover': v1Theme.colors?.dark?.accent,
        'border-hover': v1Theme.colors?.dark?.input || v1Theme.colors?.dark?.border,
        'input-hover': v1Theme.colors?.dark?.input,
        'ring-offset': '0 0% 0%',
        'panel': v1Theme.colors?.dark?.muted || v1Theme.colors?.dark?.background,
        'panel-translucent': v1Theme.colors?.dark?.muted + ' / 0.8',
        'overlay': '0 0% 0% / 0.6'
      }
    },

    // Status colors (use destructive from v1, add defaults for others)
    statusColors: {
      light: {
        destructive: v1Theme.colors?.light?.destructive || '0 84.2% 60.2%',
        'destructive-foreground': v1Theme.colors?.light?.['destructive-foreground'] || '0 0% 98%',
        success: '151 55% 42%',
        'success-foreground': '0 0% 100%',
        warning: '39 100% 62%',
        'warning-foreground': '39 40% 20%',
        info: '206 100% 50%',
        'info-foreground': '0 0% 100%'
      },
      dark: {
        destructive: v1Theme.colors?.dark?.destructive || '0 62.8% 30.6%',
        'destructive-foreground': v1Theme.colors?.dark?.['destructive-foreground'] || '0 0% 98%',
        success: '151 50% 45%',
        'success-foreground': '0 0% 100%',
        warning: '39 90% 55%',
        'warning-foreground': '39 80% 10%',
        info: '206 90% 55%',
        'info-foreground': '0 0% 100%'
      }
    },

    // Chart colors from v1 if available
    chartColors: {
      '1': v1Theme.colors?.light?.['chart-1'] || v1Theme.colors?.light?.primary,
      '2': v1Theme.colors?.light?.['chart-2'] || '206 100% 50%',
      '3': v1Theme.colors?.light?.['chart-3'] || '151 55% 42%',
      '4': v1Theme.colors?.light?.['chart-4'] || '39 100% 62%',
      '5': v1Theme.colors?.light?.['chart-5'] || '0 84.2% 60.2%'
    },

    // Sidebar tokens from v1 if available
    sidebarTokens: {
      light: {
        background: v1Theme.colors?.light?.['sidebar-background'] || '0 0% 98%',
        foreground: v1Theme.colors?.light?.['sidebar-foreground'] || v1Theme.colors?.light?.['muted-foreground'],
        primary: v1Theme.colors?.light?.['sidebar-primary'] || v1Theme.colors?.light?.primary,
        'primary-foreground': v1Theme.colors?.light?.['sidebar-primary-foreground'] || '0 0% 98%',
        accent: v1Theme.colors?.light?.['sidebar-accent'] || v1Theme.colors?.light?.muted,
        'accent-foreground': v1Theme.colors?.light?.['sidebar-accent-foreground'] || v1Theme.colors?.light?.foreground,
        border: v1Theme.colors?.light?.['sidebar-border'] || v1Theme.colors?.light?.border,
        ring: v1Theme.colors?.light?.['sidebar-ring'] || v1Theme.colors?.light?.ring
      },
      dark: {
        background: v1Theme.colors?.dark?.['sidebar-background'] || '0 0% 5%',
        foreground: v1Theme.colors?.dark?.['sidebar-foreground'] || v1Theme.colors?.dark?.['muted-foreground'],
        primary: v1Theme.colors?.dark?.['sidebar-primary'] || v1Theme.colors?.dark?.primary,
        'primary-foreground': v1Theme.colors?.dark?.['sidebar-primary-foreground'] || '0 0% 98%',
        accent: v1Theme.colors?.dark?.['sidebar-accent'] || v1Theme.colors?.dark?.muted,
        'accent-foreground': v1Theme.colors?.dark?.['sidebar-accent-foreground'] || v1Theme.colors?.dark?.foreground,
        border: v1Theme.colors?.dark?.['sidebar-border'] || v1Theme.colors?.dark?.border,
        ring: v1Theme.colors?.dark?.['sidebar-ring'] || v1Theme.colors?.dark?.ring
      }
    },

    // Typography
    typography: {
      fontFamily: {
        sans: v1Theme.fontFamily?.sans || 'Inter, system-ui, sans-serif',
        mono: v1Theme.fontFamily?.mono || 'JetBrains Mono, monospace'
      },
      fontFeatureSettings: '"rlig" 1, "calt" 1'
    },

    // Spacing
    spacing: {
      radius: v1Theme.radius || '0.5rem',
      radiusLg: 'var(--radius)',
      radiusMd: 'calc(var(--radius) - 2px)',
      radiusSm: 'calc(var(--radius) - 4px)'
    },

    // Empty effects/animations for migrated themes
    effects: {},
    animations: {},

    // Keep v1 colors for backward compatibility
    colors: v1Theme.colors,
    radius: v1Theme.radius,
    fontFamily: v1Theme.fontFamily
  };
}

/**
 * Process a V2 theme into flat CSS variables
 * @param {Object} theme - V2 theme object
 * @param {string} mode - 'light' or 'dark'
 * @returns {Object} Flat object of CSS variables
 */
export function processV2Theme(theme, mode = 'light') {
  const variables = {};

  // 1. Expand color scales
  if (theme.scales) {
    const scaleVars = expandColorScales(theme.scales, mode);
    Object.assign(variables, scaleVars);
  }

  // 2. Resolve semantic tokens
  if (theme.semanticTokens && theme.semanticTokens[mode]) {
    const resolvedTokens = resolveTokenSet(theme.semanticTokens[mode], theme);
    Object.assign(variables, resolvedTokens);
  }

  // 3. Add status colors
  if (theme.statusColors && theme.statusColors[mode]) {
    Object.assign(variables, theme.statusColors[mode]);
  }

  // 4. Add chart colors (mode-independent)
  if (theme.chartColors) {
    for (const [num, value] of Object.entries(theme.chartColors)) {
      const resolved = resolveReference(value, theme);
      variables[`chart-${num}`] = resolved;
    }
  }

  // 5. Add sidebar tokens
  if (theme.sidebarTokens && theme.sidebarTokens[mode]) {
    const sidebarTokens = resolveTokenSet(theme.sidebarTokens[mode], theme);
    for (const [key, value] of Object.entries(sidebarTokens)) {
      variables[`sidebar-${key}`] = value;
    }
  }

  // 6. Process effects
  if (theme.effects) {
    const effectVars = processEffects(theme.effects, theme);
    Object.assign(variables, effectVars);
  }

  return variables;
}

/**
 * Get all CSS variables needed for a V2 theme
 * @param {Object} theme - V2 theme object
 * @returns {{ light: Object, dark: Object }} Variables for both modes
 */
export function getV2CSSVariables(theme) {
  return {
    light: processV2Theme(theme, 'light'),
    dark: processV2Theme(theme, 'dark')
  };
}

/**
 * Validate V2 theme structure
 * @param {Object} theme - Theme to validate
 * @returns {{ valid: boolean, errors: string[], warnings: string[] }}
 */
export function validateV2Theme(theme) {
  const errors = [];
  const warnings = [];

  if (!theme) {
    return { valid: false, errors: ['Theme is null or undefined'], warnings };
  }

  // Required fields
  if (!theme.name) errors.push('Missing required field: name');
  if (!theme.id) errors.push('Missing required field: id');
  if (!theme.category) errors.push('Missing required field: category');

  // ID format
  if (theme.id && !/^[a-z0-9-]+$/.test(theme.id)) {
    errors.push('Invalid id format: must be kebab-case');
  }

  // Version
  if (theme.version && theme.version !== '2.0') {
    warnings.push(`Unexpected version: ${theme.version} (expected 2.0)`);
  }

  // Scales validation
  if (theme.scales) {
    for (const [scaleName, scale] of Object.entries(theme.scales)) {
      if (!scale.name) {
        warnings.push(`Scale ${scaleName} missing name property`);
      }
      if (!scale.steps?.light || !scale.steps?.dark) {
        errors.push(`Scale ${scaleName} missing light or dark steps`);
      }
    }
  }

  // Semantic tokens validation
  if (theme.semanticTokens) {
    if (!theme.semanticTokens.light) {
      errors.push('Missing semanticTokens.light');
    }
    if (!theme.semanticTokens.dark) {
      errors.push('Missing semanticTokens.dark');
    }
  }

  // Test $ref resolution
  if (theme.semanticTokens?.light) {
    for (const [key, value] of Object.entries(theme.semanticTokens.light)) {
      if (typeof value === 'object' && value.$ref) {
        try {
          resolveReference(value, theme);
        } catch (error) {
          errors.push(`Invalid $ref in semanticTokens.light.${key}: ${error.message}`);
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Get required V2 tokens that must be present
 * @returns {string[]} List of required token names
 */
export function getRequiredV2Tokens() {
  return [
    ...REQUIRED_COLORS,
    ...V2_EXTENDED_TOKENS,
    ...V2_STATUS_COLORS
  ];
}

/**
 * Generate CSS keyframes string from animation definitions
 * @param {Object} keyframes - Keyframes object from processAnimations
 * @returns {string} CSS keyframes rules
 */
export function generateKeyframesCSS(keyframes) {
  let css = '';

  for (const [name, frames] of Object.entries(keyframes)) {
    css += `@keyframes ${name} {\n`;
    for (const [key, properties] of Object.entries(frames)) {
      css += `  ${key} {\n`;
      for (const [prop, value] of Object.entries(properties)) {
        // Convert camelCase to kebab-case
        const kebabProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
        css += `    ${kebabProp}: ${value};\n`;
      }
      css += `  }\n`;
    }
    css += `}\n\n`;
  }

  return css;
}

/**
 * Generate V2 theme CSS with all features
 * @param {Object} theme - V2 theme object
 * @returns {string} Complete CSS content
 */
export function generateV2ThemeCSS(theme) {
  const { light: lightVars, dark: darkVars } = getV2CSSVariables(theme);

  // Generate CSS variable declarations
  const generateVarDeclarations = (vars) => {
    let css = '';
    for (const [key, value] of Object.entries(vars)) {
      css += `  --${key}: ${value};\n`;
    }
    return css;
  };

  // Process animations
  const { keyframes, animations } = processAnimations(theme.animations || {});

  // Generate animation CSS variables
  const animationVars = Object.entries(animations)
    .map(([name, value]) => `  --animation-${name}: ${value};`)
    .join('\n');

  // Generate keyframes CSS
  const keyframesCSS = generateKeyframesCSS(keyframes);

  // Generate typography CSS
  const fontSans = theme.typography?.fontFamily?.sans || 'Inter, system-ui, sans-serif';
  const fontMono = theme.typography?.fontFamily?.mono || 'JetBrains Mono, monospace';
  const fontFeatureSettings = theme.typography?.fontFeatureSettings || '"rlig" 1, "calt" 1';

  // Generate spacing CSS
  const radius = theme.spacing?.radius || theme.radius || '0.5rem';

  const lightVarsStr = generateVarDeclarations(lightVars);
  const darkVarsStr = generateVarDeclarations(darkVars);

  return `/* OMGKIT Theme: ${theme.name} */
/* Theme ID: ${theme.id} */
/* Category: ${theme.category} */
/* Version: 2.0 */
/* Generated by OMGKIT Design System v2 */

${keyframesCSS}
@layer base {
  :root {
${lightVarsStr}  --radius: ${radius};
  --font-sans: ${fontSans};
  --font-mono: ${fontMono};
  --font-feature-settings: ${fontFeatureSettings};
${animationVars ? animationVars + '\n' : ''}}

  .dark {
${darkVarsStr}  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-family: var(--font-sans);
    font-feature-settings: var(--font-feature-settings);
  }
}
`;
}

/**
 * Unified theme processor - handles both v1 and v2 themes
 * @param {Object} theme - Theme object (v1 or v2)
 * @param {Object} options - Processing options
 * @param {boolean} options.forceV2 - Force v2 processing (migrate v1 if needed)
 * @param {string} options.mode - 'light' or 'dark' (for partial processing)
 * @returns {{ version: string, css: string, variables: Object, theme: Object }}
 */
export function processTheme(theme, options = {}) {
  const { forceV2 = false, mode = null } = options;

  if (!theme) {
    throw new Error('Theme is required');
  }

  // Import dynamically to avoid circular dependency
  const isV2 = theme.version === '2.0' ||
               theme.scales ||
               theme.semanticTokens ||
               theme.effects ||
               theme.animations ||
               theme.colorSystem ||
               theme.statusColors;

  if (isV2 || forceV2) {
    // Process as v2
    const v2Theme = isV2 ? theme : migrateV1ToV2(theme);
    const variables = mode
      ? { [mode]: processV2Theme(v2Theme, mode) }
      : getV2CSSVariables(v2Theme);
    const css = generateV2ThemeCSS(v2Theme);

    return {
      version: '2.0',
      css,
      variables,
      theme: v2Theme
    };
  } else {
    // Process as v1 (use existing generateThemeCSS pattern)
    const variables = {
      light: theme.colors?.light || {},
      dark: theme.colors?.dark || {}
    };

    // Generate v1 CSS (simple format)
    const generateColorVars = (colors) => {
      let css = '';
      for (const [key, value] of Object.entries(colors)) {
        css += `  --${key}: ${value};\n`;
      }
      return css;
    };

    const lightVars = generateColorVars(theme.colors?.light || {});
    const darkVars = generateColorVars(theme.colors?.dark || {});

    const css = `/* OMGKIT Theme: ${theme.name} */
/* Theme ID: ${theme.id} */
/* Category: ${theme.category} */
/* Version: 1.0 */
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

    return {
      version: '1.0',
      css,
      variables,
      theme
    };
  }
}

/**
 * Get a flat list of all CSS variable names for a theme
 * @param {Object} theme - Theme object (v1 or v2)
 * @returns {string[]} Array of variable names (without -- prefix)
 */
export function getThemeVariableNames(theme) {
  const result = processTheme(theme);
  const names = new Set();

  for (const modeVars of Object.values(result.variables)) {
    for (const key of Object.keys(modeVars)) {
      names.add(key);
    }
  }

  return Array.from(names);
}

/**
 * Compare two themes and return differences
 * @param {Object} themeA - First theme
 * @param {Object} themeB - Second theme
 * @returns {{ added: string[], removed: string[], changed: string[] }}
 */
export function compareThemes(themeA, themeB) {
  const varsA = getThemeVariableNames(themeA);
  const varsB = getThemeVariableNames(themeB);

  const setA = new Set(varsA);
  const setB = new Set(varsB);

  const added = varsB.filter(v => !setA.has(v));
  const removed = varsA.filter(v => !setB.has(v));

  // Check for changed values (in light mode)
  const resultA = processTheme(themeA);
  const resultB = processTheme(themeB);
  const changed = [];

  for (const key of varsA) {
    if (setB.has(key)) {
      const valA = resultA.variables.light?.[key];
      const valB = resultB.variables.light?.[key];
      if (valA !== valB) {
        changed.push(key);
      }
    }
  }

  return { added, removed, changed };
}
