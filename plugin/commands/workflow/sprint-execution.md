---
description: Execute sprint tasks with AI team
allowed-tools: Task, Read, Write, Edit, Bash, Grep, Glob
argument-hint: [optional focus area]
---

# Sprint Execution Workflow

Execute sprint: **$ARGUMENTS**

## Workflow Steps

### Step 1: Daily Standup
**Agent:** @sprint-master
**Command:** `/sprint:current`

- Review progress
- Identify blockers
- Plan day's work
- Adjust priorities

### Step 2: Task Execution
**Agent:** @fullstack-developer, @tester
**Command:** `/team:run`

- Work on sprint tasks
- Follow implementation plans
- Write tests
- Document progress

### Step 3: Code Review
**Agent:** @code-reviewer
**Command:** `/dev:review`

- Review completed work
- Provide feedback
- Ensure quality standards
- Approve changes

### Step 4: Integration
**Agent:** @git-manager
**Command:** `/git:commit`

- Commit changes
- Create PRs
- Merge approved work
- Update tracking

### Step 5: Progress Update
**Agent:** @sprint-master
**Command:** `/team:status`

- Update sprint board
- Track velocity
- Report progress
- Identify risks

## Progress Tracking
- [ ] Daily standup done
- [ ] Tasks in progress
- [ ] Reviews complete
- [ ] Code integrated
- [ ] Progress reported

Repeat daily. Track sprint burndown.
