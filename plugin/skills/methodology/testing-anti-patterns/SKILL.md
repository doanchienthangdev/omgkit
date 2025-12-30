---
name: testing-anti-patterns
description: Testing anti-patterns to avoid. Use when writing or reviewing tests.
---

# Testing Anti-Patterns Skill

## Anti-Patterns

### 1. Testing Implementation
```typescript
// Bad - tests internal implementation
expect(component.state.count).toBe(1);

// Good - tests behavior
expect(screen.getByText('1')).toBeInTheDocument();
```

### 2. Flaky Tests
```typescript
// Bad - timing dependent
await sleep(1000);
expect(result).toBe(true);

// Good - wait for condition
await waitFor(() => expect(result).toBe(true));
```

### 3. Test Interdependence
```typescript
// Bad - tests share state
let user;
it('creates user', () => { user = create(); });
it('uses user', () => { expect(user).toBe(...); });

// Good - independent tests
beforeEach(() => { user = create(); });
```

### 4. Overmocking
```typescript
// Bad - mock everything
// Good - use real implementations when practical
```

## Guidelines
- Test behavior, not implementation
- Keep tests independent
- Mock only external dependencies
- Use realistic test data
