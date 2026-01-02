---
name: 100x-architecture
description: Design systems that scale 100x
category: omega
complexity: high
estimated-time: 4-16 hours
agents:
  - oracle
  - architect
  - planner
  - researcher
skills:
  - omega/omega-architecture
  - omega/omega-thinking
commands:
  - /omega:100x
  - /planning:plan-detailed
prerequisites:
  - System architecture exists
  - Scaling requirements known
---

# 100x Architecture Workflow

## Overview

The 100x Architecture workflow helps design and plan systems capable of scaling 100x from current capacity. It applies Omega thinking to architecture decisions.

## When to Use

- Planning for major growth
- Redesigning bottlenecked systems
- Preparing for scale
- Modernizing architecture

## Steps

### Step 1: Current State Analysis
**Agent:** oracle
**Command:** `/omega:100x "$ARGUMENTS"`
**Duration:** 1-2 hours

Analyze current architecture:
- Map system components
- Identify bottlenecks
- Measure current capacity
- Document constraints

**Output:** Architecture analysis

### Step 2: Bottleneck Identification
**Agent:** architect
**Duration:** 1-2 hours

Find scaling limits:
- Database bottlenecks
- Compute limitations
- Network constraints
- Storage limits

**Output:** Bottleneck report

### Step 3: Future State Design
**Agent:** architect
**Duration:** 2-4 hours

Design scalable architecture:
- Apply scaling patterns
- Design for 100x capacity
- Plan data partitioning
- Design service boundaries

**Output:** Future architecture

### Step 4: Migration Planning
**Agent:** planner
**Command:** `/planning:plan-detailed "migration"`
**Duration:** 2-4 hours

Plan migration:
- Phased approach
- Risk mitigation
- Rollback strategy
- Timeline

**Output:** Migration plan

### Step 5: Validation
**Agent:** researcher
**Duration:** 1-2 hours

Validate design:
- Review against requirements
- Check industry patterns
- Assess feasibility
- Identify risks

**Output:** Validation report

## Quality Gates

- [ ] Current architecture documented
- [ ] Bottlenecks identified
- [ ] Future architecture designed
- [ ] Migration plan created
- [ ] Design validated

## Scaling Patterns

```
100x Scaling Patterns
=====================

DATABASE:
- Read replicas
- Sharding
- Caching layers
- Event sourcing

COMPUTE:
- Horizontal scaling
- Serverless functions
- Container orchestration
- Auto-scaling

NETWORK:
- CDN distribution
- Load balancing
- API gateways
- Edge computing

DATA:
- Partitioning
- Archiving
- Tiered storage
- Data lakes
```

## Example Usage

```bash
/workflow:100x-architecture "e-commerce platform for 100x order volume"
/workflow:100x-architecture "API gateway for 100x request throughput"
```

## Related Workflows

- `10x-improvement` - For smaller improvements
- `1000x-innovation` - For paradigm shifts
- `database-optimization` - For database scaling
