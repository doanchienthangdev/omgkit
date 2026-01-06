---
description: Test-driven development workflow with enforced test-first methodology
allowed-tools: Task, Read, Write, Bash, Glob
argument-hint: <feature> [--coverage PERCENT] [--test-types TYPES]
related_skills:
  - methodology/test-enforcement
  - methodology/systematic-debugging
related_commands:
  - /dev:feature-tested
  - /dev:test-write
  - /quality:verify-done
testing:
  default: true
  configurable: false
---

# 🔴🟢♻️ TDD: $ARGUMENTS

Test-driven development for: **$ARGUMENTS**

## TDD Cycle
1. 🔴 **RED** - Write failing test
2. 🟢 **GREEN** - Make it pass (minimal code)
3. ♻️ **REFACTOR** - Improve code
4. Repeat

## Rules
- No production code without failing test
- Only enough code to pass test
- Refactor only when green

## Testing Options

This command **always enforces testing** (TDD by definition). Testing cannot be disabled.

### Options

| Option | Description | Example |
|--------|-------------|---------|
| `--coverage <percent>` | Set minimum coverage | `/dev:tdd "auth" --coverage 95` |
| `--test-types <types>` | Specify test types | `/dev:tdd "api" --test-types unit,integration` |

### Coverage Requirements

TDD defaults to high coverage requirements:
- **Minimum**: 90% (higher than standard commands)
- **Target**: 95%

## Process
For each requirement:
1. Write test first
2. Run test (should fail)
3. Write minimal code to pass
4. Run test (should pass)
5. Refactor if needed
6. Next requirement

## Configuration

Configure via `.omgkit/workflow.yaml`:

```yaml
testing:
  enabled: true
  coverage_gates:
    unit:
      minimum: 90
      target: 95
```

## Examples

```bash
# Standard TDD workflow
/dev:tdd "user authentication"

# TDD with specific coverage target
/dev:tdd "payment processing" --coverage 95

# TDD with specific test types
/dev:tdd "API endpoint" --test-types unit,integration,contract
```
