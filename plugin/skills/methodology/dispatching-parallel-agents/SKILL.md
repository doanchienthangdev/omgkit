---
name: dispatching-parallel-agents
description: Parallel agent orchestration for maximum efficiency through concurrent task execution
category: methodology
triggers:
  - parallel agents
  - concurrent execution
  - agent orchestration
  - spawn agents
  - parallel tasks
  - multi-agent
  - task parallelization
---

# Dispatching Parallel Agents

Master **parallel agent orchestration** for maximum efficiency through concurrent task execution. This skill provides patterns for identifying parallelizable work, dispatching agents effectively, and aggregating results.

## Purpose

Maximize development velocity through parallelization:

- Identify tasks that can run concurrently
- Dispatch specialized agents for different concerns
- Reduce total execution time significantly
- Maintain coordination between parallel tasks
- Aggregate results from multiple agents
- Handle failures gracefully in parallel execution
- Balance parallelism with resource constraints

## Features

### 1. Parallel Execution Model

```markdown
## Agent Orchestration Architecture

┌─────────────────────────────────────────────────────────────────────────┐
│                      PARALLEL AGENT MODEL                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                    ┌─────────────────────┐                              │
│                    │    Main Agent       │                              │
│                    │   (Orchestrator)    │                              │
│                    └──────────┬──────────┘                              │
│                               │                                          │
│                    ┌──────────┴──────────┐                              │
│                    │    Task Analysis    │                              │
│                    │   & Distribution    │                              │
│                    └──────────┬──────────┘                              │
│                               │                                          │
│         ┌─────────────────────┼─────────────────────┐                   │
│         │                     │                     │                   │
│         ▼                     ▼                     ▼                   │
│    ┌─────────┐          ┌─────────┐          ┌─────────┐               │
│    │ Agent A │          │ Agent B │          │ Agent C │               │
│    │ (Task 1)│          │ (Task 2)│          │ (Task 3)│               │
│    └────┬────┘          └────┬────┘          └────┬────┘               │
│         │                    │                    │                     │
│         │ Result A           │ Result B           │ Result C            │
│         │                    │                    │                     │
│         └─────────────────────┼─────────────────────┘                   │
│                               │                                          │
│                    ┌──────────┴──────────┐                              │
│                    │    Aggregation &    │                              │
│                    │     Integration     │                              │
│                    └──────────┬──────────┘                              │
│                               │                                          │
│                    ┌──────────┴──────────┐                              │
│                    │   Final Response    │                              │
│                    └─────────────────────┘                              │
│                                                                         │
│  TIMING COMPARISON:                                                     │
│  Sequential: ████████████████████████████  (Task1 + Task2 + Task3)     │
│  Parallel:   ████████████                   (max(Task1, Task2, Task3)) │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2. Task Parallelization Analysis

```typescript
/**
 * Determine which tasks can run in parallel
 */

interface Task {
  id: string;
  description: string;
  dependencies: string[];
  resources: string[];
  estimatedDuration: number;
}

interface ParallelizationAnalysis {
  canParallelize: boolean;
  reason: string;
  suggestedGroups: Task[][];
}

function analyzeParallelization(tasks: Task[]): ParallelizationAnalysis {
  // Build dependency graph
  const dependencyGraph = buildDependencyGraph(tasks);

  // Identify independent task groups
  const groups = findIndependentGroups(dependencyGraph);

  // Check for resource conflicts
  const resourceConflicts = findResourceConflicts(tasks);

  if (groups.length === 1 && groups[0].length === tasks.length) {
    return {
      canParallelize: false,
      reason: 'All tasks have sequential dependencies',
      suggestedGroups: [tasks]
    };
  }

  return {
    canParallelize: true,
    reason: `Found ${groups.length} independent task groups`,
    suggestedGroups: groups
  };
}

// Parallelization criteria
const parallelizationCriteria = {
  canParallelize: [
    'Independent code changes (different files)',
    'Research tasks on different topics',
    'Tests for different modules',
    'Documentation for different features',
    'Analysis of separate concerns'
  ],

  cannotParallelize: [
    'Tasks with data dependencies',
    'Sequential workflow steps',
    'Tasks modifying same files',
    'Tasks sharing mutable state',
    'Order-dependent operations'
  ],

  requiresCoordination: [
    'Shared configuration files',
    'Database schema changes',
    'API contract changes',
    'Merge operations'
  ]
};
```

### 3. Agent Dispatch Patterns

```typescript
/**
 * Patterns for dispatching parallel agents
 */

// Pattern 1: Fan-out / Fan-in
async function fanOutFanIn<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  aggregator: (results: R[]) => R
): Promise<R> {
  // Fan-out: dispatch all in parallel
  const promises = items.map(item => processor(item));

  // Fan-in: wait for all and aggregate
  const results = await Promise.all(promises);

  return aggregator(results);
}

// Example: Parallel code review
const codeReviewResult = await fanOutFanIn(
  ['security', 'performance', 'style'],
  async (concern) => {
    const agent = await spawnAgent({
      type: 'code-reviewer',
      focus: concern,
      files: changedFiles
    });
    return agent.getResults();
  },
  (reviews) => combineReviews(reviews)
);

// Pattern 2: Parallel with timeout
async function parallelWithTimeout<T>(
  tasks: Array<() => Promise<T>>,
  timeoutMs: number
): Promise<SettledResult<T>[]> {
  const wrappedTasks = tasks.map(task =>
    Promise.race([
      task().then(value => ({ status: 'fulfilled', value })),
      timeout(timeoutMs).then(() => ({
        status: 'rejected',
        reason: 'Timeout exceeded'
      }))
    ])
  );

  return Promise.all(wrappedTasks);
}

// Pattern 3: Parallel with concurrency limit
async function parallelWithLimit<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  concurrencyLimit: number
): Promise<R[]> {
  const results: R[] = [];
  const executing: Promise<void>[] = [];

  for (const item of items) {
    const promise = processor(item).then(result => {
      results.push(result);
    });

    executing.push(promise);

    if (executing.length >= concurrencyLimit) {
      await Promise.race(executing);
      // Remove completed promises
      executing.splice(
        executing.findIndex(p => p === promise),
        1
      );
    }
  }

  await Promise.all(executing);
  return results;
}

// Pattern 4: Dependent parallel groups
async function executeInWaves(taskGroups: Task[][]): Promise<void> {
  for (const group of taskGroups) {
    // Execute all tasks in this wave in parallel
    await Promise.all(
      group.map(task => executeTask(task))
    );
    // Next wave depends on this wave completing
  }
}
```

### 4. Agent Specialization

```typescript
/**
 * Dispatch specialized agents for different concerns
 */

type AgentType =
  | 'explorer'    // Codebase exploration
  | 'implementer' // Code writing
  | 'tester'      // Test creation
  | 'reviewer'    // Code review
  | 'documenter'  // Documentation
  | 'debugger'    // Bug investigation
  | 'researcher'; // Information gathering

interface AgentConfig {
  type: AgentType;
  prompt: string;
  context?: string;
  timeout?: number;
  priority?: 'high' | 'normal' | 'low';
}

// Agent specialization examples
const agentSpecializations = {
  explorer: {
    strengths: [
      'Understanding codebase structure',
      'Finding relevant files',
      'Mapping dependencies'
    ],
    bestFor: [
      'Initial project exploration',
      'Finding implementation locations',
      'Understanding patterns'
    ],
    prompt_template: `
      Explore the codebase to answer: {question}
      Focus on: {focus_areas}
      Return: File paths, key functions, relationships
    `
  },

  implementer: {
    strengths: [
      'Writing production code',
      'Following patterns',
      'Complete implementations'
    ],
    bestFor: [
      'Feature implementation',
      'Bug fixes',
      'Refactoring'
    ],
    prompt_template: `
      Implement: {feature_description}
      Context: {existing_code}
      Requirements: {requirements}
      Return: Complete, tested code
    `
  },

  tester: {
    strengths: [
      'Test case design',
      'Edge case identification',
      'Coverage analysis'
    ],
    bestFor: [
      'Unit test creation',
      'Integration test design',
      'Test strategy planning'
    ],
    prompt_template: `
      Create tests for: {code_under_test}
      Coverage requirements: {coverage_target}
      Focus on: {critical_paths}
      Return: Test files with assertions
    `
  },

  reviewer: {
    strengths: [
      'Issue identification',
      'Best practice enforcement',
      'Security analysis'
    ],
    bestFor: [
      'Code review',
      'Security audit',
      'Performance review'
    ],
    prompt_template: `
      Review this code for: {review_focus}
      Standards: {coding_standards}
      Return: Issues with severity and fixes
    `
  }
};
```

### 5. Result Aggregation

```typescript
/**
 * Aggregate results from parallel agents
 */

interface AgentResult {
  agentId: string;
  agentType: AgentType;
  status: 'success' | 'partial' | 'failed';
  data: unknown;
  duration: number;
  tokensUsed: number;
}

class ResultAggregator {
  private results: AgentResult[] = [];

  addResult(result: AgentResult): void {
    this.results.push(result);
  }

  // Aggregation strategies
  aggregateByMerge(): MergedResult {
    // Combine all results into one
    return {
      allIssues: this.results.flatMap(r => r.data.issues || []),
      allSuggestions: this.results.flatMap(r => r.data.suggestions || []),
      summary: this.generateSummary()
    };
  }

  aggregateByConsensus<T>(extractor: (r: AgentResult) => T): T | null {
    // Find consensus among agents
    const values = this.results.map(extractor);
    const counts = new Map<string, number>();

    for (const value of values) {
      const key = JSON.stringify(value);
      counts.set(key, (counts.get(key) || 0) + 1);
    }

    // Return most common result
    let maxCount = 0;
    let consensus: T | null = null;

    for (const [key, count] of counts) {
      if (count > maxCount) {
        maxCount = count;
        consensus = JSON.parse(key);
      }
    }

    return consensus;
  }

  aggregateByPriority(): PrioritizedResult {
    // Sort results by agent priority/expertise
    const sorted = this.results.sort((a, b) =>
      getAgentPriority(a.agentType) - getAgentPriority(b.agentType)
    );

    return {
      primary: sorted[0].data,
      supporting: sorted.slice(1).map(r => r.data)
    };
  }

  generateSummary(): string {
    const successCount = this.results.filter(r => r.status === 'success').length;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);
    const totalTokens = this.results.reduce((sum, r) => sum + r.tokensUsed, 0);

    return `
      Agents: ${this.results.length}
      Successful: ${successCount}
      Total duration: ${totalDuration}ms
      Total tokens: ${totalTokens}
    `;
  }
}
```

### 6. Error Handling in Parallel

```typescript
/**
 * Handle failures gracefully in parallel execution
 */

interface ParallelExecutionOptions {
  failFast: boolean;        // Stop all on first failure
  retryFailed: boolean;     // Retry failed tasks
  maxRetries: number;
  continueOnError: boolean; // Continue with partial results
}

async function executeParallelWithErrorHandling<T>(
  tasks: Array<() => Promise<T>>,
  options: ParallelExecutionOptions
): Promise<ExecutionResult<T>> {
  const results: T[] = [];
  const errors: Error[] = [];

  if (options.failFast) {
    // Use Promise.all - fails on first error
    try {
      return {
        results: await Promise.all(tasks.map(t => t())),
        errors: [],
        status: 'complete'
      };
    } catch (error) {
      return {
        results: [],
        errors: [error as Error],
        status: 'failed'
      };
    }
  }

  // Use Promise.allSettled - collects all results
  const settled = await Promise.allSettled(tasks.map(t => t()));

  for (const result of settled) {
    if (result.status === 'fulfilled') {
      results.push(result.value);
    } else {
      errors.push(result.reason);
    }
  }

  // Retry failed tasks if configured
  if (options.retryFailed && errors.length > 0) {
    const failedIndices = settled
      .map((r, i) => r.status === 'rejected' ? i : -1)
      .filter(i => i >= 0);

    for (let attempt = 0; attempt < options.maxRetries; attempt++) {
      const retryResults = await Promise.allSettled(
        failedIndices.map(i => tasks[i]())
      );

      retryResults.forEach((r, idx) => {
        if (r.status === 'fulfilled') {
          results.push(r.value);
          errors.splice(idx, 1);
        }
      });

      if (errors.length === 0) break;
    }
  }

  return {
    results,
    errors,
    status: errors.length === 0 ? 'complete' : 'partial'
  };
}
```

## Use Cases

### Feature Implementation with Parallel Agents

```typescript
/**
 * Implement a feature using multiple specialized agents
 */

async function implementFeatureWithParallelAgents(
  feature: FeatureSpec
): Promise<Implementation> {
  // Phase 1: Parallel exploration
  const [
    existingPatterns,
    relatedCode,
    testPatterns
  ] = await Promise.all([
    spawnAgent({
      type: 'explorer',
      prompt: `Find similar features in the codebase`
    }),
    spawnAgent({
      type: 'explorer',
      prompt: `Find code that will be affected by ${feature.name}`
    }),
    spawnAgent({
      type: 'explorer',
      prompt: `Find test patterns for similar features`
    })
  ]);

  // Phase 2: Parallel implementation (after exploration complete)
  const [
    featureCode,
    tests,
    documentation
  ] = await Promise.all([
    spawnAgent({
      type: 'implementer',
      prompt: `Implement ${feature.name}`,
      context: existingPatterns
    }),
    spawnAgent({
      type: 'tester',
      prompt: `Create tests for ${feature.name}`,
      context: testPatterns
    }),
    spawnAgent({
      type: 'documenter',
      prompt: `Document ${feature.name}`,
      context: feature.spec
    })
  ]);

  // Phase 3: Parallel review
  const [
    codeReview,
    testReview
  ] = await Promise.all([
    spawnAgent({
      type: 'reviewer',
      prompt: 'Review implementation for issues',
      context: featureCode
    }),
    spawnAgent({
      type: 'reviewer',
      prompt: 'Review tests for coverage and quality',
      context: tests
    })
  ]);

  return aggregateResults({
    featureCode,
    tests,
    documentation,
    reviews: [codeReview, testReview]
  });
}
```

### Multi-Concern Code Review

```typescript
/**
 * Review code from multiple perspectives in parallel
 */

async function multiConcernReview(
  files: string[]
): Promise<ComprehensiveReview> {
  const [
    securityReview,
    performanceReview,
    styleReview,
    accessibilityReview
  ] = await Promise.all([
    spawnAgent({
      type: 'reviewer',
      prompt: `Security review: check for vulnerabilities, injection, auth issues`,
      files
    }),
    spawnAgent({
      type: 'reviewer',
      prompt: `Performance review: check for N+1, memory leaks, inefficiencies`,
      files
    }),
    spawnAgent({
      type: 'reviewer',
      prompt: `Style review: check for conventions, naming, structure`,
      files
    }),
    spawnAgent({
      type: 'reviewer',
      prompt: `Accessibility review: check for a11y issues in UI code`,
      files
    })
  ]);

  return {
    security: securityReview,
    performance: performanceReview,
    style: styleReview,
    accessibility: accessibilityReview,
    summary: generateReviewSummary([
      securityReview,
      performanceReview,
      styleReview,
      accessibilityReview
    ])
  };
}
```

## Best Practices

### Do's

- **Identify truly independent tasks** before parallelizing
- **Use specialized agents** for different concerns
- **Set appropriate timeouts** for each agent
- **Handle partial failures** gracefully
- **Aggregate results** meaningfully
- **Monitor resource usage** when spawning many agents
- **Use concurrency limits** to avoid overwhelming systems
- **Document dependencies** between tasks

### Don'ts

- Don't parallelize tasks that share state
- Don't spawn unlimited agents
- Don't ignore failed agent results
- Don't assume order of completion
- Don't parallelize tiny tasks (overhead exceeds benefit)
- Don't forget to clean up agent resources
- Don't skip the aggregation step
- Don't parallelize without clear benefit

## References

- [Concurrency Patterns](https://www.oreilly.com/library/view/concurrency-in-go/9781491941294/)
- [Parallel Programming](https://en.wikipedia.org/wiki/Parallel_computing)
- [Actor Model](https://en.wikipedia.org/wiki/Actor_model)
- [MapReduce Pattern](https://en.wikipedia.org/wiki/MapReduce)
