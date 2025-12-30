---
name: writing-plans
description: Implementation planning with task breakdown, risk assessment, and dependency management
category: methodology
triggers:
  - writing plans
  - implementation plan
  - planning
  - task breakdown
  - project planning
  - feature plan
  - roadmap
---

# Writing Plans

Master the art of **implementation planning** with structured task breakdown, clear dependencies, and comprehensive risk assessment. This skill enables effective project execution through well-defined plans that teams can follow autonomously.

## Purpose

Transform vague requirements into actionable plans:

- Break complex features into manageable tasks
- Identify dependencies and sequencing
- Estimate effort and allocate resources
- Anticipate and mitigate risks
- Enable parallel execution where possible
- Create clear success criteria
- Document decisions and rationale

## Features

### 1. Plan Structure Template

```markdown
# Plan: [Feature/Project Name]

## Metadata
- Author: [Name]
- Created: [Date]
- Status: Draft | In Review | Approved | In Progress | Complete
- Estimated Duration: [X days/weeks]
- Priority: P0 | P1 | P2 | P3

## Executive Summary
[2-3 sentences describing what will be built and why]

## Goals & Non-Goals

### Goals
- [What this plan WILL accomplish]
- [Measurable outcome 1]
- [Measurable outcome 2]

### Non-Goals
- [What this plan will NOT address]
- [Explicitly out of scope items]

## Background & Context
[Why is this needed? What problem does it solve?]

### Current State
[Description of how things work today]

### Desired State
[Description of how things should work after]

## Design Overview
[High-level approach and key decisions]

### Architecture Diagram
```
[Component A] ──► [Component B] ──► [Component C]
       │                                    │
       ▼                                    ▼
[Database]                            [Cache]
```

### Key Decisions
| Decision | Options Considered | Choice | Rationale |
|----------|-------------------|--------|-----------|
| [Topic] | A, B, C | B | [Why B] |

## Implementation Tasks

### Phase 1: [Foundation] - [X days]

#### Task 1.1: [Task Name]
- **Description:** [What needs to be done]
- **Owner:** [Name/Team]
- **Estimate:** [X hours/days]
- **Files:** `path/to/file.ts:line`
- **Dependencies:** None
- **Acceptance Criteria:**
  - [ ] [Criterion 1]
  - [ ] [Criterion 2]

#### Task 1.2: [Task Name]
- **Description:** [What needs to be done]
- **Owner:** [Name/Team]
- **Estimate:** [X hours/days]
- **Files:** `path/to/file.ts:line`
- **Dependencies:** Task 1.1
- **Acceptance Criteria:**
  - [ ] [Criterion 1]

### Phase 2: [Core Implementation] - [X days]
[Continue with tasks...]

## Testing Strategy

### Unit Tests
- [Component A] - [What to test]
- [Component B] - [What to test]

### Integration Tests
- [Flow 1] - [What to verify]
- [Flow 2] - [What to verify]

### E2E Tests
- [Critical path 1]
- [Critical path 2]

### Manual Testing
- [ ] [Scenario to test manually]

## Rollout Plan

### Phase 1: Internal Testing
- Deploy to staging
- Internal team testing
- Duration: [X days]

### Phase 2: Beta
- Feature flag: 5% of users
- Monitor metrics
- Duration: [X days]

### Phase 3: GA
- Gradual rollout: 25% → 50% → 100%
- Duration: [X days]

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| [Risk 1] | High | High | [Strategy] |
| [Risk 2] | Medium | Medium | [Strategy] |

## Success Metrics
- [Metric 1]: Baseline [X] → Target [Y]
- [Metric 2]: Baseline [X] → Target [Y]

## Open Questions
- [ ] [Question 1]
- [ ] [Question 2]

## References
- [Link to PRD]
- [Link to design doc]
- [Link to related work]
```

### 2. Task Breakdown Framework

```markdown
## Task Sizing Guidelines

### Ideal Task Size
- Duration: 2-4 hours (half-day blocks)
- Max: 1 day (break down if larger)
- Clear completion criteria
- Single owner

### Breakdown Techniques

#### Horizontal Slicing (by layer)
```
Feature: User Profile Update
├── Database migration
├── API endpoint
├── Service logic
├── Frontend form
└── Tests
```

#### Vertical Slicing (by user story)
```
Feature: User Profile Update
├── Update name (DB → API → UI → Test)
├── Update email (DB → API → UI → Test)
├── Update avatar (DB → API → UI → Test)
└── Update preferences (DB → API → UI → Test)
```

#### Functional Decomposition
```
Feature: Payment Processing
├── Input validation
├── Payment gateway integration
├── Transaction logging
├── Error handling
├── Receipt generation
└── Notification sending
```

### Task Template
```yaml
task:
  id: "TASK-001"
  title: "Add user email validation"
  description: |
    Implement email format validation in the user
    registration flow with proper error messages.

  type: feature | bugfix | refactor | test | docs

  size: XS | S | M | L | XL
  # XS: < 1 hour
  # S: 1-2 hours
  # M: 2-4 hours
  # L: 4-8 hours
  # XL: > 8 hours (should be broken down)

  files:
    - path: "src/validators/email.ts"
      action: create
    - path: "src/components/RegistrationForm.tsx"
      action: modify
      lines: "45-60"

  dependencies:
    - "TASK-000"  # Must complete first

  acceptance_criteria:
    - Valid emails are accepted
    - Invalid emails show error message
    - Edge cases handled (empty, special chars)

  testing:
    unit:
      - Email validator function
    integration:
      - Registration form submission
```

### 3. Dependency Mapping

```markdown
## Dependency Types

### Hard Dependencies
Must complete before starting next task.
```
[Task A] ──BLOCKS──► [Task B]
```

### Soft Dependencies
Preferred order but can work around.
```
[Task A] ──INFORMS──► [Task B]
```

### Parallel Opportunities
No dependencies, can run concurrently.
```
[Task A] ║ [Task B] ║ [Task C]
         ║          ║
         ▼          ▼
      [Task D: Integration]
```

### Dependency Diagram
```
                    ┌─────────────────────────────────────────┐
                    │           START                          │
                    └──────────────┬──────────────────────────┘
                                   │
           ┌───────────────────────┼───────────────────────┐
           │                       │                       │
           ▼                       ▼                       ▼
    ┌─────────────┐         ┌─────────────┐         ┌─────────────┐
    │   Task 1    │         │   Task 2    │         │   Task 3    │
    │  Database   │         │   Design    │         │  Research   │
    │  Schema     │         │   Mockups   │         │  API Docs   │
    └──────┬──────┘         └──────┬──────┘         └──────┬──────┘
           │                       │                       │
           │                       │                       │
           ▼                       ▼                       │
    ┌─────────────┐         ┌─────────────┐                │
    │   Task 4    │         │   Task 5    │                │
    │  API Layer  │◄────────│  Frontend   │                │
    └──────┬──────┘         └─────────────┘                │
           │                                               │
           ▼                                               ▼
    ┌─────────────┐                                 ┌─────────────┐
    │   Task 6    │◄────────────────────────────────│   Task 7    │
    │ Integration │                                 │  3rd Party  │
    │   Testing   │                                 │ Integration │
    └──────┬──────┘                                 └─────────────┘
           │
           ▼
    ┌─────────────┐
    │   COMPLETE  │
    └─────────────┘
```

### Critical Path Analysis
```markdown
## Critical Path

The longest path through the dependency graph determines minimum duration.

Path Analysis:
- Path A: Task 1 → Task 4 → Task 6 = 5 days
- Path B: Task 2 → Task 5 = 3 days
- Path C: Task 3 → Task 7 → Task 6 = 6 days ← CRITICAL PATH

**Critical Path:** Task 3 → Task 7 → Task 6
**Minimum Duration:** 6 days

**Optimization Opportunities:**
- Start Task 3 first
- Assign more resources to critical path
- Look for ways to parallelize Task 7
```

### 4. Risk Assessment Matrix

```markdown
## Risk Assessment Framework

### Risk Categories

| Category | Examples |
|----------|----------|
| Technical | New technology, complexity, integration |
| Resource | Team availability, skills gap |
| External | Third-party dependencies, API changes |
| Timeline | Deadline pressure, scope creep |
| Business | Requirements change, priority shift |

### Likelihood Scale
| Level | Description | Probability |
|-------|-------------|-------------|
| Rare | Unlikely to occur | <10% |
| Low | Could occur | 10-25% |
| Medium | Likely to occur | 25-50% |
| High | Expected to occur | 50-75% |
| Very High | Almost certain | >75% |

### Impact Scale
| Level | Schedule | Cost | Quality |
|-------|----------|------|---------|
| Minimal | <1 day slip | <5% over | Cosmetic |
| Minor | 1-3 days | 5-10% | Minor bugs |
| Moderate | 1 week | 10-25% | Some features cut |
| Major | 2+ weeks | 25-50% | Core features affected |
| Severe | Project at risk | >50% | Failure |

### Risk Matrix
```
                    IMPACT
           Low    Medium    High    Severe
        ┌────────┬────────┬────────┬────────┐
High    │ Medium │  High  │Critical│Critical│
        ├────────┼────────┼────────┼────────┤
Medium  │  Low   │ Medium │  High  │Critical│
LIKELY  ├────────┼────────┼────────┼────────┤
Low     │  Low   │  Low   │ Medium │  High  │
        ├────────┼────────┼────────┼────────┤
Rare    │ Accept │  Low   │  Low   │ Medium │
        └────────┴────────┴────────┴────────┘
```

### Risk Register Template
```markdown
| ID | Risk | Category | Likelihood | Impact | Score | Mitigation | Owner | Status |
|----|------|----------|------------|--------|-------|------------|-------|--------|
| R1 | Third-party API down | External | Medium | High | High | Implement fallback, cache responses | @eng | Open |
| R2 | Performance regression | Technical | Low | Medium | Low | Add load testing to CI | @qa | Mitigated |
| R3 | Key developer unavailable | Resource | Medium | Medium | Medium | Document decisions, cross-train | @lead | Monitoring |
```

### 5. Effort Estimation

```markdown
## Estimation Techniques

### T-Shirt Sizing
Quick relative sizing for initial planning.

| Size | Hours | Description |
|------|-------|-------------|
| XS | <1 | Trivial change, well-understood |
| S | 1-2 | Small change, low risk |
| M | 2-4 | Standard task, some complexity |
| L | 4-8 | Larger task, may need research |
| XL | 8+ | Complex, should be broken down |

### Three-Point Estimation
For more accurate estimates:

```
Estimate = (Optimistic + 4×MostLikely + Pessimistic) / 6

Example:
Task: Implement OAuth flow
- Optimistic: 4 hours (if everything works first try)
- Most Likely: 8 hours (normal development)
- Pessimistic: 16 hours (unexpected issues)

Estimate = (4 + 4×8 + 16) / 6 = 8.7 hours
```

### Estimation Adjustments

| Factor | Multiplier | When to Apply |
|--------|------------|---------------|
| New technology | 1.5x | First time using |
| Complex integration | 1.3x | Multiple systems |
| Unclear requirements | 1.5x | Needs clarification |
| Junior developer | 1.5x | Less experience |
| Code review included | 1.2x | If not separate task |
| Testing included | 1.3x | If not separate task |

### Buffer Recommendations
- Individual tasks: 20% buffer
- Phase total: 30% buffer
- Project total: 40% buffer

```markdown
Example:
Raw estimate: 40 hours
With 30% buffer: 52 hours
```

### 6. File-Level Planning

```markdown
## Code Change Mapping

### New Files
```yaml
new_files:
  - path: "src/services/PaymentService.ts"
    purpose: "Handle payment processing logic"
    size: ~200 lines
    template: "service"

  - path: "src/api/payments.ts"
    purpose: "Payment API endpoints"
    size: ~100 lines
    template: "api-route"

  - path: "tests/services/PaymentService.test.ts"
    purpose: "Unit tests for payment service"
    size: ~150 lines
```

### Modified Files
```yaml
modified_files:
  - path: "src/routes/index.ts"
    changes:
      - line: 45
        change: "Add payment routes import"
      - line: 78
        change: "Register payment router"

  - path: "src/types/index.ts"
    changes:
      - line: "end"
        change: "Add Payment types"
```

### Migration Files
```yaml
migrations:
  - name: "add_payments_table"
    up: |
      CREATE TABLE payments (
        id UUID PRIMARY KEY,
        amount DECIMAL(10,2),
        status VARCHAR(20),
        created_at TIMESTAMP
      )
    down: "DROP TABLE payments"
```
```

## Use Cases

### API Feature Plan

```markdown
# Plan: Add User Preferences API

## Executive Summary
Add CRUD endpoints for user preferences to enable personalized
experiences across mobile and web clients.

## Implementation Tasks

### Phase 1: Database (Day 1)

#### Task 1.1: Create preferences table migration
- **Estimate:** 1 hour
- **Files:** `migrations/20240115_add_preferences.ts`
- **Dependencies:** None
- **Criteria:**
  - [ ] Table with user_id, key, value, updated_at
  - [ ] Foreign key to users table
  - [ ] Unique constraint on (user_id, key)

#### Task 1.2: Add Prisma model
- **Estimate:** 30 min
- **Files:** `prisma/schema.prisma:lines 45-55`
- **Dependencies:** Task 1.1
- **Criteria:**
  - [ ] Model defined with relations
  - [ ] Types generated

### Phase 2: API Layer (Days 2-3)

#### Task 2.1: Create PreferencesService
- **Estimate:** 3 hours
- **Files:** `src/services/PreferencesService.ts`
- **Dependencies:** Task 1.2
- **Criteria:**
  - [ ] getPreferences(userId)
  - [ ] setPreference(userId, key, value)
  - [ ] deletePreference(userId, key)
  - [ ] Unit tests with 80%+ coverage

#### Task 2.2: Add API endpoints
- **Estimate:** 2 hours
- **Files:** `src/api/preferences.ts`
- **Dependencies:** Task 2.1
- **Criteria:**
  - [ ] GET /users/:id/preferences
  - [ ] PUT /users/:id/preferences/:key
  - [ ] DELETE /users/:id/preferences/:key
  - [ ] Request validation
  - [ ] Error handling

### Phase 3: Testing & Documentation (Day 4)

#### Task 3.1: Integration tests
- **Estimate:** 2 hours
- **Files:** `tests/api/preferences.test.ts`
- **Dependencies:** Task 2.2
- **Criteria:**
  - [ ] Happy path tests
  - [ ] Auth required tests
  - [ ] Validation error tests

#### Task 3.2: Update API documentation
- **Estimate:** 1 hour
- **Files:** `docs/api/preferences.md`
- **Dependencies:** Task 2.2
- **Criteria:**
  - [ ] OpenAPI spec updated
  - [ ] Examples for each endpoint

## Risks
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Schema conflicts | Low | Medium | Run migrations in staging first |
| Performance at scale | Medium | High | Add caching, pagination |
```

## Best Practices

### Do's

- Keep tasks to 2-4 hour chunks
- Include exact file locations when known
- Specify clear acceptance criteria
- Map dependencies explicitly
- Build in buffer for unknowns
- Include testing in the plan
- Document key decisions and rationale
- Review plan with stakeholders
- Update plan as you learn
- Track actual vs estimated time

### Don'ts

- Don't skip the background/context section
- Don't leave tasks vague ("implement feature")
- Don't ignore non-functional requirements
- Don't underestimate integration work
- Don't forget rollback plans
- Don't plan too far in detail (2 weeks max)
- Don't hide risks or uncertainties
- Don't skip the testing strategy
- Don't forget documentation tasks
- Don't assume requirements are complete

## References

- [Shape Up - Basecamp](https://basecamp.com/shapeup)
- [Agile Estimation](https://www.mountaingoatsoftware.com/agile/planning-poker)
- [Risk Management](https://www.pmi.org/learning/library/risk-identification-life-cycle-9135)
- [Critical Path Method](https://www.projectmanager.com/guides/critical-path-method)
