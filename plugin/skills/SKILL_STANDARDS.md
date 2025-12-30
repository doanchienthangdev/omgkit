# OMGKIT Skill Standards v2.0

> Claude-Standard, BigTech-Level Skill Development Guidelines
> *Aligned with Agent-Quality Documentation*

This document defines the quality standards for all OMGKIT skills. Every skill MUST follow these guidelines to ensure consistency, comprehensiveness, and production-readiness.

---

## 1. Frontmatter Requirements

Every skill MUST have complete YAML frontmatter:

```yaml
---
name: skill-name
description: One-line description of what the skill does and when to use it
category: category-name  # One of: backend, databases, devops, frameworks, frontend, integrations, languages, methodology, mobile, omega, security, testing, tools
triggers:
  - keyword1
  - keyword2
  - phrase trigger
  - technology name
---
```

### Frontmatter Rules:
- `name`: lowercase, hyphen-separated (e.g., `api-architecture`)
- `description`: 60-120 characters, action-oriented (e.g., "Enterprise API design with REST, GraphQL patterns")
- `category`: MUST be one of the defined categories
- `triggers`: 5-10 keywords/phrases that should activate this skill

---

## 2. Document Structure (Agent-Aligned)

Every skill MUST follow this structure in order:

```markdown
# Skill Name

{One paragraph overview - 2-3 sentences explaining the skill at a high level}

## Core Philosophy  ← NEW: Required Section

> "A memorable quote or principle that captures the essence"

{2-3 paragraphs explaining WHY this technology/approach matters.
What mental model should developers adopt?}

### Guiding Principles
1. **Principle Name**: Brief explanation
2. **Principle Name**: Brief explanation
3. **Principle Name**: Brief explanation (minimum 3)

## Purpose

{Why this skill matters and when to use it}

- Bullet point 1
- Bullet point 2
- Bullet point 3 (minimum 5 points)

## Features

### 1. Feature Name

{Brief explanation}

```language
{Production-ready code example}
```

### 2. Feature Name
...

### N. Feature Name (minimum 5 features)
...

## Decision Framework  ← NEW: Required Section

### When to Use [Pattern A] vs [Pattern B]

| Decision Point | Pattern A | Pattern B |
|---|---|---|
| Use when... | Condition | Condition |
| Avoid when... | Condition | Condition |

### Decision Tree
```
Question 1?
├─ Yes: Use Pattern A
└─ No: Question 2?
     ├─ Yes: Use Pattern B
     └─ No: Use Pattern C
```

## Use Cases

### Use Case 1: [Industry Context]
```language
{Real-world implementation}
```

### Use Case 2
...

## Anti-Patterns  ← ENHANCED: Visual Formatting

### ❌ Anti-Pattern Name
```language
// Wrong approach
{bad code example}
```
**Why it's problematic**:
- Reason 1
- Reason 2

### ✅ Correct Approach
```language
// Better approach
{good code example}
```

## Best Practices

### Do's
- ✓ Practice 1 - *Brief explanation*
- ✓ Practice 2 - *Brief explanation* (minimum 5)

### Don'ts
- ✗ Anti-pattern 1 - *Why it's bad*
- ✗ Anti-pattern 2 - *Why it's bad* (minimum 5)

## Scaling Considerations  ← NEW: Required for Technical Skills

### At Small Scale (1K-10K)
- Configuration/recommendation

### At Medium Scale (10K-100K)
- Configuration/recommendation

### At Large Scale (100K+)
- Configuration/recommendation

## Commands  ← NEW: Optional but Recommended

- `/skill:action` - Description
- `/skill:variant` - Description

## Related Skills

- **skill-name** - How it relates
- **skill-name** - How it relates (minimum 3)

## References

- [Link 1](url)
- [Link 2](url) (minimum 3 references)
```

---

## 3. Content Quality Standards

### 3.1 Overview Paragraph
- MUST be 2-3 sentences
- MUST include bold emphasis on key technology
- MUST mention "following industry best practices" or similar
- Example: "Enterprise-grade **TypeScript development** following industry best practices."

### 3.2 Core Philosophy Section (NEW)
- MUST open with a memorable quote or principle
- MUST explain the "why" at a conceptual level
- MUST include 3+ guiding principles
- Should help developers build mental models
- Example structure:
```markdown
## Core Philosophy

> "Design for the access patterns, not the data model."

MongoDB excels when you think about how data will be queried rather than
how it's related. Unlike relational databases that normalize first and
join later, document databases let you structure data around your queries.

### Guiding Principles
1. **Access Pattern First**: Define your queries before designing schemas
2. **Strategic Denormalization**: Store related data together when read together
3. **Indexing Strategy**: Every query should have an index
```

### 3.3 Purpose Section
- MUST explain the "why" not just the "what"
- MUST include at least 5 specific capabilities
- MUST be action-oriented (e.g., "Design APIs that scale")

### 3.4 Features Section
- MUST have at least 5 numbered features (### 1., ### 2., etc.)
- MUST include production-ready code examples
- Code examples MUST be:
  - Complete (not snippets with `...`)
  - Properly typed (for typed languages)
  - Include comments explaining key concepts
  - Follow the technology's best practices

### 3.5 Decision Framework Section (NEW)
- MUST help developers choose between approaches
- SHOULD include comparison tables
- SHOULD include decision trees where applicable
- Example:
```markdown
## Decision Framework

### Embedding vs Referencing

| Factor | Embed | Reference |
|--------|-------|-----------|
| Read together? | Always | Sometimes |
| Update frequency | Low | High |
| Array size | <100 | >100 |
| Data duplication | Acceptable | Not acceptable |
```

### 3.6 Code Examples Requirements
- MUST use modern syntax (ES2022+, Python 3.10+, etc.)
- MUST include proper error handling
- MUST show both the "what" and "why" in comments
- MUST be copy-paste ready
- SHOULD include TypeScript/type hints where applicable

### 3.7 Use Cases Section
- MUST include at least 2 real-world scenarios
- MUST be complete, runnable examples
- SHOULD cover common industry patterns (e-commerce, SaaS, etc.)

### 3.8 Anti-Patterns Section (ENHANCED)
- MUST use visual formatting (❌ and ✅)
- MUST show both wrong and correct code
- MUST explain WHY the anti-pattern is problematic
- Example:
```markdown
### ❌ Silent Error Swallowing
```typescript
try {
  await riskyOperation();
} catch (err) {
  console.log(err); // Lost forever!
}
```
**Why it's problematic**:
- Errors disappear without notification
- No way to debug production issues
- Users see broken state without explanation

### ✅ Proper Error Handling
```typescript
try {
  await riskyOperation();
} catch (err) {
  logger.error('Operation failed', { error: err, context });
  throw new AppError('Operation failed', { cause: err });
}
```
```

### 3.9 Best Practices Section
- MUST have separate Do's and Don'ts subsections
- MUST include at least 5 items in each
- MUST be actionable and specific
- SHOULD explain WHY each practice matters
- SHOULD use ✓ and ✗ symbols for clarity

### 3.10 Scaling Considerations Section (NEW)
- MUST include guidance for different scales
- SHOULD cover at least 3 scale levels
- SHOULD be specific to the technology
- Example:
```markdown
## Scaling Considerations

### At 10K Records
- Single instance sufficient
- Basic indexes on primary keys
- Memory: <1GB

### At 100K Records
- Add read replicas
- Analyze slow query log
- Consider caching layer
- Memory: 1-10GB

### At 1M+ Records
- Sharding strategy required
- Multiple indexes needed
- CDN for static assets
- Memory: 10GB+
```

### 3.11 Commands Section (NEW - Optional)
- Define invocation patterns if applicable
- Use slash command format
- Group by purpose:
```markdown
## Commands

### Design Commands
- `/mongodb:schema` - Design database schema
- `/mongodb:index` - Create indexing strategy

### Optimization Commands
- `/mongodb:optimize` - Analyze and optimize queries
- `/mongodb:profile` - Profile database performance
```

### 3.12 Related Skills Section
- MUST include at least 3 related skills
- MUST explain HOW they relate
- Format: `**skill-name** - relationship description`

### 3.13 References Section
- MUST include at least 3 authoritative links
- MUST include official documentation
- SHOULD include community resources

---

## 4. Length Requirements

| Skill Type | Minimum Lines | Target Lines |
|------------|---------------|--------------|
| Frameworks | 400 | 600+ |
| Languages | 350 | 500+ |
| Databases | 350 | 500+ |
| DevOps | 300 | 450+ |
| Security | 350 | 500+ |
| Testing | 300 | 450+ |
| Methodology | 300 | 450+ |
| Frontend | 300 | 450+ |
| Backend | 400 | 600+ |
| Integrations | 400 | 600+ |
| Tools | 400 | 600+ |
| Mobile | 350 | 500+ |
| Omega | 500 | 700+ |

---

## 5. Visual Formatting Standards

### 5.1 Use Visual Markers
- ✓ for positive/recommended
- ✗ for negative/avoid
- ❌ for anti-patterns
- ✅ for correct approaches
- → for flow/sequence
- ⚠️ for warnings (sparingly)

### 5.2 ASCII Diagrams
Include ASCII diagrams for:
- Architecture overviews
- Data flow
- Decision trees
- Process flows

Example:
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│   Server    │────▶│  Database   │
└─────────────┘     └─────────────┘     └─────────────┘
```

### 5.3 Tables for Comparisons
Use tables when comparing:
- Options/alternatives
- Trade-offs
- Configuration options
- Feature comparisons

---

## 6. Language/Technology Specific Guidelines

### TypeScript/JavaScript Skills
- Always use TypeScript with strict types
- Include interface/type definitions
- Show async/await patterns
- Include error handling

### Python Skills
- Use type hints throughout
- Show both sync and async patterns
- Include Pydantic for validation
- Follow PEP 8

### Database Skills
- Include schema design
- Show query optimization
- Include index strategies
- Show transaction patterns
- Add scaling considerations

### DevOps Skills
- Include complete configuration files
- Show security considerations
- Include health checks
- Show production vs development configs

### Framework Skills
- Show project structure
- Include routing patterns
- Show data fetching
- Include testing patterns

---

## 7. Quality Checklist

Before finalizing a skill, verify:

### Structure
- [ ] Frontmatter is complete with all required fields
- [ ] 5+ triggers are defined
- [ ] Overview is 2-3 sentences with bold key term
- [ ] Core Philosophy section with quote and principles
- [ ] Purpose section has 5+ specific capabilities

### Content
- [ ] 5+ numbered features with code examples
- [ ] All code is production-ready and runnable
- [ ] Decision Framework with comparison table
- [ ] 2+ use cases with complete examples

### Best Practices
- [ ] Anti-patterns with ❌/✅ visual formatting
- [ ] Do's section has 5+ items with ✓
- [ ] Don'ts section has 5+ items with ✗
- [ ] Scaling considerations for technical skills

### References
- [ ] 3+ related skills referenced
- [ ] 3+ reference links included

### Quality
- [ ] Meets minimum line count for category
- [ ] No placeholder text or `...` in code
- [ ] ASCII diagrams where helpful

---

## 8. Anti-Patterns to Avoid in Skill Writing

### ❌ Don't: Generic Descriptions
```markdown
## Purpose
Use for MongoDB development.
```

### ✅ Do: Specific, Actionable Descriptions
```markdown
## Purpose
Build production-ready document databases with confidence:
- Design schemas optimized for your query patterns
- Implement aggregation pipelines for complex analytics
- Configure sharding for horizontal scalability
```

### ❌ Don't: Incomplete Code
```typescript
const user = await db.users.findOne({ ... });
// Handle result
```

### ✅ Do: Complete, Production-Ready Code
```typescript
interface User {
  _id: ObjectId;
  email: string;
  name: string;
}

async function findUserByEmail(email: string): Promise<User | null> {
  const user = await db.collection<User>('users').findOne({
    email: email.toLowerCase()
  });

  if (!user) {
    logger.debug('User not found', { email });
    return null;
  }

  return user;
}
```

### ❌ Don't: Skip Decision Guidance
```markdown
## Features
### 1. Embedding
{shows embedding}

### 2. Referencing
{shows referencing}
```

### ✅ Do: Include Decision Framework
```markdown
## Decision Framework

### When to Embed vs Reference

| Factor | Embed | Reference |
|--------|-------|-----------|
| Data read together | Always | Sometimes |
| Update frequency | Rarely | Frequently |
| Array growth | Bounded | Unbounded |

### Decision Tree
```
Is the data always read together?
├─ Yes: Is the array bounded (<100 items)?
│       ├─ Yes: → Embed
│       └─ No: → Reference with subset pattern
└─ No: → Reference
```
```

---

## 9. Example: Ideal Skill Structure (v2.0)

```markdown
---
name: example-skill
description: Example skill demonstrating ideal structure with complete patterns
category: frameworks
triggers:
  - example
  - demo
  - template
  - skill structure
---

# Example Skill

Enterprise-grade **example development** following industry best practices.
This skill covers component design, state management, and production deployment.

## Core Philosophy

> "Build components that are easy to use correctly and hard to use incorrectly."

Great component design anticipates how developers will use your code.
The best APIs make the right thing easy and the wrong thing obvious.

### Guiding Principles
1. **Composition Over Inheritance**: Build from small, focused pieces
2. **Explicit Over Implicit**: Make behavior obvious, not magical
3. **Fail Fast**: Catch errors early with strong typing and validation

## Purpose

Build production-ready applications with confidence:

- Master component architecture and composition
- Implement efficient state management
- Handle data fetching and caching
- Write comprehensive tests
- Optimize for performance and SEO

## Features

### 1. Component Architecture

Design components that are reusable and testable:

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export function Button({
  variant,
  size,
  disabled = false,
  loading = false,
  onClick,
  children
}: ButtonProps) {
  return (
    <button
      className={cn(
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        loading && 'btn-loading'
      )}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? <Spinner size={size} /> : children}
    </button>
  );
}
```

### 2. State Management
{Complete example}

### 3. Data Fetching
{Complete example}

### 4. Error Handling
{Complete example}

### 5. Testing Patterns
{Complete example}

## Decision Framework

### State Management Options

| Approach | Complexity | Performance | Use When |
|----------|------------|-------------|----------|
| useState | Low | High | Local component state |
| useReducer | Medium | High | Complex local state |
| Context | Medium | Medium | Shared UI state |
| Zustand | Low | High | Global app state |
| Redux | High | High | Large teams, dev tools |

### Decision Tree
```
Is state shared across components?
├─ No: Is state logic complex?
│       ├─ Yes: → useReducer
│       └─ No: → useState
└─ Yes: Is it server state?
        ├─ Yes: → React Query / SWR
        └─ No: → Zustand / Context
```

## Use Cases

### E-commerce Product Page
```typescript
// Complete implementation
```

### Real-time Dashboard
```typescript
// Complete implementation
```

## Anti-Patterns

### ❌ Prop Drilling
```typescript
// Wrong: Passing props through many levels
<App user={user}>
  <Layout user={user}>
    <Sidebar user={user}>
      <UserMenu user={user} /> // 4 levels deep!
    </Sidebar>
  </Layout>
</App>
```
**Why it's problematic**:
- Every intermediate component must know about the prop
- Changes require updating multiple files
- Makes refactoring difficult

### ✅ Context or State Management
```typescript
// Better: Use context for cross-cutting concerns
const UserContext = createContext<User | null>(null);

function UserMenu() {
  const user = useContext(UserContext);
  return <Avatar user={user} />;
}
```

## Best Practices

### Do's
- ✓ Use TypeScript for type safety - *catches errors at compile time*
- ✓ Implement proper error boundaries - *prevents white screen of death*
- ✓ Follow accessibility guidelines - *makes app usable for everyone*
- ✓ Write unit and integration tests - *ensures reliability*
- ✓ Optimize bundle size - *improves load time*

### Don'ts
- ✗ Use `any` types - *defeats TypeScript's purpose*
- ✗ Skip error handling - *creates poor UX*
- ✗ Ignore accessibility - *excludes users*
- ✗ Write untestable code - *increases tech debt*
- ✗ Over-engineer solutions - *adds complexity*

## Scaling Considerations

### Small App (<10 components)
- useState for local state
- Props for component communication
- No external state library needed

### Medium App (10-50 components)
- Context for shared state
- Consider React Query for server state
- Add error boundaries at route level

### Large App (50+ components)
- Zustand or Redux for state management
- React Query for all server state
- Module federation for code splitting
- Component library extraction

## Commands

- `/example:component` - Generate component template
- `/example:hook` - Create custom hook
- `/example:test` - Generate test suite

## Related Skills

- **typescript** - Type system fundamentals
- **testing** - Test patterns and frameworks
- **performance** - Optimization techniques

## References

- [Official Documentation](https://example.com)
- [Best Practices Guide](https://example.com)
- [Community Resources](https://example.com)
```

---

*Updated: 2024-12-30*
*Version: 2.0 - Agent-Aligned Standards*
