---
description: Comprehensive security audit with OWASP compliance check
allowed-tools: Task, Read, Grep, Glob
argument-hint: <application or system>
---

# 🛡️ Security Audit: $ARGUMENTS

Audit security for: **$ARGUMENTS**

## Agent
Uses **devsecops** agent for security audit.

## Audit Scope
- **Authentication** - Auth mechanisms
- **Authorization** - Access control
- **Data Protection** - Encryption, PII
- **Input Validation** - Injection prevention
- **Configuration** - Secure defaults

## OWASP Top 10 Check
1. Broken Access Control
2. Cryptographic Failures
3. Injection
4. Insecure Design
5. Security Misconfiguration
6. Vulnerable Components
7. Auth Failures
8. Data Integrity
9. Logging Failures
10. SSRF

## Workflow
1. **Scope** - Define audit boundaries
2. **Analyze** - Review code/config
3. **Test** - Security testing
4. **Findings** - Document issues
5. **Remediation** - Provide fixes

## Outputs
- Audit report
- OWASP compliance matrix
- Finding details with severity
- Remediation recommendations
- Security hardening guide

## Progress
- [ ] Scope defined
- [ ] Code analyzed
- [ ] Tests executed
- [ ] Findings documented
- [ ] Remediation planned

Include executive summary.
