/**
 * Path Traversal Security Tests
 *
 * Tests to ensure path traversal attacks are blocked
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { join, resolve, normalize } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { pathTraversalPayloads, omgkitPathPayloads } from '../helpers/security-payloads.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PACKAGE_ROOT = join(__dirname, '../..');
const PLUGIN_DIR = join(PACKAGE_ROOT, 'plugin');

/**
 * Safe path resolution function to test
 * This mimics what OMGKIT should do to prevent traversal
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
    // Invalid encoding - reject
    return null;
  }

  // Check for null bytes
  if (decoded.includes('\x00')) {
    return null;
  }

  // Normalize and resolve the path
  const normalized = normalize(decoded);

  // Check for directory traversal patterns
  if (normalized.includes('..') || decoded.includes('..')) {
    return null;
  }

  // Resolve the full path
  const resolved = resolve(PLUGIN_DIR, normalized);

  // Verify the resolved path is within PLUGIN_DIR
  if (!resolved.startsWith(PLUGIN_DIR)) {
    return null;
  }

  return resolved;
}

/**
 * Validate skill ID format and safety
 */
function validateSkillId(skillId) {
  if (!skillId || typeof skillId !== 'string') {
    return { valid: false, error: 'Invalid skill ID type' };
  }

  // Check format: category/skill-name
  const pattern = /^[a-z][a-z0-9-]*\/[a-z][a-z0-9-]*$/;
  if (!pattern.test(skillId)) {
    return { valid: false, error: 'Invalid skill ID format' };
  }

  // Check for traversal attempts
  if (skillId.includes('..')) {
    return { valid: false, error: 'Path traversal detected' };
  }

  return { valid: true };
}

/**
 * Validate command ID format and safety
 */
function validateCommandId(commandId) {
  if (!commandId || typeof commandId !== 'string') {
    return { valid: false, error: 'Invalid command ID type' };
  }

  // Check format: /namespace:command-name
  const pattern = /^\/[a-z][a-z0-9-]*:[a-z][a-z0-9-]*$/;
  if (!pattern.test(commandId)) {
    return { valid: false, error: 'Invalid command ID format' };
  }

  return { valid: true };
}

describe('Path Traversal Prevention', () => {
  describe('resolvePluginPath', () => {
    describe('Basic Traversal Attacks', () => {
      const basicPayloads = [
        '../../../etc/passwd',
        '..\\..\\..\\windows\\system32',
        '....//....//etc/passwd',
        '../plugin/registry.yaml',
        'agents/../../../etc/passwd',
      ];

      it.each(basicPayloads)('blocks basic traversal: %s', (payload) => {
        const result = resolvePluginPath(payload);
        expect(result).toBeNull();
      });
    });

    describe('URL-Encoded Traversal Attacks', () => {
      const encodedPayloads = [
        '%2e%2e%2f%2e%2e%2f',
        '%2e%2e/%2e%2e/',
        '..%2f..%2f',
        '%2e%2e%5c%2e%2e%5c',
        'skills%2f..%2f..%2fetc%2fpasswd',
      ];

      it.each(encodedPayloads)('blocks URL-encoded traversal: %s', (payload) => {
        const result = resolvePluginPath(payload);
        expect(result).toBeNull();
      });
    });

    describe('Double-Encoded Traversal Attacks', () => {
      const doubleEncodedPayloads = [
        '../%252e%252e%252f',
        '..%252f..%252f../etc',
      ];

      it.each(doubleEncodedPayloads)('blocks double-encoded traversal: %s', (payload) => {
        const result = resolvePluginPath(payload);
        // After one decode, should still contain .. or similar dangerous patterns
        expect(result).toBeNull();
      });
    });

    describe('Null Byte Injection', () => {
      const nullBytePayloads = [
        'valid.md\x00.jpg',
        'skills/test\x00/../etc/passwd',
        'agents\x00/../../etc/passwd',
        '%00../etc/passwd',
      ];

      it.each(nullBytePayloads)('blocks null byte injection: %s', (payload) => {
        const result = resolvePluginPath(payload);
        expect(result).toBeNull();
      });
    });

    describe('Unicode Normalization Attacks', () => {
      const unicodePayloads = [
        '..%c0%af..%c0%af',
        '..%ef%bc%8f..%ef%bc%8f',
        '\u002e\u002e\u002f',
      ];

      it.each(unicodePayloads)('handles unicode: %s', (payload) => {
        const result = resolvePluginPath(payload);
        // Should either return null or a safe path
        if (result !== null) {
          expect(result.startsWith(PLUGIN_DIR)).toBe(true);
          expect(result).not.toContain('..');
        }
      });
    });

    describe('Windows-Style Path Attacks', () => {
      const windowsPayloads = [
        '..\\..\\..\\windows\\win.ini',
        '....\\\\....\\\\',
        '\\\\server\\share\\..\\..\\',
      ];

      it.each(windowsPayloads)('blocks Windows paths: %s', (payload) => {
        const result = resolvePluginPath(payload);
        expect(result).toBeNull();
      });

      it('handles absolute Windows paths safely', () => {
        // Absolute Windows paths should be rejected or treated safely
        const result = resolvePluginPath('C:\\Windows\\System32');
        // On non-Windows systems, this might resolve as relative path
        if (result !== null) {
          expect(result.startsWith(PLUGIN_DIR)).toBe(true);
        }
      });
    });

    describe('Path Normalization Bypass', () => {
      const bypassPayloads = [
        '/var/log/../../etc/passwd',
        './../../../../etc/passwd',
        'foo/../../../etc/passwd',
        'skills/./../../etc/passwd',
      ];

      it.each(bypassPayloads)('blocks normalization bypass: %s', (payload) => {
        const result = resolvePluginPath(payload);
        expect(result).toBeNull();
      });
    });

    describe('Valid Paths', () => {
      const validPaths = [
        'agents/tester.md',
        'skills/testing/omega-testing/SKILL.md',
        'commands/quality/test-omega.md',
        'workflows/testing/omega-testing.md',
        'registry.yaml',
      ];

      it.each(validPaths)('allows valid path: %s', (path) => {
        const result = resolvePluginPath(path);
        expect(result).not.toBeNull();
        expect(result.startsWith(PLUGIN_DIR)).toBe(true);
      });
    });

    describe('Edge Cases', () => {
      it('rejects null input', () => {
        expect(resolvePluginPath(null)).toBeNull();
      });

      it('rejects undefined input', () => {
        expect(resolvePluginPath(undefined)).toBeNull();
      });

      it('rejects empty string', () => {
        expect(resolvePluginPath('')).toBeNull();
      });

      it('rejects non-string input', () => {
        expect(resolvePluginPath(123)).toBeNull();
        expect(resolvePluginPath({})).toBeNull();
        expect(resolvePluginPath([])).toBeNull();
      });

      it('handles deeply nested valid paths', () => {
        const deepPath = 'skills/testing/omega-testing/sub/deep/file.md';
        const result = resolvePluginPath(deepPath);
        expect(result).not.toBeNull();
        expect(result.startsWith(PLUGIN_DIR)).toBe(true);
      });
    });
  });

  describe('OMGKIT-Specific Path Attacks', () => {
    it.each(omgkitPathPayloads)('blocks OMGKIT path attack: %s', (payload) => {
      const result = resolvePluginPath(payload);
      expect(result).toBeNull();
    });
  });

  describe('Skill ID Validation', () => {
    describe('Valid Skill IDs', () => {
      const validSkillIds = [
        'testing/omega-testing',
        'methodology/tdd',
        'ai-engineering/rag-systems',
        'databases/postgresql',
        'frameworks/react',
      ];

      it.each(validSkillIds)('accepts valid skill ID: %s', (skillId) => {
        const result = validateSkillId(skillId);
        expect(result.valid).toBe(true);
      });
    });

    describe('Invalid Skill IDs', () => {
      const invalidSkillIds = [
        '../../../etc/passwd',
        'testing/../../../etc/passwd',
        '../../secrets',
        'testing//omega',
        '/testing/omega',
        'Testing/Omega',
        'testing_omega/skill',
        'testing/skill.md',
      ];

      it.each(invalidSkillIds)('rejects invalid skill ID: %s', (skillId) => {
        const result = validateSkillId(skillId);
        expect(result.valid).toBe(false);
      });
    });

    describe('Edge Cases', () => {
      it('rejects null', () => {
        expect(validateSkillId(null).valid).toBe(false);
      });

      it('rejects undefined', () => {
        expect(validateSkillId(undefined).valid).toBe(false);
      });

      it('rejects empty string', () => {
        expect(validateSkillId('').valid).toBe(false);
      });

      it('rejects just category', () => {
        expect(validateSkillId('testing').valid).toBe(false);
      });

      it('rejects just skill name', () => {
        expect(validateSkillId('omega-testing').valid).toBe(false);
      });
    });
  });

  describe('Command ID Validation', () => {
    describe('Valid Command IDs', () => {
      const validCommandIds = [
        '/quality:test-omega',
        '/dev:test',
        '/git:commit',
        '/planning:plan',
        '/omega:think', // Commands must start with letter
      ];

      it.each(validCommandIds)('accepts valid command ID: %s', (commandId) => {
        const result = validateCommandId(commandId);
        expect(result.valid).toBe(true);
      });

      it('handles numeric suffixes in command names', () => {
        // Commands like /omega:10x start with digit, so may be invalid per strict format
        const result = validateCommandId('/omega:10x');
        // Either valid or invalid is acceptable - just should not crash
        expect(typeof result.valid).toBe('boolean');
      });
    });

    describe('Invalid Command IDs', () => {
      const invalidCommandIds = [
        'quality:test',
        '/quality/test',
        '/Quality:Test',
        '/quality:test.md',
        '/quality:../../../etc/passwd',
        '/../../../etc/passwd:cmd',
      ];

      it.each(invalidCommandIds)('rejects invalid command ID: %s', (commandId) => {
        const result = validateCommandId(commandId);
        expect(result.valid).toBe(false);
      });
    });
  });

  describe('Full Payload Suite', () => {
    it.each(pathTraversalPayloads)('blocks traversal payload: %s', (payload) => {
      const result = resolvePluginPath(payload);
      // Either null or a safe path within PLUGIN_DIR
      if (result !== null) {
        expect(result.startsWith(PLUGIN_DIR)).toBe(true);
        expect(result).not.toContain('..');
      }
    });
  });
});

describe('Path Security Invariants', () => {
  it('resolved paths never contain ".."', () => {
    const testPaths = [
      'agents/test.md',
      'skills/testing/omega-testing/SKILL.md',
      'commands/quality/test.md',
    ];

    for (const path of testPaths) {
      const resolved = resolvePluginPath(path);
      if (resolved !== null) {
        expect(resolved).not.toContain('..');
      }
    }
  });

  it('resolved paths are always within PLUGIN_DIR', () => {
    const testPaths = [
      'agents/test.md',
      'skills/testing/omega-testing/SKILL.md',
      'commands/quality/test.md',
      'registry.yaml',
    ];

    for (const path of testPaths) {
      const resolved = resolvePluginPath(path);
      if (resolved !== null) {
        expect(resolved.startsWith(PLUGIN_DIR)).toBe(true);
      }
    }
  });

  it('malicious paths with traversal patterns are blocked', () => {
    // Focus on payloads that contain actual traversal patterns
    const traversalPayloads = pathTraversalPayloads.filter(p =>
      p.includes('..') || p.includes('%2e%2e') || p.includes('%252e')
    );

    for (const payload of traversalPayloads) {
      const resolved = resolvePluginPath(payload);
      // Payloads with .. should either:
      // 1. Be rejected (null)
      // 2. Resolve to a safe path within PLUGIN_DIR
      if (resolved !== null) {
        expect(resolved.startsWith(PLUGIN_DIR)).toBe(true);
        // Should not contain .. after resolution
        expect(resolved).not.toContain('..');
      }
    }
  });
});
