/**
 * Property-Based Tests for Skill ID Validation
 *
 * Tests invariants of skill ID format and validation using Fast-Check
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * Validate skill ID format
 * Format: category/skill-name
 */
function validateSkillId(skillId) {
  if (!skillId || typeof skillId !== 'string') {
    return { valid: false, error: 'Invalid skill ID type' };
  }

  // Must not start with /
  if (skillId.startsWith('/')) {
    return { valid: false, error: 'Skill ID must not start with /' };
  }

  // Must contain exactly one /
  const slashCount = (skillId.match(/\//g) || []).length;
  if (slashCount !== 1) {
    return { valid: false, error: 'Skill ID must have exactly one /' };
  }

  // Check for traversal
  if (skillId.includes('..')) {
    return { valid: false, error: 'Path traversal detected' };
  }

  // Parse category and name
  const [category, name] = skillId.split('/');

  // Validate category
  if (!category || !/^[a-z][a-z0-9-]*$/.test(category)) {
    return { valid: false, error: 'Invalid category format' };
  }

  // Validate skill name
  if (!name || !/^[a-z][a-z0-9-]*$/.test(name)) {
    return { valid: false, error: 'Invalid skill name format' };
  }

  return { valid: true };
}

/**
 * Parse skill ID into components
 */
function parseSkillId(skillId) {
  const validation = validateSkillId(skillId);
  if (!validation.valid) {
    return null;
  }

  const [category, name] = skillId.split('/');
  return { category, name };
}

/**
 * Construct skill ID from components
 */
function constructSkillId(category, name) {
  return `${category}/${name}`;
}

/**
 * Normalize skill ID (lowercase, trim)
 */
function normalizeSkillId(skillId) {
  if (!skillId || typeof skillId !== 'string') {
    return null;
  }

  return skillId.trim().toLowerCase();
}

/**
 * Get skill file path from ID
 */
function getSkillPath(skillId) {
  const parsed = parseSkillId(skillId);
  if (!parsed) {
    return null;
  }

  return `skills/${parsed.category}/${parsed.name}/SKILL.md`;
}

/**
 * Check if skill ID matches a category pattern
 */
function matchesCategory(skillId, categoryPattern) {
  const parsed = parseSkillId(skillId);
  if (!parsed) {
    return false;
  }

  if (categoryPattern instanceof RegExp) {
    return categoryPattern.test(parsed.category);
  }

  return parsed.category === categoryPattern;
}

// Arbitraries
const categoryArb = fc.stringMatching(/^[a-z][a-z0-9-]{0,20}$/);
const skillNameArb = fc.stringMatching(/^[a-z][a-z0-9-]{0,30}$/);

const validSkillIdArb = fc.tuple(categoryArb, skillNameArb)
  .map(([cat, name]) => `${cat}/${name}`);

const invalidSkillIdArb = fc.oneof(
  // Starting with /
  fc.tuple(categoryArb, skillNameArb).map(([cat, name]) => `/${cat}/${name}`),
  // No slash
  fc.tuple(categoryArb, skillNameArb).map(([cat, name]) => `${cat}${name}`),
  // Multiple slashes
  fc.tuple(categoryArb, skillNameArb, skillNameArb)
    .map(([cat, n1, n2]) => `${cat}/${n1}/${n2}`),
  // Empty category
  skillNameArb.map(name => `/${name}`),
  // Empty name
  categoryArb.map(cat => `${cat}/`),
  // Path traversal
  fc.tuple(categoryArb, skillNameArb).map(([cat, name]) => `${cat}/../${name}`),
  // Uppercase
  fc.tuple(categoryArb, skillNameArb)
    .map(([cat, name]) => `${cat.toUpperCase()}/${name.toUpperCase()}`),
);

const wellKnownCategoriesArb = fc.constantFrom(
  'testing', 'methodology', 'ai-engineering', 'databases',
  'frameworks', 'frontend', 'backend', 'devops', 'security'
);

const wellKnownSkillsArb = fc.constantFrom(
  'omega-testing', 'tdd', 'property-testing', 'mutation-testing',
  'rag-systems', 'postgresql', 'react', 'nextjs', 'docker'
);

describe('Skill ID Property-Based Tests', () => {
  describe('Validation Properties', () => {
    it('valid skill IDs always pass validation', () => {
      fc.assert(
        fc.property(validSkillIdArb, (skillId) => {
          const result = validateSkillId(skillId);
          expect(result.valid).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('invalid skill IDs always fail validation', () => {
      fc.assert(
        fc.property(invalidSkillIdArb, (skillId) => {
          const result = validateSkillId(skillId);
          expect(result.valid).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it('null/undefined always fail validation', () => {
      fc.assert(
        fc.property(fc.constantFrom(null, undefined), (value) => {
          const result = validateSkillId(value);
          expect(result.valid).toBe(false);
        }),
        { numRuns: 10 }
      );
    });

    it('numbers always fail validation', () => {
      fc.assert(
        fc.property(fc.integer(), (value) => {
          const result = validateSkillId(value);
          expect(result.valid).toBe(false);
        }),
        { numRuns: 50 }
      );
    });

    it('empty string fails validation', () => {
      const result = validateSkillId('');
      expect(result.valid).toBe(false);
    });
  });

  describe('Format Properties', () => {
    it('valid skill IDs never start with /', () => {
      fc.assert(
        fc.property(validSkillIdArb, (skillId) => {
          expect(skillId.startsWith('/')).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it('valid skill IDs always contain exactly one /', () => {
      fc.assert(
        fc.property(validSkillIdArb, (skillId) => {
          const slashCount = (skillId.match(/\//g) || []).length;
          expect(slashCount).toBe(1);
        }),
        { numRuns: 100 }
      );
    });

    it('valid skill IDs are always lowercase', () => {
      fc.assert(
        fc.property(validSkillIdArb, (skillId) => {
          expect(skillId).toBe(skillId.toLowerCase());
        }),
        { numRuns: 100 }
      );
    });

    it('valid skill IDs have no spaces', () => {
      fc.assert(
        fc.property(validSkillIdArb, (skillId) => {
          expect(skillId).not.toContain(' ');
        }),
        { numRuns: 100 }
      );
    });

    it('valid skill IDs never contain ".."', () => {
      fc.assert(
        fc.property(validSkillIdArb, (skillId) => {
          expect(skillId).not.toContain('..');
        }),
        { numRuns: 100 }
      );
    });

    it('category and name only contain allowed characters', () => {
      fc.assert(
        fc.property(validSkillIdArb, (skillId) => {
          const parsed = parseSkillId(skillId);
          if (parsed) {
            expect(parsed.category).toMatch(/^[a-z][a-z0-9-]*$/);
            expect(parsed.name).toMatch(/^[a-z][a-z0-9-]*$/);
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Parsing Properties', () => {
    it('valid skill IDs can be parsed', () => {
      fc.assert(
        fc.property(validSkillIdArb, (skillId) => {
          const parsed = parseSkillId(skillId);
          expect(parsed).not.toBeNull();
        }),
        { numRuns: 100 }
      );
    });

    it('invalid skill IDs cannot be parsed', () => {
      fc.assert(
        fc.property(invalidSkillIdArb, (skillId) => {
          const parsed = parseSkillId(skillId);
          expect(parsed).toBeNull();
        }),
        { numRuns: 100 }
      );
    });

    it('parsed skill has category and name fields', () => {
      fc.assert(
        fc.property(validSkillIdArb, (skillId) => {
          const parsed = parseSkillId(skillId);
          if (parsed) {
            expect(typeof parsed.category).toBe('string');
            expect(typeof parsed.name).toBe('string');
            expect(parsed.category.length).toBeGreaterThan(0);
            expect(parsed.name.length).toBeGreaterThan(0);
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Construction Properties', () => {
    it('constructed skill IDs are valid', () => {
      fc.assert(
        fc.property(categoryArb, skillNameArb, (cat, name) => {
          const skillId = constructSkillId(cat, name);
          const result = validateSkillId(skillId);
          expect(result.valid).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('construction is the inverse of parsing', () => {
      fc.assert(
        fc.property(categoryArb, skillNameArb, (cat, name) => {
          const constructed = constructSkillId(cat, name);
          const parsed = parseSkillId(constructed);
          expect(parsed.category).toBe(cat);
          expect(parsed.name).toBe(name);
        }),
        { numRuns: 100 }
      );
    });

    it('parsing is the inverse of construction', () => {
      fc.assert(
        fc.property(validSkillIdArb, (skillId) => {
          const parsed = parseSkillId(skillId);
          if (parsed) {
            const reconstructed = constructSkillId(parsed.category, parsed.name);
            expect(reconstructed).toBe(skillId);
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Path Generation Properties', () => {
    it('skill path always ends with SKILL.md', () => {
      fc.assert(
        fc.property(validSkillIdArb, (skillId) => {
          const path = getSkillPath(skillId);
          expect(path.endsWith('SKILL.md')).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('skill path always starts with skills/', () => {
      fc.assert(
        fc.property(validSkillIdArb, (skillId) => {
          const path = getSkillPath(skillId);
          expect(path.startsWith('skills/')).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('skill path contains category and name', () => {
      fc.assert(
        fc.property(categoryArb, skillNameArb, (cat, name) => {
          const skillId = constructSkillId(cat, name);
          const path = getSkillPath(skillId);
          expect(path).toContain(cat);
          expect(path).toContain(name);
        }),
        { numRuns: 100 }
      );
    });

    it('invalid skill IDs return null path', () => {
      fc.assert(
        fc.property(invalidSkillIdArb, (skillId) => {
          const path = getSkillPath(skillId);
          expect(path).toBeNull();
        }),
        { numRuns: 100 }
      );
    });

    it('skill path has correct structure', () => {
      fc.assert(
        fc.property(categoryArb, skillNameArb, (cat, name) => {
          const skillId = constructSkillId(cat, name);
          const path = getSkillPath(skillId);
          expect(path).toBe(`skills/${cat}/${name}/SKILL.md`);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Category Matching Properties', () => {
    it('exact category match works', () => {
      fc.assert(
        fc.property(categoryArb, skillNameArb, (cat, name) => {
          const skillId = constructSkillId(cat, name);
          expect(matchesCategory(skillId, cat)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('different category does not match', () => {
      fc.assert(
        fc.property(categoryArb, categoryArb, skillNameArb, (cat1, cat2, name) => {
          if (cat1 !== cat2) {
            const skillId = constructSkillId(cat1, name);
            expect(matchesCategory(skillId, cat2)).toBe(false);
          }
        }),
        { numRuns: 100 }
      );
    });

    it('regex pattern matching works', () => {
      fc.assert(
        fc.property(validSkillIdArb, (skillId) => {
          const pattern = /^[a-z][a-z0-9-]*$/;
          // Should match because all our categories match this pattern
          expect(matchesCategory(skillId, pattern)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('invalid skill IDs do not match any category', () => {
      fc.assert(
        fc.property(invalidSkillIdArb, categoryArb, (skillId, cat) => {
          expect(matchesCategory(skillId, cat)).toBe(false);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Normalization Properties', () => {
    it('normalized skill IDs are lowercase', () => {
      fc.assert(
        fc.property(validSkillIdArb, (skillId) => {
          const normalized = normalizeSkillId(skillId);
          expect(normalized).toBe(normalized.toLowerCase());
        }),
        { numRuns: 100 }
      );
    });

    it('normalization is idempotent', () => {
      fc.assert(
        fc.property(validSkillIdArb, (skillId) => {
          const once = normalizeSkillId(skillId);
          const twice = normalizeSkillId(once);
          expect(once).toBe(twice);
        }),
        { numRuns: 100 }
      );
    });

    it('null/undefined normalize to null', () => {
      expect(normalizeSkillId(null)).toBeNull();
      expect(normalizeSkillId(undefined)).toBeNull();
    });

    it('whitespace is trimmed during normalization', () => {
      fc.assert(
        fc.property(validSkillIdArb, (skillId) => {
          const withSpace = '  ' + skillId + '  ';
          const normalized = normalizeSkillId(withSpace);
          expect(normalized).toBe(skillId);
        }),
        { numRuns: 50 }
      );
    });
  });

  describe('Well-Known Skills', () => {
    it('well-known categories are valid', () => {
      fc.assert(
        fc.property(wellKnownCategoriesArb, skillNameArb, (cat, name) => {
          const skillId = constructSkillId(cat, name);
          const result = validateSkillId(skillId);
          expect(result.valid).toBe(true);
        }),
        { numRuns: 50 }
      );
    });

    it('well-known skills are valid', () => {
      fc.assert(
        fc.property(categoryArb, wellKnownSkillsArb, (cat, name) => {
          const skillId = constructSkillId(cat, name);
          const result = validateSkillId(skillId);
          expect(result.valid).toBe(true);
        }),
        { numRuns: 50 }
      );
    });

    it('common skill patterns are valid', () => {
      const commonSkills = [
        'testing/omega-testing',
        'methodology/tdd',
        'ai-engineering/rag-systems',
        'databases/postgresql',
        'frameworks/react',
        'frontend/tailwindcss',
        'backend/nestjs',
        'devops/docker',
        'security/devsecops',
      ];

      for (const skill of commonSkills) {
        const result = validateSkillId(skill);
        expect(result.valid).toBe(true);
      }
    });
  });

  describe('Edge Cases', () => {
    it('single character category and name are valid', () => {
      const result = validateSkillId('a/b');
      expect(result.valid).toBe(true);
    });

    it('max length components are valid', () => {
      fc.assert(
        fc.property(
          fc.stringMatching(/^[a-z][a-z0-9]{49}$/),
          fc.stringMatching(/^[a-z][a-z0-9]{49}$/),
          (cat, name) => {
            const skillId = constructSkillId(cat, name);
            const result = validateSkillId(skillId);
            expect(result.valid).toBe(true);
          }
        ),
        { numRuns: 10 }
      );
    });

    it('hyphens are allowed in both parts', () => {
      const result = validateSkillId('a-b-c/x-y-z');
      expect(result.valid).toBe(true);
    });

    it('leading hyphens are invalid', () => {
      const result = validateSkillId('-category/skill');
      expect(result.valid).toBe(false);
    });

    it('trailing hyphens are allowed', () => {
      const result = validateSkillId('category-/skill-');
      expect(result.valid).toBe(true);
    });

    it('numbers in middle are valid', () => {
      const result = validateSkillId('cat123/skill456');
      expect(result.valid).toBe(true);
    });

    it('starting with number is invalid', () => {
      const result1 = validateSkillId('123cat/skill');
      const result2 = validateSkillId('cat/123skill');
      expect(result1.valid).toBe(false);
      expect(result2.valid).toBe(false);
    });
  });
});

describe('Skill ID Invariants', () => {
  it('validation is consistent', () => {
    fc.assert(
      fc.property(validSkillIdArb, (skillId) => {
        const r1 = validateSkillId(skillId);
        const r2 = validateSkillId(skillId);
        const r3 = validateSkillId(skillId);
        expect(r1.valid).toBe(r2.valid);
        expect(r2.valid).toBe(r3.valid);
      }),
      { numRuns: 50 }
    );
  });

  it('parsing preserves original information', () => {
    fc.assert(
      fc.property(categoryArb, skillNameArb, (cat, name) => {
        const original = constructSkillId(cat, name);
        const parsed = parseSkillId(original);
        const reconstructed = constructSkillId(parsed.category, parsed.name);
        expect(original).toBe(reconstructed);
      }),
      { numRuns: 100 }
    );
  });

  it('skill ID length is predictable', () => {
    fc.assert(
      fc.property(categoryArb, skillNameArb, (cat, name) => {
        const skillId = constructSkillId(cat, name);
        // Length = cat.length + 1 (/) + name.length
        expect(skillId.length).toBe(cat.length + 1 + name.length);
      }),
      { numRuns: 100 }
    );
  });

  it('skill path length is predictable', () => {
    fc.assert(
      fc.property(categoryArb, skillNameArb, (cat, name) => {
        const skillId = constructSkillId(cat, name);
        const path = getSkillPath(skillId);
        // path = "skills/" + cat + "/" + name + "/SKILL.md"
        const expectedLength = 7 + cat.length + 1 + name.length + 9;
        expect(path.length).toBe(expectedLength);
      }),
      { numRuns: 100 }
    );
  });
});
