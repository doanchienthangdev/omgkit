---
name: security-audit
description: Comprehensive security review
category: security
complexity: high
estimated-time: 4-8 hours
agents:
  - security-auditor
  - vulnerability-scanner
  - code-reviewer
  - fullstack-developer
  - docs-manager
skills:
  - owasp
  - security-hardening
  - defense-in-depth
commands:
  - /quality:security-scan
  - /dev:fix
  - /planning:doc
prerequisites:
  - Codebase accessible
  - Dependencies listed
---

# Security Audit Workflow

## Overview

The Security Audit workflow provides comprehensive security review including automated scanning, manual review, vulnerability remediation, and documentation.

## When to Use

- Before major releases
- After adding sensitive features
- Regular security checkups
- Compliance requirements
- After security incidents

## Steps

### Step 1: Automated Scanning
**Agent:** vulnerability-scanner
**Command:** `/quality:security-scan`
**Duration:** 30-60 minutes

Run automated scans:
- Dependency vulnerabilities
- Static code analysis
- Secret detection
- Configuration audit

**Output:** Scan results

### Step 2: Manual Review
**Agent:** security-auditor
**Duration:** 2-4 hours

Manual security review:
- OWASP Top 10 checklist
- Authentication review
- Authorization audit
- Data handling review
- API security check

**Output:** Manual review findings

### Step 3: Risk Assessment
**Agent:** security-auditor
**Duration:** 30-60 minutes

Assess risks:
- Prioritize findings
- Assess impact
- Rate severity
- Create remediation plan

**Output:** Risk assessment

### Step 4: Remediation
**Agent:** fullstack-developer
**Command:** `/dev:fix`
**Duration:** 1-4 hours

Fix vulnerabilities:
- Address critical issues
- Implement fixes
- Update configurations
- Add security controls

**Output:** Fixes implemented

### Step 5: Verification
**Agent:** security-auditor
**Duration:** 30-60 minutes

Verify fixes:
- Re-run scans
- Verify remediations
- Confirm no regressions
- Update status

**Output:** Verification report

### Step 6: Report Generation
**Agent:** docs-manager
**Command:** `/planning:doc`
**Duration:** 30-60 minutes

Generate report:
- Executive summary
- Detailed findings
- Remediation status
- Recommendations

**Output:** Security report

## Quality Gates

- [ ] All scans completed
- [ ] OWASP checklist reviewed
- [ ] Critical vulnerabilities fixed
- [ ] Fixes verified
- [ ] Report generated
- [ ] Stakeholders notified

## OWASP Top 10 Checklist

```
OWASP Top 10 (2021)
===================
[ ] A01: Broken Access Control
[ ] A02: Cryptographic Failures
[ ] A03: Injection
[ ] A04: Insecure Design
[ ] A05: Security Misconfiguration
[ ] A06: Vulnerable Components
[ ] A07: Authentication Failures
[ ] A08: Data Integrity Failures
[ ] A09: Logging/Monitoring Failures
[ ] A10: Server-Side Request Forgery
```

## Severity Levels

| Level | Description | SLA |
|-------|-------------|-----|
| Critical | Active exploit possible | 24 hours |
| High | Significant risk | 7 days |
| Medium | Moderate risk | 30 days |
| Low | Minor risk | 90 days |

## Tips

- Scan dependencies regularly
- Keep secrets out of code
- Use parameterized queries
- Implement proper auth
- Log security events
- Update dependencies

## Example Usage

```bash
# Full security audit
/workflow:security-audit

# Quick scan only
/quality:security-scan
```

## Related Workflows

- `penetration-testing` - For active testing
- `code-review` - For code quality
- `authentication` - For auth setup
