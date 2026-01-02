---
name: authentication
description: Implement authentication system
category: fullstack
complexity: high
estimated-time: 4-12 hours
agents:
  - planner
  - fullstack-developer
  - security-auditor
  - tester
skills:
  - security/oauth
  - security/better-auth
  - security/owasp
  - security/security-hardening
commands:
  - /planning:plan
  - /dev:feature
  - /quality:security-scan
  - /dev:test
prerequisites:
  - Auth strategy chosen
  - User model defined
---

# Authentication Workflow

## Overview

The Authentication workflow guides implementation of secure authentication systems including registration, login, session management, and OAuth.

## When to Use

- Adding auth to new projects
- Implementing OAuth
- Upgrading auth security
- Adding MFA

## Steps

### Step 1: Auth Planning
**Agent:** planner
**Command:** `/planning:plan "authentication"`
**Duration:** 30-60 minutes

Plan authentication:
- Choose auth method
- Define user flow
- Plan security measures
- Identify providers

**Output:** Auth plan

### Step 2: Backend Auth
**Agent:** fullstack-developer
**Duration:** 2-4 hours

Implement backend:
- Auth endpoints
- Password hashing
- Session management
- Token handling

**Output:** Backend auth

### Step 3: OAuth Integration
**Agent:** fullstack-developer
**Duration:** 1-2 hours (if needed)

Add OAuth:
- Configure providers
- Implement callbacks
- Handle tokens
- Link accounts

**Output:** OAuth integration

### Step 4: Frontend Auth
**Agent:** fullstack-developer
**Duration:** 2-3 hours

Build frontend:
- Login/signup forms
- Auth state management
- Protected routes
- Error handling

**Output:** Frontend auth

### Step 5: Security Review
**Agent:** security-auditor
**Command:** `/quality:security-scan`
**Duration:** 1-2 hours

Security audit:
- Password security
- Session security
- CSRF protection
- XSS prevention

**Output:** Security report

### Step 6: Testing
**Agent:** tester
**Command:** `/dev:test`
**Duration:** 1-2 hours

Auth testing:
- Registration tests
- Login tests
- Session tests
- Security tests

**Output:** Test suite

## Quality Gates

- [ ] Auth method implemented
- [ ] Passwords securely hashed
- [ ] Sessions properly managed
- [ ] OAuth working (if used)
- [ ] Security review passed
- [ ] All tests passing

## Auth Security Checklist

```
Authentication Security
=======================
[ ] Passwords hashed (bcrypt/argon2)
[ ] Rate limiting implemented
[ ] Account lockout after failures
[ ] Session tokens secure
[ ] HTTPS enforced
[ ] CSRF protection
[ ] Secure cookie settings
[ ] Password requirements
[ ] Email verification
[ ] Password reset secure
```

## Example Usage

```bash
/workflow:authentication "JWT-based auth with Google OAuth"
/workflow:authentication "session-based auth with MFA"
```

## Related Workflows

- `security-audit` - For security review
- `full-feature` - For complete features
