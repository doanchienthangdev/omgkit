---
name: hooks:setup
description: Install or update Git hooks based on workflow configuration, creating executable hook scripts in .git/hooks/.
category: hooks
---

# /hooks:setup

Install Git hooks from your workflow configuration.

## Usage

```bash
# Install all hooks from config
/hooks:setup

# Install specific hook only
/hooks:setup --hook=pre-commit
/hooks:setup --hook=commit-msg
/hooks:setup --hook=pre-push

# Force overwrite existing hooks
/hooks:setup --force

# Dry run (show what would be created)
/hooks:setup --dry-run

# Remove all hooks
/hooks:setup --remove
```

## What It Does

1. **Reads config** from `.omgkit/workflow.yaml`
2. **Generates hook scripts** based on settings
3. **Installs to `.git/hooks/`** with execute permissions
4. **Validates installation**

## Generated Hooks

### pre-commit

Runs before each commit:

```yaml
hooks:
  pre_commit:
    enabled: true
    actions:
      - lint        # ESLint, Pylint, etc.
      - format      # Prettier, Black, etc.
      - type-check  # TypeScript, mypy, etc.
```

### commit-msg

Validates commit message:

```yaml
hooks:
  commit_msg:
    enabled: true
    validate_conventional: true
    max_length: 72
```

### pre-push

Runs before push:

```yaml
hooks:
  pre_push:
    enabled: true
    actions:
      - test           # Run tests
      - security-scan  # npm audit, safety
```

### post-merge

Runs after git pull/merge:

```yaml
hooks:
  post_merge:
    enabled: true
    actions:
      - install  # npm install
```

## Output

```
Installing Git Hooks
====================

Reading config from .omgkit/workflow.yaml...

Creating hooks:
  ✓ pre-commit (lint, format, type-check)
  ✓ commit-msg (conventional validation)
  ✓ pre-push (test, security-scan)
  - post-merge (disabled in config)

Setting permissions...
  ✓ .git/hooks/pre-commit (755)
  ✓ .git/hooks/commit-msg (755)
  ✓ .git/hooks/pre-push (755)

Done! 3 hooks installed.

Test with: /hooks:run pre-commit
```

## Auto-Detection

Hooks auto-detect your project type:

| Project | Lint | Format | Test |
|---------|------|--------|------|
| Node.js | `npx eslint` | `npx prettier` | `npm test` |
| Python | `ruff check` | `black` | `pytest` |
| Go | `golangci-lint` | `gofmt` | `go test` |
| Rust | `cargo clippy` | `cargo fmt` | `cargo test` |

## Examples

```bash
# Initial setup
/workflow:init
/hooks:setup

# Update after config change
/hooks:setup --force

# Check what would be created
/hooks:setup --dry-run

# Remove hooks
/hooks:setup --remove
```

## Troubleshooting

### Permission Denied

```bash
chmod +x .git/hooks/*
```

### Hook Not Running

```bash
# Check hook exists and is executable
ls -la .git/hooks/pre-commit

# Regenerate
/hooks:setup --force
```

### Bypass Temporarily

```bash
SKIP_HOOKS=1 git commit -m "message"
# or
git commit --no-verify -m "message"
```

## Related Commands

- `/hooks:run` - Manually run hook actions
- `/workflow:init` - Initialize workflow config
- `/workflow:status` - Check workflow status
