---
description: Complete feature development from planning to deployment
allowed-tools: Task, Read, Write, Edit, Bash, Grep, Glob
argument-hint: <feature description>
---

# Feature Development Workflow

Build feature: **$ARGUMENTS**

## Workflow Steps

### Step 1: Planning
**Agent:** @planner
**Command:** `/planning:plan "$ARGUMENTS"`

- Analyze feature requirements
- Break down into implementable tasks
- Create detailed implementation plan
- Define acceptance criteria
- Identify dependencies and risks

### Step 2: Implementation
**Agent:** @fullstack-developer
**Command:** `/dev:feature "$ARGUMENTS"`

- Follow the implementation plan
- Write code incrementally
- Add inline documentation
- Follow coding standards

### Step 3: Testing
**Agent:** @tester
**Command:** `/dev:test`

- Write unit tests for new code
- Write integration tests
- Achieve coverage target (>80%)
- Run all tests and fix failures

### Step 4: Code Review
**Agent:** @code-reviewer
**Command:** `/dev:review`

- Review code quality
- Check for security issues
- Verify best practices
- Suggest improvements

### Step 5: Commit & PR
**Agent:** @git-manager
**Command:** `/git:pr`

- Create feature branch
- Stage and commit changes
- Write meaningful commit message
- Create pull request

## Progress Tracking
- [ ] Step 1: Planning complete
- [ ] Step 2: Implementation complete
- [ ] Step 3: Tests passing (>80% coverage)
- [ ] Step 4: Code review approved
- [ ] Step 5: PR created

## Quality Gates
- [ ] Implementation plan approved
- [ ] All code follows project standards
- [ ] Test coverage exceeds 80%
- [ ] No security vulnerabilities
- [ ] Code review passed

Execute each step sequentially. Show progress after each step.
