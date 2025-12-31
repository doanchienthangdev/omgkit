---
name: schema-design
description: Design production-grade database schemas
category: database
complexity: medium
estimated-time: 2-8 hours
agents:
  - database-admin
  - planner
  - tester
skills:
  - database-schema-design
  - postgresql
  - mongodb
commands:
  - /planning:plan
  - /dev:feature
  - /dev:test
prerequisites:
  - Data requirements defined
  - Database type selected
---

# Schema Design Workflow

## Overview

The Schema Design workflow helps create well-structured, normalized, and performant database schemas with proper indexing and relationships.

## When to Use

- Starting new projects
- Adding new data models
- Redesigning data structures
- Optimizing existing schemas

## Steps

### Step 1: Requirements Gathering
**Agent:** planner
**Duration:** 30-60 minutes

Gather requirements:
- Entity identification
- Relationship mapping
- Data volume estimates
- Access patterns

**Output:** Data requirements

### Step 2: Entity-Relationship Design
**Agent:** database-admin
**Duration:** 1-2 hours

Design ER model:
- Entity definitions
- Relationships
- Cardinality
- Constraints

**Output:** ER diagram

### Step 3: Normalization
**Agent:** database-admin
**Duration:** 30-60 minutes

Normalize schema:
- Apply normal forms
- Eliminate redundancy
- Ensure data integrity
- Balance normalization vs performance

**Output:** Normalized schema

### Step 4: Index Design
**Agent:** database-admin
**Duration:** 30-60 minutes

Design indexes:
- Primary keys
- Foreign keys
- Query-based indexes
- Composite indexes

**Output:** Index strategy

### Step 5: Migration Creation
**Agent:** database-admin
**Duration:** 30-60 minutes

Create migrations:
- Write migration files
- Include rollback
- Test migrations
- Document changes

**Output:** Migration files

### Step 6: Validation
**Agent:** tester
**Command:** `/dev:test`
**Duration:** 30-60 minutes

Validate schema:
- Test migrations
- Verify constraints
- Check relationships
- Performance baseline

**Output:** Validation report

## Quality Gates

- [ ] Requirements documented
- [ ] ER diagram complete
- [ ] Schema normalized
- [ ] Indexes designed
- [ ] Migrations created
- [ ] Validation passed

## Schema Design Principles

```
Database Schema Principles
==========================
1. Single source of truth
2. Appropriate normalization
3. Proper data types
4. Meaningful naming
5. Consistent conventions
6. Performance-aware indexing
7. Referential integrity
8. Soft delete consideration
9. Audit trail support
10. Future extensibility
```

## Example Usage

```bash
/workflow:schema-design "e-commerce with users, products, orders"
/workflow:schema-design "multi-tenant SaaS application"
```

## Related Workflows

- `migration` - For schema changes
- `database-optimization` - For performance
