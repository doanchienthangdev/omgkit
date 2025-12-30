---
name: omega-coding
description: AI-first development patterns. Use for leveraging AI in development.
---

# Omega Coding Skill

## Principles

### 1. AI-First Design
Design for AI assistance:
- Clear interfaces
- Self-documenting code
- Predictable patterns

### 2. Prompt-Driven Development
```markdown
1. Write clear requirements
2. Let AI generate first draft
3. Review and refine
4. Iterate with feedback
```

### 3. Leverage Multiplication (Ω1)
```
Manual:    1 task = 1 hour
AI-Assisted: 1 task = 5 minutes
Leverage:  12x improvement
```

## Patterns

### Specification First
```markdown
## Spec: UserService

### Methods
- createUser(email, password) → User
- getUser(id) → User | null

### Constraints
- Email must be unique
- Password hashed with bcrypt

### Tests
- Creates user successfully
- Rejects duplicate email
```

### Iterative Refinement
1. Generate initial code
2. Add tests
3. Fix edge cases
4. Optimize
5. Document

## Best Practices
- Clear specifications
- Incremental generation
- Verification at each step
- Learn from AI suggestions
