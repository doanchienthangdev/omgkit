---
description: Implement secure authentication system
allowed-tools: Task, Read, Write, Edit, Bash, Grep, Glob
argument-hint: <auth requirements>
---

# Authentication Workflow

Implement auth: **$ARGUMENTS**

## Workflow Steps

### Step 1: Auth Design
**Agent:** @security-auditor

- Choose auth method (JWT, sessions, OAuth)
- Design token strategy
- Plan security measures
- Document requirements

### Step 2: Backend Auth
**Agent:** @fullstack-developer

- Implement auth endpoints
- Password hashing (bcrypt/argon2)
- Token generation
- Session management

### Step 3: Frontend Auth
**Agent:** @fullstack-developer

- Login/register forms
- Token storage
- Protected routes
- Auth state management

### Step 4: Security Hardening
**Agent:** @security-auditor

- Rate limiting
- CSRF protection
- XSS prevention
- Secure headers

### Step 5: Testing
**Agent:** @tester

- Auth flow tests
- Security tests
- Edge cases
- Token expiry

## Progress Tracking
- [ ] Auth designed
- [ ] Backend implemented
- [ ] Frontend implemented
- [ ] Security hardened
- [ ] Tests passing

Execute carefully. Security is critical.
