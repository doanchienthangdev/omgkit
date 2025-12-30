---
name: testing-anti-patterns
description: Common testing anti-patterns to avoid and how to fix them for reliable, maintainable test suites
category: methodology
triggers:
  - testing anti-patterns
  - flaky tests
  - test smells
  - bad tests
  - test maintenance
  - unreliable tests
  - test code quality
---

# Testing Anti-Patterns

Identify and fix **common testing anti-patterns** that lead to flaky, slow, or unmaintainable test suites. This skill provides patterns to recognize problematic tests and techniques to refactor them into reliable, valuable tests.

## Purpose

Build reliable, maintainable test suites:

- Recognize testing anti-patterns quickly
- Fix flaky tests that undermine confidence
- Avoid tests that test implementation details
- Eliminate slow tests that hurt development velocity
- Remove tests that are hard to maintain
- Build tests that provide real value
- Create self-documenting test suites

## Features

### 1. The Testing Anti-Pattern Catalog

```markdown
## Common Testing Anti-Patterns

┌─────────────────────────────────────────────────────────────────────────┐
│                      TESTING ANTI-PATTERN SEVERITY                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  🔴 CRITICAL (Fix immediately)                                          │
│  ─────────────────────────────                                          │
│  • Flaky tests - Random failures destroy trust                          │
│  • Testing implementation - Breaks on every refactor                    │
│  • Hidden dependencies - Tests fail mysteriously                        │
│                                                                         │
│  🟡 HIGH (Fix soon)                                                     │
│  ─────────────────                                                      │
│  • Slow tests - Hurt development velocity                               │
│  • Test interdependence - Can't run tests in isolation                 │
│  • Over-mocking - Tests pass but bugs slip through                     │
│                                                                         │
│  🟠 MEDIUM (Plan to fix)                                                │
│  ───────────────────────                                                │
│  • Poor naming - Tests don't document behavior                          │
│  • Magic values - Unclear why values are expected                       │
│  • Giant tests - Hard to understand and maintain                        │
│                                                                         │
│  🔵 LOW (Fix when touching)                                             │
│  ─────────────────────────                                              │
│  • Commented tests - Remove or fix them                                 │
│  • Duplicate tests - Consolidate coverage                               │
│  • Dead assertions - Remove or make meaningful                          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2. Flaky Tests

```typescript
/**
 * ANTI-PATTERN: Flaky Tests
 * Tests that sometimes pass, sometimes fail
 */

// ❌ FLAKY: Timing-dependent test
describe('FlakY: Timing Issues', () => {
  it('processes data after delay', async () => {
    startAsyncProcess();

    // PROBLEM: 100ms might not be enough on slow CI
    await sleep(100);

    expect(result).toBe('processed');
  });
});

// ✅ FIXED: Wait for condition, not time
describe('Fixed: Proper async handling', () => {
  it('processes data after delay', async () => {
    startAsyncProcess();

    // Wait for actual condition
    await waitFor(() => {
      expect(result).toBe('processed');
    }, { timeout: 5000 });
  });
});

// ❌ FLAKY: Random data without determinism
describe('Flaky: Random Data', () => {
  it('handles user data', () => {
    const user = {
      id: Math.random().toString(),
      name: faker.name.fullName()
    };

    const result = processUser(user);

    // PROBLEM: Can't know expected result
    expect(result).toBeDefined();
  });
});

// ✅ FIXED: Deterministic test data
describe('Fixed: Deterministic Data', () => {
  it('handles user data', () => {
    const user = {
      id: 'user-123',
      name: 'John Doe'
    };

    const result = processUser(user);

    expect(result).toEqual({
      id: 'user-123',
      displayName: 'John Doe',
      slug: 'john-doe'
    });
  });
});

// ❌ FLAKY: Order-dependent tests
describe('Flaky: Order Dependent', () => {
  let sharedState = [];

  it('adds item', () => {
    sharedState.push('item1');
    expect(sharedState).toHaveLength(1);
  });

  it('has two items', () => {
    // PROBLEM: Depends on previous test running first
    sharedState.push('item2');
    expect(sharedState).toHaveLength(2);
  });
});

// ✅ FIXED: Independent tests
describe('Fixed: Independent Tests', () => {
  let sharedState: string[];

  beforeEach(() => {
    sharedState = []; // Fresh state each test
  });

  it('adds first item', () => {
    sharedState.push('item1');
    expect(sharedState).toHaveLength(1);
  });

  it('adds second item', () => {
    sharedState.push('item2');
    expect(sharedState).toHaveLength(1); // Independent!
  });
});
```

### 3. Testing Implementation Details

```typescript
/**
 * ANTI-PATTERN: Testing Implementation
 * Tests break when implementation changes, even if behavior is correct
 */

// ❌ BAD: Testing internal state
describe('Anti-pattern: Internal State', () => {
  it('sets internal counter', () => {
    const counter = new Counter();
    counter.increment();

    // PROBLEM: Testing private implementation
    expect(counter._count).toBe(1);
  });
});

// ✅ GOOD: Testing behavior
describe('Pattern: Test Behavior', () => {
  it('increments and returns count', () => {
    const counter = new Counter();

    expect(counter.increment()).toBe(1);
    expect(counter.getValue()).toBe(1);
  });
});

// ❌ BAD: Testing function calls
describe('Anti-pattern: Spy Everything', () => {
  it('calls internal methods', () => {
    const service = new UserService();
    const validateSpy = vi.spyOn(service, 'validateEmail');
    const hashSpy = vi.spyOn(service, 'hashPassword');

    service.createUser({ email: 'test@test.com', password: '123' });

    // PROBLEM: Tightly coupled to implementation
    expect(validateSpy).toHaveBeenCalledWith('test@test.com');
    expect(hashSpy).toHaveBeenCalledWith('123');
  });
});

// ✅ GOOD: Testing outcomes
describe('Pattern: Test Outcomes', () => {
  it('creates user with hashed password', async () => {
    const service = new UserService();

    const user = await service.createUser({
      email: 'test@test.com',
      password: '123'
    });

    // Test the result, not how we got there
    expect(user.email).toBe('test@test.com');
    expect(user.password).not.toBe('123'); // Hashed
    expect(user.password).toMatch(/^\$2[aby]?\$/); // bcrypt format
  });
});

// ❌ BAD: Testing component internals (React)
describe('Anti-pattern: Component Internals', () => {
  it('sets state on click', () => {
    const wrapper = shallow(<Counter />);

    wrapper.find('button').simulate('click');

    // PROBLEM: Testing React implementation
    expect(wrapper.state('count')).toBe(1);
  });
});

// ✅ GOOD: Testing user-facing behavior
describe('Pattern: User Behavior', () => {
  it('shows incremented count on click', () => {
    render(<Counter />);

    const button = screen.getByRole('button', { name: /increment/i });
    fireEvent.click(button);

    // Test what user sees
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });
});
```

### 4. Over-Mocking

```typescript
/**
 * ANTI-PATTERN: Over-Mocking
 * Mocking so much that tests pass but bugs slip through
 */

// ❌ BAD: Everything is mocked
describe('Anti-pattern: Mock Everything', () => {
  it('processes order', async () => {
    const mockDb = { save: vi.fn() };
    const mockPayment = { charge: vi.fn().mockResolvedValue({ success: true }) };
    const mockEmail = { send: vi.fn() };
    const mockInventory = { reserve: vi.fn().mockResolvedValue(true) };
    const mockShipping = { calculate: vi.fn().mockReturnValue(5.99) };

    const service = new OrderService({
      db: mockDb,
      payment: mockPayment,
      email: mockEmail,
      inventory: mockInventory,
      shipping: mockShipping
    });

    await service.processOrder(mockOrder);

    // PROBLEM: We're only testing that our mocks were called
    // The actual integration could be completely broken
    expect(mockPayment.charge).toHaveBeenCalled();
    expect(mockDb.save).toHaveBeenCalled();
  });
});

// ✅ GOOD: Mock boundaries, not internals
describe('Pattern: Mock External Boundaries', () => {
  let service: OrderService;
  let testDb: TestDatabase;

  beforeAll(async () => {
    testDb = await createTestDatabase();
  });

  beforeEach(async () => {
    // Use real database, mock only external services
    service = new OrderService({
      db: testDb,
      payment: createMockPaymentProvider(),  // External API
      email: createMockEmailProvider(),      // External service
      inventory: new InventoryService(testDb), // Real, uses test DB
      shipping: new ShippingCalculator()     // Real, pure logic
    });
  });

  it('processes order end-to-end', async () => {
    const order = await service.processOrder({
      items: [{ productId: 'prod-1', quantity: 2 }],
      customer: testCustomer
    });

    // Real assertions on real behavior
    expect(order.status).toBe('confirmed');
    expect(order.total).toBe(29.98);

    // Verify real database state
    const dbOrder = await testDb.orders.findById(order.id);
    expect(dbOrder.status).toBe('confirmed');
  });
});

// The Mock Boundary Principle
const mockBoundaryGuidelines = {
  mock: [
    'External APIs (payment, email, SMS)',
    'Third-party services',
    'System clock (for determinism)',
    'Random number generators',
    'Network requests'
  ],
  dontMock: [
    'Your own code (usually)',
    'Pure functions',
    'Data transformations',
    'Business logic',
    'Internal services (use test doubles with real behavior)'
  ]
};
```

### 5. Slow Tests

```typescript
/**
 * ANTI-PATTERN: Slow Tests
 * Tests that take too long, hurting development velocity
 */

// ❌ SLOW: Unnecessary database for unit test
describe('Anti-pattern: Wrong Layer', () => {
  it('validates email format', async () => {
    // PROBLEM: Spinning up DB just to test string validation
    const db = await createDatabase();
    const service = new UserService(db);

    const result = service.validateEmail('invalid');

    expect(result).toBe(false);
    await db.close();
  });
});

// ✅ FAST: Test pure logic directly
describe('Pattern: Right Layer', () => {
  it('validates email format', () => {
    expect(validateEmail('invalid')).toBe(false);
    expect(validateEmail('valid@example.com')).toBe(true);
  });
});

// ❌ SLOW: Redundant setup
describe('Anti-pattern: Heavy Setup', () => {
  it('test 1', async () => {
    const db = await createDatabase();
    await seedUsers(100);
    await seedProducts(1000);
    await seedOrders(500);

    const result = await getUser('user-1');
    expect(result.name).toBe('User 1');
  });

  it('test 2', async () => {
    // Same heavy setup repeated!
    const db = await createDatabase();
    await seedUsers(100);
    await seedProducts(1000);
    await seedOrders(500);

    const result = await getUser('user-2');
    expect(result.name).toBe('User 2');
  });
});

// ✅ FAST: Shared setup, minimal data
describe('Pattern: Efficient Setup', () => {
  let db: TestDatabase;

  beforeAll(async () => {
    db = await createDatabase();
    // Seed only what's needed for this suite
    await seedUsers(3);
  });

  afterAll(async () => {
    await db.close();
  });

  it('gets user 1', async () => {
    const result = await getUser('user-1');
    expect(result.name).toBe('User 1');
  });

  it('gets user 2', async () => {
    const result = await getUser('user-2');
    expect(result.name).toBe('User 2');
  });
});

// ❌ SLOW: Real network in unit tests
describe('Anti-pattern: Real Network', () => {
  it('fetches user from API', async () => {
    // PROBLEM: Hits real API, slow and flaky
    const response = await fetch('https://api.example.com/users/1');
    const user = await response.json();

    expect(user.name).toBe('John');
  });
});

// ✅ FAST: Mock network
describe('Pattern: Mock Network', () => {
  beforeEach(() => {
    fetchMock.mockResponse(JSON.stringify({ name: 'John' }));
  });

  it('fetches user from API', async () => {
    const user = await fetchUser(1);
    expect(user.name).toBe('John');
  });
});
```

### 6. Poor Test Design

```typescript
/**
 * ANTI-PATTERN: Poor Test Design
 * Tests that are hard to understand or maintain
 */

// ❌ BAD: Giant test with many assertions
describe('Anti-pattern: Giant Test', () => {
  it('does everything', async () => {
    const service = new OrderService();

    // Create user
    const user = await service.createUser({ name: 'John' });
    expect(user.id).toBeDefined();

    // Add payment method
    await service.addPaymentMethod(user.id, { type: 'card' });
    expect(user.paymentMethods).toHaveLength(1);

    // Create order
    const order = await service.createOrder(user.id, [{ id: 'p1' }]);
    expect(order.status).toBe('pending');

    // Process payment
    await service.processPayment(order.id);
    expect(order.status).toBe('paid');

    // Ship order
    await service.shipOrder(order.id);
    expect(order.status).toBe('shipped');

    // ... 20 more steps
    // PROBLEM: One failure, no idea where
  });
});

// ✅ GOOD: Focused tests
describe('Pattern: Focused Tests', () => {
  describe('Order Creation', () => {
    it('creates pending order from cart items', async () => {
      const order = await service.createOrder(user.id, cartItems);

      expect(order.status).toBe('pending');
      expect(order.items).toEqual(cartItems);
    });
  });

  describe('Payment Processing', () => {
    it('marks order as paid after successful charge', async () => {
      const order = await createPendingOrder();

      await service.processPayment(order.id);

      expect(await getOrder(order.id).status).toBe('paid');
    });

    it('keeps order pending if charge fails', async () => {
      const order = await createPendingOrder();
      mockPayment.failNextCharge();

      await expect(
        service.processPayment(order.id)
      ).rejects.toThrow(PaymentError);

      expect(await getOrder(order.id).status).toBe('pending');
    });
  });
});

// ❌ BAD: Magic values
describe('Anti-pattern: Magic Values', () => {
  it('calculates discount', () => {
    // PROBLEM: Why 150? Why 15?
    expect(calculateDiscount(150)).toBe(15);
    expect(calculateDiscount(99)).toBe(0);
  });
});

// ✅ GOOD: Self-documenting values
describe('Pattern: Clear Intent', () => {
  it('applies 10% discount for orders over $100', () => {
    const DISCOUNT_THRESHOLD = 100;
    const DISCOUNT_RATE = 0.10;

    const orderAboveThreshold = 150;
    const orderBelowThreshold = 99;

    expect(calculateDiscount(orderAboveThreshold))
      .toBe(orderAboveThreshold * DISCOUNT_RATE);

    expect(calculateDiscount(orderBelowThreshold))
      .toBe(0);
  });
});

// ❌ BAD: Unclear test names
describe('Anti-pattern: Bad Names', () => {
  it('test1', () => { /* ... */ });
  it('should work', () => { /* ... */ });
  it('handles edge case', () => { /* ... */ });
});

// ✅ GOOD: Behavior-describing names
describe('Pattern: Descriptive Names', () => {
  it('returns empty array when no products match filter', () => { /* ... */ });
  it('throws InvalidEmailError for malformed email addresses', () => { /* ... */ });
  it('retries up to 3 times before failing', () => { /* ... */ });
});
```

### 7. Test Smells Detection

```typescript
/**
 * Automated test smell detection
 */

interface TestSmell {
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  pattern: RegExp;
  fix: string;
}

const testSmells: TestSmell[] = [
  {
    type: 'sleep-in-test',
    severity: 'critical',
    pattern: /await\s+sleep\s*\(/,
    fix: 'Use waitFor or proper async handling'
  },
  {
    type: 'implementation-testing',
    severity: 'high',
    pattern: /\._\w+|\.state\(|\.instance\(\)/,
    fix: 'Test behavior through public interface'
  },
  {
    type: 'broad-assertion',
    severity: 'medium',
    pattern: /expect\([^)]+\)\.toBeDefined\(\)/,
    fix: 'Use specific assertions'
  },
  {
    type: 'magic-number',
    severity: 'medium',
    pattern: /expect\([^)]+\)\.toBe\(\d{3,}\)/,
    fix: 'Use named constants'
  },
  {
    type: 'commented-test',
    severity: 'low',
    pattern: /\/\/\s*it\(|\/\*[\s\S]*it\(/,
    fix: 'Remove or fix commented tests'
  }
];

function detectTestSmells(testCode: string): DetectedSmell[] {
  const smells: DetectedSmell[] = [];

  for (const smell of testSmells) {
    const matches = testCode.matchAll(new RegExp(smell.pattern, 'g'));
    for (const match of matches) {
      smells.push({
        ...smell,
        location: match.index,
        snippet: match[0]
      });
    }
  }

  return smells;
}
```

## Use Cases

### Refactoring a Flaky Test Suite

```typescript
// Before: Flaky, slow, hard to maintain
describe('OrderService (before)', () => {
  it('processes order', async () => {
    const db = await connectToRealDatabase();
    const order = await createOrder(db);

    // Flaky: timing
    await sleep(500);

    // Implementation detail
    expect(order._internalState).toBe('processing');

    // Magic value
    expect(order.total).toBe(127.45);
  });
});

// After: Reliable, fast, clear
describe('OrderService (after)', () => {
  let testDb: TestDatabase;
  let service: OrderService;

  beforeAll(async () => {
    testDb = await createTestDatabase();
    service = new OrderService(testDb);
  });

  it('calculates total from items', async () => {
    const items = [
      createTestItem({ price: 99.99 }),
      createTestItem({ price: 27.46 })
    ];

    const order = await service.createOrder(items);

    // Clear expectation
    expect(order.total).toBe(127.45);
  });

  it('transitions to processing after payment', async () => {
    const order = await createPendingOrder();

    await service.processPayment(order.id);

    // Test behavior, not implementation
    await waitFor(() => {
      expect(service.getOrderStatus(order.id)).toBe('processing');
    });
  });
});
```

## Best Practices

### Do's

- **Test behavior, not implementation** - what it does, not how
- **Use factories for test data** - consistent, typed data
- **Write descriptive test names** - document the behavior
- **Keep tests independent** - no shared mutable state
- **Mock only external boundaries** - APIs, not your code
- **Use proper async patterns** - waitFor, not sleep
- **Make assertions specific** - not just toBeDefined
- **Run tests in random order** - catch hidden dependencies

### Don'ts

- Don't use sleep/setTimeout in tests
- Don't access private properties
- Don't share state between tests
- Don't mock everything
- Don't write 1000-line test files
- Don't use real network/databases in unit tests
- Don't ignore flaky tests
- Don't comment out failing tests

## References

- [Testing Library Guiding Principles](https://testing-library.com/docs/guiding-principles)
- [Test Desiderata - Kent Beck](https://medium.com/@kentbeck_7670/test-desiderata-94150638a4b3)
- [xUnit Test Patterns](http://xunitpatterns.com/)
- [Growing Object-Oriented Software, Guided by Tests](http://www.growing-object-oriented-software.com/)
