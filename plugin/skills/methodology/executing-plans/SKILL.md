---
name: executing-plans
description: AI agent follows implementation plans systematically with progress tracking, quality gates, and blocker resolution. Use when implementing features, following plans, or executing tasks.
---

# Executing Plans

## Quick Start

1. **Prepare** - Read entire plan, verify understanding, check dependencies
2. **Execute Task** - Read -> Navigate -> Implement -> Verify -> Complete
3. **Track Progress** - Update status after each task, report blockers immediately
4. **Pass Quality Gates** - Validate after task, after phase, before completion
5. **Handle Deviations** - Document changes, get approval for scope changes

## Features

| Feature | Description | Guide |
|---------|-------------|-------|
| Preparation Phase | Understand before starting | Read plan, verify deps, clarify questions |
| Task Execution | Systematic per-task flow | Read, navigate, implement, verify, complete |
| Progress Tracking | Real-time status updates | Completed X, In Progress Y, Remaining Z |
| Quality Gates | Validation checkpoints | Per-task, per-phase, pre-completion |
| Blocker Resolution | Unblock systematically | Document, assess, attempt, escalate, workaround |
| Deviation Handling | Adapt to discoveries | Document, assess scope/timeline, get approval |

## Common Patterns

```
# Task Execution Checklist
BEFORE STARTING:
[ ] Read task description completely
[ ] Understand acceptance criteria
[ ] Check dependencies completed
[ ] No blockers present

DURING IMPLEMENTATION:
[ ] Navigate to specified files
[ ] Understand existing code context
[ ] Implement changes incrementally
[ ] Write tests alongside code

AFTER COMPLETION:
[ ] All acceptance criteria met
[ ] Tests pass locally
[ ] No lint/type errors
[ ] Task marked complete

# Quality Gates
AFTER EACH TASK:
npm run lint && npm run typecheck && npm test -- --related

AFTER EACH PHASE:
npm run lint && npm run typecheck && npm test && npm run build

BEFORE COMPLETION:
npm run lint && npm run typecheck && npm test --coverage && npm run build
```

```
# Progress Report Template
## Status: [Date Time]

### Summary
- Completed: [N] tasks
- In Progress: [Task name]
- Remaining: [M] tasks
- Blockers: [None | Description]

### Current Task
**[Task Name]:** [Description]
- Started: [Time]
- Progress: ~60%
- Expected completion: [Time]

### ETA
On track for [date] | Delayed by [reason]
```

```
# Blocker Resolution Flow
BLOCKER DETECTED
      |
1. DOCUMENT immediately
   - What is blocked?
   - Why is it blocked?
      |
2. ASSESS impact
   - Critical path affected?
   - Time sensitive?
      |
3. ATTEMPT resolution (15-30 min)
   - Quick research
   - Alternative approach
      |
   +-> RESOLVED -> Continue
      |
4. ESCALATE if not resolved
   - Report with: issue, attempts, ask
      |
5. WORK AROUND while waiting
   - Move to non-blocked tasks
```

## Best Practices

| Do | Avoid |
|----|-------|
| Read entire plan before starting | Skipping preparation phase |
| Verify understanding of each task | Assuming task requirements |
| Execute tasks in sequence (unless parallel) | Ignoring quality gates |
| Validate after each task completion | Hiding blockers or delays |
| Report blockers immediately | Deviating without documenting |
| Document deviations as they occur | Rushing quality for speed |
| Complete fully before marking done | Leaving tasks partially done |
| Ask questions early | Skipping testing steps |

## Related Skills

- `writing-plans` - Create plans to execute
- `verifying-before-completion` - Quality gate checklists
- `thinking-sequentially` - Track execution progress
- `solving-problems` - Resolve blockers systematically
