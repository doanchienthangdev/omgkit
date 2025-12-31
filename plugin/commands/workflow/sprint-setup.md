---
description: Initialize and plan a new sprint
allowed-tools: Task, Read, Write, Edit, Bash, Grep, Glob
argument-hint: <sprint name>
---

# Sprint Setup Workflow

Setup sprint: **$ARGUMENTS**

## Workflow Steps

### Step 1: Vision Review
**Agent:** @sprint-master
**Command:** `/vision:show`

- Review product vision
- Check current progress
- Identify priorities
- Align with stakeholders

### Step 2: Backlog Grooming
**Agent:** @planner
**Command:** `/backlog:show`

- Review backlog items
- Estimate effort
- Prioritize by value
- Identify dependencies

### Step 3: Sprint Planning
**Agent:** @sprint-master
**Command:** `/sprint:new "$ARGUMENTS"`

- Select sprint items
- Define sprint goal
- Assign to agents
- Set capacity

### Step 4: Task Breakdown
**Agent:** @planner

- Break down stories
- Create implementation tasks
- Define acceptance criteria
- Identify risks

### Step 5: Kickoff
**Agent:** @sprint-master
**Command:** `/sprint:start`

- Communicate sprint goal
- Confirm assignments
- Set up tracking
- Start sprint

## Progress Tracking
- [ ] Vision reviewed
- [ ] Backlog groomed
- [ ] Sprint planned
- [ ] Tasks broken down
- [ ] Sprint started

Execute each step. Sprint ready to begin.
