---
description: Comprehensive security audit workflow
allowed-tools: Task, Read, Write, Edit, Bash, Grep, Glob
argument-hint: <scope of audit>
---

# Security Audit Workflow

Audit: **$ARGUMENTS**

## Workflow Steps

### Step 1: Scope Definition
**Agent:** @security-auditor

- Define audit scope
- Identify assets
- Map attack surface
- Set objectives

### Step 2: Vulnerability Scanning
**Agent:** @vulnerability-scanner
**Command:** `/quality:security-scan`

- Run automated scans
- Check dependencies
- Analyze code
- Identify issues

### Step 3: Manual Review
**Agent:** @security-auditor

- OWASP Top 10 review
- Authentication analysis
- Authorization checks
- Data handling review

### Step 4: Risk Assessment
**Agent:** @security-auditor

- Categorize vulnerabilities
- Assess impact
- Prioritize by risk
- Create remediation plan

### Step 5: Reporting
**Agent:** @docs-manager

- Create audit report
- Document findings
- Provide recommendations
- Track remediation

## Progress Tracking
- [ ] Scope defined
- [ ] Scans complete
- [ ] Manual review done
- [ ] Risks assessed
- [ ] Report generated

Execute thoroughly. Security is critical.
