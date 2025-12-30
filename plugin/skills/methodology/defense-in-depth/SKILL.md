---
name: defense-in-depth
description: Security defense in depth. Use when designing secure systems.
---

# Defense in Depth Skill

## Layers

### 1. Perimeter
- Firewall
- Rate limiting
- WAF

### 2. Network
- VPC
- Security groups
- TLS everywhere

### 3. Application
- Input validation
- Output encoding
- CSRF protection

### 4. Data
- Encryption at rest
- Encryption in transit
- Access control

### 5. Monitoring
- Logging
- Alerting
- Audit trails

## Principle
> If one layer fails, others protect.

## Implementation
```typescript
// Layer 1: Rate limiting
app.use(rateLimit({ max: 100 }));

// Layer 2: Input validation
const validated = schema.parse(input);

// Layer 3: Parameterized query
db.query('SELECT * FROM users WHERE id = $1', [id]);

// Layer 4: Output encoding
res.json(sanitize(data));
```
