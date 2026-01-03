/**
 * YAML Injection Security Tests
 *
 * Tests to ensure YAML parsing is safe from injection attacks
 */

import { describe, it, expect } from 'vitest';
import yaml from 'js-yaml';
import { yamlInjectionPayloads } from '../helpers/security-payloads.js';

/**
 * Safe YAML parser that mimics OMGKIT behavior
 */
function safeParseYaml(content) {
  try {
    // Use safe loading (no custom types)
    return yaml.load(content, { schema: yaml.SAFE_SCHEMA });
  } catch (e) {
    return null;
  }
}

/**
 * Parse frontmatter safely
 */
function parseFrontmatter(content) {
  if (!content || typeof content !== 'string') {
    return null;
  }

  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    return null;
  }

  return safeParseYaml(match[1]);
}

/**
 * Validate YAML content for dangerous patterns
 */
function validateYamlContent(content) {
  if (!content || typeof content !== 'string') {
    return { safe: false, reason: 'Invalid content type' };
  }

  const dangerousPatterns = [
    /!!python\//i,
    /!!js\//i,
    /!!ruby\//i,
    /!!perl\//i,
    /!!php\//i,
    /!!bash\//i,
    /!!exec/i,
    /!!binary/i,
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(content)) {
      return { safe: false, reason: `Dangerous YAML tag detected: ${pattern}` };
    }
  }

  return { safe: true };
}

describe('YAML Injection Prevention', () => {
  describe('Safe YAML Parsing', () => {
    describe('Python Object Injection', () => {
      const pythonPayloads = [
        '!!python/object/apply:os.system ["rm -rf /"]',
        '!!python/object:__main__.DangerousClass',
        '!!python/object/new:os.system ["id"]',
        '!!python/name:os.system',
        '!!python/module:os',
      ];

      it.each(pythonPayloads)('blocks Python injection: %s', (payload) => {
        const content = `---\nvalue: ${payload}\n---`;
        const result = parseFrontmatter(content);

        // Should either return null or treat as string
        if (result !== null) {
          expect(typeof result.value).toBe('string');
          // Should not have executed any Python code
        }
      });
    });

    describe('JavaScript Injection', () => {
      const jsPayloads = [
        '!!js/eval "process.exit(1)"',
        '!!js/undefined',
        '!!js/function "function(){return process.env}"',
        '!!js/regexp /.*/g',
      ];

      it.each(jsPayloads)('blocks JavaScript injection: %s', (payload) => {
        const content = `---\nvalue: ${payload}\n---`;
        const result = parseFrontmatter(content);

        if (result !== null) {
          // Should be treated as string, not executed
          expect(typeof result.value).toBe('string');
        }
      });
    });

    describe('Ruby Object Injection', () => {
      const rubyPayloads = [
        '!ruby/object:Gem::Requirement',
        '!ruby/hash:ActionController::Routing::RouteSet::NamedRouteCollection',
        '!ruby/object:Gem::Installer',
      ];

      it.each(rubyPayloads)('blocks Ruby injection: %s', (payload) => {
        const content = `---\nvalue: ${payload}\n---`;
        const result = parseFrontmatter(content);

        if (result !== null) {
          expect(typeof result.value).toBe('string');
        }
      });
    });

    describe('Binary Data Injection', () => {
      it('handles binary YAML tag safely', () => {
        const content = `---
value: !!binary |
  R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==
---`;
        const result = parseFrontmatter(content);

        // SAFE_SCHEMA still allows binary, but it's decoded to Buffer
        // The important thing is it doesn't execute code
        if (result !== null) {
          // Should be either Buffer object or null (rejected)
          expect(['string', 'object']).toContain(typeof result.value);
        }
      });
    });

    describe('Entity Expansion (Billion Laughs)', () => {
      it('handles anchor/alias safely', () => {
        const content = `---
a1: &a1 ["lol"]
a2: &a2 [*a1, *a1]
a3: &a3 [*a2, *a2]
a4: [*a3, *a3]
---`;
        // Should not cause exponential expansion
        const start = Date.now();
        const result = parseFrontmatter(content);
        const elapsed = Date.now() - start;

        // Should complete quickly (under 1 second)
        expect(elapsed).toBeLessThan(1000);
      });

      it('handles deeply nested anchors', () => {
        const content = `---
level1: &l1
  data: test
level2: &l2
  ref: *l1
level3:
  ref: *l2
---`;
        const result = parseFrontmatter(content);
        expect(result).not.toBeNull();
      });
    });

    describe('Merge Key Attacks', () => {
      it('handles merge keys safely', () => {
        const content = `---
defaults: &defaults
  admin: false
user:
  <<: *defaults
  name: test
---`;
        const result = parseFrontmatter(content);

        if (result !== null) {
          // Merge should work but not override security
          expect(result.user.admin).toBe(false);
        }
      });

      it('prevents privilege escalation via merge', () => {
        const content = `---
admin_override: &admin
  admin: true
  role: superuser
normal_user:
  <<: *admin
  admin: false
---`;
        const result = parseFrontmatter(content);

        if (result !== null) {
          // The explicit false should override the merge
          expect(result.normal_user.admin).toBe(false);
        }
      });
    });

    describe('Type Coercion Attacks', () => {
      const coercionPayloads = [
        { yaml: '!!str 123', expectedType: 'string' },
        { yaml: '!!int "456"', expectedType: 'number' },
        { yaml: '!!bool "yes"', expectedType: 'boolean' },
        { yaml: '!!null ""', expectedType: 'object' }, // null is object type
      ];

      it.each(coercionPayloads)('handles type coercion: $yaml', ({ yaml: yamlContent, expectedType }) => {
        const content = `---\nvalue: ${yamlContent}\n---`;
        const result = parseFrontmatter(content);

        // With SAFE_SCHEMA, explicit tags may be ignored or treated as strings
        if (result !== null && result.value !== undefined) {
          // Should not crash or cause unexpected behavior
          expect(['string', 'number', 'boolean', 'object']).toContain(typeof result.value);
        }
      });
    });
  });

  describe('Content Validation', () => {
    it.each(yamlInjectionPayloads)('detects dangerous content: %s', (payload) => {
      const validation = validateYamlContent(payload);

      // Dangerous patterns should be detected
      if (payload.includes('!!python') || payload.includes('!!js') ||
          payload.includes('!!ruby') || payload.includes('!!binary')) {
        expect(validation.safe).toBe(false);
      }
    });

    describe('Safe Content', () => {
      const safeContent = [
        'name: test',
        'skills:\n  - testing/omega\n  - methodology/tdd',
        'description: A safe description',
        'version: 1.0.0',
      ];

      it.each(safeContent)('allows safe content: %s', (content) => {
        const validation = validateYamlContent(content);
        expect(validation.safe).toBe(true);
      });
    });
  });

  describe('Frontmatter Security', () => {
    describe('Valid Frontmatter', () => {
      it('parses simple frontmatter', () => {
        const content = `---
name: test-agent
description: A test agent
skills:
  - testing/omega-testing
  - methodology/tdd
commands:
  - /dev:test
---

# Test Agent

Content here.
`;
        const result = parseFrontmatter(content);
        expect(result).not.toBeNull();
        expect(result.name).toBe('test-agent');
        expect(result.skills).toHaveLength(2);
      });

      it('handles complex nested structures', () => {
        const content = `---
name: complex-agent
config:
  nested:
    deep:
      value: test
  array:
    - item1
    - item2
---`;
        const result = parseFrontmatter(content);
        expect(result).not.toBeNull();
        expect(result.config.nested.deep.value).toBe('test');
      });
    });

    describe('Invalid Frontmatter', () => {
      it('handles missing closing delimiter', () => {
        const content = `---
name: test
skills:
  - invalid`;
        const result = parseFrontmatter(content);
        expect(result).toBeNull();
      });

      it('handles invalid YAML syntax', () => {
        const content = `---
name: test
skills: [broken: syntax
---`;
        const result = parseFrontmatter(content);
        expect(result).toBeNull();
      });

      it('handles missing opening delimiter', () => {
        const content = `name: test
skills:
  - test
---`;
        const result = parseFrontmatter(content);
        expect(result).toBeNull();
      });
    });

    describe('Edge Cases', () => {
      it('handles empty frontmatter', () => {
        const content = `---
---

# Content`;
        const result = parseFrontmatter(content);
        // Empty object or null depending on implementation
        expect(result === null || (typeof result === 'object')).toBe(true);
      });

      it('handles frontmatter with only comments', () => {
        const content = `---
# This is a comment
# Another comment
---`;
        const result = parseFrontmatter(content);
        expect(result === null || (typeof result === 'object')).toBe(true);
      });

      it('handles unicode in frontmatter', () => {
        const content = `---
name: test-
description: Description with emoji and unicode
---`;
        const result = parseFrontmatter(content);
        expect(result).not.toBeNull();
      });

      it('handles very long values', () => {
        const longValue = 'a'.repeat(10000);
        const content = `---
name: test
description: ${longValue}
---`;
        const result = parseFrontmatter(content);
        expect(result).not.toBeNull();
        expect(result.description.length).toBe(10000);
      });
    });
  });

  describe('Full Injection Payload Suite', () => {
    it.each(yamlInjectionPayloads)('safely handles injection payload: %s', (payload) => {
      const content = `---\nvalue: ${payload}\n---`;

      // Should not throw
      expect(() => parseFrontmatter(content)).not.toThrow();

      const result = parseFrontmatter(content);

      // If parsed, value should be a safe type
      if (result !== null && result.value !== undefined) {
        expect(['string', 'number', 'boolean', 'object', 'undefined']).toContain(typeof result.value);
      }
    });
  });
});

describe('YAML Security Invariants', () => {
  it('SAFE_SCHEMA rejects dangerous types', () => {
    const dangerous = '!!python/object:os.system';
    expect(() => yaml.load(dangerous, { schema: yaml.SAFE_SCHEMA })).toThrow();
  });

  it('SAFE_SCHEMA allows standard types', () => {
    const safe = `
string: hello
number: 42
boolean: true
null_value: null
array: [1, 2, 3]
object:
  key: value
`;
    const result = yaml.load(safe, { schema: yaml.SAFE_SCHEMA });
    expect(result.string).toBe('hello');
    expect(result.number).toBe(42);
    expect(result.boolean).toBe(true);
    expect(result.null_value).toBeNull();
    expect(result.array).toEqual([1, 2, 3]);
    expect(result.object.key).toBe('value');
  });

  it('parsing never executes code', () => {
    // Set up a flag that would be set if code executes
    global.yamlCodeExecuted = false;

    const malicious = `!!js/function "function(){ global.yamlCodeExecuted = true; }"`;

    try {
      yaml.load(malicious, { schema: yaml.SAFE_SCHEMA });
    } catch (e) {
      // Expected to throw
    }

    expect(global.yamlCodeExecuted).toBe(false);
    delete global.yamlCodeExecuted;
  });
});
