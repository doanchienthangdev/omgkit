/**
 * Property-Based Tests for Path Resolution
 *
 * Tests invariants of path resolution and safety using Fast-Check
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { join, resolve, normalize, dirname, basename, extname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PACKAGE_ROOT = join(__dirname, '../..');
const PLUGIN_DIR = join(PACKAGE_ROOT, 'plugin');

/**
 * Safe path resolution that prevents traversal
 */
function resolvePluginPath(subPath) {
  if (!subPath || typeof subPath !== 'string') {
    return null;
  }

  // Decode URL encoding
  let decoded = subPath;
  try {
    decoded = decodeURIComponent(subPath);
  } catch (e) {
    return null;
  }

  // Check for null bytes
  if (decoded.includes('\x00')) {
    return null;
  }

  // Normalize and resolve
  const normalized = normalize(decoded);

  // Check for traversal patterns
  if (normalized.includes('..') || decoded.includes('..')) {
    return null;
  }

  // Resolve full path
  const resolved = resolve(PLUGIN_DIR, normalized);

  // Verify within PLUGIN_DIR
  if (!resolved.startsWith(PLUGIN_DIR)) {
    return null;
  }

  return resolved;
}

/**
 * Check if path is safe (no traversal)
 */
function isPathSafe(path) {
  if (!path || typeof path !== 'string') {
    return false;
  }

  // Dangerous patterns
  const dangerousPatterns = [
    /\.\./,
    /\x00/,
    /%2e%2e/i,
    /%252e/i,
    /\\\.\\./,
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(path)) {
      return false;
    }
  }

  return true;
}

/**
 * Validate component path format
 */
function validateComponentPath(path, type) {
  if (!path || typeof path !== 'string') {
    return { valid: false, error: 'Invalid path' };
  }

  const patterns = {
    agent: /^agents\/[a-z][a-z0-9-]*\.md$/,
    skill: /^skills\/[a-z][a-z0-9-]*\/[a-z][a-z0-9-]*\/SKILL\.md$/,
    command: /^commands\/[a-z][a-z0-9-]*\/[a-z][a-z0-9-]*\.md$/,
    workflow: /^workflows\/[a-z][a-z0-9-]*\/[a-z][a-z0-9-]*\.md$/,
    mode: /^modes\/[a-z][a-z0-9-]*\.md$/,
  };

  const pattern = patterns[type];
  if (!pattern) {
    return { valid: false, error: 'Unknown type' };
  }

  return {
    valid: pattern.test(path),
    error: pattern.test(path) ? null : 'Path does not match expected format',
  };
}

// Arbitraries
const safeIdentifierArb = fc.stringMatching(/^[a-z][a-z0-9-]{0,30}$/);
const safeFilenameArb = fc.stringMatching(/^[a-z][a-z0-9-]{0,30}\.(md|yaml|json)$/);

const safePathSegmentArb = safeIdentifierArb;
const safePathArb = fc.array(safePathSegmentArb, { minLength: 1, maxLength: 4 })
  .map(segments => segments.join('/'));

// These patterns always contain '..' after single URL decode
const traversalPatternArb = fc.constantFrom(
  '..',
  '../',
  '..\\',
  '..%2f',        // .. is already present
  '%2e%2e/',      // decodes to ../
);

const agentPathArb = safeIdentifierArb.map(name => `agents/${name}.md`);
const skillPathArb = fc.tuple(safeIdentifierArb, safeIdentifierArb)
  .map(([category, name]) => `skills/${category}/${name}/SKILL.md`);
const commandPathArb = fc.tuple(safeIdentifierArb, safeIdentifierArb)
  .map(([namespace, name]) => `commands/${namespace}/${name}.md`);
const workflowPathArb = fc.tuple(safeIdentifierArb, safeIdentifierArb)
  .map(([category, name]) => `workflows/${category}/${name}.md`);
const modePathArb = safeIdentifierArb.map(name => `modes/${name}.md`);

describe('Path Resolution Property-Based Tests', () => {
  describe('Safe Path Resolution', () => {
    it('safe paths always resolve within PLUGIN_DIR', () => {
      fc.assert(
        fc.property(safePathArb, (path) => {
          const resolved = resolvePluginPath(path);
          if (resolved !== null) {
            expect(resolved.startsWith(PLUGIN_DIR)).toBe(true);
          }
        }),
        { numRuns: 100 }
      );
    });

    it('resolved paths never contain ".."', () => {
      fc.assert(
        fc.property(safePathArb, (path) => {
          const resolved = resolvePluginPath(path);
          if (resolved !== null) {
            expect(resolved).not.toContain('..');
          }
        }),
        { numRuns: 100 }
      );
    });

    it('resolved paths are always normalized', () => {
      fc.assert(
        fc.property(safePathArb, (path) => {
          const resolved = resolvePluginPath(path);
          if (resolved !== null) {
            // Normalized path should equal itself when normalized again
            expect(normalize(resolved)).toBe(resolved);
          }
        }),
        { numRuns: 100 }
      );
    });

    it('resolution is deterministic', () => {
      fc.assert(
        fc.property(safePathArb, (path) => {
          const first = resolvePluginPath(path);
          const second = resolvePluginPath(path);
          expect(first).toBe(second);
        }),
        { numRuns: 50 }
      );
    });
  });

  describe('Traversal Prevention', () => {
    it('traversal patterns always return null', () => {
      fc.assert(
        fc.property(traversalPatternArb, (pattern) => {
          const result = resolvePluginPath(pattern);
          expect(result).toBeNull();
        }),
        { numRuns: 50 }
      );
    });

    it('paths with embedded traversal return null', () => {
      fc.assert(
        fc.property(
          fc.tuple(safeIdentifierArb, traversalPatternArb, safeIdentifierArb),
          ([prefix, traversal, suffix]) => {
            const path = `${prefix}/${traversal}/${suffix}`;
            const result = resolvePluginPath(path);
            expect(result).toBeNull();
          }
        ),
        { numRuns: 50 }
      );
    });

    it('paths with prefix traversal return null', () => {
      fc.assert(
        fc.property(
          fc.tuple(traversalPatternArb, safePathArb),
          ([traversal, safePath]) => {
            const path = `${traversal}/${safePath}`;
            const result = resolvePluginPath(path);
            expect(result).toBeNull();
          }
        ),
        { numRuns: 50 }
      );
    });

    it('paths with suffix traversal return null', () => {
      fc.assert(
        fc.property(
          fc.tuple(safePathArb, traversalPatternArb),
          ([safePath, traversal]) => {
            const path = `${safePath}/${traversal}`;
            const result = resolvePluginPath(path);
            expect(result).toBeNull();
          }
        ),
        { numRuns: 50 }
      );
    });

    it('multiple consecutive traversals return null', () => {
      fc.assert(
        fc.property(
          fc.array(traversalPatternArb, { minLength: 2, maxLength: 5 }),
          (traversals) => {
            const path = traversals.join('/');
            const result = resolvePluginPath(path);
            expect(result).toBeNull();
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Path Safety Check', () => {
    it('safe paths are identified as safe', () => {
      fc.assert(
        fc.property(safePathArb, (path) => {
          expect(isPathSafe(path)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('traversal patterns are identified as unsafe', () => {
      fc.assert(
        fc.property(traversalPatternArb, (pattern) => {
          expect(isPathSafe(pattern)).toBe(false);
        }),
        { numRuns: 50 }
      );
    });

    it('null bytes make paths unsafe', () => {
      fc.assert(
        fc.property(safePathArb, (safePath) => {
          const withNull = safePath + '\x00';
          expect(isPathSafe(withNull)).toBe(false);
        }),
        { numRuns: 50 }
      );
    });
  });

  describe('Component Path Validation', () => {
    it('valid agent paths pass validation', () => {
      fc.assert(
        fc.property(agentPathArb, (path) => {
          const result = validateComponentPath(path, 'agent');
          expect(result.valid).toBe(true);
        }),
        { numRuns: 50 }
      );
    });

    it('valid skill paths pass validation', () => {
      fc.assert(
        fc.property(skillPathArb, (path) => {
          const result = validateComponentPath(path, 'skill');
          expect(result.valid).toBe(true);
        }),
        { numRuns: 50 }
      );
    });

    it('valid command paths pass validation', () => {
      fc.assert(
        fc.property(commandPathArb, (path) => {
          const result = validateComponentPath(path, 'command');
          expect(result.valid).toBe(true);
        }),
        { numRuns: 50 }
      );
    });

    it('valid workflow paths pass validation', () => {
      fc.assert(
        fc.property(workflowPathArb, (path) => {
          const result = validateComponentPath(path, 'workflow');
          expect(result.valid).toBe(true);
        }),
        { numRuns: 50 }
      );
    });

    it('valid mode paths pass validation', () => {
      fc.assert(
        fc.property(modePathArb, (path) => {
          const result = validateComponentPath(path, 'mode');
          expect(result.valid).toBe(true);
        }),
        { numRuns: 50 }
      );
    });

    it('mismatched types fail validation', () => {
      fc.assert(
        fc.property(agentPathArb, (agentPath) => {
          // Agent path should fail skill validation
          const result = validateComponentPath(agentPath, 'skill');
          expect(result.valid).toBe(false);
        }),
        { numRuns: 50 }
      );
    });
  });

  describe('Path Segment Properties', () => {
    it('path segments preserve order', () => {
      fc.assert(
        fc.property(
          fc.array(safeIdentifierArb, { minLength: 1, maxLength: 5 }),
          (segments) => {
            const path = segments.join('/');
            const split = path.split('/');
            expect(split).toEqual(segments);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('dirname and basename reconstruct path', () => {
      fc.assert(
        fc.property(
          fc.tuple(safeIdentifierArb, safeFilenameArb),
          ([dir, file]) => {
            const path = `${dir}/${file}`;
            expect(join(dirname(path), basename(path))).toBe(path);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('extname extracts correct extension', () => {
      fc.assert(
        fc.property(safeFilenameArb, (filename) => {
          const ext = extname(filename);
          expect(['.md', '.yaml', '.json']).toContain(ext);
        }),
        { numRuns: 50 }
      );
    });
  });

  describe('Edge Cases', () => {
    it('empty string returns null', () => {
      expect(resolvePluginPath('')).toBeNull();
    });

    it('null returns null', () => {
      expect(resolvePluginPath(null)).toBeNull();
    });

    it('undefined returns null', () => {
      expect(resolvePluginPath(undefined)).toBeNull();
    });

    it('handles paths with double slashes', () => {
      fc.assert(
        fc.property(
          fc.tuple(safeIdentifierArb, safeIdentifierArb),
          ([a, b]) => {
            const path = `${a}//${b}`;
            const resolved = resolvePluginPath(path);
            // Should either return null or normalize properly
            if (resolved !== null) {
              expect(resolved).not.toContain('//');
            }
          }
        ),
        { numRuns: 50 }
      );
    });

    it('handles very long paths safely', () => {
      fc.assert(
        fc.property(
          fc.array(safeIdentifierArb, { minLength: 10, maxLength: 20 }),
          (segments) => {
            const path = segments.join('/');
            // Should not throw
            expect(() => resolvePluginPath(path)).not.toThrow();
          }
        ),
        { numRuns: 20 }
      );
    });
  });
});

describe('Path Resolution Invariants', () => {
  it('resolved paths are always absolute', () => {
    fc.assert(
      fc.property(safePathArb, (path) => {
        const resolved = resolvePluginPath(path);
        if (resolved !== null) {
          // Absolute paths start with /
          expect(resolved.startsWith('/')).toBe(true);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('resolution is idempotent on safe paths', () => {
    fc.assert(
      fc.property(safePathArb, (path) => {
        const first = resolvePluginPath(path);
        if (first !== null) {
          // Resolving relative to PLUGIN_DIR again should give same result
          const relativePath = first.slice(PLUGIN_DIR.length + 1);
          const second = resolvePluginPath(relativePath);
          expect(second).toBe(first);
        }
      }),
      { numRuns: 50 }
    );
  });

  it('safe paths composed with safe paths remain safe', () => {
    fc.assert(
      fc.property(
        fc.tuple(safeIdentifierArb, safeIdentifierArb),
        ([a, b]) => {
          const composed = join(a, b);
          expect(isPathSafe(composed)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('path validation is consistent', () => {
    fc.assert(
      fc.property(agentPathArb, (path) => {
        const result1 = validateComponentPath(path, 'agent');
        const result2 = validateComponentPath(path, 'agent');
        expect(result1.valid).toBe(result2.valid);
      }),
      { numRuns: 50 }
    );
  });

  it('component paths maintain their structure', () => {
    const componentPaths = [
      { arb: agentPathArb, prefix: 'agents/', suffix: '.md' },
      { arb: commandPathArb, prefix: 'commands/', suffix: '.md' },
      { arb: modePathArb, prefix: 'modes/', suffix: '.md' },
    ];

    for (const { arb, prefix, suffix } of componentPaths) {
      fc.assert(
        fc.property(arb, (path) => {
          expect(path.startsWith(prefix)).toBe(true);
          expect(path.endsWith(suffix)).toBe(true);
        }),
        { numRuns: 30 }
      );
    }
  });
});
