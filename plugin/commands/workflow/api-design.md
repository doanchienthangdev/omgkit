---
description: Design RESTful or GraphQL APIs
allowed-tools: Task, Read, Write, Edit, Bash, Grep, Glob
argument-hint: <API description>
---

# API Design Workflow

Design API for: **$ARGUMENTS**

## Workflow Steps

### Step 1: Requirements
**Agent:** @api-designer

- Gather API requirements
- Identify consumers
- Define use cases
- Document constraints

### Step 2: Resource Design
**Agent:** @api-designer

- Define resources
- Design endpoints
- Plan versioning
- Document conventions

### Step 3: Schema Design
**Agent:** @api-designer
**Command:** `/quality:api-gen`

- Create OpenAPI spec
- Define request/response schemas
- Document error codes
- Add examples

### Step 4: Implementation
**Agent:** @fullstack-developer

- Implement endpoints
- Add validation
- Handle errors
- Write middleware

### Step 5: Documentation
**Agent:** @docs-manager

- Generate API docs
- Add usage examples
- Create SDKs
- Publish docs

## Progress Tracking
- [ ] Requirements gathered
- [ ] Resources designed
- [ ] Schemas defined
- [ ] Implemented
- [ ] Documented

Execute each step. Create developer-friendly API.
