---
name: redis
description: Redis caching. Use for caching, sessions, pub/sub.
---

# Redis Skill

## Patterns

### Caching
```javascript
// Set with expiry
await redis.set('user:123', JSON.stringify(user), 'EX', 3600);

// Get
const cached = await redis.get('user:123');
if (cached) return JSON.parse(cached);
```

### Session
```javascript
await redis.hset(`session:${id}`, {
  userId: user.id,
  createdAt: Date.now()
});
await redis.expire(`session:${id}`, 86400);
```

### Rate Limiting
```javascript
const key = `rate:${ip}`;
const count = await redis.incr(key);
if (count === 1) await redis.expire(key, 60);
if (count > 100) throw new Error('Rate limited');
```

## Best Practices
- Set TTL on keys
- Use pipelines for batch ops
- Use appropriate data structures
- Monitor memory usage
