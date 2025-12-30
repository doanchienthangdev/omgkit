---
name: javascript
description: Modern JavaScript development with ES2024+, async patterns, functional programming, and Node.js
category: languages
triggers:
  - javascript
  - js
  - es6
  - es2024
  - ecmascript
  - node
  - nodejs
  - npm
---

# JavaScript

Modern **JavaScript development** following industry best practices. This skill covers ES2024+ features, async patterns, functional programming, error handling, testing, and production-ready patterns used by top engineering teams.

## Purpose

Write clean, maintainable JavaScript code:

- Master modern ES2024+ syntax and features
- Implement robust async/await patterns
- Use functional programming effectively
- Handle errors properly
- Structure projects for maintainability
- Write comprehensive tests
- Build for performance

## Features

### 1. Modern Syntax (ES2024+)

```javascript
// Destructuring - Objects and Arrays
const user = { name: 'John', email: 'john@example.com', role: 'admin' };
const { name, email, role = 'user' } = user;

const numbers = [1, 2, 3, 4, 5];
const [first, second, ...rest] = numbers;

// Nested destructuring
const response = {
  data: {
    user: { id: 1, profile: { avatar: 'url' } }
  }
};
const { data: { user: { profile: { avatar } } } } = response;

// Spread operator - Objects and Arrays
const defaults = { theme: 'light', language: 'en' };
const settings = { ...defaults, theme: 'dark', notifications: true };

const combined = [...numbers, 6, 7, 8];

// Rest parameters
function sum(...numbers) {
  return numbers.reduce((acc, n) => acc + n, 0);
}

// Optional chaining and nullish coalescing
const street = user?.address?.street ?? 'Unknown';
const callback = options?.onComplete;
callback?.();

// Logical assignment operators
let config = {};
config.timeout ??= 5000;
config.retries ||= 3;
config.debug &&= process.env.NODE_ENV !== 'production';

// Array methods - at(), findLast(), toSorted(), toReversed()
const lastItem = numbers.at(-1);
const lastEven = numbers.findLast(n => n % 2 === 0);
const sorted = numbers.toSorted((a, b) => b - a); // Non-mutating
const reversed = numbers.toReversed(); // Non-mutating

// Object.groupBy() (ES2024)
const items = [
  { type: 'fruit', name: 'apple' },
  { type: 'vegetable', name: 'carrot' },
  { type: 'fruit', name: 'banana' },
];
const grouped = Object.groupBy(items, item => item.type);

// Promise.withResolvers() (ES2024)
const { promise, resolve, reject } = Promise.withResolvers();

// Template literals with tags
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) =>
    `${result}${str}${values[i] ? `<mark>${values[i]}</mark>` : ''}`, ''
  );
}
const message = highlight`Hello ${name}, your role is ${role}`;

// Private class fields
class Counter {
  #count = 0;

  increment() {
    this.#count++;
  }

  get value() {
    return this.#count;
  }
}
```

### 2. Async Patterns

```javascript
// Basic async/await
async function fetchUser(id) {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
}

// Parallel execution with Promise.all
async function fetchUserWithPosts(userId) {
  const [user, posts] = await Promise.all([
    fetchUser(userId),
    fetchPosts(userId),
  ]);
  return { user, posts };
}

// Promise.allSettled for handling mixed results
async function fetchAllUsers(ids) {
  const results = await Promise.allSettled(
    ids.map(id => fetchUser(id))
  );

  const successful = results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);

  const failed = results
    .filter(r => r.status === 'rejected')
    .map(r => r.reason);

  return { successful, failed };
}

// Promise.race for timeouts
async function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController();

  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      controller.abort();
      reject(new Error('Request timeout'));
    }, timeout);
  });

  const fetchPromise = fetch(url, { signal: controller.signal });

  return Promise.race([fetchPromise, timeoutPromise]);
}

// Async iteration
async function* fetchPages(baseUrl) {
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(`${baseUrl}?page=${page}`);
    const data = await response.json();

    yield data.items;

    hasMore = data.hasMore;
    page++;
  }
}

// Using async iterator
async function processAllPages() {
  for await (const items of fetchPages('/api/items')) {
    for (const item of items) {
      await processItem(item);
    }
  }
}

// Retry pattern with exponential backoff
async function withRetry(fn, maxRetries = 3, baseDelay = 1000) {
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

// Concurrent execution with limit
async function mapWithConcurrency(items, fn, limit = 5) {
  const results = [];
  const executing = new Set();

  for (const item of items) {
    const promise = fn(item).then(result => {
      executing.delete(promise);
      return result;
    });

    executing.add(promise);
    results.push(promise);

    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }

  return Promise.all(results);
}
```

### 3. Functional Programming

```javascript
// Pure functions
const add = (a, b) => a + b;
const multiply = (a, b) => a * b;

// Function composition
const compose = (...fns) => x =>
  fns.reduceRight((acc, fn) => fn(acc), x);

const pipe = (...fns) => x =>
  fns.reduce((acc, fn) => fn(acc), x);

// Currying
const curry = fn => {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return (...nextArgs) => curried(...args, ...nextArgs);
  };
};

const addCurried = curry((a, b, c) => a + b + c);
const add5 = addCurried(5);
const add5and3 = add5(3);
const result = add5and3(2); // 10

// Partial application
const partial = (fn, ...presetArgs) =>
  (...laterArgs) => fn(...presetArgs, ...laterArgs);

const greet = (greeting, name) => `${greeting}, ${name}!`;
const sayHello = partial(greet, 'Hello');
sayHello('World'); // "Hello, World!"

// Higher-order functions
const map = fn => arr => arr.map(fn);
const filter = pred => arr => arr.filter(pred);
const reduce = (fn, initial) => arr => arr.reduce(fn, initial);

// Point-free style
const double = x => x * 2;
const isEven = x => x % 2 === 0;
const sum = (a, b) => a + b;

const processNumbers = pipe(
  filter(isEven),
  map(double),
  reduce(sum, 0)
);

processNumbers([1, 2, 3, 4, 5]); // 12

// Immutable operations
const updateUser = (user, updates) => ({
  ...user,
  ...updates,
  updatedAt: new Date().toISOString(),
});

const addItem = (array, item) => [...array, item];
const removeItem = (array, index) => [
  ...array.slice(0, index),
  ...array.slice(index + 1),
];
const updateItem = (array, index, item) => [
  ...array.slice(0, index),
  item,
  ...array.slice(index + 1),
];

// Memoization
const memoize = fn => {
  const cache = new Map();

  return (...args) => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

const expensiveCalculation = memoize((n) => {
  console.log('Computing...');
  return n * n;
});

// Option/Maybe pattern
const Option = {
  some: value => ({
    isSome: true,
    isNone: false,
    map: fn => Option.some(fn(value)),
    flatMap: fn => fn(value),
    getOrElse: () => value,
    filter: pred => pred(value) ? Option.some(value) : Option.none(),
  }),

  none: () => ({
    isSome: false,
    isNone: true,
    map: () => Option.none(),
    flatMap: () => Option.none(),
    getOrElse: defaultValue => defaultValue,
    filter: () => Option.none(),
  }),

  fromNullable: value =>
    value != null ? Option.some(value) : Option.none(),
};

// Usage
const userName = Option.fromNullable(user?.name)
  .map(name => name.toUpperCase())
  .getOrElse('Anonymous');
```

### 4. Error Handling

```javascript
// Custom error classes
class AppError extends Error {
  constructor(message, code, statusCode = 500) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
    };
  }
}

class ValidationError extends AppError {
  constructor(field, message) {
    super(message, 'VALIDATION_ERROR', 400);
    this.field = field;
  }
}

class NotFoundError extends AppError {
  constructor(resource, id) {
    super(`${resource} with id ${id} not found`, 'NOT_FOUND', 404);
    this.resource = resource;
    this.resourceId = id;
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 'UNAUTHORIZED', 401);
  }
}

// Result type pattern
class Result {
  constructor(value, error) {
    this.value = value;
    this.error = error;
  }

  static ok(value) {
    return new Result(value, null);
  }

  static err(error) {
    return new Result(null, error);
  }

  isOk() {
    return this.error === null;
  }

  isErr() {
    return this.error !== null;
  }

  map(fn) {
    return this.isOk() ? Result.ok(fn(this.value)) : this;
  }

  flatMap(fn) {
    return this.isOk() ? fn(this.value) : this;
  }

  mapErr(fn) {
    return this.isErr() ? Result.err(fn(this.error)) : this;
  }

  unwrap() {
    if (this.isErr()) throw this.error;
    return this.value;
  }

  unwrapOr(defaultValue) {
    return this.isOk() ? this.value : defaultValue;
  }

  match({ ok, err }) {
    return this.isOk() ? ok(this.value) : err(this.error);
  }
}

// Usage
async function safeParseJSON(text) {
  try {
    return Result.ok(JSON.parse(text));
  } catch (error) {
    return Result.err(new ValidationError('json', 'Invalid JSON'));
  }
}

async function safeFetch(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return Result.err(new AppError(`HTTP ${response.status}`, 'HTTP_ERROR'));
    }
    const data = await response.json();
    return Result.ok(data);
  } catch (error) {
    return Result.err(error);
  }
}

// Error boundary pattern
async function withErrorBoundary(fn, fallback) {
  try {
    return await fn();
  } catch (error) {
    console.error('Error caught in boundary:', error);

    if (typeof fallback === 'function') {
      return fallback(error);
    }

    return fallback;
  }
}

// Global error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
```

### 5. Modules and Project Structure

```javascript
// Named exports
// utils/string.js
export const capitalize = str =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const slugify = str =>
  str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

export const truncate = (str, length, suffix = '...') =>
  str.length > length ? str.slice(0, length) + suffix : str;

// Default export with named exports
// services/api.js
class ApiService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async get(path) {
    const response = await fetch(`${this.baseUrl}${path}`);
    return response.json();
  }

  async post(path, data) {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }
}

export default ApiService;
export const createApi = baseUrl => new ApiService(baseUrl);

// Re-exports (barrel exports)
// services/index.js
export { default as ApiService, createApi } from './api.js';
export { default as AuthService } from './auth.js';
export { default as UserService } from './user.js';
export * from './constants.js';

// Dynamic imports
async function loadModule(moduleName) {
  try {
    const module = await import(`./modules/${moduleName}.js`);
    return module.default;
  } catch (error) {
    console.error(`Failed to load module: ${moduleName}`);
    return null;
  }
}

// Conditional imports
async function loadFeature() {
  if (process.env.FEATURE_FLAG) {
    const { enableFeature } = await import('./features/newFeature.js');
    enableFeature();
  }
}

// Project structure example
/*
src/
├── index.js              # Entry point
├── config/
│   ├── index.js          # Configuration exports
│   ├── database.js
│   └── server.js
├── services/
│   ├── index.js          # Barrel exports
│   ├── api.js
│   ├── auth.js
│   └── user.js
├── utils/
│   ├── index.js
│   ├── string.js
│   ├── date.js
│   └── validation.js
├── models/
│   ├── index.js
│   ├── User.js
│   └── Post.js
└── middleware/
    ├── index.js
    ├── auth.js
    └── validation.js
*/
```

### 6. Data Structures and Collections

```javascript
// Map - key-value with any type keys
const userCache = new Map();
userCache.set('user:1', { id: 1, name: 'John' });
userCache.set('user:2', { id: 2, name: 'Jane' });

// Map iteration
for (const [key, value] of userCache) {
  console.log(key, value);
}

// Map with object keys
const objectMap = new Map();
const key1 = { id: 1 };
const key2 = { id: 2 };
objectMap.set(key1, 'value1');
objectMap.set(key2, 'value2');

// Set - unique values
const uniqueIds = new Set([1, 2, 3, 1, 2]); // Set(3) {1, 2, 3}
uniqueIds.add(4);
uniqueIds.has(1); // true
uniqueIds.delete(1);

// Set operations
const setA = new Set([1, 2, 3, 4]);
const setB = new Set([3, 4, 5, 6]);

const union = new Set([...setA, ...setB]);
const intersection = new Set([...setA].filter(x => setB.has(x)));
const difference = new Set([...setA].filter(x => !setB.has(x)));

// WeakMap - garbage-collected keys
const privateData = new WeakMap();

class User {
  constructor(name, secret) {
    privateData.set(this, { secret });
    this.name = name;
  }

  getSecret() {
    return privateData.get(this).secret;
  }
}

// WeakSet - garbage-collected values
const visitedNodes = new WeakSet();

function traverseOnce(node) {
  if (visitedNodes.has(node)) return;
  visitedNodes.add(node);
  // Process node
}

// Typed Arrays for binary data
const buffer = new ArrayBuffer(16);
const int32View = new Int32Array(buffer);
const float64View = new Float64Array(buffer);

int32View[0] = 42;
float64View[1] = 3.14;

// Proxy for reactive objects
function reactive(target) {
  return new Proxy(target, {
    get(obj, prop) {
      console.log(`Getting ${prop}`);
      return obj[prop];
    },
    set(obj, prop, value) {
      console.log(`Setting ${prop} to ${value}`);
      obj[prop] = value;
      return true;
    },
  });
}

const state = reactive({ count: 0 });
state.count++; // Logs: Getting count, Setting count to 1
```

### 7. Testing Patterns

```javascript
// Jest/Vitest test structure
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { UserService } from './user.service.js';
import { ApiService } from './api.service.js';

// Mock the API service
vi.mock('./api.service.js');

describe('UserService', () => {
  let userService;
  let mockApi;

  beforeEach(() => {
    mockApi = {
      get: vi.fn(),
      post: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
    };
    userService = new UserService(mockApi);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getUser', () => {
    it('should return user when found', async () => {
      const mockUser = { id: '1', name: 'John', email: 'john@example.com' };
      mockApi.get.mockResolvedValue(mockUser);

      const user = await userService.getUser('1');

      expect(mockApi.get).toHaveBeenCalledWith('/users/1');
      expect(user).toEqual(mockUser);
    });

    it('should throw NotFoundError when user not found', async () => {
      mockApi.get.mockRejectedValue({ status: 404 });

      await expect(userService.getUser('999'))
        .rejects.toThrow('User not found');
    });
  });

  describe('createUser', () => {
    it('should create user with valid data', async () => {
      const userData = { name: 'John', email: 'john@example.com' };
      const createdUser = { id: '1', ...userData };
      mockApi.post.mockResolvedValue(createdUser);

      const user = await userService.createUser(userData);

      expect(mockApi.post).toHaveBeenCalledWith('/users', userData);
      expect(user).toEqual(createdUser);
    });

    it('should throw ValidationError for invalid email', async () => {
      const userData = { name: 'John', email: 'invalid' };

      await expect(userService.createUser(userData))
        .rejects.toThrow('Invalid email format');
    });
  });
});

// Integration test example
describe('UserService Integration', () => {
  it('should create and fetch user', async () => {
    const userService = new UserService(new ApiService('/api'));

    const created = await userService.createUser({
      name: 'Test User',
      email: 'test@example.com',
    });

    const fetched = await userService.getUser(created.id);

    expect(fetched.name).toBe('Test User');
    expect(fetched.email).toBe('test@example.com');
  });
});

// Testing async code
describe('Async operations', () => {
  it('should handle promises', async () => {
    const result = await asyncOperation();
    expect(result).toBe('expected');
  });

  it('should handle rejected promises', async () => {
    await expect(failingOperation()).rejects.toThrow('error message');
  });

  it('should use fake timers', () => {
    vi.useFakeTimers();

    const callback = vi.fn();
    setTimeout(callback, 1000);

    vi.advanceTimersByTime(1000);

    expect(callback).toHaveBeenCalled();

    vi.useRealTimers();
  });
});
```

## Use Cases

### Event Emitter Pattern

```javascript
class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(event, listener) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event).add(listener);
    return () => this.off(event, listener);
  }

  off(event, listener) {
    const listeners = this.events.get(event);
    if (listeners) {
      listeners.delete(listener);
    }
  }

  once(event, listener) {
    const wrapper = (...args) => {
      listener(...args);
      this.off(event, wrapper);
    };
    return this.on(event, wrapper);
  }

  emit(event, ...args) {
    const listeners = this.events.get(event);
    if (listeners) {
      for (const listener of listeners) {
        listener(...args);
      }
    }
  }
}

// Usage
const emitter = new EventEmitter();

const unsubscribe = emitter.on('user:created', user => {
  console.log('User created:', user);
});

emitter.emit('user:created', { id: 1, name: 'John' });
unsubscribe();
```

### State Machine

```javascript
function createStateMachine(config) {
  let currentState = config.initial;

  return {
    get state() {
      return currentState;
    },

    can(event) {
      const stateConfig = config.states[currentState];
      return stateConfig?.on?.[event] !== undefined;
    },

    transition(event, payload) {
      const stateConfig = config.states[currentState];
      const transition = stateConfig?.on?.[event];

      if (!transition) {
        throw new Error(`Invalid transition: ${event} from ${currentState}`);
      }

      const nextState = typeof transition === 'string'
        ? transition
        : transition.target;

      // Execute exit action
      stateConfig?.exit?.();

      // Execute transition action
      if (typeof transition === 'object' && transition.action) {
        transition.action(payload);
      }

      currentState = nextState;

      // Execute entry action
      config.states[nextState]?.entry?.();

      return currentState;
    },
  };
}

// Usage
const orderMachine = createStateMachine({
  initial: 'pending',
  states: {
    pending: {
      on: {
        CONFIRM: 'confirmed',
        CANCEL: 'cancelled',
      },
    },
    confirmed: {
      entry: () => console.log('Order confirmed!'),
      on: {
        SHIP: 'shipped',
        CANCEL: 'cancelled',
      },
    },
    shipped: {
      on: {
        DELIVER: 'delivered',
      },
    },
    delivered: {
      entry: () => console.log('Order delivered!'),
    },
    cancelled: {
      entry: () => console.log('Order cancelled'),
    },
  },
});

orderMachine.transition('CONFIRM');
orderMachine.transition('SHIP');
orderMachine.transition('DELIVER');
```

## Best Practices

### Do's

- Use `const` by default, `let` when needed
- Use arrow functions for callbacks
- Use template literals for string interpolation
- Use destructuring for cleaner code
- Use async/await over raw promises
- Use optional chaining and nullish coalescing
- Use modules (ESM) for code organization
- Handle errors explicitly
- Write pure functions when possible
- Use meaningful variable and function names

### Don'ts

- Don't use `var` - use `const` or `let`
- Don't use `==` - use `===` for comparisons
- Don't mutate function arguments
- Don't use `arguments` - use rest parameters
- Don't nest callbacks deeply (callback hell)
- Don't ignore promise rejections
- Don't use `eval()` or `Function()` constructor
- Don't rely on type coercion
- Don't pollute the global namespace
- Don't use synchronous operations in async code

## References

- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [ECMAScript Specification](https://tc39.es/ecma262/)
- [JavaScript Info](https://javascript.info/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)
