---
description: Database performance optimization workflow
allowed-tools: Task, Read, Write, Edit, Bash, Grep, Glob
argument-hint: <optimization target>
---

# Database Optimization Workflow

Optimize: **$ARGUMENTS**

## Workflow Steps

### Step 1: Performance Analysis
**Agent:** @database-admin

- Identify slow queries
- Analyze execution plans
- Review index usage
- Measure baselines

### Step 2: Query Optimization
**Agent:** @database-admin

- Rewrite slow queries
- Add missing indexes
- Remove unused indexes
- Optimize joins

### Step 3: Schema Optimization
**Agent:** @database-admin

- Review data types
- Consider partitioning
- Evaluate denormalization
- Optimize storage

### Step 4: Configuration Tuning
**Agent:** @database-admin

- Review DB configuration
- Tune memory settings
- Optimize connections
- Configure caching

### Step 5: Validation
**Agent:** @tester

- Benchmark improvements
- Compare to baseline
- Test under load
- Document gains

## Progress Tracking
- [ ] Performance analyzed
- [ ] Queries optimized
- [ ] Schema improved
- [ ] Configuration tuned
- [ ] Improvements validated

Execute each step. Measure impact.
