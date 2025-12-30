---
description: Plan with parallel execution strategy
allowed-tools: Task, Read, Grep, Glob
argument-hint: <task>
---

# 📋 Parallel Plan: $ARGUMENTS

Plan optimized for parallel agent execution.

## Strategy
1. Identify independent tasks
2. Group by agent type
3. Define sync points
4. Plan parallel streams

## Output Format
```markdown
# Parallel Plan: [Feature]

## Stream A (fullstack-developer)
1. [Task A1]
2. [Task A2]

## Stream B (tester)
1. [Task B1]
2. [Task B2]

## Sync Points
- After A2 + B1: Integration
- After all: Final review

## Execution Order
[A1, B1] → [A2, B2] → [Sync] → [Final]
```
