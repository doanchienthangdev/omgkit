---
description: Penetration testing workflow
allowed-tools: Task, Read, Write, Edit, Bash, Grep, Glob
argument-hint: <target system>
---

# Penetration Testing Workflow

Pentest: **$ARGUMENTS**

## Workflow Steps

### Step 1: Reconnaissance
**Agent:** @security-auditor

- Gather information
- Map infrastructure
- Identify entry points
- Document findings

### Step 2: Vulnerability Analysis
**Agent:** @vulnerability-scanner

- Scan for vulnerabilities
- Identify misconfigurations
- Check for known CVEs
- Analyze attack vectors

### Step 3: Exploitation (Authorized Only)
**Agent:** @security-auditor

- Attempt authorized exploits
- Document successful attacks
- Measure impact
- Preserve evidence

### Step 4: Post-Exploitation
**Agent:** @security-auditor

- Assess access gained
- Identify lateral movement
- Document persistence risks
- Clean up artifacts

### Step 5: Reporting
**Agent:** @docs-manager

- Create detailed report
- Include proof of concepts
- Provide remediation steps
- Executive summary

## Progress Tracking
- [ ] Recon complete
- [ ] Vulnerabilities identified
- [ ] Testing complete
- [ ] Analysis done
- [ ] Report delivered

⚠️ Only for authorized testing contexts.
