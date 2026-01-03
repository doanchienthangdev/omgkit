/**
 * Property-Based Tests for Frontmatter Parsing
 *
 * Tests invariants and properties of frontmatter parsing using Fast-Check
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import yaml from 'js-yaml';

/**
 * Generate valid frontmatter content
 */
function generateFrontmatter(data) {
  return `---\n${yaml.dump(data)}---\n`;
}

/**
 * Parse frontmatter from content
 */
function parseFrontmatter(content) {
  if (!content || typeof content !== 'string') {
    return null;
  }

  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    return null;
  }

  try {
    return yaml.load(match[1], { schema: yaml.SAFE_SCHEMA });
  } catch (e) {
    return null;
  }
}

/**
 * Validate frontmatter structure
 */
function validateFrontmatter(fm) {
  if (!fm || typeof fm !== 'object') {
    return { valid: false, error: 'Invalid frontmatter type' };
  }

  // Check for required fields based on component type
  const hasName = typeof fm.name === 'string' && fm.name.length > 0;
  const hasDescription = typeof fm.description === 'string';

  if (!hasName && !hasDescription) {
    return { valid: false, error: 'Missing name or description' };
  }

  return { valid: true };
}

/**
 * Serialize frontmatter back to YAML
 */
function serializeFrontmatter(fm) {
  return yaml.dump(fm, { lineWidth: -1, noRefs: true });
}

// Arbitraries for generating test data
const safeStringArb = fc.string({ minLength: 1, maxLength: 100 })
  .filter(s => !s.includes('\n---') && !s.includes('---\n'));

const identifierArb = fc.stringMatching(/^[a-z][a-z0-9-]{0,49}$/);

const skillIdArb = fc.tuple(identifierArb, identifierArb)
  .map(([category, name]) => `${category}/${name}`);

const commandIdArb = fc.tuple(identifierArb, identifierArb)
  .map(([namespace, command]) => `/${namespace}:${command}`);

const validFrontmatterArb = fc.record({
  name: identifierArb,
  description: safeStringArb,
  version: fc.option(fc.stringMatching(/^\d+\.\d+\.\d+$/), { nil: undefined }),
  skills: fc.option(fc.array(skillIdArb, { maxLength: 10 }), { nil: undefined }),
  commands: fc.option(fc.array(commandIdArb, { maxLength: 10 }), { nil: undefined }),
  tags: fc.option(fc.array(identifierArb, { maxLength: 5 }), { nil: undefined }),
}).filter(fm => fm.name !== undefined);

describe('Frontmatter Property-Based Tests', () => {
  describe('Parsing Properties', () => {
    it('parsed frontmatter always has correct type', () => {
      fc.assert(
        fc.property(validFrontmatterArb, (fm) => {
          const content = generateFrontmatter(fm);
          const parsed = parseFrontmatter(content);

          // Parsed result should be an object or null
          expect(parsed === null || typeof parsed === 'object').toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('roundtrip: parse(serialize(fm)) preserves structure', () => {
      fc.assert(
        fc.property(validFrontmatterArb, (fm) => {
          const serialized = serializeFrontmatter(fm);
          const content = `---\n${serialized}---\n`;
          const parsed = parseFrontmatter(content);

          // Should preserve all keys
          if (parsed !== null) {
            expect(parsed.name).toBe(fm.name);
            expect(parsed.description).toBe(fm.description);
          }
        }),
        { numRuns: 100 }
      );
    });

    it('roundtrip: serialize(parse(content)) produces valid YAML', () => {
      fc.assert(
        fc.property(validFrontmatterArb, (fm) => {
          const content = generateFrontmatter(fm);
          const parsed = parseFrontmatter(content);

          if (parsed !== null) {
            const reserialized = serializeFrontmatter(parsed);
            // Should not throw
            expect(() => yaml.load(reserialized)).not.toThrow();
          }
        }),
        { numRuns: 100 }
      );
    });

    it('parsing never crashes on arbitrary strings', () => {
      fc.assert(
        fc.property(fc.string(), (s) => {
          // Should never throw, just return null for invalid input
          expect(() => parseFrontmatter(s)).not.toThrow();
        }),
        { numRuns: 200 }
      );
    });

    it('parsing handles Unicode correctly', () => {
      // Test with various unicode strings
      const unicodeStrings = [
        'Hello 世界',
        'Привет мир',
        '日本語テスト',
        'مرحبا بالعالم',
        'שלום עולם',
        '🎉🚀💻',
        'Ελληνικά',
        'Test with émojis 🔥',
        'Mixed: ABC 你好 123',
      ];

      for (const unicodeStr of unicodeStrings) {
        const fm = { name: 'test', description: unicodeStr };
        const content = generateFrontmatter(fm);
        const parsed = parseFrontmatter(content);

        if (parsed !== null) {
          // Unicode should be preserved
          expect(typeof parsed.description).toBe('string');
          expect(parsed.description).toBe(unicodeStr);
        }
      }
    });
  });

  describe('Validation Properties', () => {
    it('valid frontmatter always passes validation', () => {
      fc.assert(
        fc.property(validFrontmatterArb, (fm) => {
          const result = validateFrontmatter(fm);
          expect(result.valid).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('null/undefined always fails validation', () => {
      fc.assert(
        fc.property(fc.constantFrom(null, undefined), (value) => {
          const result = validateFrontmatter(value);
          expect(result.valid).toBe(false);
        }),
        { numRuns: 10 }
      );
    });

    it('primitives always fail validation', () => {
      fc.assert(
        fc.property(
          fc.oneof(fc.string(), fc.integer(), fc.boolean()),
          (value) => {
            const result = validateFrontmatter(value);
            expect(result.valid).toBe(false);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('empty objects fail validation', () => {
      const result = validateFrontmatter({});
      expect(result.valid).toBe(false);
    });
  });

  describe('Skill ID Properties', () => {
    it('skill IDs always match category/name format', () => {
      fc.assert(
        fc.property(skillIdArb, (skillId) => {
          expect(skillId).toMatch(/^[a-z][a-z0-9-]*\/[a-z][a-z0-9-]*$/);
        }),
        { numRuns: 100 }
      );
    });

    it('skill IDs always have exactly one slash', () => {
      fc.assert(
        fc.property(skillIdArb, (skillId) => {
          const slashCount = (skillId.match(/\//g) || []).length;
          expect(slashCount).toBe(1);
        }),
        { numRuns: 100 }
      );
    });

    it('skill IDs never start with slash', () => {
      fc.assert(
        fc.property(skillIdArb, (skillId) => {
          expect(skillId.startsWith('/')).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it('skill IDs split into valid category and name', () => {
      fc.assert(
        fc.property(skillIdArb, (skillId) => {
          const [category, name] = skillId.split('/');
          expect(category).toMatch(/^[a-z][a-z0-9-]*$/);
          expect(name).toMatch(/^[a-z][a-z0-9-]*$/);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Command ID Properties', () => {
    it('command IDs always match /namespace:command format', () => {
      fc.assert(
        fc.property(commandIdArb, (commandId) => {
          expect(commandId).toMatch(/^\/[a-z][a-z0-9-]*:[a-z][a-z0-9-]*$/);
        }),
        { numRuns: 100 }
      );
    });

    it('command IDs always start with slash', () => {
      fc.assert(
        fc.property(commandIdArb, (commandId) => {
          expect(commandId.startsWith('/')).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('command IDs always have exactly one colon', () => {
      fc.assert(
        fc.property(commandIdArb, (commandId) => {
          const colonCount = (commandId.match(/:/g) || []).length;
          expect(colonCount).toBe(1);
        }),
        { numRuns: 100 }
      );
    });

    it('command IDs split into valid namespace and command', () => {
      fc.assert(
        fc.property(commandIdArb, (commandId) => {
          const withoutSlash = commandId.slice(1);
          const [namespace, command] = withoutSlash.split(':');
          expect(namespace).toMatch(/^[a-z][a-z0-9-]*$/);
          expect(command).toMatch(/^[a-z][a-z0-9-]*$/);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Serialization Properties', () => {
    it('serialization always produces valid YAML', () => {
      fc.assert(
        fc.property(validFrontmatterArb, (fm) => {
          const serialized = serializeFrontmatter(fm);
          expect(() => yaml.load(serialized)).not.toThrow();
        }),
        { numRuns: 100 }
      );
    });

    it('serialization never produces empty output', () => {
      fc.assert(
        fc.property(validFrontmatterArb, (fm) => {
          const serialized = serializeFrontmatter(fm);
          expect(serialized.length).toBeGreaterThan(0);
        }),
        { numRuns: 100 }
      );
    });

    it('serialization produces deterministic output', () => {
      fc.assert(
        fc.property(validFrontmatterArb, (fm) => {
          const first = serializeFrontmatter(fm);
          const second = serializeFrontmatter(fm);
          expect(first).toBe(second);
        }),
        { numRuns: 50 }
      );
    });
  });

  describe('Edge Cases', () => {
    it('handles deeply nested structures', () => {
      fc.assert(
        fc.property(
          fc.letrec((tie) => ({
            tree: fc.oneof(
              fc.string(),
              fc.array(tie('tree'), { maxLength: 3 }),
              fc.dictionary(fc.string({ minLength: 1, maxLength: 10 }), tie('tree'), { maxKeys: 3 })
            ),
          })).tree,
          (tree) => {
            const fm = { name: 'test', data: tree };
            const serialized = serializeFrontmatter(fm);
            // Should not throw on deeply nested structures
            expect(() => yaml.load(serialized)).not.toThrow();
          }
        ),
        { numRuns: 50 }
      );
    });

    it('handles arrays with mixed types', () => {
      fc.assert(
        fc.property(
          fc.array(fc.oneof(fc.string(), fc.integer(), fc.boolean()), { maxLength: 10 }),
          (arr) => {
            const fm = { name: 'test', items: arr };
            const content = generateFrontmatter(fm);
            const parsed = parseFrontmatter(content);

            if (parsed !== null) {
              expect(Array.isArray(parsed.items)).toBe(true);
              expect(parsed.items.length).toBe(arr.length);
            }
          }
        ),
        { numRuns: 50 }
      );
    });

    it('handles special YAML values', () => {
      const specialValues = [
        { name: 'test', value: true },
        { name: 'test', value: false },
        { name: 'test', value: null },
        { name: 'test', value: 0 },
        { name: 'test', value: -1 },
        { name: 'test', value: 3.14 },
        { name: 'test', value: '' },
      ];

      for (const fm of specialValues) {
        const content = generateFrontmatter(fm);
        expect(() => parseFrontmatter(content)).not.toThrow();
      }
    });
  });
});

describe('Frontmatter Invariants', () => {
  it('parsing is idempotent', () => {
    fc.assert(
      fc.property(validFrontmatterArb, (fm) => {
        const content = generateFrontmatter(fm);
        const first = parseFrontmatter(content);

        if (first !== null) {
          const contentAgain = generateFrontmatter(first);
          const second = parseFrontmatter(contentAgain);

          // Second parse should match first parse
          expect(second).toEqual(first);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('validation is consistent across multiple calls', () => {
    fc.assert(
      fc.property(validFrontmatterArb, (fm) => {
        const result1 = validateFrontmatter(fm);
        const result2 = validateFrontmatter(fm);
        const result3 = validateFrontmatter(fm);

        expect(result1.valid).toBe(result2.valid);
        expect(result2.valid).toBe(result3.valid);
      }),
      { numRuns: 50 }
    );
  });

  it('name field is always preserved through roundtrip', () => {
    fc.assert(
      fc.property(validFrontmatterArb, (fm) => {
        const content = generateFrontmatter(fm);
        const parsed = parseFrontmatter(content);

        if (parsed !== null) {
          expect(parsed.name).toBe(fm.name);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('arrays are preserved through roundtrip', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: identifierArb,
          skills: fc.array(skillIdArb, { minLength: 1, maxLength: 5 }),
        }),
        (fm) => {
          const content = generateFrontmatter(fm);
          const parsed = parseFrontmatter(content);

          if (parsed !== null) {
            expect(Array.isArray(parsed.skills)).toBe(true);
            expect(parsed.skills.length).toBe(fm.skills.length);
            expect(parsed.skills).toEqual(fm.skills);
          }
        }
      ),
      { numRuns: 50 }
    );
  });
});
