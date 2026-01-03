# OMGKIT Testing Standards

This document defines the testing philosophy and standards for this project. Claude Code MUST follow these guidelines when writing tests.

---

## Core Philosophy

### F.I.R.S.T. Principles (MANDATORY)

| Principle | Requirement | Example |
|-----------|-------------|---------|
| **Fast** | Unit tests < 1ms, Integration < 100ms | Use mocks for slow dependencies |
| **Independent** | Tests don't share state | Fresh setup for each test |
| **Repeatable** | Same result every run | No random data, no time-dependent logic |
| **Self-Validating** | Clear pass/fail | Explicit assertions, no manual inspection |
| **Timely** | Write with code (TDD preferred) | Test before or during implementation |

---

## 4D Testing Methodology

Every feature MUST be tested across 4 dimensions:

### 1. Accuracy Testing
```javascript
// REQUIRED: Unit tests for all functions
describe('functionName', () => {
  // Happy path
  it('should handle normal input correctly', () => {});

  // Edge cases (MANDATORY)
  it('should handle empty input', () => {});
  it('should handle null/undefined', () => {});
  it('should handle boundary values', () => {});

  // Error cases
  it('should throw on invalid input', () => {});
});
```

### 2. Performance Testing
```javascript
// REQUIRED for critical paths
it('should complete within SLA', async () => {
  const start = performance.now();
  await operation();
  expect(performance.now() - start).toBeLessThan(100); // 100ms max
});
```

### 3. Security Testing
```javascript
// REQUIRED for user input handling
const MALICIOUS_INPUTS = [
  "'; DROP TABLE users; --",  // SQL injection
  "<script>alert('xss')</script>",  // XSS
  "../../../etc/passwd",  // Path traversal
  "{{constructor.constructor('return this')()}}",  // Prototype pollution
];

MALICIOUS_INPUTS.forEach(input => {
  it(`should sanitize: ${input.slice(0, 20)}...`, () => {
    expect(() => processInput(input)).not.toThrow();
    expect(processInput(input)).not.toContain(input);
  });
});
```

### 4. Accessibility Testing (for UI)
```javascript
// REQUIRED for all UI components
it('should be keyboard accessible', () => {});
it('should have proper ARIA labels', () => {});
it('should meet WCAG AA contrast', () => {});
```

---

## Boundary Value Testing (MANDATORY)

Always test these boundaries:

```javascript
// Numbers
const BOUNDARY_NUMBERS = [
  0, -0, 1, -1,
  Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER,
  Number.MAX_VALUE, Number.MIN_VALUE,
  Infinity, -Infinity, NaN
];

// Strings
const BOUNDARY_STRINGS = [
  '', ' ', '   ',
  'a'.repeat(10000),  // Very long
  '\n\t\r',  // Whitespace
  '🔮💀',  // Unicode/emoji
  '\x00\x01',  // Control chars
];

// Arrays
const BOUNDARY_ARRAYS = [
  [], [null], [undefined],
  new Array(10000).fill(0),  // Large array
  [1, [2, [3]]],  // Nested
];
```

---

## "Naughty" Data Patterns

When testing user input, ALWAYS include:

```javascript
const NAUGHTY_STRINGS = [
  // Injection attacks
  "'; DROP TABLE users; --",
  "1; UPDATE users SET role='admin'",

  // XSS attacks
  "<script>alert('xss')</script>",
  "<img src=x onerror=alert('xss')>",
  "javascript:alert('xss')",

  // Format strings
  "%s%s%s%s%s",
  "{0}{1}{2}",

  // Unicode edge cases
  "Ω≈ç√∫",
  "田中さんにあげて下さい",
  "表ポあA鳥唐",

  // Null bytes
  "test\x00hidden",

  // Path traversal
  "../../../etc/passwd",
  "....//....//etc/passwd",
];
```

---

## Test Structure

```
tests/
├── unit/                    # Fast, isolated tests
│   ├── *.test.ts           # Co-located or separate
├── integration/             # Component interaction
│   ├── api.integration.ts
│   ├── db.integration.ts
├── e2e/                     # Full user flows
│   ├── checkout.e2e.ts
├── security/                # Security-specific
│   ├── injection.test.ts
│   ├── auth.test.ts
└── performance/             # Performance benchmarks
    ├── benchmarks.test.ts
```

---

## Coverage Requirements

| Type | Minimum | Target |
|------|---------|--------|
| Statements | 80% | 90% |
| Branches | 75% | 85% |
| Functions | 80% | 90% |
| Lines | 80% | 90% |

---

## Property-Based Testing

For complex logic, use property-based testing:

```javascript
import { fc } from 'fast-check';

// Instead of specific examples, test properties
test('sort is idempotent', () => {
  fc.assert(
    fc.property(fc.array(fc.integer()), (arr) => {
      const sorted = sort(arr);
      return JSON.stringify(sort(sorted)) === JSON.stringify(sorted);
    })
  );
});

test('reverse is its own inverse', () => {
  fc.assert(
    fc.property(fc.array(fc.anything()), (arr) => {
      return JSON.stringify(reverse(reverse(arr))) === JSON.stringify(arr);
    })
  );
});
```

---

## Anti-Patterns (AVOID)

1. **Testing Implementation** - Test behavior, not internal details
2. **Flaky Tests** - No random, no timing-dependent
3. **Over-Mocking** - Don't mock everything
4. **Copy-Paste Tests** - Use `it.each()` or `describe.each()`
5. **No Assertions** - Every test MUST assert
6. **Ignoring Edge Cases** - Boundaries are where bugs hide
7. **Massive Test Files** - Split by functionality

---

## Mutation Testing (Quality Check)

Run mutation testing to verify test quality:

```bash
npx stryker run
```

Target: **Mutation score > 80%**

If tests pass but mutations survive, tests are too weak.

---

## When Claude Code Writes Tests

Claude Code MUST:

1. **Read this file first** when asked to write tests
2. **Apply 4D methodology** - not just happy path
3. **Include boundary values** from this document
4. **Test security** for any user input
5. **Use property-based testing** for complex logic
6. **Check coverage** after writing tests
7. **Run mutation testing** if available

---

## Quick Reference

```javascript
// Minimum test template for any function
describe('functionName', () => {
  // 1. Happy path
  it('should work with valid input', () => {});

  // 2. Edge cases
  it('should handle empty/null/undefined', () => {});
  it('should handle boundary values', () => {});

  // 3. Error handling
  it('should throw/return error for invalid input', () => {});

  // 4. Security (if user input)
  it('should sanitize malicious input', () => {});

  // 5. Performance (if critical path)
  it('should complete within SLA', () => {});
});
```

---

*Think Omega. Test Omega. Be Omega.* 🔮
