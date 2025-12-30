---
name: token-optimization
description: Token/cost optimization. Use for efficient AI interactions.
---

# Token Optimization Skill

## Strategies

### 1. Concise Prompts
```
# Bad
Can you please help me understand what this function does
and explain it in detail with examples?

# Good
Explain this function briefly.
```

### 2. Targeted Reading
```
# Bad
Read("entire-large-file.ts")

# Good
Read("file.ts", { offset: 50, limit: 30 })
```

### 3. Efficient Searches
```
# Bad
Grep(".*") in all files

# Good
Grep("specificPattern", { path: "src/", glob: "*.ts" })
```

### 4. Batch Operations
```
# Bad
Multiple separate tool calls

# Good
Combined operations in one call
```

## Savings
- 30-70% reduction possible
- Focus on high-value output
- Minimize unnecessary context
- Use token-efficient mode
