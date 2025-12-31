---
description: Complex full-stack feature development
allowed-tools: Task, Read, Write, Edit, Bash, Grep, Glob
argument-hint: <full-stack feature>
---

# Full-Stack Feature Workflow

Build: **$ARGUMENTS**

## Workflow Steps

### Step 1: Architecture Design
**Agent:** @architect

- Design system architecture
- Plan database schema
- Design API contracts
- Plan frontend components

### Step 2: Backend Implementation
**Agent:** @fullstack-developer

- Implement database models
- Create API endpoints
- Add business logic
- Write backend tests

### Step 3: Frontend Implementation
**Agent:** @fullstack-developer

- Create UI components
- Implement state management
- Connect to API
- Add styling

### Step 4: Integration
**Agent:** @fullstack-developer

- End-to-end integration
- Error handling
- Loading states
- Edge cases

### Step 5: Testing
**Agent:** @tester
**Command:** `/dev:test`

- Unit tests (frontend + backend)
- Integration tests
- E2E tests
- Performance tests

### Step 6: Review & Deploy
**Agent:** @code-reviewer, @git-manager

- Code review
- Security review
- Create PR
- Deploy

## Progress Tracking
- [ ] Architecture designed
- [ ] Backend complete
- [ ] Frontend complete
- [ ] Integration done
- [ ] Tests passing
- [ ] Deployed

Execute each layer. Full-stack excellence.
