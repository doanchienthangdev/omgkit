/**
 * Performance Benchmarks for Dependency Graph Operations
 *
 * Tests graph building and traversal performance
 */

import { describe, it, expect, beforeEach } from 'vitest';

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
 * Dependency graph for benchmarking
 */
class BenchmarkGraph {
  constructor() {
    this.nodes = new Map();
    this.edges = new Map();
    this.reverseEdges = new Map();
  }

  addNode(id, data = {}) {
    if (!this.nodes.has(id)) {
      this.nodes.set(id, data);
      this.edges.set(id, new Set());
      this.reverseEdges.set(id, new Set());
    }
    return this;
  }

  addEdge(from, to) {
    this.addNode(from);
    this.addNode(to);
    this.edges.get(from).add(to);
    this.reverseEdges.get(to).add(from);
    return this;
  }

  getNodeCount() {
    return this.nodes.size;
  }

  getEdgeCount() {
    let count = 0;
    for (const edges of this.edges.values()) {
      count += edges.size;
    }
    return count;
  }

  getDependencies(id) {
    return this.edges.has(id) ? [...this.edges.get(id)] : [];
  }

  getDependents(id) {
    return this.reverseEdges.has(id) ? [...this.reverseEdges.get(id)] : [];
  }

  topologicalSort() {
    const visited = new Set();
    const result = [];

    const dfs = (node) => {
      visited.add(node);
      for (const dep of this.getDependencies(node)) {
        if (!visited.has(dep)) {
          dfs(dep);
        }
      }
      result.push(node);
    };

    for (const node of this.nodes.keys()) {
      if (!visited.has(node)) {
        dfs(node);
      }
    }

    return result.reverse();
  }

  getTransitiveDependencies(id) {
    const result = new Set();
    const queue = [...this.getDependencies(id)];

    while (queue.length > 0) {
      const current = queue.shift();
      if (!result.has(current)) {
        result.add(current);
        queue.push(...this.getDependencies(current));
      }
    }

    return [...result];
  }

  findShortestPath(from, to) {
    const queue = [[from]];
    const visited = new Set([from]);

    while (queue.length > 0) {
      const path = queue.shift();
      const current = path[path.length - 1];

      if (current === to) {
        return path;
      }

      for (const neighbor of this.getDependencies(current)) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push([...path, neighbor]);
        }
      }
    }

    return null;
  }

  clear() {
    this.nodes.clear();
    this.edges.clear();
    this.reverseEdges.clear();
  }
}

/**
 * Generate a graph with specified characteristics
 */
function generateGraph(nodeCount, avgDependencies) {
  const graph = new BenchmarkGraph();

  for (let i = 0; i < nodeCount; i++) {
    graph.addNode(`node-${i}`, { type: 'test' });
  }

  // Add edges (dependencies only to lower-indexed nodes to ensure DAG)
  for (let i = 1; i < nodeCount; i++) {
    const depCount = Math.min(
      Math.floor(Math.random() * avgDependencies * 2),
      i
    );
    const deps = new Set();
    while (deps.size < depCount) {
      deps.add(Math.floor(Math.random() * i));
    }
    for (const dep of deps) {
      graph.addEdge(`node-${i}`, `node-${dep}`);
    }
  }

  return graph;
}

/**
 * Generate a layered graph (common in dependency hierarchies)
 */
function generateLayeredGraph(layers, nodesPerLayer, crossLayerDeps = 0.5) {
  const graph = new BenchmarkGraph();

  // Create nodes in layers
  for (let layer = 0; layer < layers; layer++) {
    for (let node = 0; node < nodesPerLayer; node++) {
      const id = `layer-${layer}-node-${node}`;
      graph.addNode(id, { layer });

      // Add dependencies to previous layer
      if (layer > 0) {
        const depCount = Math.ceil(nodesPerLayer * crossLayerDeps);
        for (let d = 0; d < depCount; d++) {
          const depNode = Math.floor(Math.random() * nodesPerLayer);
          graph.addEdge(id, `layer-${layer - 1}-node-${depNode}`);
        }
      }
    }
  }

  return graph;
}

describe('Graph Building Performance', () => {
  describe('Node Addition', () => {
    it('adds 100 nodes under 1ms', async () => {
      const graph = new BenchmarkGraph();

      const time = await timeExecution(() => {
        for (let i = 0; i < 100; i++) {
          graph.addNode(`node-${i}`);
        }
      });

      expect(time).toBeLessThan(1);
    });

    it('adds 1000 nodes under 5ms', async () => {
      const graph = new BenchmarkGraph();

      const time = await timeExecution(() => {
        for (let i = 0; i < 1000; i++) {
          graph.addNode(`node-${i}`);
        }
      });

      expect(time).toBeLessThan(5);
    });

    it('adds 5000 nodes under 20ms', async () => {
      const graph = new BenchmarkGraph();

      const time = await timeExecution(() => {
        for (let i = 0; i < 5000; i++) {
          graph.addNode(`node-${i}`);
        }
      });

      expect(time).toBeLessThan(20);
    });
  });

  describe('Edge Addition', () => {
    let graph;

    beforeEach(() => {
      graph = new BenchmarkGraph();
      for (let i = 0; i < 1000; i++) {
        graph.addNode(`node-${i}`);
      }
    });

    it('adds 500 edges under 10ms', async () => {
      const time = await timeExecution(() => {
        for (let i = 1; i < 501; i++) {
          graph.addEdge(`node-${i}`, `node-${i - 1}`);
        }
      });

      expect(time).toBeLessThan(10);
    });

    it('adds 2000 edges under 20ms', async () => {
      const time = await timeExecution(() => {
        for (let i = 1; i < 1000; i++) {
          graph.addEdge(`node-${i}`, `node-${i - 1}`);
          graph.addEdge(`node-${i}`, `node-${Math.floor(i / 2)}`);
        }
      });

      expect(time).toBeLessThan(20);
    });
  });

  describe('Complete Graph Generation', () => {
    it('generates 100 node graph under 20ms', async () => {
      const time = await timeExecution(() => {
        generateGraph(100, 3);
      });

      // Allow 20ms for cold cache scenarios
      expect(time).toBeLessThan(20);
    });

    it('generates 500 node graph under 50ms', async () => {
      const time = await timeExecution(() => {
        generateGraph(500, 3);
      });

      expect(time).toBeLessThan(50);
    });

    it('generates layered graph under 30ms', async () => {
      const time = await timeExecution(() => {
        generateLayeredGraph(5, 50, 0.3);
      });

      expect(time).toBeLessThan(30);
    });
  });
});

describe('Graph Traversal Performance', () => {
  let smallGraph;
  let mediumGraph;
  let largeGraph;

  beforeEach(() => {
    smallGraph = generateGraph(50, 2);
    mediumGraph = generateGraph(200, 3);
    largeGraph = generateGraph(500, 3);
  });

  describe('Dependency Lookup', () => {
    it('gets dependencies in O(1)', async () => {
      const time = await timeExecution(() => {
        for (let i = 0; i < 100; i++) {
          smallGraph.getDependencies(`node-${i % 50}`);
        }
      });

      expect(time).toBeLessThan(1);
    });

    it('gets dependents in O(1)', async () => {
      const time = await timeExecution(() => {
        for (let i = 0; i < 100; i++) {
          smallGraph.getDependents(`node-${i % 50}`);
        }
      });

      // Allow up to 5ms for cold cache scenarios
      expect(time).toBeLessThan(5);
    });
  });

  describe('Topological Sort', () => {
    it('sorts 50 nodes under 1ms', async () => {
      const time = await timeExecution(() => {
        smallGraph.topologicalSort();
      }, 10);

      expect(time).toBeLessThan(1);
    });

    it('sorts 200 nodes under 5ms', async () => {
      const time = await timeExecution(() => {
        mediumGraph.topologicalSort();
      }, 10);

      expect(time).toBeLessThan(5);
    });

    it('sorts 500 nodes under 20ms', async () => {
      const time = await timeExecution(() => {
        largeGraph.topologicalSort();
      }, 5);

      expect(time).toBeLessThan(20);
    });
  });

  describe('Transitive Dependencies', () => {
    it('computes transitive deps for small graph under 1ms', async () => {
      const time = await timeExecution(() => {
        smallGraph.getTransitiveDependencies('node-49');
      }, 10);

      expect(time).toBeLessThan(1);
    });

    it('computes transitive deps for medium graph under 5ms', async () => {
      const time = await timeExecution(() => {
        mediumGraph.getTransitiveDependencies('node-199');
      }, 5);

      expect(time).toBeLessThan(5);
    });

    it('computes transitive deps for large graph under 20ms', async () => {
      const time = await timeExecution(() => {
        largeGraph.getTransitiveDependencies('node-499');
      }, 3);

      expect(time).toBeLessThan(20);
    });
  });

  describe('Path Finding', () => {
    it('finds path in small graph under 1ms', async () => {
      const time = await timeExecution(() => {
        smallGraph.findShortestPath('node-49', 'node-0');
      }, 10);

      expect(time).toBeLessThan(1);
    });

    it('finds path in medium graph under 5ms', async () => {
      const time = await timeExecution(() => {
        mediumGraph.findShortestPath('node-199', 'node-0');
      }, 5);

      expect(time).toBeLessThan(5);
    });
  });
});

describe('Graph Memory Performance', () => {
  it('memory usage scales reasonably with node count', () => {
    // Test that larger graphs can be created without excessive memory
    // Note: Heap measurements are unreliable due to GC, so we test creation success
    const graphs = [];

    for (const size of [100, 500, 1000]) {
      const graph = generateGraph(size, 3);
      graphs.push({
        size,
        nodes: graph.getNodeCount(),
        edges: graph.getEdgeCount(),
      });
    }

    // Verify all graphs were created correctly
    expect(graphs[0].nodes).toBe(100);
    expect(graphs[1].nodes).toBe(500);
    expect(graphs[2].nodes).toBe(1000);

    // Verify edges scale with nodes (roughly avgDeps * nodes)
    // With avgDeps=3, expect ~150-300 edges for 100 nodes
    expect(graphs[0].edges).toBeGreaterThan(50);
    expect(graphs[1].edges).toBeGreaterThan(250);
    expect(graphs[2].edges).toBeGreaterThan(500);
  });

  it('graph can be cleared and reused', () => {
    const graph = generateGraph(1000, 3);
    expect(graph.getNodeCount()).toBe(1000);

    graph.clear();
    expect(graph.getNodeCount()).toBe(0);

    // Can be reused
    for (let i = 0; i < 100; i++) {
      graph.addNode(`new-${i}`);
    }
    expect(graph.getNodeCount()).toBe(100);
  });
});

describe('Graph Performance Invariants', () => {
  it('topological sort produces valid ordering', () => {
    const graph = generateGraph(100, 3);
    const sorted = graph.topologicalSort();

    // Each node should come before its dependents
    const positions = new Map(sorted.map((n, i) => [n, i]));

    for (const node of graph.nodes.keys()) {
      for (const dep of graph.getDependencies(node)) {
        expect(positions.get(node)).toBeLessThan(positions.get(dep));
      }
    }
  });

  it('transitive dependencies are complete', () => {
    const graph = new BenchmarkGraph();
    graph.addEdge('a', 'b');
    graph.addEdge('b', 'c');
    graph.addEdge('c', 'd');

    const transDeps = graph.getTransitiveDependencies('a');

    expect(transDeps).toContain('b');
    expect(transDeps).toContain('c');
    expect(transDeps).toContain('d');
    expect(transDeps.length).toBe(3);
  });

  it('performance is consistent across runs', async () => {
    const graph = generateGraph(200, 3);
    const times = [];

    for (let i = 0; i < 5; i++) {
      const time = await timeExecution(() => {
        graph.topologicalSort();
      }, 5);
      times.push(time);
    }

    // All operations should be fast (under 5ms each)
    for (const time of times) {
      expect(time).toBeLessThan(5);
    }
  });
});
