---
name: refactor
description: Improve code quality without changing behavior
category: development
complexity: medium
estimated-time: 1-4 hours
agents:
  - code-reviewer
  - fullstack-developer
  - tester
  - git-manager
skills:
  - methodology/verification-before-completion
  - methodology/test-driven-development
commands:
  - /quality:refactor
  - /dev:test
  - /dev:review
  - /git:commit
prerequisites:
  - Adequate test coverage exists
  - Clear refactoring goals defined
---

# Refactoring Workflow

## Overview

The Refactoring workflow helps improve code quality, maintainability, and performance without changing the external behavior. It ensures changes are safe through comprehensive testing.

## When to Use

- Reducing code complexity
- Improving readability
- Eliminating code duplication
- Applying design patterns
- Optimizing performance
- Modernizing legacy code

## Steps

### Step 1: Analysis
**Agent:** code-reviewer
**Command:** `/quality:refactor "$ARGUMENTS"`
**Duration:** 15-30 minutes

The code reviewer will:
- Analyze current code structure
- Identify refactoring opportunities
- Assess risk and impact
- Create refactoring plan

**Output:** Refactoring plan

### Step 2: Ensure Test Coverage
**Agent:** tester
**Command:** `/dev:test`
**Duration:** 15-45 minutes

The tester agent will:
- Check existing test coverage
- Add tests for uncovered code
- Create characterization tests
- Establish behavior baseline

**Output:** Comprehensive test coverage

### Step 3: Refactor
**Agent:** fullstack-developer
**Command:** Implement refactoring
**Duration:** 30-120 minutes

The fullstack developer will:
- Apply refactoring incrementally
- Run tests after each change
- Maintain external behavior
- Follow refactoring patterns

**Output:** Refactored code

### Step 4: Verify
**Agent:** tester
**Command:** `/dev:test`
**Duration:** 15-30 minutes

The tester agent will:
- Run all tests
- Verify behavior unchanged
- Check performance impact
- Validate improvements

**Output:** Verification report

### Step 5: Review & Commit
**Agent:** code-reviewer, git-manager
**Command:** `/dev:review && /git:commit`
**Duration:** 15-30 minutes

Review the refactoring and commit:
- Verify refactoring goals met
- Check code quality improved
- Commit with clear message

**Output:** Committed refactoring

## Quality Gates

- [ ] Test coverage adequate before starting
- [ ] All tests pass after each change
- [ ] External behavior unchanged
- [ ] Code quality metrics improved
- [ ] Performance not degraded
- [ ] Changes reviewed and approved

## Refactoring Patterns

```
Common Refactoring Patterns
===========================
- Extract Method: Break large methods into smaller ones
- Extract Class: Split large classes
- Rename: Improve naming clarity
- Move Method/Field: Better organization
- Replace Conditional with Polymorphism
- Introduce Parameter Object
- Replace Magic Numbers with Constants
- Remove Dead Code
```

## Tips

- Always have tests before refactoring
- Make small, incremental changes
- Run tests after each change
- Commit frequently
- Don't mix refactoring with feature changes

## Example Usage

```bash
# Refactor specific area
/workflow:refactor "UserService class - reduce complexity"

# Refactor for performance
/workflow:refactor "database queries in OrderRepository"

# Refactor for readability
/workflow:refactor "authentication middleware - improve clarity"
```

## Related Workflows

- `feature` - For adding new functionality
- `performance-optimization` - For performance-focused improvements
- `code-review` - For review-only workflows
