---
name: Automated Testing Workflow
description: End-to-end testing automation workflow that generates test plans, creates test tasks, executes tests, and enforces coverage gates before completion.
category: testing
complexity: medium
estimated-time: 1-3 hours
agents:
  - planner
  - tester
  - code-reviewer
  - fullstack-developer
skills:
  - methodology/test-task-generation
  - methodology/test-enforcement
  - testing/comprehensive-testing
  - testing/vitest
  - testing/playwright
commands:
  - /quality:test-plan
  - /quality:verify-done
  - /quality:coverage-check
  - /dev:feature-tested
  - /dev:test
prerequisites:
  - Testing framework configured (Vitest, Jest, Pytest, etc.)
  - Coverage tool configured
  - Workflow config with testing section
---

# Automated Testing Workflow

## Overview

This workflow automates the entire testing lifecycle from test planning through execution and verification. It ensures comprehensive test coverage by automatically generating test tasks, enforcing coverage gates, and blocking completion until all requirements are met.

## Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                  AUTOMATED TESTING WORKFLOW                      │
└─────────────────────────────────────────────────────────────────┘

  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
  │ ANALYZE  │───▶│  PLAN    │───▶│ EXECUTE  │───▶│  VERIFY  │
  └──────────┘    └──────────┘    └──────────┘    └──────────┘
       │               │               │               │
       ▼               ▼               ▼               ▼
  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
  │ Feature  │    │ Test     │    │ Run      │    │ Check    │
  │ Analysis │    │ Tasks    │    │ Tests    │    │ Coverage │
  └──────────┘    └──────────┘    └──────────┘    └──────────┘
       │               │               │               │
       ▼               ▼               ▼               ▼
  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
  │ Test     │    │ Write    │    │ Fix      │    │ Mark     │
  │ Strategy │    │ Tests    │    │ Failures │    │ Done     │
  └──────────┘    └──────────┘    └──────────┘    └──────────┘
```

## Steps

### Step 1: Analyze Feature

**Agent:** planner
**Purpose:** Understand the feature and determine testing strategy.

**Actions:**
1. Read feature requirements
2. Identify code changes
3. Classify feature type (API, UI, logic, etc.)
4. Determine required test types
5. Set coverage targets

**Output:**
```yaml
feature_analysis:
  type: api_endpoint
  files_changed:
    - src/handlers/user.ts
    - src/services/userService.ts
  required_tests:
    - unit
    - integration
    - contract
  optional_tests:
    - security
    - performance
  coverage_target: 90%
```

---

### Step 2: Generate Test Plan

**Agent:** planner
**Purpose:** Create comprehensive test plan with all test cases.

**Actions:**
1. Generate test cases for each test type
2. Define acceptance criteria
3. Identify test file locations
4. Estimate effort
5. Create test task backlog

**Output:**
```markdown
## Test Plan

### Unit Tests (12 cases)
- Handler validation tests
- Service logic tests
- Error handling tests

### Integration Tests (6 cases)
- Full API request/response
- Database operations
- External service calls

### Contract Tests (4 cases)
- Request schema validation
- Response schema validation
- Error response format
```

---

### Step 3: Create Test Tasks

**Agent:** planner
**Purpose:** Generate actionable test tasks in todo list.

**Actions:**
1. Create test tasks from plan
2. Link to implementation tasks
3. Set priorities
4. Define acceptance criteria per task
5. Add to sprint backlog

**Output:**
```
Todo List Updated:
☐ TEST-001: Unit tests for user handler (P1)
☐ TEST-002: Unit tests for user service (P1)
☐ TEST-003: Integration tests for user API (P1)
☐ TEST-004: Contract tests for user schema (P2)
☐ TEST-005: Security tests for user endpoints (P2)
```

---

### Step 4: Write Tests

**Agent:** tester
**Purpose:** Implement all test cases.

**Actions:**
1. Create test files
2. Write test cases
3. Add assertions
4. Configure mocks
5. Verify tests run

**Quality Checks:**
- Tests follow naming conventions
- Assertions are meaningful
- Mocks are properly isolated
- Edge cases covered
- Error cases tested

---

### Step 5: Execute Tests

**Agent:** tester
**Purpose:** Run all tests and collect results.

**Actions:**
1. Run unit tests
2. Run integration tests
3. Run contract tests
4. Run security tests (if applicable)
5. Collect coverage data

**Commands:**
```bash
npm test                    # All tests
npm run test:coverage       # With coverage
npm run test:integration    # Integration only
```

---

### Step 6: Analyze Results

**Agent:** tester
**Purpose:** Review test results and identify issues.

**Actions:**
1. Check for failures
2. Identify flaky tests
3. Review coverage gaps
4. Prioritize fixes
5. Update test tasks

**Output:**
```
Test Results:
✅ Unit: 45/45 passed
❌ Integration: 8/10 passed (2 failed)
✅ Contract: 6/6 passed

Coverage:
- Lines: 82%
- Branches: 75%
- Functions: 90%
```

---

### Step 7: Fix Failures

**Agent:** fullstack-developer / tester
**Purpose:** Address test failures and coverage gaps.

**Actions:**
1. Debug failing tests
2. Fix implementation bugs
3. Add missing tests
4. Improve coverage
5. Re-run tests

**Loop:** Repeat Steps 5-7 until all pass

---

### Step 8: Verify Completion

**Agent:** code-reviewer
**Purpose:** Final verification before marking done.

**Actions:**
1. Run `/quality:verify-done`
2. Check all gates passed
3. Review test quality
4. Approve completion
5. Mark feature as done

**Final Check:**
```
/quality:verify-done FEAT-042

✅ All tests passing (65/65)
✅ Coverage 92% ≥ 90% target
✅ No security vulnerabilities
✅ All test tasks complete
✅ Code review approved

→ Feature FEAT-042 marked as DONE
```

---

## Quality Gates

| Gate | Minimum | Target | Blocking |
|------|---------|--------|----------|
| Unit Coverage | 80% | 90% | Yes |
| Integration Coverage | 60% | 75% | Yes |
| All Tests Pass | 100% | 100% | Yes |
| No Skipped Critical | 100% | 100% | Yes |
| Security Scan | Pass | Pass | Yes |
| Mutation Score | 50% | 75% | No |

---

## Configuration

### Via workflow.yaml

Add to `.omgkit/workflow.yaml`:

```yaml
testing:
  enabled: true
  enforcement:
    level: standard  # soft | standard | strict

  auto_generate_tasks: true

  coverage_gates:
    unit:
      minimum: 80
      target: 90
    integration:
      minimum: 60
      target: 75
    overall:
      minimum: 75
      target: 85

  required_test_types:
    - unit
    - integration

  optional_test_types:
    - e2e
    - security
    - performance

  blocking:
    on_test_failure: true
    on_coverage_below_minimum: true
```

### Via CLI

```bash
# Set enforcement level
omgkit config set testing.enforcement.level strict

# Enable auto-generation
omgkit config set testing.auto_generate_tasks true

# View testing config
omgkit config list testing
```

### Command Options

| Option | Description | Example |
|--------|-------------|---------|
| `--no-test` | Skip test enforcement | `/dev:feature "login" --no-test` |
| `--test-level <level>` | Override enforcement level | `/dev:feature "auth" --test-level strict` |
| `--coverage <percent>` | Override coverage minimum | `/dev:test "src/" --coverage 95` |
| `--test-types <types>` | Specify test types | `/dev:test "api/" --test-types unit,integration` |

---

## Agent Handoff Protocol

### planner → tester
```yaml
handoff:
  test_plan: "Full test plan with cases"
  test_tasks: "Created in todo list"
  priorities: "P1 tests first"
  coverage_targets: "90% for this feature"
```

### tester → code-reviewer
```yaml
handoff:
  test_results: "All 65 tests passing"
  coverage_report: "92% coverage achieved"
  test_files: "List of created test files"
  notes: "Edge cases for retry logic added"
```

---

## Troubleshooting

### Tests Won't Pass

1. Check test isolation (no shared state)
2. Verify mocks are correct
3. Check async/await handling
4. Review test environment setup

### Coverage Too Low

1. Identify uncovered lines
2. Add edge case tests
3. Add error path tests
4. Check branch coverage

### Flaky Tests

1. Remove timing dependencies
2. Use proper async patterns
3. Isolate external services
4. Add retry logic for CI

---

## Quick Commands

| Phase | Command |
|-------|---------|
| Plan | `/quality:test-plan` |
| Create | `/dev:feature-tested` |
| Execute | `/dev:test` |
| Coverage | `/quality:coverage-check` |
| Verify | `/quality:verify-done` |

---

## Related Workflows

- [Comprehensive Testing](./comprehensive-testing.md) - 4D testing approach
- [Test-Driven Development](./test-driven-development.md) - TDD workflow
- [Security Hardening](./security-hardening.md) - Security testing focus
