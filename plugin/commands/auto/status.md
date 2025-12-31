---
description: Show autonomous project status and progress
allowed-tools: Read, Glob
argument-hint: "[--verbose]"
---

# Autonomous Project Status

Display comprehensive status of the autonomous project development.

## Status Display

### 1. Load Project State

Read from `.omgkit/state.yaml`:
- Project info
- Current phase
- Current status
- Progress data
- Checkpoint state

### 2. Load Archetype

Load archetype definition to understand:
- Total phases
- Phase order
- Remaining work

### 3. Calculate Progress

```
Total Progress = (completed_phases / total_phases) * 100

Phase Progress = (completed_steps / total_steps) * 100

Feature Progress = (completed_features / total_features) * 100
```

### 4. Generate Status Report

## Output Format

```
## Project Status: [Project Name]

**Type:** [project_type] | **Archetype:** [archetype_name]
**Status:** [status_emoji] [status_text]
**Started:** [date] | **Last Activity:** [date]

### Overall Progress
[████████░░░░░░░░░░░░] 42%

### Phase Progress

| Phase | Status | Progress |
|-------|--------|----------|
| ✅ Discovery | Complete | 100% |
| ✅ Planning | Complete | 100% |
| 🔄 Foundation | In Progress | 60% |
| ⏳ Backend | Pending | 0% |
| ⏳ Frontend | Pending | 0% |
| ⏳ Integration | Pending | 0% |
| ⏳ Hardening | Pending | 0% |
| ⏳ Deployment | Pending | 0% |

### Current Phase: Foundation

**Progress:** [████████░░] 60%

| Task | Status |
|------|--------|
| ✅ Project scaffolding | Complete |
| ✅ Database setup | Complete |
| 🔄 UI foundation | In Progress |

### Features Status

| Feature | Phase | Status | Tests |
|---------|-------|--------|-------|
| User Auth | Backend | ✅ Complete | 12/12 |
| User Profile | Backend | 🔄 In Progress | 5/8 |
| Dashboard | Frontend | ⏳ Pending | 0/0 |

### Quality Gates

| Gate | Status | Last Run |
|------|--------|----------|
| npm test | ✅ Pass | 2 min ago |
| npm run build | ✅ Pass | 5 min ago |
| Coverage (80%) | ⚠️ 76% | 2 min ago |

### Pending Decisions

1. **Database Index Strategy** (Level 2)
   - Suggested: Add composite index on users(email, status)
   - Waiting for: Quick approval

### Recent Activity

- [10:45] Completed UserService.create()
- [10:42] Added password validation
- [10:38] Created User model with Prisma
- [10:35] Started feature: user_authentication

### Artifacts Generated

- `.omgkit/generated/prd.md` ✅
- `.omgkit/generated/schema.sql` ✅
- `.omgkit/generated/api-spec.md` ✅
- `src/models/user.ts` ✅
- `src/services/user.service.ts` 🔄

### Next Actions

1. Complete UserService implementation
2. Write integration tests
3. Run code review workflow

---

**Commands:**
- `/auto:resume` - Continue execution
- `/auto:approve` - Approve pending decisions
- `/auto:checkpoint` - Force checkpoint
```

## Verbose Mode

With `--verbose` flag, also show:

### Detailed Logs
```
### Execution Log (Last 50 entries)

[10:45:23] INFO  Completed: UserService.create()
[10:45:22] DEBUG Running test: user.service.test.ts
[10:45:20] INFO  Generated: src/services/user.service.ts
[10:45:18] DEBUG Analyzing feature requirements
...
```

### Memory State
```
### Memory Context

**Active Context Files:**
- project-brief.md (1.2KB)
- current-feature.md (0.8KB)

**Decisions Made:** 5
**Journal Entries:** 3
**Patterns Recorded:** 2
```

### Resource Usage
```
### Session Stats

- API Calls: 142
- Tokens Used: ~45,000
- Time Elapsed: 23 minutes
- Files Modified: 12
- Tests Run: 28
```

## Status Codes

| Status | Emoji | Meaning |
|--------|-------|---------|
| ready | 🟢 | Ready to start/continue |
| in_progress | 🔄 | Currently executing |
| checkpoint | ⏸️ | Paused for approval |
| blocked | 🔴 | Error or issue |
| completed | ✅ | All phases done |

## Special States

### Checkpoint State
```
### ⏸️ CHECKPOINT: Planning Phase Complete

**Reason:** Phase completion requires approval
**Pending Since:** 5 minutes ago

**Review Required:**
- `.omgkit/generated/schema.sql` - Database schema
- `.omgkit/generated/api-spec.md` - API specification

**Actions:**
- `/auto:approve` - Approve and continue
- `/auto:reject "feedback"` - Request changes
```

### Blocked State
```
### 🔴 BLOCKED: Test Failure

**Error:** 3 tests failing in user.service.test.ts
**Since:** 2 minutes ago

**Failed Tests:**
1. should hash password correctly
2. should validate email format
3. should prevent duplicate emails

**Suggested Fix:**
Check the bcrypt import in user.service.ts

**Actions:**
- Fix the issue manually
- `/auto:resume` - Retry after fixing
```
