---
name: testing/security-hardening
description: Security hardening workflow with vulnerability assessment, penetration testing, and remediation
category: testing
complexity: high
agents:
  - security-auditor
  - vulnerability-scanner
  - tester
  - fullstack-developer
skills:
  - testing/security-testing
  - security/owasp
  - security/security-hardening
  - testing/comprehensive-testing
commands:
  - /quality:test-security
  - /security:scan
  - /quality:security-scan
tags:
  - security
  - testing
  - hardening
  - owasp
---

# Security Hardening Workflow

Comprehensive security testing and hardening workflow.

## Overview

This workflow provides systematic security assessment and hardening through:
1. Vulnerability scanning and assessment
2. Penetration testing simulation
3. Security test development
4. Remediation and verification

## Steps

1. **Inventory**: Identify assets, endpoints, and data flows
2. **Scan**: Run vulnerability and dependency scanning
3. **Test**: Execute OWASP Top 10 test suite
4. **Penetrate**: Simulate attacker perspective
5. **Remediate**: Fix vulnerabilities by severity
6. **Verify**: Re-run tests and confirm fixes
7. **Document**: Update security documentation

## Workflow Phases

### Phase 1: Asset Inventory
1. Identify all endpoints and entry points
2. Map authentication/authorization flows
3. Catalog sensitive data handling
4. Document third-party dependencies

### Phase 2: Vulnerability Assessment
1. Run dependency vulnerability scan
2. Perform static analysis (SAST)
3. Execute dynamic analysis (DAST)
4. Review security configurations

```bash
# Dependency scanning
npm audit
npx snyk test

# Static analysis
npx eslint --plugin security .

# Configuration review
npx audit-ci
```

### Phase 3: OWASP Top 10 Testing

#### A01: Injection
- SQL injection tests
- Command injection tests
- XSS tests
- YAML/XML injection tests

#### A02: Broken Authentication
- Password policy tests
- Session management tests
- Token validation tests
- Brute force protection tests

#### A03: Sensitive Data Exposure
- Encryption at rest tests
- Encryption in transit tests
- PII handling tests
- Secret exposure tests

#### A04: Access Control
- Horizontal escalation tests
- Vertical escalation tests
- Resource ownership tests
- CORS configuration tests

#### A05: Security Misconfiguration
- Default credential tests
- Debug mode tests
- Error handling tests
- Security header tests

#### A06: Vulnerable Components
- Dependency audit
- Known CVE checks
- Outdated package detection

#### A07: Auth Failures
- Login flow tests
- Password reset tests
- MFA bypass attempts
- Session fixation tests

#### A08: Data Integrity
- Input validation tests
- File upload tests
- Deserialization tests

#### A09: Logging Failures
- Audit log tests
- Log injection tests
- Sensitive data in logs tests

#### A10: SSRF
- URL validation tests
- Internal network access tests
- Redirect tests

### Phase 4: Penetration Testing
1. Simulate attacker perspective
2. Test attack chains
3. Verify defense in depth
4. Document exploitation paths

### Phase 5: Remediation
1. Prioritize by severity and exploitability
2. Develop fixes for each vulnerability
3. Write tests to prevent regression
4. Review and approve fixes

### Phase 6: Verification
1. Re-run all security tests
2. Verify fixes are effective
3. Ensure no new vulnerabilities
4. Update security documentation

## Severity Levels

| Level | Response Time | Examples |
|-------|---------------|----------|
| Critical | 24 hours | RCE, auth bypass, data breach |
| High | 1 week | SQL injection, XSS, CSRF |
| Medium | 1 month | Info disclosure, weak crypto |
| Low | Next release | Minor misconfigs, best practices |

## Security Headers Checklist

```
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=()
```

## Agent Responsibilities

| Agent | Responsibility |
|-------|----------------|
| security-auditor | Overall security assessment, OWASP review |
| vulnerability-scanner | Automated scanning, CVE detection |
| tester | Security test development |
| fullstack-developer | Remediation implementation |

## Quality Gates

- No critical vulnerabilities
- No high vulnerabilities in new code
- All OWASP categories tested
- Security headers configured
- Dependencies up to date
- Secrets not exposed

## Success Criteria

- All critical/high vulnerabilities resolved
- Security test suite comprehensive
- No regression in security posture
- Documentation updated
- Team security awareness increased
