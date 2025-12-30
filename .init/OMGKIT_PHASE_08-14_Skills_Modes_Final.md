# 🔮 OMGKIT Phase 8-11: Skills & Modes

## Hướng Dẫn

Skill format:
```
skills/<category>/<skill-name>/SKILL.md
```

---

## PHASE 8-10: ALL 43 SKILLS

```markdown
Tiếp tục xây dựng OMGKIT. Phase 1-7 đã hoàn thành (23 agents, 54 commands).

Hãy thực hiện Phase 8-10: Tạo 43 Skills.

Skill file format:
```markdown
---
name: skill-name
description: When to activate this skill. Keywords for matching.
---

# Skill Title

## Overview
[What this provides]

## Patterns
[Code patterns and examples]

## Best Practices
[Recommendations]
```

## Tạo Skills theo categories:

### LANGUAGES (3 skills)
Tạo trong plugin/skills/languages/

#### python/SKILL.md
```markdown
---
name: python
description: Python development. Use when writing Python code, using pip, or working with Python frameworks.
---

# Python Skill

## Patterns

### Type Hints
```python
def create_user(email: str, password: str) -> User:
    ...
```

### Async
```python
async def fetch_data() -> dict:
    async with aiohttp.ClientSession() as session:
        ...
```

### Best Practices
- Use type hints
- Use dataclasses or Pydantic
- Use async where appropriate
- Follow PEP 8
```

#### typescript/SKILL.md
```markdown
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

function createUser(input: CreateUserInput): Promise<User> {
  ...
}
```

### Generics
```typescript
type Result<T, E = Error> = 
  | { ok: true; data: T }
  | { ok: false; error: E };
```

## Best Practices
- Enable strict mode
- Use interfaces over types
- Prefer const assertions
- Avoid any
```

#### javascript/SKILL.md
```markdown
---
name: javascript
description: JavaScript development. Use for ES6+, async patterns, DOM manipulation.
---

# JavaScript Skill

## Patterns
- Async/await
- Destructuring
- Spread operator
- Modules (ESM)

## Best Practices
- Use const/let, not var
- Arrow functions
- Template literals
```

### FRAMEWORKS (10 skills)
Tạo trong plugin/skills/frameworks/

Tạo SKILL.md cho mỗi framework với:
- Setup/Installation
- Key patterns
- File structure
- Best practices

Frameworks:
1. **fastapi** - FastAPI with Pydantic
2. **django** - Django patterns
3. **nextjs** - Next.js App Router
4. **react** - React hooks, components
5. **vue** - Vue 3 Composition API
6. **express** - Express.js middleware
7. **nestjs** - NestJS modules, DI
8. **rails** - Ruby on Rails MVC
9. **spring** - Spring Boot
10. **laravel** - Laravel PHP

Ví dụ nextjs/SKILL.md:
```markdown
---
name: nextjs
description: Next.js development. Use for Next.js projects, App Router, Server Components, Server Actions.
---

# Next.js Skill

## App Router

### Server Component (default)
```tsx
async function Page() {
  const data = await fetch(...);
  return <Component data={data} />;
}
```

### Client Component
```tsx
'use client';
import { useState } from 'react';
```

### Server Action
```tsx
'use server';
async function createUser(formData: FormData) {
  ...
  revalidatePath('/users');
}
```

## File Structure
```
app/
├── layout.tsx
├── page.tsx
├── users/
│   ├── page.tsx
│   └── [id]/page.tsx
└── api/
    └── route.ts
```
```

### DATABASES (4 skills)
Tạo trong plugin/skills/databases/

1. **postgresql** - Schema, indexes, queries
2. **mongodb** - Documents, aggregation
3. **redis** - Caching, pub/sub
4. **prisma** - Prisma ORM patterns

### FRONTEND (6 skills)
Tạo trong plugin/skills/frontend/

1. **tailwindcss** - Utility classes, responsive
2. **shadcn-ui** - Component usage
3. **frontend-design** - Design patterns
4. **responsive** - Mobile-first
5. **accessibility** - WCAG, ARIA
6. **threejs** - 3D graphics

Ví dụ tailwindcss/SKILL.md:
```markdown
---
name: tailwindcss
description: Tailwind CSS styling. Use when styling with utility classes.
---

# Tailwind CSS Skill

## Core Utilities
```html
<div class="p-4 m-2">           <!-- Spacing -->
<div class="flex items-center"> <!-- Flexbox -->
<div class="grid grid-cols-3">  <!-- Grid -->
<div class="text-lg font-bold"> <!-- Typography -->
```

## Responsive
```html
<div class="text-sm md:text-base lg:text-lg">
```

## Component Pattern
```html
<button class="
  px-4 py-2
  bg-blue-500 hover:bg-blue-600
  text-white font-medium
  rounded-lg transition-colors
">
```
```

### DEVOPS (4 skills)
Tạo trong plugin/skills/devops/

1. **docker** - Dockerfile, compose
2. **kubernetes** - K8s manifests
3. **github-actions** - CI/CD workflows
4. **aws** - AWS services

Ví dụ docker/SKILL.md:
```markdown
---
name: docker
description: Docker containerization. Use for Dockerfiles, docker-compose, container patterns.
---

# Docker Skill

## Multi-stage Build
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

## Docker Compose
```yaml
services:
  app:
    build: .
    ports: ["3000:3000"]
    depends_on: [db]
  db:
    image: postgres:15
```
```

### SECURITY (3 skills)
Tạo trong plugin/skills/security/

1. **owasp** - OWASP Top 10
2. **better-auth** - Better Auth
3. **oauth** - OAuth 2.0/OIDC

### TESTING (3 skills)
Tạo trong plugin/skills/testing/

1. **pytest** - Python testing
2. **vitest** - JS/TS testing
3. **playwright** - E2E testing

### METHODOLOGY (14 skills)
Tạo trong plugin/skills/methodology/

ClaudeKit "Superpowers":

1. **brainstorming** - Creative exploration
2. **writing-plans** - Plan creation
3. **executing-plans** - Plan execution
4. **test-driven-development** - TDD strict
5. **verification-before-completion** - Evidence-based
6. **testing-anti-patterns** - What to avoid
7. **systematic-debugging** - Debug process
8. **root-cause-tracing** - Find root cause
9. **defense-in-depth** - Security layers
10. **dispatching-parallel-agents** - Parallel work
11. **requesting-code-review** - Ask for review
12. **receiving-code-review** - Handle feedback
13. **finishing-development-branch** - Complete work
14. **token-optimization** - Cost savings

Ví dụ test-driven-development/SKILL.md:
```markdown
---
name: test-driven-development
description: TDD workflow. Use when implementing features with test-first approach.
---

# Test-Driven Development Skill

## TDD Cycle
1. 🔴 RED - Write failing test
2. 🟢 GREEN - Make it pass (minimal code)
3. ♻️ REFACTOR - Improve code

## Rules
- No production code without failing test
- Only enough code to pass test
- Refactor after green

## Example
```typescript
// 1. RED - Write test first
describe('calculateTax', () => {
  it('calculates 10% tax', () => {
    expect(calculateTax(100, 0.1)).toBe(10);
  });
});

// 2. GREEN - Minimal implementation
function calculateTax(amount: number, rate: number) {
  return amount * rate;
}

// 3. REFACTOR if needed
```
```

### OMEGA (5 skills) ⭐
Tạo trong plugin/skills/omega/

1. **omega-coding** - AI-first development
2. **omega-thinking** - 7 thinking modes
3. **omega-testing** - Comprehensive testing
4. **omega-architecture** - System design
5. **omega-sprint** - Sprint management

Ví dụ omega-thinking/SKILL.md:
```markdown
---
name: omega-thinking
description: 7 modes of Omega thinking. Use for deep analysis, problem solving, finding 10x improvements.
---

# Omega Thinking Skill

## The 7 Modes

### 🔭 TELESCOPIC
Zoom out: Task → Feature → Product → Market → Industry → World
Ask: "What's the ultimate impact?"

### 🔬 MICROSCOPIC  
First principles: Why? → Why? → Why? → Why? → Why?
Ask: "What's fundamentally true?"

### ↔️ LATERAL
Different angles:
- How would [X industry] solve this?
- What's the opposite approach?

### 🔄 INVERSION
Through failure:
- How to guarantee failure?
- Avoid those things.

### ⏳ TEMPORAL
Time dimension:
- Historical patterns?
- Relevant in 10 years?

### 🕸️ SYSTEMIC
Interconnections:
- Components?
- Feedback loops?
- Emergence?

### ⚛️ QUANTUM
Multiple possibilities:
- All options?
- How to test?

## Application
For any problem, apply all 7 modes, then synthesize.
```

## Verification

Kiểm tra có 43 skill folders:
- languages/ (3)
- frameworks/ (10)
- databases/ (4)
- frontend/ (6)
- devops/ (4)
- security/ (3)
- testing/ (3)
- methodology/ (14)
- omega/ (5) ⭐

Total: 43 skills
```

---

## PHASE 11: ALL 9 MODES

```markdown
Tiếp tục Phase 11: Tạo 9 Modes.

Tạo trong plugin/modes/

## ClaudeKit Modes (7)

### default.md
```markdown
---
name: default
description: Balanced standard behavior for general tasks.
---

# Default Mode

Balanced approach:
- Standard planning
- Regular review
- Normal verbosity
```

### brainstorm.md
```markdown
---
name: brainstorm
description: Creative exploration mode for design and ideation.
---

# Brainstorm Mode

Optimize for creativity:
- One question at a time
- Explore alternatives
- Challenge assumptions
- No premature judgment
```

### token-efficient.md
```markdown
---
name: token-efficient
description: Compressed output mode for cost savings (30-70%).
---

# Token-Efficient Mode

Minimize tokens:
- Concise output
- No explanations unless asked
- Code over prose
- Abbreviated responses
```

### deep-research.md
```markdown
---
name: deep-research
description: Thorough analysis mode with citations and sources.
---

# Deep Research Mode

Optimize for thoroughness:
- Multiple sources
- Citations
- Comprehensive analysis
- Confidence scores
```

### implementation.md
```markdown
---
name: implementation
description: Code-focused mode with minimal prose.
---

# Implementation Mode

Optimize for coding:
- Code-first responses
- Minimal explanations
- Execute plans directly
- Focus on output
```

### review.md
```markdown
---
name: review
description: Critical analysis mode for code review.
---

# Review Mode

Optimize for criticism:
- Find issues
- Security focus
- Performance analysis
- Constructive feedback
```

### orchestration.md
```markdown
---
name: orchestration
description: Multi-task coordination mode for parallel work.
---

# Orchestration Mode

Optimize for coordination:
- Parallel task management
- Agent delegation
- Result aggregation
- Workflow optimization
```

## Omega Modes (2) ⭐

### omega.md
```markdown
---
name: omega
description: 10x-1000x thinking mode for breakthrough solutions.
---

# Omega Mode

Apply Omega principles to EVERYTHING:

## Mindset
- Challenge 10x vs 100x vs 1000x
- Apply 7 thinking modes
- Seek leverage multiplication
- Build systems, not features
- Excellence in everything

## Questions for Every Task
1. What's the 10x version?
2. Can we solve the class, not instance?
3. Can we automate this forever?
4. What would make this obsolete?

## Mantras
- "Think 1000x before settling for 10x"
- "Don't do. Create systems that do."
- "Solve once for N cases."

🔮 Think Omega. Build Omega. Be Omega.
```

### autonomous.md
```markdown
---
name: autonomous
description: AI team self-management mode for sprint execution.
---

# Autonomous Mode

AI team operates independently:

## Behavior
- Execute tasks without stopping
- Make decisions autonomously
- Only pause for critical issues
- Report progress periodically

## Guardrails
- Follow the plan
- Respect constraints
- Maintain quality gates
- Log all decisions

## When to Stop
- Critical error
- Security concern
- Scope creep detected
- Ambiguous requirement
```

## Verification

Kiểm tra có 9 files trong plugin/modes/:
1. ✅ default.md
2. ✅ brainstorm.md
3. ✅ token-efficient.md
4. ✅ deep-research.md
5. ✅ implementation.md
6. ✅ review.md
7. ✅ orchestration.md
8. ✅ omega.md ⭐
9. ✅ autonomous.md ⭐
```

---

## PHASE 12-14: FINAL POLISH

```markdown
Tiếp tục Phase 12-14: Final polish.

## Phase 12: MCP & Templates

1. Verify plugin/mcp/.mcp.json có cấu hình 5 MCP servers
2. Verify templates/ có đầy đủ files
3. Tạo plugin/mcp/README.md hướng dẫn setup MCP

## Phase 13: CLI Testing

Test CLI:
```bash
npm link
omgkit --version
omgkit help
omgkit doctor
omgkit list commands
omgkit list agents
omgkit list skills

# Test install
omgkit install
ls ~/.claude/plugins/omgkit/

# Test init
mkdir test-project && cd test-project
omgkit init
ls -la .omgkit/
cat OMEGA.md
```

## Phase 14: Documentation

1. Update README.md với full feature list
2. Tạo docs/commands.md
3. Tạo docs/agents.md
4. Tạo docs/skills.md
5. Tạo docs/sprint.md
6. Tạo CHANGELOG.md

Final package check:
```bash
npm pack --dry-run
npm publish --dry-run
```

## 🎉 OMGKIT Complete!

### Stats
- **23 Agents**
- **54 Commands**
- **43 Skills**
- **9 Modes**
- **5 MCP Servers**

### Unique Features (vs ClaudeKit)
- Sprint Management (/vision, /sprint, /team)
- AI Team Autonomy (3 modes)
- Omega Thinking (/10x, /100x, /1000x)
- 7 Thinking Modes
- 3 Omega Agents (oracle, architect, sprint-master)
- 5 Omega Skills

---
*Think Omega. Build Omega. Be Omega.* 🔮
```

---

**Copy từng phase block và paste vào Claude Code.**
