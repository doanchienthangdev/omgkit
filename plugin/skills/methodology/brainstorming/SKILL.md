---
name: brainstorming
description: Creative ideation with divergent thinking, structured exploration, and systematic evaluation frameworks
category: methodology
triggers:
  - brainstorming
  - idea generation
  - creative thinking
  - explore options
  - what are possibilities
  - alternatives
  - ideation
---

# Brainstorming

Master the art of **creative ideation** through structured divergent thinking and systematic exploration. This skill enables effective idea generation, option exploration, and collaborative innovation for solving complex problems.

## Purpose

Transform unstructured thinking into productive creative sessions:

- Generate diverse solution options systematically
- Explore problem spaces thoroughly before converging
- Combine individual creativity with team intelligence
- Evaluate ideas objectively using structured frameworks
- Avoid premature judgment that kills innovation
- Build on ideas to create novel combinations
- Document and prioritize outcomes effectively

## Features

### 1. Divergent-Convergent Process

```markdown
## Phase 1: DIVERGE (Generate Many Ideas)
═══════════════════════════════════════

### Rules for Divergent Phase
1. **Quantity over quality** - Aim for 20+ ideas minimum
2. **No judgment** - All ideas valid, no criticism
3. **Wild ideas welcome** - Extreme ideas spark creativity
4. **Build on others** - "Yes, and..." approach
5. **One conversation** - Focus, no side discussions

### Divergent Techniques
┌─────────────────────────────────────────────────┐
│ Classic Brainstorm: Free association            │
│ Brainwriting: Silent written ideas              │
│ Mind Mapping: Visual connections                │
│ SCAMPER: Systematic modifications               │
│ Random Stimulus: External triggers              │
│ Reverse Brainstorm: How to cause problem        │
│ Role Storming: Perspective taking               │
│ Starbursting: Question-based exploration        │
└─────────────────────────────────────────────────┘

## Phase 2: EXPLORE (Develop Ideas)
═══════════════════════════════════

### Exploration Activities
- Combine similar ideas into themes
- Identify patterns and connections
- Ask clarifying questions
- Flesh out promising concepts
- Find unexpected combinations

### Questions to Explore
- What makes this idea unique?
- What would need to be true for this to work?
- How might we improve this further?
- What other ideas does this suggest?

## Phase 3: CONVERGE (Evaluate & Prioritize)
═══════════════════════════════════════════

### Convergent Criteria
Evaluate ideas against:
- Feasibility: Can we do this?
- Impact: How much value does it create?
- Alignment: Does it fit our goals?
- Novelty: How differentiated is it?
- Risk: What could go wrong?

### Prioritization Matrix
| Idea | Impact | Effort | Score | Priority |
|------|--------|--------|-------|----------|
| A    | High   | Low    | 9     | 1st      |
| B    | High   | High   | 6     | 3rd      |
| C    | Medium | Low    | 7     | 2nd      |
```

### 2. SCAMPER Framework

```markdown
## SCAMPER: Systematic Idea Modification

For any existing solution or concept, apply these 7 lenses:

### S - Substitute
What can we substitute?
- Materials → Different tech stack?
- People → Different team structure?
- Process → Different workflow?
- Place → Different deployment?

Examples:
- Substitute SQL with NoSQL
- Substitute monolith with microservices
- Substitute sync with async

### C - Combine
What can we combine?
- Features → Merge functionalities?
- Ideas → Hybrid approaches?
- Resources → Shared infrastructure?

Examples:
- Combine search and recommendations
- Combine auth and analytics
- Combine monitoring and alerting

### A - Adapt
What can we adapt from elsewhere?
- Other industries?
- Other products?
- Nature/biology?
- Historical solutions?

Examples:
- Adapt Netflix's chaos engineering
- Adapt Amazon's two-pizza teams
- Adapt circuit breaker from electrical

### M - Modify/Magnify
What can we modify, magnify, or minimize?
- Make bigger/smaller?
- Faster/slower?
- More/less frequent?
- Stronger/weaker?

Examples:
- Magnify caching layer
- Minimize API surface
- Increase batch size

### P - Put to Other Uses
What else could this be used for?
- Different users?
- Different problems?
- Different contexts?

Examples:
- Use logging for debugging AND analytics
- Use auth tokens for rate limiting
- Use CI for documentation builds

### E - Eliminate
What can we eliminate?
- Remove features?
- Simplify process?
- Reduce dependencies?

Examples:
- Eliminate manual deployments
- Remove deprecated endpoints
- Simplify configuration

### R - Reverse/Rearrange
What can we reverse or rearrange?
- Opposite approach?
- Different order?
- Different structure?

Examples:
- Pull instead of push
- Client-first instead of server-first
- Event-driven instead of request-driven
```

### 3. Mind Mapping Template

```markdown
## Mind Map Structure

                    ┌─ Sub-idea 1.1
          ┌─ Idea 1 ├─ Sub-idea 1.2
          │         └─ Sub-idea 1.3
          │
          │         ┌─ Sub-idea 2.1
PROBLEM ──┼─ Idea 2 ├─ Sub-idea 2.2
          │         └─ Sub-idea 2.3
          │
          │         ┌─ Sub-idea 3.1
          └─ Idea 3 ├─ Sub-idea 3.2
                    └─ Sub-idea 3.3

## Digital Mind Map Format
```yaml
central_topic: "How to improve API performance"
branches:
  - name: "Caching"
    ideas:
      - "Redis layer"
      - "CDN for static"
      - "Application-level cache"
      - "Database query cache"
    connections:
      - links_to: "Infrastructure"
        relationship: "requires"

  - name: "Database"
    ideas:
      - "Query optimization"
      - "Indexing strategy"
      - "Read replicas"
      - "Connection pooling"

  - name: "Architecture"
    ideas:
      - "Async processing"
      - "Load balancing"
      - "Horizontal scaling"
      - "Edge computing"

  - name: "Code"
    ideas:
      - "Algorithm efficiency"
      - "Lazy loading"
      - "Pagination"
      - "Compression"
```

### 4. Reverse Brainstorming

```markdown
## Reverse Brainstorming: Learn from Failure

Instead of "How do we succeed?", ask "How do we guarantee failure?"

### Process
1. State the goal
2. Reverse: "How to guarantee we FAIL at this goal?"
3. Generate failure ideas freely
4. Reverse each failure into prevention

### Example: How to Build Unreliable API

**Goal:** Build a reliable API
**Reversed:** How to make the MOST unreliable API?

| Failure Idea | Prevention Strategy |
|--------------|---------------------|
| No error handling | Comprehensive try/catch |
| Single point of failure | Redundancy, load balancing |
| No monitoring | Prometheus + Grafana |
| Ignore timeouts | Circuit breakers |
| No rate limiting | Token bucket algorithm |
| Deploy on Fridays | Change freeze policies |
| No testing | 80%+ test coverage |
| Hardcode secrets | Environment variables |
| No documentation | OpenAPI specs |
| Ignore logs | Structured logging |

### Template
```yaml
reverse_brainstorm:
  goal: "[What we want to achieve]"
  reversed_question: "How to guarantee we fail at [goal]?"

  failure_ideas:
    - failure: "[Way to fail]"
      prevention: "[How to prevent]"
      priority: high|medium|low

    - failure: "[Another way to fail]"
      prevention: "[Prevention strategy]"
      priority: high|medium|low
```

### 5. Role Storming

```markdown
## Role Storming: Different Perspectives

Generate ideas by adopting different personas.

### Persona Categories

**Technical Roles:**
- Junior Developer: "What's confusing about this?"
- Senior Architect: "How does this scale?"
- Security Expert: "What are the vulnerabilities?"
- DevOps Engineer: "How do we deploy/monitor this?"
- QA Tester: "What could break?"

**User Roles:**
- Power User: "What advanced features do I need?"
- New User: "Is this intuitive?"
- Frustrated User: "What's annoying?"
- Competitor's User: "What would make me switch?"

**Business Roles:**
- CEO: "Does this align with vision?"
- Sales: "Can I sell this?"
- Support: "What questions will users ask?"
- Finance: "What's the ROI?"

**External Perspectives:**
- Competitor: "How would we copy this?"
- Regulator: "What compliance issues exist?"
- Hacker: "How would I exploit this?"
- Future User (10 years): "Will this age well?"

### Role Storming Template
```markdown
## Role Storming Session

### Problem: [Statement]

### Perspective: Junior Developer
Questions:
- Why is this implemented this way?
- What should I learn first?
Ideas:
- Better onboarding docs
- Code comments
- Example implementations

### Perspective: Security Expert
Questions:
- Where are the attack surfaces?
- What data is exposed?
Ideas:
- Input validation everywhere
- Rate limiting on all endpoints
- Audit logging
```

### 6. Starbursting (Question-Based)

```markdown
## Starbursting: Explore Through Questions

Instead of generating solutions, generate questions about the idea.

### The 6 Points of the Star

                    WHO?
                     │
                     │
        WHEN? ───────┼─────── WHY?
                     │
                     │
         WHERE? ─────┼───── WHAT?
                     │
                     │
                    HOW?

### Questions per Category

**WHO?**
- Who is the target user?
- Who will build this?
- Who approves this?
- Who is affected by this?
- Who are the stakeholders?

**WHAT?**
- What problem does this solve?
- What features are essential?
- What resources are needed?
- What are the constraints?
- What defines success?

**WHEN?**
- When do we start?
- When do we ship?
- When do users need this?
- When does this become obsolete?
- When do we measure success?

**WHERE?**
- Where will this be used?
- Where will it be deployed?
- Where are the bottlenecks?
- Where does data come from?
- Where does this fit in the system?

**WHY?**
- Why is this needed now?
- Why this approach?
- Why would users choose this?
- Why might this fail?
- Why haven't others done this?

**HOW?**
- How will we build this?
- How will we test this?
- How will we deploy this?
- How will we measure success?
- How will we maintain this?
```

## Use Cases

### Feature Exploration Session

```markdown
## Brainstorming: User Dashboard Features

### Setup
- Participants: Product, Engineering, Design
- Time: 45 minutes
- Goal: Generate 30+ feature ideas

### Phase 1: Diverge (20 min)
Ideas generated:
1. Real-time activity feed
2. Customizable widgets
3. Dark mode
4. Keyboard shortcuts
5. Export to PDF
6. Team collaboration view
7. Notification center
8. Quick actions bar
9. Search across all data
10. Saved filters
11. Dashboard templates
12. Mobile-responsive
13. Offline mode
14. Voice commands
15. AI-powered insights
16. Comparison views
17. Drill-down analytics
18. Bookmark favorites
19. Recently viewed
20. Personalized recommendations
... [30+ total]

### Phase 2: Explore (10 min)
Themes identified:
- Personalization: 1, 2, 10, 18, 20
- Productivity: 4, 8, 9, 11
- Collaboration: 6, 7
- Accessibility: 3, 12, 13, 14
- Analytics: 15, 16, 17

### Phase 3: Converge (15 min)

| Feature | Impact | Effort | User Demand | Priority |
|---------|--------|--------|-------------|----------|
| Customizable widgets | High | Medium | High | 1 |
| Real-time activity | High | High | Medium | 3 |
| Dark mode | Medium | Low | High | 2 |
| Keyboard shortcuts | Medium | Low | Medium | 4 |
| AI insights | High | Very High | Low | 5 |

### Output
**Top 3 Recommendations:**
1. **Customizable widgets** - High impact, moderate effort, user demand
2. **Dark mode** - Quick win, high user satisfaction
3. **Real-time activity** - Differentiator, worth investment

**Quick Wins for Sprint:**
- Dark mode
- Keyboard shortcuts
- Saved filters
```

### Technical Architecture Brainstorm

```markdown
## Brainstorming: Scaling Strategy

### SCAMPER Application

**Current:** Single PostgreSQL database

**Substitute:**
- DynamoDB for write-heavy tables
- Redis for session storage
- S3 for file storage

**Combine:**
- Combined read replicas with caching
- Unified search with Elasticsearch

**Adapt:**
- Netflix's Zuul gateway pattern
- Uber's ringpop for consistent hashing

**Modify:**
- Increase connection pool size
- Reduce query complexity
- Add more indexes

**Put to Other Uses:**
- Use audit logs for analytics
- Use cache for rate limiting

**Eliminate:**
- Remove N+1 queries
- Eliminate synchronous external calls
- Remove unused indexes

**Reverse:**
- Push instead of pull for notifications
- Event sourcing instead of CRUD

### Selected Strategies
1. Read replicas (immediate)
2. Redis caching layer (week 2)
3. Async job processing (week 3)
4. Event-driven architecture (Q2)
```

## Best Practices

### Do's

- Set clear time limits for each phase
- Capture ALL ideas, even "bad" ones
- Build on others' ideas with "Yes, and..."
- Use visual tools (sticky notes, whiteboards)
- Assign a facilitator to keep momentum
- Vote anonymously to avoid groupthink
- Follow up with action items
- Document learnings for future sessions
- Mix individual and group ideation
- Create psychological safety for wild ideas

### Don'ts

- Don't judge ideas during divergent phase
- Don't let dominant voices control session
- Don't skip the exploration phase
- Don't converge too early
- Don't forget to capture reasoning
- Don't brainstorm without a clear goal
- Don't ignore quiet participants
- Don't let sessions run too long (60 min max)
- Don't expect perfect ideas immediately
- Don't abandon ideas without evaluation

### Session Facilitation Checklist

```markdown
## Pre-Session
- [ ] Define clear problem statement
- [ ] Select appropriate techniques
- [ ] Invite diverse participants
- [ ] Prepare materials (sticky notes, timer)
- [ ] Set ground rules

## During Session
- [ ] State the problem clearly
- [ ] Explain the process
- [ ] Enforce no-judgment rule
- [ ] Keep time boxes
- [ ] Encourage quiet participants
- [ ] Capture all ideas visibly

## Post-Session
- [ ] Organize and cluster ideas
- [ ] Share summary with all participants
- [ ] Identify owners for top ideas
- [ ] Schedule follow-up if needed
- [ ] Store documentation for reference
```

## Output Templates

```markdown
## Brainstorming Session Summary

### Session Info
- Date: [Date]
- Participants: [Names]
- Duration: [Time]
- Technique: [Methods used]

### Problem Statement
[Clear statement of what we're solving]

### Ideas Generated
[Numbered list of all ideas]

### Top Recommendations
1. **Best Overall:** [Idea] - [Why]
2. **Most Innovative:** [Idea] - [Why]
3. **Quickest Win:** [Idea] - [Why]
4. **Long-term Play:** [Idea] - [Why]

### Action Items
- [ ] [Action] - Owner: [Name] - Due: [Date]

### Parking Lot
[Ideas to revisit later]
```

## References

- [IDEO Design Thinking](https://www.ideo.com/post/design-thinking-defined)
- [SCAMPER Method](https://www.mindtools.com/pages/article/newCT_02.htm)
- [Lateral Thinking - Edward de Bono](https://www.debono.com/lateral-thinking)
- [The Art of Innovation - Tom Kelley](https://www.ideo.com/people/tom-kelley)
- [Creative Confidence - David Kelley](https://www.creativeconfidence.com/)
