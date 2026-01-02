---
name: api-testing
description: Comprehensive API testing
category: api
complexity: medium
estimated-time: 2-6 hours
agents:
  - tester
  - security-auditor
skills:
  - backend/api-architecture
  - security/owasp
commands:
  - /dev:test
  - /quality:security-scan
prerequisites:
  - API implemented
  - Test environment ready
---

# API Testing Workflow

## Overview

The API Testing workflow ensures comprehensive testing of APIs including functional, security, and performance testing.

## When to Use

- After API implementation
- Before releases
- Regression testing
- Performance validation

## Steps

### Step 1: Test Planning
**Agent:** tester
**Duration:** 30-60 minutes

Plan testing:
- Identify test cases
- Define coverage
- Setup test data
- Configure environment

**Output:** Test plan

### Step 2: Unit Testing
**Agent:** tester
**Duration:** 1-2 hours

Write unit tests:
- Handler tests
- Validation tests
- Business logic tests
- Error handling tests

**Output:** Unit tests

### Step 3: Integration Testing
**Agent:** tester
**Duration:** 1-2 hours

Write integration tests:
- End-to-end flows
- Database interactions
- External service mocks
- Authentication flows

**Output:** Integration tests

### Step 4: Security Testing
**Agent:** security-auditor
**Command:** `/quality:security-scan`
**Duration:** 30-60 minutes

Security tests:
- Authentication bypass
- Authorization checks
- Input validation
- Injection attempts

**Output:** Security test results

### Step 5: Performance Testing
**Agent:** tester
**Duration:** 30-60 minutes

Performance tests:
- Load testing
- Latency benchmarks
- Throughput tests
- Resource usage

**Output:** Performance report

### Step 6: Report Generation
**Agent:** tester
**Duration:** 30-60 minutes

Generate report:
- Coverage summary
- Test results
- Issues found
- Recommendations

**Output:** Test report

## Quality Gates

- [ ] Test plan complete
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Security tests passed
- [ ] Performance acceptable
- [ ] Report generated

## Test Coverage

```
API Test Coverage
=================
FUNCTIONAL:
- Happy path scenarios
- Error scenarios
- Edge cases
- Validation rules

SECURITY:
- Authentication
- Authorization
- Input validation
- Rate limiting

PERFORMANCE:
- Response time
- Throughput
- Scalability
- Resource usage
```

## Example Usage

```bash
/workflow:api-testing "user API endpoints"
/workflow:api-testing "payment API with security focus"
```

## Related Workflows

- `api-design` - For API design
- `security-audit` - For security focus
