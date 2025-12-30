# OMGKIT Advanced Skills - Quick Start Guide

> **Get started with 20 enterprise-grade AI skills in 5 minutes**

---

## Installation

OMGKIT skills are automatically available when you install OMGKIT:

```bash
npm install -g omgkit
# or
npx omgkit@latest
```

---

## How Skills Work

Skills are triggered automatically when you describe a task that matches their trigger keywords. Each skill provides:

1. **Structured guidance** for AI assistants
2. **Code patterns** and best practices
3. **Reference implementations**
4. **Related skill suggestions**

---

## Skill Categories at a Glance

| Category | Skills | When to Use |
|----------|--------|-------------|
| **Methodology** | sequential-thinking, problem-solving, research-validation | Breaking down complex problems, debugging, validating decisions |
| **Frontend** | advanced-ui-design | Building beautiful, accessible UIs |
| **Tools** | document-processing, mcp-development, media-processing, image-processing | File handling, AI tools, media optimization |
| **DevOps** | performance-profiling, monorepo-management, observability | Performance, build systems, monitoring |
| **Integrations** | payment-integration, ai-integration | Payments, AI services |
| **Mobile** | mobile-development | React Native, Expo apps |
| **Backend** | api-architecture, caching-strategies, real-time-systems, event-driven-architecture | APIs, caching, real-time, events |
| **Security** | security-hardening | Security controls, compliance |
| **Databases** | database-optimization | Query optimization, scaling |

---

## Quick Examples

### 1. Debugging an Issue

**Say**: "Help me debug why the API is slow"

**Triggers**: `problem-solving`, `sequential-thinking`, `performance-profiling`

```
AI will:
1. Use sequential-thinking to break down the problem
2. Apply problem-solving 5-phase framework
3. Guide performance profiling with specific tools
```

### 2. Building a Payment System

**Say**: "Add Stripe subscription billing to my app"

**Triggers**: `payment-integration`, `security-hardening`

```
AI will:
1. Provide Stripe integration patterns
2. Show webhook handling code
3. Apply security best practices for PCI compliance
```

### 3. Creating a Real-Time Feature

**Say**: "Add live chat to our application"

**Triggers**: `real-time-systems`, `caching-strategies`, `api-architecture`

```
AI will:
1. Suggest Socket.io or SSE based on needs
2. Show Redis pub/sub for scaling
3. Design proper API endpoints
```

### 4. Optimizing Database Performance

**Say**: "Our database queries are slow"

**Triggers**: `database-optimization`, `caching-strategies`

```
AI will:
1. Show EXPLAIN ANALYZE techniques
2. Suggest indexing strategies
3. Recommend caching layers
```

### 5. Building a Mobile App

**Say**: "Create a React Native app with Expo"

**Triggers**: `mobile-development`, `advanced-ui-design`

```
AI will:
1. Set up Expo Router structure
2. Apply mobile UI patterns
3. Configure native features
```

---

## Skill Trigger Keywords

### Methodology Skills
- `sequential thinking`, `step by step`, `structured reasoning`
- `problem solving`, `troubleshooting`, `root cause analysis`
- `research validation`, `fact checking`, `source verification`

### Frontend Skills
- `advanced ui`, `design system`, `micro-interactions`, `animation`

### Tool Skills
- `document processing`, `pdf`, `docx`, `excel`, `powerpoint`
- `mcp`, `model context protocol`, `ai tools`
- `media processing`, `video`, `audio`, `ffmpeg`
- `image processing`, `sharp`, `webp`, `responsive images`

### DevOps Skills
- `performance profiling`, `lighthouse`, `core web vitals`
- `monorepo`, `turborepo`, `nx`, `workspace`
- `observability`, `logging`, `metrics`, `tracing`

### Integration Skills
- `payment`, `stripe`, `checkout`, `subscription`
- `ai integration`, `embeddings`, `rag`, `vision api`

### Mobile Skills
- `mobile`, `react native`, `expo`, `ios`, `android`

### Backend Skills
- `api design`, `rest api`, `graphql`, `grpc`
- `caching`, `redis`, `cdn`, `cache invalidation`
- `real-time`, `websocket`, `socket.io`, `sse`
- `event driven`, `event sourcing`, `cqrs`, `kafka`

### Security Skills
- `security hardening`, `zero trust`, `secrets management`

### Database Skills
- `database optimization`, `query optimization`, `indexing`

---

## Skill Combinations

### For a New SaaS Product
```
1. problem-solving → Define requirements
2. api-architecture → Design backend
3. advanced-ui-design → Build frontend
4. payment-integration → Add billing
5. security-hardening → Secure everything
6. observability → Monitor production
```

### For Performance Issues
```
1. performance-profiling → Identify bottlenecks
2. database-optimization → Fix slow queries
3. caching-strategies → Add caching layers
4. observability → Set up monitoring
```

### For Real-Time Applications
```
1. real-time-systems → Socket setup
2. event-driven-architecture → Event handling
3. caching-strategies → State management
4. monorepo-management → Code organization
```

---

## File Locations

All skills are located in:

```
plugin/skills/
├── methodology/
│   ├── sequential-thinking/SKILL.md
│   ├── problem-solving/SKILL.md
│   └── research-validation/SKILL.md
├── frontend/
│   └── advanced-ui-design/SKILL.md
├── tools/
│   ├── document-processing/SKILL.md
│   ├── mcp-development/SKILL.md
│   ├── media-processing/SKILL.md
│   └── image-processing/SKILL.md
├── devops/
│   ├── performance-profiling/SKILL.md
│   ├── monorepo-management/SKILL.md
│   └── observability/SKILL.md
├── integrations/
│   ├── payment-integration/SKILL.md
│   └── ai-integration/SKILL.md
├── mobile/
│   └── mobile-development/SKILL.md
├── backend/
│   ├── api-architecture/SKILL.md
│   ├── caching-strategies/SKILL.md
│   ├── real-time-systems/SKILL.md
│   └── event-driven-architecture/SKILL.md
├── security/
│   └── security-hardening/SKILL.md
└── databases/
    └── database-optimization/SKILL.md
```

---

## Further Reading

- **Full Guide**: [ADVANCED-SKILLS-GUIDE.md](./ADVANCED-SKILLS-GUIDE.md)
- **Implementation Reference**: [SKILL-IMPLEMENTATION-REFERENCE.md](./SKILL-IMPLEMENTATION-REFERENCE.md)
- **Master Plan**: [.devlogs/plan-advanced-skills-implementation.md](../../.devlogs/plan-advanced-skills-implementation.md)

---

*Think Omega. Build Omega. Be Omega.* 🔮
