---
name: vitest
description: Vitest testing. Use for JavaScript/TypeScript unit tests.
---

# Vitest Skill

## Basic Tests
```typescript
import { describe, it, expect } from 'vitest';

describe('add', () => {
  it('adds two numbers', () => {
    expect(add(1, 2)).toBe(3);
  });

  it('handles negative numbers', () => {
    expect(add(-1, 1)).toBe(0);
  });
});
```

## Async Tests
```typescript
it('fetches user', async () => {
  const user = await fetchUser('123');
  expect(user.email).toBe('test@example.com');
});
```

## Mocking
```typescript
import { vi } from 'vitest';

vi.mock('./api', () => ({
  fetchData: vi.fn().mockResolvedValue({ data: 'test' }),
}));

it('calls API', async () => {
  const result = await getData();
  expect(fetchData).toHaveBeenCalled();
});
```

## Setup
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
    },
  },
});
```

## Run
```bash
vitest
vitest --coverage
vitest --ui
```
