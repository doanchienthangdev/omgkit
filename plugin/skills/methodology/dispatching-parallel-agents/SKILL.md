---
name: dispatching-parallel-agents
description: AI agent orchestrates parallel task execution through concurrent specialized agents for maximum efficiency. Use when tasks can run independently, multi-concern reviews, or parallel exploration.
---

# Dispatching Parallel Agents

## Quick Start

1. **Analyze** - Identify independent vs dependent tasks
2. **Group** - Create parallel groups with no shared dependencies
3. **Specialize** - Assign agents by expertise (explorer, implementer, reviewer)
4. **Dispatch** - Fan-out tasks with timeouts and concurrency limits
5. **Aggregate** - Combine results using merge, consensus, or priority
6. **Handle Errors** - Retry failed, continue with partial, or fail-fast

## Features

| Feature | Description | Guide |
|---------|-------------|-------|
| Task Analysis | Identify parallelizable work | No data deps, no shared files, no state |
| Agent Specialization | Match agent type to task | Explorer, implementer, tester, reviewer |
| Fan-Out/Fan-In | Parallel dispatch and aggregation | Promise.all for dispatch, merge results |
| Concurrency Limits | Control parallel agent count | Prevent resource exhaustion |
| Timeout Handling | Bound execution time per agent | Race with timeout, handle gracefully |
| Error Strategies | Handle partial failures | Retry, continue, or fail-fast |

## Common Patterns

```
# Parallel Execution Model
         [Main Agent (Orchestrator)]
                    |
         [Task Analysis & Distribution]
                    |
    +---------------+---------------+
    |               |               |
[Agent A]      [Agent B]      [Agent C]
(Task 1)       (Task 2)       (Task 3)
    |               |               |
    +-------+-------+-------+-------+
            |
    [Aggregation & Integration]
            |
      [Final Response]

TIMING:
Sequential: ████████████████████████████
Parallel:   ████████████  (max of tasks)
```

```typescript
// Fan-out/Fan-in Pattern
const [security, performance, style] = await Promise.all([
  spawnAgent({ type: 'reviewer', focus: 'security' }),
  spawnAgent({ type: 'reviewer', focus: 'performance' }),
  spawnAgent({ type: 'reviewer', focus: 'style' }),
]);
return combineReviews([security, performance, style]);

// Parallelization Criteria
CAN PARALLELIZE:
- Independent code changes (different files)
- Research on different topics
- Tests for different modules
- Multi-concern code reviews

CANNOT PARALLELIZE:
- Tasks with data dependencies
- Sequential workflow steps
- Tasks modifying same files
- Tasks sharing mutable state
```

```
# Agent Specialization
| Type | Strengths | Best For |
|------|-----------|----------|
| explorer | Finding files, patterns | Initial exploration |
| implementer | Writing production code | Features, bug fixes |
| tester | Test design, edge cases | Unit/integration tests |
| reviewer | Issue identification | Code review, security |
| documenter | Clear explanations | Docs, comments |
```

## Best Practices

| Do | Avoid |
|----|-------|
| Identify truly independent tasks first | Parallelizing tasks that share state |
| Use specialized agents for concerns | One agent doing everything |
| Set appropriate timeouts per agent | Unbounded execution time |
| Handle partial failures gracefully | Ignoring failed agent results |
| Use concurrency limits | Spawning unlimited agents |
| Aggregate results meaningfully | Skipping result combination |
| Document dependencies between tasks | Assuming order of completion |
| Clean up agent resources | Resource leaks from agents |

## Related Skills

- `optimizing-tokens` - Efficient context per agent
- `thinking-sequentially` - Order dependent tasks
- `writing-plans` - Plan parallel execution phases
- `executing-plans` - Execute with parallel steps
