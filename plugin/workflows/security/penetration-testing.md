---
name: penetration-testing
description: Test security through attack simulation
category: security
complexity: very-high
estimated-time: 8-24 hours
agents:
  - security-auditor
  - vulnerability-scanner
  - researcher
skills:
  - owasp
  - defense-in-depth
  - security-hardening
commands:
  - /quality:security-scan
  - /planning:research
prerequisites:
  - Authorization obtained
  - Scope defined
  - Test environment ready
---

# Penetration Testing Workflow

## Overview

The Penetration Testing workflow simulates attacks to identify security weaknesses. It follows ethical hacking methodology with proper authorization.

## When to Use

- Compliance requirements
- Pre-production security validation
- Third-party security assessment
- After major architecture changes

## Steps

### Step 1: Scope Definition
**Agent:** security-auditor
**Duration:** 30-60 minutes

Define scope:
- Target systems
- Test boundaries
- Excluded areas
- Rules of engagement

**Output:** Scope document

### Step 2: Reconnaissance
**Agent:** vulnerability-scanner
**Duration:** 1-2 hours

Information gathering:
- Network mapping
- Service enumeration
- Technology fingerprinting
- Exposed endpoints

**Output:** Reconnaissance report

### Step 3: Vulnerability Analysis
**Agent:** vulnerability-scanner
**Command:** `/quality:security-scan`
**Duration:** 1-2 hours

Identify vulnerabilities:
- Automated scanning
- Manual probing
- Configuration review
- Authentication testing

**Output:** Vulnerability list

### Step 4: Exploitation
**Agent:** security-auditor
**Duration:** 2-4 hours

Attempt exploitation:
- Proof of concept attacks
- Privilege escalation
- Data access attempts
- Chained exploits

**Output:** Exploitation results

### Step 5: Post-Exploitation
**Agent:** security-auditor
**Duration:** 1-2 hours

Assess impact:
- Access level achieved
- Data exposure potential
- Lateral movement
- Persistence options

**Output:** Impact assessment

### Step 6: Reporting
**Agent:** security-auditor
**Duration:** 1-2 hours

Generate report:
- Executive summary
- Technical details
- Risk ratings
- Remediation guidance

**Output:** Penetration test report

## Quality Gates

- [ ] Authorization documented
- [ ] Scope clearly defined
- [ ] All tests completed
- [ ] Findings documented
- [ ] Remediation planned
- [ ] Report delivered

## Test Categories

```
Penetration Test Categories
===========================
- Network testing
- Web application testing
- API security testing
- Authentication testing
- Authorization testing
- Session management
- Input validation
- Business logic
- Client-side attacks
```

## Example Usage

```bash
# Full penetration test
/workflow:penetration-testing "web application scope"

# Focused test
/workflow:penetration-testing "API endpoints only"
```

## Related Workflows

- `security-audit` - For compliance audits
- `api-testing` - For API security
