---
name: technical-docs
description: Create comprehensive technical documentation
category: content
complexity: medium
estimated-time: 2-8 hours
agents:
  - docs-manager
  - architect
  - copywriter
  - code-reviewer
skills:
  - methodology/writing-plans
commands:
  - /planning:doc
  - /dev:review
prerequisites:
  - Codebase accessible
  - Documentation scope defined
---

# Technical Documentation Workflow

## Overview

The Technical Documentation workflow helps create comprehensive, well-structured documentation including API references, architecture guides, and tutorials.

## When to Use

- Documenting new features
- Creating API references
- Writing architecture guides
- Building tutorials

## Steps

### Step 1: Documentation Planning
**Agent:** docs-manager
**Duration:** 30-60 minutes

Plan documentation:
- Define scope
- Identify audiences
- Create outline
- Set standards

**Output:** Documentation plan

### Step 2: API Documentation
**Agent:** docs-manager
**Duration:** 1-2 hours

Generate API docs:
- Extract from code
- Add descriptions
- Include examples
- Document errors

**Output:** API reference

### Step 3: Architecture Guide
**Agent:** architect
**Duration:** 1-2 hours

Write architecture:
- System overview
- Component diagrams
- Design decisions
- Integration points

**Output:** Architecture guide

### Step 4: Tutorials
**Agent:** docs-manager
**Duration:** 1-2 hours

Create tutorials:
- Getting started
- Step-by-step guides
- Code examples
- Common patterns

**Output:** Tutorial content

### Step 5: Review
**Agent:** code-reviewer
**Command:** `/dev:review`
**Duration:** 30-60 minutes

Review documentation:
- Technical accuracy
- Completeness
- Working examples
- Clarity

**Output:** Review feedback

### Step 6: Publishing
**Agent:** docs-manager
**Duration:** 30-60 minutes

Publish docs:
- Format for platform
- Add navigation
- Configure search
- Deploy

**Output:** Published docs

## Quality Gates

- [ ] Documentation planned
- [ ] API documented
- [ ] Architecture explained
- [ ] Tutorials complete
- [ ] Review passed
- [ ] Docs published

## Documentation Structure

```
Documentation Structure
=======================
docs/
├── getting-started/
│   ├── installation.md
│   └── quickstart.md
├── guides/
│   ├── architecture.md
│   └── tutorials/
├── api/
│   └── reference.md
└── changelog.md
```

## Example Usage

```bash
/workflow:technical-docs "API documentation for v2"
/workflow:technical-docs "developer onboarding guide"
```

## Related Workflows

- `api-design` - For API specs
- `marketing` - For marketing content
