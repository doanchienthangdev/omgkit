---
description: Run AI team on sprint tasks
allowed-tools: Task, Read, Write, Bash, Grep, Glob
argument-hint: [--mode MODE]
---

# 🤖 Team Run

Start AI team on sprint tasks.

## Modes
- `--mode full-auto` - No human intervention
- `--mode semi-auto` - Review at checkpoints (default)
- `--mode manual` - Approve each step

## Process
1. Load current sprint
2. Assign tasks to agents
3. Execute in priority order
4. Report progress

## Agent Assignment
| Task Type | Agent |
|-----------|-------|
| feature | fullstack-developer |
| bugfix | debugger |
| docs | docs-manager |
| test | tester |
| research | oracle |
