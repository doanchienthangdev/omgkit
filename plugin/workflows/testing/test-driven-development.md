---
name: testing/test-driven-development
description: Test-Driven Development workflow with red-green-refactor cycle and enforced test-first methodology
category: testing
complexity: medium
agents:
  - tester
  - fullstack-developer
  - code-reviewer
skills:
  - methodology/test-driven-development
  - methodology/test-enforcement
  - testing/comprehensive-testing
  - testing/property-testing
  - testing/vitest
commands:
  - /dev:tdd
  - /dev:test
  - /dev:test-write
  - /dev:feature-tested
  - /quality:verify-done
testing:
  default: true
  configurable: false
tags:
  - testing
  - tdd
  - methodology
  - development
---

# Test-Driven Development Workflow

Systematic TDD workflow following the red-green-refactor cycle.

## Overview

This workflow implements Test-Driven Development where:
1. **Red** - Write a failing test first
2. **Green** - Write minimal code to pass
3. **Refactor** - Improve code while tests pass

## Steps

1. **Analyze**: Break down feature into testable behaviors
2. **Red**: Write a failing test first
3. **Green**: Write minimal code to pass the test
4. **Refactor**: Improve code while tests pass
5. **Iterate**: Add more tests and repeat
6. **Integrate**: Run full test suite and commit

## Workflow Phases

### Phase 1: Requirement Analysis
1. Break down feature into testable behaviors
2. Identify edge cases and error conditions
3. Define expected inputs and outputs
4. Prioritize test cases by importance

### Phase 2: Red Phase - Write Failing Test
1. Write the simplest test that fails
2. Verify test fails for the right reason
3. Ensure test is readable and descriptive
4. Add assertions for expected behavior

```javascript
// Example: Red phase
describe('calculateDiscount', () => {
  it('applies 10% discount for orders over $100', () => {
    const order = { total: 150 };
    expect(calculateDiscount(order)).toBe(15);
  });
});
// Run: Test should fail (function doesn't exist yet)
```

### Phase 3: Green Phase - Make Test Pass
1. Write minimal code to pass the test
2. Don't worry about elegance yet
3. Focus on correctness only
4. Verify test passes

```javascript
// Example: Green phase
function calculateDiscount(order) {
  if (order.total > 100) {
    return order.total * 0.1;
  }
  return 0;
}
// Run: Test should pass now
```

### Phase 4: Refactor Phase - Improve Code
1. Clean up implementation
2. Remove duplication
3. Improve naming and structure
4. Verify tests still pass

```javascript
// Example: Refactor phase
const DISCOUNT_THRESHOLD = 100;
const DISCOUNT_RATE = 0.1;

function calculateDiscount(order) {
  return order.total > DISCOUNT_THRESHOLD
    ? order.total * DISCOUNT_RATE
    : 0;
}
// Run: Tests should still pass
```

### Phase 5: Add More Tests
1. Add edge cases
2. Add error handling tests
3. Add property-based tests
4. Repeat red-green-refactor

```javascript
// Additional tests
it('returns 0 for orders exactly $100', () => {
  expect(calculateDiscount({ total: 100 })).toBe(0);
});

it('returns 0 for orders under $100', () => {
  expect(calculateDiscount({ total: 50 })).toBe(0);
});

it('handles negative totals', () => {
  expect(calculateDiscount({ total: -10 })).toBe(0);
});
```

### Phase 6: Integration
1. Run full test suite
2. Check coverage metrics
3. Update documentation
4. Commit with test evidence

## TDD Best Practices

### Do
- Write tests before implementation
- Keep tests focused and simple
- Test one thing at a time
- Use descriptive test names
- Refactor only when green

### Don't
- Skip the red phase
- Write multiple tests at once
- Over-engineer in green phase
- Refactor while tests fail
- Ignore edge cases

## F.I.R.S.T. Principles

| Principle | Description |
|-----------|-------------|
| **Fast** | Tests run in milliseconds |
| **Independent** | No test depends on another |
| **Repeatable** | Same result every time |
| **Self-Validating** | Pass or fail, no manual check |
| **Timely** | Written before or with code |

## Agent Responsibilities

| Agent | Responsibility |
|-------|----------------|
| tester | Write failing tests, verify coverage |
| fullstack-developer | Implement to pass tests |
| code-reviewer | Review test quality, suggest improvements |

## Quality Gates

- All tests pass
- Coverage above 80%
- No skipped tests
- Property tests included for pure functions
- Edge cases documented

## Testing Options

TDD workflow **always enforces testing** (test-first by definition).

### Command Options

| Option | Description | Example |
|--------|-------------|---------|
| `--coverage <percent>` | Set coverage target | `/dev:tdd "auth" --coverage 95` |
| `--test-types <types>` | Specify test types | `/dev:tdd "api" --test-types unit,integration` |

### Configuration

```yaml
# .omgkit/workflow.yaml
testing:
  enabled: true
  enforcement:
    level: strict  # TDD recommends strict
  coverage_gates:
    unit:
      minimum: 90
      target: 95
```

```bash
# Set via CLI
omgkit config set testing.enforcement.level strict
```

## Usage Examples

```bash
# Standard TDD workflow
/dev:tdd "user authentication"

# TDD with specific coverage
/dev:tdd "payment processing" --coverage 95

# TDD with specific test types
/dev:tdd "API endpoint" --test-types unit,integration,contract
```

## Success Criteria

- Feature implemented with full test coverage
- All edge cases handled
- Code is refactored and clean
- Tests serve as documentation
