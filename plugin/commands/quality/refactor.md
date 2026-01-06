---
description: Improve code structure with test verification
allowed-tools: Task, Read, Write, Bash, Grep, Glob
argument-hint: <file or directory> [--no-test] [--test-level LEVEL]
related_skills:
  - methodology/test-enforcement
related_commands:
  - /dev:fix
  - /quality:optimize
  - /quality:verify-done
testing:
  default: true
  configurable: true
---

# ♻️ Refactor: $ARGUMENTS

Improve code structure of: **$ARGUMENTS**

## Goals
- Remove duplication
- Improve readability
- Apply patterns
- Simplify complexity

## Testing Options

This command respects project testing configuration from `.omgkit/workflow.yaml`.

### Default Behavior

- **Testing**: Enabled by default (verify tests pass after refactoring)
- **Enforcement Level**: Read from `testing.enforcement.level` (default: standard)
- **Regression Prevention**: Ensures refactoring doesn't break existing functionality

### Options

| Option | Description | Example |
|--------|-------------|---------|
| `--no-test` | Skip test verification | `/quality:refactor "src/utils" --no-test` |
| `--test-level <level>` | Override enforcement level | `/quality:refactor "lib/" --test-level strict` |

### Enforcement Levels

| Level | Test Failure After Refactor |
|-------|----------------------------|
| `soft` | Warning |
| `standard` | Block |
| `strict` | Block |

## Process
1. Analyze current code
2. Identify improvements
3. **Run existing tests** (baseline)
4. Apply refactoring
5. **Verify tests still pass**
6. Document changes

## Configuration

Configure via `.omgkit/workflow.yaml`:

```yaml
testing:
  enabled: true
  enforcement:
    level: standard
```

## Examples

```bash
# Default: with test verification
/quality:refactor "src/services/auth.ts"

# Skip tests for simple restructuring
/quality:refactor "src/utils" --no-test

# Strict mode for critical code
/quality:refactor "src/core" --test-level strict
```
