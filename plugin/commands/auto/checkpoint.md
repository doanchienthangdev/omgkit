---
description: Force a checkpoint for review
allowed-tools: Read, Write
argument-hint: "[<reason>]"
---

# Force Checkpoint

Create a manual checkpoint to pause execution and request review.

## Usage

### Basic Checkpoint
```bash
/auto:checkpoint
```

### Checkpoint with Reason
```bash
/auto:checkpoint "Want to review before implementing payments"
```

## When to Use

Use `/auto:checkpoint` when you want to:
- Review progress before a critical section
- Discuss approach before continuing
- Take a break and ensure state is saved
- Review generated code quality
- Validate direction before more work

## Checkpoint Process

### 1. Save Current State

Capture complete state snapshot:
```yaml
checkpoint:
  pending: true
  type: "manual"
  reason: "Want to review before implementing payments"
  timestamp: "2024-01-15T10:30:00Z"

  snapshot:
    phase: "backend"
    feature: "user_authentication"
    step: "implement_password_reset"
    progress_percentage: 45

  files_modified_since_last_checkpoint:
    - "src/services/user.service.ts"
    - "src/utils/password.ts"
    - "src/routes/auth.routes.ts"
```

### 2. Run Quality Gates

Execute any applicable quality gates:
```yaml
quality_gates_run:
  - name: "npm test"
    status: "passed"
    duration: "4.2s"
  - name: "npm run build"
    status: "passed"
    duration: "8.1s"
```

### 3. Generate Summary

Create checkpoint summary with:
- Work completed since last checkpoint
- Current state
- Pending work
- Any issues or decisions needed

### 4. Update State

```yaml
status: "checkpoint"
checkpoint:
  pending: true
  # ... checkpoint data
```

## Output

```
## Checkpoint Created ⏸️

**Reason:** Want to review before implementing payments
**Time:** 2024-01-15 10:30:00

### Progress Summary

**Overall:** [████████░░░░░░░░░░░░] 45%

**Current Position:**
- Phase: Backend (3 of 7)
- Feature: User Authentication (5 of 7 steps)
- Next: Password Reset Implementation

### Work Completed Since Last Checkpoint

#### Files Created (3)
- `src/services/user.service.ts` - User service with CRUD
- `src/utils/password.ts` - Password hashing utilities
- `src/utils/password.test.ts` - Password utility tests

#### Files Modified (2)
- `src/routes/auth.routes.ts` - Added login/register routes
- `src/app.ts` - Registered auth routes

#### Tests Added (8)
- User service tests: 5 passing
- Password utility tests: 3 passing

### Quality Gates

| Gate | Status | Details |
|------|--------|---------|
| npm test | ✅ Pass | 8/8 tests |
| npm build | ✅ Pass | No errors |
| Coverage | ⚠️ 78% | Target: 80% |

### Code Statistics

```
Files Changed: 5
Lines Added: 342
Lines Removed: 12
Test Coverage: 78%
```

### Pending Work

**Remaining in Current Feature:**
1. ⏳ Implement password reset
2. ⏳ Add email verification

**Next Features:**
- User Profile Management
- Session Management

### Review Points

Before continuing, you may want to review:

1. **Authentication Approach**
   - Using JWT with 24h expiry
   - Storing refresh tokens in database

2. **Password Security**
   - bcrypt with cost factor 12
   - Minimum 8 characters required

3. **Upcoming: Payment Integration**
   - Will use Stripe
   - Need to discuss pricing tiers

---

**Commands:**
- `/auto:approve` - Approve and continue
- `/auto:reject "feedback"` - Request changes
- `/auto:status --verbose` - Detailed status
- `/auto:verify` - Run full verification
```

## Checkpoint Types

### Phase Checkpoint (Automatic)
Created automatically at phase boundaries:
```yaml
checkpoint:
  type: "phase"
  phase: "planning"
  description: "Planning phase complete"
```

### Quality Gate Checkpoint (Automatic)
Created when quality gate fails:
```yaml
checkpoint:
  type: "quality_gate"
  gate: "coverage"
  reason: "Coverage 76% below threshold 80%"
```

### Decision Checkpoint (Automatic)
Created when high-autonomy decision needed:
```yaml
checkpoint:
  type: "decision"
  decision_id: "payment_provider"
  level: 3
```

### Manual Checkpoint (User Initiated)
Created via `/auto:checkpoint`:
```yaml
checkpoint:
  type: "manual"
  reason: "User requested review"
```

## Checkpoint History

View checkpoint history:
```yaml
checkpoint_history:
  - id: "cp_001"
    type: "phase"
    phase: "discovery"
    timestamp: "2024-01-15T09:00:00Z"
    approved_at: "2024-01-15T09:05:00Z"

  - id: "cp_002"
    type: "phase"
    phase: "planning"
    timestamp: "2024-01-15T09:30:00Z"
    approved_at: "2024-01-15T09:45:00Z"

  - id: "cp_003"
    type: "manual"
    reason: "Review before payments"
    timestamp: "2024-01-15T10:30:00Z"
    status: "pending"
```

## Checkpoint Files

Each checkpoint creates:
```
.omgkit/checkpoints/
├── cp_001_discovery.yaml
├── cp_002_planning.yaml
└── cp_003_manual.yaml
```

Checkpoint file contains full state snapshot for potential rollback.

## Rollback to Checkpoint

If needed, can rollback to previous checkpoint:
```bash
/auto:resume --from-checkpoint cp_002
```

This restores:
- State to checkpoint moment
- Allows re-execution from that point
- Previous work preserved in git history
