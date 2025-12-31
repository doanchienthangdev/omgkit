---
description: Comprehensive code review workflow
allowed-tools: Task, Read, Grep, Glob
argument-hint: <file or directory to review>
---

# Code Review Workflow

Review: **$ARGUMENTS**

## Workflow Steps

### Step 1: Code Analysis
**Agent:** @code-reviewer
**Command:** `/dev:review $ARGUMENTS`

- Review code quality
- Check naming conventions
- Verify code structure
- Assess complexity

### Step 2: Security Review
**Agent:** @security-auditor
**Command:** `/quality:security-scan`

- Check for vulnerabilities
- OWASP Top 10 review
- Input validation check
- Authentication/authorization review

### Step 3: Test Review
**Agent:** @tester

- Review test coverage
- Check test quality
- Identify missing tests
- Verify edge cases

### Step 4: Documentation
**Agent:** @code-reviewer

- Compile review findings
- Prioritize issues
- Create actionable feedback

## Progress Tracking
- [ ] Step 1: Code quality reviewed
- [ ] Step 2: Security reviewed
- [ ] Step 3: Tests reviewed
- [ ] Step 4: Review documented

Execute each step. Compile comprehensive review report.
