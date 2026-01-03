/**
 * Property-Based Tests for Command Format Validation
 *
 * Tests invariants of command ID format and validation using Fast-Check
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * Validate command ID format
 * Format: /namespace:command-name
 */
function validateCommandId(commandId) {
  if (!commandId || typeof commandId !== 'string') {
    return { valid: false, error: 'Invalid command ID type' };
  }

  // Must start with /
  if (!commandId.startsWith('/')) {
    return { valid: false, error: 'Command must start with /' };
  }

  // Must contain exactly one colon
  const colonCount = (commandId.match(/:/g) || []).length;
  if (colonCount !== 1) {
    return { valid: false, error: 'Command must have exactly one colon' };
  }

  // Parse namespace and command
  const withoutSlash = commandId.slice(1);
  const [namespace, command] = withoutSlash.split(':');

  // Validate namespace
  if (!namespace || !/^[a-z][a-z0-9-]*$/.test(namespace)) {
    return { valid: false, error: 'Invalid namespace format' };
  }

  // Validate command name
  if (!command || !/^[a-z][a-z0-9-]*$/.test(command)) {
    return { valid: false, error: 'Invalid command name format' };
  }

  return { valid: true };
}

/**
 * Parse command ID into components
 */
function parseCommandId(commandId) {
  const validation = validateCommandId(commandId);
  if (!validation.valid) {
    return null;
  }

  const withoutSlash = commandId.slice(1);
  const [namespace, command] = withoutSlash.split(':');

  return { namespace, command };
}

/**
 * Construct command ID from components
 */
function constructCommandId(namespace, command) {
  return `/${namespace}:${command}`;
}

/**
 * Normalize command ID (lowercase, trim)
 */
function normalizeCommandId(commandId) {
  if (!commandId || typeof commandId !== 'string') {
    return null;
  }

  return commandId.trim().toLowerCase();
}

/**
 * Check if two command IDs are equivalent
 */
function commandIdsEqual(a, b) {
  const normA = normalizeCommandId(a);
  const normB = normalizeCommandId(b);
  return normA !== null && normA === normB;
}

// Arbitraries
const namespaceArb = fc.stringMatching(/^[a-z][a-z0-9-]{0,20}$/);
const commandNameArb = fc.stringMatching(/^[a-z][a-z0-9-]{0,30}$/);

const validCommandIdArb = fc.tuple(namespaceArb, commandNameArb)
  .map(([ns, cmd]) => `/${ns}:${cmd}`);

const invalidCommandIdArb = fc.oneof(
  // Missing slash
  fc.tuple(namespaceArb, commandNameArb).map(([ns, cmd]) => `${ns}:${cmd}`),
  // Missing colon
  fc.tuple(namespaceArb, commandNameArb).map(([ns, cmd]) => `/${ns}${cmd}`),
  // Multiple colons
  fc.tuple(namespaceArb, commandNameArb, commandNameArb)
    .map(([ns, cmd1, cmd2]) => `/${ns}:${cmd1}:${cmd2}`),
  // Empty namespace
  commandNameArb.map(cmd => `/:${cmd}`),
  // Empty command
  namespaceArb.map(ns => `/${ns}:`),
  // Uppercase
  fc.tuple(namespaceArb, commandNameArb)
    .map(([ns, cmd]) => `/${ns.toUpperCase()}:${cmd.toUpperCase()}`),
);

const wellKnownNamespacesArb = fc.constantFrom(
  'dev', 'quality', 'git', 'planning', 'omega', 'meta', 'sprint'
);

const wellKnownCommandsArb = fc.constantFrom(
  'test', 'build', 'commit', 'plan', 'think', 'review', 'deploy'
);

describe('Command Format Property-Based Tests', () => {
  describe('Validation Properties', () => {
    it('valid command IDs always pass validation', () => {
      fc.assert(
        fc.property(validCommandIdArb, (commandId) => {
          const result = validateCommandId(commandId);
          expect(result.valid).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('invalid command IDs always fail validation', () => {
      fc.assert(
        fc.property(invalidCommandIdArb, (commandId) => {
          const result = validateCommandId(commandId);
          expect(result.valid).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it('null/undefined always fail validation', () => {
      fc.assert(
        fc.property(fc.constantFrom(null, undefined), (value) => {
          const result = validateCommandId(value);
          expect(result.valid).toBe(false);
        }),
        { numRuns: 10 }
      );
    });

    it('numbers always fail validation', () => {
      fc.assert(
        fc.property(fc.integer(), (value) => {
          const result = validateCommandId(value);
          expect(result.valid).toBe(false);
        }),
        { numRuns: 50 }
      );
    });

    it('empty string fails validation', () => {
      const result = validateCommandId('');
      expect(result.valid).toBe(false);
    });
  });

  describe('Format Properties', () => {
    it('valid command IDs always start with /', () => {
      fc.assert(
        fc.property(validCommandIdArb, (commandId) => {
          expect(commandId.startsWith('/')).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('valid command IDs always contain exactly one colon', () => {
      fc.assert(
        fc.property(validCommandIdArb, (commandId) => {
          const colonCount = (commandId.match(/:/g) || []).length;
          expect(colonCount).toBe(1);
        }),
        { numRuns: 100 }
      );
    });

    it('valid command IDs are always lowercase', () => {
      fc.assert(
        fc.property(validCommandIdArb, (commandId) => {
          expect(commandId).toBe(commandId.toLowerCase());
        }),
        { numRuns: 100 }
      );
    });

    it('valid command IDs have no spaces', () => {
      fc.assert(
        fc.property(validCommandIdArb, (commandId) => {
          expect(commandId).not.toContain(' ');
        }),
        { numRuns: 100 }
      );
    });

    it('namespace and command only contain allowed characters', () => {
      fc.assert(
        fc.property(validCommandIdArb, (commandId) => {
          const parsed = parseCommandId(commandId);
          if (parsed) {
            expect(parsed.namespace).toMatch(/^[a-z][a-z0-9-]*$/);
            expect(parsed.command).toMatch(/^[a-z][a-z0-9-]*$/);
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Parsing Properties', () => {
    it('valid command IDs can be parsed', () => {
      fc.assert(
        fc.property(validCommandIdArb, (commandId) => {
          const parsed = parseCommandId(commandId);
          expect(parsed).not.toBeNull();
        }),
        { numRuns: 100 }
      );
    });

    it('invalid command IDs cannot be parsed', () => {
      fc.assert(
        fc.property(invalidCommandIdArb, (commandId) => {
          const parsed = parseCommandId(commandId);
          expect(parsed).toBeNull();
        }),
        { numRuns: 100 }
      );
    });

    it('parsed command has namespace and command fields', () => {
      fc.assert(
        fc.property(validCommandIdArb, (commandId) => {
          const parsed = parseCommandId(commandId);
          if (parsed) {
            expect(typeof parsed.namespace).toBe('string');
            expect(typeof parsed.command).toBe('string');
            expect(parsed.namespace.length).toBeGreaterThan(0);
            expect(parsed.command.length).toBeGreaterThan(0);
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Construction Properties', () => {
    it('constructed command IDs are valid', () => {
      fc.assert(
        fc.property(namespaceArb, commandNameArb, (ns, cmd) => {
          const commandId = constructCommandId(ns, cmd);
          const result = validateCommandId(commandId);
          expect(result.valid).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('construction is the inverse of parsing', () => {
      fc.assert(
        fc.property(namespaceArb, commandNameArb, (ns, cmd) => {
          const constructed = constructCommandId(ns, cmd);
          const parsed = parseCommandId(constructed);
          expect(parsed.namespace).toBe(ns);
          expect(parsed.command).toBe(cmd);
        }),
        { numRuns: 100 }
      );
    });

    it('parsing is the inverse of construction', () => {
      fc.assert(
        fc.property(validCommandIdArb, (commandId) => {
          const parsed = parseCommandId(commandId);
          if (parsed) {
            const reconstructed = constructCommandId(parsed.namespace, parsed.command);
            expect(reconstructed).toBe(commandId);
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Normalization Properties', () => {
    it('normalized command IDs are lowercase', () => {
      fc.assert(
        fc.property(validCommandIdArb, (commandId) => {
          const normalized = normalizeCommandId(commandId);
          expect(normalized).toBe(normalized.toLowerCase());
        }),
        { numRuns: 100 }
      );
    });

    it('normalization is idempotent', () => {
      fc.assert(
        fc.property(validCommandIdArb, (commandId) => {
          const once = normalizeCommandId(commandId);
          const twice = normalizeCommandId(once);
          expect(once).toBe(twice);
        }),
        { numRuns: 100 }
      );
    });

    it('null/undefined normalize to null', () => {
      expect(normalizeCommandId(null)).toBeNull();
      expect(normalizeCommandId(undefined)).toBeNull();
    });

    it('whitespace is trimmed during normalization', () => {
      fc.assert(
        fc.property(validCommandIdArb, (commandId) => {
          const withSpace = '  ' + commandId + '  ';
          const normalized = normalizeCommandId(withSpace);
          expect(normalized).toBe(commandId);
        }),
        { numRuns: 50 }
      );
    });
  });

  describe('Equality Properties', () => {
    it('identical command IDs are equal', () => {
      fc.assert(
        fc.property(validCommandIdArb, (commandId) => {
          expect(commandIdsEqual(commandId, commandId)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('equality is symmetric', () => {
      fc.assert(
        fc.property(validCommandIdArb, validCommandIdArb, (a, b) => {
          expect(commandIdsEqual(a, b)).toBe(commandIdsEqual(b, a));
        }),
        { numRuns: 100 }
      );
    });

    it('case differences do not affect equality after normalization', () => {
      fc.assert(
        fc.property(namespaceArb, commandNameArb, (ns, cmd) => {
          const lower = constructCommandId(ns, cmd);
          const upper = constructCommandId(ns.toUpperCase(), cmd.toUpperCase());
          // After normalization, they should be equal
          expect(normalizeCommandId(lower)).toBe(normalizeCommandId(upper));
        }),
        { numRuns: 50 }
      );
    });

    it('different command IDs are not equal', () => {
      fc.assert(
        fc.property(validCommandIdArb, validCommandIdArb, (a, b) => {
          if (a !== b) {
            expect(commandIdsEqual(a, b)).toBe(false);
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Well-Known Commands', () => {
    it('well-known namespaces are valid', () => {
      fc.assert(
        fc.property(wellKnownNamespacesArb, commandNameArb, (ns, cmd) => {
          const commandId = constructCommandId(ns, cmd);
          const result = validateCommandId(commandId);
          expect(result.valid).toBe(true);
        }),
        { numRuns: 50 }
      );
    });

    it('well-known commands are valid', () => {
      fc.assert(
        fc.property(namespaceArb, wellKnownCommandsArb, (ns, cmd) => {
          const commandId = constructCommandId(ns, cmd);
          const result = validateCommandId(commandId);
          expect(result.valid).toBe(true);
        }),
        { numRuns: 50 }
      );
    });

    it('common command patterns are valid', () => {
      const commonCommands = [
        '/dev:test',
        '/quality:review',
        '/git:commit',
        '/planning:plan',
        '/omega:think',
        '/meta:help',
        '/sprint:status',
      ];

      for (const cmd of commonCommands) {
        const result = validateCommandId(cmd);
        expect(result.valid).toBe(true);
      }
    });
  });

  describe('Edge Cases', () => {
    it('single character namespace and command are valid', () => {
      const result = validateCommandId('/a:b');
      expect(result.valid).toBe(true);
    });

    it('max length components are valid', () => {
      fc.assert(
        fc.property(
          fc.stringMatching(/^[a-z][a-z0-9]{49}$/),
          fc.stringMatching(/^[a-z][a-z0-9]{49}$/),
          (ns, cmd) => {
            const commandId = constructCommandId(ns, cmd);
            const result = validateCommandId(commandId);
            expect(result.valid).toBe(true);
          }
        ),
        { numRuns: 10 }
      );
    });

    it('hyphens are allowed in both parts', () => {
      const result = validateCommandId('/a-b-c:x-y-z');
      expect(result.valid).toBe(true);
    });

    it('leading hyphens are invalid', () => {
      const result = validateCommandId('/-namespace:command');
      expect(result.valid).toBe(false);
    });

    it('trailing hyphens are allowed', () => {
      const result = validateCommandId('/namespace-:command-');
      expect(result.valid).toBe(true);
    });

    it('numbers in middle are valid', () => {
      const result = validateCommandId('/dev123:test456');
      expect(result.valid).toBe(true);
    });

    it('starting with number is invalid', () => {
      const result1 = validateCommandId('/123dev:test');
      const result2 = validateCommandId('/dev:123test');
      expect(result1.valid).toBe(false);
      expect(result2.valid).toBe(false);
    });
  });
});

describe('Command Format Invariants', () => {
  it('validation is consistent', () => {
    fc.assert(
      fc.property(validCommandIdArb, (commandId) => {
        const r1 = validateCommandId(commandId);
        const r2 = validateCommandId(commandId);
        const r3 = validateCommandId(commandId);
        expect(r1.valid).toBe(r2.valid);
        expect(r2.valid).toBe(r3.valid);
      }),
      { numRuns: 50 }
    );
  });

  it('parsing preserves original information', () => {
    fc.assert(
      fc.property(namespaceArb, commandNameArb, (ns, cmd) => {
        const original = constructCommandId(ns, cmd);
        const parsed = parseCommandId(original);
        const reconstructed = constructCommandId(parsed.namespace, parsed.command);
        expect(original).toBe(reconstructed);
      }),
      { numRuns: 100 }
    );
  });

  it('command ID length is predictable', () => {
    fc.assert(
      fc.property(namespaceArb, commandNameArb, (ns, cmd) => {
        const commandId = constructCommandId(ns, cmd);
        // Length = 1 (/) + ns.length + 1 (:) + cmd.length
        expect(commandId.length).toBe(1 + ns.length + 1 + cmd.length);
      }),
      { numRuns: 100 }
    );
  });
});
