---
description: Execute existing plan with subagents
allowed-tools: Task, Read, Write, Bash, Glob
argument-hint: <plan-file>
---

# ▶️ Execute: $ARGUMENTS

Execute plan from: **$ARGUMENTS**

## Process
1. Read plan file
2. Execute tasks sequentially
3. Review gate after each phase
4. Report progress

## Execution
For each task:
1. Assign to appropriate agent
2. Execute task
3. Verify success criteria
4. Update progress
5. Next task

## Progress Tracking
- [ ] Task 1
- [ ] Task 2
- [ ] ...
