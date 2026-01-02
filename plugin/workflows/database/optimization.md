---
name: database-optimization
description: Optimize database performance
category: database
complexity: medium
estimated-time: 2-6 hours
agents:
  - database-admin
  - tester
skills:
  - databases/database-optimization
commands:
  - /quality:optimize
  - /dev:test
prerequisites:
  - Database accessible
  - Performance metrics available
---

# Database Optimization Workflow

## Overview

The Database Optimization workflow systematically improves database performance through query optimization, indexing, and configuration tuning.

## When to Use

- Slow query complaints
- Performance degradation
- Scaling preparation
- Regular maintenance

## Steps

### Step 1: Performance Profiling
**Agent:** database-admin
**Duration:** 30-60 minutes

Profile performance:
- Identify slow queries
- Analyze query patterns
- Check resource usage
- Review current indexes

**Output:** Performance profile

### Step 2: Query Analysis
**Agent:** database-admin
**Duration:** 30-60 minutes

Analyze queries:
- EXPLAIN plans
- Index usage
- Full table scans
- N+1 queries

**Output:** Query analysis

### Step 3: Index Optimization
**Agent:** database-admin
**Duration:** 30-60 minutes

Optimize indexes:
- Add missing indexes
- Remove unused indexes
- Composite indexes
- Covering indexes

**Output:** Index changes

### Step 4: Query Optimization
**Agent:** database-admin
**Duration:** 1-2 hours

Optimize queries:
- Rewrite slow queries
- Add query hints
- Batch operations
- Caching strategies

**Output:** Optimized queries

### Step 5: Configuration Tuning
**Agent:** database-admin
**Duration:** 30-60 minutes

Tune configuration:
- Memory allocation
- Connection pooling
- Cache sizes
- Timeout settings

**Output:** Configuration updates

### Step 6: Verification
**Agent:** tester
**Command:** `/dev:test`
**Duration:** 30-60 minutes

Verify improvements:
- Re-run benchmarks
- Compare metrics
- Validate behavior
- Document results

**Output:** Optimization report

## Quality Gates

- [ ] Slow queries identified
- [ ] Query plans analyzed
- [ ] Indexes optimized
- [ ] Queries improved
- [ ] Configuration tuned
- [ ] Improvements verified

## Optimization Targets

| Metric | Target | Action |
|--------|--------|--------|
| Query time | <100ms | Index/rewrite |
| Connection pool | <80% | Scale up |
| Cache hit rate | >95% | Increase cache |
| I/O wait | <10% | Index/query |

## Example Usage

```bash
/workflow:database-optimization "orders table slow queries"
/workflow:database-optimization "overall database performance"
```

## Related Workflows

- `schema-design` - For structural changes
- `migration` - For schema updates
