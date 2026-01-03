---
name: /quality:test-omega
description: Run comprehensive 4-dimensional Omega testing covering accuracy, performance, security, and accessibility
category: quality
tags:
  - testing
  - omega
  - comprehensive
  - quality
---

# /quality:test-omega

Run comprehensive Omega testing across all 4 dimensions.

## Usage

```bash
/quality:test-omega
/quality:test-omega --dimension accuracy
/quality:test-omega --dimension security
/quality:test-omega --coverage 90
```

## Dimensions

### 1. Accuracy Testing
- Unit tests for individual functions
- Integration tests for component interactions
- End-to-end tests for user flows

### 2. Performance Testing
- Response time benchmarks
- Load testing under concurrency
- Memory usage analysis

### 3. Security Testing
- OWASP Top 10 coverage
- Input validation tests
- Authentication/authorization checks

### 4. Accessibility Testing
- WCAG 2.1 compliance
- Keyboard navigation
- Screen reader compatibility

## Output

Generates comprehensive test report with:
- Test counts per dimension
- Coverage metrics
- Performance SLAs
- Security findings
- Accessibility score

## Related

- testing/comprehensive-testing
- testing/property-testing
- testing/security-testing
- testing/performance-testing
