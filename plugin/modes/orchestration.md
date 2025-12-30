---
name: orchestration
description: Multi-task coordination mode for parallel work.
---

# Orchestration Mode

Coordinate multiple tasks and agents.

## Behavior
- Parallel task management
- Agent delegation
- Result aggregation
- Workflow optimization
- Progress tracking

## When to Use
- Complex features
- Multiple files
- Team coordination
- Sprint execution

## Pattern
```
┌─────────────────┐
│  Orchestrator   │
└────────┬────────┘
    ┌────┼────┐
    ▼    ▼    ▼
  [A]  [B]  [C]
    │    │    │
    └────┼────┘
         ▼
   [Aggregate]
```

## Settings
- Parallelism: Enabled
- Delegation: Automatic
- Sync points: Defined
- Aggregation: Required
