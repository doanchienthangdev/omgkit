---
description: Code refactoring and improvement workflow
allowed-tools: Task, Read, Write, Edit, Bash, Grep, Glob
argument-hint: <refactor scope>
---

# Refactor Workflow

Refactor: **$ARGUMENTS**

## Workflow Steps

### Step 1: Analysis
**Agent:** @code-reviewer

- Identify code smells
- Document current issues
- Propose improvements
- Assess risk

### Step 2: Test Coverage
**Agent:** @tester

- Ensure existing tests pass
- Add tests for uncovered code
- Create safety net for refactoring

### Step 3: Refactoring
**Agent:** @fullstack-developer
**Command:** `/quality:refactor`

- Apply refactoring patterns
- Improve code structure
- Enhance readability
- Remove duplication

### Step 4: Validation
**Agent:** @tester
**Command:** `/dev:test`

- Run all tests
- Verify no regressions
- Check performance impact

### Step 5: Review & Commit
**Agent:** @code-reviewer, @git-manager

- Review changes
- Verify improvements
- Commit with clear message

## Progress Tracking
- [ ] Step 1: Analysis complete
- [ ] Step 2: Test coverage adequate
- [ ] Step 3: Refactoring complete
- [ ] Step 4: All tests passing
- [ ] Step 5: Reviewed and committed

Execute each step sequentially. Show progress after each step.
