---
name: api-design
description: Design RESTful or GraphQL APIs
category: api
complexity: medium
estimated-time: 2-6 hours
agents:
  - api-designer
  - planner
  - docs-manager
  - code-reviewer
skills:
  - backend/api-architecture
commands:
  - /planning:plan
  - /quality:api-gen
  - /planning:doc
  - /dev:review
prerequisites:
  - API requirements defined
  - Technology stack selected
---

# API Design Workflow

## Overview

The API Design workflow guides you through designing well-structured, documented, and consistent APIs following REST or GraphQL best practices.

## When to Use

- Creating new APIs
- Redesigning existing APIs
- Adding API endpoints
- Standardizing API patterns

## Steps

### Step 1: Requirements Analysis
**Agent:** planner
**Command:** `/planning:plan "API requirements"`
**Duration:** 30-60 minutes

Analyze requirements:
- Identify resources
- Define operations
- Specify data models
- Document constraints

**Output:** API requirements

### Step 2: API Design
**Agent:** api-designer
**Duration:** 1-2 hours

Design API:
- Resource design
- Endpoint structure
- Request/response formats
- Error handling

**Output:** API design document

### Step 3: OpenAPI Specification
**Agent:** api-designer
**Command:** `/quality:api-gen`
**Duration:** 30-60 minutes

Create specification:
- OpenAPI/Swagger spec
- Schema definitions
- Security schemes
- Example payloads

**Output:** OpenAPI spec

### Step 4: Design Review
**Agent:** code-reviewer
**Command:** `/dev:review`
**Duration:** 30-60 minutes

Review design:
- Consistency check
- Best practices
- Security review
- Performance considerations

**Output:** Review feedback

### Step 5: Documentation
**Agent:** docs-manager
**Command:** `/planning:doc`
**Duration:** 30-60 minutes

Generate docs:
- API reference
- Authentication guide
- Code examples
- Rate limits

**Output:** API documentation

### Step 6: Implementation Guidance
**Agent:** api-designer
**Duration:** 30-60 minutes

Create guidance:
- Implementation notes
- Testing strategy
- Versioning plan
- Deprecation policy

**Output:** Implementation guide

## Quality Gates

- [ ] Requirements documented
- [ ] API designed per standards
- [ ] OpenAPI spec complete
- [ ] Design reviewed
- [ ] Documentation generated
- [ ] Implementation guide ready

## REST Design Principles

```
REST API Best Practices
=======================
- Use nouns for resources
- HTTP verbs for actions
- Consistent naming
- Proper status codes
- HATEOAS where applicable
- Versioning strategy
- Pagination for lists
- Filtering and sorting
- Rate limiting
- Authentication/Authorization
```

## Example Usage

```bash
/workflow:api-design "user management API with CRUD and search"
/workflow:api-design "payment processing API with webhooks"
```

## Related Workflows

- `api-testing` - For testing APIs
- `full-feature` - For implementation
- `technical-docs` - For documentation
