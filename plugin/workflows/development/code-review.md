---
name: code-review
description: Review and improve code quality
category: development
complexity: low
estimated-time: 30min-2 hours
agents:
  - code-reviewer
  - fullstack-developer
  - git-manager
skills:
  - verification-before-completion
commands:
  - /dev:review
  - /dev:fix
  - /git:commit
prerequisites:
  - Code changes to review
---

# Code Review Workflow

## Overview

The Code Review workflow provides thorough code review with actionable feedback and improvement implementation.

## When to Use

- Before merging PRs
- After feature completion
- For code quality improvement
- Learning from code

## Steps

### Step 1: Review
**Agent:** code-reviewer
**Command:** `/dev:review`
**Duration:** 15-45 minutes

Review code:
- Architecture review
- Code quality check
- Security analysis
- Performance review
- Best practices

**Output:** Review comments

### Step 2: Fix Issues
**Agent:** fullstack-developer
**Command:** `/dev:fix`
**Duration:** 15-60 minutes

Address feedback:
- Implement fixes
- Improve code
- Update tests
- Refactor as needed

**Output:** Improved code

### Step 3: Commit
**Agent:** git-manager
**Command:** `/git:commit`
**Duration:** 5-10 minutes

Commit changes:
- Stage changes
- Write message
- Create commit

**Output:** Changes committed

## Quality Gates

- [ ] All review comments addressed
- [ ] Code improvements implemented
- [ ] Tests passing
- [ ] Changes committed

## Review Checklist

```
Code Review Checklist
=====================
FUNCTIONALITY:
[ ] Code does what it should
[ ] Edge cases handled
[ ] Error handling proper

QUALITY:
[ ] Clean and readable
[ ] DRY principles
[ ] Proper naming
[ ] Well structured

SECURITY:
[ ] No vulnerabilities
[ ] Input validated
[ ] Auth/authz proper

PERFORMANCE:
[ ] Efficient algorithms
[ ] No memory leaks
[ ] Queries optimized
```

## Example Usage

```bash
/workflow:code-review
/dev:review "focus on security"
```

## Related Workflows

- `feature` - For full feature dev
- `security-audit` - For security focus
