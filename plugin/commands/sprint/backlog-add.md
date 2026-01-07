---
description: Add task to backlog with optional reference context
allowed-tools: Read, Write
argument-hint: <task> [--type TYPE] [--priority N] [--ref=<path>]
references:
  supported: true
  inherit_from_sprint: true
  types: [file, folder, glob]
related_skills:
  - autonomous/project-orchestration
  - methodology/agile-sprint
related_commands:
  - /sprint:sprint-new
  - /sprint:backlog-show
  - /sprint:backlog-prioritize
---

# Backlog Add: $ARGUMENTS

Add a task to the backlog with optional reference context.

## Options

| Option | Description | Example |
|--------|-------------|---------|
| `--type` | Task type | `--type feature` |
| `--priority` | Priority 1-5 (1 = highest) | `--priority 1` |
| `--ref=<path>` | Reference source for task context | `--ref=artifacts/prd.md#auth` |
| `--req=<id>` | Link to requirement ID | `--req=REQ-001` |

### Task Types

| Type | Description | Auto-generates Tests |
|------|-------------|---------------------|
| `feature` | New functionality | Yes |
| `bugfix` | Bug fix | Yes (regression) |
| `docs` | Documentation | No |
| `test` | Test task | No |
| `refactor` | Code refactoring | Yes |
| `infra` | Infrastructure | No |

## Reference Options

The `--ref` parameter allows linking tasks to specific reference documents:

```bash
# Link task to PRD requirement
/backlog:add "User login" --type feature --ref=artifacts/prd.md

# Link to specific section (anchor)
/backlog:add "OAuth flow" --ref=artifacts/prd.md#authentication

# Link to API spec
/backlog:add "Payment endpoint" --ref=specs/api-payment.yaml
```

### Requirement Linking

Use `--req` to link tasks directly to requirement IDs:

```bash
/backlog:add "User authentication" --type feature --req=REQ-AUTH-001
```

This enables:
- Traceability from requirements to implementation
- Coverage tracking for requirements
- Impact analysis for requirement changes

## Output

Generates task ID and saves to `.omgkit/sprints/backlog.yaml`:

```yaml
backlog:
  - id: TASK-042
    title: "User login"
    type: feature
    priority: 1
    status: pending
    reference:
      source: "artifacts/prd.md"
      requirement_id: "REQ-AUTH-001"
    created: 2025-01-07
```

## Examples

```bash
# Basic task
/backlog:add "Add user authentication" --type feature --priority 1

# Task with reference
/backlog:add "Implement OAuth" --type feature --ref=artifacts/prd-auth.md

# Task linked to requirement
/backlog:add "Rate limiting" --type feature --req=REQ-API-005

# Task with all options
/backlog:add "Payment gateway" --type feature --priority 1 --ref=specs/api.yaml --req=REQ-PAY-001
```

## Best Practices

1. **Link to requirements** - Use `--req` for traceability
2. **Reference specs** - Use `--ref` for implementation context
3. **Set appropriate type** - Enables correct test generation
4. **Prioritize consistently** - 1 = critical, 5 = nice-to-have
