---
description: Run security scans including SAST, SCA, and secrets detection
allowed-tools: Task, Read, Bash, Grep, Glob
argument-hint: <path or scope>
---

# 🔒 Security Scan: $ARGUMENTS

Scan for vulnerabilities: **$ARGUMENTS**

## Agent
Uses **devsecops** agent for security scanning.

## Scan Types
- **SAST** - Static code analysis
- **SCA** - Dependency vulnerabilities
- **Secrets** - Credential detection
- **Container** - Image scanning
- **IaC** - Infrastructure as code

## Tools
- Semgrep (SAST)
- Snyk / Dependabot (SCA)
- TruffleHog / GitLeaks (Secrets)
- Trivy (Container)
- Checkov (IaC)

## Workflow
1. **Configure** - Set up scanners
2. **Execute** - Run all scans
3. **Aggregate** - Combine results
4. **Prioritize** - Rank by severity
5. **Report** - Generate findings

## Severity Levels
- 🔴 Critical - Fix immediately
- 🟠 High - Fix this sprint
- 🟡 Medium - Plan fix
- 🟢 Low - Track

## Outputs
- Vulnerability report
- CVE list with fixes
- Secret findings
- Compliance status
- Remediation plan

## Progress
- [ ] SAST complete
- [ ] SCA complete
- [ ] Secrets scanned
- [ ] Containers scanned
- [ ] Report generated

Fail on critical/high findings if --strict.
