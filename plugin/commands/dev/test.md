---
description: Generate and run tests with configurable coverage enforcement
allowed-tools: Task, Read, Write, Bash, Glob
argument-hint: <scope> [--coverage PERCENT] [--test-types TYPES] [--watch]
related_skills:
  - methodology/test-enforcement
  - methodology/test-task-generation
related_commands:
  - /dev:test-write
  - /dev:tdd
  - /quality:coverage-check
testing:
  default: true
  configurable: true
---

# 🧪 Test: $ARGUMENTS

Generate tests for: **$ARGUMENTS**

## Test Types
1. **Unit Tests** - Individual functions
2. **Integration Tests** - Component interactions
3. **E2E Tests** - User flows

## Testing Options

This command respects project testing configuration from `.omgkit/workflow.yaml`.

### Default Behavior

- **Testing**: Always enabled (this is a test command)
- **Coverage Enforcement**: Read from `testing.enforcement.level`
- **Coverage Targets**: Configurable via options or config

### Options

| Option | Description | Example |
|--------|-------------|---------|
| `--coverage <percent>` | Override minimum coverage | `/dev:test "src/" --coverage 90` |
| `--test-types <types>` | Specify test types | `/dev:test "api/" --test-types unit,integration` |
| `--watch` | Run in watch mode | `/dev:test "src/" --watch` |
| `--fail-under <percent>` | Fail if coverage below | `/dev:test "lib/" --fail-under 80` |

### Enforcement Levels

| Level | Coverage Below Min | Test Failure |
|-------|-------------------|--------------|
| `soft` | Warning | Warning |
| `standard` | Block | Block |
| `strict` | Block | Block |

## Coverage Targets
- Unit: 80%+
- Integration: 60%+
- E2E: Critical paths

## Configuration

Configure via `.omgkit/workflow.yaml`:

```yaml
testing:
  enabled: true
  enforcement:
    level: standard
  coverage_gates:
    unit:
      minimum: 80
      target: 90
    integration:
      minimum: 60
      target: 75
```

## Output
```
Tests: X passed, Y failed
Coverage: Z%
```

## Examples

```bash
# Run tests with default settings
/dev:test "src/services"

# Run with higher coverage requirement
/dev:test "src/auth" --coverage 95

# Run specific test types
/dev:test "src/api" --test-types unit,integration

# Run in watch mode during development
/dev:test "src/" --watch
```
