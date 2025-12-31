---
name: migration
description: Safe database migrations with rollback
category: database
complexity: high
estimated-time: 1-4 hours
agents:
  - database-admin
  - planner
  - tester
skills:
  - database-migration
commands:
  - /planning:plan
  - /dev:test
prerequisites:
  - Schema changes defined
  - Backup strategy ready
---

# Database Migration Workflow

## Overview

The Database Migration workflow ensures safe, zero-downtime database migrations with proper rollback capabilities.

## When to Use

- Schema changes required
- Data transformations
- Index modifications
- Constraint updates

## Steps

### Step 1: Migration Planning
**Agent:** planner
**Command:** `/planning:plan "migration"`
**Duration:** 30-60 minutes

Plan migration:
- Identify changes
- Assess impact
- Plan rollback
- Schedule execution

**Output:** Migration plan

### Step 2: Backup
**Agent:** database-admin
**Duration:** 15-30 minutes

Create backup:
- Full backup
- Verify backup
- Document state
- Test restore

**Output:** Backup completed

### Step 3: Migration Script
**Agent:** database-admin
**Duration:** 30-60 minutes

Write migration:
- Create migration file
- Write up migration
- Write down migration
- Add validation

**Output:** Migration script

### Step 4: Staging Test
**Agent:** tester
**Duration:** 30-60 minutes

Test in staging:
- Run migration
- Test application
- Verify data
- Test rollback

**Output:** Staging verified

### Step 5: Production Migration
**Agent:** database-admin
**Duration:** 15-60 minutes

Execute migration:
- Run migration
- Monitor progress
- Verify completion
- Update status

**Output:** Migration complete

### Step 6: Verification
**Agent:** tester
**Command:** `/dev:test`
**Duration:** 30-60 minutes

Verify migration:
- Application testing
- Data integrity
- Performance check
- Document completion

**Output:** Verification report

## Quality Gates

- [ ] Migration planned
- [ ] Backup verified
- [ ] Rollback tested
- [ ] Staging validated
- [ ] Production migrated
- [ ] Verification passed

## Migration Checklist

```
Migration Checklist
===================
PRE-MIGRATION:
[ ] Backup created and verified
[ ] Rollback script ready
[ ] Stakeholders notified
[ ] Maintenance window scheduled

MIGRATION:
[ ] Migration executed
[ ] Progress monitored
[ ] Errors handled
[ ] Completion verified

POST-MIGRATION:
[ ] Application tested
[ ] Data verified
[ ] Performance checked
[ ] Documentation updated
```

## Example Usage

```bash
/workflow:migration "add user preferences table"
/workflow:migration "split orders table for sharding"
```

## Related Workflows

- `schema-design` - For initial design
- `database-optimization` - For performance
