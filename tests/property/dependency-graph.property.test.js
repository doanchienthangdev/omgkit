/**
 * Property-Based Tests for Dependency Graph
 *
 * Tests invariants of the dependency graph using Fast-Check
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * Simple dependency graph implementation for testing
 */
class DependencyGraph {
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

  hasNode(id) {
    return this.nodes.has(id);
  }

  hasEdge(from, to) {
    return this.edges.has(from) && this.edges.get(from).has(to);
  }

  getDependencies(id) {
    return this.edges.has(id) ? [...this.edges.get(id)] : [];
  }

  getDependents(id) {
    return this.reverseEdges.has(id) ? [...this.reverseEdges.get(id)] : [];
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

  hasCycle() {
    const visited = new Set();
    const recursionStack = new Set();

    const dfs = (node) => {
      visited.add(node);
      recursionStack.add(node);

      for (const neighbor of this.getDependencies(node)) {
        if (!visited.has(neighbor)) {
          if (dfs(neighbor)) return true;
        } else if (recursionStack.has(neighbor)) {
          return true;
        }
      }

      recursionStack.delete(node);
      return false;
    };

    for (const node of this.nodes.keys()) {
      if (!visited.has(node)) {
        if (dfs(node)) return true;
      }
    }

    return false;
  }

  topologicalSort() {
    if (this.hasCycle()) {
      return null;
    }

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

  getTransitiveDependents(id) {
    const result = new Set();
    const queue = [...this.getDependents(id)];

    while (queue.length > 0) {
      const current = queue.shift();
      if (!result.has(current)) {
        result.add(current);
        queue.push(...this.getDependents(current));
      }
    }

    return [...result];
  }

  clone() {
    const copy = new DependencyGraph();
    for (const [id, data] of this.nodes) {
      copy.addNode(id, { ...data });
    }
    for (const [from, tos] of this.edges) {
      for (const to of tos) {
        copy.addEdge(from, to);
      }
    }
    return copy;
  }
}

// Arbitraries
const nodeIdArb = fc.stringMatching(/^[a-z][a-z0-9-]{0,20}$/);

const graphArb = fc.tuple(
  fc.array(nodeIdArb, { minLength: 1, maxLength: 20 }),
  fc.array(fc.tuple(fc.nat(19), fc.nat(19)), { maxLength: 30 })
).map(([nodes, edgeIndices]) => {
  const uniqueNodes = [...new Set(nodes)];
  const graph = new DependencyGraph();

  for (const node of uniqueNodes) {
    graph.addNode(node);
  }

  for (const [fromIdx, toIdx] of edgeIndices) {
    if (fromIdx < uniqueNodes.length && toIdx < uniqueNodes.length) {
      const from = uniqueNodes[fromIdx];
      const to = uniqueNodes[toIdx];
      if (from !== to) { // Avoid self-loops
        graph.addEdge(from, to);
      }
    }
  }

  return graph;
});

const dagArb = fc.array(nodeIdArb, { minLength: 1, maxLength: 15 })
  .map(nodes => {
    const uniqueNodes = [...new Set(nodes)];
    const graph = new DependencyGraph();

    for (const node of uniqueNodes) {
      graph.addNode(node);
    }

    // Only add edges from lower index to higher index (ensures DAG)
    for (let i = 0; i < uniqueNodes.length; i++) {
      for (let j = i + 1; j < uniqueNodes.length; j++) {
        // Add edge with 30% probability
        if (Math.random() < 0.3) {
          graph.addEdge(uniqueNodes[i], uniqueNodes[j]);
        }
      }
    }

    return graph;
  });

const treeArb = fc.array(nodeIdArb, { minLength: 1, maxLength: 15 })
  .map(nodes => {
    const uniqueNodes = [...new Set(nodes)];
    const graph = new DependencyGraph();

    graph.addNode(uniqueNodes[0]); // Root

    // Each subsequent node has exactly one parent
    for (let i = 1; i < uniqueNodes.length; i++) {
      const parent = uniqueNodes[Math.floor(Math.random() * i)];
      graph.addNode(uniqueNodes[i]);
      graph.addEdge(parent, uniqueNodes[i]);
    }

    return graph;
  });

describe('Dependency Graph Property-Based Tests', () => {
  describe('Node Properties', () => {
    it('added nodes exist', () => {
      fc.assert(
        fc.property(fc.array(nodeIdArb, { minLength: 1, maxLength: 20 }), (nodes) => {
          const graph = new DependencyGraph();
          for (const node of nodes) {
            graph.addNode(node);
          }
          for (const node of nodes) {
            expect(graph.hasNode(node)).toBe(true);
          }
        }),
        { numRuns: 100 }
      );
    });

    it('node count equals unique nodes added', () => {
      fc.assert(
        fc.property(fc.array(nodeIdArb, { minLength: 1, maxLength: 20 }), (nodes) => {
          const graph = new DependencyGraph();
          for (const node of nodes) {
            graph.addNode(node);
          }
          expect(graph.getNodeCount()).toBe(new Set(nodes).size);
        }),
        { numRuns: 100 }
      );
    });

    it('adding same node twice does not duplicate', () => {
      fc.assert(
        fc.property(nodeIdArb, (nodeId) => {
          const graph = new DependencyGraph();
          graph.addNode(nodeId);
          graph.addNode(nodeId);
          expect(graph.getNodeCount()).toBe(1);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Edge Properties', () => {
    it('added edges exist', () => {
      fc.assert(
        fc.property(nodeIdArb, nodeIdArb, (from, to) => {
          if (from !== to) {
            const graph = new DependencyGraph();
            graph.addEdge(from, to);
            expect(graph.hasEdge(from, to)).toBe(true);
          }
        }),
        { numRuns: 100 }
      );
    });

    it('edges are directed', () => {
      fc.assert(
        fc.property(nodeIdArb, nodeIdArb, (from, to) => {
          if (from !== to) {
            const graph = new DependencyGraph();
            graph.addEdge(from, to);
            expect(graph.hasEdge(from, to)).toBe(true);
            expect(graph.hasEdge(to, from)).toBe(false);
          }
        }),
        { numRuns: 100 }
      );
    });

    it('edge creates both nodes', () => {
      fc.assert(
        fc.property(nodeIdArb, nodeIdArb, (from, to) => {
          const graph = new DependencyGraph();
          graph.addEdge(from, to);
          expect(graph.hasNode(from)).toBe(true);
          expect(graph.hasNode(to)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('adding same edge twice does not duplicate', () => {
      fc.assert(
        fc.property(nodeIdArb, nodeIdArb, (from, to) => {
          // Skip self-edges as they're an edge case
          fc.pre(from !== to);
          const graph = new DependencyGraph();
          graph.addEdge(from, to);
          graph.addEdge(from, to);
          // Adding the same edge twice should not create duplicates
          expect(graph.getDependencies(from).length).toBe(1);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Dependency/Dependent Symmetry', () => {
    it('dependencies and dependents are inverse relations', () => {
      fc.assert(
        fc.property(graphArb, (graph) => {
          for (const node of graph.nodes.keys()) {
            for (const dep of graph.getDependencies(node)) {
              expect(graph.getDependents(dep)).toContain(node);
            }
          }
        }),
        { numRuns: 50 }
      );
    });

    it('dependents of dependency contain original', () => {
      fc.assert(
        fc.property(nodeIdArb, nodeIdArb, (from, to) => {
          if (from !== to) {
            const graph = new DependencyGraph();
            graph.addEdge(from, to);
            expect(graph.getDependents(to)).toContain(from);
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Cycle Detection', () => {
    it('DAGs have no cycles', () => {
      fc.assert(
        fc.property(dagArb, (graph) => {
          expect(graph.hasCycle()).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it('trees have no cycles', () => {
      fc.assert(
        fc.property(treeArb, (graph) => {
          expect(graph.hasCycle()).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it('empty graph has no cycles', () => {
      const graph = new DependencyGraph();
      expect(graph.hasCycle()).toBe(false);
    });

    it('single node has no cycles', () => {
      fc.assert(
        fc.property(nodeIdArb, (nodeId) => {
          const graph = new DependencyGraph();
          graph.addNode(nodeId);
          expect(graph.hasCycle()).toBe(false);
        }),
        { numRuns: 50 }
      );
    });

    it('A -> B -> A has cycle', () => {
      const graph = new DependencyGraph();
      graph.addEdge('a', 'b');
      graph.addEdge('b', 'a');
      expect(graph.hasCycle()).toBe(true);
    });

    it('A -> B -> C -> A has cycle', () => {
      const graph = new DependencyGraph();
      graph.addEdge('a', 'b');
      graph.addEdge('b', 'c');
      graph.addEdge('c', 'a');
      expect(graph.hasCycle()).toBe(true);
    });
  });

  describe('Topological Sort', () => {
    it('DAGs can be topologically sorted', () => {
      fc.assert(
        fc.property(dagArb, (graph) => {
          const sorted = graph.topologicalSort();
          expect(sorted).not.toBeNull();
        }),
        { numRuns: 100 }
      );
    });

    it('topological sort respects dependencies', () => {
      fc.assert(
        fc.property(dagArb, (graph) => {
          const sorted = graph.topologicalSort();
          if (sorted) {
            const positions = new Map(sorted.map((n, i) => [n, i]));
            for (const node of graph.nodes.keys()) {
              for (const dep of graph.getDependencies(node)) {
                // Dependency should come before the node
                expect(positions.get(node)).toBeLessThan(positions.get(dep));
              }
            }
          }
        }),
        { numRuns: 50 }
      );
    });

    it('topological sort contains all nodes', () => {
      fc.assert(
        fc.property(dagArb, (graph) => {
          const sorted = graph.topologicalSort();
          if (sorted) {
            expect(sorted.length).toBe(graph.getNodeCount());
            expect(new Set(sorted).size).toBe(graph.getNodeCount());
          }
        }),
        { numRuns: 50 }
      );
    });

    it('cyclic graphs cannot be topologically sorted', () => {
      const graph = new DependencyGraph();
      graph.addEdge('a', 'b');
      graph.addEdge('b', 'a');
      expect(graph.topologicalSort()).toBeNull();
    });
  });

  describe('Transitive Dependencies', () => {
    it('transitive dependencies include direct dependencies', () => {
      fc.assert(
        fc.property(graphArb, (graph) => {
          for (const node of graph.nodes.keys()) {
            const direct = graph.getDependencies(node);
            const transitive = new Set(graph.getTransitiveDependencies(node));
            for (const dep of direct) {
              expect(transitive.has(dep)).toBe(true);
            }
          }
        }),
        { numRuns: 50 }
      );
    });

    it('transitive dependencies do not include self', () => {
      fc.assert(
        fc.property(dagArb, (graph) => {
          for (const node of graph.nodes.keys()) {
            const transitive = graph.getTransitiveDependencies(node);
            expect(transitive).not.toContain(node);
          }
        }),
        { numRuns: 50 }
      );
    });

    it('transitive dependencies are closed under dependency relation', () => {
      fc.assert(
        fc.property(dagArb, (graph) => {
          for (const node of graph.nodes.keys()) {
            const transitive = new Set(graph.getTransitiveDependencies(node));
            for (const dep of transitive) {
              for (const depOfDep of graph.getDependencies(dep)) {
                expect(transitive.has(depOfDep)).toBe(true);
              }
            }
          }
        }),
        { numRuns: 50 }
      );
    });
  });

  describe('Transitive Dependents', () => {
    it('transitive dependents include direct dependents', () => {
      fc.assert(
        fc.property(graphArb, (graph) => {
          for (const node of graph.nodes.keys()) {
            const direct = graph.getDependents(node);
            const transitive = new Set(graph.getTransitiveDependents(node));
            for (const dep of direct) {
              expect(transitive.has(dep)).toBe(true);
            }
          }
        }),
        { numRuns: 50 }
      );
    });

    it('transitive dependents do not include self', () => {
      fc.assert(
        fc.property(dagArb, (graph) => {
          for (const node of graph.nodes.keys()) {
            const transitive = graph.getTransitiveDependents(node);
            expect(transitive).not.toContain(node);
          }
        }),
        { numRuns: 50 }
      );
    });
  });

  describe('Clone Properties', () => {
    it('cloned graph has same nodes', () => {
      fc.assert(
        fc.property(graphArb, (graph) => {
          const clone = graph.clone();
          expect(clone.getNodeCount()).toBe(graph.getNodeCount());
          for (const node of graph.nodes.keys()) {
            expect(clone.hasNode(node)).toBe(true);
          }
        }),
        { numRuns: 50 }
      );
    });

    it('cloned graph has same edges', () => {
      fc.assert(
        fc.property(graphArb, (graph) => {
          const clone = graph.clone();
          expect(clone.getEdgeCount()).toBe(graph.getEdgeCount());
          for (const node of graph.nodes.keys()) {
            for (const dep of graph.getDependencies(node)) {
              expect(clone.hasEdge(node, dep)).toBe(true);
            }
          }
        }),
        { numRuns: 50 }
      );
    });

    it('cloned graph is independent', () => {
      fc.assert(
        fc.property(graphArb, nodeIdArb, (graph, newNode) => {
          const clone = graph.clone();
          clone.addNode(newNode + '-new');
          // Original should not be affected
          expect(graph.hasNode(newNode + '-new')).toBe(false);
        }),
        { numRuns: 50 }
      );
    });
  });

  describe('Edge Cases', () => {
    it('empty graph properties', () => {
      const graph = new DependencyGraph();
      expect(graph.getNodeCount()).toBe(0);
      expect(graph.getEdgeCount()).toBe(0);
      expect(graph.hasCycle()).toBe(false);
      expect(graph.topologicalSort()).toEqual([]);
    });

    it('single node properties', () => {
      const graph = new DependencyGraph();
      graph.addNode('single');
      expect(graph.getNodeCount()).toBe(1);
      expect(graph.getEdgeCount()).toBe(0);
      expect(graph.getDependencies('single')).toEqual([]);
      expect(graph.getDependents('single')).toEqual([]);
      expect(graph.getTransitiveDependencies('single')).toEqual([]);
    });

    it('linear chain properties', () => {
      const graph = new DependencyGraph();
      graph.addEdge('a', 'b');
      graph.addEdge('b', 'c');
      graph.addEdge('c', 'd');

      expect(graph.hasCycle()).toBe(false);
      expect(graph.getTransitiveDependencies('a')).toEqual(
        expect.arrayContaining(['b', 'c', 'd'])
      );
      expect(graph.getTransitiveDependents('d')).toEqual(
        expect.arrayContaining(['a', 'b', 'c'])
      );
    });

    it('diamond pattern properties', () => {
      const graph = new DependencyGraph();
      //     a
      //    / \
      //   b   c
      //    \ /
      //     d
      graph.addEdge('a', 'b');
      graph.addEdge('a', 'c');
      graph.addEdge('b', 'd');
      graph.addEdge('c', 'd');

      expect(graph.hasCycle()).toBe(false);
      expect(graph.getDependencies('a').length).toBe(2);
      expect(graph.getDependents('d').length).toBe(2);
    });
  });
});

describe('Dependency Graph Invariants', () => {
  it('node count is always non-negative', () => {
    fc.assert(
      fc.property(graphArb, (graph) => {
        expect(graph.getNodeCount()).toBeGreaterThanOrEqual(0);
      }),
      { numRuns: 100 }
    );
  });

  it('edge count is always non-negative', () => {
    fc.assert(
      fc.property(graphArb, (graph) => {
        expect(graph.getEdgeCount()).toBeGreaterThanOrEqual(0);
      }),
      { numRuns: 100 }
    );
  });

  it('edge count is bounded by n*(n-1)', () => {
    fc.assert(
      fc.property(graphArb, (graph) => {
        const n = graph.getNodeCount();
        expect(graph.getEdgeCount()).toBeLessThanOrEqual(n * (n - 1));
      }),
      { numRuns: 100 }
    );
  });

  it('topological sort length equals node count for DAGs', () => {
    fc.assert(
      fc.property(dagArb, (graph) => {
        const sorted = graph.topologicalSort();
        if (sorted) {
          expect(sorted.length).toBe(graph.getNodeCount());
        }
      }),
      { numRuns: 100 }
    );
  });

  it('hasCycle and topologicalSort are consistent', () => {
    fc.assert(
      fc.property(graphArb, (graph) => {
        const hasCycle = graph.hasCycle();
        const sorted = graph.topologicalSort();
        // If there's a cycle, sort should be null
        // If there's no cycle, sort should not be null
        expect(hasCycle).toBe(sorted === null);
      }),
      { numRuns: 100 }
    );
  });
});
