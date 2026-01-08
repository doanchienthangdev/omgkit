/**
 * Design System Validation Tests
 *
 * Validates the OMGKIT design system:
 * - All 30 themes exist and are valid
 * - Theme schema is properly structured
 * - Design commands are registered
 * - Theme library functions work correctly
 * - CSS generation produces valid output
 *
 * @module tests/validation/design-system.test
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import {
  loadAllThemes,
  getThemeById,
  getAllThemeIds,
  validateTheme,
  generateThemeCSS,
  THEME_CATEGORIES,
  REQUIRED_COLORS,
  hexToHsl,
  hslToHex
} from '../../lib/theme.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PLUGIN_DIR = join(__dirname, '../../plugin');
const TEMPLATES_DIR = join(__dirname, '../../templates');

// =============================================================================
// THEME FILE VALIDATION
// =============================================================================

describe('Design System - Theme Files', () => {
  const themesDir = join(TEMPLATES_DIR, 'design', 'themes');

  it('should have themes directory', () => {
    expect(existsSync(themesDir)).toBe(true);
  });

  it('should have all 5 theme categories', () => {
    const expectedCategories = [
      'tech-ai',
      'minimal-clean',
      'corporate-enterprise',
      'creative-bold',
      'nature-organic'
    ];

    for (const category of expectedCategories) {
      const categoryDir = join(themesDir, category);
      expect(existsSync(categoryDir), `Category ${category} should exist`).toBe(true);
    }
  });

  it('should have exactly 6 themes per category (30 total)', () => {
    const categories = readdirSync(themesDir).filter(f =>
      statSync(join(themesDir, f)).isDirectory()
    );

    expect(categories.length).toBe(5);

    let totalThemes = 0;
    for (const category of categories) {
      const categoryDir = join(themesDir, category);
      const themes = readdirSync(categoryDir).filter(f => f.endsWith('.json'));
      expect(themes.length, `Category ${category} should have 6 themes`).toBe(6);
      totalThemes += themes.length;
    }

    expect(totalThemes).toBe(30);
  });

  it('should have valid theme schema file', () => {
    const schemaPath = join(TEMPLATES_DIR, 'design', 'schema', 'theme.schema.json');
    expect(existsSync(schemaPath)).toBe(true);

    const schema = JSON.parse(readFileSync(schemaPath, 'utf8'));
    expect(schema.$schema).toBeDefined();
    expect(schema.type).toBe('object');
    expect(schema.required).toContain('name');
    expect(schema.required).toContain('id');
    expect(schema.required).toContain('colors');
  });
});

// =============================================================================
// THEME CONTENT VALIDATION
// =============================================================================

describe('Design System - Theme Content', () => {
  const themes = loadAllThemes();
  const allThemeIds = getAllThemeIds();

  it('should load all 30 themes', () => {
    expect(allThemeIds.length).toBe(30);
  });

  it('should have unique theme IDs', () => {
    const uniqueIds = new Set(allThemeIds);
    expect(uniqueIds.size).toBe(allThemeIds.length);
  });

  // Test each category
  for (const [categoryId, categoryThemes] of Object.entries(themes)) {
    describe(`Category: ${categoryId}`, () => {
      it(`should have THEME_CATEGORIES entry`, () => {
        expect(THEME_CATEGORIES[categoryId]).toBeDefined();
        expect(THEME_CATEGORIES[categoryId].name).toBeDefined();
        expect(THEME_CATEGORIES[categoryId].emoji).toBeDefined();
      });

      it(`should have 6 themes`, () => {
        expect(categoryThemes.length).toBe(6);
      });

      // Validate each theme in the category
      for (const theme of categoryThemes) {
        describe(`Theme: ${theme.id}`, () => {
          it('should have required fields', () => {
            expect(theme.name).toBeDefined();
            expect(theme.id).toBeDefined();
            expect(theme.category).toBe(categoryId);
            expect(theme.colors).toBeDefined();
            expect(theme.colors.light).toBeDefined();
            expect(theme.colors.dark).toBeDefined();
          });

          it('should have valid ID format (kebab-case)', () => {
            expect(theme.id).toMatch(/^[a-z0-9-]+$/);
          });

          it('should pass validation', () => {
            const result = validateTheme(theme);
            expect(result.valid, `Validation errors: ${result.errors.join(', ')}`).toBe(true);
          });

          it('should have all required colors in light mode', () => {
            for (const color of REQUIRED_COLORS) {
              expect(
                theme.colors.light[color],
                `Missing light.${color}`
              ).toBeDefined();
            }
          });

          it('should have all required colors in dark mode', () => {
            for (const color of REQUIRED_COLORS) {
              expect(
                theme.colors.dark[color],
                `Missing dark.${color}`
              ).toBeDefined();
            }
          });

          it('should have valid HSL color format', () => {
            const hslRegex = /^\d+(\.\d+)?\s+\d+(\.\d+)?%\s+\d+(\.\d+)?%$/;

            for (const [key, value] of Object.entries(theme.colors.light)) {
              if (typeof value === 'string') {
                expect(
                  hslRegex.test(value),
                  `Invalid HSL for light.${key}: ${value}`
                ).toBe(true);
              }
            }

            for (const [key, value] of Object.entries(theme.colors.dark)) {
              if (typeof value === 'string') {
                expect(
                  hslRegex.test(value),
                  `Invalid HSL for dark.${key}: ${value}`
                ).toBe(true);
              }
            }
          });

          it('should generate valid CSS', () => {
            const css = generateThemeCSS(theme);
            expect(css).toContain(':root');
            expect(css).toContain('.dark');
            expect(css).toContain('--background:');
            expect(css).toContain('--primary:');
            expect(css).toContain('--radius:');
          });
        });
      }
    });
  }
});

// =============================================================================
// THEME LIBRARY FUNCTIONS
// =============================================================================

describe('Design System - Theme Library', () => {
  it('should get theme by ID', () => {
    const theme = getThemeById('neo-tokyo');
    expect(theme).not.toBeNull();
    expect(theme.name).toBe('Neo Tokyo');
  });

  it('should return null for non-existent theme', () => {
    const theme = getThemeById('non-existent-theme');
    expect(theme).toBeNull();
  });

  it('should convert hex to HSL correctly', () => {
    // Test a known color: #E11D48 (rose-600)
    const hsl = hexToHsl('#E11D48');
    expect(hsl).toMatch(/^\d+(\.\d+)?\s+\d+(\.\d+)?%\s+\d+(\.\d+)?%$/);

    // Hue should be around 347
    const parts = hsl.split(/\s+/);
    const hue = parseFloat(parts[0]);
    expect(hue).toBeGreaterThan(340);
    expect(hue).toBeLessThan(355);
  });

  it('should convert HSL to hex correctly', () => {
    // Test with a simple HSL
    const hex = hslToHex('0 100% 50%'); // Pure red
    expect(hex).toMatch(/^#[0-9A-F]{6}$/);
    expect(hex).toBe('#FF0000');
  });

  it('should have valid THEME_CATEGORIES', () => {
    expect(Object.keys(THEME_CATEGORIES).length).toBe(5);
    for (const [id, category] of Object.entries(THEME_CATEGORIES)) {
      expect(category.name).toBeDefined();
      expect(category.description).toBeDefined();
      expect(category.emoji).toBeDefined();
    }
  });

  it('should have correct REQUIRED_COLORS count', () => {
    // shadcn requires these colors
    expect(REQUIRED_COLORS).toContain('background');
    expect(REQUIRED_COLORS).toContain('foreground');
    expect(REQUIRED_COLORS).toContain('primary');
    expect(REQUIRED_COLORS).toContain('primary-foreground');
    expect(REQUIRED_COLORS).toContain('secondary');
    expect(REQUIRED_COLORS).toContain('muted');
    expect(REQUIRED_COLORS).toContain('accent');
    expect(REQUIRED_COLORS).toContain('destructive');
    expect(REQUIRED_COLORS).toContain('border');
    expect(REQUIRED_COLORS).toContain('input');
    expect(REQUIRED_COLORS).toContain('ring');
  });
});

// =============================================================================
// DESIGN COMMANDS VALIDATION
// =============================================================================

describe('Design System - Commands', () => {
  const commandsDir = join(PLUGIN_DIR, 'commands', 'design');

  const expectedCommands = [
    'themes.md',
    'theme.md',
    'preview.md',
    'add.md',
    'from-screenshot.md',
    'from-url.md',
    'builder.md',
    'reset.md',
    // Theme rebuild commands
    'rebuild.md',
    'scan.md',
    'rollback.md'
  ];

  it('should have design commands directory', () => {
    expect(existsSync(commandsDir)).toBe(true);
  });

  for (const command of expectedCommands) {
    it(`should have ${command}`, () => {
      const commandPath = join(commandsDir, command);
      expect(existsSync(commandPath), `Missing command: ${command}`).toBe(true);
    });

    it(`${command} should have valid frontmatter`, () => {
      const commandPath = join(commandsDir, command);
      const content = readFileSync(commandPath, 'utf8');

      // Check frontmatter exists
      expect(content).toMatch(/^---\n[\s\S]*?\n---/);

      // Parse frontmatter
      const match = content.match(/^---\n([\s\S]*?)\n---/);
      const frontmatter = yaml.load(match[1]);

      expect(frontmatter.description).toBeDefined();
      expect(frontmatter.description.length).toBeGreaterThan(0);
    });
  }
});

// =============================================================================
// REGISTRY VALIDATION
// =============================================================================

describe('Design System - Registry', () => {
  const registryPath = join(PLUGIN_DIR, 'registry.yaml');
  let registry;

  beforeAll(() => {
    const content = readFileSync(registryPath, 'utf8');
    registry = yaml.load(content);
  });

  it('should have design namespace in command_namespaces', () => {
    expect(registry.command_namespaces).toContain('design');
  });

  it('should have ui-ux-designer agent with design commands', () => {
    const agent = registry.agents['ui-ux-designer'];
    expect(agent).toBeDefined();
    expect(agent.commands).toContain('/design:themes');
    expect(agent.commands).toContain('/design:theme');
    expect(agent.commands).toContain('/design:preview');
    expect(agent.commands).toContain('/design:add');
    expect(agent.commands).toContain('/design:from-screenshot');
    expect(agent.commands).toContain('/design:from-url');
    expect(agent.commands).toContain('/design:builder');
    expect(agent.commands).toContain('/design:reset');
  });
});

// =============================================================================
// SPECIFIC THEME TESTS
// =============================================================================

describe('Design System - Specific Themes', () => {
  const themeIds = [
    // tech-ai
    'neo-tokyo', 'electric-cyan', 'neural-dark', 'matrix-green', 'quantum-purple', 'hologram',
    // minimal-clean
    'minimal-slate', 'paper', 'mono', 'zen', 'nordic', 'swiss',
    // corporate-enterprise
    'ocean-blue', 'corporate-indigo', 'finance', 'legal', 'healthcare', 'consulting',
    // creative-bold
    'coral-sunset', 'candy', 'neon', 'gradient-dream', 'retro', 'studio',
    // nature-organic
    'forest', 'ocean', 'desert', 'lavender', 'arctic', 'autumn'
  ];

  for (const themeId of themeIds) {
    it(`should have theme: ${themeId}`, () => {
      const theme = getThemeById(themeId);
      expect(theme, `Theme ${themeId} not found`).not.toBeNull();
      expect(theme.id).toBe(themeId);
    });
  }
});
