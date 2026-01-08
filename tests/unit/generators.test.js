/**
 * Generator Unit Tests
 *
 * Tests for all theme export generators
 */

import { describe, it, expect } from 'vitest';
import {
  GENERATORS,
  getAvailableFormats,
  getGeneratorInfo,
  generateTheme,
  generateAllFormats,
  getFormatExtension
} from '../../lib/generators/index.js';
import { generateCSS, generateCSSForMode } from '../../lib/generators/css.generator.js';
import { generateSCSS, generateSCSSPartial } from '../../lib/generators/scss.generator.js';
import { generateTailwindV2, generateTailwindMinimal } from '../../lib/generators/tailwind.generator.js';
import { generateFigmaTokens, generateTokensStudio } from '../../lib/generators/figma.generator.js';
import { generateStyleDictionary, generateStyleDictionaryConfig } from '../../lib/generators/style-dictionary.generator.js';

// Sample V1 theme
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

// Sample V2 theme
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
          '6': '166 48% 74%',
          '7': '167 45% 62%',
          '8': '168 50% 48%',
          '9': '170 80% 36%',
          '10': '171 82% 32%',
          '11': '172 85% 26%',
          '12': '173 90% 16%'
        },
        dark: {
          '1': '170 20% 7%',
          '2': '169 25% 10%',
          '3': '168 30% 14%',
          '4': '167 35% 18%',
          '5': '168 40% 22%',
          '6': '169 45% 27%',
          '7': '168 50% 33%',
          '8': '168 60% 40%',
          '9': '168 76% 33%',
          '10': '167 78% 38%',
          '11': '166 70% 55%',
          '12': '165 65% 75%'
        }
      }
    }
  },
  semanticTokens: {
    light: {
      background: '0 0% 100%',
      foreground: '240 10% 3.9%',
      primary: { $ref: 'scales.primary.steps.light.9' },
      'primary-foreground': '0 0% 98%'
    },
    dark: {
      background: '240 10% 3.9%',
      foreground: '0 0% 98%',
      primary: { $ref: 'scales.primary.steps.dark.9' },
      'primary-foreground': '0 0% 98%'
    }
  },
  statusColors: {
    light: {
      success: '151 55% 42%',
      'success-foreground': '0 0% 100%',
      warning: '39 100% 62%',
      'warning-foreground': '39 40% 20%',
      info: '206 100% 50%',
      'info-foreground': '0 0% 100%'
    },
    dark: {
      success: '151 50% 45%',
      'success-foreground': '0 0% 100%',
      warning: '39 90% 55%',
      'warning-foreground': '39 80% 10%',
      info: '206 90% 55%',
      'info-foreground': '0 0% 100%'
    }
  },
  typography: {
    fontFamily: {
      sans: 'Inter, system-ui, sans-serif',
      mono: 'JetBrains Mono, monospace'
    }
  },
  spacing: {
    radius: '0.625rem'
  },
  animations: {
    shimmer: {
      duration: '8s',
      easing: 'ease-in-out',
      iteration: 'infinite',
      keyframes: {
        '0%': { backgroundPosition: '-200% 0' },
        '100%': { backgroundPosition: '200% 0' }
      }
    }
  }
};

describe('Generator Factory', () => {
  describe('GENERATORS', () => {
    it('should have all expected generators', () => {
      expect(GENERATORS.css).toBeDefined();
      expect(GENERATORS.scss).toBeDefined();
      expect(GENERATORS.tailwind).toBeDefined();
      expect(GENERATORS.figma).toBeDefined();
      expect(GENERATORS['style-dictionary']).toBeDefined();
    });

    it('should have fn, ext, and name for each generator', () => {
      for (const [name, gen] of Object.entries(GENERATORS)) {
        expect(gen.fn).toBeTypeOf('function');
        expect(gen.ext).toBeTypeOf('string');
        expect(gen.name).toBeTypeOf('string');
      }
    });
  });

  describe('getAvailableFormats', () => {
    it('should return all format names', () => {
      const formats = getAvailableFormats();

      expect(formats).toContain('css');
      expect(formats).toContain('scss');
      expect(formats).toContain('tailwind');
      expect(formats).toContain('figma');
      expect(formats).toContain('style-dictionary');
    });
  });

  describe('getGeneratorInfo', () => {
    it('should return generator info', () => {
      const info = getGeneratorInfo('css');

      expect(info.name).toBe('CSS');
      expect(info.fn).toBeTypeOf('function');
      expect(info.ext).toBe('.css');
    });

    it('should return null for unknown format', () => {
      expect(getGeneratorInfo('unknown')).toBeNull();
    });
  });

  describe('generateTheme', () => {
    it('should generate CSS output', () => {
      const output = generateTheme(sampleV1Theme, 'css');

      expect(output).toContain('--background');
      expect(output).toContain('--primary');
    });

    it('should throw on unknown format', () => {
      expect(() => generateTheme(sampleV1Theme, 'unknown'))
        .toThrow('Unknown format');
    });
  });

  describe('generateAllFormats', () => {
    it('should generate all formats', () => {
      const results = generateAllFormats(sampleV1Theme);

      expect(results.css.success).toBe(true);
      expect(results.scss.success).toBe(true);
      expect(results.tailwind.success).toBe(true);
      expect(results.figma.success).toBe(true);
      expect(results['style-dictionary'].success).toBe(true);
    });

    it('should include content and extension', () => {
      const results = generateAllFormats(sampleV1Theme);

      expect(results.css.content).toBeTypeOf('string');
      expect(results.css.ext).toBe('.css');
    });
  });

  describe('getFormatExtension', () => {
    it('should return correct extensions', () => {
      expect(getFormatExtension('css')).toBe('.css');
      expect(getFormatExtension('scss')).toBe('.scss');
      expect(getFormatExtension('tailwind')).toBe('.js');
      expect(getFormatExtension('figma')).toBe('.json');
    });

    it('should return .txt for unknown', () => {
      expect(getFormatExtension('unknown')).toBe('.txt');
    });
  });
});

describe('CSS Generator', () => {
  describe('generateCSS', () => {
    it('should generate valid CSS for V1 theme', () => {
      const css = generateCSS(sampleV1Theme);

      expect(css).toContain('OMGKIT Theme');
      expect(css).toContain('Version: 1.0');
      expect(css).toContain('@layer base');
      expect(css).toContain(':root');
      expect(css).toContain('.dark');
      expect(css).toContain('--background');
      expect(css).toContain('--primary');
    });

    it('should generate valid CSS for V2 theme', () => {
      const css = generateCSS(sampleV2Theme);

      expect(css).toContain('Version: 2.0');
      expect(css).toContain('--teal-9');
      expect(css).toContain('--success');
    });

    it('should include radius and fonts', () => {
      const css = generateCSS(sampleV1Theme);

      expect(css).toContain('--radius');
      expect(css).toContain('--font-sans');
      expect(css).toContain('--font-mono');
    });

    it('should include animations for V2', () => {
      const css = generateCSS(sampleV2Theme);

      expect(css).toContain('@keyframes shimmer');
      expect(css).toContain('--animation-shimmer');
    });

    it('should respect includeBase option', () => {
      const css = generateCSS(sampleV1Theme, { includeBase: false });

      expect(css).not.toContain('@layer base');
      expect(css).toContain(':root');
    });
  });

  describe('generateCSSForMode', () => {
    it('should generate light mode only', () => {
      const css = generateCSSForMode(sampleV1Theme, 'light');

      expect(css).toContain('--background: 0 0% 100%');
      expect(css).not.toContain('.dark');
    });

    it('should generate dark mode only', () => {
      const css = generateCSSForMode(sampleV1Theme, 'dark');

      expect(css).toContain('--background: 240 10% 3.9%');
    });
  });
});

describe('SCSS Generator', () => {
  describe('generateSCSS', () => {
    it('should generate valid SCSS', () => {
      const scss = generateSCSS(sampleV1Theme);

      expect(scss).toContain('// OMGKIT Theme');
      expect(scss).toContain('$theme-font-sans');
      expect(scss).toContain('$theme-light-background');
    });

    it('should include Sass maps', () => {
      const scss = generateSCSS(sampleV1Theme);

      expect(scss).toContain('$theme-colors-light');
      expect(scss).toContain('$theme-colors-dark');
    });

    it('should include mixins', () => {
      const scss = generateSCSS(sampleV1Theme);

      expect(scss).toContain('@function theme-color');
      expect(scss).toContain('@mixin theme-bg');
      expect(scss).toContain('@mixin theme-root');
    });

    it('should respect prefix option', () => {
      const scss = generateSCSS(sampleV1Theme, { prefix: 'myapp' });

      expect(scss).toContain('$myapp-font-sans');
      expect(scss).toContain('$myapp-colors-light');
    });
  });

  describe('generateSCSSPartial', () => {
    it('should not include mixins', () => {
      const scss = generateSCSSPartial(sampleV1Theme);

      expect(scss).not.toContain('@mixin');
      expect(scss).toContain('$theme-colors-light');
    });
  });
});

describe('Tailwind Generator', () => {
  describe('generateTailwindV2', () => {
    it('should generate valid TypeScript config', () => {
      const config = generateTailwindV2(sampleV1Theme);

      expect(config).toContain('import type { Config }');
      expect(config).toContain('const config: Config');
      expect(config).toContain('export default config');
      expect(config).toContain('darkMode: ["class"]');
    });

    it('should include semantic colors', () => {
      const config = generateTailwindV2(sampleV1Theme);

      expect(config).toContain('background: "hsl(var(--background))"');
      expect(config).toContain('primary:');
      expect(config).toContain('destructive:');
    });

    it('should include color scales for V2', () => {
      const config = generateTailwindV2(sampleV2Theme);

      expect(config).toContain('teal:');
      expect(config).toContain('"1": "hsl(var(--teal-1))"');
      expect(config).toContain('"9": "hsl(var(--teal-9))"');
    });

    it('should include animations for V2', () => {
      const config = generateTailwindV2(sampleV2Theme);

      expect(config).toContain('animation:');
      expect(config).toContain('keyframes:');
      expect(config).toContain('shimmer');
    });

    it('should generate JavaScript format', () => {
      const config = generateTailwindV2(sampleV1Theme, { format: 'js' });

      expect(config).toContain('module.exports =');
      expect(config).not.toContain('import type');
    });
  });

  describe('generateTailwindMinimal', () => {
    it('should not include color scales', () => {
      const config = generateTailwindMinimal(sampleV2Theme);

      expect(config).not.toContain('teal:');
    });

    it('should not include animations', () => {
      const config = generateTailwindMinimal(sampleV2Theme);

      expect(config).not.toContain('animation:');
      expect(config).not.toContain('keyframes:');
    });
  });
});

describe('Figma Generator', () => {
  describe('generateFigmaTokens', () => {
    it('should generate valid JSON', () => {
      const json = generateFigmaTokens(sampleV1Theme);
      const tokens = JSON.parse(json);

      expect(tokens.$themes).toBeDefined();
      expect(tokens.global).toBeDefined();
      expect(tokens.light).toBeDefined();
      expect(tokens.dark).toBeDefined();
    });

    it('should include metadata', () => {
      const tokens = JSON.parse(generateFigmaTokens(sampleV1Theme));

      expect(tokens.$metadata.generator).toBe('OMGKIT Design System');
      expect(tokens.$metadata.themeId).toBe('test-v1');
    });

    it('should include theme sets', () => {
      const tokens = JSON.parse(generateFigmaTokens(sampleV1Theme));

      expect(tokens.$themes).toHaveLength(2);
      expect(tokens.$themes[0].name).toContain('Light');
      expect(tokens.$themes[1].name).toContain('Dark');
    });

    it('should include typography tokens', () => {
      const tokens = JSON.parse(generateFigmaTokens(sampleV1Theme));

      expect(tokens.global.typography.fontFamily.sans).toBeDefined();
      expect(tokens.global.typography.fontSize).toBeDefined();
    });

    it('should include color tokens', () => {
      const tokens = JSON.parse(generateFigmaTokens(sampleV1Theme));

      expect(tokens.light.colors).toBeDefined();
      expect(tokens.dark.colors).toBeDefined();
    });
  });

  describe('generateTokensStudio', () => {
    it('should generate valid tokens', () => {
      const json = generateTokensStudio(sampleV1Theme);
      const tokens = JSON.parse(json);

      expect(tokens.$themes).toBeDefined();
    });
  });
});

describe('Style Dictionary Generator', () => {
  describe('generateStyleDictionary', () => {
    it('should generate valid JSON', () => {
      const json = generateStyleDictionary(sampleV1Theme);
      const tokens = JSON.parse(json);

      expect(tokens.color).toBeDefined();
      expect(tokens.font).toBeDefined();
      expect(tokens.spacing).toBeDefined();
      expect(tokens.radius).toBeDefined();
    });

    it('should include metadata', () => {
      const tokens = JSON.parse(generateStyleDictionary(sampleV1Theme));

      expect(tokens.$meta.generator).toBe('OMGKIT Design System');
      expect(tokens.$meta.themeId).toBe('test-v1');
    });

    it('should include font tokens', () => {
      const tokens = JSON.parse(generateStyleDictionary(sampleV1Theme));

      expect(tokens.font.family.sans).toBeDefined();
      expect(tokens.font.size.base).toBeDefined();
      expect(tokens.font.weight.bold).toBeDefined();
    });

    it('should include spacing tokens', () => {
      const tokens = JSON.parse(generateStyleDictionary(sampleV1Theme));

      expect(tokens.spacing['4']).toBeDefined();
      expect(tokens.spacing['4'].value).toBe('1rem');
    });

    it('should use flat structure when specified', () => {
      const tokens = JSON.parse(generateStyleDictionary(sampleV1Theme, {
        flatStructure: true
      }));

      expect(tokens.color.light.background).toBeDefined();
      expect(tokens.color.dark.background).toBeDefined();
    });
  });

  describe('generateStyleDictionaryConfig', () => {
    it('should generate valid config', () => {
      const json = generateStyleDictionaryConfig(sampleV1Theme);
      const config = JSON.parse(json);

      expect(config.source).toBeDefined();
      expect(config.platforms.css).toBeDefined();
      expect(config.platforms.scss).toBeDefined();
      expect(config.platforms.js).toBeDefined();
    });
  });
});
