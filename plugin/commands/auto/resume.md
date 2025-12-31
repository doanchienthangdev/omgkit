---
description: Resume autonomous execution from saved state
allowed-tools: Task, Read, Write, Edit, Bash, Glob, Grep, AskUserQuestion
argument-hint: "[--retry | --skip | --from <step>]"
---

# Resume Autonomous Execution

Resume project development from the last saved state.

## Resume Modes

### Default Resume
Continue from exact save point:
```bash
/auto:resume
```

### Retry Mode
Retry the last failed action:
```bash
/auto:resume --retry
```

### Skip Mode
Skip the problematic step and continue:
```bash
/auto:resume --skip
```

### From Specific Point
Resume from a specific step:
```bash
/auto:resume --from user_authentication
```

## Resume Process

### 1. Load State

Read `.omgkit/state.yaml`:
```yaml
phase: "backend"
status: "blocked"  # or "checkpoint", "in_progress"

resume_point:
  phase: "backend"
  feature: "user_authentication"
  step: "implement_login"
  attempt: 2

error_context:
  message: "Test failed: should hash password"
  file: "src/services/user.service.ts"
  line: 45
```

### 2. Validate Resume

Check if resume is possible:
- [ ] State file exists
- [ ] Not in "completed" status
- [ ] Resume point is valid
- [ ] No unresolved checkpoints (unless approved)

If checkpoint pending:
```
Cannot resume: Checkpoint pending approval.

Run `/auto:approve` to continue or `/auto:reject` with feedback.
```

### 3. Restore Context

Load relevant context:
1. **Memory files**: `.omgkit/memory/context/`
2. **Generated artifacts**: `.omgkit/generated/`
3. **Current feature state**: Progress, tests, issues
4. **Error context**: If resuming from error

### 4. Execute Resume

Based on mode:

#### Default/Retry
```
Resuming from: {phase} > {feature} > {step}
Attempt: {attempt + 1}

[Previous context restored]
[Continuing execution...]
```

#### Skip
```
Skipping: {step}
Marking as: SKIPPED (requires manual completion)

Continuing with next step: {next_step}
```

#### From Specific
```
Resetting to: {specified_step}
Warning: Progress after this point will be re-executed.

Continuing from: {specified_step}
```

### 5. Continue Execution

After resume setup:
1. Execute remaining steps in current feature
2. Continue with `/auto:start` logic
3. Handle checkpoints and quality gates normally

## Recovery Strategies

### On Test Failure

```yaml
error_type: "test_failure"
recovery:
  - analyze_failure: true
  - suggest_fix: true
  - auto_fix_confidence: 0.8  # If > 0.7, attempt auto-fix
```

If auto-fix confidence is high:
1. Analyze the failure
2. Generate fix
3. Apply fix
4. Re-run tests
5. If still failing after 2 attempts, ask for help

### On Build Failure

```yaml
error_type: "build_failure"
recovery:
  - check_imports: true
  - check_types: true
  - suggest_fix: true
```

1. Analyze build error
2. Check for common issues (imports, types, syntax)
3. Suggest or apply fix
4. Retry build

### On External Failure

```yaml
error_type: "external_failure"  # API, database, etc.
recovery:
  - retry_with_backoff: true
  - max_retries: 3
```

1. Wait with exponential backoff
2. Retry operation
3. If persistent, mark as blocked

## State Updates on Resume

```yaml
# Before resume
status: "blocked"
resume_point:
  attempt: 2

# After successful resume start
status: "in_progress"
resume_point:
  attempt: 3
  resumed_at: "2024-01-15T10:30:00Z"
```

## Output

```
## Resuming Autonomous Execution

**Project:** [Name]
**Resume Point:** [phase] > [feature] > [step]
**Previous Status:** [blocked/checkpoint]
**Attempt:** [number]

### Context Restored
- ✓ Memory context loaded
- ✓ Feature state restored
- ✓ Error context analyzed

### Recovery Action
[Describe what will be done to recover]

### Continuing...

[Normal execution output continues]
```

## Error Handling

If resume fails:

```
## Resume Failed

**Reason:** [Why resume failed]

### State
- Phase: [phase]
- Feature: [feature]
- Step: [step]

### Options
1. `/auto:resume --skip` - Skip this step
2. `/auto:resume --from {previous_step}` - Go back
3. Fix manually and run `/auto:resume --retry`

### Manual Recovery
If needed, you can:
1. Edit `.omgkit/state.yaml` directly
2. Fix the code issue
3. Run `/auto:resume`
```

## Safeguards

1. **Maximum Attempts**: After 3 failed attempts at same step, force checkpoint
2. **Infinite Loop Detection**: Track step history, detect cycles
3. **State Backup**: Before each resume, backup current state
4. **Rollback Option**: Can restore to any previous checkpoint
