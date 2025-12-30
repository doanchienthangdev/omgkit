---
name: typescript
description: TypeScript development. Use when writing TypeScript, using strict types, or type-safe code.
---

# TypeScript Skill

## Patterns

### Strict Types
```typescript
interface User {
  id: string;
  email: string;
  createdAt: Date;
}

interface CreateUserInput {
  email: string;
  password: string;
}

function createUser(input: CreateUserInput): Promise<User> {
  ...
}
```

### Generics
```typescript
type Result<T, E = Error> =
  | { ok: true; data: T }
  | { ok: false; error: E };

async function fetchUser(id: string): Promise<Result<User>> {
  try {
    const user = await db.users.findById(id);
    return { ok: true, data: user };
  } catch (error) {
    return { ok: false, error };
  }
}
```

### Utility Types
```typescript
type Partial<T> = { [P in keyof T]?: T[P] };
type Required<T> = { [P in keyof T]-?: T[P] };
type Pick<T, K extends keyof T> = { [P in K]: T[P] };
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
```

### Const Assertions
```typescript
const CONFIG = {
  API_URL: 'https://api.example.com',
  TIMEOUT: 5000,
} as const;
```

## Best Practices
- Enable strict mode
- Use interfaces for objects
- Use type for unions/intersections
- Avoid `any`
- Use const assertions
- Prefer unknown over any
