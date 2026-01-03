---
description: Write comprehensive tests following OMGKIT Omega Testing methodology
allowed-tools: Task, Read, Write, Bash, Glob
argument-hint: <function-or-file>
---

# Write Omega-Level Tests

You are writing tests for the specified function, component, or file using the OMGKIT Omega Testing methodology.

## MANDATORY: Read First
Before writing any test, read `.omgkit/stdrules/TESTING_STANDARDS.md` for full methodology.

## Execution Steps

### Step 1: Analyze Target
1. Read the target function/component code
2. Identify input types and expected outputs
3. List all code paths (if/else, try/catch, loops)
4. Identify user input points (security-relevant)

### Step 2: Apply 4D Testing

**Dimension 1: Accuracy**
- Unit tests for each function
- Integration tests for component interaction
- E2E tests for critical flows

**Dimension 2: Performance** (if critical path)
```javascript
it('should complete within SLA', async () => {
  const start = performance.now();
  await operation();
  expect(performance.now() - start).toBeLessThan(100);
});
```

**Dimension 3: Security** (if user input)
```javascript
const MALICIOUS = [
  "'; DROP TABLE users; --",
  "<script>alert('xss')</script>",
  "../../../etc/passwd"
];
MALICIOUS.forEach(input => {
  it(`should sanitize: ${input.slice(0, 20)}...`, () => {
    expect(() => processInput(input)).not.toThrow();
  });
});
```

**Dimension 4: Accessibility** (if UI)
- Keyboard navigation
- ARIA labels
- Screen reader compatibility

### Step 3: Boundary Value Testing (NEVER SKIP)

```javascript
// Numbers
[0, -0, 1, -1, Number.MAX_SAFE_INTEGER, NaN, Infinity]

// Strings
['', ' ', 'a'.repeat(10000), '\n\t\r', '🔮', '\x00']

// Arrays
[[], [null], [undefined], Array(10000).fill(0)]

// Objects
[{}, null, undefined, {nested: {deep: {}}}]
```

### Step 4: Test Structure

```javascript
describe('FunctionName', () => {
  // Setup
  beforeEach(() => {});

  // 1. Happy path
  describe('when given valid input', () => {
    it('should return expected output', () => {});
  });

  // 2. Edge cases
  describe('edge cases', () => {
    it('should handle empty input', () => {});
    it('should handle null/undefined', () => {});
    it('should handle boundary values', () => {});
  });

  // 3. Error handling
  describe('error handling', () => {
    it('should throw on invalid input', () => {});
    it('should return error for edge cases', () => {});
  });

  // 4. Security (if applicable)
  describe('security', () => {
    it('should sanitize malicious input', () => {});
    it('should prevent injection attacks', () => {});
  });

  // 5. Performance (if critical)
  describe('performance', () => {
    it('should complete within SLA', () => {});
  });
});
```

### Step 5: Run and Verify

```bash
# Run tests
npm test

# Check coverage
npm run test:coverage

# Run mutation testing (if available)
npx stryker run
```

## Output Checklist

Before completing, verify:
- [ ] Happy path tested
- [ ] All edge cases covered (empty, null, undefined, boundaries)
- [ ] Error handling tested
- [ ] Security inputs tested (if user-facing)
- [ ] Coverage > 80%
- [ ] Tests are Fast, Independent, Repeatable

## Example Output

For a function `calculateDiscount(price, percentage)`:

```javascript
import { describe, it, expect } from 'vitest';
import { calculateDiscount } from './pricing';

describe('calculateDiscount', () => {
  // Happy path
  it('should calculate 10% discount correctly', () => {
    expect(calculateDiscount(100, 10)).toBe(90);
  });

  it('should calculate 50% discount correctly', () => {
    expect(calculateDiscount(200, 50)).toBe(100);
  });

  // Edge cases - boundaries
  describe('boundary values', () => {
    it('should handle 0% discount', () => {
      expect(calculateDiscount(100, 0)).toBe(100);
    });

    it('should handle 100% discount', () => {
      expect(calculateDiscount(100, 100)).toBe(0);
    });

    it('should handle price of 0', () => {
      expect(calculateDiscount(0, 50)).toBe(0);
    });

    it('should handle very large prices', () => {
      expect(calculateDiscount(Number.MAX_SAFE_INTEGER, 10))
        .toBeLessThan(Number.MAX_SAFE_INTEGER);
    });
  });

  // Edge cases - null/undefined
  describe('null and undefined handling', () => {
    it('should throw on null price', () => {
      expect(() => calculateDiscount(null, 10)).toThrow();
    });

    it('should throw on undefined percentage', () => {
      expect(() => calculateDiscount(100, undefined)).toThrow();
    });
  });

  // Error handling
  describe('invalid input', () => {
    it('should throw on negative price', () => {
      expect(() => calculateDiscount(-100, 10)).toThrow('Price must be positive');
    });

    it('should throw on percentage > 100', () => {
      expect(() => calculateDiscount(100, 150)).toThrow('Invalid percentage');
    });

    it('should throw on negative percentage', () => {
      expect(() => calculateDiscount(100, -10)).toThrow('Invalid percentage');
    });
  });

  // Security (if applicable)
  describe('security', () => {
    it('should reject string injection in price', () => {
      expect(() => calculateDiscount("100; DROP TABLE", 10)).toThrow();
    });
  });

  // Performance
  describe('performance', () => {
    it('should calculate 1000 discounts under 10ms', () => {
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        calculateDiscount(100, 10);
      }
      expect(performance.now() - start).toBeLessThan(10);
    });
  });
});
```
