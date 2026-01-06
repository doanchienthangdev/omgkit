---
description: Complex bug fix with deep investigation and comprehensive testing
allowed-tools: Task, Read, Write, Bash, Grep, Glob, WebSearch
argument-hint: <complex bug> [--no-test] [--test-level LEVEL]
related_skills:
  - methodology/systematic-debugging
  - methodology/test-enforcement
  - omega/omega-thinking
related_commands:
  - /dev:fix
  - /dev:fix-fast
  - /quality:verify-done
testing:
  default: true
  configurable: true
---

# Fix Hard: $ARGUMENTS

Deep investigation for: **$ARGUMENTS**

## Workflow

1. **Analyze** (oracle) - Apply 7 thinking modes
2. **Investigate** (debugger) - Multiple hypotheses
3. **Fix** (fullstack-developer) - Implement solution
4. **Test** (tester) - Comprehensive testing

## Testing Options

This command respects project testing configuration from `.omgkit/workflow.yaml`.

### Default Behavior

- **Testing**: Enabled by default (comprehensive tests for complex bugs)
- **Enforcement Level**: Read from `testing.enforcement.level` (default: standard)
- **Test Types**: Unit + Integration + Regression

### Options

| Option | Description | Example |
|--------|-------------|---------|
| `--no-test` | Skip test enforcement | `/dev:fix-hard "race condition" --no-test` |
| `--test-level <level>` | Override enforcement level | `/dev:fix-hard "crash" --test-level strict` |

### Enforcement Levels

| Level | Test Failure | Coverage Below Min | Missing Tests |
|-------|--------------|-------------------|---------------|
| `soft` | Warning | Warning | Warning |
| `standard` | Block | Block | Warning |
| `strict` | Block | Block | Block |

## Oracle Analysis

Apply all 7 thinking modes:

- **Telescopic** - Bigger context
- **Microscopic** - First principles
- **Lateral** - Other approaches
- **Inversion** - What causes failure
- **Temporal** - When did it start
- **Systemic** - System effects
- **Quantum** - All possibilities

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
```

Or via CLI:

```bash
omgkit config set testing.enforcement.level strict
```

## Examples

```bash
# Default: comprehensive testing for complex bug
/dev:fix-hard "intermittent race condition in auth"

# Strict mode for critical systems
/dev:fix-hard "data corruption in payment" --test-level strict

# Skip testing (not recommended for complex bugs)
/dev:fix-hard "UI glitch" --no-test
```
