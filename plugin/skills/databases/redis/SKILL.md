---
name: redis
description: Redis caching and data structures with pub/sub, streams, sessions, and rate limiting patterns
category: databases
triggers:
  - redis
  - caching
  - cache
  - pub sub
  - session storage
  - rate limiting
  - ioredis
---

# Redis

Enterprise-grade **Redis development** following industry best practices. This skill covers caching strategies, data structures, pub/sub messaging, streams, sessions, rate limiting, and production-ready patterns used by top engineering teams.

## Purpose

Build high-performance applications with Redis:

- Implement efficient caching strategies
- Use appropriate data structures
- Build real-time features with pub/sub
- Process events with Redis Streams
- Manage user sessions
- Implement rate limiting
- Deploy for high availability

## Features

### 1. Redis Client Setup

```typescript
// src/lib/redis.ts
import Redis from 'ioredis';

const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
  maxRetriesPerRequest: 3,
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  reconnectOnError: (err: Error) => {
    const targetErrors = ['READONLY', 'ECONNRESET'];
    return targetErrors.some(e => err.message.includes(e));
  },
};

// Singleton instance
let redis: Redis | null = null;

export function getRedis(): Redis {
  if (!redis) {
    redis = new Redis(redisConfig);

    redis.on('connect', () => {
      console.log('Redis connected');
    });

    redis.on('error', (err) => {
      console.error('Redis error:', err);
    });

    redis.on('close', () => {
      console.log('Redis connection closed');
    });
  }

  return redis;
}

export async function closeRedis(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
  }
}

// Health check
export async function checkRedisHealth(): Promise<boolean> {
  try {
    const client = getRedis();
    const result = await client.ping();
    return result === 'PONG';
  } catch {
    return false;
  }
}
```

### 2. Caching Service

```typescript
// src/services/cache.service.ts
import Redis from 'ioredis';
import { getRedis } from '../lib/redis';

interface CacheOptions {
  ttl?: number; // seconds
  prefix?: string;
}

export class CacheService {
  private redis: Redis;
  private defaultTTL: number;
  private prefix: string;

  constructor(options: CacheOptions = {}) {
    this.redis = getRedis();
    this.defaultTTL = options.ttl || 3600; // 1 hour
    this.prefix = options.prefix || 'cache:';
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  // Basic get/set
  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(this.getKey(key));
    if (!data) return null;
    return JSON.parse(data) as T;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    const expiry = ttl || this.defaultTTL;
    await this.redis.setex(this.getKey(key), expiry, serialized);
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(this.getKey(key));
  }

  // Get or set pattern
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await factory();
    await this.set(key, value, ttl);
    return value;
  }

  // Cache invalidation patterns
  async invalidatePattern(pattern: string): Promise<number> {
    const keys = await this.redis.keys(`${this.prefix}${pattern}`);
    if (keys.length === 0) return 0;
    return this.redis.del(...keys);
  }

  async invalidateByTags(tags: string[]): Promise<void> {
    const pipeline = this.redis.pipeline();

    for (const tag of tags) {
      const tagKey = `tag:${tag}`;
      const members = await this.redis.smembers(tagKey);

      for (const key of members) {
        pipeline.del(key);
      }
      pipeline.del(tagKey);
    }

    await pipeline.exec();
  }

  // Set with tags for invalidation
  async setWithTags<T>(
    key: string,
    value: T,
    tags: string[],
    ttl?: number
  ): Promise<void> {
    const fullKey = this.getKey(key);
    const pipeline = this.redis.pipeline();

    pipeline.setex(fullKey, ttl || this.defaultTTL, JSON.stringify(value));

    for (const tag of tags) {
      pipeline.sadd(`tag:${tag}`, fullKey);
    }

    await pipeline.exec();
  }

  // Bulk operations
  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    const fullKeys = keys.map(k => this.getKey(k));
    const results = await this.redis.mget(...fullKeys);
    return results.map(r => (r ? JSON.parse(r) : null));
  }

  async mset<T>(entries: Array<{ key: string; value: T; ttl?: number }>): Promise<void> {
    const pipeline = this.redis.pipeline();

    for (const entry of entries) {
      const fullKey = this.getKey(entry.key);
      const serialized = JSON.stringify(entry.value);
      pipeline.setex(fullKey, entry.ttl || this.defaultTTL, serialized);
    }

    await pipeline.exec();
  }
}
```

### 3. Session Management

```typescript
// src/services/session.service.ts
import Redis from 'ioredis';
import { getRedis } from '../lib/redis';
import { randomUUID } from 'crypto';

interface Session {
  id: string;
  userId: string;
  data: Record<string, unknown>;
  createdAt: number;
  expiresAt: number;
}

export class SessionService {
  private redis: Redis;
  private prefix = 'session:';
  private userSessionsPrefix = 'user_sessions:';
  private defaultTTL = 86400 * 7; // 7 days

  constructor() {
    this.redis = getRedis();
  }

  async create(userId: string, data: Record<string, unknown> = {}): Promise<Session> {
    const sessionId = randomUUID();
    const now = Date.now();

    const session: Session = {
      id: sessionId,
      userId,
      data,
      createdAt: now,
      expiresAt: now + this.defaultTTL * 1000,
    };

    const pipeline = this.redis.pipeline();

    // Store session
    pipeline.hset(`${this.prefix}${sessionId}`, {
      userId,
      data: JSON.stringify(data),
      createdAt: now.toString(),
      expiresAt: session.expiresAt.toString(),
    });
    pipeline.expire(`${this.prefix}${sessionId}`, this.defaultTTL);

    // Track user sessions
    pipeline.sadd(`${this.userSessionsPrefix}${userId}`, sessionId);
    pipeline.expire(`${this.userSessionsPrefix}${userId}`, this.defaultTTL);

    await pipeline.exec();

    return session;
  }

  async get(sessionId: string): Promise<Session | null> {
    const data = await this.redis.hgetall(`${this.prefix}${sessionId}`);

    if (!data || !data.userId) {
      return null;
    }

    return {
      id: sessionId,
      userId: data.userId,
      data: JSON.parse(data.data || '{}'),
      createdAt: parseInt(data.createdAt),
      expiresAt: parseInt(data.expiresAt),
    };
  }

  async update(sessionId: string, data: Record<string, unknown>): Promise<void> {
    const exists = await this.redis.exists(`${this.prefix}${sessionId}`);
    if (!exists) {
      throw new Error('Session not found');
    }

    await this.redis.hset(`${this.prefix}${sessionId}`, 'data', JSON.stringify(data));
  }

  async refresh(sessionId: string): Promise<void> {
    const session = await this.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    const newExpiresAt = Date.now() + this.defaultTTL * 1000;

    const pipeline = this.redis.pipeline();
    pipeline.hset(`${this.prefix}${sessionId}`, 'expiresAt', newExpiresAt.toString());
    pipeline.expire(`${this.prefix}${sessionId}`, this.defaultTTL);
    await pipeline.exec();
  }

  async destroy(sessionId: string): Promise<void> {
    const session = await this.get(sessionId);
    if (!session) return;

    const pipeline = this.redis.pipeline();
    pipeline.del(`${this.prefix}${sessionId}`);
    pipeline.srem(`${this.userSessionsPrefix}${session.userId}`, sessionId);
    await pipeline.exec();
  }

  async destroyAllUserSessions(userId: string): Promise<number> {
    const sessionIds = await this.redis.smembers(`${this.userSessionsPrefix}${userId}`);

    if (sessionIds.length === 0) return 0;

    const pipeline = this.redis.pipeline();
    for (const sessionId of sessionIds) {
      pipeline.del(`${this.prefix}${sessionId}`);
    }
    pipeline.del(`${this.userSessionsPrefix}${userId}`);

    await pipeline.exec();
    return sessionIds.length;
  }

  async getUserSessions(userId: string): Promise<Session[]> {
    const sessionIds = await this.redis.smembers(`${this.userSessionsPrefix}${userId}`);

    const sessions: Session[] = [];
    for (const sessionId of sessionIds) {
      const session = await this.get(sessionId);
      if (session) {
        sessions.push(session);
      }
    }

    return sessions;
  }
}
```

### 4. Rate Limiting

```typescript
// src/services/rate-limiter.service.ts
import Redis from 'ioredis';
import { getRedis } from '../lib/redis';

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfter?: number;
}

interface RateLimitConfig {
  points: number; // Number of requests
  duration: number; // Time window in seconds
  blockDuration?: number; // Block duration when exceeded
}

export class RateLimiter {
  private redis: Redis;
  private prefix = 'ratelimit:';

  constructor() {
    this.redis = getRedis();
  }

  // Fixed window rate limiting
  async checkFixedWindow(
    key: string,
    config: RateLimitConfig
  ): Promise<RateLimitResult> {
    const fullKey = `${this.prefix}fixed:${key}`;
    const now = Math.floor(Date.now() / 1000);
    const windowStart = now - (now % config.duration);
    const windowKey = `${fullKey}:${windowStart}`;

    const current = await this.redis.incr(windowKey);

    if (current === 1) {
      await this.redis.expire(windowKey, config.duration);
    }

    const remaining = Math.max(0, config.points - current);
    const resetAt = (windowStart + config.duration) * 1000;

    if (current > config.points) {
      return {
        allowed: false,
        remaining: 0,
        resetAt,
        retryAfter: resetAt - Date.now(),
      };
    }

    return { allowed: true, remaining, resetAt };
  }

  // Sliding window rate limiting
  async checkSlidingWindow(
    key: string,
    config: RateLimitConfig
  ): Promise<RateLimitResult> {
    const fullKey = `${this.prefix}sliding:${key}`;
    const now = Date.now();
    const windowStart = now - config.duration * 1000;

    // Use sorted set for sliding window
    const pipeline = this.redis.pipeline();
    pipeline.zremrangebyscore(fullKey, '-inf', windowStart);
    pipeline.zadd(fullKey, now, `${now}:${Math.random()}`);
    pipeline.zcard(fullKey);
    pipeline.expire(fullKey, config.duration);

    const results = await pipeline.exec();
    const count = results?.[2]?.[1] as number;

    const remaining = Math.max(0, config.points - count);
    const resetAt = now + config.duration * 1000;

    if (count > config.points) {
      // Remove the request we just added
      await this.redis.zremrangebyscore(fullKey, now, now);

      return {
        allowed: false,
        remaining: 0,
        resetAt,
        retryAfter: config.duration * 1000,
      };
    }

    return { allowed: true, remaining, resetAt };
  }

  // Token bucket rate limiting
  async checkTokenBucket(
    key: string,
    config: { capacity: number; refillRate: number }
  ): Promise<RateLimitResult> {
    const fullKey = `${this.prefix}bucket:${key}`;
    const now = Date.now();

    const luaScript = `
      local key = KEYS[1]
      local capacity = tonumber(ARGV[1])
      local refillRate = tonumber(ARGV[2])
      local now = tonumber(ARGV[3])

      local bucket = redis.call('HMGET', key, 'tokens', 'lastRefill')
      local tokens = tonumber(bucket[1]) or capacity
      local lastRefill = tonumber(bucket[2]) or now

      -- Calculate refill
      local elapsed = (now - lastRefill) / 1000
      local refill = elapsed * refillRate
      tokens = math.min(capacity, tokens + refill)

      -- Try to consume a token
      local allowed = 0
      if tokens >= 1 then
        tokens = tokens - 1
        allowed = 1
      end

      redis.call('HMSET', key, 'tokens', tokens, 'lastRefill', now)
      redis.call('EXPIRE', key, 3600)

      return {allowed, tokens}
    `;

    const result = await this.redis.eval(
      luaScript,
      1,
      fullKey,
      config.capacity,
      config.refillRate,
      now
    ) as [number, number];

    return {
      allowed: result[0] === 1,
      remaining: Math.floor(result[1]),
      resetAt: now + Math.ceil((config.capacity - result[1]) / config.refillRate) * 1000,
    };
  }
}

// Express middleware
export function createRateLimitMiddleware(config: RateLimitConfig) {
  const limiter = new RateLimiter();

  return async (req: any, res: any, next: any) => {
    const key = req.ip || req.connection.remoteAddress;
    const result = await limiter.checkSlidingWindow(key, config);

    res.setHeader('X-RateLimit-Limit', config.points);
    res.setHeader('X-RateLimit-Remaining', result.remaining);
    res.setHeader('X-RateLimit-Reset', result.resetAt);

    if (!result.allowed) {
      res.setHeader('Retry-After', Math.ceil((result.retryAfter || 0) / 1000));
      return res.status(429).json({
        error: 'Too many requests',
        retryAfter: result.retryAfter,
      });
    }

    next();
  };
}
```

### 5. Pub/Sub Messaging

```typescript
// src/services/pubsub.service.ts
import Redis from 'ioredis';
import { getRedis } from '../lib/redis';

type MessageHandler = (message: unknown, channel: string) => void | Promise<void>;

export class PubSubService {
  private publisher: Redis;
  private subscriber: Redis;
  private handlers: Map<string, Set<MessageHandler>> = new Map();

  constructor() {
    this.publisher = getRedis();
    this.subscriber = getRedis().duplicate();

    this.subscriber.on('message', (channel, message) => {
      this.handleMessage(channel, message);
    });

    this.subscriber.on('pmessage', (pattern, channel, message) => {
      this.handleMessage(pattern, message, channel);
    });
  }

  private async handleMessage(channel: string, message: string, actualChannel?: string): Promise<void> {
    const handlers = this.handlers.get(channel);
    if (!handlers) return;

    const parsed = JSON.parse(message);
    const targetChannel = actualChannel || channel;

    for (const handler of handlers) {
      try {
        await handler(parsed, targetChannel);
      } catch (error) {
        console.error(`Error handling message on ${targetChannel}:`, error);
      }
    }
  }

  // Subscribe to channel
  async subscribe(channel: string, handler: MessageHandler): Promise<() => void> {
    if (!this.handlers.has(channel)) {
      this.handlers.set(channel, new Set());
      await this.subscriber.subscribe(channel);
    }

    this.handlers.get(channel)!.add(handler);

    return () => {
      const handlers = this.handlers.get(channel);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.handlers.delete(channel);
          this.subscriber.unsubscribe(channel);
        }
      }
    };
  }

  // Subscribe to pattern
  async psubscribe(pattern: string, handler: MessageHandler): Promise<() => void> {
    if (!this.handlers.has(pattern)) {
      this.handlers.set(pattern, new Set());
      await this.subscriber.psubscribe(pattern);
    }

    this.handlers.get(pattern)!.add(handler);

    return () => {
      const handlers = this.handlers.get(pattern);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.handlers.delete(pattern);
          this.subscriber.punsubscribe(pattern);
        }
      }
    };
  }

  // Publish message
  async publish<T>(channel: string, message: T): Promise<number> {
    return this.publisher.publish(channel, JSON.stringify(message));
  }

  // Cleanup
  async close(): Promise<void> {
    await this.subscriber.quit();
  }
}

// Usage example
const pubsub = new PubSubService();

// Subscribe to user events
const unsubscribe = await pubsub.subscribe('user:events', (message, channel) => {
  console.log('User event:', message);
});

// Publish event
await pubsub.publish('user:events', {
  type: 'user.created',
  userId: '123',
  timestamp: Date.now(),
});
```

### 6. Redis Streams

```typescript
// src/services/stream.service.ts
import Redis from 'ioredis';
import { getRedis } from '../lib/redis';

interface StreamMessage {
  id: string;
  fields: Record<string, string>;
}

export class StreamService {
  private redis: Redis;

  constructor() {
    this.redis = getRedis();
  }

  // Add message to stream
  async add(
    stream: string,
    data: Record<string, string | number>,
    maxLen?: number
  ): Promise<string> {
    const fields = Object.entries(data).flat().map(String);

    if (maxLen) {
      return this.redis.xadd(stream, 'MAXLEN', '~', maxLen, '*', ...fields);
    }

    return this.redis.xadd(stream, '*', ...fields);
  }

  // Read messages
  async read(
    stream: string,
    options: { count?: number; block?: number; lastId?: string } = {}
  ): Promise<StreamMessage[]> {
    const { count = 10, block, lastId = '$' } = options;

    const args: (string | number)[] = ['COUNT', count];
    if (block !== undefined) {
      args.push('BLOCK', block);
    }

    const result = await this.redis.xread(...args, 'STREAMS', stream, lastId);

    if (!result) return [];

    return result[0][1].map(([id, fields]: [string, string[]]) => ({
      id,
      fields: this.parseFields(fields),
    }));
  }

  // Consumer group operations
  async createConsumerGroup(
    stream: string,
    group: string,
    startId: string = '$'
  ): Promise<void> {
    try {
      await this.redis.xgroup('CREATE', stream, group, startId, 'MKSTREAM');
    } catch (error: any) {
      if (!error.message.includes('BUSYGROUP')) {
        throw error;
      }
    }
  }

  async readGroup(
    stream: string,
    group: string,
    consumer: string,
    options: { count?: number; block?: number } = {}
  ): Promise<StreamMessage[]> {
    const { count = 10, block = 5000 } = options;

    const result = await this.redis.xreadgroup(
      'GROUP', group, consumer,
      'COUNT', count,
      'BLOCK', block,
      'STREAMS', stream, '>'
    );

    if (!result) return [];

    return result[0][1].map(([id, fields]: [string, string[]]) => ({
      id,
      fields: this.parseFields(fields),
    }));
  }

  async acknowledge(stream: string, group: string, ...ids: string[]): Promise<number> {
    return this.redis.xack(stream, group, ...ids);
  }

  async getPendingMessages(
    stream: string,
    group: string,
    consumer?: string
  ): Promise<any> {
    if (consumer) {
      return this.redis.xpending(stream, group, '-', '+', 100, consumer);
    }
    return this.redis.xpending(stream, group);
  }

  private parseFields(fields: string[]): Record<string, string> {
    const result: Record<string, string> = {};
    for (let i = 0; i < fields.length; i += 2) {
      result[fields[i]] = fields[i + 1];
    }
    return result;
  }
}

// Stream consumer worker
async function startStreamWorker(
  stream: string,
  group: string,
  consumer: string,
  handler: (message: StreamMessage) => Promise<void>
) {
  const streamService = new StreamService();
  await streamService.createConsumerGroup(stream, group);

  while (true) {
    try {
      const messages = await streamService.readGroup(stream, group, consumer);

      for (const message of messages) {
        try {
          await handler(message);
          await streamService.acknowledge(stream, group, message.id);
        } catch (error) {
          console.error('Error processing message:', error);
        }
      }
    } catch (error) {
      console.error('Stream read error:', error);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}
```

## Use Cases

### Distributed Locking

```typescript
async function acquireLock(
  key: string,
  ttl: number = 10000
): Promise<string | null> {
  const redis = getRedis();
  const lockId = randomUUID();

  const acquired = await redis.set(
    `lock:${key}`,
    lockId,
    'PX', ttl,
    'NX'
  );

  return acquired === 'OK' ? lockId : null;
}

async function releaseLock(key: string, lockId: string): Promise<boolean> {
  const redis = getRedis();
  const script = `
    if redis.call("get", KEYS[1]) == ARGV[1] then
      return redis.call("del", KEYS[1])
    else
      return 0
    end
  `;

  const result = await redis.eval(script, 1, `lock:${key}`, lockId);
  return result === 1;
}
```

### Leaderboard

```typescript
class LeaderboardService {
  private redis: Redis;
  private key: string;

  constructor(name: string) {
    this.redis = getRedis();
    this.key = `leaderboard:${name}`;
  }

  async addScore(userId: string, score: number): Promise<void> {
    await this.redis.zadd(this.key, score, userId);
  }

  async getTopN(n: number): Promise<Array<{ userId: string; score: number; rank: number }>> {
    const results = await this.redis.zrevrange(this.key, 0, n - 1, 'WITHSCORES');
    const entries = [];

    for (let i = 0; i < results.length; i += 2) {
      entries.push({
        userId: results[i],
        score: parseFloat(results[i + 1]),
        rank: i / 2 + 1,
      });
    }

    return entries;
  }

  async getUserRank(userId: string): Promise<number | null> {
    const rank = await this.redis.zrevrank(this.key, userId);
    return rank !== null ? rank + 1 : null;
  }
}
```

## Best Practices

### Do's

- Use connection pooling
- Set appropriate TTLs on all keys
- Use pipelines for batch operations
- Implement proper error handling
- Use Lua scripts for atomic operations
- Monitor memory usage
- Set up Redis Sentinel or Cluster for HA
- Use key prefixes for namespacing
- Implement circuit breakers
- Use appropriate data structures

### Don'ts

- Don't store large objects (>100KB)
- Don't use KEYS in production
- Don't skip key expiration
- Don't ignore memory limits
- Don't use single Redis for critical apps
- Don't block on long operations
- Don't store sensitive data unencrypted
- Don't ignore connection errors
- Don't use Redis as primary database
- Don't skip monitoring

## References

- [Redis Documentation](https://redis.io/documentation)
- [ioredis Documentation](https://github.com/luin/ioredis)
- [Redis Best Practices](https://redis.io/docs/management/optimization/)
- [Redis University](https://university.redis.com/)
- [Redis Patterns](https://redis.io/docs/manual/patterns/)
