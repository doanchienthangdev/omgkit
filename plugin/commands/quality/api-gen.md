---
description: Generate API code from spec
allowed-tools: Task, Read, Write
argument-hint: <resource>
---

# 🔌 API Gen: $ARGUMENTS

Generate API code for: **$ARGUMENTS**

## Generates
- Route handler
- Validation schema
- Types/interfaces
- Tests
- Documentation

## Output Structure
```
src/api/[resource]/
├── route.ts
├── schema.ts
├── types.ts
└── route.test.ts
```
