---
name: express
description: Express.js development. Use for Express APIs, middleware, routing.
---

# Express.js Skill

## Patterns

### Basic Setup
```javascript
import express from 'express';

const app = express();
app.use(express.json());
```

### Routes
```javascript
app.get('/users', async (req, res) => {
  const users = await db.users.findMany();
  res.json(users);
});

app.post('/users', async (req, res) => {
  const user = await db.users.create(req.body);
  res.status(201).json(user);
});
```

### Middleware
```javascript
function authMiddleware(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  req.user = verifyToken(token);
  next();
}

app.use('/api', authMiddleware);
```

### Error Handler
```javascript
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});
```

## Best Practices
- Use async/await with try/catch
- Use middleware for cross-cutting concerns
- Validate input
- Use proper status codes
