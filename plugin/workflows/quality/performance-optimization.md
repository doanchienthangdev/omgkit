---
name: performance-optimization
description: Improve application performance
category: quality
complexity: medium
estimated-time: 2-8 hours
agents:
  - fullstack-developer
  - tester
skills:
  - ai-engineering/inference-optimization
  - databases/database-optimization
commands:
  - /quality:optimize
  - /dev:test
prerequisites:
  - Performance metrics baseline
  - Target improvements defined
---

# Performance Optimization Workflow

## Overview

The Performance Optimization workflow systematically improves application performance through profiling, optimization, and measurement.

## When to Use

- Slow application response
- High resource usage
- Scaling preparation
- Cost optimization

## Steps

### Step 1: Profiling
**Agent:** fullstack-developer
**Duration:** 30-60 minutes

Profile performance:
- Identify bottlenecks
- Measure baselines
- CPU/memory analysis
- Network profiling

**Output:** Performance profile

### Step 2: Analysis
**Agent:** fullstack-developer
**Duration:** 30-60 minutes

Analyze bottlenecks:
- Root cause analysis
- Impact assessment
- Prioritization
- Solution options

**Output:** Analysis report

### Step 3: Optimization
**Agent:** fullstack-developer
**Command:** `/quality:optimize "$ARGUMENTS"`
**Duration:** 1-4 hours

Implement optimizations:
- Code optimizations
- Caching strategies
- Query optimization
- Resource management

**Output:** Optimized code

### Step 4: Measurement
**Agent:** tester
**Duration:** 30-60 minutes

Measure improvements:
- Run benchmarks
- Compare to baseline
- Verify no regressions
- Document results

**Output:** Performance report

### Step 5: Validation
**Agent:** tester
**Command:** `/dev:test`
**Duration:** 30-60 minutes

Validate changes:
- Run test suite
- Integration tests
- Load tests
- Smoke tests

**Output:** Validation report

## Quality Gates

- [ ] Baseline established
- [ ] Bottlenecks identified
- [ ] Optimizations applied
- [ ] Improvements measured
- [ ] Tests passing

## Optimization Areas

```
Performance Optimization Areas
==============================
CODE:
- Algorithm efficiency
- Memory management
- Async operations
- Bundle size

DATABASE:
- Query optimization
- Index usage
- Connection pooling
- Caching

NETWORK:
- Request batching
- Compression
- CDN usage
- Lazy loading

INFRASTRUCTURE:
- Scaling
- Resource allocation
- Container optimization
- Edge computing
```

## Performance Targets

| Metric | Typical Target |
|--------|---------------|
| Page Load | <3s |
| API Response | <200ms |
| LCP | <2.5s |
| FID | <100ms |
| CLS | <0.1 |

## Example Usage

```bash
/workflow:performance-optimization "API endpoint latency"
/workflow:performance-optimization "frontend bundle size"
```

## Related Workflows

- `database-optimization` - For database focus
- `10x-improvement` - For major gains
- `refactor` - For code improvements
