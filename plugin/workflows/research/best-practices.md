---
name: best-practices
description: Discover and adopt best practices
category: research
complexity: medium
estimated-time: 2-6 hours
agents:
  - researcher
  - planner
  - fullstack-developer
skills:
  - research-validation
commands:
  - /planning:research
  - /planning:plan
  - /dev:feature
prerequisites:
  - Area of interest defined
---

# Best Practices Discovery Workflow

## Overview

The Best Practices workflow helps discover, evaluate, and adopt industry best practices for specific areas of development.

## When to Use

- Improving code quality
- Adopting industry standards
- Team skill development
- Process improvement

## Steps

### Step 1: Area Definition
**Agent:** researcher
**Duration:** 15-30 minutes

Define area:
- Specific domain
- Current state
- Improvement goals
- Success criteria

**Output:** Focus area

### Step 2: Research
**Agent:** researcher
**Command:** `/planning:research`
**Duration:** 1-2 hours

Research practices:
- Industry standards
- Expert opinions
- Case studies
- Framework guidelines

**Output:** Best practices list

### Step 3: Gap Analysis
**Agent:** researcher
**Duration:** 30-60 minutes

Analyze gaps:
- Current vs ideal
- Priority areas
- Quick wins
- Long-term goals

**Output:** Gap analysis

### Step 4: Adoption Plan
**Agent:** planner
**Command:** `/planning:plan`
**Duration:** 30-60 minutes

Plan adoption:
- Prioritized changes
- Implementation steps
- Training needs
- Timeline

**Output:** Adoption plan

### Step 5: Implementation
**Agent:** fullstack-developer
**Duration:** 1-4 hours

Implement changes:
- Apply practices
- Update code
- Add tooling
- Document changes

**Output:** Practices adopted

## Quality Gates

- [ ] Area clearly defined
- [ ] Practices researched
- [ ] Gaps identified
- [ ] Plan created
- [ ] Changes implemented

## Best Practice Categories

```
Development Best Practices
==========================
CODE:
- Naming conventions
- Code organization
- Error handling
- Testing patterns

PROCESS:
- Code review
- CI/CD pipeline
- Documentation
- Monitoring

ARCHITECTURE:
- Design patterns
- Security practices
- Performance
- Scalability
```

## Example Usage

```bash
/workflow:best-practices "React component patterns"
/workflow:best-practices "API security practices"
```

## Related Workflows

- `technology-research` - For tech evaluation
- `refactor` - For implementation
