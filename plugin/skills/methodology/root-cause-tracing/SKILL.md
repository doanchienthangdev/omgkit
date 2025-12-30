---
name: root-cause-tracing
description: Finding root causes. Use when debugging complex issues.
---

# Root Cause Tracing Skill

## 5 Whys
```
Problem: App crashed
Why? → Out of memory
Why? → Memory leak
Why? → Event listeners not cleaned
Why? → Missing cleanup in useEffect
Why? → Developer unaware of cleanup pattern
Root: Training/documentation gap
```

## Fishbone Diagram
```
                    ┌─ Code
                    ├─ Config
Problem ────────────├─ Environment
                    ├─ Data
                    └─ Dependencies
```

## Categories
1. **Code** - Bug in logic
2. **Data** - Invalid input
3. **Config** - Wrong settings
4. **Environment** - System issues
5. **External** - Third-party failure

## Output
```markdown
## Root Cause Analysis

### Symptom
[What was observed]

### Proximate Cause
[Immediate cause]

### Root Cause
[Underlying reason]

### Systemic Factors
[Why it wasn't caught]

### Prevention
[How to prevent recurrence]
```
