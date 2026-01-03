---
name: testing/comprehensive-testing
description: Comprehensive Omega testing workflow covering all 4 dimensions - Accuracy, Performance, Security, and Accessibility
category: testing
complexity: high
agents:
  - tester
  - security-auditor
  - performance-engineer
  - code-reviewer
skills:
  - testing/comprehensive-testing
  - testing/property-testing
  - testing/mutation-testing
  - testing/security-testing
  - testing/performance-testing
commands:
  - /quality:test-omega
  - /quality:test-property
  - /quality:test-mutate
  - /quality:test-security
  - /quality:test-performance
tags:
  - testing
  - quality
  - omega
  - comprehensive
---

# Omega Testing Workflow

Comprehensive testing workflow that covers all 4 dimensions of software quality.

## Overview

This workflow orchestrates comprehensive testing across:
1. **Accuracy** - Correctness of functionality
2. **Performance** - Speed and resource efficiency
3. **Security** - Protection against vulnerabilities
4. **Accessibility** - Usability for all users

## Steps

1. **Plan**: Define testing dimensions and coverage targets
2. **Accuracy**: Run unit, integration, and E2E tests
3. **Performance**: Execute benchmarks and load tests
4. **Security**: Run OWASP and vulnerability tests
5. **Accessibility**: Check WCAG compliance
6. **Mutation**: Verify test quality with mutations
7. **Report**: Generate quality dashboard

## Workflow Phases

### Phase 1: Test Planning
1. Analyze codebase for testable components
2. Identify critical paths and risk areas
3. Define coverage targets per dimension
4. Establish SLAs and thresholds

### Phase 2: Accuracy Testing
1. Run unit tests with property-based tests
2. Execute integration tests
3. Run E2E tests for critical flows
4. Measure code coverage

### Phase 3: Performance Testing
1. Run benchmarks for key operations
2. Execute load tests for APIs
3. Perform memory leak detection
4. Compare against performance budget

### Phase 4: Security Testing
1. Run OWASP Top 10 tests
2. Execute injection tests
3. Verify authentication/authorization
4. Scan for vulnerabilities

### Phase 5: Accessibility Testing
1. Run WCAG compliance checks
2. Test keyboard navigation
3. Verify screen reader compatibility
4. Check color contrast and focus indicators

### Phase 6: Mutation Testing
1. Generate code mutations
2. Verify test quality
3. Identify weak assertions
4. Improve mutation score

### Phase 7: Reporting
1. Aggregate test results
2. Generate quality dashboard
3. Create action items for failures
4. Document lessons learned

## Quality Gates

| Dimension | Minimum | Target | Excellent |
|-----------|---------|--------|-----------|
| Unit Coverage | 80% | 90% | 95% |
| Integration Coverage | 60% | 75% | 85% |
| Performance SLA | Pass | <100ms p95 | <50ms p95 |
| Security | No critical | No high | No medium |
| Accessibility | AA | AAA partial | Full AAA |
| Mutation Score | 50% | 75% | 85% |

## Triggers

- Pre-commit (fast tests only)
- Pre-merge (full suite)
- Scheduled (comprehensive + performance)
- Release (all + security audit)

## Agent Responsibilities

| Agent | Responsibility |
|-------|----------------|
| tester | Unit, integration, E2E, property tests |
| security-auditor | Security tests, vulnerability scanning |
| performance-engineer | Benchmarks, load tests, profiling |
| code-reviewer | Test quality review, coverage analysis |

## Success Criteria

- All tests pass
- Coverage meets thresholds
- No security vulnerabilities
- Performance within SLAs
- Accessibility compliant
- Mutation score above threshold
