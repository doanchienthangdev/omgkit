---
description: Develop APIs using contract-first methodology with consumer-driven contracts
triggers:
  - manual
  - api:new
agents:
  - api-designer
  - fullstack-developer
  - tester
---

# Contract-First Development Workflow

Design and implement APIs starting from contracts.

## Prerequisites
- [ ] Consumer requirements documented
- [ ] API style guide established
- [ ] Contract testing infrastructure

## Phase 1: Contract Design

### Step 1.1: Gather Consumer Needs
```yaml
agent: api-designer
action: gather_requirements
sources:
  - consumer_teams
  - existing_integrations
  - product_requirements
outputs:
  - consumer_expectations
  - use_case_scenarios
```

### Step 1.2: Draft Contract
```yaml
agent: api-designer
action: design
format: openapi_3.1
sections:
  - info
  - servers
  - paths
  - components
  - security
```

### Step 1.3: Review and Iterate
```yaml
agent: api-designer
action: review
with:
  - consumer_teams
  - security_team
  - platform_team
```

## Phase 2: Contract Validation

### Step 2.1: Generate Mock Server
```yaml
agent: fullstack-developer
action: generate_mock
from: openapi_spec
tools:
  - Prism
  - WireMock
  - MockServer
```

### Step 2.2: Consumer Testing
```yaml
agent: tester
action: test_against_mock
tests:
  - consumer_expectations
  - error_scenarios
  - edge_cases
```

## Phase 3: Provider Implementation

### Step 3.1: Generate Server Stubs
```yaml
agent: fullstack-developer
action: generate
from: openapi_spec
framework: framework_of_choice
```

### Step 3.2: Implement Handlers
```yaml
agent: fullstack-developer
action: implement
following:
  - contract_spec
  - business_rules
  - validation_requirements
```

## Phase 4: Contract Testing

### Step 4.1: Pact Contract Tests
```yaml
agent: tester
action: create_pact_tests
coverage:
  - all_endpoints
  - error_responses
  - edge_cases
```

### Step 4.2: Run Provider Verification
```yaml
agent: tester
action: verify_provider
using: pact_broker
reports:
  - verification_results
  - compatibility_matrix
```

## Phase 5: Documentation

### Step 5.1: Generate API Docs
```yaml
agent: api-designer
action: generate_docs
tools:
  - Redoc
  - Swagger UI
  - Stoplight
outputs:
  - interactive_docs
  - sdk_generation
```

## Outputs
- [ ] OpenAPI specification
- [ ] Mock server configuration
- [ ] Contract tests (Pact)
- [ ] Provider implementation
- [ ] API documentation

## Quality Gates
- Contract passes linting
- All consumer tests pass against mock
- Provider verifies all contracts
- Documentation is accurate
- Breaking changes detected
