---
name: Workflow Config System
description: The agent implements a centralized workflow configuration system for Git workflows, enabling set-once-use-everywhere automation for trunk-based development, gitflow, and github-flow patterns with integrated testing automation.
category: devops
related_skills:
  - devops/git-hooks
  - devops/feature-flags
  - devops/github-actions
  - methodology/finishing-development-branch
  - methodology/test-task-generation
  - methodology/test-enforcement
related_commands:
  - /workflow:init
  - /workflow:trunk-based
  - /workflow:status
  - /git:commit
  - /git:pr
  - /quality:verify-done
  - /quality:coverage-check
  - /dev:feature-tested
---

# Workflow Config System

## Overview

The Workflow Config System provides a centralized configuration file (`.omgkit/workflow.yaml`) that defines Git workflow preferences, commit conventions, PR templates, code review settings, deployment configuration, and git hooks. Once configured, all OMGKIT commands automatically respect these settings.

## Core Principles

### Set Once, Use Everywhere
- Configure workflow preferences in one file
- All commands automatically read and apply settings
- No need to repeat parameters on every command

### Convention Over Configuration
- Sensible defaults for all settings
- Only override what you need to customize
- Progressive disclosure of advanced options

### Workflow Flexibility
- Support for trunk-based, gitflow, and github-flow
- Easy switching between workflows
- Project-specific customization

## Configuration File Location

```
project-root/
├── .omgkit/
│   └── workflow.yaml    # Main configuration file
├── .git/
│   └── hooks/           # Auto-generated hooks
└── src/
```

## Complete Configuration Schema

```yaml
# .omgkit/workflow.yaml
# OMGKIT Workflow Configuration
# Version: 1.0

version: "1.0"

# =============================================================================
# GIT WORKFLOW SETTINGS
# =============================================================================
git:
  # Workflow type: trunk-based | gitflow | github-flow
  workflow: trunk-based

  # Main branch name
  main_branch: main

  # Development branch (only for gitflow)
  develop_branch: develop

  # Branch naming prefixes
  branch_prefix:
    feature: "feature/"
    fix: "fix/"
    hotfix: "hotfix/"
    release: "release/"
    chore: "chore/"

  # Maximum age for feature branches (trunk-based)
  max_branch_age_days: 2

  # Auto-delete branch after merge
  delete_branch_on_merge: true

  # Require linear history (rebase before merge)
  linear_history: true

# =============================================================================
# COMMIT SETTINGS
# =============================================================================
commit:
  # Use conventional commits format
  conventional: true

  # Require scope in commit message: feat(scope): message
  require_scope: false

  # Allowed commit types
  allowed_types:
    - feat      # New feature
    - fix       # Bug fix
    - docs      # Documentation
    - style     # Formatting, no code change
    - refactor  # Code restructuring
    - perf      # Performance improvement
    - test      # Adding tests
    - chore     # Maintenance
    - ci        # CI/CD changes
    - build     # Build system changes

  # Sign commits with GPG
  sign_commits: false

  # Maximum commit message length
  max_subject_length: 72
  max_body_line_length: 100

  # Require issue reference in commit
  require_issue_reference: false
  issue_pattern: "#[0-9]+"

# =============================================================================
# PULL REQUEST SETTINGS
# =============================================================================
pr:
  # PR template: auto | path | none
  # auto = use .github/PULL_REQUEST_TEMPLATE.md if exists
  template: auto

  # Require review before merge
  require_review: true

  # Minimum number of reviewers
  min_reviewers: 1

  # Auto-assign PR creator
  auto_assign: true

  # Default reviewers (GitHub usernames)
  default_reviewers: []

  # Create as draft by default
  draft_by_default: false

  # PR title format: conventional | freeform
  title_format: conventional

  # Auto-labeling configuration
  labels:
    enabled: true
    # Labels based on file paths
    by_path:
      "src/api/**": ["backend", "api"]
      "src/ui/**": ["frontend", "ui"]
      "src/components/**": ["frontend", "components"]
      "tests/**": ["testing"]
      "docs/**": ["documentation"]
      ".github/**": ["ci-cd"]
    # Labels based on branch prefix
    by_branch:
      "feature/": ["enhancement"]
      "fix/": ["bug"]
      "hotfix/": ["bug", "critical"]
      "chore/": ["maintenance"]

  # Squash merge settings
  squash_merge: true
  merge_commit_format: "pr_title"  # pr_title | pr_body | default

# =============================================================================
# CODE REVIEW SETTINGS
# =============================================================================
review:
  # Enable auto-review with Claude
  auto_review: true

  # When to trigger auto-review
  trigger: on_pr  # on_pr | on_push | manual

  # Review checks to perform
  checks:
    - security           # OWASP, vulnerabilities
    - performance        # N+1 queries, memory leaks
    - best-practices     # Code patterns, SOLID
    - tests              # Test coverage, quality
    - accessibility      # A11y for frontend
    - documentation      # Missing docs, outdated

  # Block merge on critical issues
  block_on_critical: true

  # Review strictness: relaxed | standard | strict
  strictness: standard

  # Files to always review
  always_review:
    - "**/*.env*"
    - "**/secrets/**"
    - "**/auth/**"
    - "**/security/**"

  # Files to skip in review
  skip_review:
    - "**/*.lock"
    - "**/generated/**"
    - "**/vendor/**"
    - "**/node_modules/**"

# =============================================================================
# DEPLOYMENT SETTINGS
# =============================================================================
deploy:
  # Deployment provider: vercel | netlify | aws | railway | none
  provider: vercel

  # Branch that triggers production deploy
  production_branch: main

  # Enable preview deployments for PRs
  preview_on_pr: true

  # Auto-deploy on merge to production branch
  auto_deploy: true

  # Environment variables to check before deploy
  required_env_vars: []

  # Pre-deploy checks
  pre_deploy_checks:
    - test
    - build
    - lint

  # Post-deploy actions
  post_deploy:
    notify_slack: false
    run_smoke_tests: false

# =============================================================================
# GIT HOOKS SETTINGS
# =============================================================================
hooks:
  # Pre-commit hook
  pre_commit:
    enabled: true
    actions:
      - lint           # Run linter
      - type-check     # TypeScript/Flow check
      - format         # Auto-format code
    fail_fast: true    # Stop on first failure

  # Commit message validation
  commit_msg:
    enabled: true
    validate_conventional: true
    max_length: 72

  # Pre-push hook
  pre_push:
    enabled: true
    actions:
      - test           # Run tests
      - security-scan  # Security audit
    skip_on_ci: true   # Skip when running in CI

  # Post-merge hook
  post_merge:
    enabled: false
    actions:
      - install        # npm/yarn install
      - migrate        # Database migrations

# =============================================================================
# FEATURE FLAGS SETTINGS
# =============================================================================
feature_flags:
  # Provider: none | vercel-edge | launchdarkly | unleash | flagsmith
  provider: none

  # Default state for new flags
  default_state: false

  # Flag naming convention
  naming_convention: "kebab-case"  # kebab-case | snake_case | camelCase

  # Require flag for incomplete features
  require_for_wip: true

# =============================================================================
# TESTING AUTOMATION SETTINGS
# =============================================================================
testing:
  # Enforcement level: soft | standard | strict
  enforcement:
    level: standard

  # Auto-generate test tasks when creating features
  auto_generate_tasks: true

  # Coverage gates (minimum thresholds)
  coverage_gates:
    unit:
      minimum: 80        # Block if below
      target: 90         # Goal to achieve
      excellent: 95      # Exceptional
    integration:
      minimum: 60
      target: 75
    branch:
      minimum: 70
      target: 80
    overall:
      minimum: 75
      target: 85

  # Required test types for all features
  required_test_types:
    - unit
    - integration

  # Optional test types (generated when applicable)
  optional_test_types:
    - e2e
    - security
    - performance
    - contract

  # Blocking behavior
  blocking:
    on_test_failure: true
    on_coverage_below_minimum: true
    on_missing_test_types: true

  # Override settings
  overrides:
    allow_emergency: true
    require_approval: true
    log_all_overrides: true

# =============================================================================
# CI/CD INTEGRATION
# =============================================================================
ci:
  # CI provider: github-actions | gitlab-ci | circleci | jenkins
  provider: github-actions

  # Required status checks before merge
  required_checks:
    - build
    - test
    - lint
    - coverage  # Added coverage check

  # Allow merge with failing checks (not recommended)
  allow_failing_checks: false
```

## Workflow Types

### Trunk-Based Development

Best for: Teams practicing continuous deployment, small PRs, feature flags.

```yaml
git:
  workflow: trunk-based
  main_branch: main
  max_branch_age_days: 2
  delete_branch_on_merge: true

feature_flags:
  provider: vercel-edge
  require_for_wip: true
```

**Characteristics:**
- Single main branch
- Short-lived feature branches (< 2 days)
- Feature flags for incomplete work
- Continuous deployment to production
- Small, frequent commits

### GitHub Flow

Best for: Teams with regular releases, code review focus.

```yaml
git:
  workflow: github-flow
  main_branch: main
  max_branch_age_days: 7
  delete_branch_on_merge: true
```

**Characteristics:**
- Main branch always deployable
- Feature branches for all changes
- PR-based code review
- Deploy after merge

### GitFlow

Best for: Teams with scheduled releases, multiple environments.

```yaml
git:
  workflow: gitflow
  main_branch: main
  develop_branch: develop
  branch_prefix:
    feature: "feature/"
    release: "release/"
    hotfix: "hotfix/"
```

**Characteristics:**
- Main and develop branches
- Feature branches from develop
- Release branches for staging
- Hotfix branches for urgent fixes

## Command Integration

### How Commands Use Config

All OMGKIT git commands automatically read from `.omgkit/workflow.yaml`:

```bash
# /git:commit reads commit settings
git:
  commit:
    conventional: true
    allowed_types: [feat, fix, ...]

# /git:pr reads PR settings
git:
  pr:
    template: auto
    require_review: true
    labels: ...

# /dev:review reads review settings
git:
  review:
    auto_review: true
    checks: [security, performance, ...]
```

### Config Precedence

1. Command-line arguments (highest priority)
2. `.omgkit/workflow.yaml` settings
3. Default values (lowest priority)

## Initialization

### Quick Start

```bash
# Initialize with interactive setup
/workflow:init

# Initialize with specific workflow
/workflow:init --workflow=trunk-based

# Initialize with all defaults
/workflow:init --defaults
```

### Manual Setup

Create `.omgkit/workflow.yaml` manually:

```yaml
version: "1.0"

git:
  workflow: trunk-based
  main_branch: main

commit:
  conventional: true

pr:
  require_review: true

review:
  auto_review: true
```

## Validation

The config is validated on every command:

```bash
# Check config validity
/workflow:status

# Output:
# Workflow Config Status
# ----------------------
# File: .omgkit/workflow.yaml
# Valid: Yes
# Workflow: trunk-based
# Main Branch: main
# Hooks: pre-commit, commit-msg, pre-push
# Review: auto (security, performance, best-practices)
```

## Best Practices

### For Trunk-Based Development

1. **Keep branches short-lived**
   ```yaml
   git:
     max_branch_age_days: 2
   ```

2. **Enable feature flags**
   ```yaml
   feature_flags:
     provider: vercel-edge
     require_for_wip: true
   ```

3. **Auto-review on PR**
   ```yaml
   review:
     auto_review: true
     trigger: on_pr
   ```

4. **Squash merges**
   ```yaml
   pr:
     squash_merge: true
   ```

### For Team Collaboration

1. **Enforce conventional commits**
   ```yaml
   commit:
     conventional: true
     require_scope: true
   ```

2. **Require reviews**
   ```yaml
   pr:
     require_review: true
     min_reviewers: 2
   ```

3. **Block on critical issues**
   ```yaml
   review:
     block_on_critical: true
   ```

### For CI/CD

1. **Required checks**
   ```yaml
   ci:
     required_checks:
       - build
       - test
       - lint
   ```

2. **Pre-deploy validation**
   ```yaml
   deploy:
     pre_deploy_checks:
       - test
       - build
   ```

## Migration Guide

### From No Config

1. Run `/workflow:init`
2. Review generated config
3. Commit `.omgkit/workflow.yaml`
4. Team syncs and starts using

### From .github/workflows

Keep existing workflows, add OMGKIT config for local development:

```yaml
# .omgkit/workflow.yaml complements .github/workflows
ci:
  provider: github-actions
  # Existing workflows continue to work
```

## Troubleshooting

### Config Not Found

```
Warning: No workflow config found at .omgkit/workflow.yaml
Using default settings. Run /workflow:init to create config.
```

### Invalid Config

```
Error: Invalid workflow config
- git.workflow must be one of: trunk-based, gitflow, github-flow
- commit.max_subject_length must be a number
Run /workflow:status for details.
```

### Hook Not Running

1. Check hooks are enabled in config
2. Run `/hooks:setup` to regenerate hooks
3. Verify `.git/hooks/` permissions

## Related Skills

- `devops/git-hooks` - Git hooks setup and management
- `devops/feature-flags` - Feature flag implementation
- `devops/github-actions` - CI/CD workflows
- `methodology/finishing-development-branch` - Branch completion patterns
