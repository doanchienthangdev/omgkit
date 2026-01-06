---
description: Full feature development with planning, testing, and review
allowed-tools: Task, Read, Write, Bash, Grep, Glob
argument-hint: <feature description> [--no-test] [--test-level LEVEL]
related_skills:
  - methodology/writing-plans
  - methodology/test-enforcement
  - methodology/test-task-generation
related_commands:
  - /dev:feature-tested
  - /quality:verify-done
  - /dev:tdd
testing:
  default: true
  configurable: true
---

# Feature: $ARGUMENTS

Build feature: **$ARGUMENTS**

## Workflow

1. **Plan** (planner) - Create implementation plan
2. **Implement** (fullstack-developer) - Write code
3. **Test** (tester) - Write and run tests
4. **Review** (code-reviewer) - Code review
5. **Commit** (git-manager) - Create commit

## Testing Options

This command respects project testing configuration from `.omgkit/workflow.yaml`.

### Default Behavior

- **Testing**: Enabled by default
- **Enforcement Level**: Read from `testing.enforcement.level` (default: standard)
- **Auto-generate Tests**: Read from `testing.auto_generate_tasks` (default: true)

### Options

| Option | Description | Example |
|--------|-------------|---------|
| `--no-test` | Skip test enforcement | `/dev:feature "add login" --no-test` |
| `--test-level <level>` | Override enforcement level | `/dev:feature "add login" --test-level strict` |
| `--coverage <percent>` | Override minimum coverage | `/dev:feature "add login" --coverage 90` |

### Enforcement Levels

| Level | Test Failure | Coverage Below Min | Missing Tests |
|-------|--------------|-------------------|---------------|
| `soft` | Warning | Warning | Warning |
| `standard` | Block | Block | Warning |
| `strict` | Block | Block | Block |

## Configuration

Configure via `.omgkit/workflow.yaml`:

```yaml
testing:
  enabled: true
  enforcement:
    level: standard    # soft | standard | strict
  auto_generate_tasks: true
  coverage_gates:
    unit:
      minimum: 80
```

Or via CLI:

```bash
omgkit config set testing.enforcement.level strict
```

## Progress

- [ ] Planning complete
- [ ] Implementation complete
- [ ] Tests passing (when enabled)
- [ ] Coverage meets threshold (when enabled)
- [ ] Review approved
- [ ] Committed

## Examples

```bash
# Default: with test enforcement
/dev:feature "add user authentication"

# With strict enforcement
/dev:feature "add payment processing" --test-level strict

# Skip testing (requires soft level or justification)
/dev:feature "add logging" --no-test

# High coverage requirement
/dev:feature "add API endpoint" --coverage 95
```

Show progress after each step.
