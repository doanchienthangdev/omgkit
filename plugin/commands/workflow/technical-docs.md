---
description: Create comprehensive technical documentation
allowed-tools: Task, Read, Write, Edit, Bash, Grep, Glob
argument-hint: <documentation scope>
---

# Technical Documentation Workflow

Document: **$ARGUMENTS**

## Workflow Steps

### Step 1: Content Planning
**Agent:** @docs-manager

- Define documentation scope
- Identify audience
- Plan structure
- Create outline

### Step 2: Content Writing
**Agent:** @docs-manager
**Command:** `/planning:doc`

- Write technical content
- Add code examples
- Create diagrams
- Document APIs

### Step 3: Review
**Agent:** @code-reviewer

- Technical accuracy
- Clarity and completeness
- Code example verification
- Consistency check

### Step 4: Publishing
**Agent:** @docs-manager

- Format for publishing
- Add navigation
- Generate API docs
- Deploy documentation

## Progress Tracking
- [ ] Content planned
- [ ] Documentation written
- [ ] Review complete
- [ ] Published

Execute thoroughly. Good docs = happy developers.
