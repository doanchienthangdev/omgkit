---
description: Create new sprint
allowed-tools: Task, Read, Write, Grep, Glob
argument-hint: "[name] [--propose]"
---

# 🏃 Sprint New: $ARGUMENTS

Create new sprint.

## Options
- `--propose` - AI analyzes codebase and proposes tasks

## AI Proposal Analyzes
- TODOs and FIXMEs in code
- Test coverage gaps
- Documentation gaps
- Features aligned with vision
- Technical debt

## Output
Save to: `.omgkit/sprints/current.yaml`

```yaml
sprint:
  name: Sprint 1
  status: planning
  start_date: null
  end_date: null
  tasks: []
```
