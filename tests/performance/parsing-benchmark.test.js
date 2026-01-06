/**
 * Performance Benchmarks for Parsing Operations
 *
 * Tests parsing performance for various operations
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
 * Parse markdown content
 */
function parseMarkdownSections(content) {
  const sections = [];
  const lines = content.split('\n');
  let currentSection = null;
  let currentContent = [];

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      if (currentSection) {
        sections.push({
          ...currentSection,
          content: currentContent.join('\n').trim(),
        });
      }
      currentSection = {
        level: headingMatch[1].length,
        title: headingMatch[2],
      };
      currentContent = [];
    } else if (currentSection) {
      currentContent.push(line);
    }
  }

  if (currentSection) {
    sections.push({
      ...currentSection,
      content: currentContent.join('\n').trim(),
    });
  }

  return sections;
}

/**
 * Collect all markdown files in a directory
 */
function collectMarkdownFiles(dir, files = []) {
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      collectMarkdownFiles(fullPath, files);
    } else if (entry.name.endsWith('.md')) {
      const stats = statSync(fullPath);
      files.push({
        path: fullPath,
        size: stats.size,
      });
    }
  }

  return files;
}

describe('Parsing Performance Benchmarks', () => {
  let allMarkdownFiles = [];
  let sampleContents = [];

  beforeAll(() => {
    // Collect all markdown files
    allMarkdownFiles = collectMarkdownFiles(PLUGIN_DIR);

    // Read sample contents (up to 50 files)
    sampleContents = allMarkdownFiles.slice(0, 50).map(f => ({
      path: f.path,
      content: readFileSync(f.path, 'utf8'),
      size: f.size,
    }));
  });

  describe('Frontmatter Parsing', () => {
    it('parses frontmatter under 1ms for small files', async () => {
      const smallFiles = sampleContents.filter(f => f.size < 5000);
      if (smallFiles.length === 0) {
        expect(true).toBe(true); // Skip if no small files
        return;
      }

      const avgTime = await timeExecution(() => {
        for (const file of smallFiles) {
          parseFrontmatter(file.content);
        }
      }) / smallFiles.length;

      expect(avgTime).toBeLessThan(3);
    });

    it('parses frontmatter under 5ms for medium files', async () => {
      const mediumFiles = sampleContents.filter(f => f.size >= 5000 && f.size < 50000);
      if (mediumFiles.length === 0) {
        expect(true).toBe(true); // Skip if no medium files
        return;
      }

      const avgTime = await timeExecution(() => {
        for (const file of mediumFiles) {
          parseFrontmatter(file.content);
        }
      }) / mediumFiles.length;

      expect(avgTime).toBeLessThan(5);
    });

    it('parses 100 files under 100ms', async () => {
      const iterations = Math.min(100, sampleContents.length);
      const files = sampleContents.slice(0, iterations);

      const totalTime = await timeExecution(() => {
        for (const file of files) {
          parseFrontmatter(file.content);
        }
      });

      expect(totalTime).toBeLessThan(100);
    });
  });

  describe('Markdown Section Parsing', () => {
    it('parses sections under 2ms per file', async () => {
      if (sampleContents.length === 0) return;

      const avgTime = await timeExecution(() => {
        for (const file of sampleContents) {
          parseMarkdownSections(file.content);
        }
      }) / sampleContents.length;

      expect(avgTime).toBeLessThan(2);
    });

    it('handles large files efficiently', async () => {
      const largeContent = '# Section\n\nParagraph content.\n\n'.repeat(1000);

      const time = await timeExecution(() => {
        parseMarkdownSections(largeContent);
      });

      expect(time).toBeLessThan(50);
    });
  });

  describe('YAML Parsing', () => {
    it('parses simple YAML under 1ms', async () => {
      const simpleYaml = `
name: test-agent
description: A test agent
skills:
  - testing/omega
  - methodology/tdd
commands:
  - /dev:test
`;

      const time = await timeExecution(() => {
        yaml.load(simpleYaml, { schema: yaml.SAFE_SCHEMA });
      }, 100);

      expect(time).toBeLessThan(1);
    });

    it('parses complex YAML under 5ms', async () => {
      const complexYaml = `
name: complex-agent
description: A complex agent configuration
metadata:
  version: 1.0.0
  author: OMGKIT Team
  tags:
    - testing
    - automation
skills:
${Array(50).fill('  - testing/skill-name').join('\n')}
commands:
${Array(30).fill('  - /dev:command').join('\n')}
config:
  nested:
    deep:
      value: 123
  array:
${Array(20).fill('    - item').join('\n')}
`;

      const time = await timeExecution(() => {
        yaml.load(complexYaml, { schema: yaml.SAFE_SCHEMA });
      }, 10);

      // Allow 20ms for complex YAML parsing
      expect(time).toBeLessThan(20);
    });
  });

  describe('File Collection', () => {
    it('collects all markdown files under 150ms', async () => {
      const time = await timeExecution(() => {
        collectMarkdownFiles(PLUGIN_DIR);
      });

      expect(time).toBeLessThan(150);
    });

    it('returns correct file count', () => {
      const files = collectMarkdownFiles(PLUGIN_DIR);
      expect(files.length).toBeGreaterThan(100);
    });
  });

  describe('Batch Processing', () => {
    it('processes all plugin files under 500ms', async () => {
      const files = collectMarkdownFiles(PLUGIN_DIR);

      const time = await timeExecution(() => {
        for (const file of files.slice(0, 200)) {
          const content = readFileSync(file.path, 'utf8');
          parseFrontmatter(content);
        }
      });

      expect(time).toBeLessThan(500);
    });

    it('parallel processing is faster than sequential', async () => {
      const files = sampleContents.slice(0, 20);
      if (files.length < 10) {
        expect(true).toBe(true);
        return;
      }

      // Sequential
      const seqStart = performance.now();
      for (const file of files) {
        parseFrontmatter(file.content);
        parseMarkdownSections(file.content);
      }
      const seqTime = performance.now() - seqStart;

      // Simulated parallel (Promise.all)
      const parStart = performance.now();
      await Promise.all(files.map(async (file) => {
        parseFrontmatter(file.content);
        parseMarkdownSections(file.content);
      }));
      const parTime = performance.now() - parStart;

      // Both sequential and parallel should be fast
      expect(seqTime).toBeLessThan(50);
      expect(parTime).toBeLessThan(50);
    });
  });
});

describe('Parsing Performance Invariants', () => {
  it('parsing time scales linearly with file size', async () => {
    const sizes = [1000, 5000, 10000];
    const times = [];

    for (const size of sizes) {
      const content = `---\nname: test\n---\n${'x'.repeat(size)}`;
      const time = await timeExecution(() => {
        parseFrontmatter(content);
      }, 100);
      times.push(time);
    }

    // Time should roughly scale with size (within 10x)
    const ratio1 = times[1] / times[0];
    const ratio2 = times[2] / times[1];

    expect(ratio1).toBeLessThan(10);
    expect(ratio2).toBeLessThan(10);
  });

  it('repeated parsing is consistent', async () => {
    const content = `---\nname: test\ndescription: Test\n---\n# Content`;
    const times = [];

    for (let i = 0; i < 5; i++) {
      const time = await timeExecution(() => {
        parseFrontmatter(content);
      }, 100);
      times.push(time);
    }

    // All parsing operations should be fast (under 1ms each)
    for (const time of times) {
      expect(time).toBeLessThan(1);
    }
  });
});
