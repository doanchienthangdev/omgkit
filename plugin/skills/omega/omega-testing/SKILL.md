---
name: omega-testing
description: Comprehensive Omega testing. Use for thorough test coverage.
---

# Omega Testing Skill

## Testing Pyramid
```
        /\
       /E2E\
      /─────\
     /Integ. \
    /─────────\
   /   Unit    \
  /─────────────\
```

## Coverage Targets
- Unit: 80%+
- Integration: 60%+
- E2E: Critical paths 100%

## Test Categories

### 1. Happy Path
```typescript
it('creates user successfully', async () => {
  const user = await createUser({ email: 'test@example.com' });
  expect(user.email).toBe('test@example.com');
});
```

### 2. Edge Cases
```typescript
it('handles empty input', () => {
  expect(() => createUser({ email: '' })).toThrow();
});
```

### 3. Error Cases
```typescript
it('handles database failure', async () => {
  db.fail();
  await expect(createUser({})).rejects.toThrow(DatabaseError);
});
```

### 4. Performance
```typescript
it('responds within 100ms', async () => {
  const start = Date.now();
  await fetchUsers();
  expect(Date.now() - start).toBeLessThan(100);
});
```

### 5. Security
```typescript
it('rejects SQL injection', () => {
  const input = "'; DROP TABLE users; --";
  expect(() => query(input)).not.toThrow();
});
```

## Omega Quality
Test for ALL dimensions:
- Accuracy
- Performance
- Security
- Accessibility
