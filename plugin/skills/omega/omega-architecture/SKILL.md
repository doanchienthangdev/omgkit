---
name: omega-architecture
description: Omega system architecture. Use for designing scalable systems.
---

# Omega Architecture Skill

## 7 Omega Principles Applied

### Ω1. Leverage Multiplication
- Build systems, not features
- Automate everything
- Create multipliers

### Ω2. Transcendent Abstraction
- Solve the class, not instance
- Find patterns behind patterns
- Build frameworks

### Ω3. Agentic Decomposition
- Specialist components
- Clear interfaces
- Autonomous operation

### Ω5. Zero-Marginal-Cost Scaling
- No per-unit cost
- Horizontal scaling
- Platform thinking

## Architecture Patterns

### Event-Driven
```
[Producer] → [Event Bus] → [Consumer]
                       → [Consumer]
                       → [Consumer]
```

### Microservices
```
[API Gateway]
     │
┌────┼────┐
▼    ▼    ▼
[A] [B]  [C]
```

### Serverless
```
[Request] → [Function] → [Database]
                      → [Queue]
                      → [Storage]
```

## Design Questions
1. How does this scale to 1000x?
2. What's the single point of failure?
3. How do we deploy without downtime?
4. What's the cost at scale?
