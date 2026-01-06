---
name: bug-fix
description: Systematic debugging and issue resolution with regression test enforcement
category: development
complexity: medium
estimated-time: 30min-4 hours
agents:
  - debugger
  - fullstack-developer
  - tester
  - git-manager
skills:
  - methodology/systematic-debugging
  - methodology/root-cause-tracing
  - methodology/test-driven-development
  - methodology/test-enforcement
commands:
  - /dev:fix
  - /dev:fix-fast
  - /dev:fix-hard
  - /dev:fix-test
  - /quality:verify-done
  - /git:cm
testing:
  default: true
  configurable: true
prerequisites:
  - Issue identified and reproducible
  - Access to relevant logs/errors
---

# Bug Fix Workflow

## Overview

The Bug Fix workflow provides a systematic approach to debugging and resolving issues. It ensures that bugs are properly investigated, fixed with minimal changes, and verified with regression tests.

## When to Use

- Fixing reported bugs
- Resolving error messages
- Addressing unexpected behavior
- Fixing failing tests
- Resolving production issues

## Steps

### Step 1: Investigation
**Agent:** debugger
**Command:** `/dev:fix "$ARGUMENTS"`
**Duration:** 15-60 minutes

The debugger agent will:
- Reproduce the issue
- Analyze error messages and stack traces
- Form hypotheses about root cause
- Test each hypothesis systematically
- Identify the actual root cause

**Output:** Root cause analysis

### Step 2: Implementation
**Agent:** fullstack-developer
**Command:** `/dev:fix-hard` (if needed)
**Duration:** 15-120 minutes

The fullstack developer will:
- Implement minimal fix
- Avoid introducing regressions
- Update related code if necessary
- Add defensive coding where appropriate

**Output:** Bug fix implementation

### Step 3: Verification
**Agent:** tester
**Command:** `/dev:fix-test`
**Duration:** 15-30 minutes

The tester agent will:
- Write regression test for the bug
- Run existing test suite
- Verify fix works in all scenarios
- Check for side effects

**Output:** Regression test and verification

### Step 4: Commit
**Agent:** git-manager
**Command:** `/git:cm`
**Duration:** 5-10 minutes

The git manager will:
- Commit fix with descriptive message
- Reference issue number
- Update changelog if needed

**Output:** Committed fix

## Quality Gates

- [ ] Root cause clearly identified and documented
- [ ] Fix is minimal and focused
- [ ] Regression test added
- [ ] All existing tests still pass
- [ ] No new issues introduced
- [ ] Fix committed with proper message

## Debug Process

```
Bug Fix Debug Process
=====================
1. REPRODUCE
   - Get exact steps to reproduce
   - Identify environment/conditions
   - Confirm bug is consistent

2. HYPOTHESIZE
   - Form 3-5 possible causes
   - Rank by likelihood
   - Plan how to test each

3. INVESTIGATE
   - Test most likely hypothesis first
   - Use debugging tools/logs
   - Narrow down to specific code

4. FIX
   - Implement minimal change
   - Consider edge cases
   - Document the fix

5. VERIFY
   - Test the fix works
   - Run regression tests
   - Check related functionality
```

## Tips

- Include the exact error message when describing the bug
- Provide steps to reproduce if known
- Include relevant log output
- Specify the environment (browser, OS, version)
- Link to related issues or discussions

## Testing Options

This workflow respects project testing configuration from `.omgkit/workflow.yaml`.

### Command Options

| Command | Default | Options |
|---------|---------|---------|
| `/dev:fix` | Tests enabled | `--no-test`, `--test-level` |
| `/dev:fix-fast` | Tests disabled | `--with-test`, `--test-level` |
| `/dev:fix-hard` | Tests enabled | `--no-test`, `--test-level` |

### Enforcement Levels

| Level | Regression Test | Test Failure |
|-------|-----------------|--------------|
| `soft` | Warning | Warning |
| `standard` | Warning | Block |
| `strict` | Block | Block |

### Configuration

```yaml
# .omgkit/workflow.yaml
testing:
  enabled: true
  enforcement:
    level: standard
```

```bash
# Set via CLI
omgkit config set testing.enforcement.level strict
```

## Example Usage

```bash
# Fix with regression test enforcement (default)
/dev:fix "TypeError: Cannot read property 'id' of undefined in UserService"

# Quick fix without tests (for typos)
/dev:fix-fast "typo in error message"

# Quick fix with test (optional)
/dev:fix-fast "wrong import path" --with-test

# Deep investigation with strict testing
/dev:fix-hard "Race condition in auth" --test-level strict

# Fix with issue reference
/dev:fix "Issue #123: Payment processing fails for amounts > $1000"
```

## Related Workflows

- `feature` - For adding new functionality
- `refactor` - For code improvements
- `security-audit` - For security-related bugs
