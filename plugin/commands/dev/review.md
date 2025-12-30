---
description: Code review with security and quality focus
allowed-tools: Read, Grep, Glob
argument-hint: [file or directory]
---

# 🔍 Review: $ARGUMENTS

Code review for: **$ARGUMENTS**

## Checklist

### Security
- [ ] No hardcoded secrets
- [ ] Input validation
- [ ] SQL injection prevention
- [ ] XSS prevention

### Performance
- [ ] No N+1 queries
- [ ] Efficient algorithms
- [ ] Proper caching

### Quality
- [ ] Single responsibility
- [ ] No duplication
- [ ] Proper error handling
- [ ] Type safety

## Output
Provide: APPROVED or CHANGES_REQUESTED with details.
