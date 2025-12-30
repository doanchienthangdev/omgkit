---
name: systematic-debugging
description: Systematic debugging process. Use when investigating bugs.
---

# Systematic Debugging Skill

## Process

### 1. Reproduce
- Can you reproduce consistently?
- What are the exact steps?
- What environment?

### 2. Isolate
- What's the smallest case?
- Which component fails?
- When did it start?

### 3. Hypothesize
Form 3 hypotheses:
1. [Most likely cause]
2. [Second possibility]
3. [Unlikely but possible]

### 4. Test
- Test each hypothesis
- Use binary search for large codebases
- Add logging strategically

### 5. Fix
- Minimal fix first
- Add regression test
- Verify fix works

## Tools
```bash
git bisect start
git bisect bad HEAD
git bisect good v1.0.0
```

## Output
```markdown
## Debug Report
- Problem: [Description]
- Root Cause: [Actual cause]
- Fix: [What changed]
- Prevention: [How to prevent]
```
