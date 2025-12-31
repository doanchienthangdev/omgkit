---
description: Design production-grade database schemas
allowed-tools: Task, Read, Write, Edit, Bash, Grep, Glob
argument-hint: <data model description>
---

# Schema Design Workflow

Design schema for: **$ARGUMENTS**

## Workflow Steps

### Step 1: Requirements Gathering
**Agent:** @planner

- Identify entities
- Map relationships
- Estimate data volumes
- Document access patterns

### Step 2: ER Design
**Agent:** @database-admin

- Create ER diagram
- Define attributes
- Set cardinality
- Document constraints

### Step 3: Normalization
**Agent:** @database-admin

- Apply normal forms (1NF, 2NF, 3NF)
- Eliminate redundancy
- Balance normalization vs performance
- Document decisions

### Step 4: Index Design
**Agent:** @database-admin

- Design primary keys
- Add foreign key indexes
- Create query-based indexes
- Plan composite indexes

### Step 5: Migration Creation
**Agent:** @database-admin

- Generate migration files
- Include rollback scripts
- Add seed data
- Test migrations

### Step 6: Validation
**Agent:** @tester
**Command:** `/dev:test`

- Run migrations
- Verify constraints
- Test relationships
- Baseline performance

## Progress Tracking
- [ ] Requirements documented
- [ ] ER diagram complete
- [ ] Schema normalized
- [ ] Indexes designed
- [ ] Migrations created
- [ ] Validation passed

Execute each step. Create production-ready schema.
