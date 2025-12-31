---
description: Safe database migration workflow
allowed-tools: Task, Read, Write, Edit, Bash, Grep, Glob
argument-hint: <migration description>
---

# Database Migration Workflow

Migration: **$ARGUMENTS**

## Workflow Steps

### Step 1: Change Analysis
**Agent:** @database-admin

- Analyze required changes
- Assess impact
- Identify risks
- Plan approach

### Step 2: Migration Design
**Agent:** @database-admin

- Design migration strategy
- Plan zero-downtime approach
- Create rollback plan
- Document steps

### Step 3: Migration Creation
**Agent:** @database-admin

- Write migration scripts
- Include rollback
- Add data transformations
- Test locally

### Step 4: Staging Test
**Agent:** @tester

- Run on staging
- Verify data integrity
- Test rollback
- Measure performance

### Step 5: Production Deploy
**Agent:** @database-admin

- Execute migration
- Monitor closely
- Verify success
- Document completion

## Progress Tracking
- [ ] Changes analyzed
- [ ] Migration designed
- [ ] Scripts created
- [ ] Staging tested
- [ ] Production deployed

Execute carefully. Data integrity is critical.
