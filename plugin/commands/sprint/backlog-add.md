---
description: Add task to backlog
allowed-tools: Read, Write
argument-hint: <task> [--type TYPE] [--priority N]
---

# ➕ Backlog Add: $ARGUMENTS

Add task to backlog.

## Options
- `--type` - feature, bugfix, docs, test, refactor, infra
- `--priority` - 1-5 (1 = highest)

## Example
```
/backlog:add "Add user authentication" --type feature --priority 1
```

## Output
Generates task ID and saves to `.omgkit/sprints/backlog.yaml`
