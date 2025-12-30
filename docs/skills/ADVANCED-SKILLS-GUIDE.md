# OMGKIT Advanced Skills Guide v2.0

> **20 New Enterprise-Grade Skills for AI-Native Development**

This comprehensive guide documents the 20 advanced skills added to OMGKIT, following BigTech standards and best practices. Each skill is designed to enhance AI-assisted development workflows with production-ready patterns.

---

## Table of Contents

1. [Overview](#overview)
2. [Skill Categories](#skill-categories)
3. [Phase 1: Core Skills](#phase-1-core-skills)
4. [Phase 2: Integration Skills](#phase-2-integration-skills)
5. [Phase 3: Advanced Skills](#phase-3-advanced-skills)
6. [Skill Relationships](#skill-relationships)
7. [Usage Patterns](#usage-patterns)
8. [Best Practices](#best-practices)

---

## Overview

OMGKIT's advanced skills system provides structured guidance for AI assistants to tackle complex development tasks. Each skill follows a consistent structure:

```yaml
---
name: skill-name
description: Brief description of the skill's purpose
category: category-name
triggers:
  - trigger keywords that activate this skill
---
```

### Skill Structure

Every skill includes:
- **Purpose**: What the skill accomplishes
- **Features**: Detailed capabilities with code examples
- **Use Cases**: Real-world applications
- **Best Practices**: Do's and Don'ts
- **Related Skills**: Cross-references to complementary skills
- **Reference Resources**: External documentation links

---

## Skill Categories

| Category | Skills Count | Focus Area |
|----------|-------------|------------|
| Methodology | 3 | Problem-solving frameworks, thinking patterns |
| Frontend | 1 | UI/UX design systems |
| Tools | 4 | Document processing, MCP, media/image processing |
| DevOps | 3 | Performance, monorepo, observability |
| Integrations | 2 | Payment systems, AI services |
| Mobile | 1 | Cross-platform mobile development |
| Backend | 4 | API design, caching, real-time, event-driven |
| Security | 1 | Security hardening and compliance |
| Databases | 1 | Database optimization |

---

## Phase 1: Core Skills

### 1. Sequential Thinking

**Location**: `plugin/skills/methodology/sequential-thinking/SKILL.md`

**Purpose**: Structure complex reasoning into clear, numbered steps for better problem decomposition and solution development.

**Key Features**:
- **Numbered Thought Sequences**: Every thought gets a unique identifier
- **Branch Management**: Handle parallel exploration paths
- **Thought Relationships**: Track parent-child relationships
- **Progress Tracking**: Monitor exploration depth and coverage

**Triggers**: `sequential thinking`, `step by step`, `structured reasoning`, `thought process`, `logical sequence`

**Code Pattern**:
```typescript
interface Thought {
  id: string;           // e.g., "1", "1.1", "2"
  content: string;
  parentId?: string;
  depth: number;
  metadata: {
    type: 'observation' | 'hypothesis' | 'conclusion' | 'question';
    confidence: number;
    timestamp: Date;
  };
}
```

**Use Cases**:
1. Complex debugging sessions
2. Architecture decision records
3. Root cause analysis
4. Technical documentation

---

### 2. Problem Solving

**Location**: `plugin/skills/methodology/problem-solving/SKILL.md`

**Purpose**: Systematic approach to tackling complex technical challenges using a 5-phase framework.

**Key Features**:
- **5-Phase Framework**: Define → Analyze → Design → Implement → Evaluate
- **Structured Problem Definition**: Clear problem statements with context
- **Root Cause Analysis**: 5 Whys, Fishbone diagrams
- **Solution Evaluation**: Weighted decision matrices

**Triggers**: `problem solving`, `troubleshooting`, `root cause analysis`, `debugging strategy`, `systematic approach`

**The 5-Phase Framework**:
```
DEFINE → ANALYZE → DESIGN → IMPLEMENT → EVALUATE
   ↑         |         |          |          |
   |         v         v          v          |
   ←←←←←←←←←←←←← Feedback Loop ←←←←←←←←←←←←←
```

**Best Practices**:
- Always start with problem definition
- Document hypotheses before testing
- Use data to validate assumptions
- Iterate based on feedback

---

### 3. Advanced UI Design

**Location**: `plugin/skills/frontend/advanced-ui-design/SKILL.md`

**Purpose**: Create exceptional user interfaces following the BRSP Framework for world-class design implementation.

**The BRSP Framework**:
```
BEAUTIFUL → RIGHT → SATISFYING → PEAK
    ↓          ↓          ↓          ↓
 Visual    Correct   Delightful  Optimal
 Appeal   Behavior   Experience  Performance
```

**Key Features**:
- **Design System Implementation**: Tokens, components, patterns
- **Animation & Micro-interactions**: Spring physics, orchestration
- **Responsive Design Excellence**: Fluid typography, container queries
- **Accessibility First**: WCAG 2.1 AA compliance

**Triggers**: `advanced ui`, `design system`, `beautiful ui`, `micro-interactions`, `animation`, `responsive design`

**Code Pattern**:
```typescript
const designTokens = {
  colors: {
    primary: { 50: '#f0f9ff', 500: '#0ea5e9', 900: '#0c4a6e' },
  },
  spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px' },
  typography: {
    fontFamily: { sans: 'Inter, system-ui, sans-serif' },
    fontSize: { base: 'clamp(1rem, 0.5vw + 0.9rem, 1.125rem)' },
  },
};
```

---

### 4. Document Processing

**Location**: `plugin/skills/tools/document-processing/SKILL.md`

**Purpose**: Handle document operations including parsing, generation, and transformation across PDF, DOCX, XLSX, and PPTX formats.

**Key Features**:
- **PDF Operations**: pdf-lib, pdfjs-dist for read/write/merge
- **Word Documents**: docx library for generation
- **Excel Processing**: exceljs for data manipulation
- **PowerPoint**: pptxgenjs for presentation creation

**Triggers**: `document processing`, `pdf`, `docx`, `excel`, `spreadsheet`, `powerpoint`, `file parsing`

**Code Pattern**:
```typescript
// PDF Generation
const pdfDoc = await PDFDocument.create();
const page = pdfDoc.addPage([595, 842]); // A4 size
page.drawText('Hello, World!', { x: 50, y: 750, size: 24 });

// Excel Processing
const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('Data');
worksheet.addRow(['Name', 'Email', 'Date']);
```

---

### 5. MCP Development

**Location**: `plugin/skills/tools/mcp-development/SKILL.md`

**Purpose**: Build Model Context Protocol (MCP) servers for AI tool integration and extended capabilities.

**Key Features**:
- **Server Architecture**: StdioServerTransport, tool registration
- **Tool Development**: Input schemas, handlers, validation
- **Resource Management**: File access, database connections
- **Error Handling**: Graceful degradation, logging

**Triggers**: `mcp`, `model context protocol`, `ai tools`, `tool server`, `mcp server`

**Code Pattern**:
```typescript
const server = new Server(
  { name: 'my-mcp-server', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [{
    name: 'search',
    description: 'Search for information',
    inputSchema: { type: 'object', properties: { query: { type: 'string' } } }
  }]
}));
```

---

### 6. Performance Profiling

**Location**: `plugin/skills/devops/performance-profiling/SKILL.md`

**Purpose**: Measure and optimize application performance using systematic profiling and analysis.

**Key Features**:
- **Lighthouse Integration**: Automated performance audits
- **Core Web Vitals**: LCP, FID, CLS monitoring
- **Chrome DevTools Profiling**: CPU, memory, network analysis
- **Custom Performance Marks**: User timing API

**Triggers**: `performance profiling`, `lighthouse`, `core web vitals`, `performance audit`, `optimization`

**Key Metrics**:
```typescript
interface PerformanceMetrics {
  LCP: number;  // Largest Contentful Paint < 2.5s
  FID: number;  // First Input Delay < 100ms
  CLS: number;  // Cumulative Layout Shift < 0.1
  TTFB: number; // Time to First Byte < 800ms
  FCP: number;  // First Contentful Paint < 1.8s
}
```

---

### 7. Research Validation

**Location**: `plugin/skills/methodology/research-validation/SKILL.md`

**Purpose**: Validate technical decisions and claims through rigorous multi-source research.

**Key Features**:
- **Multi-Source Validation**: Cross-reference multiple sources
- **Source Quality Assessment**: Authority, recency, bias detection
- **Evidence Synthesis**: Combine findings into recommendations
- **Uncertainty Quantification**: Confidence levels, caveats

**Triggers**: `research validation`, `fact checking`, `source verification`, `technical research`, `evidence-based`

**Validation Framework**:
```typescript
interface ResearchValidation {
  claim: string;
  sources: Source[];
  validationStatus: 'confirmed' | 'partially-confirmed' | 'unconfirmed' | 'contradicted';
  confidence: number; // 0-100
  synthesizedConclusion: string;
  caveats: string[];
}
```

---

## Phase 2: Integration Skills

### 8. Payment Integration

**Location**: `plugin/skills/integrations/payment-integration/SKILL.md`

**Purpose**: Implement secure payment processing with Stripe, PayPal, and LemonSqueezy.

**Key Features**:
- **Stripe Integration**: Checkout sessions, webhooks, subscriptions
- **PayPal Integration**: Orders API, Smart Buttons
- **LemonSqueezy**: Digital products, licensing
- **Security**: PCI compliance, webhook verification

**Triggers**: `payment`, `stripe`, `paypal`, `checkout`, `subscription`, `billing`

**Code Pattern**:
```typescript
// Stripe Checkout
const session = await stripe.checkout.sessions.create({
  line_items: [{ price: priceId, quantity: 1 }],
  mode: 'subscription',
  success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${baseUrl}/cancel`,
});
```

**Security Requirements**:
- Verify webhook signatures
- Never log full card numbers
- Use idempotency keys
- Implement retry logic

---

### 9. Mobile Development

**Location**: `plugin/skills/mobile/mobile-development/SKILL.md`

**Purpose**: Build cross-platform mobile applications with React Native and Expo.

**Key Features**:
- **Expo Workflow**: Managed and bare workflows
- **Navigation**: React Navigation patterns
- **Native Modules**: Platform-specific code
- **App Store Deployment**: iOS and Android release

**Triggers**: `mobile`, `react native`, `expo`, `ios`, `android`, `cross-platform`

**Code Pattern**:
```typescript
// Expo Router Navigation
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Link href="/profile" asChild>
        <Pressable>
          <Text>Go to Profile</Text>
        </Pressable>
      </Link>
    </View>
  );
}
```

---

### 10. Media Processing

**Location**: `plugin/skills/tools/media-processing/SKILL.md`

**Purpose**: Handle audio and video processing with ffmpeg and Node.js.

**Key Features**:
- **Video Transcoding**: Format conversion, quality optimization
- **Audio Processing**: Extraction, normalization, effects
- **Thumbnail Generation**: Video previews, sprites
- **Streaming**: HLS, DASH adaptive streaming

**Triggers**: `media processing`, `video`, `audio`, `ffmpeg`, `transcoding`, `streaming`

**Code Pattern**:
```typescript
// Video transcoding with fluent-ffmpeg
ffmpeg(inputPath)
  .outputOptions([
    '-c:v libx264',
    '-preset fast',
    '-crf 22',
    '-c:a aac',
    '-b:a 128k'
  ])
  .output(outputPath)
  .on('end', () => console.log('Transcoding complete'))
  .run();
```

---

### 11. Image Processing

**Location**: `plugin/skills/tools/image-processing/SKILL.md`

**Purpose**: Optimize and transform images using Sharp and modern formats.

**Key Features**:
- **Format Conversion**: WebP, AVIF, JPEG XL
- **Responsive Images**: srcset generation, art direction
- **Optimization**: Quality tuning, metadata stripping
- **Transformations**: Resize, crop, watermark

**Triggers**: `image processing`, `sharp`, `image optimization`, `webp`, `responsive images`

**Code Pattern**:
```typescript
// Generate responsive images
const sizes = [320, 640, 768, 1024, 1280, 1920];
await Promise.all(
  sizes.map(width =>
    sharp(input)
      .resize(width)
      .webp({ quality: 80 })
      .toFile(`output-${width}.webp`)
  )
);
```

---

### 12. AI Integration

**Location**: `plugin/skills/integrations/ai-integration/SKILL.md`

**Purpose**: Integrate AI services including vision, embeddings, and RAG pipelines.

**Key Features**:
- **Vision APIs**: Image analysis, OCR, object detection
- **Embeddings**: Vector generation, similarity search
- **RAG Pipelines**: Document retrieval, context injection
- **Structured Output**: JSON mode, function calling

**Triggers**: `ai integration`, `vision api`, `embeddings`, `rag`, `vector search`, `llm`

**Code Pattern**:
```typescript
// RAG Pipeline
async function ragQuery(question: string) {
  const embedding = await generateEmbedding(question);
  const documents = await vectorStore.similaritySearch(embedding, 5);
  const context = documents.map(d => d.content).join('\n\n');

  return await llm.complete({
    messages: [
      { role: 'system', content: `Context:\n${context}` },
      { role: 'user', content: question }
    ]
  });
}
```

---

### 13. API Architecture

**Location**: `plugin/skills/backend/api-architecture/SKILL.md`

**Purpose**: Design and implement APIs following REST, GraphQL, and gRPC patterns.

**Key Features**:
- **REST Best Practices**: Resource naming, versioning, HATEOAS
- **GraphQL Design**: Schema design, resolvers, dataloaders
- **gRPC Services**: Protocol buffers, streaming
- **API Gateway Patterns**: Rate limiting, authentication

**Triggers**: `api design`, `rest api`, `graphql`, `grpc`, `api gateway`, `api versioning`

**REST Resource Naming**:
```
GET    /api/v1/users          # List users
POST   /api/v1/users          # Create user
GET    /api/v1/users/:id      # Get user
PUT    /api/v1/users/:id      # Update user
DELETE /api/v1/users/:id      # Delete user
GET    /api/v1/users/:id/posts # Get user's posts
```

---

### 14. Caching Strategies

**Location**: `plugin/skills/backend/caching-strategies/SKILL.md`

**Purpose**: Implement multi-layer caching with Redis, CDN, and HTTP caching.

**Key Features**:
- **Redis Patterns**: Cache-aside, write-through, write-behind
- **CDN Configuration**: Edge caching, purging, preloading
- **HTTP Caching**: Cache-Control headers, ETags
- **Cache Invalidation**: TTL, tag-based, event-driven

**Triggers**: `caching`, `redis`, `cdn`, `cache invalidation`, `performance`, `http caching`

**Code Pattern**:
```typescript
// Cache-aside pattern
async function getUser(id: string): Promise<User> {
  const cacheKey = `user:${id}`;
  let user = await redis.get(cacheKey);

  if (!user) {
    user = await db.users.findById(id);
    await redis.setex(cacheKey, 3600, JSON.stringify(user));
  }

  return typeof user === 'string' ? JSON.parse(user) : user;
}
```

---

## Phase 3: Advanced Skills

### 15. Monorepo Management

**Location**: `plugin/skills/devops/monorepo-management/SKILL.md`

**Purpose**: Manage monorepos with Turborepo and Nx for optimal build performance.

**Key Features**:
- **Workspace Configuration**: Package management, dependency hoisting
- **Task Orchestration**: Pipeline definition, parallel execution
- **Remote Caching**: Vercel Remote Cache, Nx Cloud
- **CI/CD Integration**: Affected-only builds, cache restoration

**Triggers**: `monorepo`, `turborepo`, `nx`, `workspace`, `lerna`, `pnpm workspace`

**Turborepo Config**:
```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "inputs": ["src/**", "tests/**"]
    }
  }
}
```

---

### 16. Real-Time Systems

**Location**: `plugin/skills/backend/real-time-systems/SKILL.md`

**Purpose**: Build real-time applications with WebSockets, SSE, and Socket.io.

**Key Features**:
- **Socket.io Patterns**: Rooms, namespaces, acknowledgments
- **Server-Sent Events**: Unidirectional streaming
- **Redis Pub/Sub**: Horizontal scaling
- **Presence Systems**: Online status, typing indicators

**Triggers**: `real-time`, `websocket`, `socket.io`, `sse`, `live updates`, `push notifications`

**Code Pattern**:
```typescript
// Socket.io with Redis adapter
const io = new Server(server);
io.adapter(createAdapter(pubClient, subClient));

io.on('connection', (socket) => {
  socket.on('join:room', (roomId) => {
    socket.join(roomId);
    io.to(roomId).emit('user:joined', { userId: socket.data.userId });
  });
});
```

---

### 17. Observability

**Location**: `plugin/skills/devops/observability/SKILL.md`

**Purpose**: Implement the three pillars of observability: logging, metrics, and tracing.

**Key Features**:
- **Structured Logging**: Pino, correlation IDs, log levels
- **Metrics Collection**: Prometheus, custom business metrics
- **Distributed Tracing**: OpenTelemetry, span propagation
- **Alerting**: Alert rules, runbooks, on-call

**Triggers**: `observability`, `logging`, `metrics`, `tracing`, `prometheus`, `opentelemetry`

**Three Pillars**:
```
        ┌─────────────────┐
        │  OBSERVABILITY  │
        └────────┬────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
    v            v            v
┌───────┐  ┌─────────┐  ┌─────────┐
│ LOGS  │  │ METRICS │  │ TRACES  │
└───────┘  └─────────┘  └─────────┘
```

---

### 18. Security Hardening

**Location**: `plugin/skills/security/security-hardening/SKILL.md`

**Purpose**: Implement comprehensive security measures following zero-trust principles.

**Key Features**:
- **Zero-Trust Architecture**: mTLS, service mesh
- **Secrets Management**: HashiCorp Vault, rotation
- **Security Headers**: CSP, HSTS, X-Frame-Options
- **Audit Logging**: Compliance, forensics

**Triggers**: `security hardening`, `zero trust`, `secrets management`, `csp`, `security headers`

**Security Checklist**:
```
□ Enable HTTPS everywhere
□ Implement CSP headers
□ Use Vault for secrets
□ Enable audit logging
□ Configure rate limiting
□ Implement WAF rules
□ Enable mTLS for services
□ Regular security scanning
```

---

### 19. Database Optimization

**Location**: `plugin/skills/databases/database-optimization/SKILL.md`

**Purpose**: Optimize database performance through query tuning, indexing, and scaling.

**Key Features**:
- **Query Optimization**: EXPLAIN ANALYZE, N+1 detection
- **Indexing Strategies**: Composite, partial, covering indexes
- **Partitioning**: Range, list, hash partitioning
- **Connection Pooling**: PgBouncer, application-level pools

**Triggers**: `database optimization`, `query optimization`, `indexing`, `partitioning`, `database scaling`

**Code Pattern**:
```sql
-- Identify slow queries
SELECT query, calls, mean_time / 1000 as mean_seconds
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 20;

-- Composite index for common query pattern
CREATE INDEX idx_orders_status_created
ON orders(status, created_at);
```

---

### 20. Event-Driven Architecture

**Location**: `plugin/skills/backend/event-driven-architecture/SKILL.md`

**Purpose**: Build event-driven systems using event sourcing, CQRS, and message brokers.

**Key Features**:
- **Event Sourcing**: Event stores, projections, snapshots
- **CQRS Pattern**: Command/query separation
- **Message Brokers**: RabbitMQ, Kafka, Redis Streams
- **Saga Pattern**: Distributed transactions, compensation

**Triggers**: `event driven`, `event sourcing`, `cqrs`, `message queue`, `kafka`, `rabbitmq`

**Event Sourcing Pattern**:
```typescript
interface DomainEvent {
  eventId: string;
  aggregateId: string;
  aggregateType: string;
  eventType: string;
  payload: Record<string, unknown>;
  metadata: { timestamp: Date; version: number; userId?: string };
}

class EventStore {
  async append(aggregateId: string, events: DomainEvent[]): Promise<void>;
  async getEvents(aggregateId: string, fromVersion?: number): Promise<DomainEvent[]>;
}
```

---

## Skill Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                    SKILL DEPENDENCY MAP                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  sequential-thinking ──┬── problem-solving                   │
│                        └── research-validation               │
│                                                              │
│  advanced-ui-design ───── performance-profiling              │
│                                                              │
│  api-architecture ─────┬── caching-strategies                │
│                        ├── real-time-systems                 │
│                        └── event-driven-architecture         │
│                                                              │
│  database-optimization ┬── caching-strategies                │
│                        └── event-driven-architecture         │
│                                                              │
│  security-hardening ───┬── api-architecture                  │
│                        └── payment-integration               │
│                                                              │
│  observability ────────┬── monorepo-management               │
│                        └── all production skills             │
│                                                              │
│  ai-integration ───────┬── document-processing               │
│                        └── image-processing                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Usage Patterns

### Pattern 1: Feature Development

```
1. sequential-thinking     → Break down requirements
2. problem-solving         → Design solution approach
3. advanced-ui-design      → Create UI components
4. api-architecture        → Design backend API
5. caching-strategies      → Optimize performance
6. observability           → Add monitoring
```

### Pattern 2: System Architecture

```
1. research-validation     → Evaluate technologies
2. api-architecture        → Design service interfaces
3. event-driven-architecture → Plan async communication
4. database-optimization   → Design data layer
5. security-hardening      → Apply security controls
6. observability           → Implement monitoring
```

### Pattern 3: Mobile App Development

```
1. mobile-development      → Setup React Native/Expo
2. advanced-ui-design      → Design mobile UI
3. payment-integration     → Add in-app purchases
4. media-processing        → Handle user media
5. ai-integration          → Add AI features
6. performance-profiling   → Optimize performance
```

---

## Best Practices

### General Guidelines

1. **Always Start with Methodology**
   - Use `sequential-thinking` for complex problems
   - Apply `problem-solving` framework systematically
   - Validate decisions with `research-validation`

2. **Design Before Implementation**
   - Use `api-architecture` before coding APIs
   - Plan `event-driven-architecture` early
   - Design `caching-strategies` upfront

3. **Security from Day One**
   - Apply `security-hardening` principles early
   - Never skip security in `payment-integration`
   - Audit all external integrations

4. **Observability is Non-Negotiable**
   - Add logging, metrics, and tracing from start
   - Set up alerts before going to production
   - Use correlation IDs everywhere

5. **Performance is a Feature**
   - Profile with `performance-profiling` regularly
   - Optimize queries with `database-optimization`
   - Implement caching appropriately

### Anti-Patterns to Avoid

- Building without structured thinking
- Skipping security for speed
- Adding observability as an afterthought
- Premature optimization without profiling
- Ignoring cache invalidation strategies

---

## Quick Reference

| Need | Use This Skill |
|------|----------------|
| Break down complex problem | `sequential-thinking` |
| Debug production issue | `problem-solving` |
| Build beautiful UI | `advanced-ui-design` |
| Process documents | `document-processing` |
| Build AI tools | `mcp-development` |
| Optimize performance | `performance-profiling` |
| Validate decisions | `research-validation` |
| Accept payments | `payment-integration` |
| Build mobile app | `mobile-development` |
| Process video/audio | `media-processing` |
| Optimize images | `image-processing` |
| Integrate AI | `ai-integration` |
| Design APIs | `api-architecture` |
| Implement caching | `caching-strategies` |
| Manage monorepo | `monorepo-management` |
| Build real-time features | `real-time-systems` |
| Monitor production | `observability` |
| Secure application | `security-hardening` |
| Optimize database | `database-optimization` |
| Build event-driven system | `event-driven-architecture` |

---

*Think Omega. Build Omega. Be Omega.* 🔮

**OMGKIT v2.0** | **20 Advanced Skills** | **BigTech Standards**
