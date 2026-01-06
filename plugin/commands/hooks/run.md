---
name: hooks:run
description: Manually run Git hook actions for testing or debugging, without triggering an actual Git operation.
category: hooks
---

# /hooks:run

Manually execute Git hook actions for testing or debugging.

## Usage

```bash
# Run all actions for a hook
/hooks:run pre-commit
/hooks:run commit-msg
/hooks:run pre-push

# Run specific action only
/hooks:run pre-commit --action=lint
/hooks:run pre-commit --action=format
/hooks:run pre-push --action=test

# Run on specific files
/hooks:run pre-commit --files="src/app.ts,src/utils.ts"

# Verbose output
/hooks:run pre-commit --verbose
```

## Available Hooks

### pre-commit

```bash
/hooks:run pre-commit

# Actions:
# - lint: Run linter on staged files
# - format: Format staged files
# - type-check: Run type checker
# - secrets-check: Detect leaked secrets
```

### commit-msg

```bash
/hooks:run commit-msg

# Validates last commit message
# Or provide message:
/hooks:run commit-msg --message="feat: add login"
```

### pre-push

```bash
/hooks:run pre-push

# Actions:
# - test: Run test suite
# - security-scan: Run security audit
# - build: Verify build works
```

## Output

```
Running pre-commit hooks
========================

Action: lint
  Running: npx eslint src/
  ✓ Passed (0 errors, 2 warnings)

Action: format
  Running: npx prettier --check src/
  ✓ All files formatted

Action: type-check
  Running: npx tsc --noEmit
  ✓ No type errors

Summary: 3/3 actions passed
```

## Use Cases

### Test Before Commit

```bash
# Make sure hooks will pass
/hooks:run pre-commit

# Then commit
git commit -m "feat: add feature"
```

### Debug Failing Hook

```bash
# Run with verbose output
/hooks:run pre-commit --verbose

# Run specific failing action
/hooks:run pre-commit --action=lint
```

### Validate Commit Message

```bash
# Check if message is valid
/hooks:run commit-msg --message="fix: resolve bug"

# Output:
# ✓ Valid conventional commit
# Type: fix
# Subject: resolve bug
```

### Run Tests Before Push

```bash
# Full pre-push check
/hooks:run pre-push

# Just tests
/hooks:run pre-push --action=test
```

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | All actions passed |
| 1 | One or more actions failed |
| 2 | Config error or invalid hook |

## Related Commands

- `/hooks:setup` - Install/update hooks
- `/workflow:status` - Check workflow status
- `/dev:test` - Run tests
- `/quality:lint` - Run linter
