---
description: Systematic debugging and bug resolution workflow
allowed-tools: Task, Read, Write, Edit, Bash, Grep, Glob
argument-hint: <bug description>
---

# Bug Fix Workflow

Fix bug: **$ARGUMENTS**

## Workflow Steps

### Step 1: Bug Analysis
**Agent:** @debugger

- Reproduce the bug
- Identify symptoms
- Gather error logs
- Document reproduction steps

### Step 2: Root Cause Investigation
**Agent:** @debugger
**Command:** `/dev:fix-hard "$ARGUMENTS"`

- Trace code execution
- Identify root cause
- Document findings
- Propose fix approach

### Step 3: Fix Implementation
**Agent:** @fullstack-developer

- Implement the fix
- Handle edge cases
- Add defensive code
- Update documentation

### Step 4: Regression Testing
**Agent:** @tester
**Command:** `/dev:test`

- Write test for the bug
- Ensure fix doesn't break existing tests
- Add edge case tests
- Verify fix works

### Step 5: Code Review & Commit
**Agent:** @code-reviewer, @git-manager

- Review the fix
- Verify completeness
- Commit with reference to bug

## Progress Tracking
- [ ] Step 1: Bug analyzed and reproduced
- [ ] Step 2: Root cause identified
- [ ] Step 3: Fix implemented
- [ ] Step 4: Tests passing
- [ ] Step 5: Reviewed and committed

Execute each step sequentially. Show progress after each step.
