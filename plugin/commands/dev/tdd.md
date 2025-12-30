---
description: Test-driven development workflow
allowed-tools: Task, Read, Write, Bash, Glob
argument-hint: <feature>
---

# 🔴🟢♻️ TDD: $ARGUMENTS

Test-driven development for: **$ARGUMENTS**

## TDD Cycle
1. 🔴 **RED** - Write failing test
2. 🟢 **GREEN** - Make it pass (minimal code)
3. ♻️ **REFACTOR** - Improve code
4. Repeat

## Rules
- No production code without failing test
- Only enough code to pass test
- Refactor only when green

## Process
For each requirement:
1. Write test first
2. Run test (should fail)
3. Write minimal code to pass
4. Run test (should pass)
5. Refactor if needed
6. Next requirement
