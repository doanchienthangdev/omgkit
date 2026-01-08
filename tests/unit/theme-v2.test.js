/**
 * Theme V2 Unit Tests
 *
 * Tests for v2 schema processing: version detection, $ref resolution,
 * color scales, effects, animations, and migration
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  detectThemeVersion,
  isV2Theme,
  V2_EXTENDED_TOKENS,
  V2_STATUS_COLORS
} from '../../lib/theme.js';
import {
  resolveReference,
  resolveTokenSet,
  expandColorScales,
  processEffects,
  processAnimations,
  migrateV1ToV2,
  processV2Theme,
  getV2CSSVariables,
  validateV2Theme,
  getRequiredV2Tokens,
  generateKeyframesCSS,
  generateV2ThemeCSS,
  processTheme,
  getThemeVariableNames,
  compareThemes
} from '../../lib/theme-v2.js';

// Sample V1 theme for testing
const sampleV1Theme = {
  name: 'Test V1 Theme',
  id: 'test-v1',
  category: 'tech-ai',
  colors: {
    light: {
      background: '0 0% 100%',
      foreground: '240 10% 3.9%',
      primary: '346.8 77.2% 49.8%',
      'primary-foreground': '0 0% 98%',
      secondary: '240 4.8% 95.9%',
      'secondary-foreground': '240 5.9% 10%',
      muted: '240 4.8% 95.9%',
      'muted-foreground': '240 3.8% 46.1%',
      accent: '240 4.8% 95.9%',
      'accent-foreground': '240 5.9% 10%',
      destructive: '0 84.2% 60.2%',
      'destructive-foreground': '0 0% 98%',
      border: '240 5.9% 90%',
      input: '240 5.9% 90%',
      ring: '346.8 77.2% 49.8%',
      card: '0 0% 100%',
      'card-foreground': '240 10% 3.9%',
      popover: '0 0% 100%',
      'popover-foreground': '240 10% 3.9%'
    },
    dark: {
      background: '240 10% 3.9%',
      foreground: '0 0% 98%',
      primary: '346.8 77.2% 49.8%',
      'primary-foreground': '0 0% 98%',
      secondary: '240 3.7% 15.9%',
      'secondary-foreground': '0 0% 98%',
      muted: '240 3.7% 15.9%',
      'muted-foreground': '240 5% 64.9%',
      accent: '240 3.7% 15.9%',
      'accent-foreground': '0 0% 98%',
      destructive: '0 62.8% 30.6%',
      'destructive-foreground': '0 0% 98%',
      border: '240 3.7% 15.9%',
      input: '240 3.7% 15.9%',
      ring: '346.8 77.2% 49.8%',
      card: '240 10% 3.9%',
      'card-foreground': '0 0% 98%',
      popover: '240 10% 3.9%',
      'popover-foreground': '0 0% 98%'
    }
  },
  radius: '0.5rem',
  fontFamily: {
    sans: 'Inter, system-ui, sans-serif',
    mono: 'JetBrains Mono, monospace'
  }
};

// Sample V2 theme for testing
const sampleV2Theme = {
  version: '2.0',
  name: 'Test V2 Theme',
  id: 'test-v2',
  category: 'tech-ai',
  colorSystem: { type: 'radix', version: '3.0' },
  scales: {
    primary: {
      name: 'teal',
      hue: 170,
      steps: {
        light: {
          '1': '165 60% 99%',
          '2': '163 50% 97%',
          '3': '162 60% 93%',
          '4': '164 55% 88%',
          '5': '165 50% 82%',
          '6': '166 45% 75%',
          '7': '168 40% 66%',
          '8': '170 40% 53%',
          '9': '170 80% 36%',
          '10': '171 85% 33%',
          '11': '172 100% 26%',
          '12': '173 70% 15%'
        },
        dark: {
          '1': '173 50% 6%',
          '2': '172 45% 8%',
          '3': '171 50% 11%',
          '4': '171 55% 14%',
          '5': '170 55% 17%',
          '6': '169 50% 21%',
          '7': '168 45% 27%',
          '8': '167 45% 35%',
          '9': '168 76% 33%',
          '10': '167 70% 40%',
          '11': '166 65% 55%',
          '12': '165 60% 85%'
        }
      },
      alpha: {
        light: {
          '1': '165 100% 50% / 0.02',
          '2': '163 100% 40% / 0.05',
          '3': '162 100% 40% / 0.12',
          '4': '164 100% 38% / 0.18',
          '5': '165 100% 36% / 0.26',
          '6': '166 100% 34% / 0.34',
          '7': '168 100% 32% / 0.44',
          '8': '170 100% 30% / 0.58',
          '9': '170 100% 29% / 0.85',
          '10': '171 100% 27% / 0.88',
          '11': '172 100% 26% / 1',
          '12': '173 100% 10% / 0.93'
        },
        dark: {
          '1': '173 100% 50% / 0.02',
          '2': '172 100% 40% / 0.05',
          '3': '171 100% 40% / 0.12',
          '4': '171 100% 38% / 0.18',
          '5': '170 100% 36% / 0.26',
          '6': '169 100% 34% / 0.34',
          '7': '168 100% 32% / 0.44',
          '8': '167 100% 30% / 0.58',
          '9': '168 100% 29% / 0.85',
          '10': '167 100% 27% / 0.88',
          '11': '166 100% 26% / 1',
          '12': '165 100% 10% / 0.93'
        }
      }
    }
  },
  semanticTokens: {
    light: {
      background: '0 0% 100%',
      foreground: '240 10% 3.9%',
      primary: { $ref: 'scales.primary.steps.light.9' },
      'primary-hover': { $ref: 'scales.primary.steps.light.10' },
      'primary-foreground': '0 0% 100%'
    },
    dark: {
      background: '240 10% 3.9%',
      foreground: '0 0% 98%',
      primary: { $ref: 'scales.primary.steps.dark.9' },
      'primary-hover': { $ref: 'scales.primary.steps.dark.10' },
      'primary-foreground': '0 0% 100%'
    }
  },
  statusColors: {
    light: {
      success: '151 55% 42%',
      'success-foreground': '0 0% 100%',
      warning: '39 100% 62%',
      'warning-foreground': '39 40% 20%',
      info: '206 100% 50%',
      'info-foreground': '0 0% 100%',
      destructive: '0 84.2% 60.2%',
      'destructive-foreground': '0 0% 98%'
    },
    dark: {
      success: '151 50% 45%',
      'success-foreground': '0 0% 100%',
      warning: '39 90% 55%',
      'warning-foreground': '39 80% 10%',
      info: '206 90% 55%',
      'info-foreground': '0 0% 100%',
      destructive: '0 62.8% 30.6%',
      'destructive-foreground': '0 0% 98%'
    }
  },
  effects: {
    glassMorphism: {
      background: '0 0% 100% / 0.8',
      backdropBlur: '12px'
    },
    glow: {
      default: '0 0 20px',
      lg: '0 0 40px',
      color: { $ref: 'scales.primary.alpha.light.8' }
    }
  },
  animations: {
    shimmer: {
      keyframes: {
        from: { backgroundPosition: '200% 0' },
        to: { backgroundPosition: '-200% 0' }
      },
      duration: '8s',
      easing: 'ease-in-out',
      iteration: 'infinite'
    }
  },
  typography: {
    fontFamily: {
      sans: 'Inter, system-ui, sans-serif',
      mono: 'JetBrains Mono, monospace'
    }
  },
  spacing: {
    radius: '0.5rem'
  }
};

describe('Version Detection', () => {
  describe('detectThemeVersion', () => {
    it('should detect V1 theme', () => {
      expect(detectThemeVersion(sampleV1Theme)).toBe('1.0');
    });

    it('should detect V2 theme by version field', () => {
      expect(detectThemeVersion({ version: '2.0' })).toBe('2.0');
    });

    it('should detect V2 theme by scales', () => {
      expect(detectThemeVersion({ scales: {} })).toBe('2.0');
    });

    it('should detect V2 theme by semanticTokens', () => {
      expect(detectThemeVersion({ semanticTokens: {} })).toBe('2.0');
    });

    it('should detect V2 theme by effects', () => {
      expect(detectThemeVersion({ effects: {} })).toBe('2.0');
    });

    it('should detect V2 theme by animations', () => {
      expect(detectThemeVersion({ animations: {} })).toBe('2.0');
    });

    it('should detect V2 theme by colorSystem', () => {
      expect(detectThemeVersion({ colorSystem: {} })).toBe('2.0');
    });

    it('should detect V2 theme by statusColors', () => {
      expect(detectThemeVersion({ statusColors: {} })).toBe('2.0');
    });

    it('should return 1.0 for null/undefined', () => {
      expect(detectThemeVersion(null)).toBe('1.0');
      expect(detectThemeVersion(undefined)).toBe('1.0');
    });

    it('should return 1.0 for empty object', () => {
      expect(detectThemeVersion({})).toBe('1.0');
    });
  });

  describe('isV2Theme', () => {
    it('should return true for V2 theme', () => {
      expect(isV2Theme(sampleV2Theme)).toBe(true);
    });

    it('should return false for V1 theme', () => {
      expect(isV2Theme(sampleV1Theme)).toBe(false);
    });
  });
});

describe('$ref Resolution', () => {
  describe('resolveReference', () => {
    it('should resolve simple $ref', () => {
      const result = resolveReference(
        { $ref: 'scales.primary.steps.light.9' },
        sampleV2Theme
      );
      expect(result).toBe('170 80% 36%');
    });

    it('should return non-ref values as-is', () => {
      expect(resolveReference('0 0% 100%', sampleV2Theme)).toBe('0 0% 100%');
      expect(resolveReference(42, sampleV2Theme)).toBe(42);
      expect(resolveReference(null, sampleV2Theme)).toBe(null);
    });

    it('should resolve nested paths', () => {
      const result = resolveReference(
        { $ref: 'scales.primary.alpha.light.8' },
        sampleV2Theme
      );
      expect(result).toBe('170 100% 30% / 0.58');
    });

    it('should throw on circular reference', () => {
      const circularTheme = {
        a: { $ref: 'b' },
        b: { $ref: 'a' }
      };
      expect(() => resolveReference({ $ref: 'a' }, circularTheme))
        .toThrow(/circular reference/i);
    });

    it('should throw on invalid path', () => {
      expect(() => resolveReference({ $ref: 'nonexistent.path' }, sampleV2Theme))
        .toThrow(/invalid reference path/i);
    });

    it('should throw on prototype pollution attempt', () => {
      expect(() => resolveReference({ $ref: '__proto__.polluted' }, sampleV2Theme))
        .toThrow(/security/i);
      expect(() => resolveReference({ $ref: 'constructor.prototype' }, sampleV2Theme))
        .toThrow(/security/i);
    });

    it('should handle max depth', () => {
      // Create deeply nested refs
      const deepTheme = {};
      for (let i = 0; i < 15; i++) {
        deepTheme[`level${i}`] = { $ref: `level${i + 1}` };
      }
      deepTheme.level15 = 'value';

      expect(() => resolveReference({ $ref: 'level0' }, deepTheme))
        .toThrow(/maximum reference depth/i);
    });
  });

  describe('resolveTokenSet', () => {
    it('should resolve all refs in token set', () => {
      const tokens = {
        primary: { $ref: 'scales.primary.steps.light.9' },
        background: '0 0% 100%'
      };
      const resolved = resolveTokenSet(tokens, sampleV2Theme);

      expect(resolved.primary).toBe('170 80% 36%');
      expect(resolved.background).toBe('0 0% 100%');
    });

    it('should handle invalid refs gracefully', () => {
      const tokens = {
        valid: '0 0% 100%',
        invalid: { $ref: 'nonexistent' }
      };
      const resolved = resolveTokenSet(tokens, sampleV2Theme);

      expect(resolved.valid).toBe('0 0% 100%');
      expect(resolved.invalid).toEqual({ $ref: 'nonexistent' });
    });
  });
});

describe('Color Scales', () => {
  describe('expandColorScales', () => {
    it('should expand 12-step scale for light mode', () => {
      const result = expandColorScales(sampleV2Theme.scales, 'light');

      expect(result['teal-1']).toBe('165 60% 99%');
      expect(result['teal-9']).toBe('170 80% 36%');
      expect(result['teal-12']).toBe('173 70% 15%');
    });

    it('should expand 12-step scale for dark mode', () => {
      const result = expandColorScales(sampleV2Theme.scales, 'dark');

      expect(result['teal-1']).toBe('173 50% 6%');
      expect(result['teal-9']).toBe('168 76% 33%');
      expect(result['teal-12']).toBe('165 60% 85%');
    });

    it('should expand alpha variants', () => {
      const result = expandColorScales(sampleV2Theme.scales, 'light');

      expect(result['teal-a1']).toBe('165 100% 50% / 0.02');
      expect(result['teal-a8']).toBe('170 100% 30% / 0.58');
    });

    it('should handle empty scales', () => {
      const result = expandColorScales({}, 'light');
      expect(result).toEqual({});
    });

    it('should handle null scales', () => {
      const result = expandColorScales(null, 'light');
      expect(result).toEqual({});
    });
  });
});

describe('Effects Processing', () => {
  describe('processEffects', () => {
    it('should process glassmorphism', () => {
      const result = processEffects(sampleV2Theme.effects, sampleV2Theme);

      expect(result['glass-background']).toBe('0 0% 100% / 0.8');
      expect(result['glass-blur']).toBe('12px');
    });

    it('should process glow', () => {
      const result = processEffects(sampleV2Theme.effects, sampleV2Theme);

      expect(result['glow']).toBe('0 0 20px');
      expect(result['glow-lg']).toBe('0 0 40px');
      expect(result['glow-color']).toBe('170 100% 30% / 0.58');
    });

    it('should handle empty effects', () => {
      const result = processEffects({}, sampleV2Theme);
      expect(result).toEqual({});
    });

    it('should handle null effects', () => {
      const result = processEffects(null, sampleV2Theme);
      expect(result).toEqual({});
    });
  });
});

describe('Animations Processing', () => {
  describe('processAnimations', () => {
    it('should process keyframes', () => {
      const result = processAnimations(sampleV2Theme.animations);

      expect(result.keyframes.shimmer).toBeDefined();
      expect(result.keyframes.shimmer.from).toEqual({ backgroundPosition: '200% 0' });
      expect(result.keyframes.shimmer.to).toEqual({ backgroundPosition: '-200% 0' });
    });

    it('should build animation shorthand', () => {
      const result = processAnimations(sampleV2Theme.animations);

      expect(result.animations.shimmer).toBe('shimmer 8s ease-in-out infinite');
    });

    it('should handle empty animations', () => {
      const result = processAnimations({});
      expect(result.keyframes).toEqual({});
      expect(result.animations).toEqual({});
    });

    it('should handle null animations', () => {
      const result = processAnimations(null);
      expect(result.keyframes).toEqual({});
      expect(result.animations).toEqual({});
    });
  });
});

describe('V1 to V2 Migration', () => {
  describe('migrateV1ToV2', () => {
    it('should migrate V1 theme to V2 format', () => {
      const v2 = migrateV1ToV2(sampleV1Theme);

      expect(v2.version).toBe('2.0');
      expect(v2.name).toBe(sampleV1Theme.name);
      expect(v2.id).toBe(sampleV1Theme.id);
      expect(v2.category).toBe(sampleV1Theme.category);
    });

    it('should preserve V1 colors in semanticTokens', () => {
      const v2 = migrateV1ToV2(sampleV1Theme);

      expect(v2.semanticTokens.light.background).toBe(sampleV1Theme.colors.light.background);
      expect(v2.semanticTokens.light.primary).toBe(sampleV1Theme.colors.light.primary);
    });

    it('should add V2 extended tokens', () => {
      const v2 = migrateV1ToV2(sampleV1Theme);

      expect(v2.semanticTokens.light.surface).toBeDefined();
      expect(v2.semanticTokens.light['primary-hover']).toBeDefined();
      expect(v2.semanticTokens.light.overlay).toBeDefined();
    });

    it('should add status colors', () => {
      const v2 = migrateV1ToV2(sampleV1Theme);

      expect(v2.statusColors.light.success).toBeDefined();
      expect(v2.statusColors.light.warning).toBeDefined();
      expect(v2.statusColors.light.info).toBeDefined();
    });

    it('should preserve font settings', () => {
      const v2 = migrateV1ToV2(sampleV1Theme);

      expect(v2.typography.fontFamily.sans).toBe(sampleV1Theme.fontFamily.sans);
      expect(v2.typography.fontFamily.mono).toBe(sampleV1Theme.fontFamily.mono);
    });

    it('should preserve radius', () => {
      const v2 = migrateV1ToV2(sampleV1Theme);

      expect(v2.spacing.radius).toBe(sampleV1Theme.radius);
    });

    it('should keep V1 colors for backward compatibility', () => {
      const v2 = migrateV1ToV2(sampleV1Theme);

      expect(v2.colors).toEqual(sampleV1Theme.colors);
    });

    it('should return V2 theme unchanged', () => {
      const result = migrateV1ToV2(sampleV2Theme);
      expect(result).toBe(sampleV2Theme);
    });

    it('should throw on null theme', () => {
      expect(() => migrateV1ToV2(null)).toThrow();
    });
  });
});

describe('V2 Theme Processing', () => {
  describe('processV2Theme', () => {
    it('should process V2 theme for light mode', () => {
      const result = processV2Theme(sampleV2Theme, 'light');

      // Color scales
      expect(result['teal-1']).toBeDefined();
      expect(result['teal-9']).toBe('170 80% 36%');

      // Semantic tokens (resolved)
      expect(result.background).toBe('0 0% 100%');
      expect(result.primary).toBe('170 80% 36%');

      // Status colors
      expect(result.success).toBe('151 55% 42%');
    });

    it('should process V2 theme for dark mode', () => {
      const result = processV2Theme(sampleV2Theme, 'dark');

      expect(result['teal-9']).toBe('168 76% 33%');
      expect(result.background).toBe('240 10% 3.9%');
      expect(result.primary).toBe('168 76% 33%');
    });

    it('should include effects', () => {
      const result = processV2Theme(sampleV2Theme, 'light');

      expect(result['glass-background']).toBeDefined();
      expect(result['glow']).toBeDefined();
    });
  });

  describe('getV2CSSVariables', () => {
    it('should return variables for both modes', () => {
      const result = getV2CSSVariables(sampleV2Theme);

      expect(result.light).toBeDefined();
      expect(result.dark).toBeDefined();
      expect(result.light['teal-9']).toBe('170 80% 36%');
      expect(result.dark['teal-9']).toBe('168 76% 33%');
    });
  });
});

describe('V2 Theme Validation', () => {
  describe('validateV2Theme', () => {
    it('should validate correct V2 theme', () => {
      const result = validateV2Theme(sampleV2Theme);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail on missing required fields', () => {
      const result = validateV2Theme({ version: '2.0' });

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing required field: name');
      expect(result.errors).toContain('Missing required field: id');
      expect(result.errors).toContain('Missing required field: category');
    });

    it('should fail on invalid id format', () => {
      const result = validateV2Theme({
        name: 'Test',
        id: 'Invalid ID',
        category: 'tech-ai'
      });

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Invalid id format'))).toBe(true);
    });

    it('should fail on invalid $ref', () => {
      const theme = {
        name: 'Test',
        id: 'test',
        category: 'tech-ai',
        semanticTokens: {
          light: {
            primary: { $ref: 'nonexistent.path' }
          }
        }
      };
      const result = validateV2Theme(theme);

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Invalid $ref'))).toBe(true);
    });

    it('should fail on null theme', () => {
      const result = validateV2Theme(null);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Theme is null or undefined');
    });
  });
});

describe('Constants', () => {
  it('should have V2_EXTENDED_TOKENS defined', () => {
    expect(V2_EXTENDED_TOKENS).toBeDefined();
    expect(V2_EXTENDED_TOKENS).toContain('surface');
    expect(V2_EXTENDED_TOKENS).toContain('primary-hover');
    expect(V2_EXTENDED_TOKENS).toContain('overlay');
  });

  it('should have V2_STATUS_COLORS defined', () => {
    expect(V2_STATUS_COLORS).toBeDefined();
    expect(V2_STATUS_COLORS).toContain('success');
    expect(V2_STATUS_COLORS).toContain('warning');
    expect(V2_STATUS_COLORS).toContain('info');
  });

  describe('getRequiredV2Tokens', () => {
    it('should return combined required tokens', () => {
      const tokens = getRequiredV2Tokens();

      expect(tokens).toContain('background');
      expect(tokens).toContain('primary');
      expect(tokens).toContain('surface');
      expect(tokens).toContain('success');
    });
  });
});

describe('CSS Generation', () => {
  describe('generateKeyframesCSS', () => {
    it('should generate valid CSS keyframes', () => {
      const keyframes = {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      };

      const css = generateKeyframesCSS(keyframes);

      expect(css).toContain('@keyframes shimmer');
      expect(css).toContain('0%');
      expect(css).toContain('100%');
      expect(css).toContain('background-position');
    });

    it('should convert camelCase to kebab-case', () => {
      const keyframes = {
        fade: {
          from: { opacity: '0', backgroundColor: 'red' },
          to: { opacity: '1', backgroundColor: 'blue' }
        }
      };

      const css = generateKeyframesCSS(keyframes);

      expect(css).toContain('background-color');
      expect(css).not.toContain('backgroundColor');
    });

    it('should handle empty keyframes', () => {
      const css = generateKeyframesCSS({});
      expect(css).toBe('');
    });
  });

  describe('generateV2ThemeCSS', () => {
    it('should generate complete CSS with all sections', () => {
      const css = generateV2ThemeCSS(sampleV2Theme);

      // Header comments
      expect(css).toContain('OMGKIT Theme');
      expect(css).toContain('Version: 2.0');

      // CSS layers
      expect(css).toContain('@layer base');
      expect(css).toContain(':root');
      expect(css).toContain('.dark');

      // Color variables
      expect(css).toContain('--background');
      expect(css).toContain('--primary');
      expect(css).toContain('--teal-9');

      // Typography
      expect(css).toContain('--font-sans');
      expect(css).toContain('--font-mono');

      // Body styles
      expect(css).toContain('font-family: var(--font-sans)');
    });

    it('should include animations when defined', () => {
      const css = generateV2ThemeCSS(sampleV2Theme);

      expect(css).toContain('@keyframes shimmer');
      expect(css).toContain('--animation-shimmer');
    });
  });
});

describe('Unified Theme Processor', () => {
  describe('processTheme', () => {
    it('should process V1 theme as V1', () => {
      const result = processTheme(sampleV1Theme);

      expect(result.version).toBe('1.0');
      expect(result.css).toContain('Version: 1.0');
      expect(result.variables.light).toBeDefined();
      expect(result.variables.dark).toBeDefined();
      expect(result.theme).toBe(sampleV1Theme);
    });

    it('should process V2 theme as V2', () => {
      const result = processTheme(sampleV2Theme);

      expect(result.version).toBe('2.0');
      expect(result.css).toContain('Version: 2.0');
      expect(result.variables.light['teal-9']).toBeDefined();
    });

    it('should force V2 processing on V1 theme', () => {
      const result = processTheme(sampleV1Theme, { forceV2: true });

      expect(result.version).toBe('2.0');
      expect(result.theme.version).toBe('2.0');
      expect(result.theme.semanticTokens).toBeDefined();
    });

    it('should process single mode when specified', () => {
      const result = processTheme(sampleV2Theme, { mode: 'light' });

      expect(result.variables.light).toBeDefined();
      expect(result.variables.dark).toBeUndefined();
    });

    it('should throw on null theme', () => {
      expect(() => processTheme(null)).toThrow('Theme is required');
    });
  });

  describe('getThemeVariableNames', () => {
    it('should return all variable names from V1 theme', () => {
      const names = getThemeVariableNames(sampleV1Theme);

      expect(names).toContain('background');
      expect(names).toContain('primary');
      expect(names).toContain('destructive');
    });

    it('should return all variable names from V2 theme', () => {
      const names = getThemeVariableNames(sampleV2Theme);

      expect(names).toContain('background');
      expect(names).toContain('teal-1');
      expect(names).toContain('teal-9');
      expect(names).toContain('success');
    });

    it('should return unique names', () => {
      const names = getThemeVariableNames(sampleV2Theme);
      const uniqueNames = [...new Set(names)];

      expect(names.length).toBe(uniqueNames.length);
    });
  });

  describe('compareThemes', () => {
    it('should detect added variables', () => {
      const result = compareThemes(sampleV1Theme, sampleV2Theme);

      // V2 has color scales that V1 doesn't have
      expect(result.added).toContain('teal-1');
      expect(result.added).toContain('teal-9');
    });

    it('should detect removed variables', () => {
      // Create a minimal V2 theme
      const minimalV2 = {
        version: '2.0',
        name: 'Minimal',
        id: 'minimal',
        category: 'tech-ai',
        semanticTokens: {
          light: { background: '0 0% 100%' },
          dark: { background: '0 0% 0%' }
        }
      };

      const result = compareThemes(sampleV1Theme, minimalV2);

      expect(result.removed).toContain('primary');
      expect(result.removed).toContain('secondary');
    });

    it('should detect changed values', () => {
      const modifiedV1 = {
        ...sampleV1Theme,
        colors: {
          ...sampleV1Theme.colors,
          light: {
            ...sampleV1Theme.colors.light,
            primary: '200 50% 50%' // Changed from original
          }
        }
      };

      const result = compareThemes(sampleV1Theme, modifiedV1);

      expect(result.changed).toContain('primary');
    });

    it('should return empty arrays for identical themes', () => {
      const result = compareThemes(sampleV1Theme, sampleV1Theme);

      expect(result.added).toHaveLength(0);
      expect(result.removed).toHaveLength(0);
      expect(result.changed).toHaveLength(0);
    });
  });
});
