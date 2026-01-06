---
description: Debug and fix bugs with regression test enforcement
allowed-tools: Task, Read, Write, Bash, Grep, Glob
argument-hint: <error or issue> [--no-test] [--test-level LEVEL]
related_skills:
  - methodology/systematic-debugging
  - methodology/test-enforcement
related_commands:
  - /dev:fix-fast
  - /dev:fix-hard
  - /quality:verify-done
testing:
  default: true
  configurable: true
---

# Fix: $ARGUMENTS

Fix issue: **$ARGUMENTS**

## Workflow

1. **Investigate** (debugger) - Find root cause
2. **Fix** (fullstack-developer) - Implement fix
3. **Test** (tester) - Verify fix + add regression test
4. **Commit** (git-manager) - Commit fix

## Testing Options

This command respects project testing configuration from `.omgkit/workflow.yaml`.

### Default Behavior

- **Testing**: Enabled by default (regression tests)
- **Enforcement Level**: Read from `testing.enforcement.level` (default: standard)
- **Regression Test**: Always recommended for bug fixes

### Options

| Option | Description | Example |
|--------|-------------|---------|
| `--no-test` | Skip test enforcement | `/dev:fix "login error" --no-test` |
| `--test-level <level>` | Override enforcement level | `/dev:fix "crash" --test-level strict` |

### Enforcement Levels

| Level | Test Failure | Missing Regression Test |
|-------|--------------|------------------------|
| `soft` | Warning | Warning |
| `standard` | Block | Warning |
| `strict` | Block | Block |

## Debug Process

1. Reproduce the issue
2. Form hypotheses
3. Test each hypothesis
4. Implement minimal fix
5. Add regression test (prevents recurrence)

## Configuration

Configure via `.omgkit/workflow.yaml`:

```yaml
testing:
  enabled: true
  enforcement:
    level: standard
```

Or via CLI:

```bash
omgkit config set testing.enforcement.level strict
```

## Examples

```bash
# Default: with regression test enforcement
/dev:fix "login returns 500 error"

# Strict mode: requires regression test
/dev:fix "data corruption bug" --test-level strict

# Skip testing for trivial fixes
/dev:fix "typo in error message" --no-test
```
