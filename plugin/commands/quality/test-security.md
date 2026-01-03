---
name: /quality:test-security
description: Run comprehensive security testing covering OWASP Top 10, injection prevention, and vulnerability scanning
category: quality
tags:
  - testing
  - security
  - owasp
  - vulnerabilities
---

# /quality:test-security

Run comprehensive security test suite.

## Usage

```bash
/quality:test-security
/quality:test-security --category injection
/quality:test-security --owasp A01
```

## Security Categories

### Injection Testing (OWASP A01)
- SQL injection payloads
- Command injection vectors
- XSS attack patterns
- YAML/XML injection

### Authentication (OWASP A02)
- Password complexity
- Session management
- Token validation
- Brute force protection

### Sensitive Data (OWASP A03)
- Data at rest encryption
- Data in transit protection
- PII handling
- Secret exposure

### Access Control (OWASP A04)
- Horizontal privilege escalation
- Vertical privilege escalation
- Resource ownership
- CORS configuration

### Security Configuration (OWASP A05)
- Default credentials
- Debug mode in production
- Stack trace exposure
- Security headers

## Options

| Option | Description | Default |
|--------|-------------|---------|
| --category | Specific category to test | All |
| --owasp | OWASP category (A01-A10) | All |
| --severity | Minimum severity | info |
| --fix | Auto-fix when possible | false |

## Output

- Vulnerability report with severity levels
- Remediation recommendations
- OWASP category mapping
- Compliance checklist

## Related

- testing/security-testing
- security/owasp
- security/vulnerability-scanning
