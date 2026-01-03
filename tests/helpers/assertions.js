/**
 * Custom Test Assertions
 *
 * Custom matchers for Vitest to make OMGKIT testing more expressive
 */

import { expect } from 'vitest';
import yaml from 'js-yaml';

/**
 * Register custom matchers with Vitest
 */
export function registerCustomMatchers() {
  expect.extend({
    /**
     * Check if content is valid markdown
     */
    toBeValidMarkdown(received) {
      const pass = typeof received === 'string' &&
        received.length > 0 &&
        !received.includes('\x00'); // No null bytes

      return {
        pass,
        message: () => pass
          ? `Expected content not to be valid markdown`
          : `Expected content to be valid markdown, but got ${typeof received === 'string' ? `string of length ${received.length}` : typeof received}`,
      };
    },

    /**
     * Check if content has valid YAML frontmatter
     */
    toHaveFrontmatter(received) {
      if (typeof received !== 'string') {
        return {
          pass: false,
          message: () => `Expected string, got ${typeof received}`,
        };
      }

      const frontmatterMatch = received.match(/^---\n([\s\S]*?)\n---/);
      if (!frontmatterMatch) {
        return {
          pass: false,
          message: () => `Expected content to have frontmatter delimiters (--- ... ---)`,
        };
      }

      try {
        const parsed = yaml.load(frontmatterMatch[1]);
        const pass = parsed !== null && typeof parsed === 'object';
        return {
          pass,
          message: () => pass
            ? `Expected content not to have valid frontmatter`
            : `Expected frontmatter to parse as object, got ${typeof parsed}`,
        };
      } catch (e) {
        return {
          pass: false,
          message: () => `Expected frontmatter to be valid YAML, but got error: ${e.message}`,
        };
      }
    },

    /**
     * Check if component follows alignment principle
     */
    toBeAligned(received, componentType) {
      const alignmentRules = {
        agent: {
          requiredFields: ['name', 'description', 'skills', 'commands'],
          skillFormat: /^[a-z-]+\/[a-z-]+$/,
          commandFormat: /^\/[a-z]+:[a-z0-9-]+$/,
        },
        skill: {
          requiredFields: ['name', 'description'],
          nameFormat: /^[a-z-]+$/,
        },
        command: {
          requiredFields: ['description'],
        },
        workflow: {
          requiredFields: ['name', 'description', 'agents'],
          agentFormat: /^[a-z-]+$/,
        },
      };

      const rules = alignmentRules[componentType];
      if (!rules) {
        return {
          pass: false,
          message: () => `Unknown component type: ${componentType}`,
        };
      }

      // Parse frontmatter
      let frontmatter;
      try {
        const match = received.match(/^---\n([\s\S]*?)\n---/);
        if (!match) {
          return {
            pass: false,
            message: () => `Expected content to have frontmatter`,
          };
        }
        frontmatter = yaml.load(match[1]);
      } catch (e) {
        return {
          pass: false,
          message: () => `Failed to parse frontmatter: ${e.message}`,
        };
      }

      // Check required fields
      for (const field of rules.requiredFields) {
        if (!(field in frontmatter)) {
          return {
            pass: false,
            message: () => `Missing required field: ${field}`,
          };
        }
      }

      // Check format rules
      if (rules.skillFormat && frontmatter.skills) {
        for (const skill of frontmatter.skills) {
          if (!rules.skillFormat.test(skill)) {
            return {
              pass: false,
              message: () => `Invalid skill format: ${skill}. Expected category/skill-name`,
            };
          }
        }
      }

      if (rules.commandFormat && frontmatter.commands) {
        for (const cmd of frontmatter.commands) {
          if (!rules.commandFormat.test(cmd)) {
            return {
              pass: false,
              message: () => `Invalid command format: ${cmd}. Expected /namespace:command-name`,
            };
          }
        }
      }

      return {
        pass: true,
        message: () => `Expected component not to be aligned`,
      };
    },

    /**
     * Check if skill ID matches format
     */
    toMatchSkillFormat(received) {
      const skillFormat = /^[a-z][a-z0-9-]*\/[a-z][a-z0-9-]*$/;
      const pass = typeof received === 'string' && skillFormat.test(received);

      return {
        pass,
        message: () => pass
          ? `Expected ${received} not to match skill format`
          : `Expected ${received} to match skill format (category/skill-name)`,
      };
    },

    /**
     * Check if command ID matches format
     */
    toMatchCommandFormat(received) {
      const commandFormat = /^\/[a-z][a-z0-9-]*:[a-z][a-z0-9-]*$/;
      const pass = typeof received === 'string' && commandFormat.test(received);

      return {
        pass,
        message: () => pass
          ? `Expected ${received} not to match command format`
          : `Expected ${received} to match command format (/namespace:command-name)`,
      };
    },

    /**
     * Check if content has minimum line count
     */
    toHaveMinimumLines(received, minLines) {
      const lineCount = typeof received === 'string'
        ? received.split('\n').length
        : 0;
      const pass = lineCount >= minLines;

      return {
        pass,
        message: () => pass
          ? `Expected content to have fewer than ${minLines} lines`
          : `Expected at least ${minLines} lines, but got ${lineCount}`,
      };
    },

    /**
     * Check if content has no prohibited patterns
     */
    toHaveNoProhibitedPatterns(received) {
      const prohibitedPatterns = [
        /^[\s]*TODO:/im,
        /^[\s]*FIXME:/im,
        /^[\s]*HACK:/im,
        /\[INSERT\s+[^\]]+\]/i,
        /\[PLACEHOLDER[^\]]*\]/i,
        /^\s*TBD\s*$/im,
      ];

      const matches = [];
      for (const pattern of prohibitedPatterns) {
        if (pattern.test(received)) {
          const match = received.match(pattern);
          matches.push(match ? match[0] : pattern.toString());
        }
      }

      const pass = matches.length === 0;

      return {
        pass,
        message: () => pass
          ? `Expected content to have prohibited patterns`
          : `Found prohibited patterns: ${matches.join(', ')}`,
      };
    },

    /**
     * Check if path is safe (no traversal)
     */
    toBeSafePath(received) {
      const dangerousPatterns = [
        /\.\./,
        /%2e%2e/i,
        /%252e/i,
        /\x00/,
        /^\/etc\//,
        /^\/var\//,
        /^C:\\/i,
      ];

      const unsafe = dangerousPatterns.some(p => p.test(received));
      const pass = !unsafe;

      return {
        pass,
        message: () => pass
          ? `Expected ${received} to be unsafe`
          : `Expected ${received} to be safe, but contains dangerous patterns`,
      };
    },

    /**
     * Check if object has expected structure
     */
    toHaveStructure(received, structure) {
      const checkStructure = (obj, expected, path = '') => {
        for (const [key, value] of Object.entries(expected)) {
          const currentPath = path ? `${path}.${key}` : key;

          if (!(key in obj)) {
            return { pass: false, missing: currentPath };
          }

          if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            const result = checkStructure(obj[key], value, currentPath);
            if (!result.pass) return result;
          }
        }
        return { pass: true };
      };

      const result = checkStructure(received, structure);

      return {
        pass: result.pass,
        message: () => result.pass
          ? `Expected object not to have structure`
          : `Missing required property: ${result.missing}`,
      };
    },
  });
}

/**
 * Parse frontmatter from content
 */
export function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  try {
    return yaml.load(match[1]);
  } catch (e) {
    return null;
  }
}

/**
 * Extract content after frontmatter
 */
export function extractContent(content) {
  const match = content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
  return match ? match[1] : content;
}

/**
 * Count lines in content
 */
export function countLines(content) {
  return content.split('\n').length;
}

/**
 * Check if content contains any sensitive data
 */
export function containsSensitiveData(content) {
  const sensitivePatterns = [
    /api[_-]?key\s*[:=]/i,
    /secret\s*[:=]/i,
    /password\s*[:=]/i,
    /token\s*[:=]/i,
    /credential/i,
    /private[_-]?key/i,
    /-----BEGIN.*PRIVATE KEY-----/,
  ];

  return sensitivePatterns.some(p => p.test(content));
}

export default {
  registerCustomMatchers,
  parseFrontmatter,
  extractContent,
  countLines,
  containsSensitiveData,
};
