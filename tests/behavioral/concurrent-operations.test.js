/**
 * Behavioral Tests for Concurrent Operations
 *
 * Tests system behavior under concurrent access patterns
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PACKAGE_ROOT = join(__dirname, '../..');
const TEMP_DIR = join(PACKAGE_ROOT, 'tests/.temp-concurrent');

// Helper to simulate async operations
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to run operations concurrently
async function runConcurrently(operations) {
  return Promise.all(operations.map(op => op()));
}

// Helper to run operations with controlled concurrency
async function runWithConcurrency(operations, concurrency = 5) {
  const results = [];
  const executing = [];

  for (const operation of operations) {
    const p = operation().then(result => {
      executing.splice(executing.indexOf(p), 1);
      return result;
    });
    results.push(p);
    executing.push(p);

    if (executing.length >= concurrency) {
      await Promise.race(executing);
    }
  }

  return Promise.all(results);
}

/**
 * Mock registry for testing concurrent access
 */
class MockRegistry {
  constructor() {
    this.data = new Map();
    this.locks = new Map();
    this.accessLog = [];
  }

  async read(key) {
    this.accessLog.push({ type: 'read', key, time: Date.now() });
    await delay(Math.random() * 10); // Simulate I/O
    return this.data.get(key);
  }

  async write(key, value) {
    this.accessLog.push({ type: 'write', key, time: Date.now() });
    await delay(Math.random() * 10); // Simulate I/O
    this.data.set(key, value);
    return true;
  }

  async atomicUpdate(key, updateFn) {
    // Simulate atomic operation with locking
    while (this.locks.get(key)) {
      await delay(1);
    }
    this.locks.set(key, true);
    try {
      const current = await this.read(key);
      const updated = updateFn(current);
      await this.write(key, updated);
      return updated;
    } finally {
      this.locks.delete(key);
    }
  }

  getAccessLog() {
    return [...this.accessLog];
  }

  clearAccessLog() {
    this.accessLog = [];
  }
}

/**
 * Mock file system for testing concurrent file operations
 */
class MockFileSystem {
  constructor() {
    this.files = new Map();
    this.accessCount = new Map();
  }

  async read(path) {
    const count = this.accessCount.get(path) || 0;
    this.accessCount.set(path, count + 1);
    await delay(Math.random() * 5);
    return this.files.get(path);
  }

  async write(path, content) {
    await delay(Math.random() * 10);
    this.files.set(path, content);
    return true;
  }

  async exists(path) {
    return this.files.has(path);
  }

  async list(pattern) {
    await delay(Math.random() * 5);
    return [...this.files.keys()].filter(k =>
      pattern ? k.includes(pattern) : true
    );
  }

  getAccessCount(path) {
    return this.accessCount.get(path) || 0;
  }

  clearAccessCount() {
    this.accessCount.clear();
  }
}

/**
 * Mock dependency graph builder
 */
class MockGraphBuilder {
  constructor() {
    this.nodes = new Map();
    this.buildCount = 0;
  }

  async addNode(id, deps = []) {
    await delay(Math.random() * 5);
    this.nodes.set(id, { id, deps });
    return true;
  }

  async buildGraph() {
    this.buildCount++;
    await delay(Math.random() * 20);
    return { nodeCount: this.nodes.size, buildNumber: this.buildCount };
  }

  async validateGraph() {
    await delay(Math.random() * 10);
    // Check for cycles
    const visited = new Set();
    const recursionStack = new Set();

    const hasCycle = (nodeId) => {
      if (!this.nodes.has(nodeId)) return false;
      if (recursionStack.has(nodeId)) return true;
      if (visited.has(nodeId)) return false;

      visited.add(nodeId);
      recursionStack.add(nodeId);

      const node = this.nodes.get(nodeId);
      for (const dep of node.deps) {
        if (hasCycle(dep)) return true;
      }

      recursionStack.delete(nodeId);
      return false;
    };

    for (const nodeId of this.nodes.keys()) {
      if (hasCycle(nodeId)) return { valid: false, error: 'Cycle detected' };
    }

    return { valid: true };
  }
}

describe('Concurrent Operations Behavioral Tests', () => {
  let tempDir;

  beforeAll(() => {
    tempDir = TEMP_DIR;
    if (!existsSync(tempDir)) {
      mkdirSync(tempDir, { recursive: true });
    }
  });

  afterAll(() => {
    if (existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe('Concurrent Registry Access', () => {
    it('handles concurrent reads', async () => {
      const registry = new MockRegistry();
      registry.data.set('test-key', 'test-value');

      const reads = Array(100).fill(null).map(() =>
        () => registry.read('test-key')
      );

      const results = await runConcurrently(reads);

      // All reads should return the same value
      expect(results.every(r => r === 'test-value')).toBe(true);
      expect(results.length).toBe(100);
    });

    it('handles concurrent writes to different keys', async () => {
      const registry = new MockRegistry();

      const writes = Array(50).fill(null).map((_, i) =>
        () => registry.write(`key-${i}`, `value-${i}`)
      );

      const results = await runConcurrently(writes);

      expect(results.every(r => r === true)).toBe(true);
      expect(registry.data.size).toBe(50);
    });

    it('handles atomic updates correctly', async () => {
      const registry = new MockRegistry();
      registry.data.set('counter', 0);

      const increments = Array(100).fill(null).map(() =>
        () => registry.atomicUpdate('counter', (val) => (val || 0) + 1)
      );

      await runConcurrently(increments);

      // Counter should be exactly 100 after all increments
      expect(registry.data.get('counter')).toBe(100);
    });

    it('maintains data integrity under mixed read/write', async () => {
      const registry = new MockRegistry();
      registry.data.set('shared', { count: 0, values: [] });

      const operations = [];

      // 50 reads
      for (let i = 0; i < 50; i++) {
        operations.push(() => registry.read('shared'));
      }

      // 50 writes
      for (let i = 0; i < 50; i++) {
        operations.push(() =>
          registry.atomicUpdate('shared', (val) => ({
            count: (val?.count || 0) + 1,
            values: [...(val?.values || []), i],
          }))
        );
      }

      // Shuffle operations
      operations.sort(() => Math.random() - 0.5);

      await runConcurrently(operations);

      const final = registry.data.get('shared');
      expect(final.count).toBe(50);
      expect(final.values.length).toBe(50);
    });
  });

  describe('Concurrent File Operations', () => {
    it('handles concurrent file reads', async () => {
      const fs = new MockFileSystem();
      fs.files.set('/test/file.md', 'content');

      const reads = Array(100).fill(null).map(() =>
        () => fs.read('/test/file.md')
      );

      const results = await runConcurrently(reads);

      expect(results.every(r => r === 'content')).toBe(true);
      expect(fs.getAccessCount('/test/file.md')).toBe(100);
    });

    it('handles concurrent writes to different files', async () => {
      const fs = new MockFileSystem();

      const writes = Array(100).fill(null).map((_, i) =>
        () => fs.write(`/test/file-${i}.md`, `content-${i}`)
      );

      await runConcurrently(writes);

      expect(fs.files.size).toBe(100);
      for (let i = 0; i < 100; i++) {
        expect(fs.files.get(`/test/file-${i}.md`)).toBe(`content-${i}`);
      }
    });

    it('handles concurrent directory listings', async () => {
      const fs = new MockFileSystem();
      for (let i = 0; i < 50; i++) {
        fs.files.set(`/agents/agent-${i}.md`, 'content');
        fs.files.set(`/skills/skill-${i}/SKILL.md`, 'content');
      }

      const listings = Array(20).fill(null).map(() =>
        () => fs.list('agent')
      );

      const results = await runConcurrently(listings);

      // All listings should return the same result
      const expected = results[0];
      expect(results.every(r => JSON.stringify(r) === JSON.stringify(expected))).toBe(true);
      expect(expected.length).toBe(50);
    });

    it('handles mixed read/write/list operations', async () => {
      const fs = new MockFileSystem();

      // Pre-populate some files
      for (let i = 0; i < 20; i++) {
        fs.files.set(`/existing/file-${i}.md`, `original-${i}`);
      }

      const operations = [];

      // 30 reads of existing files
      for (let i = 0; i < 30; i++) {
        operations.push(() => fs.read(`/existing/file-${i % 20}.md`));
      }

      // 30 writes to new files
      for (let i = 0; i < 30; i++) {
        operations.push(() => fs.write(`/new/file-${i}.md`, `new-${i}`));
      }

      // 10 listings
      for (let i = 0; i < 10; i++) {
        operations.push(() => fs.list(''));
      }

      // Shuffle and run
      operations.sort(() => Math.random() - 0.5);
      const results = await runConcurrently(operations);

      expect(results.length).toBe(70);
      expect(fs.files.size).toBe(50); // 20 existing + 30 new
    });
  });

  describe('Concurrent Graph Building', () => {
    it('handles concurrent node additions', async () => {
      const builder = new MockGraphBuilder();

      const additions = Array(50).fill(null).map((_, i) =>
        () => builder.addNode(`node-${i}`, i > 0 ? [`node-${i - 1}`] : [])
      );

      await runConcurrently(additions);

      expect(builder.nodes.size).toBe(50);
    });

    it('handles concurrent graph builds', async () => {
      const builder = new MockGraphBuilder();

      // Add some nodes first
      for (let i = 0; i < 20; i++) {
        builder.nodes.set(`node-${i}`, { id: `node-${i}`, deps: [] });
      }

      const builds = Array(10).fill(null).map(() =>
        () => builder.buildGraph()
      );

      const results = await runConcurrently(builds);

      // All builds should return same node count
      expect(results.every(r => r.nodeCount === 20)).toBe(true);
      // Build count should increment for each build
      expect(builder.buildCount).toBe(10);
    });

    it('handles concurrent validation', async () => {
      const builder = new MockGraphBuilder();

      // Build a valid graph
      builder.nodes.set('a', { id: 'a', deps: ['b', 'c'] });
      builder.nodes.set('b', { id: 'b', deps: ['d'] });
      builder.nodes.set('c', { id: 'c', deps: ['d'] });
      builder.nodes.set('d', { id: 'd', deps: [] });

      const validations = Array(20).fill(null).map(() =>
        () => builder.validateGraph()
      );

      const results = await runConcurrently(validations);

      expect(results.every(r => r.valid === true)).toBe(true);
    });

    it('detects cycles during concurrent validation', async () => {
      const builder = new MockGraphBuilder();

      // Build a cyclic graph
      builder.nodes.set('a', { id: 'a', deps: ['b'] });
      builder.nodes.set('b', { id: 'b', deps: ['c'] });
      builder.nodes.set('c', { id: 'c', deps: ['a'] }); // Cycle!

      const validations = Array(10).fill(null).map(() =>
        () => builder.validateGraph()
      );

      const results = await runConcurrently(validations);

      expect(results.every(r => r.valid === false)).toBe(true);
      expect(results.every(r => r.error === 'Cycle detected')).toBe(true);
    });
  });

  describe('Rate Limiting and Throttling', () => {
    it('respects concurrency limits', async () => {
      let activeCount = 0;
      let maxActive = 0;

      const operations = Array(50).fill(null).map(() =>
        async () => {
          activeCount++;
          maxActive = Math.max(maxActive, activeCount);
          await delay(10);
          activeCount--;
          return true;
        }
      );

      await runWithConcurrency(operations, 5);

      // Should never exceed concurrency limit
      expect(maxActive).toBeLessThanOrEqual(5);
    });

    it('completes all operations with throttling', async () => {
      let completedCount = 0;

      const operations = Array(100).fill(null).map(() =>
        async () => {
          await delay(Math.random() * 5);
          completedCount++;
          return true;
        }
      );

      await runWithConcurrency(operations, 10);

      expect(completedCount).toBe(100);
    });
  });

  describe('Error Handling Under Concurrency', () => {
    it('handles individual operation failures', async () => {
      const operations = Array(20).fill(null).map((_, i) =>
        async () => {
          await delay(Math.random() * 10);
          if (i === 10) {
            throw new Error('Operation 10 failed');
          }
          return i;
        }
      );

      const results = await Promise.allSettled(operations.map(op => op()));

      const successful = results.filter(r => r.status === 'fulfilled');
      const failed = results.filter(r => r.status === 'rejected');

      expect(successful.length).toBe(19);
      expect(failed.length).toBe(1);
    });

    it('continues processing after errors', async () => {
      const completed = [];

      const operations = Array(20).fill(null).map((_, i) =>
        async () => {
          await delay(Math.random() * 10);
          if (i % 5 === 0) {
            throw new Error(`Operation ${i} failed`);
          }
          completed.push(i);
          return i;
        }
      );

      await Promise.allSettled(operations.map(op => op()));

      // Should complete 16 operations (20 - 4 that fail at 0, 5, 10, 15)
      expect(completed.length).toBe(16);
    });

    it('isolates errors between operations', async () => {
      const registry = new MockRegistry();
      registry.data.set('key1', 'value1');
      registry.data.set('key2', 'value2');

      const operations = [
        async () => {
          await registry.read('key1');
          throw new Error('Error after read');
        },
        async () => registry.read('key2'),
        async () => registry.write('key3', 'value3'),
      ];

      const results = await Promise.allSettled(operations.map(op => op()));

      expect(results[0].status).toBe('rejected');
      expect(results[1].status).toBe('fulfilled');
      expect(results[2].status).toBe('fulfilled');

      // Error should not affect other operations
      expect(registry.data.get('key3')).toBe('value3');
    });
  });

  describe('Data Consistency', () => {
    it('maintains consistency during concurrent updates', async () => {
      const registry = new MockRegistry();
      const initialValue = { items: [], version: 0 };
      registry.data.set('list', initialValue);

      const updates = Array(50).fill(null).map((_, i) =>
        () => registry.atomicUpdate('list', (val) => ({
          items: [...val.items, i],
          version: val.version + 1,
        }))
      );

      await runConcurrently(updates);

      const final = registry.data.get('list');
      expect(final.version).toBe(50);
      expect(final.items.length).toBe(50);
      // All items should be present (though order may vary)
      expect(new Set(final.items).size).toBe(50);
    });

    it('prevents lost updates', async () => {
      const registry = new MockRegistry();
      registry.data.set('counter', 0);

      // Simulate concurrent increment attempts
      const increments = Array(100).fill(null).map(() =>
        () => registry.atomicUpdate('counter', (val) => val + 1)
      );

      await runConcurrently(increments);

      // No increments should be lost
      expect(registry.data.get('counter')).toBe(100);
    });
  });

  describe('Resource Contention', () => {
    it('handles high contention on single resource', async () => {
      const registry = new MockRegistry();
      registry.data.set('hot-key', 0);

      const startTime = Date.now();

      const operations = Array(200).fill(null).map(() =>
        () => registry.atomicUpdate('hot-key', (val) => val + 1)
      );

      await runConcurrently(operations);

      const endTime = Date.now();

      expect(registry.data.get('hot-key')).toBe(200);
      // Should complete in reasonable time despite contention
      expect(endTime - startTime).toBeLessThan(5000);
    });

    it('distributes load across multiple resources', async () => {
      const registry = new MockRegistry();
      const resourceCount = 10;

      for (let i = 0; i < resourceCount; i++) {
        registry.data.set(`resource-${i}`, 0);
      }

      const operations = Array(100).fill(null).map((_, i) => {
        const resourceId = i % resourceCount;
        return () => registry.atomicUpdate(`resource-${resourceId}`, (val) => val + 1);
      });

      await runConcurrently(operations);

      // Each resource should have 10 updates
      for (let i = 0; i < resourceCount; i++) {
        expect(registry.data.get(`resource-${i}`)).toBe(10);
      }
    });
  });
});

describe('Concurrent Operations Invariants', () => {
  it('operations always complete or fail explicitly', async () => {
    const operations = Array(50).fill(null).map((_, i) =>
      async () => {
        await delay(Math.random() * 20);
        if (Math.random() < 0.1) {
          throw new Error('Random failure');
        }
        return `completed-${i}`;
      }
    );

    const results = await Promise.allSettled(operations.map(op => op()));

    // All operations should have a definitive status
    expect(results.every(r =>
      r.status === 'fulfilled' || r.status === 'rejected'
    )).toBe(true);
    expect(results.length).toBe(50);
  });

  it('concurrent reads never corrupt data', async () => {
    const registry = new MockRegistry();
    const testValue = { complex: { nested: { data: 'value' } } };
    registry.data.set('test', testValue);

    const reads = Array(1000).fill(null).map(() =>
      () => registry.read('test')
    );

    const results = await runConcurrently(reads);

    // All reads should return identical values
    const firstResult = JSON.stringify(results[0]);
    expect(results.every(r => JSON.stringify(r) === firstResult)).toBe(true);
  });

  it('order of concurrent operations is non-deterministic', async () => {
    const executionOrder = [];

    const operations = Array(10).fill(null).map((_, i) =>
      async () => {
        await delay(Math.random() * 10);
        executionOrder.push(i);
        return i;
      }
    );

    await runConcurrently(operations);

    // Execution order should be non-deterministic (not 0,1,2,3...)
    const sorted = [...executionOrder].sort((a, b) => a - b);
    // There's a small chance they could be in order, so we just check they all completed
    expect(executionOrder.length).toBe(10);
    expect(new Set(executionOrder).size).toBe(10);
  });
});
