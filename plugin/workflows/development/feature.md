---
name: feature
description: Complete feature development from planning to deployment with configurable test enforcement
category: development
complexity: medium
estimated-time: 2-8 hours
agents:
  - planner
  - fullstack-developer
  - tester
  - code-reviewer
  - git-manager
skills:
  - methodology/writing-plans
  - methodology/executing-plans
  - methodology/test-driven-development
  - methodology/test-enforcement
  - methodology/test-task-generation
commands:
  - /planning:plan
  - /dev:feature
  - /dev:feature-tested
  - /dev:test
  - /dev:review
  - /quality:verify-done
  - /git:commit
  - /git:pr
testing:
  default: true
  configurable: true
prerequisites:
  - Project initialized with omgkit
  - Git repository configured
---

# Feature Development Workflow

## Overview

The Feature Development workflow guides you through implementing a complete feature from initial planning to deployment-ready code. It orchestrates multiple agents to ensure high-quality, well-tested, and properly reviewed code.

## When to Use

- Building new functionality
- Adding significant enhancements
- Implementing user stories
- Creating new modules or components

## Steps

### Step 1: Planning
**Agent:** planner
**Command:** `/planning:plan "$ARGUMENTS"`
**Duration:** 15-30 minutes

The planner agent will:
- Analyze feature requirements
- Break down into implementable tasks
- Create detailed implementation plan
- Define acceptance criteria
- Identify dependencies and risks

**Output:** Implementation plan in `.omgkit/plans/`

### Step 2: Implementation
**Agent:** fullstack-developer
**Command:** `/dev:feature "$ARGUMENTS"`
**Duration:** 1-4 hours

The fullstack developer will:
- Follow the implementation plan
- Write code incrementally
- Add inline documentation
- Follow coding standards
- Create necessary files and components

**Output:** Feature code implemented

### Step 3: Testing
**Agent:** tester
**Command:** `/dev:test`
**Duration:** 30-60 minutes

The tester agent will:
- Write unit tests for new code
- Write integration tests
- Achieve coverage target (>80%)
- Run all tests and fix failures

**Output:** Test suite with passing tests

### Step 4: Code Review
**Agent:** code-reviewer
**Command:** `/dev:review`
**Duration:** 15-30 minutes

The code reviewer will:
- Review code quality
- Check for security issues
- Verify best practices
- Suggest improvements
- Ensure maintainability

**Output:** Review comments and fixes

### Step 5: Commit & PR
**Agent:** git-manager
**Command:** `/git:pr "feature/$BRANCH_NAME"`
**Duration:** 10-15 minutes

The git manager will:
- Create feature branch
- Stage and commit changes
- Write meaningful commit message
- Create pull request
- Add PR description

**Output:** Pull request ready for merge

## Quality Gates

- [ ] Implementation plan approved and documented
- [ ] All code follows project coding standards
- [ ] Test coverage exceeds 80%
- [ ] No security vulnerabilities detected
- [ ] Code review passed with no blocking issues
- [ ] Pull request created and ready for merge

## Progress Tracking

```
Feature Development Progress
============================
[ ] Step 1: Planning
    [ ] Requirements analyzed
    [ ] Tasks broken down
    [ ] Plan documented
[ ] Step 2: Implementation
    [ ] Core functionality
    [ ] Edge cases handled
    [ ] Documentation added
[ ] Step 3: Testing
    [ ] Unit tests written
    [ ] Integration tests written
    [ ] All tests passing
[ ] Step 4: Review
    [ ] Review requested
    [ ] Comments addressed
    [ ] Review approved
[ ] Step 5: Deployment
    [ ] PR created
    [ ] CI passing
    [ ] Ready for merge
```

## Tips

- Start with a clear, concise feature description
- Include specific requirements and constraints
- Reference any design documents or mockups
- Specify the target completion timeframe
- Include any dependencies on other features

## Testing Options

This workflow respects project testing configuration from `.omgkit/workflow.yaml`.

### Command Options

| Option | Description | Example |
|--------|-------------|---------|
| `--no-test` | Skip test enforcement | `/dev:feature "login" --no-test` |
| `--test-level <level>` | Override enforcement level | `/dev:feature "auth" --test-level strict` |
| `--coverage <percent>` | Override coverage minimum | `/dev:feature "api" --coverage 95` |

### Configuration

```yaml
# .omgkit/workflow.yaml
testing:
  enabled: true
  enforcement:
    level: standard  # soft | standard | strict
  coverage_gates:
    unit:
      minimum: 80
```

### CLI Configuration

```bash
# Set enforcement level
omgkit config set testing.enforcement.level strict

# View testing config
omgkit config list testing
```

## Example Usage

```bash
# Full feature workflow with default testing
/workflow:feature "user authentication with OAuth2 support"

# With strict test enforcement
/dev:feature "payment processing" --test-level strict

# With specific coverage requirement
/dev:feature "shopping cart" --coverage 95

# Skip testing for prototype (soft level required)
/dev:feature "quick prototype" --no-test
```

## Related Workflows

- `bug-fix` - For fixing issues in existing features
- `refactor` - For improving existing code
- `full-feature` - For complex full-stack features
