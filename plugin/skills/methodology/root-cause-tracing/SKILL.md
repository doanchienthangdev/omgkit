---
name: tracing-root-causes
description: AI agent performs systematic root cause analysis using 5 Whys, Fishbone diagrams, and evidence-based investigation. Use when debugging, conducting post-mortems, or investigating incidents.
---

# Tracing Root Causes

## Quick Start

1. **Identify Symptom** - Document the observable problem
2. **Gather Evidence** - Collect logs, metrics, traces around incident
3. **Apply 5 Whys** - Ask "Why?" iteratively until fundamental cause found
4. **Map Categories** - Use Fishbone to explore all cause categories
5. **Document Findings** - Create RCA report with action items

## Features

| Feature | Description | Guide |
|---------|-------------|-------|
| Cause Hierarchy | Symptom -> Proximate -> Root -> Systemic | Fix at deepest level possible |
| 5 Whys | Iterative "Why?" questioning | Typically 5 iterations to root cause |
| Fishbone Diagram | Category-based cause exploration | Code, Data, Config, Infra, External, Process |
| Evidence Gathering | Logs, metrics, traces, reproduction | Timestamp, source, reliability rating |
| RCA Report | Structured documentation | Timeline, cause chain, action items |
| Systemic Factors | Why wasn't this caught earlier? | Testing, monitoring, process gaps |

## Common Patterns

```
# 5 Whys Example
Problem: Website down for 2 hours

Why #1: Why down? -> Server out of memory
Why #2: Why out of memory? -> Connections unbounded
Why #3: Why unbounded? -> Not released after use
Why #4: Why not released? -> Early return skipped finally
Why #5: Why not caught? -> No test for cleanup path

Root Causes:
1. Technical: Missing cleanup execution
2. Systemic: Missing test coverage
3. Process: Code review missed pattern

# Fishbone Categories (Software)
CODE:       Logic errors, race conditions, memory leaks
DATA:       Invalid input, corrupt data, schema mismatch
CONFIG:     Wrong settings, env mismatch, feature flags
INFRA:      Resource exhaustion, network, scaling
EXTERNAL:   Third-party APIs, dependencies, attacks
PROCESS:    Missing tests, review gaps, monitoring blind spots
```

```
# Cause Hierarchy
SYMPTOM: "App crashed"
    |
PROXIMATE CAUSE: "Out of memory"
    |
CONTRIBUTING FACTOR: "No memory limits"
    |
ROOT CAUSE: "Memory leak in event handlers"
    |
SYSTEMIC FACTOR: "No memory monitoring"

PRINCIPLE: Fix symptoms = problem returns
           Fix root cause = this problem prevented
           Fix systemic = class of problems prevented
```

## Best Practices

| Do | Avoid |
|----|-------|
| Gather evidence before forming hypotheses | Jumping to conclusions |
| Use structured methods consistently | Ad-hoc investigation |
| Involve multiple perspectives | Single viewpoint |
| Look for systemic factors | Just fixing immediate cause |
| Create actionable recommendations | Vague "be more careful" |
| Verify fixes prevent recurrence | Assuming fix works |
| Share learnings across team | Siloing knowledge |
| Investigate near-misses too | Only investigating failures |

## Related Skills

- `debugging-systematically` - Four-phase debugging process
- `solving-problems` - 5-phase problem-solving framework
- `thinking-sequentially` - Numbered thought chains
- `verifying-before-completion` - Ensure fix completeness
