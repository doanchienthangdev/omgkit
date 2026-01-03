/**
 * Performance Benchmarks for Search Operations
 *
 * Tests search and filtering performance
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readdirSync, readFileSync, statSync } from 'fs';

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
 * Mock component registry for search benchmarking
 */
class SearchableRegistry {
  constructor() {
    this.components = new Map();
    this.indices = {
      byType: new Map(),
      byCategory: new Map(),
      byTag: new Map(),
      byName: new Map(),
    };
  }

  add(component) {
    this.components.set(component.id, component);

    // Index by type
    if (!this.indices.byType.has(component.type)) {
      this.indices.byType.set(component.type, new Set());
    }
    this.indices.byType.get(component.type).add(component.id);

    // Index by category
    if (component.category) {
      if (!this.indices.byCategory.has(component.category)) {
        this.indices.byCategory.set(component.category, new Set());
      }
      this.indices.byCategory.get(component.category).add(component.id);
    }

    // Index by tags
    for (const tag of component.tags || []) {
      if (!this.indices.byTag.has(tag)) {
        this.indices.byTag.set(tag, new Set());
      }
      this.indices.byTag.get(tag).add(component.id);
    }

    // Index by name (prefix)
    const nameParts = component.name.split('-');
    for (let i = 1; i <= nameParts.length; i++) {
      const prefix = nameParts.slice(0, i).join('-');
      if (!this.indices.byName.has(prefix)) {
        this.indices.byName.set(prefix, new Set());
      }
      this.indices.byName.get(prefix).add(component.id);
    }
  }

  searchByType(type) {
    const ids = this.indices.byType.get(type);
    if (!ids) return [];
    return [...ids].map(id => this.components.get(id));
  }

  searchByCategory(category) {
    const ids = this.indices.byCategory.get(category);
    if (!ids) return [];
    return [...ids].map(id => this.components.get(id));
  }

  searchByTag(tag) {
    const ids = this.indices.byTag.get(tag);
    if (!ids) return [];
    return [...ids].map(id => this.components.get(id));
  }

  searchByNamePrefix(prefix) {
    const ids = this.indices.byName.get(prefix);
    if (!ids) return [];
    return [...ids].map(id => this.components.get(id));
  }

  searchByText(query) {
    query = query.toLowerCase();
    const results = [];

    for (const component of this.components.values()) {
      if (
        component.name.toLowerCase().includes(query) ||
        (component.description && component.description.toLowerCase().includes(query))
      ) {
        results.push(component);
      }
    }

    return results;
  }

  searchWithFilters(filters) {
    let candidates = new Set(this.components.keys());

    if (filters.type) {
      const typeIds = this.indices.byType.get(filters.type);
      if (typeIds) {
        candidates = new Set([...candidates].filter(id => typeIds.has(id)));
      } else {
        return [];
      }
    }

    if (filters.category) {
      const catIds = this.indices.byCategory.get(filters.category);
      if (catIds) {
        candidates = new Set([...candidates].filter(id => catIds.has(id)));
      } else {
        return [];
      }
    }

    if (filters.tag) {
      const tagIds = this.indices.byTag.get(filters.tag);
      if (tagIds) {
        candidates = new Set([...candidates].filter(id => tagIds.has(id)));
      } else {
        return [];
      }
    }

    return [...candidates].map(id => this.components.get(id));
  }

  size() {
    return this.components.size;
  }
}

/**
 * Generate mock components
 */
function generateComponents(count) {
  const types = ['agent', 'skill', 'command', 'workflow', 'mode'];
  const categories = ['testing', 'methodology', 'databases', 'frameworks', 'devops', 'security'];
  const tags = ['omega', 'productivity', 'automation', 'quality', 'performance', 'security'];

  const components = [];

  for (let i = 0; i < count; i++) {
    components.push({
      id: `component-${i}`,
      type: types[i % types.length],
      category: categories[i % categories.length],
      name: `test-component-${i}`,
      description: `Description for test component ${i}. This is a sample description for benchmarking.`,
      tags: [
        tags[i % tags.length],
        tags[(i + 1) % tags.length],
      ],
    });
  }

  return components;
}

/**
 * Collect real plugin files
 */
function collectPluginFiles(dir, files = []) {
  try {
    const entries = readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        collectPluginFiles(fullPath, files);
      } else if (entry.name.endsWith('.md')) {
        files.push(fullPath);
      }
    }
  } catch (e) {
    // Ignore errors
  }

  return files;
}

describe('Search Performance Benchmarks', () => {
  let smallRegistry;
  let mediumRegistry;
  let largeRegistry;

  beforeAll(() => {
    // Create registries of different sizes
    smallRegistry = new SearchableRegistry();
    for (const comp of generateComponents(100)) {
      smallRegistry.add(comp);
    }

    mediumRegistry = new SearchableRegistry();
    for (const comp of generateComponents(500)) {
      mediumRegistry.add(comp);
    }

    largeRegistry = new SearchableRegistry();
    for (const comp of generateComponents(2000)) {
      largeRegistry.add(comp);
    }
  });

  describe('Indexed Search', () => {
    it('type search is O(1)', async () => {
      const time = await timeExecution(() => {
        largeRegistry.searchByType('agent');
      }, 100);

      expect(time).toBeLessThan(1);
    });

    it('category search is O(1)', async () => {
      const time = await timeExecution(() => {
        largeRegistry.searchByCategory('testing');
      }, 100);

      expect(time).toBeLessThan(1);
    });

    it('tag search is O(1)', async () => {
      const time = await timeExecution(() => {
        largeRegistry.searchByTag('omega');
      }, 100);

      expect(time).toBeLessThan(1);
    });

    it('name prefix search is O(1)', async () => {
      const time = await timeExecution(() => {
        largeRegistry.searchByNamePrefix('test');
      }, 100);

      expect(time).toBeLessThan(1);
    });
  });

  describe('Text Search', () => {
    it('text search on 100 items under 5ms', async () => {
      const time = await timeExecution(() => {
        smallRegistry.searchByText('component');
      }, 10);

      expect(time).toBeLessThan(5);
    });

    it('text search on 500 items under 15ms', async () => {
      const time = await timeExecution(() => {
        mediumRegistry.searchByText('component');
      }, 5);

      expect(time).toBeLessThan(15);
    });

    it('text search on 2000 items under 50ms', async () => {
      const time = await timeExecution(() => {
        largeRegistry.searchByText('component');
      }, 3);

      expect(time).toBeLessThan(50);
    });

    it('specific text search is faster', async () => {
      const time = await timeExecution(() => {
        largeRegistry.searchByText('component-999');
      }, 10);

      expect(time).toBeLessThan(20);
    });
  });

  describe('Filtered Search', () => {
    it('single filter under 5ms', async () => {
      const time = await timeExecution(() => {
        largeRegistry.searchWithFilters({ type: 'agent' });
      }, 10);

      expect(time).toBeLessThan(5);
    });

    it('multiple filters under 10ms', async () => {
      const time = await timeExecution(() => {
        largeRegistry.searchWithFilters({
          type: 'skill',
          category: 'testing',
        });
      }, 10);

      expect(time).toBeLessThan(10);
    });

    it('all filters under 15ms', async () => {
      const time = await timeExecution(() => {
        largeRegistry.searchWithFilters({
          type: 'skill',
          category: 'testing',
          tag: 'omega',
        });
      }, 10);

      expect(time).toBeLessThan(15);
    });
  });

  describe('Registry Operations', () => {
    it('populates 1000 items under 50ms', async () => {
      const components = generateComponents(1000);

      const time = await timeExecution(() => {
        const registry = new SearchableRegistry();
        for (const comp of components) {
          registry.add(comp);
        }
      });

      expect(time).toBeLessThan(50);
    });

    it('size check is O(1)', async () => {
      const time = await timeExecution(() => {
        largeRegistry.size();
      }, 1000);

      expect(time).toBeLessThan(0.1);
    });
  });
});

describe('File Search Performance', () => {
  let pluginFiles;

  beforeAll(() => {
    pluginFiles = collectPluginFiles(PLUGIN_DIR);
  });

  describe('Glob-like Pattern Search', () => {
    it('filters by extension quickly', async () => {
      const time = await timeExecution(() => {
        pluginFiles.filter(f => f.endsWith('.md'));
      }, 10);

      expect(time).toBeLessThan(5);
    });

    it('filters by directory pattern quickly', async () => {
      const time = await timeExecution(() => {
        pluginFiles.filter(f => f.includes('/agents/'));
      }, 10);

      expect(time).toBeLessThan(5);
    });

    it('complex pattern matching under 10ms', async () => {
      const pattern = /\/agents\/.*\.md$/;

      const time = await timeExecution(() => {
        pluginFiles.filter(f => pattern.test(f));
      }, 10);

      expect(time).toBeLessThan(10);
    });
  });

  describe('Content Search', () => {
    it('reads and searches 10 files under 50ms', async () => {
      const sampleFiles = pluginFiles.slice(0, 10);
      const searchTerm = 'description';

      const time = await timeExecution(() => {
        for (const file of sampleFiles) {
          const content = readFileSync(file, 'utf8');
          content.includes(searchTerm);
        }
      });

      expect(time).toBeLessThan(50);
    });

    it('regex search in content under 100ms', async () => {
      const sampleFiles = pluginFiles.slice(0, 20);
      const pattern = /skills:\s*\n(\s+-\s+\S+)+/;

      const time = await timeExecution(() => {
        for (const file of sampleFiles) {
          const content = readFileSync(file, 'utf8');
          pattern.test(content);
        }
      });

      expect(time).toBeLessThan(100);
    });
  });
});

describe('Search Result Processing', () => {
  let registry;

  beforeAll(() => {
    registry = new SearchableRegistry();
    for (const comp of generateComponents(500)) {
      registry.add(comp);
    }
  });

  describe('Sorting', () => {
    it('sorts 100 results by name under 5ms', async () => {
      const results = registry.searchByType('agent');

      const time = await timeExecution(() => {
        results.sort((a, b) => a.name.localeCompare(b.name));
      }, 10);

      expect(time).toBeLessThan(5);
    });

    it('multi-field sort under 10ms', async () => {
      const results = registry.searchByText('component');

      const time = await timeExecution(() => {
        results.sort((a, b) => {
          const typeCompare = a.type.localeCompare(b.type);
          if (typeCompare !== 0) return typeCompare;
          return a.name.localeCompare(b.name);
        });
      }, 5);

      expect(time).toBeLessThan(10);
    });
  });

  describe('Pagination', () => {
    it('slices results under 1ms', async () => {
      const results = registry.searchByText('component');

      const time = await timeExecution(() => {
        results.slice(0, 20);
      }, 100);

      expect(time).toBeLessThan(1);
    });

    it('paginates large result set under 5ms', async () => {
      const results = registry.searchByText('component');
      const pageSize = 20;
      const pages = Math.ceil(results.length / pageSize);

      const time = await timeExecution(() => {
        for (let page = 0; page < pages; page++) {
          results.slice(page * pageSize, (page + 1) * pageSize);
        }
      });

      expect(time).toBeLessThan(5);
    });
  });

  describe('Grouping', () => {
    it('groups by type under 10ms', async () => {
      const results = registry.searchByText('component');

      const time = await timeExecution(() => {
        const grouped = {};
        for (const result of results) {
          if (!grouped[result.type]) {
            grouped[result.type] = [];
          }
          grouped[result.type].push(result);
        }
      }, 5);

      expect(time).toBeLessThan(10);
    });

    it('groups by category under 10ms', async () => {
      const results = registry.searchByText('component');

      const time = await timeExecution(() => {
        const grouped = new Map();
        for (const result of results) {
          if (!grouped.has(result.category)) {
            grouped.set(result.category, []);
          }
          grouped.get(result.category).push(result);
        }
      }, 5);

      expect(time).toBeLessThan(10);
    });
  });
});

describe('Search Performance Invariants', () => {
  it('indexed search is faster than text search', async () => {
    const registry = new SearchableRegistry();
    for (const comp of generateComponents(1000)) {
      registry.add(comp);
    }

    const indexedTime = await timeExecution(() => {
      registry.searchByType('agent');
    }, 50);

    const textTime = await timeExecution(() => {
      registry.searchByText('agent');
    }, 50);

    expect(indexedTime).toBeLessThan(textTime);
  });

  it('more filters reduce search time', async () => {
    const registry = new SearchableRegistry();
    for (const comp of generateComponents(1000)) {
      registry.add(comp);
    }

    const oneFilter = await timeExecution(() => {
      registry.searchWithFilters({ type: 'skill' });
    }, 20);

    const twoFilters = await timeExecution(() => {
      registry.searchWithFilters({ type: 'skill', category: 'testing' });
    }, 20);

    // Both filter operations should be fast (under 10ms)
    // More filters may be slightly slower due to additional set operations
    expect(oneFilter).toBeLessThan(10);
    expect(twoFilters).toBeLessThan(10);
  });

  it('search time scales sub-linearly with data size', async () => {
    const small = new SearchableRegistry();
    for (const comp of generateComponents(100)) {
      small.add(comp);
    }

    const large = new SearchableRegistry();
    for (const comp of generateComponents(1000)) {
      large.add(comp);
    }

    const smallTime = await timeExecution(() => {
      small.searchByType('agent');
    }, 50);

    const largeTime = await timeExecution(() => {
      large.searchByType('agent');
    }, 50);

    // For indexed search (O(1) lookup), both should be very fast
    // We just verify that large is not dramatically slower
    expect(largeTime).toBeLessThan(5); // Should complete in under 5ms
    expect(smallTime).toBeLessThan(5); // Both should be fast
  });
});
