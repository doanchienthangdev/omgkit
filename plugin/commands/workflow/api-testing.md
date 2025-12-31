---
description: Comprehensive API testing workflow
allowed-tools: Task, Read, Write, Edit, Bash, Grep, Glob
argument-hint: <API to test>
---

# API Testing Workflow

Test API: **$ARGUMENTS**

## Workflow Steps

### Step 1: Test Planning
**Agent:** @tester

- Review API spec
- Identify test cases
- Plan coverage
- Set up environment

### Step 2: Functional Testing
**Agent:** @tester
**Command:** `/dev:test`

- Test all endpoints
- Verify responses
- Check error handling
- Test edge cases

### Step 3: Contract Testing
**Agent:** @tester

- Validate against schema
- Check backwards compatibility
- Test versioning
- Verify contracts

### Step 4: Performance Testing
**Agent:** @tester

- Load testing
- Stress testing
- Measure latency
- Identify bottlenecks

### Step 5: Security Testing
**Agent:** @security-auditor

- Authentication tests
- Authorization tests
- Input validation
- Security headers

## Progress Tracking
- [ ] Tests planned
- [ ] Functional tests pass
- [ ] Contracts validated
- [ ] Performance tested
- [ ] Security verified

Execute thoroughly. API reliability matters.
