# TESTING_QUALITY_GATES.md

Mandatory quality gates for all OMGKIT testing and development.

## Coverage Thresholds

| Metric | Minimum | Target | Excellent |
|--------|---------|--------|-----------|
| Statement Coverage | 80% | 90% | 95% |
| Branch Coverage | 75% | 85% | 90% |
| Function Coverage | 85% | 95% | 100% |
| Line Coverage | 80% | 90% | 95% |

## Mutation Testing

| Metric | Minimum | Target | Excellent |
|--------|---------|--------|-----------|
| Mutation Score | 50% | 75% | 85% |
| Killed Mutants | 50% | 75% | 85% |
| No Coverage | <10% | <5% | <2% |
| Timeouts | <5% | <2% | <1% |

## Performance SLAs

| Metric | Acceptable | Target | Excellent |
|--------|------------|--------|-----------|
| Unit Test (per test) | <10ms | <5ms | <1ms |
| Integration Test | <100ms | <50ms | <20ms |
| E2E Test | <5s | <2s | <1s |
| Full Test Suite | <60s | <30s | <15s |
| API Response (p50) | <100ms | <50ms | <20ms |
| API Response (p95) | <500ms | <200ms | <100ms |
| API Response (p99) | <1000ms | <500ms | <200ms |

## Security Requirements

| Level | Requirement | Action |
|-------|-------------|--------|
| Critical | 0 vulnerabilities | Block release |
| High | 0 vulnerabilities in new code | Block merge |
| Medium | Document and plan fix | Track in backlog |
| Low | Best effort | Optional |

### OWASP Top 10 Coverage

All applications must have tests for:
- [ ] A01: Injection prevention
- [ ] A02: Authentication security
- [ ] A03: Sensitive data protection
- [ ] A04: Access control
- [ ] A05: Security configuration
- [ ] A06: Component vulnerabilities
- [ ] A07: Authentication failures
- [ ] A08: Data integrity
- [ ] A09: Logging security
- [ ] A10: SSRF prevention

## Accessibility (WCAG 2.1)

| Level | Requirement | Components |
|-------|-------------|------------|
| A | Required | All user-facing |
| AA | Target | Production apps |
| AAA | Excellent | Critical paths |

## F.I.R.S.T. Principles

All tests MUST adhere to:

| Principle | Requirement |
|-----------|-------------|
| **F**ast | Unit tests < 10ms each |
| **I**ndependent | No test dependencies |
| **R**epeatable | Deterministic results |
| **S**elf-Validating | Clear pass/fail |
| **T**imely | Written with code |

## Test Categories

### Required Tests

| Category | Requirement |
|----------|-------------|
| Unit Tests | All pure functions |
| Integration Tests | All component interactions |
| Security Tests | All user input handlers |
| Property Tests | All data transformations |

### Recommended Tests

| Category | When to Use |
|----------|-------------|
| E2E Tests | Critical user flows |
| Performance Tests | Performance-critical code |
| Mutation Tests | Core business logic |
| Chaos Tests | Distributed systems |

## Before Release Checklist

### Must Pass

- [ ] All tests pass (no failures, no skipped)
- [ ] Coverage meets minimum thresholds
- [ ] No critical/high security vulnerabilities
- [ ] Performance within SLAs
- [ ] No type errors
- [ ] No lint errors

### Should Have

- [ ] Mutation score > 75%
- [ ] Accessibility AA compliant
- [ ] Documentation updated
- [ ] Changelog updated

### Nice to Have

- [ ] Mutation score > 85%
- [ ] Accessibility AAA compliant
- [ ] Performance budget maintained
- [ ] All medium vulnerabilities addressed

## Enforcement

### Pre-Commit

```bash
# Fast checks only
npm run lint
npm run test:unit
```

### Pre-Merge

```bash
# Full test suite
npm test
npm run test:security
npm run test:coverage
```

### Pre-Release

```bash
# Comprehensive testing
npm run test:omega
npm run test:mutation
npm run test:performance
npm audit
```

## Quality Gate Commands

```bash
# Run all quality gates
npm run test:omega

# Individual gates
npm run test:unit          # Unit tests
npm run test:integration   # Integration tests
npm run test:security      # Security tests
npm run test:property      # Property-based tests
npm run test:performance   # Performance benchmarks
npm run test:mutation      # Mutation testing
npm run test:coverage      # Coverage report
```

## Failure Handling

### Test Failure

1. Identify failing test
2. Reproduce locally
3. Fix issue or test
4. Verify all tests pass
5. Commit with fix

### Coverage Drop

1. Identify uncovered code
2. Write tests for new code
3. Verify coverage restored
4. Commit with tests

### Security Vulnerability

1. Assess severity
2. Create fix or workaround
3. Add regression test
4. Document in security log
5. Release patch if critical

## Continuous Improvement

- Review quality metrics weekly
- Increase thresholds quarterly
- Add new test categories as needed
- Remove flaky tests immediately
- Keep test suite fast
