---
name: Verify Done
description: Verify all test requirements are met before marking a task or feature as complete. Checks test existence, coverage, and passing status.
category: quality
related_skills:
  - methodology/test-enforcement
  - methodology/test-task-generation
  - methodology/verification-before-completion
related_commands:
  - /quality:coverage-check
  - /quality:test-plan
  - /dev:test
allowed-tools: Read, Bash, Grep, Glob
---

# /quality:verify-done

Verify that all test requirements are satisfied before marking work as done.

## Usage

```bash
/quality:verify-done [task-id]
/quality:verify-done --all
/quality:verify-done --feature <feature-name>
```

## What It Checks

### 1. Test Existence
- Unit tests exist for changed files
- Integration tests for API/DB changes
- Test files follow naming conventions

### 2. Test Execution
- All tests pass (no failures)
- No skipped tests for critical paths
- No flaky tests detected

### 3. Coverage Requirements
- Unit coverage meets minimum (default: 80%)
- Branch coverage meets minimum (default: 70%)
- Overall coverage meets threshold

### 4. Test Quality
- Tests are meaningful (not empty)
- Assertions present
- Edge cases covered

## Output Format

```
╔══════════════════════════════════════════════════════════════╗
║                    VERIFY DONE REPORT                         ║
╚══════════════════════════════════════════════════════════════╝

Task: TASK-042 - Implement user profile API
Status: ❌ BLOCKED

┌─────────────────────────────────────────────────────────────┐
│ Test Existence                                               │
├─────────────────────────────────────────────────────────────┤
│ ✅ Unit tests found: tests/unit/user.test.ts                │
│ ✅ Integration tests found: tests/integration/user.int.ts   │
│ ⚠️  E2E tests: Not found (optional)                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Test Results                                                 │
├─────────────────────────────────────────────────────────────┤
│ Total: 24 | Passed: 23 | Failed: 1 | Skipped: 0            │
│ ❌ FAILING: user.test.ts > should validate email format     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Coverage                                                     │
├─────────────────────────────────────────────────────────────┤
│ Lines:     78% ████████░░ (min: 80%) ❌                      │
│ Branches:  72% ███████░░░ (min: 70%) ✅                      │
│ Functions: 85% █████████░ (min: 80%) ✅                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Blocking Issues                                              │
├─────────────────────────────────────────────────────────────┤
│ 1. ❌ Test failure: user.test.ts line 45                    │
│ 2. ❌ Line coverage 78% below minimum 80%                   │
│    Uncovered: src/handlers/user.ts:52-58                    │
└─────────────────────────────────────────────────────────────┘

Action Required:
  1. Fix failing test in user.test.ts
  2. Add tests for lines 52-58 in user.ts

Run: npm test -- --watch to fix issues
```

## Configuration

Reads from `.omgkit/workflow.yaml`:

```yaml
testing:
  enforcement:
    level: standard
  coverage_gates:
    unit:
      minimum: 80
    integration:
      minimum: 60
  blocking:
    on_test_failure: true
    on_coverage_below_minimum: true
```

## Exit Codes

- `0`: All requirements met, can mark as done
- `1`: Blocking issues found, cannot complete
- `2`: Warnings only, can complete with acknowledgment

## Examples

### Check specific task
```bash
/quality:verify-done TASK-042
```

### Check all pending tasks
```bash
/quality:verify-done --all
```

### Check entire feature
```bash
/quality:verify-done --feature user-profile
```

## Integration

Works with:
- `/dev:feature-tested` - Generates tasks with test requirements
- `/quality:coverage-check` - Detailed coverage analysis
- `/sprint:sprint-end` - Validates all sprint tasks
