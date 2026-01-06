---
description: Quick bug fix with minimal investigation (testing optional)
allowed-tools: Read, Write, Bash, Grep
argument-hint: <bug> [--with-test]
related_skills:
  - methodology/systematic-debugging
related_commands:
  - /dev:fix
  - /dev:fix-hard
testing:
  default: false
  configurable: true
---

# Fix Fast: $ARGUMENTS

Quick fix for: **$ARGUMENTS**

Skip deep analysis. Apply obvious fix immediately.

## Process

1. Locate the issue
2. Apply fix
3. Verify it works
4. Done

Use for obvious bugs with clear solutions.

## Testing Options

This command has **testing disabled by default** for speed. Use `--with-test` to enable.

### Default Behavior

- **Testing**: Disabled by default (quick fixes)
- **Use For**: Typos, obvious one-line fixes, config changes

### Options

| Option | Description | Example |
|--------|-------------|---------|
| `--with-test` | Enable test enforcement | `/dev:fix-fast "typo" --with-test` |
| `--test-level <level>` | Set enforcement level | `/dev:fix-fast "bug" --with-test --test-level standard` |

## When to Use

| Use `/dev:fix-fast` | Use `/dev:fix` instead |
|---------------------|------------------------|
| Typo in string/message | Logic errors |
| Obvious one-liner | Multiple files affected |
| Config value change | Root cause unclear |
| Import/export fix | Could have side effects |

## Configuration

Even when `--with-test` is used, respects project config:

```yaml
testing:
  enforcement:
    level: standard
```

## Examples

```bash
# Quick fix without testing (default)
/dev:fix-fast "typo in error message"

# Quick fix but still run tests
/dev:fix-fast "wrong import path" --with-test

# Quick fix with strict testing
/dev:fix-fast "config value" --with-test --test-level strict
```

## Warning

For complex bugs or bugs with unclear root cause, use `/dev:fix` or `/dev:fix-hard` instead.
