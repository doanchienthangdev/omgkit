---
name: executing-plans
description: Systematic plan execution with progress tracking, quality gates, and blocker resolution
category: methodology
triggers:
  - executing plans
  - following plan
  - implementation
  - executing tasks
  - working on plan
  - task execution
---

# Executing Plans

Master **systematic plan execution** with disciplined task progression, quality validation, and clear communication. This skill ensures plans are executed efficiently while maintaining high standards and adapting to discoveries.

## Purpose

Transform plans into successful outcomes:

- Execute tasks in optimal sequence
- Maintain momentum through blockers
- Validate quality at each checkpoint
- Track and communicate progress
- Adapt to new information gracefully
- Complete work to high standards
- Document learnings for future reference

## Features

### 1. Execution Workflow

```markdown
## Plan Execution Process

┌───────────────────────────────────────────────────────────────┐
│                       START EXECUTION                          │
└───────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────────┐
│ PHASE 1: PREPARATION                                          │
│ ─────────────────────                                         │
│ □ Read entire plan thoroughly                                 │
│ □ Verify understanding of goals                               │
│ □ Check all dependencies are available                        │
│ □ Set up development environment                              │
│ □ Identify potential blockers early                           │
│ □ Confirm with stakeholders if unclear                        │
└───────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────────┐
│ PHASE 2: EXECUTE TASK                                         │
│ ─────────────────────                                         │
│ For each task in sequence:                                    │
│                                                               │
│   1. READ: Understand task requirements                       │
│      └─ What exactly needs to be done?                       │
│      └─ What are the acceptance criteria?                    │
│      └─ What files/locations are involved?                   │
│                                                               │
│   2. NAVIGATE: Go to code location                           │
│      └─ Open specified files                                 │
│      └─ Understand existing code                             │
│      └─ Identify integration points                          │
│                                                               │
│   3. IMPLEMENT: Make the changes                             │
│      └─ Write minimal code to satisfy criteria               │
│      └─ Follow coding standards                              │
│      └─ Add appropriate tests                                │
│                                                               │
│   4. VERIFY: Confirm it works                                │
│      └─ Run relevant tests                                   │
│      └─ Manual verification if needed                        │
│      └─ Check edge cases                                     │
│                                                               │
│   5. COMPLETE: Mark task done                                │
│      └─ Update task status                                   │
│      └─ Note any deviations                                  │
│      └─ Proceed to next task                                 │
└───────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────────┐
│ PHASE 3: QUALITY GATES                                        │
│ ──────────────────────                                        │
│                                                               │
│ After EACH task:                                              │
│ □ Does implementation match acceptance criteria?             │
│ □ Do tests pass?                                              │
│ □ Any regressions introduced?                                │
│                                                               │
│ After EACH phase/milestone:                                  │
│ □ Run full test suite                                         │
│ □ Code review (self or peer)                                 │
│ □ Update progress report                                      │
│                                                               │
│ Before COMPLETION:                                            │
│ □ All tasks completed                                         │
│ □ All tests passing                                           │
│ □ Documentation updated                                       │
│ □ Ready for final review                                      │
└───────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────────┐
│                       PLAN COMPLETE                            │
└───────────────────────────────────────────────────────────────┘
```

### 2. Task Execution Checklist

```markdown
## Per-Task Execution Template

### Task: [TASK-ID] - [Task Name]

#### Before Starting
- [ ] Read task description completely
- [ ] Understand acceptance criteria
- [ ] Check dependencies completed
- [ ] No blockers present
- [ ] Time estimate reasonable

#### During Implementation
- [ ] Navigate to specified files
- [ ] Understand existing code context
- [ ] Implement changes incrementally
- [ ] Write tests alongside code
- [ ] Follow style guide

#### After Completion
- [ ] All acceptance criteria met
- [ ] Tests pass locally
- [ ] No lint/type errors
- [ ] Self-review done
- [ ] Task marked complete

#### Notes
- Started: [Time]
- Completed: [Time]
- Actual vs Estimated: [X hours vs Y hours]
- Deviations: [Any changes from plan]
- Learnings: [Anything useful discovered]
```

### 3. Progress Tracking

```markdown
## Progress Report Templates

### Quick Status Update
```markdown
## Status: [Date Time]

### Summary
- ✅ Completed: [N] tasks
- 🔄 In Progress: [Task name]
- ⏳ Remaining: [M] tasks
- 🚫 Blockers: [None | Description]

### ETA
On track for [original date] | Delayed by [reason]
```

### Detailed Progress Report
```markdown
## Progress Report: [Plan Name]

### Overview
- Start Date: [Date]
- Target Date: [Date]
- Current Status: On Track | At Risk | Blocked | Ahead

### Completed Tasks (X/Y)
| Task | Status | Notes |
|------|--------|-------|
| [Task 1] | ✅ | Completed as planned |
| [Task 2] | ✅ | Required API change |
| [Task 3] | ⏭️ | Skipped - not needed |

### Current Task
**[Task 4]:** [Description]
- Started: [Time]
- Progress: ~60%
- Expected completion: [Time]
- Notes: [Any observations]

### Remaining Tasks
| Task | Dependencies | Estimate | Risk |
|------|--------------|----------|------|
| [Task 5] | Task 4 | 2h | Low |
| [Task 6] | Task 5 | 1h | Low |
| [Task 7] | Task 6 | 4h | Medium |

### Blockers & Risks
| Issue | Impact | Mitigation | Owner |
|-------|--------|------------|-------|
| [Issue] | [High/Med/Low] | [Action] | [Name] |

### Decisions Made
1. **[Decision]**: [Rationale]

### Help Needed
- [ ] [Request for assistance]

### Next Update
[Scheduled time for next update]
```

### Visual Progress Board
```
Phase 1: Setup         ████████████████████ 100%
Phase 2: Core Logic    ██████████████░░░░░░  70%
Phase 3: Integration   ░░░░░░░░░░░░░░░░░░░░   0%
Phase 4: Testing       ░░░░░░░░░░░░░░░░░░░░   0%

Overall: ███████████░░░░░░░░░ 55%
```

### 4. Blocker Resolution

```markdown
## Blocker Management Protocol

### Blocker Classification

| Type | Example | Resolution Approach |
|------|---------|---------------------|
| Technical | Unexpected API behavior | Debug, research, escalate |
| Dependency | Waiting on other task | Parallel work, resequence |
| Knowledge | Don't know how to do X | Research, ask, pair |
| Access | Missing permissions | Request access, escalate |
| External | Third-party down | Wait, workaround, escalate |
| Scope | Requirements unclear | Clarify with stakeholder |

### Blocker Response Process

```
BLOCKER DETECTED
      │
      ▼
┌─────────────────────────────────────────────┐
│ 1. DOCUMENT immediately                      │
│    - What is blocked?                        │
│    - Why is it blocked?                      │
│    - When did it start?                      │
└─────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────┐
│ 2. ASSESS impact                             │
│    - Critical path affected?                 │
│    - Other tasks dependent?                  │
│    - Time sensitive?                         │
└─────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────┐
│ 3. ATTEMPT resolution (15-30 min)           │
│    - Quick research                          │
│    - Alternative approach                    │
│    - Workaround possible?                    │
└─────────────────────────────────────────────┘
      │
      ├──► RESOLVED ──► Continue execution
      │
      ▼
┌─────────────────────────────────────────────┐
│ 4. ESCALATE if not resolved                 │
│    - Report to lead/stakeholder             │
│    - Include: issue, attempts, ask          │
└─────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────┐
│ 5. WORK AROUND while waiting                │
│    - Move to non-blocked tasks              │
│    - Document workaround if temporary       │
└─────────────────────────────────────────────┘
```

### Blocker Report Template
```markdown
## Blocker Report

### Issue
[Clear description of the blocker]

### Impact
- **Blocked tasks:** [List of affected tasks]
- **Timeline impact:** [Delay estimate]
- **Severity:** Critical | High | Medium | Low

### Attempted Solutions
1. [What was tried]
   - Result: [Outcome]
2. [What was tried]
   - Result: [Outcome]

### Request
[Specific help or decision needed]

### Workaround Available?
[Yes/No] - [Description if yes]

### Timeline
- Blocker detected: [Time]
- Resolution needed by: [Time]
```

### 5. Quality Gates Implementation

```markdown
## Quality Gate Checkpoints

### After Each Task
```bash
# Quick validation script
npm run lint
npm run typecheck
npm run test -- --related
```

```markdown
Quality Checklist:
- [ ] Code compiles without errors
- [ ] Linting passes
- [ ] Relevant tests pass
- [ ] No console errors/warnings
- [ ] Self-review completed
```

### After Each Phase
```bash
# Phase validation script
npm run lint
npm run typecheck
npm run test
npm run build
```

```markdown
Phase Checklist:
- [ ] All phase tasks complete
- [ ] Full test suite passes
- [ ] Build succeeds
- [ ] No new TODO comments left
- [ ] Code reviewed
- [ ] Documentation updated
```

### Before Final Completion
```bash
# Final validation script
npm run lint
npm run typecheck
npm run test -- --coverage
npm run build
npm run e2e
```

```markdown
Completion Checklist:
- [ ] All planned tasks complete
- [ ] All tests pass (unit, integration, e2e)
- [ ] Coverage meets threshold
- [ ] Build succeeds
- [ ] Performance acceptable
- [ ] Documentation complete
- [ ] Reviewed and approved
- [ ] Ready for deployment
```

### 6. Deviation Handling

```markdown
## Handling Plan Deviations

### Types of Deviations

| Type | Example | Response |
|------|---------|----------|
| Scope Addition | New requirement discovered | Document, assess, negotiate |
| Scope Reduction | Feature not needed | Document, skip, update plan |
| Technical Change | Different approach needed | Assess impact, update plan |
| Estimate Change | Task taking longer | Report, adjust timeline |
| Dependency Change | Order needs to change | Resequence, update plan |

### Deviation Decision Tree

```
DEVIATION DETECTED
        │
        ├── Is it blocking progress?
        │   ├── YES → Immediate resolution needed
        │   │         └── Escalate if not resolvable
        │   └── NO → Document and continue
        │
        ├── Does it change scope?
        │   ├── YES → Stakeholder approval needed
        │   │         └── Update plan if approved
        │   └── NO → Proceed with adjustment
        │
        └── Does it change timeline?
            ├── YES → Report new estimate
            │         └── Negotiate if critical
            └── NO → Continue execution
```

### Deviation Documentation
```markdown
## Plan Deviation Record

### Original Plan
[What was originally planned]

### Deviation
[What actually happened/needs to happen]

### Reason
[Why the deviation occurred]

### Impact
- Timeline: [No change | +X hours/days]
- Scope: [No change | Added/Removed X]
- Quality: [No change | Trade-off made]

### Decision
[Approved/Rejected] by [Name] on [Date]

### Updated Plan
[Link to updated plan or inline changes]
```
```

## Use Cases

### Feature Implementation Execution

```markdown
## Execution Log: User Profile Feature

### Preparation (Day 1, 9:00 AM)
✅ Read plan completely
✅ Environment setup verified
✅ Dependencies checked (auth service deployed)
✅ Questions clarified with PM

### Task 1: Database Migration (9:30 AM - 10:00 AM)
**Status:** ✅ Complete

Actions:
1. Created migration file
2. Added profile fields to users table
3. Ran migration locally
4. Verified schema

Verification:
- ✅ Migration applies cleanly
- ✅ Rollback works
- ✅ No existing data affected

### Task 2: API Endpoint (10:00 AM - 11:30 AM)
**Status:** ✅ Complete

Actions:
1. Created ProfileController
2. Implemented GET /profile
3. Implemented PUT /profile
4. Added validation

Verification:
- ✅ Unit tests pass
- ✅ Tested with Postman
- ✅ Error cases handled

### Task 3: Frontend Form (11:30 AM - 12:30 PM)
**Status:** 🔄 In Progress

Blocker Encountered (12:00 PM):
- Issue: Form library version conflict
- Impact: 30 min delay
- Resolution: Upgraded to compatible version

### Lunch Break (12:30 PM - 1:30 PM)

### Task 3: Frontend Form (Continued) (1:30 PM - 2:30 PM)
**Status:** ✅ Complete

Verification:
- ✅ Form renders correctly
- ✅ Validation works
- ✅ Submit updates profile
- ✅ Error states display

### Task 4: Integration Tests (2:30 PM - 3:30 PM)
**Status:** ✅ Complete

### Phase 1 Quality Gate (3:30 PM)
- ✅ All tests pass
- ✅ Lint clean
- ✅ Build succeeds
- ✅ Self-review done

### Progress Report (3:30 PM)
```markdown
Completed: 4/6 tasks
In Progress: None
Remaining: 2 tasks (E2E, Documentation)
Blockers: None
ETA: On track for EOD
```

### Task 5 & 6: (3:30 PM - 5:00 PM)
[Continued execution...]

### Final Quality Gate (5:00 PM)
- ✅ All tasks complete
- ✅ All tests pass
- ✅ Documentation updated
- ✅ Ready for review

### Completion Summary
- Planned: 8 hours
- Actual: 7.5 hours
- Deviations: 1 (library upgrade)
- Learnings: Document library versions
```

## Best Practices

### Do's

- Read the entire plan before starting
- Verify understanding of each task
- Execute tasks in sequence unless parallel safe
- Validate after each task completion
- Report blockers immediately
- Document deviations as they occur
- Take notes for future reference
- Communicate progress regularly
- Ask questions early
- Complete fully before marking done

### Don'ts

- Don't skip the preparation phase
- Don't assume task requirements
- Don't ignore quality gates
- Don't hide blockers or delays
- Don't deviate without documenting
- Don't rush quality for speed
- Don't forget to update status
- Don't leave tasks partially done
- Don't skip testing steps
- Don't ignore learnings

## References

- [Getting Things Done - David Allen](https://gettingthingsdone.com/)
- [The Checklist Manifesto - Atul Gawande](http://atulgawande.com/book/the-checklist-manifesto/)
- [Agile Project Management](https://www.atlassian.com/agile/project-management)
- [Kanban Method](https://kanbanize.com/kanban-resources/getting-started/what-is-kanban)
