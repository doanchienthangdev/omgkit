---
name: Trunk-Based Development Workflow
description: Complete trunk-based development workflow from feature branch creation to production deployment, with Claude code review and feature flags integration.
category: git
complexity: medium
estimated-time: 2-4 hours
agents:
  - git-manager
  - code-reviewer
  - tester
  - fullstack-developer
skills:
  - devops/workflow-config
  - devops/git-hooks
  - devops/feature-flags
  - methodology/finishing-development-branch
commands:
  - /workflow:trunk-based
  - /git:commit
  - /git:pr
  - /dev:review
  - /dev:test
prerequisites:
  - Workflow config initialized (.omgkit/workflow.yaml)
  - Git repository configured
  - CI/CD pipeline setup (GitHub Actions)
  - Deployment provider connected (Vercel)
---

# Trunk-Based Development Workflow

## Overview

This workflow implements trunk-based development practices used by Google, Netflix, and other BigTech companies. It emphasizes:

- **Single main branch** - All code flows through `main`
- **Short-lived feature branches** - Max 1-2 days
- **Feature flags** - Hide incomplete features
- **Continuous integration** - Merge frequently
- **Automated review** - Claude reviews every PR

## Prerequisites

1. **Workflow config** - `.omgkit/workflow.yaml` with trunk-based settings
2. **CI/CD** - GitHub Actions or similar
3. **Deployment** - Vercel, Netlify, or similar

## Steps

### Step 1: Start Feature

**Objective:** Create a short-lived feature branch with proper naming.

**Steps:**

1. Ensure you're on latest main:
   ```bash
   git checkout main
   git pull origin main
   ```

2. Create feature branch:
   ```bash
   git checkout -b feature/short-description
   ```

3. Set branch tracking (automatic with config):
   - Branch age monitoring starts
   - Max age: 2 days (configurable)

**Config Integration:**
```yaml
git:
  branch_prefix:
    feature: "feature/"
  max_branch_age_days: 2
```

**Validation:**
- Branch name follows convention
- Main branch is up to date
- No uncommitted changes

---

### Step 2: Development

**Objective:** Make small, frequent commits with proper conventions.

**Steps:**

1. Make changes (small, focused)

2. Run pre-commit checks:
   ```bash
   /hooks:run pre-commit
   ```

3. Commit with conventional format:
   ```bash
   /git:commit
   # or
   git commit -m "feat: add user authentication"
   ```

4. Repeat for each logical change

**Config Integration:**
```yaml
commit:
  conventional: true
  allowed_types: [feat, fix, docs, ...]

hooks:
  pre_commit:
    actions: [lint, format, type-check]
```

**Best Practices:**
- Commit every 1-2 hours
- Each commit should be deployable
- Use feature flags for incomplete features

---

### Step 3: Feature Flags (If Needed)

**Objective:** Use feature flags to safely merge incomplete code.

**When to Use:**
- Feature takes > 1 day
- Breaking changes
- Gradual rollout needed

**Implementation:**

1. Create flag:
   ```typescript
   // With Vercel Edge Config
   const showNewFeature = await get('new-feature-enabled');

   if (showNewFeature) {
     return <NewFeature />;
   }
   return <OldFeature />;
   ```

2. Deploy with flag off

3. Test in production

4. Gradually enable (1% → 10% → 50% → 100%)

5. Remove flag after full rollout

**Config Integration:**
```yaml
feature_flags:
  provider: vercel-edge
  require_for_wip: true
```

---

### Step 4: Pre-Push Checks

**Objective:** Ensure code quality before pushing.

**Steps:**

1. Run tests:
   ```bash
   /dev:test
   # or
   npm test
   ```

2. Run security scan:
   ```bash
   /quality:security-scan
   ```

3. Verify build:
   ```bash
   npm run build
   ```

4. Push to remote:
   ```bash
   git push -u origin feature/short-description
   ```

**Config Integration:**
```yaml
hooks:
  pre_push:
    actions: [test, security-scan, build]
```

**Automatic with Hooks:**
All checks run automatically on `git push` if hooks are enabled.

---

### Step 5: Create Pull Request

**Objective:** Open PR with proper template and labels.

**Steps:**

1. Create PR:
   ```bash
   /git:pr
   ```

2. Auto-generated content:
   - Title from branch/commits
   - Description from template
   - Labels from file paths
   - Assigned to author

3. Preview deployment triggers (Vercel)

**Config Integration:**
```yaml
pr:
  template: auto
  labels:
    by_path:
      "src/api/**": ["backend"]
    by_branch:
      "feature/": ["enhancement"]
```

---

### Step 6: Code Review

**Objective:** Get automated and human review.

**Steps:**

1. **Claude Auto-Review** (triggers on PR):
   ```bash
   /dev:review
   ```

   Checks:
   - Security vulnerabilities
   - Performance issues
   - Best practices
   - Test coverage

2. **Address feedback:**
   - Fix critical issues (required)
   - Consider suggestions
   - Respond to comments

3. **Human review:**
   - Assign reviewer
   - Discuss architecture
   - Approve changes

**Config Integration:**
```yaml
review:
  auto_review: true
  checks: [security, performance, best-practices]
  block_on_critical: true
```

---

### Step 7: Merge and Deploy

**Objective:** Merge to main and deploy to production.

**Steps:**

1. Ensure all checks pass:
   - CI builds green
   - Tests passing
   - Review approved
   - No merge conflicts

2. Squash merge:
   ```bash
   # Via GitHub UI or
   gh pr merge --squash
   ```

3. Auto-deployment triggers:
   - Vercel deploys to production
   - Preview environments cleaned up

4. Delete feature branch (automatic with config)

**Config Integration:**
```yaml
pr:
  squash_merge: true

git:
  delete_branch_on_merge: true

deploy:
  auto_deploy: true
  production_branch: main
```

---

### Step 8: Post-Deploy Verification

**Objective:** Verify deployment success.

**Steps:**

1. Check deployment status:
   - Vercel dashboard
   - Health endpoints

2. Run smoke tests (if configured)

3. Monitor for errors:
   - Error tracking (Sentry)
   - Logs
   - Metrics

4. Rollback if needed:
   - Revert commit
   - Or disable feature flag

---

## Quality Gates

- [ ] Branch follows naming convention (feature/*, fix/*, hotfix/*)
- [ ] Branch age is within limit (< 2 days for trunk-based)
- [ ] All pre-commit checks pass (lint, format, type-check)
- [ ] Commit messages follow conventional commits format
- [ ] All tests pass (unit, integration)
- [ ] No security vulnerabilities detected
- [ ] Claude code review passed (no critical issues)
- [ ] Human review approved
- [ ] CI/CD pipeline green
- [ ] Preview deployment verified
- [ ] Squash merge completed
- [ ] Production deployment successful
- [ ] Post-deploy smoke tests pass

---

## Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    TRUNK-BASED WORKFLOW                         │
└─────────────────────────────────────────────────────────────────┘

  main ──────●────────●────────●────────●────────●────────●──────►
             │        ▲        │        ▲        │        ▲
             │        │        │        │        │        │
  feature/a  └──●──●──┘        │        │        │        │
                (1-2 days)     │        │        │        │
                               │        │        │        │
  feature/b                    └──●──●──┘        │        │
                                  (1-2 days)     │        │
                                                 │        │
  feature/c                                      └──●──●──┘
                                                    (1-2 days)

  Legend:
  ● = commit
  ▲ = merge to main (squash)
  → = continuous deployment
```

## Quick Commands

| Phase | Command | Description |
|-------|---------|-------------|
| Start | `git checkout -b feature/x` | Create branch |
| Dev | `/git:commit` | Commit changes |
| Dev | `/hooks:run pre-commit` | Run checks |
| Push | `git push -u origin feature/x` | Push branch |
| PR | `/git:pr` | Create PR |
| Review | `/dev:review` | Claude review |
| Merge | `gh pr merge --squash` | Merge PR |

## Automation Summary

With proper config, the following happens automatically:

| Action | Trigger | What Happens |
|--------|---------|--------------|
| Lint/Format | Pre-commit | Code formatted, lint errors shown |
| Commit validation | Commit | Conventional format enforced |
| Tests | Pre-push | Test suite runs |
| Preview deploy | PR created | Vercel creates preview |
| Auto-review | PR created | Claude reviews code |
| Labels | PR created | Labels applied from paths |
| Prod deploy | Merge to main | Vercel deploys to prod |
| Branch cleanup | After merge | Branch deleted |

## Troubleshooting

### Branch Too Old

```
Warning: Branch feature/x is 3 days old (max: 2 days)
Consider: Split into smaller PRs or use feature flags
```

**Solutions:**
1. Merge what's ready with feature flag
2. Split into multiple PRs
3. Extend deadline in config (not recommended)

### Merge Conflicts

```
Error: Cannot merge - conflicts with main
```

**Solutions:**
1. Rebase on main: `git rebase main`
2. Resolve conflicts
3. Force push: `git push --force-with-lease`

### Failed Review

```
Error: Critical security issue found - blocking merge
```

**Solutions:**
1. Fix the issue
2. Push new commit
3. Re-request review

## Related Workflows

- `git/github-flow` - Simpler workflow without feature flags
- `git/gitflow` - Traditional release-based workflow
- `security/security-audit` - Deep security review
- `quality/comprehensive-testing` - Full test coverage
