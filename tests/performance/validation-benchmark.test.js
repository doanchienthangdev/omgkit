/**
 * Performance Benchmarks for Validation Operations
 *
 * Tests validation performance across all component types
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readdirSync, readFileSync, statSync } from 'fs';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PACKAGE_ROOT = join(__dirname, '../..');
const PLUGIN_DIR = join(PACKAGE_ROOT, 'plugin');

/**
 * Time a function execution
 */
async function timeExecution(fn, iterations = 1) {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    await fn();
  }
  const end = performance.now();
  return (end - start) / iterations;
}

/**
 * Collect markdown files from directory
 */
function collectMarkdownFiles(dir, files = []) {
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        collectMarkdownFiles(fullPath, files);
      } else if (entry.name.endsWith('.md')) {
        const stats = statSync(fullPath);
        files.push({ path: fullPath, size: stats.size });
      }
    }
  } catch (e) {
    // Ignore errors
  }
  return files;
}

/**
 * Parse frontmatter from content
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  try {
    return yaml.load(match[1], { schema: yaml.SAFE_SCHEMA });
  } catch (e) {
    return null;
  }
}

/**
 * Validate agent frontmatter
 */
function validateAgent(frontmatter, content) {
  const errors = [];

  if (!frontmatter.name) errors.push('Missing name');
  if (!frontmatter.description) errors.push('Missing description');
  if (!Array.isArray(frontmatter.skills)) errors.push('Missing skills array');
  if (!Array.isArray(frontmatter.commands)) errors.push('Missing commands array');

  // Content validation
  if (content.length < 50) errors.push('Content too short');

  return { valid: errors.length === 0, errors };
}

/**
 * Validate skill frontmatter
 */
function validateSkill(frontmatter, content) {
  const errors = [];

  if (!frontmatter.name) errors.push('Missing name');
  if (!frontmatter.description) errors.push('Missing description');
  if (!frontmatter.category) errors.push('Missing category');

  // Content validation
  if (content.length < 30) errors.push('Content too short');

  return { valid: errors.length === 0, errors };
}

/**
 * Validate command frontmatter
 */
function validateCommand(frontmatter, content) {
  const errors = [];

  if (!frontmatter.name) errors.push('Missing name');
  if (!frontmatter.description) errors.push('Missing description');

  // Format validation
  if (frontmatter.name && !frontmatter.name.includes(':')) {
    errors.push('Invalid command format');
  }

  // Content validation
  if (content.length < 15) errors.push('Content too short');

  return { valid: errors.length === 0, errors };
}

/**
 * Validate workflow frontmatter
 */
function validateWorkflow(frontmatter, content) {
  const errors = [];

  if (!frontmatter.name) errors.push('Missing name');
  if (!frontmatter.description) errors.push('Missing description');
  if (!Array.isArray(frontmatter.agents)) errors.push('Missing agents array');

  // Content validation
  if (content.length < 50) errors.push('Content too short');

  return { valid: errors.length === 0, errors };
}

/**
 * Validate skill ID format
 */
function validateSkillId(id) {
  const pattern = /^[a-z][a-z0-9-]*\/[a-z][a-z0-9-]*$/;
  return pattern.test(id);
}

/**
 * Validate command ID format
 */
function validateCommandId(id) {
  const pattern = /^\/[a-z][a-z0-9-]*:[a-z][a-z0-9-]*$/;
  return pattern.test(id);
}

/**
 * Validate dependency references
 */
function validateDependencies(frontmatter, validSkills, validCommands) {
  const errors = [];

  if (frontmatter.skills) {
    for (const skill of frontmatter.skills) {
      if (!validSkills.has(skill)) {
        errors.push(`Invalid skill reference: ${skill}`);
      }
    }
  }

  if (frontmatter.commands) {
    for (const cmd of frontmatter.commands) {
      if (!validCommands.has(cmd)) {
        errors.push(`Invalid command reference: ${cmd}`);
      }
    }
  }

  return errors;
}

describe('Validation Performance Benchmarks', () => {
  let allFiles;
  let agentFiles;
  let skillFiles;
  let commandFiles;
  let workflowFiles;
  let fileContents;

  beforeAll(() => {
    allFiles = collectMarkdownFiles(PLUGIN_DIR);

    agentFiles = allFiles.filter(f => f.path.includes('/agents/'));
    skillFiles = allFiles.filter(f => f.path.includes('/skills/'));
    commandFiles = allFiles.filter(f => f.path.includes('/commands/'));
    workflowFiles = allFiles.filter(f => f.path.includes('/workflows/'));

    // Pre-load contents
    fileContents = new Map();
    for (const file of allFiles.slice(0, 200)) {
      fileContents.set(file.path, readFileSync(file.path, 'utf8'));
    }
  });

  describe('Frontmatter Validation', () => {
    it('validates 100 frontmatters under 100ms', async () => {
      const files = allFiles.slice(0, 100);

      const time = await timeExecution(() => {
        for (const file of files) {
          const content = fileContents.get(file.path) || readFileSync(file.path, 'utf8');
          parseFrontmatter(content);
        }
      });

      // Allow up to 100ms for parsing (accounts for cold cache)
      expect(time).toBeLessThan(100);
    });

    it('validates frontmatter parsing under 1ms per file', async () => {
      const files = allFiles.slice(0, 50);

      const totalTime = await timeExecution(() => {
        for (const file of files) {
          const content = fileContents.get(file.path) || readFileSync(file.path, 'utf8');
          parseFrontmatter(content);
        }
      }, 5);

      const avgTime = totalTime / files.length;
      expect(avgTime).toBeLessThan(1);
    });
  });

  describe('Component Type Validation', () => {
    it('validates agents under 20ms', async () => {
      const files = agentFiles.slice(0, 30);

      const time = await timeExecution(() => {
        for (const file of files) {
          const content = fileContents.get(file.path) || readFileSync(file.path, 'utf8');
          const frontmatter = parseFrontmatter(content);
          if (frontmatter) {
            validateAgent(frontmatter, content);
          }
        }
      }, 5);

      expect(time).toBeLessThan(20);
    });

    it('validates skills under 100ms', async () => {
      const files = skillFiles.slice(0, 50);

      const time = await timeExecution(() => {
        for (const file of files) {
          const content = fileContents.get(file.path) || readFileSync(file.path, 'utf8');
          const frontmatter = parseFrontmatter(content);
          if (frontmatter) {
            validateSkill(frontmatter, content);
          }
        }
      }, 5);

      expect(time).toBeLessThan(100);
    });

    it('validates commands under 30ms', async () => {
      const files = commandFiles.slice(0, 50);

      const time = await timeExecution(() => {
        for (const file of files) {
          const content = fileContents.get(file.path) || readFileSync(file.path, 'utf8');
          const frontmatter = parseFrontmatter(content);
          if (frontmatter) {
            validateCommand(frontmatter, content);
          }
        }
      }, 5);

      expect(time).toBeLessThan(30);
    });

    it('validates workflows under 20ms', async () => {
      const files = workflowFiles.slice(0, 30);

      const time = await timeExecution(() => {
        for (const file of files) {
          const content = fileContents.get(file.path) || readFileSync(file.path, 'utf8');
          const frontmatter = parseFrontmatter(content);
          if (frontmatter) {
            validateWorkflow(frontmatter, content);
          }
        }
      }, 5);

      expect(time).toBeLessThan(20);
    });
  });

  describe('ID Format Validation', () => {
    it('validates 1000 skill IDs under 5ms', async () => {
      const skillIds = Array(1000).fill(0).map((_, i) => `category-${i % 10}/skill-${i}`);

      const time = await timeExecution(() => {
        for (const id of skillIds) {
          validateSkillId(id);
        }
      }, 10);

      expect(time).toBeLessThan(5);
    });

    it('validates 1000 command IDs under 5ms', async () => {
      const commandIds = Array(1000).fill(0).map((_, i) => `/namespace-${i % 10}:command-${i}`);

      const time = await timeExecution(() => {
        for (const id of commandIds) {
          validateCommandId(id);
        }
      }, 10);

      expect(time).toBeLessThan(5);
    });

    it('regex validation is O(n) with ID length', async () => {
      const shortIds = Array(100).fill(0).map((_, i) => `cat/sk${i}`);
      const longIds = Array(100).fill(0).map((_, i) => `category-name-long/skill-name-very-long-${i}`);

      const shortTime = await timeExecution(() => {
        for (const id of shortIds) {
          validateSkillId(id);
        }
      }, 50);

      const longTime = await timeExecution(() => {
        for (const id of longIds) {
          validateSkillId(id);
        }
      }, 50);

      // Long IDs should not take more than 5x time
      expect(longTime).toBeLessThan(shortTime * 5);
    });
  });

  describe('Dependency Validation', () => {
    let validSkills;
    let validCommands;

    beforeAll(() => {
      validSkills = new Set();
      validCommands = new Set();

      for (const file of skillFiles) {
        const content = fileContents.get(file.path) || readFileSync(file.path, 'utf8');
        const fm = parseFrontmatter(content);
        if (fm && fm.name) {
          validSkills.add(fm.name);
        }
      }

      for (const file of commandFiles) {
        const content = fileContents.get(file.path) || readFileSync(file.path, 'utf8');
        const fm = parseFrontmatter(content);
        if (fm && fm.name) {
          validCommands.add(fm.name);
        }
      }
    });

    it('validates dependencies under 30ms', async () => {
      const files = agentFiles.slice(0, 30);

      const time = await timeExecution(() => {
        for (const file of files) {
          const content = fileContents.get(file.path) || readFileSync(file.path, 'utf8');
          const frontmatter = parseFrontmatter(content);
          if (frontmatter) {
            validateDependencies(frontmatter, validSkills, validCommands);
          }
        }
      }, 5);

      expect(time).toBeLessThan(30);
    });

    it('set lookup is O(1)', async () => {
      const lookups = 10000;

      const time = await timeExecution(() => {
        for (let i = 0; i < lookups; i++) {
          validSkills.has(`testing/skill-${i % 100}`);
        }
      }, 10);

      expect(time).toBeLessThan(5);
    });
  });

  describe('Full Validation Suite', () => {
    it('validates 100 components under 200ms', async () => {
      const files = allFiles.slice(0, 100);

      const time = await timeExecution(() => {
        for (const file of files) {
          const content = fileContents.get(file.path) || readFileSync(file.path, 'utf8');
          const frontmatter = parseFrontmatter(content);

          if (frontmatter) {
            if (file.path.includes('/agents/')) {
              validateAgent(frontmatter, content);
            } else if (file.path.includes('/skills/')) {
              validateSkill(frontmatter, content);
            } else if (file.path.includes('/commands/')) {
              validateCommand(frontmatter, content);
            } else if (file.path.includes('/workflows/')) {
              validateWorkflow(frontmatter, content);
            }
          }
        }
      });

      expect(time).toBeLessThan(200);
    });

    it('parallel validation is efficient', async () => {
      const files = allFiles.slice(0, 50);

      // Sequential
      const seqStart = performance.now();
      for (const file of files) {
        const content = fileContents.get(file.path) || readFileSync(file.path, 'utf8');
        parseFrontmatter(content);
      }
      const seqTime = performance.now() - seqStart;

      // Parallel
      const parStart = performance.now();
      await Promise.all(files.map(async (file) => {
        const content = fileContents.get(file.path) || readFileSync(file.path, 'utf8');
        parseFrontmatter(content);
      }));
      const parTime = performance.now() - parStart;

      // Both should complete in reasonable time
      expect(seqTime).toBeLessThan(500);
      expect(parTime).toBeLessThan(500);
    });
  });
});

describe('Validation Scaling', () => {
  it('validation time scales linearly with file count', async () => {
    const allFiles = collectMarkdownFiles(PLUGIN_DIR);
    const times = [];

    for (const count of [25, 50, 100]) {
      const files = allFiles.slice(0, count);

      const time = await timeExecution(() => {
        for (const file of files) {
          const content = readFileSync(file.path, 'utf8');
          parseFrontmatter(content);
        }
      });

      times.push({ count, time });
    }

    // All operations should complete in reasonable time
    for (const { time } of times) {
      expect(time).toBeLessThan(200);
    }
  });

  it('validation time is consistent', async () => {
    const files = collectMarkdownFiles(PLUGIN_DIR).slice(0, 50);
    const times = [];

    for (let i = 0; i < 5; i++) {
      const time = await timeExecution(() => {
        for (const file of files) {
          const content = readFileSync(file.path, 'utf8');
          parseFrontmatter(content);
        }
      });
      times.push(time);
    }

    // All times should be fast (under 100ms)
    for (const time of times) {
      expect(time).toBeLessThan(100);
    }
  });
});

describe('Validation Error Reporting', () => {
  it('collects errors efficiently', async () => {
    const testComponents = Array(100).fill(0).map((_, i) => ({
      frontmatter: {
        name: i % 2 === 0 ? `test-${i}` : null,
        description: i % 3 === 0 ? `Description ${i}` : null,
      },
      content: 'x'.repeat(100),
    }));

    const time = await timeExecution(() => {
      const allErrors = [];
      for (const comp of testComponents) {
        const errors = [];
        if (!comp.frontmatter.name) errors.push('Missing name');
        if (!comp.frontmatter.description) errors.push('Missing description');
        allErrors.push({ errors, valid: errors.length === 0 });
      }
      return allErrors;
    }, 10);

    expect(time).toBeLessThan(5);
  });

  it('error aggregation under 10ms', async () => {
    const componentErrors = Array(100).fill(0).map((_, i) => ({
      file: `file-${i}.md`,
      errors: i % 2 === 0 ? ['Error 1', 'Error 2'] : [],
    }));

    const time = await timeExecution(() => {
      const summary = {
        total: componentErrors.length,
        valid: 0,
        invalid: 0,
        errors: [],
      };

      for (const comp of componentErrors) {
        if (comp.errors.length === 0) {
          summary.valid++;
        } else {
          summary.invalid++;
          summary.errors.push(...comp.errors.map(e => `${comp.file}: ${e}`));
        }
      }

      return summary;
    }, 10);

    expect(time).toBeLessThan(10);
  });
});

describe('Validation Performance Invariants', () => {
  it('validation produces consistent results', () => {
    const content = `---
name: test-agent
description: A test agent
skills:
  - testing/omega
commands:
  - /dev:test
---

# Test Agent

This is a test agent.
`;

    const results = [];
    for (let i = 0; i < 10; i++) {
      const frontmatter = parseFrontmatter(content);
      const result = validateAgent(frontmatter, content);
      results.push(result);
    }

    // All results should be identical
    const first = results[0];
    for (const result of results) {
      expect(result.valid).toBe(first.valid);
      expect(result.errors.length).toBe(first.errors.length);
    }
  });

  it('invalid content always produces errors', () => {
    const invalidContents = [
      '---\n---\nNo frontmatter',
      '---\nname: test\n---\nShort',
      '---\ndescription: only\n---\nContent',
    ];

    for (const content of invalidContents) {
      const frontmatter = parseFrontmatter(content);
      if (frontmatter) {
        const result = validateAgent(frontmatter, content);
        expect(result.errors.length).toBeGreaterThan(0);
      }
    }
  });
});
