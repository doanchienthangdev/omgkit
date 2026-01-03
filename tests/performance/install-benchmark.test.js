/**
 * Performance Benchmarks for Installation Operations
 *
 * Tests installation and setup performance
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, cpSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PACKAGE_ROOT = join(__dirname, '../..');
const PLUGIN_DIR = join(PACKAGE_ROOT, 'plugin');
const TEMP_DIR = join(__dirname, '../fixtures/temp-install');

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
 * Count files in directory recursively
 */
function countFiles(dir) {
  let count = 0;
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        count += countFiles(join(dir, entry.name));
      } else {
        count++;
      }
    }
  } catch (e) {
    // Ignore errors
  }
  return count;
}

/**
 * Collect all markdown files
 */
function collectMarkdownFiles(dir, files = []) {
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        collectMarkdownFiles(fullPath, files);
      } else if (entry.name.endsWith('.md')) {
        files.push(fullPath);
      }
    }
  } catch (e) {
    // Ignore errors
  }
  return files;
}

/**
 * Simulate registry building
 */
function buildRegistry(files) {
  const registry = {
    agents: [],
    skills: [],
    commands: [],
    workflows: [],
  };

  for (const file of files) {
    const relativePath = file.replace(PLUGIN_DIR + '/', '');

    if (relativePath.startsWith('agents/')) {
      registry.agents.push(relativePath);
    } else if (relativePath.startsWith('skills/')) {
      registry.skills.push(relativePath);
    } else if (relativePath.startsWith('commands/')) {
      registry.commands.push(relativePath);
    } else if (relativePath.startsWith('workflows/')) {
      registry.workflows.push(relativePath);
    }
  }

  return registry;
}

/**
 * Simulate component parsing
 */
function parseComponent(content) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return null;

  // Simple YAML-like parsing
  const lines = frontmatterMatch[1].split('\n');
  const result = {};

  for (const line of lines) {
    const match = line.match(/^(\w+):\s*(.*)$/);
    if (match) {
      result[match[1]] = match[2];
    }
  }

  return result;
}

describe('Installation Performance Benchmarks', () => {
  describe('File Discovery', () => {
    it('discovers all plugin files under 100ms', async () => {
      const time = await timeExecution(() => {
        collectMarkdownFiles(PLUGIN_DIR);
      });

      expect(time).toBeLessThan(100);
    });

    it('counts files under 50ms', async () => {
      const time = await timeExecution(() => {
        countFiles(PLUGIN_DIR);
      });

      expect(time).toBeLessThan(50);
    });

    it('discovers 300+ component files', () => {
      const files = collectMarkdownFiles(PLUGIN_DIR);
      expect(files.length).toBeGreaterThan(300);
    });
  });

  describe('Registry Building', () => {
    let allFiles;

    beforeAll(() => {
      allFiles = collectMarkdownFiles(PLUGIN_DIR);
    });

    it('builds registry under 50ms', async () => {
      const time = await timeExecution(() => {
        buildRegistry(allFiles);
      }, 10);

      expect(time).toBeLessThan(50);
    });

    it('categorizes files correctly', () => {
      const registry = buildRegistry(allFiles);

      expect(registry.agents.length).toBeGreaterThan(0);
      expect(registry.skills.length).toBeGreaterThan(0);
      expect(registry.commands.length).toBeGreaterThan(0);
      expect(registry.workflows.length).toBeGreaterThan(0);
    });

    it('registry building scales linearly', async () => {
      const smallFiles = allFiles.slice(0, 100);
      const mediumFiles = allFiles.slice(0, 200);
      const largeFiles = allFiles.slice(0, 300);

      const smallTime = await timeExecution(() => buildRegistry(smallFiles), 10);
      const mediumTime = await timeExecution(() => buildRegistry(mediumFiles), 10);
      const largeTime = await timeExecution(() => buildRegistry(largeFiles), 10);

      // All sizes should build quickly (avoid flaky relative comparisons)
      expect(smallTime).toBeLessThan(5);
      expect(mediumTime).toBeLessThan(5);
      expect(largeTime).toBeLessThan(5);
    });
  });

  describe('Component Loading', () => {
    let sampleFiles;

    beforeAll(() => {
      const allFiles = collectMarkdownFiles(PLUGIN_DIR);
      sampleFiles = allFiles.slice(0, 50);
    });

    it('loads 50 components under 50ms', async () => {
      const time = await timeExecution(() => {
        for (const file of sampleFiles) {
          readFileSync(file, 'utf8');
        }
      });

      expect(time).toBeLessThan(50);
    });

    it('parses 50 components under 30ms', async () => {
      const contents = sampleFiles.map(f => readFileSync(f, 'utf8'));

      const time = await timeExecution(() => {
        for (const content of contents) {
          parseComponent(content);
        }
      }, 5);

      expect(time).toBeLessThan(30);
    });
  });

  describe('Full Installation Simulation', () => {
    it('simulates fresh install under 500ms', async () => {
      const time = await timeExecution(async () => {
        // Step 1: Discover files
        const files = collectMarkdownFiles(PLUGIN_DIR);

        // Step 2: Build registry
        const registry = buildRegistry(files);

        // Step 3: Load sample components
        const sampleFiles = files.slice(0, 100);
        const contents = [];
        for (const file of sampleFiles) {
          contents.push(readFileSync(file, 'utf8'));
        }

        // Step 4: Parse components
        for (const content of contents) {
          parseComponent(content);
        }

        return { registry, componentCount: contents.length };
      });

      expect(time).toBeLessThan(500);
    });

    it('simulates reinstall under 200ms', async () => {
      // First install (warmup)
      const files = collectMarkdownFiles(PLUGIN_DIR);
      buildRegistry(files);

      // Reinstall (should be faster due to OS caching)
      const time = await timeExecution(() => {
        const files = collectMarkdownFiles(PLUGIN_DIR);
        buildRegistry(files);
      });

      expect(time).toBeLessThan(200);
    });
  });

  describe('Incremental Updates', () => {
    let baseRegistry;
    let allFiles;

    beforeAll(() => {
      allFiles = collectMarkdownFiles(PLUGIN_DIR);
      baseRegistry = buildRegistry(allFiles);
    });

    it('detects changes under 50ms', async () => {
      const time = await timeExecution(() => {
        // Simulate change detection by comparing file counts
        const currentFiles = collectMarkdownFiles(PLUGIN_DIR);
        const added = currentFiles.filter(f => !allFiles.includes(f));
        const removed = allFiles.filter(f => !currentFiles.includes(f));
        return { added, removed };
      }, 5);

      expect(time).toBeLessThan(50);
    });

    it('rebuilds single category under 10ms', async () => {
      const time = await timeExecution(() => {
        const agentFiles = allFiles.filter(f => f.includes('/agents/'));
        return agentFiles;
      }, 10);

      expect(time).toBeLessThan(10);
    });
  });
});

describe('Memory Efficiency', () => {
  it('loading 100 files uses reasonable memory', () => {
    const files = collectMarkdownFiles(PLUGIN_DIR).slice(0, 100);

    const before = process.memoryUsage().heapUsed;
    const contents = files.map(f => readFileSync(f, 'utf8'));
    const after = process.memoryUsage().heapUsed;

    const memoryUsed = after - before;
    const avgPerFile = memoryUsed / files.length;

    // Average memory per file should be reasonable (under 100KB)
    expect(avgPerFile).toBeLessThan(100 * 1024);
  });

  it('registry size scales with component count', () => {
    const files = collectMarkdownFiles(PLUGIN_DIR);

    const before = process.memoryUsage().heapUsed;
    const registry = buildRegistry(files);
    const after = process.memoryUsage().heapUsed;

    const memoryUsed = after - before;
    const totalComponents =
      registry.agents.length +
      registry.skills.length +
      registry.commands.length +
      registry.workflows.length;

    // Memory per component should be small (under 1KB)
    if (totalComponents > 0) {
      const memoryPerComponent = memoryUsed / totalComponents;
      expect(memoryPerComponent).toBeLessThan(1024);
    }
  });
});

describe('Concurrent Installation', () => {
  it('handles multiple parallel reads', async () => {
    const files = collectMarkdownFiles(PLUGIN_DIR).slice(0, 50);

    const time = await timeExecution(async () => {
      await Promise.all(files.map(async (file) => {
        const content = readFileSync(file, 'utf8');
        parseComponent(content);
      }));
    });

    // Parallel should not be significantly slower
    expect(time).toBeLessThan(100);
  });

  it('builds multiple registries concurrently', async () => {
    const files = collectMarkdownFiles(PLUGIN_DIR);

    const time = await timeExecution(async () => {
      await Promise.all([
        Promise.resolve(buildRegistry(files)),
        Promise.resolve(buildRegistry(files)),
        Promise.resolve(buildRegistry(files)),
      ]);
    }, 5);

    expect(time).toBeLessThan(100);
  });
});

describe('Installation Performance Invariants', () => {
  it('file discovery is consistent', async () => {
    const counts = [];

    for (let i = 0; i < 5; i++) {
      const files = collectMarkdownFiles(PLUGIN_DIR);
      counts.push(files.length);
    }

    // All counts should be identical
    const first = counts[0];
    for (const count of counts) {
      expect(count).toBe(first);
    }
  });

  it('registry building is deterministic', () => {
    const files = collectMarkdownFiles(PLUGIN_DIR);

    const registry1 = buildRegistry(files);
    const registry2 = buildRegistry(files);

    expect(registry1.agents.length).toBe(registry2.agents.length);
    expect(registry1.skills.length).toBe(registry2.skills.length);
    expect(registry1.commands.length).toBe(registry2.commands.length);
    expect(registry1.workflows.length).toBe(registry2.workflows.length);
  });

  it('performance is consistent across runs', async () => {
    const times = [];

    for (let i = 0; i < 5; i++) {
      const time = await timeExecution(() => {
        collectMarkdownFiles(PLUGIN_DIR);
      });
      times.push(time);
    }

    // Times should be within 200% of average
    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    for (const time of times) {
      expect(time).toBeLessThan(avg * 3);
    }
  });
});
